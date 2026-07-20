import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkProductAvailability, fetchHtml, mapWithConcurrency } from "@/lib/product-monitor/availability";
import { discoverPartnerProducts } from "@/lib/product-monitor/partners";
import type { MonitorProduct, MonitorReport, ProductAvailabilityResult } from "@/lib/product-monitor/types";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function requireEnv(value: string | undefined, name: string) {
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

function metadataRecord(metadata: unknown): Record<string, unknown> {
  return metadata && typeof metadata === "object" && !Array.isArray(metadata)
    ? (metadata as Record<string, unknown>)
    : {};
}

function sourceUrlFromMetadata(metadata: Record<string, unknown>) {
  return typeof metadata.sourceUrl === "string"
    ? metadata.sourceUrl
    : typeof metadata.source_url === "string"
      ? metadata.source_url
      : null;
}

function previousValue(metadata: Record<string, unknown>, key: string) {
  return typeof metadata[key] === "string" ? metadata[key] : null;
}

async function loadProducts() {
  const db = createClient(requireEnv(supabaseUrl, "NEXT_PUBLIC_SUPABASE_URL"), requireEnv(serviceRoleKey, "SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await db
    .from("products")
    .select("id,slug,price_amount,currency_code,shop_visible,metadata,partners(slug,name),product_translations!inner(locale,name)")
    .eq("product_translations.locale", "en")
    .order("slug", { ascending: true });

  if (error) throw error;

  const products = (data || []).map((row: any): MonitorProduct => {
    const partner = Array.isArray(row.partners) ? row.partners[0] : row.partners;
    const translation = Array.isArray(row.product_translations) ? row.product_translations[0] : row.product_translations;
    const metadata = metadataRecord(row.metadata);
    return {
      id: row.id,
      slug: row.slug,
      partnerSlug: partner?.slug || null,
      partnerName: partner?.name || null,
      name: translation?.name || row.slug,
      priceAmount: row.price_amount == null ? null : Number(row.price_amount),
      currencyCode: row.currency_code || null,
      shopVisible: row.shop_visible ?? true,
      sourceUrl: sourceUrlFromMetadata(metadata),
      metadata,
      previousStatus: previousValue(metadata, "lastAvailabilityStatus"),
      previousPriceText: previousValue(metadata, "lastAvailabilityPriceText"),
    };
  });

  return { db, products };
}

function changedResult(
  product: MonitorProduct,
  result: ProductAvailabilityResult,
): MonitorReport["statusChanges"][number] | null {
  if (!product.previousStatus && !product.previousPriceText) return null;
  const statusChanged = product.previousStatus !== result.status;
  const priceChanged = Boolean(result.priceText && product.previousPriceText && product.previousPriceText !== result.priceText);
  if (!statusChanged && !priceChanged) return null;
  return {
    slug: product.slug,
    name: product.name,
    sourceUrl: result.sourceUrl,
    previousStatus: product.previousStatus,
    status: result.status,
    previousPriceText: product.previousPriceText,
    priceText: result.priceText,
  };
}

async function persistReport(
  db: any,
  products: MonitorProduct[],
  results: ProductAvailabilityResult[],
  report: MonitorReport,
) {
  const productBySlug = new Map(products.map((product) => [product.slug, product]));
  const checkedAt = report.checkedAt;

  for (const result of results) {
    const product = productBySlug.get(result.slug);
    if (!product) continue;
    await db
      .from("products")
      .update({
        metadata: {
          ...product.metadata,
          sourceUrl: result.sourceUrl || product.sourceUrl,
          lastAvailabilityStatus: result.status,
          lastAvailabilityHttpStatus: result.httpStatus,
          lastAvailabilityPriceText: result.priceText,
          lastAvailabilityError: result.error,
          lastAvailabilityCheckedAt: checkedAt,
        },
      })
      .eq("slug", product.slug);
  }

  if (report.newProducts.length > 0) {
    const { error } = await db.from("product_monitor_discoveries").upsert(
      report.newProducts.map((item) => ({
        partner_slug: item.partnerSlug,
        partner_name: item.partnerName,
        source_url: item.sourceUrl,
        title: item.title,
        price_text: item.priceText,
        image_url: item.imageUrl,
        raw: item,
        last_seen_at: checkedAt,
      })),
      { onConflict: "source_url" },
    );
    if (error) console.error("Product monitor discovery persistence failed", error);
  }

  const { error } = await db.from("product_monitor_runs").insert({
    checked_count: report.checkedCount,
    missing_source_count: report.missingSourceCount,
    unavailable_count: report.unavailable.length,
    out_of_stock_count: report.outOfStock.length,
    status_change_count: report.statusChanges.length,
    new_product_count: report.newProducts.length,
    error_count: report.errors.length,
    report,
  });
  if (error) console.error("Product monitor run persistence failed", error);
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expectedSecret = process.env.CRON_SECRET;
  if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const searchParams = new URL(request.url).searchParams;
  const dryRun = searchParams.get("dryRun") === "1";
  const skipDiscovery = dryRun && searchParams.get("skipDiscovery") === "1";
  const limit = dryRun ? Number(searchParams.get("limit") || 0) : 0;
  const { db, products: loadedProducts } = await loadProducts();
  const products = limit > 0 ? loadedProducts.slice(0, limit) : loadedProducts;
  const sourceUrls = new Set(products.map((product) => product.sourceUrl).filter((url): url is string => Boolean(url)));
  const checkedAt = new Date().toISOString();

  const results = await mapWithConcurrency(products, 8, (product) => checkProductAvailability(product));
  const productBySlug = new Map(products.map((product) => [product.slug, product]));
  const unavailable = results.filter((item) => item.status === "unavailable");
  const outOfStock = results.filter((item) => item.status === "out_of_stock");
  const errors = results.filter((item) => item.error);
  const missingSourceCount = results.filter((item) => item.status === "missing_source").length;
  const statusChanges = results
    .map((result) => {
      const product = productBySlug.get(result.slug);
      return product ? changedResult(product, result) : null;
    })
    .filter((item): item is MonitorReport["statusChanges"][number] => Boolean(item));

  const discovered = skipDiscovery ? [] : await discoverPartnerProducts(async (url) => (await fetchHtml(url, 15000)).html);
  const newProducts = discovered.filter((item) => !sourceUrls.has(item.sourceUrl));

  const report: MonitorReport = {
    checkedAt,
    checkedCount: products.length,
    missingSourceCount,
    unavailable,
    outOfStock,
    statusChanges,
    errors,
    newProducts,
  };

  if (!dryRun) {
    await persistReport(db, products, results, report);
  }

  return NextResponse.json({
    ok: true,
    dryRun,
    delivery: dryRun ? "not_sent" : "stored_in_supabase",
    summary: {
      checkedCount: report.checkedCount,
      missingSourceCount: report.missingSourceCount,
      unavailableCount: report.unavailable.length,
      outOfStockCount: report.outOfStock.length,
      statusChangeCount: report.statusChanges.length,
      newProductCount: report.newProducts.length,
      errorCount: report.errors.length,
    },
  });
}
