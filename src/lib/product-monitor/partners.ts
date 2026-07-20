import type { DiscoveredProduct } from "@/lib/product-monitor/types";

type PartnerMonitorConfig = {
  slug: string;
  name: string;
  discoveryUrls: string[];
  productPathHints: string[];
  excludePathHints?: string[];
};

const PARTNERS: PartnerMonitorConfig[] = [
  {
    slug: "studio-natural",
    name: "Studio Natural",
    discoveryUrls: ["https://www.studionatural.lv/shop"],
    productPathHints: ["/product-page/", "/shop/"],
  },
  {
    slug: "raibi-koki",
    name: "Raibi Koki",
    discoveryUrls: ["https://raibikoki.lv"],
    productPathHints: ["/produkts/", "/product/", "/veikals/"],
  },
  {
    slug: "latvijas-labumu-tirgus-mals",
    name: "Latvijas Labumu Tirgus: Māls",
    discoveryUrls: ["https://www.latvijaslabumstirgus.lv/lv/prechu-katalogs/keramika/mals/"],
    productPathHints: ["/lv/prechu-katalogs/"],
    excludePathHints: ["/keramika/mals"],
  },
  {
    slug: "cerannic",
    name: "cerannic",
    discoveryUrls: ["https://www.cerannic.com/veikals/"],
    productPathHints: ["/product-page/", "/veikals/"],
  },
  {
    slug: "cepli",
    name: "Cepļi",
    discoveryUrls: ["https://www.cepli.lv/veikals"],
    productPathHints: ["/product-page/", "/veikals/"],
  },
  {
    slug: "vaidava-ceramics",
    name: "VAIDAVA CERAMICS",
    discoveryUrls: ["https://vaidava.com/collections/all"],
    productPathHints: ["/products/"],
  },
  {
    slug: "pinumu-pasaule",
    name: "Pinumu Pasaule",
    discoveryUrls: ["https://www.pinumupasaule.lv/veikals?lang=en"],
    productPathHints: ["/product-page/"],
  },
];

function absoluteUrl(href: string, baseUrl: string) {
  try {
    return new URL(href, baseUrl).toString().replace(/#.*$/, "");
  } catch {
    return null;
  }
}

function normalizedUrl(url: string) {
  const parsed = new URL(url);
  parsed.hash = "";
  if (parsed.pathname.length > 1) {
    parsed.pathname = parsed.pathname.replace(/\/+$/, "");
  }
  return parsed.toString();
}

function likelyProductUrl(url: string, config: PartnerMonitorConfig) {
  const parsed = new URL(url);
  const path = parsed.pathname.toLowerCase();
  if ((config.excludePathHints || []).some((hint) => path === hint.toLowerCase() || path.endsWith(hint.toLowerCase()))) {
    return false;
  }
  return config.productPathHints.some((hint) => path.includes(hint.toLowerCase()));
}

function titleNearLink(html: string, href: string) {
  const escaped = href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = html.match(new RegExp(`<a[^>]+href=["']${escaped}["'][^>]*>([\\s\\S]{0,300}?)<\\/a>`, "i"));
  if (!match) return null;
  return match[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() || null;
}

function priceNearUrl(html: string, url: string) {
  const marker = url.split("/").filter(Boolean).pop();
  const index = marker ? html.indexOf(marker) : -1;
  const sample = index >= 0 ? html.slice(Math.max(0, index - 1200), index + 2200) : html;
  return sample.match(/(?:€|EUR)\s?\d+(?:[.,]\d{1,2})?|\d+(?:[.,]\d{1,2})?\s?(?:€|EUR)/i)?.[0] || null;
}

function imageNearUrl(html: string, url: string) {
  const marker = url.split("/").filter(Boolean).pop();
  const index = marker ? html.indexOf(marker) : -1;
  const sample = index >= 0 ? html.slice(Math.max(0, index - 2500), index + 3500) : html;
  const src = sample.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1];
  return src ? absoluteUrl(src, url) : null;
}

export async function discoverPartnerProducts(fetchHtml: (url: string) => Promise<string>) {
  const discoveries: DiscoveredProduct[] = [];
  const seen = new Set<string>();

  for (const partner of PARTNERS) {
    for (const discoveryUrl of partner.discoveryUrls) {
      let html = "";
      try {
        html = await fetchHtml(discoveryUrl);
      } catch {
        continue;
      }

      const links = html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi);
      for (const link of links) {
        const url = absoluteUrl(link[1], discoveryUrl);
        if (!url) continue;
        const normalized = normalizedUrl(url);
        if (seen.has(normalized) || !likelyProductUrl(normalized, partner)) continue;
        seen.add(normalized);
        discoveries.push({
          partnerSlug: partner.slug,
          partnerName: partner.name,
          title: titleNearLink(html, link[1]),
          sourceUrl: normalized,
          priceText: priceNearUrl(html, normalized),
          imageUrl: imageNearUrl(html, normalized),
        });
      }
    }
  }

  return discoveries;
}
