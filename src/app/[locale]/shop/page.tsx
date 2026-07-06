"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/catalog";

export default function ShopPage() {
  const t = useTranslations("shop");
  const locale = useLocale();
  const isGerman = locale === "de";

  return (
    <div className="pt-28 md:pt-36 pb-24">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="mb-16 md:mb-24">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-forest tracking-tight">
            {t("title")}
          </h1>
          <p className="mt-4 text-driftwood text-lg max-w-xl">
            {t("subtitle")}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
          {products.map((product) => (
            <ProductCard
              key={product.slug}
              slug={product.slug}
              name={isGerman ? product.nameDe : product.name}
              description={isGerman ? product.descriptionDe : product.description}
              price={product.price}
              image={product.image}
              artisanName={product.artisanName}
              craft={isGerman ? product.craftDe : product.craft}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
