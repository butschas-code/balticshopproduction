import type { CatalogProduct } from "@/lib/catalog-supabase";
import { resolveProductType } from "@/lib/shop/classify-product";
import {
  COLLECTION_ARTISANS,
  COLLECTION_TYPES,
  COLLECTION_TYPE_GROUPS,
  SHOP_COLLECTIONS,
  inferCollectionFromArtisan,
  type ProductType,
  type ShopCollection,
} from "@/lib/shop/taxonomy";

const FLAGSHIP_PRIORITY = [
  "pinumu-pasaule-kg34-senu-grozs",
  "vaidava-ceramics-plant-pot-with-saucer-s-soil",
  "raibi-koki-lielais-raibis-43x27-cm",
  "studio-natural-british-style-linen-coat",
  "cerannic-slow-cup",
  "cepli-zupas-zirnu-bloda",
  "latvijas-labumu-tirgus-mals-b-oda",
];

export type ShopCatalogProduct = CatalogProduct & {
  collectionSlug: ShopCollection;
  productType: ProductType;
  isFeatured: boolean;
  shopVisible: boolean;
  shopRank: number;
};

export type ShopFilters = {
  collection?: ShopCollection | null;
  type?: ProductType | null;
  artisan?: string | null;
  view?: "curated" | "all";
};

export function enrichShopProduct(product: CatalogProduct): ShopCatalogProduct {
  const collectionSlug =
    (product.collectionSlug as ShopCollection | null | undefined) ||
    inferCollectionFromArtisan(product.artisanSlug);
  const productType = resolveProductType(product.productType as ProductType | null | undefined, {
    slug: product.slug,
    name: product.name,
    description: product.description,
    craft: product.craft,
    artisanSlug: product.artisanSlug,
  });

  return {
    ...product,
    collectionSlug,
    productType,
    isFeatured: Boolean(product.isFeatured),
    shopVisible: product.shopVisible ?? true,
    shopRank: product.shopRank ?? 1000,
  };
}

export function filterShopProducts(products: ShopCatalogProduct[], filters: ShopFilters) {
  const hasActiveFilter = Boolean(filters.collection || filters.type || filters.artisan);

  return products
    .filter((product) => {
      if (filters.collection && product.collectionSlug !== filters.collection) return false;
      if (filters.type && product.productType !== filters.type) return false;
      if (filters.artisan && product.artisanSlug !== filters.artisan) return false;

      if (filters.view === "all" || hasActiveFilter) {
        return product.shopVisible;
      }

      return product.isFeatured;
    })
    .sort((a, b) => a.shopRank - b.shopRank || a.name.localeCompare(b.name));
}

export function getAvailableTypes(products: ShopCatalogProduct[], collection?: ShopCollection | null) {
  return getAvailableTypesWithCounts(products, collection).map((entry) => entry.type);
}

export function getAvailableTypesWithCounts(products: ShopCatalogProduct[], collection?: ShopCollection | null) {
  const scoped = collection
    ? products.filter((product) => product.collectionSlug === collection && product.shopVisible)
    : products.filter((product) => product.shopVisible);

  const counts = new Map<ProductType, number>();
  for (const product of scoped) {
    counts.set(product.productType, (counts.get(product.productType) || 0) + 1);
  }

  const order = collection
    ? COLLECTION_TYPES[collection]
    : [...COLLECTION_TYPES.ceramics, ...COLLECTION_TYPES.linen, ...COLLECTION_TYPES.woodcraft, ...COLLECTION_TYPES.baskets];

  return order
    .filter((type, index, array) => array.indexOf(type) === index && counts.has(type))
    .map((type) => ({ type, count: counts.get(type) || 0 }));
}

export function getGroupedTypesWithCounts(products: ShopCatalogProduct[], collection: ShopCollection) {
  const available = new Map(getAvailableTypesWithCounts(products, collection).map((entry) => [entry.type, entry.count]));

  return COLLECTION_TYPE_GROUPS[collection]
    .map((group) => ({
      id: group.id,
      labelKey: group.labelKey,
      types: group.types
        .filter((type) => available.has(type))
        .map((type) => ({ type, count: available.get(type) || 0 })),
    }))
    .filter((group) => group.types.length > 0);
}

