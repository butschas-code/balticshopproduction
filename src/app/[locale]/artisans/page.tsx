"use client";

import { useTranslations } from "next-intl";
import { ArtisanCard } from "@/components/ArtisanCard";
import { artisans } from "@/data/catalog";

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
            <ArtisanCard key={artisan.slug} {...artisan} image={artisan.portrait} />
          ))}
        </div>
      </div>
    </div>
  );
}
