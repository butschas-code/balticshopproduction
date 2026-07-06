"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { artisanBySlug, getProductsByArtisan } from "@/data/catalog";

const defaultArtisan = {
  name: "Baltic Artisan",
  location: "The Baltic",
  craft: "Craft",
  craftDe: "Handwerk",
  bio: "A maker from the Baltic region.",
  bioDe: "Ein Hersteller aus dem Baltikum.",
  portrait: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
  workshopImages: [] as string[],
  isPartner: false,
};

export default function ArtisanPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const artisan = slug && artisanBySlug[slug] ? artisanBySlug[slug] : defaultArtisan;
  const products = slug ? getProductsByArtisan(slug) : [];
  const t = useTranslations("artisanPage");
  const locale = useLocale();
  const isGerman = locale === "de";

  return (
    <div className="pt-24 md:pt-32">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="aspect-[4/5] lg:aspect-square bg-fog overflow-hidden order-2 lg:order-1">
            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${artisan.portrait})` }} />
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-driftwood text-sm uppercase tracking-widest">{isGerman ? artisan.craftDe : artisan.craft}</p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-forest mt-2 tracking-tight">{artisan.name}</h1>
            <p className="mt-4 text-lg text-driftwood">{artisan.location}</p>
            <p className="mt-10 text-forest/90 leading-relaxed text-lg">{isGerman ? artisan.bioDe : artisan.bio}</p>
          </div>
        </div>
        {artisan.workshopImages.length > 0 && (
          <section className="mt-24">
            <h2 className="font-serif text-2xl text-forest mb-8">{t("workshop")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {artisan.workshopImages.map((img, i) => (
                <div key={i} className="aspect-[16/10] bg-fog overflow-hidden">
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${img})` }} />
                </div>
              ))}
            </div>
          </section>
        )}
        {products.length > 0 && (
          <section className="mt-24 pt-16 border-t border-fog">
            <h2 className="font-serif text-2xl text-forest mb-8">{t("worksBy")} {artisan.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <Link key={product.slug} href={`/shop/${product.slug}`} className="group block">
                  <div className="aspect-[3/4] bg-fog overflow-hidden mb-4">
                    <div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${product.image})` }} />
                  </div>
                  <h3 className="font-serif text-xl text-forest group-hover:text-amber transition-colors">{isGerman ? product.nameDe : product.name}</h3>
                  <p className="mt-1 text-forest/80">{product.price}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
