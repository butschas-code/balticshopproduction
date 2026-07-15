"use client";

import { motion, AnimatePresence } from "framer-motion";
import { SHOP_COLLECTIONS, type ShopCollection } from "@/lib/shop/taxonomy";
import type { ProductType } from "@/lib/shop/taxonomy";
import { shopEase, staggerContainer, staggerItem } from "@/lib/shop/motion";

type ArtisanOption = { slug: string; name: string; count: number };
type TypeOption = { type: ProductType; count: number };
type TypeGroup = { id: string; labelKey: string; types: TypeOption[] };

type ShopFiltersProps = {
  collection: ShopCollection | null;
  type: ProductType | null;
  artisan: string | null;
  typeGroups: TypeGroup[];
  availableArtisans: ArtisanOption[];
  collectionCounts: { total: number; collections: Record<ShopCollection, number> };
  collectionTypeTotal: number;
  onCollectionChange: (collection: ShopCollection | null) => void;
  onTypeChange: (type: ProductType | null) => void;
  onArtisanChange: (artisan: string | null) => void;
  onClearRefinements: () => void;
  labels: {
    layerCollection: string;
    layerWithin: string;
    allCollections: string;
    chooseCollectionHint: string;
    filterByType: string;
    filterByArtisan: string;
    allTypes: string;
    allArtisans: string;
    clearFilters: string;
    collections: Record<ShopCollection, string>;
    collectionDescriptions: Record<ShopCollection, string>;
    types: Record<string, string>;
    typeGroups: Record<string, string>;
  };
};

