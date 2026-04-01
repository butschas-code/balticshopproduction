"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const collectionSlugs = [
  { slug: "amber", nameKey: "amber", descKey: "amberDesc" },
  { slug: "linen", nameKey: "linen", descKey: "linenDesc" },
  { slug: "woodcraft", nameKey: "woodcraft", descKey: "woodcraftDesc" },
  { slug: "wool-felt", nameKey: "woolFelt", descKey: "woolFeltDesc" },
  { slug: "ceramics", nameKey: "ceramics", descKey: "ceramicsDesc" },
] as const;

const images: Record<string, string> = {
  amber: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
  linen: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80",
  woodcraft: "https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=800&q=80",
  "wool-felt": "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80",
  ceramics: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80",
};

export function CollectionGrid() {
  const t = useTranslations("collections");
  return (
    <section className="py-24 md:py-32 lg:py-40 bg-linen relative z-10">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-forest tracking-tight">
            {t("title")}
          </h2>
          <p className="mt-4 text-driftwood text-lg max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {collectionSlugs.map((col) => (
            <div key={col.slug}>
              <Link
                href={`/shop?collection=${col.slug}`}
                className="group block relative aspect-[4/5] overflow-hidden bg-fog"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url(${images[col.slug]})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-forest/20 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />
                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
                  <span className="font-serif text-2xl md:text-3xl text-linen">
                    {t(col.nameKey)}
                  </span>
                  <span className="mt-1 text-linen/80 text-sm">
                    {t(col.descKey)}
                  </span>
                  <span className="mt-4 inline-flex items-center gap-2 text-amber text-sm font-medium group-hover:gap-3 transition-all">
                    {t("explore")}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
