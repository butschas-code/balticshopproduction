"use client";

import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";

import { EditorialProductCard } from "@/components/shop/EditorialProductCard";
import type { ShopCollection } from "@/lib/shop/taxonomy";
import type { ShopCatalogProduct } from "@/lib/shop/curation";

type ShopCollectionChapterProps = {
  collection: ShopCollection;
  chapterIndex: number;
  hero?: ShopCatalogProduct;
  supporting: ShopCatalogProduct[];
  locale: "en" | "de";
  collectionLabel: string;
  copy: {
    title: string;
    subtitle: string;
    mood: string;
    explore: string;
  };
  typeLabel: (type: string) => string;
};

export function ShopCollectionChapter({
  collection,
  chapterIndex,
  hero,
  supporting,
  locale,
  collectionLabel,
  copy,
  typeLabel,
}: ShopCollectionChapterProps) {
  if (!hero) return null;

  const pair = supporting.slice(0, 2);

  return (
    <section className="py-20 md:py-28 lg:py-32 border-b border-fog/50 last:border-b-0">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-32"
          >
            <p className="font-serif text-sm text-driftwood/70">{String(chapterIndex + 1).padStart(2, "0")}</p>
            <p className="mt-6 text-[11px] uppercase tracking-[0.28em] text-driftwood">{collectionLabel}</p>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl xl:text-[2.75rem] text-forest leading-[1.08] tracking-tight">
              {copy.title}
            </h2>
            <p className="mt-6 text-forest/70 text-base md:text-lg leading-relaxed max-w-sm">{copy.subtitle}</p>
            <p className="mt-8 text-[11px] uppercase tracking-[0.22em] text-driftwood/80">{copy.mood}</p>
            <Link
              href={`/shop?collection=${collection}`}
              className="inline-flex items-center gap-3 mt-10 text-[11px] uppercase tracking-[0.24em] text-forest hover:text-amber transition-colors group"
            >
              {copy.explore}
              <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                →
              </span>
            </Link>
          </motion.div>

          <div className="lg:col-span-8 xl:col-span-9 space-y-10 md:space-y-14">
            <EditorialProductCard
              product={hero}
              locale={locale}
              variant="wide"
              label={typeLabel(hero.productType)}
              showDescription
            />

            {pair.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 lg:gap-16">
                {pair.map((product, index) => (
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
  );
}
