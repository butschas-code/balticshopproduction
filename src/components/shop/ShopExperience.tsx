"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { ShopAmbient } from "@/components/shop/ShopAmbient";
import { ShopCollectionChapter } from "@/components/shop/ShopCollectionChapter";
import { ShopEditorialGrid } from "@/components/shop/ShopEditorialGrid";
import { ShopFilters } from "@/components/shop/ShopFilters";
import { EditorialProductCard } from "@/components/shop/EditorialProductCard";
import { ScrollReveal, ScrollRevealItem, ScrollRevealStagger } from "@/components/shop/ScrollReveal";
import { shopEase } from "@/lib/shop/motion";
import {
  buildEditorialSections,
  countHiddenMatches,
  enrichShopProduct,
  filterShopProducts,
  getAvailableArtisans,
  getAvailableTypesWithCounts,
  getCollectionCounts,
  getGroupedTypesWithCounts,
  pickFlagshipProduct,
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

  const activeFilters = {
    ...filters,
    type: filters.collection ? filters.type : null,
    artisan: filters.collection ? filters.artisan : null,
  };

  const hasActiveFilter = Boolean(activeFilters.collection || activeFilters.type || activeFilters.artisan);
  const isCuratedDefault = !hasActiveFilter && filters.view !== "all";
  const isBrowseMode = !isCuratedDefault;

  const enriched = useMemo(
    () => products.map((product) => enrichShopProduct(product)),
    [products],
  );

  const flagship = useMemo(() => pickFlagshipProduct(enriched), [enriched]);

  const editorial = useMemo(
    () => (activeFilters.collection ? buildEditorialSections(enriched, activeFilters.collection) : { hero: undefined, rest: [] }),
    [enriched, activeFilters.collection],
  );

  const filtered = useMemo(() => {
    const results = filterShopProducts(enriched, activeFilters);

    if (isCuratedDefault && activeFilters.collection && editorial.hero) {
      const spotlightSlugs = new Set([editorial.hero, ...editorial.rest.slice(0, 2)].map((product) => product.slug));
      return results.filter((product) => !spotlightSlugs.has(product.slug));
    }

    if (isCuratedDefault && !activeFilters.collection && flagship) {
      const chapterSlugs = new Set<string>([flagship.slug]);
      for (const collection of SHOP_COLLECTIONS) {
        const section = buildEditorialSections(enriched, collection);
        if (section.hero) chapterSlugs.add(section.hero.slug);
        section.rest.slice(0, 2).forEach((product) => chapterSlugs.add(product.slug));
      }
      return results.filter((product) => !chapterSlugs.has(product.slug));
    }

    return results;
  }, [enriched, activeFilters, isCuratedDefault, editorial, flagship]);

  const availableTypes = useMemo(
    () => getAvailableTypesWithCounts(enriched, activeFilters.collection),
    [enriched, activeFilters.collection],
  );
  const typeGroups = useMemo(
    () => (activeFilters.collection ? getGroupedTypesWithCounts(enriched, activeFilters.collection) : []),
    [enriched, activeFilters.collection],
  );
  const availableArtisans = useMemo(
    () => getAvailableArtisans(enriched, activeFilters.collection),
    [enriched, activeFilters.collection],
  );
  const collectionCounts = useMemo(() => getCollectionCounts(enriched), [enriched]);
  const hiddenCount = useMemo(() => countHiddenMatches(enriched, activeFilters), [enriched, activeFilters]);

  const typeLabel = (type: string) => t(`types.${type}` as never);

  const filterLabels = {
    layerCollection: t("layerCollection"),
    layerWithin: t("layerWithin"),
    allCollections: t("allCollections"),
    chooseCollectionHint: t("chooseCollectionHint"),
    filterByType: t("filterByType"),
    filterByArtisan: t("filterByArtisan"),
    allTypes: t("allTypes"),
    allArtisans: t("allArtisans"),
    clearFilters: t("clearFilters"),
    collections: Object.fromEntries(
      SHOP_COLLECTIONS.map((collection) => [collection, tCollections(collection)]),
    ) as Record<ShopCollection, string>,
    collectionDescriptions: Object.fromEntries(
      SHOP_COLLECTIONS.map((collection) => [collection, t(`collectionDescriptions.${collection}` as never)]),
    ) as Record<ShopCollection, string>,
    types: Object.fromEntries(availableTypes.map((entry) => [entry.type, typeLabel(entry.type)])),
    typeGroups: Object.fromEntries(
      typeGroups.map((group) => [group.id, t(group.labelKey as never)]),
    ),
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

  const showFlagshipIntro = isCuratedDefault && !activeFilters.collection && flagship;
  const showCollectionChapters = isCuratedDefault && !activeFilters.collection;
  const showCollectionSpotlight = isCuratedDefault && Boolean(activeFilters.collection && editorial.hero);
  const showCatalogGrid =
    isBrowseMode || (isCuratedDefault && Boolean(activeFilters.collection) && filtered.length > 0);

  return (
    <div className="relative pb-30 md:pb-40">
      <ShopAmbient />

      <section className="relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 pt-32 md:pt-40 lg:pt-44 pb-16 md:pb-20 lg:pb-24">
          <ScrollRevealStagger className="max-w-3xl">
            <ScrollRevealItem>
              <p className="text-[11px] uppercase tracking-[0.32em] text-driftwood">{t("eyebrow")}</p>
            </ScrollRevealItem>
            <ScrollRevealItem>
              <h1 className="mt-6 font-serif text-5xl md:text-6xl lg:text-7xl text-forest tracking-tight leading-[1.02]">
                {t("title")}
              </h1>
            </ScrollRevealItem>
            <ScrollRevealItem>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.1, delay: 0.35, ease: shopEase }}
                className="origin-left h-px w-20 bg-amber/30 mt-8"
                aria-hidden
              />
            </ScrollRevealItem>
            <ScrollRevealItem>
              <p className="mt-8 text-forest/65 text-lg md:text-xl leading-relaxed max-w-xl font-light">
                {isCuratedDefault ? t("curatedIntro") : t("filteredIntro")}
              </p>
            </ScrollRevealItem>
          </ScrollRevealStagger>
        </div>
      </section>

      <ShopFilters
        collection={activeFilters.collection}
        type={activeFilters.type}
        artisan={activeFilters.artisan}
        typeGroups={typeGroups}
        availableArtisans={availableArtisans}
        collectionCounts={collectionCounts}
        collectionTypeTotal={availableTypes.reduce((sum, entry) => sum + entry.count, 0)}
        onCollectionChange={setCollection}
        onTypeChange={setType}
        onArtisanChange={setArtisan}
        onClearRefinements={() =>
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
            <ScrollReveal className="mb-8 md:mb-10">
              <p className="text-[11px] uppercase tracking-[0.28em] text-driftwood">{t("signatureEdit")}</p>
            </ScrollReveal>
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
        <section className="relative py-16 md:py-20 lg:py-24 border-b border-fog/50 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.35)_0%,transparent_55%)] pointer-events-none" aria-hidden />
          <div className="relative max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              <ScrollReveal className="lg:col-span-4 lg:sticky lg:top-32">
                <p className="text-[11px] uppercase tracking-[0.28em] text-driftwood">{tCollections(filters.collection!)}</p>
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.9, delay: 0.1, ease: shopEase }}
                  className="origin-left h-px w-14 bg-amber/30 mt-5"
                  aria-hidden
                />
                <h2 className="mt-5 font-serif text-3xl md:text-4xl text-forest leading-tight">
                  {t(`${filters.collection}EditorialTitle` as never)}
                </h2>
                <p className="mt-5 text-forest/70 leading-relaxed font-light">{t(`${filters.collection}EditorialSubtitle` as never)}</p>
              </ScrollReveal>
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
                        delay={0.08 * (index + 1)}
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
            <ScrollReveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 md:mb-20">
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
            </ScrollReveal>

            {filtered.length === 0 ? (
              <ScrollReveal className="py-24 md:py-32 text-center">
                <p className="font-serif text-3xl md:text-4xl text-forest">{t("emptyTitle")}</p>
                <p className="mt-4 text-driftwood max-w-md mx-auto">{t("emptyBody")}</p>
              </ScrollReveal>
            ) : (
              <ShopEditorialGrid products={filtered} locale={locale} typeLabel={typeLabel} />
            )}
          </div>
        </section>
      ) : null}

      {isCuratedDefault && !activeFilters.collection ? (
        <section className="relative py-20 md:py-28 border-t border-fog/50 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(200,154,75,0.06)_0%,transparent_70%)] pointer-events-none" aria-hidden />
          <ScrollRevealStagger className="relative max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 text-center">
            <ScrollRevealItem>
              <p className="text-[11px] uppercase tracking-[0.28em] text-driftwood">{t("catalogView")}</p>
            </ScrollRevealItem>
            <ScrollRevealItem>
              <p className="mt-4 font-serif text-2xl md:text-3xl text-forest max-w-lg mx-auto leading-snug">
                {t("catalogClosing")}
              </p>
            </ScrollRevealItem>
            <ScrollRevealItem>
              <motion.button
                type="button"
                onClick={() =>
                  updateParams((params) => {
                    params.set("view", "all");
                  })
                }
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.995 }}
                transition={{ duration: 0.25, ease: shopEase }}
                className="mt-8 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-forest hover:text-amber transition-colors group"
              >
                {t("browseFullCatalog")}
                <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                  →
                </span>
              </motion.button>
            </ScrollRevealItem>
          </ScrollRevealStagger>
        </section>
      ) : null}
    </div>
  );
}
