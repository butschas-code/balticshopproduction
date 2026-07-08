import type { CatalogProduct } from "@/lib/catalog-supabase";
import { resolveProductType } from "@/lib/shop/classify-product";
import {
  COLLECTION_TYPES,
  inferCollectionFromArtisan,
  type ProductType,
  type ShopCollection,
} from "@/lib/shop/taxonomy";

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
  const scoped = collection
    ? products.filter((product) => product.collectionSlug === collection && product.shopVisible)
    : products.filter((product) => product.shopVisible);

  const types = new Set<ProductType>();
  for (const product of scoped) {
    types.add(product.productType);
  }

  const order = collection ? COLLECTION_TYPES[collection] : [...COLLECTION_TYPES.ceramics, ...COLLECTION_TYPES.linen, ...COLLECTION_TYPES.woodcraft];
  return order.filter((type, index, array) => array.indexOf(type) === index && types.has(type));
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

export function buildEditorialSections(products: ShopCatalogProduct[], collection: ShopCollection) {
  const scoped = products.filter((product) => product.collectionSlug === collection && product.isFeatured);
  const hero = scoped[0];
  const rest = scoped.slice(1, 7);
  return { hero, rest };
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
