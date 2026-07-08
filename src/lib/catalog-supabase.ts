import { createClient } from "@supabase/supabase-js";
import { resolveAssetUrl, resolveAssetUrls } from "@/lib/assets";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables.");
}

const db = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

type Locale = "en" | "de";

export type CatalogArtisan = {
  slug: string;
  name: string;
  location: string;
  craft: string;
  bio: string;
  portrait: string;
  workshopImages: string[];
  isPartner: boolean;
};

export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  story: string;
  craft: string;
  materials: string;
  technique: string;
  price: string;
  image: string;
  images: string[];
  artisanSlug: string;
  artisanName: string;
  location: string;
  details: { label: string; value: string }[];
  priceAmount: number | null;
  currencyCode: string;
  collectionSlug?: string | null;
  productType?: string | null;
  isFeatured?: boolean;
  shopVisible?: boolean;
  shopRank?: number;
};

function formatPrice(priceAmount: number | null, currencyCode: string | null): string {
  if (priceAmount == null) return "€ —";
  const currency = currencyCode || "EUR";
  const symbol = currency === "EUR" ? "€" : currency;
  return `${symbol} ${Number(priceAmount).toFixed(2)}`;
}

function fallbackText(text: string | null | undefined, fallback: string) {
  const value = (text || "").trim();
  return value || fallback;
}

export async function getCatalogArtisans(locale: Locale): Promise<CatalogArtisan[]> {
  const { data, error } = await db
    .from("artisans")
    .select("slug,name,location,craft,craft_de,bio,bio_de,portrait_url,workshop_images,is_partner")
    .order("name", { ascending: true });

  if (error) throw error;

  return (data || []).map((artisan) => ({
    slug: artisan.slug,
    name: artisan.name,
    location: artisan.location || "Latvia",
    craft: locale === "de" ? fallbackText(artisan.craft_de, artisan.craft || "Handwerk") : fallbackText(artisan.craft, "Craft"),
    bio: locale === "de" ? fallbackText(artisan.bio_de, artisan.bio || "") : fallbackText(artisan.bio, ""),
    portrait: resolveAssetUrl(artisan.portrait_url),
    workshopImages: resolveAssetUrls(Array.isArray(artisan.workshop_images) ? artisan.workshop_images : []),
    isPartner: Boolean(artisan.is_partner),
  }));
}

export async function getCatalogProducts(locale: Locale): Promise<CatalogProduct[]> {
  const extendedSelect = `
      id,
      slug,
      artisan_name,
      location,
      price_amount,
      currency_code,
      image_url,
      details,
      collection_slug,
      product_type,
      is_featured,
      shop_visible,
      shop_rank,
      artisans(slug),
      product_images(image_url,position),
      product_translations!inner(locale,name,description,story,craft,materials,technique)
    `;

  const basicSelect = `
      id,
      slug,
      artisan_name,
      location,
      price_amount,
      currency_code,
      image_url,
      details,
      artisans(slug),
      product_images(image_url,position),
      product_translations!inner(locale,name,description,story,craft,materials,technique)
    `;

  let data: any[] | null = null;
  let error: { message?: string } | null = null;

  ({ data, error } = await db
    .from("products")
    .select(extendedSelect)
    .eq("product_translations.locale", locale)
    .order("slug", { ascending: true }));

  if (error?.message?.includes("collection_slug") || error?.message?.includes("product_type")) {
    ({ data, error } = await db
      .from("products")
      .select(basicSelect)
      .eq("product_translations.locale", locale)
      .order("slug", { ascending: true }));
  }

  if (error) throw error;

  return (data || []).map((row: any) => {
    const tr = Array.isArray(row.product_translations) ? row.product_translations[0] : row.product_translations;
    const images = Array.isArray(row.product_images)
      ? [...row.product_images]
          .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
          .map((img) => resolveAssetUrl(img.image_url))
          .filter(Boolean)
      : [];

    const detailsRaw = Array.isArray(row.details) ? row.details : [];
    const details = detailsRaw.map((d: any) => ({
      label: fallbackText(d?.label, "Detail"),
      value: fallbackText(d?.value, ""),
    }));

    return {
      slug: row.slug,
      id: row.id,
      name: fallbackText(tr?.name, "Handcrafted object"),
      description: fallbackText(tr?.description, "Handcrafted product from Baltic artisans."),
      story: fallbackText(tr?.story, tr?.description || ""),
      craft: fallbackText(tr?.craft, "Craft"),
      materials: fallbackText(tr?.materials, "Natural materials"),
      technique: fallbackText(tr?.technique, "Traditional craftsmanship"),
      price: formatPrice(row.price_amount, row.currency_code),
      image: resolveAssetUrl(row.image_url || images[0] || ""),
      images,
      artisanSlug: row.artisans?.slug || "",
      artisanName: fallbackText(row.artisan_name, "Baltic Artisan"),
      location: fallbackText(row.location, "Latvia"),
      details,
      priceAmount: row.price_amount == null ? null : Number(row.price_amount),
      currencyCode: row.currency_code || "EUR",
      collectionSlug: row.collection_slug || null,
      productType: row.product_type || null,
      isFeatured: Boolean(row.is_featured),
      shopVisible: row.shop_visible ?? true,
      shopRank: row.shop_rank ?? 1000,
    };
  });
}

export async function getCatalogProductBySlug(slug: string, locale: Locale): Promise<CatalogProduct | null> {
  const items = await getCatalogProducts(locale);
  return items.find((item) => item.slug === slug) || null;
}

export async function getCatalogArtisanBySlug(slug: string, locale: Locale): Promise<CatalogArtisan | null> {
  const artisans = await getCatalogArtisans(locale);
  return artisans.find((artisan) => artisan.slug === slug) || null;
}

export async function getCatalogProductsByArtisan(artisanSlug: string, locale: Locale): Promise<CatalogProduct[]> {
  const products = await getCatalogProducts(locale);
  return products.filter((product) => product.artisanSlug === artisanSlug);
}
