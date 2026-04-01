"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const products: Record<string, { name: string; artisanName: string; artisanSlug: string; location: string; craft: string; materials: string; technique: string; story: string; price: string; images: string[] }> = {
  "amber-pendant-sun": {
    name: "Amber Pendant — Sun",
    artisanName: "Kadri Tamm",
    artisanSlug: "kadri-tamm",
    location: "Tallinn, Estonia",
    craft: "Amber jewelry",
    materials: "Baltic amber, sterling silver",
    technique: "Hand-set, polished by hand",
    story: "Each piece of Baltic amber is millions of years old — fossilised resin from ancient forests. Worn close to the skin, it carries the warmth and stillness of the forest. This pendant is set in brushed silver, designed to let the amber speak.",
    price: "€ 189",
    images: ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&q=80", "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&q=80"],
  },
  "linen-throw-dawn": {
    name: "Linen Throw — Dawn",
    artisanName: "Māra Ziediņa",
    artisanSlug: "mara-ziedina",
    location: "Riga, Latvia",
    craft: "Linen textiles",
    materials: "European flax linen, natural undyed",
    technique: "Hand-woven on traditional loom",
    story: "Woven on a traditional loom in Riga, this throw uses linen from European flax. Left in its natural tone, it ages beautifully and grows softer with use. A piece for generations.",
    price: "€ 245",
    images: ["https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1200&q=80", "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=1200&q=80"],
  },
  "oak-bowl-forest": {
    name: "Oak Bowl — Forest",
    artisanName: "Jonas Kazlauskas",
    artisanSlug: "jonas-kazlauskas",
    location: "Vilnius, Lithuania",
    craft: "Woodcraft",
    materials: "Baltic oak, food-safe oil finish",
    technique: "Hand-turned on a lathe",
    story: "Turned from a single piece of Baltic oak, this bowl shows the grain of decades of growth. Finished with a food-safe oil, it is made for daily use and will develop a rich patina over time.",
    price: "€ 165",
    images: ["https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=1200&q=80", "https://images.unsplash.com/photo-1565538420870-da08ff96a261?w=1200&q=80"],
  },
};

const defaultProduct = {
  name: "Handcrafted Object",
  artisanName: "Baltic Artisan",
  artisanSlug: "artisans",
  location: "The Baltic",
  craft: "Craft",
  materials: "Natural materials",
  technique: "Traditional technique",
  story: "A story of craft and place.",
  price: "€ —",
  images: ["https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80"],
};

export default function ProductPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const product = slug && products[slug] ? products[slug] : defaultProduct;
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
        <section className="mt-24 lg:mt-32 pt-16 border-t border-fog">
          <h2 className="font-serif text-2xl md:text-3xl text-forest mb-8">{t("meetArtisan")}</h2>
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="w-full md:w-80 aspect-square shrink-0 bg-fog overflow-hidden">
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80)` }} />
            </div>
            <div>
              <h3 className="font-serif text-xl text-forest">{product.artisanName}</h3>
              <p className="text-driftwood text-sm mt-1">{product.location}</p>
              <p className="mt-6 text-forest/90 leading-relaxed">
                Working from a small studio in the Baltic, this artisan has spent years perfecting their craft. Each piece is made by hand, with respect for material and tradition. Their work has been shown in galleries across the Nordic region.
              </p>
              <Link href={`/artisans/${product.artisanSlug}`} className="inline-flex items-center gap-2 mt-6 text-forest font-medium hover:text-amber transition-colors">
                {t("viewProfile")}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
