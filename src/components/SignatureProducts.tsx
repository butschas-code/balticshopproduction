"use client";

import { useTranslations } from "next-intl";
import { artisans, products, type CatalogProduct } from "@/data/catalog";
import { ProductCard } from "./ProductCard";

const liveArtisanSlugs = artisans.filter((artisan) => artisan.website).map((artisan) => artisan.slug);
const signatureProducts = liveArtisanSlugs
  .map((artisanSlug) => products.find((product) => product.artisanSlug === artisanSlug && product.sourceUrl))
  .filter((product): product is CatalogProduct => Boolean(product));

export function SignatureProducts() {
  const t = useTranslations("products");

  return (
    <section className="py-24 md:py-32 lg:py-40 bg-linen relative z-10">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-forest tracking-tight">
            {t("signatureTitle")}
          </h2>
          <p className="mt-4 text-driftwood text-lg max-w-xl mx-auto">
            {t("signatureSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
          {signatureProducts.map((product) => (
            <ProductCard key={product.slug} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}
