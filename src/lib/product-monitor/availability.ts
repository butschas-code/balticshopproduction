import type { MonitorProduct, ProductAvailabilityResult } from "@/lib/product-monitor/types";

const OUT_OF_STOCK_PATTERNS = [
  /\bout of stock\b/i,
  /\bsold out\b/i,
  /\bunavailable\b/i,
  /\bnot available\b/i,
  /\bizp[aā]rdots\b/i,
  /\bnav pieejams\b/i,
  /\bnicht verfügbar\b/i,
  /\bausverkauft\b/i,
];

export async function fetchHtml(url: string, timeoutMs = 12000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      cache: "no-store",
      redirect: "follow",
      headers: {
        "user-agent": "BalticsProducts product monitor (+https://balticsproducts.vercel.app)",
        accept: "text/html,application/xhtml+xml",
      },
      signal: controller.signal,
    });
    const html = await response.text();
    return { response, html };
  } finally {
    clearTimeout(timeout);
  }
}

function extractPriceText(html: string) {
  const jsonLdPrice =
    html.match(/"price"\s*:\s*"([^"]+)"/i)?.[1] ||
    html.match(/"price"\s*:\s*(\d+(?:\.\d+)?)/i)?.[1];
  if (jsonLdPrice) return jsonLdPrice;
  return html.match(/(?:€|EUR)\s?\d+(?:[.,]\d{1,2})?|\d+(?:[.,]\d{1,2})?\s?(?:€|EUR)/i)?.[0] || null;
}

function readableText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .slice(0, 8000);
}

export async function checkProductAvailability(product: MonitorProduct): Promise<ProductAvailabilityResult> {
  if (!product.sourceUrl) {
    return {
      slug: product.slug,
      sourceUrl: null,
      status: "missing_source",
      httpStatus: null,
      priceText: null,
      error: null,
    };
  }

  try {
    const { response, html } = await fetchHtml(product.sourceUrl);
    const text = readableText(html);
    const outOfStock = OUT_OF_STOCK_PATTERNS.some((pattern) => pattern.test(text));
    const status =
      response.status === 404 || response.status === 410
        ? "unavailable"
        : response.ok && outOfStock
          ? "out_of_stock"
          : response.ok
            ? "available"
            : "unknown";

    return {
      slug: product.slug,
      sourceUrl: product.sourceUrl,
      status,
      httpStatus: response.status,
      priceText: extractPriceText(html),
      error: null,
    };
  } catch (error) {
    return {
      slug: product.slug,
      sourceUrl: product.sourceUrl,
      status: "unknown",
      httpStatus: null,
      priceText: null,
      error: error instanceof Error ? error.message : "Unknown fetch error",
    };
  }
}

export async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  mapper: (item: T, index: number) => Promise<R>,
) {
  const results = new Array<R>(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await mapper(items[index], index);
    }
  });
  await Promise.all(workers);
  return results;
}
