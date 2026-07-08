"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SHOP_COLLECTIONS, type ShopCollection } from "@/lib/shop/taxonomy";
import type { ProductType } from "@/lib/shop/taxonomy";

type ArtisanOption = { slug: string; name: string; count: number };

type ShopFiltersProps = {
  collection: ShopCollection | null;
  type: ProductType | null;
  artisan: string | null;
  availableTypes: ProductType[];
  availableArtisans: ArtisanOption[];
  onCollectionChange: (collection: ShopCollection | null) => void;
  onTypeChange: (type: ProductType | null) => void;
  onArtisanChange: (artisan: string | null) => void;
  onClearAll: () => void;
  labels: {
    allCollections: string;
    refine: string;
    closeRefine: string;
    filterByType: string;
    filterByArtisan: string;
    allTypes: string;
    allArtisans: string;
    clearFilters: string;
    collections: Record<ShopCollection, string>;
    types: Record<string, string>;
  };
};

export function ShopFilters({
  collection,
  type,
  artisan,
  availableTypes,
  availableArtisans,
  onCollectionChange,
  onTypeChange,
  onArtisanChange,
  onClearAll,
  labels,
}: ShopFiltersProps) {
  const [refineOpen, setRefineOpen] = useState(Boolean(type || artisan));
  const hasRefinement = Boolean(type || artisan);

  return (
    <div className="border-y border-fog/60">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 py-6 md:py-7">
          <nav className="flex flex-wrap items-center gap-x-1 gap-y-2" aria-label="Collections">
            <CollectionTab
              active={!collection}
              label={labels.allCollections}
              onClick={() => onCollectionChange(null)}
            />
            {SHOP_COLLECTIONS.map((item) => (
              <CollectionTab
                key={item}
                active={collection === item}
                label={labels.collections[item]}
                onClick={() => onCollectionChange(item)}
              />
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setRefineOpen((open) => !open)}
            className="self-start md:self-auto inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-driftwood hover:text-forest transition-colors"
            aria-expanded={refineOpen}
          >
            <span>{refineOpen ? labels.closeRefine : labels.refine}</span>
            {hasRefinement ? <span className="h-1.5 w-1.5 rounded-full bg-amber" aria-hidden /> : null}
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-300 ${refineOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <AnimatePresence initial={false}>
          {refineOpen ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="pb-8 md:pb-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 border-t border-fog/50 pt-8">
                {availableTypes.length > 0 ? (
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-driftwood mb-4">{labels.filterByType}</p>
                    <div className="flex flex-wrap gap-x-5 gap-y-2">
                      <RefineLink active={!type} label={labels.allTypes} onClick={() => onTypeChange(null)} />
                      {availableTypes.map((item) => (
                        <RefineLink
                          key={item}
                          active={type === item}
                          label={labels.types[item] || item}
                          onClick={() => onTypeChange(item)}
                        />
                      ))}
                    </div>
                  </div>
                ) : null}

                {availableArtisans.length > 1 ? (
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-driftwood mb-4">{labels.filterByArtisan}</p>
                    <div className="flex flex-wrap gap-x-5 gap-y-2">
                      <RefineLink active={!artisan} label={labels.allArtisans} onClick={() => onArtisanChange(null)} />
                      {availableArtisans.map((item) => (
                        <RefineLink
                          key={item.slug}
                          active={artisan === item.slug}
                          label={item.name}
                          onClick={() => onArtisanChange(item.slug)}
                        />
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              {hasRefinement ? (
                <div className="pb-8 -mt-2">
                  <button
                    type="button"
                    onClick={onClearAll}
                    className="text-[11px] uppercase tracking-[0.22em] text-driftwood hover:text-amber transition-colors border-b border-transparent hover:border-amber/40 pb-0.5"
                  >
                    {labels.clearFilters}
                  </button>
                </div>
              ) : null}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CollectionTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative px-3 py-2 font-serif text-lg md:text-xl transition-colors duration-300 ${
        active ? "text-forest" : "text-driftwood hover:text-forest/80"
      }`}
    >
      {label}
      {active ? (
        <motion.span
          layoutId="shop-collection-tab"
          className="absolute inset-x-2 -bottom-0.5 h-px bg-forest"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      ) : null}
    </button>
  );
}

function RefineLink({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-sm transition-colors duration-300 ${
        active ? "text-forest underline underline-offset-4 decoration-forest/30" : "text-forest/55 hover:text-forest"
      }`}
    >
      {label}
    </button>
  );
}
