import type { CatalogArtisan, CatalogProduct } from "@/lib/catalog-supabase";

type CategoryKey = "linen" | "woodcraft" | "ceramics" | "baskets";

const CATEGORY_RULES: Record<
  CategoryKey,
  { artisanSlugs: string[]; preferredProductSlugs: string[] }
> = {
  linen: {
    artisanSlugs: ["studio-natural"],
    preferredProductSlugs: [
      "studio-natural-british-style-linen-coat",
      "studio-natural-boucle-linen-throw-in-black-160x220-cm",
      "studio-natural-dev-crumpled-linen-shirt-jura",
    ],
  },
  woodcraft: {
    artisanSlugs: ["raibi-koki"],
    preferredProductSlugs: [
      "raibi-koki-lielais-raibis-43x27-cm",
      "raibi-koki-galda-sp-le-marble-solitaire",
      "raibi-koki-triskrasu-40x26-cm",
    ],
  },
  ceramics: {
    artisanSlugs: ["vaidava-ceramics", "cepli", "cerannic", "latvijas-labumu-tirgus-mals"],
    preferredProductSlugs: [
      "vaidava-ceramics-espresso-cup-set-eclipse",
      "vaidava-ceramics-big-plate-earth",
      "cepli-tejas-trauku-komplekts-tejkanna-04l-tejas-pialas-2-gb",
    ],
  },
  baskets: {
    artisanSlugs: ["pinumu-pasaule"],
    preferredProductSlugs: [
      "pinumu-pasaule-ag1-avizu-grozs",
      "pinumu-pasaule-cg1-celojuma-grozs",
      "pinumu-pasaule-ig13-iepirkumu-grozs",
    ],
  },
};

const SIGNATURE_PRODUCT_PRIORITY = [
  "vaidava-ceramics-espresso-cup-set-eclipse",
  "cepli-tejas-trauku-komplekts-tejkanna-04l-tejas-pialas-2-gb",
  "cerannic-porcel-na-pl-ksn-te",
  "latvijas-labumu-tirgus-mals-aug-u-vis-ar-ginka-lapu-mot-vu",
  "studio-natural-british-style-linen-coat",
  "studio-natural-dev-crumpled-linen-shirt-jura",
  "raibi-koki-lielais-raibis-43x27-cm",
  "pinumu-pasaule-ag1-avizu-grozs",
];

function collectReservedImageUrls(artisans: CatalogArtisan[], products: CatalogProduct[]) {
  const reserved = new Set<string>();
  for (const artisan of artisans) {
    if (artisan.portrait) reserved.add(artisan.portrait);
    for (const image of artisan.workshopImages || []) {
      if (image) reserved.add(image);
    }
  }

  // Keep category tiles off any image already used for artisan identity.
  for (const artisan of artisans) {
    if (!artisan.portrait) continue;
    for (const product of products.filter((item) => item.artisanSlug === artisan.slug)) {
      if (product.image === artisan.portrait) reserved.add(product.image);
    }
  }

  return reserved;
}

function pickProductImage(
  products: CatalogProduct[],
  predicate: (product: CatalogProduct) => boolean,
  reserved: Set<string>,
  preferredSlugs: string[] = [],
) {
  for (const slug of preferredSlugs) {
    const preferred = products.find((product) => product.slug === slug && product.image);
    if (preferred?.image && !reserved.has(preferred.image)) {
      reserved.add(preferred.image);
      return preferred.image;
    }
  }

  for (const product of products) {
    if (!predicate(product) || !product.image || reserved.has(product.image)) continue;
    reserved.add(product.image);
    return product.image;
  }

  return products.find(predicate)?.image;
}

function productVisualScore(product: CatalogProduct) {
  const signatureIndex = SIGNATURE_PRODUCT_PRIORITY.indexOf(product.slug);
  let score = signatureIndex === -1 ? 10_000 : signatureIndex * 100;
  if (!product.image) score += 50_000;
  if (!product.isFeatured) score += 2_000;
  score += product.shopRank ?? 1000;
  return score;
}

export function buildHomepageCategoryImages(
  artisans: CatalogArtisan[],
  products: CatalogProduct[],
): Record<CategoryKey, string | undefined> {
  const reserved = collectReservedImageUrls(artisans, products);

  return {
    linen: pickProductImage(
      products,
      (product) => CATEGORY_RULES.linen.artisanSlugs.includes(product.artisanSlug),
      reserved,
      CATEGORY_RULES.linen.preferredProductSlugs,
    ),
    woodcraft: pickProductImage(
      products,
      (product) => CATEGORY_RULES.woodcraft.artisanSlugs.includes(product.artisanSlug),
      reserved,
      CATEGORY_RULES.woodcraft.preferredProductSlugs,
    ),
    ceramics: pickProductImage(
      products,
      (product) => CATEGORY_RULES.ceramics.artisanSlugs.includes(product.artisanSlug),
      reserved,
      CATEGORY_RULES.ceramics.preferredProductSlugs,
    ),
    baskets: pickProductImage(
      products,
      (product) => CATEGORY_RULES.baskets.artisanSlugs.includes(product.artisanSlug),
      reserved,
      CATEGORY_RULES.baskets.preferredProductSlugs,
    ),
  };
}

export function buildSignatureProducts(
  artisans: CatalogArtisan[],
  products: CatalogProduct[],
  limit = 6,
  reservedImages: string[] = [],
) {
  const reserved = collectReservedImageUrls(artisans, products);
  for (const image of reservedImages) {
    if (image) reserved.add(image);
  }
  const artisanOrder = new Map(artisans.map((artisan, index) => [artisan.slug, index]));
  const usedArtisans = new Set<string>();
  const usedImages = new Set<string>();

  const candidates = products
    .filter((product) => artisanOrder.has(product.artisanSlug) && product.shopVisible !== false && product.image)
    .sort((a, b) => {
      const artisanDiff = (artisanOrder.get(a.artisanSlug) ?? 999) - (artisanOrder.get(b.artisanSlug) ?? 999);
      if (artisanDiff !== 0 && productVisualScore(a) >= 10_000 && productVisualScore(b) >= 10_000) return artisanDiff;
      return productVisualScore(a) - productVisualScore(b) || a.name.localeCompare(b.name);
    });

  const picks: CatalogProduct[] = [];

  for (const product of candidates) {
    if (picks.length >= limit) break;
    if (usedArtisans.has(product.artisanSlug)) continue;
    if (reserved.has(product.image) || usedImages.has(product.image)) continue;
    picks.push(product);
    usedArtisans.add(product.artisanSlug);
    usedImages.add(product.image);
  }

  for (const product of candidates) {
    if (picks.length >= limit) break;
    if (picks.some((item) => item.slug === product.slug)) continue;
    if (reserved.has(product.image) || usedImages.has(product.image)) continue;
    picks.push(product);
    usedImages.add(product.image);
  }

  return picks;
}
