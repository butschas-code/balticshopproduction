import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ProductCard } from "./ProductCard";
import { ScrollReveal, ScrollRevealItem, ScrollRevealStagger } from "@/components/shop/ScrollReveal";

type SignatureProduct = {
  slug: string;
  name: string;
  description: string;
  price: string;
  image: string;
  artisanName: string;
  craft: string;
};

type SignatureProductsProps = {
  products: SignatureProduct[];
};

export function SignatureProducts({ products }: SignatureProductsProps) {
  const t = useTranslations("products");
  const [lead, ...supporting] = products;

  return (
    <section className="premium-section py-24 md:py-32 lg:py-40 bg-linen/80 relative z-10">
      <div className="relative max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="mb-16 flex flex-col gap-6 md:mb-24 md:flex-row md:items-end md:justify-between">
          <ScrollRevealStagger>
            <ScrollRevealItem>
              <p className="premium-eyebrow">{t("addToCart")}</p>
            </ScrollRevealItem>
            <ScrollRevealItem>
              <h2 className="mt-6 font-serif text-3xl md:text-4xl lg:text-5xl text-forest tracking-tight">{t("signatureTitle")}</h2>
            </ScrollRevealItem>
            <ScrollRevealItem>
              <p className="mt-4 text-driftwood text-lg max-w-xl">{t("signatureSubtitle")}</p>
            </ScrollRevealItem>
          </ScrollRevealStagger>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {lead ? (
            <ScrollReveal className="lg:col-span-7">
              <Link href={`/shop/${lead.slug}`} className="premium-shell group block transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1">
                <div className="premium-core grid grid-cols-1 md:grid-cols-2">
                  <div className="aspect-[4/5] overflow-hidden bg-fog md:aspect-auto md:min-h-[520px]">
                    <div
                      className="h-full w-full bg-cover bg-center transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                      style={{ backgroundImage: `url(${lead.image})` }}
                    />
                  </div>
                  <div className="flex flex-col justify-end bg-linen/80 p-7 md:p-9 lg:p-10">
                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-amber">{lead.artisanName}</p>
                    <h3 className="mt-4 font-serif text-4xl leading-none text-forest md:text-5xl">{lead.name}</h3>
                    <p className="mt-5 max-w-md text-sm leading-relaxed text-driftwood">{lead.description}</p>
                    <p className="mt-6 font-extrabold tabular-nums text-forest">{lead.price}</p>
                    <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-amber transition-all duration-500 group-hover:gap-3">
                      {t("addToCart")}
                      <span aria-hidden>→</span>
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ) : null}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:col-span-5">
            {supporting.slice(0, 4).map((product) => (
              <ProductCard key={product.slug} {...product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
