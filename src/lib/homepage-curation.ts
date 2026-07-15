import type { CatalogArtisan, CatalogProduct } from "@/lib/catalog-supabase";

type CategoryKey = "linen" | "woodcraft" | "ceramics" | "baskets";

const CATEGORY_RULES: Record<
  CategoryKey,
  { artisanSlugs: string[]; preferredProductSlugs: string[] }
> = {
  linen: {
    artisanSlugs: ["studio-natural"],
    preferredProductSlugs: [],
  },
  woodcraft: {
    artisanSlugs: ["raibi-koki"],
    preferredProductSlugs: ["raibi-koki-lielais-raibis-43x27-cm"],
  },
  ceramics: {
    artisanSlugs: ["vaidava-ceramics", "cepli", "cerannic", "latvijas-labumu-tirgus-mals"],
    preferredProductSlugs: ["vaidava-ceramics-plant-pot-with-saucer-s-soil", "cepli-zupas-zirnu-bloda"],
  },
  baskets: {
    artisanSlugs: ["pinumu-pasaule"],
    preferredProductSlugs: ["pinumu-pasaule-kg34-senu-grozs", "pinumu-pasaule-ig14-iepirkumu-grozs"],
  },
};

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
) {
  const reserved = collectReservedImageUrls(artisans, products);

  return artisans
    .map((artisan) => {
      const artisanProducts = products.filter((product) => product.artisanSlug === artisan.slug);
      const candidate =
        artisanProducts.find((product) => product.image && !reserved.has(product.image)) ??
        artisanProducts.find((product) => product.image);
      if (candidate?.image) reserved.add(candidate.image);
      return candidate;
    })
    .filter((product): product is CatalogProduct => Boolean(product))
    .slice(0, limit);
}
