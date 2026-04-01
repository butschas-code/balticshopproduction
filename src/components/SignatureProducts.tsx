"use client";

import { useTranslations } from "next-intl";
import { ProductCard } from "./ProductCard";

const products = [
  {
    slug: "amber-pendant-sun",
    name: "Amber Pendant — Sun",
    description: "A single piece of Baltic amber, set in brushed silver. Worn close to the skin, it carries the warmth of the forest.",
    price: "€ 189",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
    artisanName: "Kadri Tamm",
    craft: "Amber jewelry",
  },
  {
    slug: "linen-throw-dawn",
    name: "Linen Throw — Dawn",
    description: "Hand-woven linen in natural undyed tones. Soft, durable, and made to last generations.",
    price: "€ 245",
    image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80",
    artisanName: "Māra Ziediņa",
    craft: "Linen textiles",
  },
  {
    slug: "oak-bowl-forest",
    name: "Oak Bowl — Forest",
    description: "Turned from a single piece of Baltic oak. The grain tells the story of decades of growth.",
    price: "€ 165",
    image: "https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=800&q=80",
    artisanName: "Jonas Kazlauskas",
    craft: "Woodcraft",
  },
];

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {products.map((product) => (
            <ProductCard key={product.slug} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}
