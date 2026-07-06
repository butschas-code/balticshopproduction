"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { artisans } from "@/data/catalog";
import { ArtisanCard } from "./ArtisanCard";

const featuredArtisans = artisans.filter((artisan) => artisan.isPartner);

export function ArtisansSection() {
  const t = useTranslations("artisans");
  const locale = useLocale();
  const isGerman = locale === "de";

  return (
    <section className="py-24 md:py-32 lg:py-40 bg-fog/30 relative z-10">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 md:mb-24">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-forest tracking-tight">
              {t("title")}
            </h2>
            <p className="mt-4 text-driftwood text-lg max-w-xl">
              {t("subtitle")}
            </p>
          </div>
          <Link
            href="/artisans"
            className="text-forest font-medium hover:text-amber transition-colors inline-flex items-center gap-2"
          >
            {t("meetAll")}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
          {featuredArtisans.map((artisan) => (
            <ArtisanCard
              key={artisan.slug}
              {...artisan}
              craft={isGerman ? artisan.craftDe : artisan.craft}
              image={artisan.portrait}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
