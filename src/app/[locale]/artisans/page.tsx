"use client";

import { useTranslations } from "next-intl";
import { ArtisanCard } from "@/components/ArtisanCard";

const artisans = [
  { slug: "mara-ziedina", name: "Māra Ziediņa", location: "Riga, Latvia", craft: "Linen textiles & natural dyes", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80" },
  { slug: "jonas-kazlauskas", name: "Jonas Kazlauskas", location: "Vilnius, Lithuania", craft: "Woodcraft & carving", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80" },
  { slug: "kadri-tamm", name: "Kadri Tamm", location: "Tallinn, Estonia", craft: "Amber jewelry", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80" },
];

export default function ArtisansPage() {
  const t = useTranslations("artisansPage");
  return (
    <div className="pt-28 md:pt-36 pb-24">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="mb-16 md:mb-24">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-forest tracking-tight">{t("title")}</h1>
          <p className="mt-4 text-driftwood text-lg max-w-xl">{t("subtitle")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {artisans.map((artisan) => (
            <ArtisanCard key={artisan.slug} {...artisan} />
          ))}
        </div>
      </div>
    </div>
  );
}
