"use client";

import { Link } from "@/i18n/navigation";
import { motion, useScroll, useTransform } from "framer-motion";

import { EditorialProductCard } from "@/components/shop/EditorialProductCard";
import type { ShopCollection } from "@/lib/shop/taxonomy";
import type { ShopCatalogProduct } from "@/lib/shop/curation";
import { shopEase, viewportOnce } from "@/lib/shop/motion";

const CHAPTER_ATMOSPHERE: Record<ShopCollection, string> = {
  ceramics: "bg-[linear-gradient(135deg,rgba(200,154,75,0.05)_0%,rgba(246,243,238,0)_42%,rgba(246,243,238,1)_100%)]",
  linen: "bg-[linear-gradient(135deg,rgba(255,255,255,0.75)_0%,rgba(246,243,238,0)_48%,rgba(245,242,236,1)_100%)]",
  woodcraft: "bg-[linear-gradient(135deg,rgba(15,42,36,0.04)_0%,rgba(246,243,238,0)_45%,rgba(246,243,238,1)_100%)]",
  baskets: "bg-[linear-gradient(135deg,rgba(196,150,84,0.08)_0%,rgba(246,243,238,0)_45%,rgba(246,243,238,1)_100%)]",
};

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
  const { scrollYProgress } = useScroll();
  const parallax = useTransform(scrollYProgress, [0, 1], [0, chapterIndex % 2 === 0 ? -18 : 18]);

  if (!hero) return null;

  const pair = supporting.slice(0, 2);

  return (
    <section className="premium-section relative py-20 md:py-28 lg:py-32 overflow-hidden">
      <div className={`absolute inset-0 ${CHAPTER_ATMOSPHERE[collection]}`} aria-hidden />
      <motion.div style={{ y: parallax }} className="absolute -right-[10%] top-[12%] h-64 w-64 rounded-full bg-amber/[0.04] blur-3xl" aria-hidden />

      <div className="relative max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.85, ease: shopEase }}
            className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-32"
          >
            <p className="font-serif text-sm text-driftwood/70">{String(chapterIndex + 1).padStart(2, "0")}</p>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 1, delay: 0.12, ease: shopEase }}
              className="origin-left h-px w-16 bg-amber/35 mt-6"
            />
            <p className="premium-eyebrow mt-6">{collectionLabel}</p>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl xl:text-[2.75rem] text-forest leading-[1.08] tracking-tight">
              {copy.title}
            </h2>
            <p className="mt-6 text-forest/70 text-base md:text-lg leading-relaxed max-w-sm font-light">{copy.subtitle}</p>
            <p className="mt-8 text-[11px] uppercase tracking-[0.22em] text-driftwood/80">{copy.mood}</p>
            <Link
              href={`/shop?collection=${collection}`}
              className="inline-flex items-center gap-3 mt-10 rounded-full border border-forest/10 bg-white/35 px-5 py-3 text-xs font-semibold tracking-[0.18em] uppercase text-forest hover:text-amber transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group"
            >
              {copy.explore}
              <motion.span className="inline-block group-hover:translate-x-1 transition-transform duration-300" aria-hidden>
                →
              </motion.span>
            </Link>
          </motion.div>

          <div className="lg:col-span-8 xl:col-span-9 space-y-10 md:space-y-14">
            <EditorialProductCard
              product={hero}
              locale={locale}
              variant="wide"
              index={0}
              label={`${hero.artisanName} · ${typeLabel(hero.productType)}`}
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
                    index={index + 1}
                    delay={0.08 * (index + 1)}
                    label={`${product.artisanName} · ${typeLabel(product.productType)}`}
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