export function getCollectionCounts(products: ShopCatalogProduct[]) {
  const collections: Record<ShopCollection, number> = {
    ceramics: 0,
    linen: 0,
    woodcraft: 0,
    baskets: 0,
  };

  let total = 0;
  for (const product of products) {
    if (!product.shopVisible) continue;
    total += 1;
    collections[product.collectionSlug] += 1;
  }

  return { total, collections };
}

function pickDiverseFeatured(products: ShopCatalogProduct[], collection: ShopCollection, limit: number) {
  const scoped = products
    .filter((product) => product.collectionSlug === collection && product.isFeatured && product.shopVisible)
    .sort((a, b) => a.shopRank - b.shopRank || a.slug.localeCompare(b.slug));

  const byArtisan = new Map<string, ShopCatalogProduct[]>();
  for (const product of scoped) {
    const key = product.artisanSlug || "unknown";
    const list = byArtisan.get(key) || [];
    list.push(product);
    byArtisan.set(key, list);
  }

  const preferredOrder = COLLECTION_ARTISANS[collection] || [];
  const artisans = [
    ...preferredOrder.filter((slug) => byArtisan.has(slug)),
    ...[...byArtisan.keys()].filter((slug) => !preferredOrder.includes(slug)).sort(),
  ];

  const picks: ShopCatalogProduct[] = [];
  const used = new Set<string>();
  let round = 0;

  while (picks.length < limit) {
    let added = false;
    for (const artisan of artisans) {
      const candidate = (byArtisan.get(artisan) || [])[round];
      if (!candidate || used.has(candidate.slug)) continue;
      picks.push(candidate);
      used.add(candidate.slug);
      added = true;
      if (picks.length >= limit) break;
    }
    if (!added) break;
    round += 1;
  }

  return picks;
}

export function pickFlagshipProduct(products: ShopCatalogProduct[]) {
  for (const slug of FLAGSHIP_PRIORITY) {
    const match = products.find((product) => product.slug === slug && product.shopVisible);
    if (match) return match;
  }

  for (const collection of SHOP_COLLECTIONS) {
    const [hero] = pickDiverseFeatured(products, collection, 1);
    if (hero) return hero;
  }

  return products.find((product) => product.isFeatured && product.shopVisible);
}

export function buildEditorialSections(products: ShopCatalogProduct[], collection: ShopCollection) {
  const picks = pickDiverseFeatured(products, collection, 7);
  return { hero: picks[0], rest: picks.slice(1, 7) };
}

export function getAvailableArtisans(products: ShopCatalogProduct[], collection?: ShopCollection | null) {
  const scoped = collection
    ? products.filter((product) => product.collectionSlug === collection && product.shopVisible)
    : products.filter((product) => product.shopVisible);

  const counts = new Map<string, { slug: string; name: string; count: number }>();
  for (const product of scoped) {
    if (!product.artisanSlug) continue;
    const current = counts.get(product.artisanSlug) || {
      slug: product.artisanSlug,
      name: product.artisanName,
      count: 0,
    };
    current.count += 1;
    counts.set(product.artisanSlug, current);
  }

  return [...counts.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function countHiddenMatches(allProducts: ShopCatalogProduct[], filters: ShopFilters) {
  const visible = filterShopProducts(allProducts, filters).length;
  const total = allProducts.filter((product) => {
    if (filters.collection && product.collectionSlug !== filters.collection) return false;
    if (filters.type && product.productType !== filters.type) return false;
    if (filters.artisan && product.artisanSlug !== filters.artisan) return false;
    return true;
  }).length;
  return Math.max(0, total - visible);
}

export function getRelatedProducts(products: ShopCatalogProduct[], currentSlug: string, limit = 3) {
  const current = products.find((product) => product.slug === currentSlug);
  if (!current) return [];

  const enriched = enrichShopProduct(current);

  return products
    .filter((product) => product.slug !== currentSlug && product.shopVisible)
    .map((product) => enrichShopProduct(product))
    .sort((a, b) => {
      const score = (candidate: ShopCatalogProduct) => {
        let value = 0;
        if (candidate.productType === enriched.productType) value += 4;
        if (candidate.collectionSlug === enriched.collectionSlug) value += 3;
        if (candidate.artisanSlug === enriched.artisanSlug) value += 2;
        if (candidate.isFeatured) value += 1;
        return value;
      };
      const diff = score(b) - score(a);
      if (diff !== 0) return diff;
      return a.shopRank - b.shopRank || a.name.localeCompare(b.name);
    })
    .slice(0, limit);
}