export function ShopFilters({
  collection,
  type,
  artisan,
  typeGroups,
  availableArtisans,
  collectionCounts,
  collectionTypeTotal,
  onCollectionChange,
  onTypeChange,
  onArtisanChange,
  onClearRefinements,
  labels,
}: ShopFiltersProps) {
  const hasRefinement = Boolean(type || artisan);
  const showSecondLayer = Boolean(collection);
  const hasMultipleGroups = typeGroups.length > 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2, ease: shopEase }}
      className="relative border-y border-fog/50 bg-white/35 backdrop-blur-md"
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.45)_0%,rgba(246,243,238,0.15)_100%)] pointer-events-none" aria-hidden />

      <div className="relative max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 py-8 md:py-10">
        <p className="text-[11px] uppercase tracking-[0.28em] text-driftwood mb-5">{labels.layerCollection}</p>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4"
        >
          {SHOP_COLLECTIONS.map((item) => (
            <motion.div key={item} variants={staggerItem}>
              <CollectionTile
                active={collection === item}
                label={labels.collections[item]}
                description={labels.collectionDescriptions[item]}
                count={collectionCounts.collections[item]}
                onClick={() => onCollectionChange(item)}
              />
            </motion.div>
          ))}
          <motion.div variants={staggerItem}>
            <CollectionTile
              active={!collection}
              label={labels.allCollections}
              description={labels.chooseCollectionHint}
              count={collectionCounts.total}
              onClick={() => onCollectionChange(null)}
              subtle
            />
          </motion.div>
        </motion.div>

        <AnimatePresence initial={false} mode="wait">
          {showSecondLayer ? (
            <motion.div
              key={collection}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: shopEase }}
              className="overflow-hidden"
            >
              <div className="pt-10 md:pt-12 mt-10 md:mt-12 border-t border-fog/40 space-y-10 md:space-y-12">
                <p className="text-[11px] uppercase tracking-[0.28em] text-driftwood">
                  {labels.layerWithin.replace("{collection}", labels.collections[collection!])}
                </p>

                {typeGroups.length > 0 ? (
                  <div className="space-y-8 md:space-y-10">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-driftwood">{labels.filterByType}</p>
                      {hasRefinement ? (
                        <button
                          type="button"
                          onClick={onClearRefinements}
                          className="text-[11px] uppercase tracking-[0.18em] text-driftwood hover:text-amber transition-colors"
                        >
                          {labels.clearFilters}
                        </button>
                      ) : null}
                    </div>

                    <FilterTile
                      active={!type}
                      label={labels.allTypes}
                      count={collectionTypeTotal}
                      onClick={() => onTypeChange(null)}
                      prominent
                    />

                    {typeGroups.map((group, groupIndex) => (
                      <motion.div
                        key={group.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.08 * groupIndex, ease: shopEase }}
                      >
                        {hasMultipleGroups ? (
                          <p className="text-[11px] uppercase tracking-[0.22em] text-driftwood/80 mb-4">
                            {labels.typeGroups[group.id]}
                          </p>
                        ) : null}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                          {group.types.map((item) => (
                            <FilterTile
                              key={item.type}
                              active={type === item.type}
                              label={labels.types[item.type] || item.type}
                              count={item.count}
                              onClick={() => onTypeChange(item.type)}
                            />
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : null}

                {availableArtisans.length > 1 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.15, ease: shopEase }}
                  >
                    <p className="text-[11px] uppercase tracking-[0.24em] text-driftwood mb-5">{labels.filterByArtisan}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <FilterTile
                        active={!artisan}
                        label={labels.allArtisans}
                        count={availableArtisans.reduce((sum, entry) => sum + entry.count, 0)}
                        onClick={() => onArtisanChange(null)}
                      />
                      {availableArtisans.map((item) => (
                        <FilterTile
                          key={item.slug}
                          active={artisan === item.slug}
                          label={item.name}
                          count={item.count}
                          onClick={() => onArtisanChange(item.slug)}
                        />
                      ))}
                    </div>
                  </motion.div>
                ) : null}
              </div>
            </motion.div>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: shopEase }}
              className="pt-8 text-[15px] leading-relaxed text-forest/55 font-light max-w-xl"
            >
              {labels.chooseCollectionHint}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function CollectionTile({
  label,
  description,
  count,
  active,
  onClick,
  subtle = false,
}: {
  label: string;
  description: string;
  count: number;
  active: boolean;
  onClick: () => void;
  subtle?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.995 }}
      transition={{ duration: 0.25, ease: shopEase }}
      className={`group w-full text-left min-h-[96px] md:min-h-[104px] px-5 md:px-6 py-5 border transition-colors duration-300 ${
        active
          ? "border-forest bg-forest text-linen shadow-[0_20px_50px_-36px_rgba(15,42,36,0.55)]"
          : subtle
            ? "border-fog/70 bg-white/25 hover:border-forest/20 hover:bg-white/55"
            : "border-fog/90 bg-white/45 hover:border-forest/25 hover:bg-white/70"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <span className={`font-serif text-xl md:text-2xl tracking-tight leading-tight ${active ? "text-linen" : "text-forest"}`}>
          {label}
        </span>
        <span className={`shrink-0 text-sm tabular-nums ${active ? "text-linen/70" : "text-driftwood"}`}>{count}</span>
      </div>
      <p className={`mt-3 text-sm leading-relaxed line-clamp-2 ${active ? "text-linen/75" : "text-forest/55"}`}>{description}</p>
    </motion.button>
  );
}

function FilterTile({
  label,
  count,
  active,
  onClick,
  prominent = false,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  prominent?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: active ? 0 : -1 }}
      whileTap={{ scale: 0.995 }}
      transition={{ duration: 0.2, ease: shopEase }}
      className={`group flex items-center justify-between gap-4 w-full px-5 md:px-6 border text-left transition-colors duration-300 ${
        prominent ? "min-h-[64px] md:min-h-[68px]" : "min-h-[56px] md:min-h-[60px]"
      } ${
        active
          ? "border-forest bg-forest text-linen shadow-[0_16px_40px_-30px_rgba(15,42,36,0.5)]"
          : "border-fog/90 bg-white/50 hover:border-forest/25 hover:bg-white/80"
      }`}
    >
      <span className={`font-serif leading-snug ${prominent ? "text-lg md:text-xl" : "text-base md:text-lg"} ${active ? "text-linen" : "text-forest"}`}>
        {label}
      </span>
      <span className={`shrink-0 text-sm tabular-nums ${active ? "text-linen/70" : "text-driftwood group-hover:text-forest/60"}`}>
        {count}
      </span>
    </motion.button>
  );
}
