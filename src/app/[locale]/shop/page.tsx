"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/catalog";

const productCategories = [
  { slug: "linen", nameKey: "linen" },
  { slug: "woodcraft", nameKey: "woodcraft" },
  { slug: "ceramics", nameKey: "ceramics" },
] as const;

function getProductCategory(product: (typeof products)[number]) {
  if (product.artisanSlug === "studio-natural") {
    return "linen";
  }

  if (product.artisanSlug === "raibi-koki") {
    return "woodcraft";
  }

  return "ceramics";
}

export default function ShopPage() {
  const t = useTranslations("shop");
  const tCollections = useTranslations("collections");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const isGerman = locale === "de";
  const selectedCategory = searchParams.get("collection");
  const filteredProducts = productCategories.some((category) => category.slug === selectedCategory)
    ? products.filter((product) => getProductCategory(product) === selectedCategory)
    : products;

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
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className={`px-4 py-2 text-sm border transition-colors ${
                selectedCategory
                  ? "border-driftwood/25 text-forest hover:border-amber hover:text-amber"
                  : "border-forest bg-forest text-linen"
              }`}
            >
              {t("all")}
            </Link>
            {productCategories.map((category) => {
              const isSelected = selectedCategory === category.slug;

              return (
                <Link
                  key={category.slug}
                  href={`/shop?collection=${category.slug}`}
                  className={`px-4 py-2 text-sm border transition-colors ${
                    isSelected
                      ? "border-forest bg-forest text-linen"
                      : "border-driftwood/25 text-forest hover:border-amber hover:text-amber"
                  }`}
                >
                  {tCollections(category.nameKey)}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
          {filteredProducts.map((product) => (
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
