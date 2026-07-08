import { getTranslations } from "next-intl/server";
import { ArtisanCard } from "@/components/ArtisanCard";
import { getCatalogArtisans } from "@/lib/catalog-supabase";

export default async function ArtisansPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = locale === "de" ? "de" : "en";

  const [t, artisans] = await Promise.all([
    getTranslations("artisansPage"),
    getCatalogArtisans(activeLocale),
  ]);

  return (
    <div className="pt-28 md:pt-36 pb-24">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="mb-16 md:mb-24">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-forest tracking-tight">{t("title")}</h1>
          <p className="mt-4 text-driftwood text-lg max-w-xl">{t("subtitle")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {artisans.map((artisan) => (
            <ArtisanCard
              key={artisan.slug}
              slug={artisan.slug}
              name={artisan.name}
              location={artisan.location}
              craft={artisan.craft}
              image={artisan.portrait}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
