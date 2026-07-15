"use client";

import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import type { ShopCatalogProduct } from "@/lib/shop/curation";
import { shopEase, viewportOnce } from "@/lib/shop/motion";

type EditorialProductCardProps = {
  product: ShopCatalogProduct;
  locale: "en" | "de";
  variant?: "hero" | "feature" | "standard" | "wide" | "portrait";
  index?: number;
  label?: string;
  showDescription?: boolean;
  className?: string;
  delay?: number;
};

export function EditorialProductCard({
  product,
  variant = "standard",
  index,
  label,
  showDescription = false,
  className = "",
  delay = 0,
}: EditorialProductCardProps) {
  const isHero = variant === "hero";
  const isWide = variant === "wide";
  const isFeature = variant === "feature" || isWide;

  const aspectClass = isHero
    ? "aspect-[4/5] md:aspect-[16/10] lg:aspect-[2/1]"
    : isWide
      ? "aspect-[16/11]"
      : isFeature
        ? "aspect-[4/5]"
        : variant === "portrait"
          ? "aspect-[3/4]"
          : "aspect-[4/5]";

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.75, delay, ease: shopEase }}
      className={`group ${className}`}
    >
      <Link href={`/shop/${product.slug}`} className="block">
        <div className={`relative overflow-hidden bg-[#EBE8E2] shadow-[0_24px_60px_-40px_rgba(15,42,36,0.35)] ${aspectClass}`}>
          {product.image ? (
            <motion.div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${product.image})` }}
              whileHover={{ scale: 1.025 }}
              transition={{ duration: 0.9, ease: shopEase }}
            />
          ) : null}

          {isHero ? (
            <div className="absolute inset-0 bg-gradient-to-t from-forest/72 via-forest/18 to-forest/[0.02]" />
          ) : (
            <div className="absolute inset-0 bg-forest/0 group-hover:bg-forest/[0.025] transition-colors duration-500" />
          )}

          {isHero ? (
            <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 lg:p-16">
              {label ? (
                <p className="text-linen/70 text-[11px] uppercase tracking-[0.28em]">{label}</p>
              ) : null}
              <p className="mt-3 text-linen/75 text-[11px] uppercase tracking-[0.24em]">{product.artisanName}</p>
              <h3 className="mt-4 font-serif text-3xl md:text-5xl lg:text-6xl text-linen max-w-4xl leading-[1.05] tracking-tight">
                {product.name}
              </h3>
              <p className="mt-6 text-linen/90 text-lg md:text-xl font-light">{product.price}</p>
            </div>
          ) : null}

          {!isHero && index != null ? (
            <span className="absolute top-5 left-5 md:top-6 md:left-6 font-serif text-base md:text-lg text-forest/20 group-hover:text-forest/35 transition-colors tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
          ) : null}
        </div>

        {!isHero ? (
          <div className={`${isFeature ? "mt-6 md:mt-8" : "mt-5 md:mt-6"}`}>
            {label ? (
              <p className="text-[11px] uppercase tracking-[0.24em] text-driftwood">{label}</p>
            ) : null}
            <p className={`text-[11px] uppercase tracking-[0.22em] text-driftwood ${label ? "mt-2" : ""}`}>
              {product.artisanName}
            </p>
            <h3
              className={`font-serif text-forest group-hover:text-amber transition-colors duration-300 tracking-tight ${
                isFeature ? "text-2xl md:text-3xl mt-2 leading-tight" : "text-xl md:text-2xl mt-1.5 leading-snug"
              }`}
            >
              {product.name}
            </h3>
            {showDescription ? (
              <p className="mt-3 text-forest/65 text-sm leading-relaxed line-clamp-2 max-w-md">{product.description}</p>
            ) : null}
            <p className={`text-forest/90 ${isFeature ? "mt-4 text-base" : "mt-3 text-sm"}`}>{product.price}</p>
          </div>
        ) : null}
      </Link>
    </motion.article>
  );
}
