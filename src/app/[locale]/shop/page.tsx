"use client";

import { useTranslations, useLocale } from "next-intl";
import { ProductCard } from "@/components/ProductCard";

const products = [
  {
    slug: "amber-pendant-sun",
    name: "Amber Pendant — Sun",
    nameDe: "Bernstein-Anhänger — Sonne",
    description: "A single piece of Baltic amber, set in brushed silver.",
    descriptionDe: "Ein einzelnes Stück Baltischen Bernsteins, in mattem Silber gefasst.",
    price: "€ 189",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
    artisanName: "Kadri Tamm",
    craft: "Amber jewelry",
    craftDe: "Bernsteinschmuck",
  },
  {
    slug: "linen-throw-dawn",
    name: "Linen Throw — Dawn",
    nameDe: "Leinen-Decke — Morgen",
    description: "Hand-woven linen in natural undyed tones.",
    descriptionDe: "Handgewebtes Leinen in natürlichen, ungefärbten Tönen.",
    price: "€ 245",
    image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80",
    artisanName: "Māra Ziediņa",
    craft: "Linen textiles",
    craftDe: "Leinentextilien",
  },
  {
    slug: "oak-bowl-forest",
    name: "Oak Bowl — Forest",
    nameDe: "Eichenschale — Wald",
    description: "Turned from a single piece of Baltic oak.",
    descriptionDe: "Gedrechselt aus einem Stück baltischer Eiche.",
    price: "€ 165",
    image: "https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=800&q=80",
    artisanName: "Jonas Kazlauskas",
    craft: "Woodcraft",
    craftDe: "Holzarbeiten",
  },
];

export default function ShopPage() {
  const t = useTranslations("shop");
  const locale = useLocale();
  const isDe = locale === "de";
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
              name={(isDe && product.nameDe) ? product.nameDe : product.name}
              description={(isDe && product.descriptionDe) ? product.descriptionDe : product.description}
              price={product.price}
              image={product.image}
              artisanName={product.artisanName}
              craft={(isDe && product.craftDe) ? product.craftDe : product.craft}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
