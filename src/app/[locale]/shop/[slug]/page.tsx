"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { artisanBySlug, productBySlug } from "@/data/catalog";

const defaultProduct = {
  name: "Handcrafted Object",
  artisanName: "Baltic Artisan",
  artisanSlug: "artisans",
  location: "The Baltic",
  craft: "Craft",
  materials: "Natural materials",
  technique: "Traditional technique",
  story: "A story of craft and place.",
  isPartnerProduct: false,
  price: "€ —",
  images: ["https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80"],
};

export default function ProductPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const product = slug && productBySlug[slug] ? productBySlug[slug] : defaultProduct;
  const artisan = artisanBySlug[product.artisanSlug];
  const [mainImage, ...otherImages] = product.images;
  const t = useTranslations("products");

  return (
    <div className="pt-24 md:pt-32">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="space-y-4">
            <div className="aspect-[4/5] bg-fog overflow-hidden">
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${mainImage})` }} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {otherImages.map((img, i) => (
                <div key={i} className="aspect-square bg-fog overflow-hidden">
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${img})` }} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-driftwood text-sm uppercase tracking-widest">{product.craft}</p>
            <h1 className="font-serif text-4xl md:text-5xl text-forest mt-2 tracking-tight">{product.name}</h1>
            <p className="mt-4 text-2xl text-forest">{product.price}</p>
            <dl className="mt-10 space-y-6 text-sm">
              <div>
                <dt className="text-driftwood uppercase tracking-wider">{t("artisan")}</dt>
                <dd>
                  <Link href={`/artisans/${product.artisanSlug}`} className="text-forest hover:text-amber transition-colors">
                    {product.artisanName}
                  </Link>
                  <span className="text-driftwood"> — {product.location}</span>
                </dd>
              </div>
              <div>
                <dt className="text-driftwood uppercase tracking-wider">{t("materials")}</dt>
                <dd className="text-forest/90">{product.materials}</dd>
              </div>
              <div>
                <dt className="text-driftwood uppercase tracking-wider">{t("technique")}</dt>
                <dd className="text-forest/90">{product.technique}</dd>
              </div>
            </dl>
            <p className="mt-10 text-forest/90 leading-relaxed">{product.story}</p>
            <div className="mt-12">
              <button type="button" className="w-full md:w-auto px-12 py-4 bg-forest text-linen font-medium tracking-wide hover:bg-forest/90 transition-colors duration-300">
                {t("addToCart")}
              </button>
            </div>
          </div>
        </div>
        {artisan && (
          <section className="mt-24 lg:mt-32 pt-16 border-t border-fog">
            <h2 className="font-serif text-2xl md:text-3xl text-forest mb-8">{t("meetArtisan")}</h2>
            <div className="flex flex-col md:flex-row gap-10 items-start">
              <div className="w-full md:w-80 aspect-square shrink-0 bg-fog overflow-hidden">
                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${artisan.portrait})` }} />
              </div>
              <div>
                <h3 className="font-serif text-xl text-forest">{artisan.name}</h3>
                <p className="text-driftwood text-sm mt-1">{artisan.location}</p>
                <p className="mt-6 text-forest/90 leading-relaxed">{artisan.bio}</p>
                <Link href={`/artisans/${artisan.slug}`} className="inline-flex items-center gap-2 mt-6 text-forest font-medium hover:text-amber transition-colors">
                  {t("viewProfile")}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
