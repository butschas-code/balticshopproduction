"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { ShopCollectionChapter } from "@/components/shop/ShopCollectionChapter";
import { ShopEditorialGrid } from "@/components/shop/ShopEditorialGrid";
import { ShopFilters } from "@/components/shop/ShopFilters";
import { EditorialProductCard } from "@/components/shop/EditorialProductCard";
import {
  buildEditorialSections,
  countHiddenMatches,
  enrichShopProduct,
  filterShopProducts,
  getAvailableArtisans,
  getAvailableTypes,
  type ShopCatalogProduct,
} from "@/lib/shop/curation";
import {
  SHOP_COLLECTIONS,
  isProductType,
  isShopCollection,
  type ProductType,
  type ShopCollection,
} from "@/lib/shop/taxonomy";
import type { CatalogProduct } from "@/lib/catalog-supabase";

type ShopExperienceProps = {
  products: CatalogProduct[];
  locale: "en" | "de";
};

function buildHref(pathname: string, params: URLSearchParams) {
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function ShopExperience({ products, locale }: ShopExperienceProps) {
  const t = useTranslations("shop");
  const tCollections = useTranslations("collections");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const collectionParam = searchParams.get("collection");
  const typeParam = searchParams.get("type");
  const artisanParam = searchParams.get("artisan");
  const viewParam = searchParams.get("view");

  const filters = {
    collection: isShopCollection(collectionParam) ? collectionParam : null,
    type: isProductType(typeParam) ? typeParam : null,
    artisan: artisanParam || null,
    view: viewParam === "all" ? ("all" as const) : ("curated" as const),
  };

  const hasActiveFilter = Boolean(filters.collection || filters.type || filters.artisan);
  const isCuratedDefault = !hasActiveFilter && filters.view !== "all";
  const isBrowseMode = !isCuratedDefault;

  const enriched = useMemo(
    () => products.map((product) => enrichShopProduct(product)),
    [products],
  );

  const flagship = useMemo(() => {
    return enriched
      .filter((product) => product.isFeatured && product.shopVisible)
      .sort((a, b) => a.shopRank - b.shopRank)[0];
  }, [enriched]);

  const editorial = useMemo(
    () => (filters.collection ? buildEditorialSections(enriched, filters.collection) : { hero: undefined, rest: [] }),
    [enriched, filters.collection],
  );

  const filtered = useMemo(() => {
    const results = filterShopProducts(enriched, filters);

    if (isCuratedDefault && filters.collection && editorial.hero) {
      const spotlightSlugs = new Set([editorial.hero, ...editorial.rest.slice(0, 2)].map((product) => product.slug));
      return results.filter((product) => !spotlightSlugs.has(product.slug));
    }

    if (isCuratedDefault && !filters.collection && flagship) {
      const chapterSlugs = new Set<string>([flagship.slug]);
      for (const collection of SHOP_COLLECTIONS) {
        const section = buildEditorialSections(enriched, collection);
        if (section.hero) chapterSlugs.add(section.hero.slug);
        section.rest.slice(0, 2).forEach((product) => chapterSlugs.add(product.slug));
      }
      return results.filter((product) => !chapterSlugs.has(product.slug));
    }

    return results;
  }, [enriched, filters, isCuratedDefault, editorial, flagship]);

  const availableTypes = useMemo(
    () => getAvailableTypes(enriched, filters.collection),
    [enriched, filters.collection],
  );
  const availableArtisans = useMemo(
    () => getAvailableArtisans(enriched, filters.collection),
    [enriched, filters.collection],
  );
  const hiddenCount = useMemo(() => countHiddenMatches(enriched, filters), [enriched, filters]);

  const typeLabel = (type: string) => t(`types.${type}` as never);

  const filterLabels = {
    allCollections: t("allCollections"),
    refine: t("refine"),
    closeRefine: t("closeRefine"),
    filterByType: t("filterByType"),
    filterByArtisan: t("filterByArtisan"),
    allTypes: t("allTypes"),
    allArtisans: t("allArtisans"),
    clearFilters: t("clearFilters"),
    collections: {
      linen: tCollections("linen"),
      woodcraft: tCollections("woodcraft"),
      ceramics: tCollections("ceramics"),
    },
    types: Object.fromEntries(availableTypes.map((type) => [type, typeLabel(type)])),
  };

  const updateParams = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    router.push(buildHref(pathname, params));
  };

  const setCollection = (collection: ShopCollection | null) => {
    updateParams((params) => {
      if (collection) params.set("collection", collection);
      else params.delete("collection");
      params.delete("type");
      params.delete("artisan");
    });
  };

  const setType = (type: ProductType | null) => {
    updateParams((params) => {
      if (type) params.set("type", type);
      else params.delete("type");
    });
  };

  const setArtisan = (artisan: string | null) => {
    updateParams((params) => {
      if (artisan) params.set("artisan", artisan);
      else params.delete("artisan");
    });
  };

  const showFlagshipIntro = isCuratedDefault && !filters.collection && flagship;
  const showCollectionChapters = isCuratedDefault && !filters.collection;
  const showCollectionSpotlight = isCuratedDefault && Boolean(filters.collection && editorial.hero);
  const showCatalogGrid =
    isBrowseMode || (isCuratedDefault && Boolean(filters.collection) && filtered.length > 0);

  return (
    <div className="pb-30 md:pb-40">
      <section className="relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 pt-32 md:pt-40 lg:pt-44 pb-16 md:pb-20 lg:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <p className="text-[11px] uppercase tracking-[0.32em] text-driftwood">{t("eyebrow")}</p>
            <h1 className="mt-6 font-serif text-5xl md:text-6xl lg:text-7xl text-forest tracking-tight leading-[1.02]">
              {t("title")}
            </h1>
            <p className="mt-8 text-forest/65 text-lg md:text-xl leading-relaxed max-w-xl font-light">
              {isCuratedDefault ? t("curatedIntro") : t("filteredIntro")}
            </p>
          </motion.div>
        </div>
      </section>

      <ShopFilters
        collection={filters.collection}
        type={filters.type}
        artisan={filters.artisan}
        availableTypes={availableTypes}
        availableArtisans={availableArtisans}
        onCollectionChange={setCollection}
        onTypeChange={setType}
        onArtisanChange={setArtisan}
        onClearAll={() =>
          updateParams((params) => {
            params.delete("type");
            params.delete("artisan");
          })
        }
        labels={filterLabels}
      />

      {showFlagshipIntro ? (
        <section className="py-16 md:py-20 lg:py-24">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
            <div className="mb-8 md:mb-10">
              <p className="text-[11px] uppercase tracking-[0.28em] text-driftwood">{t("signatureEdit")}</p>
            </div>
            <EditorialProductCard
              product={flagship}
              locale={locale}
              variant="hero"
              label={tCollections(flagship.collectionSlug)}
            />
          </div>
        </section>
      ) : null}

      {showCollectionChapters
        ? SHOP_COLLECTIONS.map((collection, index) => {
            const section = buildEditorialSections(enriched, collection);
            const keys = {
              titleKey: `${collection}EditorialTitle`,
              subtitleKey: `${collection}EditorialSubtitle`,
              moodKey: `${collection}Mood`,
            } as const;

            return (
              <ShopCollectionChapter
                key={collection}
                collection={collection}
                chapterIndex={index}
                hero={section.hero}
                supporting={section.rest}
                locale={locale}
                collectionLabel={tCollections(collection)}
                copy={{
                  title: t(keys.titleKey as never),
                  subtitle: t(keys.subtitleKey as never),
                  mood: t(keys.moodKey as never),
                  explore: t("exploreCollection", { collection: tCollections(collection) }),
                }}
                typeLabel={typeLabel}
              />
            );
          })
        : null}

      {showCollectionSpotlight && editorial.hero ? (
        <section className="py-16 md:py-20 lg:py-24 border-b border-fog/50">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              <div className="lg:col-span-4">
                <p className="text-[11px] uppercase tracking-[0.28em] text-driftwood">{tCollections(filters.collection!)}</p>
                <h2 className="mt-4 font-serif text-3xl md:text-4xl text-forest leading-tight">
                  {t(`${filters.collection}EditorialTitle` as never)}
                </h2>
                <p className="mt-5 text-forest/70 leading-relaxed">{t(`${filters.collection}EditorialSubtitle` as never)}</p>
              </div>
              <div className="lg:col-span-8 space-y-12">
                <EditorialProductCard
                  product={editorial.hero}
                  locale={locale}
                  variant="wide"
                  label={typeLabel(editorial.hero.productType)}
                  showDescription
                />
                {editorial.rest.slice(0, 2).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
                    {editorial.rest.slice(0, 2).map((product, index) => (
                      <EditorialProductCard
                        key={product.slug}
                        product={product}
                        locale={locale}
                        variant="feature"
                        index={index}
                        label={typeLabel(product.productType)}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {showCatalogGrid ? (
        <section className="py-16 md:py-20 lg:py-24">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 md:mb-20">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-driftwood">
                  {isBrowseMode ? t("catalogView") : t("fromTheEdit")}
                </p>
                {isBrowseMode ? (
                  <p className="mt-3 font-serif text-2xl md:text-3xl text-forest tracking-tight">
                    {t("resultsCount", { count: filtered.length })}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-6">
                {isCuratedDefault && hiddenCount > 0 ? (
                  <button
                    type="button"
                    onClick={() =>
                      updateParams((params) => {
                        params.set("view", "all");
                      })
                    }
                    className="text-[11px] uppercase tracking-[0.24em] text-forest hover:text-amber transition-colors border-b border-forest/20 hover:border-amber/50 pb-1"
                  >
                    {t("showMoreSimilar", { count: hiddenCount })}
                  </button>
                ) : null}

                {isBrowseMode && filters.view === "all" ? (
                  <button
                    type="button"
                    onClick={() =>
                      updateParams((params) => {
                        params.delete("view");
                        params.delete("type");
                        params.delete("artisan");
                        params.delete("collection");
                      })
                    }
                    className="text-[11px] uppercase tracking-[0.24em] text-driftwood hover:text-forest transition-colors"
                  >
                    {t("backToCurated")}
                  </button>
                ) : isBrowseMode ? null : (
                  <button
                    type="button"
                    onClick={() =>
                      updateParams((params) => {
                        params.set("view", "all");
                      })
                    }
                    className="text-[11px] uppercase tracking-[0.24em] text-driftwood hover:text-forest transition-colors"
                  >
                    {t("browseFullCatalog")}
                  </button>
                )}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="py-24 md:py-32 text-center">
                <p className="font-serif text-3xl md:text-4xl text-forest">{t("emptyTitle")}</p>
                <p className="mt-4 text-driftwood max-w-md mx-auto">{t("emptyBody")}</p>
              </div>
            ) : (
              <ShopEditorialGrid products={filtered} locale={locale} typeLabel={typeLabel} />
            )}
          </div>
        </section>
      ) : null}

      {isCuratedDefault && !filters.collection ? (
        <section className="py-20 md:py-28 border-t border-fog/50">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 text-center">
            <p className="text-[11px] uppercase tracking-[0.28em] text-driftwood">{t("catalogView")}</p>
            <p className="mt-4 font-serif text-2xl md:text-3xl text-forest max-w-lg mx-auto leading-snug">
              {t("catalogClosing")}
            </p>
            <button
              type="button"
              onClick={() =>
                updateParams((params) => {
                  params.set("view", "all");
                })
              }
              className="mt-8 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-forest hover:text-amber transition-colors group"
            >
              {t("browseFullCatalog")}
              <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                →
              </span>
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
