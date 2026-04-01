"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const artisans: Record<string, { name: string; location: string; craft: string; bio: string; portrait: string; workshopImages: string[]; products: { slug: string; name: string; image: string; price: string }[] }> = {
  "mara-ziedina": {
    name: "Māra Ziediņa",
    location: "Riga, Latvia",
    craft: "Linen textiles & natural dyes",
    bio: "Māra learned to weave from her grandmother in the Latvian countryside. Today she runs a small studio in Riga where she weaves linen on traditional looms and dyes with plants from the Baltic coast. Her work is slow, precise, and made to last.",
    portrait: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
    workshopImages: ["https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80", "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&q=80"],
    products: [{ slug: "linen-throw-dawn", name: "Linen Throw — Dawn", image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&q=80", price: "€ 245" }],
  },
  "jonas-kazlauskas": {
    name: "Jonas Kazlauskas",
    location: "Vilnius, Lithuania",
    craft: "Woodcraft & carving",
    bio: "Jonas sources oak and birch from sustainable forests in Lithuania. In his workshop outside Vilnius, he turns and carves each piece by hand. His bowls and objects honour the grain of the wood and the tradition of Baltic woodcraft.",
    portrait: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80",
    workshopImages: ["https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=800&q=80", "https://images.unsplash.com/photo-1565538420870-da08ff96a261?w=800&q=80"],
    products: [{ slug: "oak-bowl-forest", name: "Oak Bowl — Forest", image: "https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=600&q=80", price: "€ 165" }],
  },
  "kadri-tamm": {
    name: "Kadri Tamm",
    location: "Tallinn, Estonia",
    craft: "Amber jewelry",
    bio: "Kadri collects amber from the Estonian coast and sets it in silver in her Tallinn atelier. She believes each piece of amber carries the memory of the forest. Her jewelry is minimal, timeless, and made to be worn every day.",
    portrait: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=80",
    workshopImages: ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80", "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80"],
    products: [{ slug: "amber-pendant-sun", name: "Amber Pendant — Sun", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80", price: "€ 189" }],
  },
};

const defaultArtisan = {
  name: "Baltic Artisan",
  location: "The Baltic",
  craft: "Craft",
  bio: "A maker from the Baltic region.",
  portrait: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
  workshopImages: [] as string[],
  products: [] as { slug: string; name: string; image: string; price: string }[],
};

export default function ArtisanPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const artisan = slug && artisans[slug] ? artisans[slug] : defaultArtisan;
  const t = useTranslations("artisanPage");

  return (
    <div className="pt-24 md:pt-32">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="aspect-[4/5] lg:aspect-square bg-fog overflow-hidden order-2 lg:order-1">
            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${artisan.portrait})` }} />
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-driftwood text-sm uppercase tracking-widest">{artisan.craft}</p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-forest mt-2 tracking-tight">{artisan.name}</h1>
            <p className="mt-4 text-lg text-driftwood">{artisan.location}</p>
            <p className="mt-10 text-forest/90 leading-relaxed text-lg">{artisan.bio}</p>
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
        <section className="mt-24">
          <h2 className="font-serif text-2xl text-forest mb-8">{t("atWork")}</h2>
          <div className="aspect-video bg-forest/10 flex items-center justify-center">
            <div className="text-center text-driftwood">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-60" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              <p className="text-sm">{t("videoLabel")}</p>
            </div>
          </div>
        </section>
        {artisan.products.length > 0 && (
          <section className="mt-24 pt-16 border-t border-fog">
            <h2 className="font-serif text-2xl text-forest mb-8">{t("worksBy")} {artisan.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {artisan.products.map((product) => (
                <Link key={product.slug} href={`/shop/${product.slug}`} className="group block">
                  <div className="aspect-[3/4] bg-fog overflow-hidden mb-4">
                    <div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${product.image})` }} />
                  </div>
                  <h3 className="font-serif text-xl text-forest group-hover:text-amber transition-colors">{product.name}</h3>
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
