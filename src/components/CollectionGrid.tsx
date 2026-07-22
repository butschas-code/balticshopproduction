import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ScrollReveal, ScrollRevealItem, ScrollRevealStagger } from "@/components/shop/ScrollReveal";

type CollectionGridProps = {
  categoryImages: {
    linen?: string;
    woodcraft?: string;
    ceramics?: string;
    baskets?: string;
  };
};

const collectionSlugs = [
  { slug: "linen", nameKey: "linen", descKey: "linenDesc" },
  { slug: "woodcraft", nameKey: "woodcraft", descKey: "woodcraftDesc" },
  { slug: "ceramics", nameKey: "ceramics", descKey: "ceramicsDesc" },
  { slug: "baskets", nameKey: "baskets", descKey: "basketsDesc" },
] as const;

export function CollectionGrid({ categoryImages }: CollectionGridProps) {
  const t = useTranslations("collections");

  return (
    <section className="premium-section py-24 md:py-32 lg:py-40 bg-linen/75 relative z-10">
      <div className="relative max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
        <ScrollRevealStagger className="text-center mb-16 md:mb-24">
          <ScrollRevealItem>
            <p className="premium-eyebrow mx-auto">{t("explore")}</p>
          </ScrollRevealItem>
          <ScrollRevealItem>
            <h2 className="mt-6 font-serif text-3xl md:text-4xl lg:text-5xl text-forest tracking-tight">{t("title")}</h2>
          </ScrollRevealItem>
          <ScrollRevealItem>
            <p className="mt-4 text-driftwood text-lg max-w-xl mx-auto">{t("subtitle")}</p>
          </ScrollRevealItem>
        </ScrollRevealStagger>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 xl:grid-cols-4">
          {collectionSlugs.map((col, index) => (
            <ScrollReveal
              key={col.slug}
              delay={index * 0.06}
              y={36}
            >
              <article className="premium-shell group transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1">
                <Link href={`/shop?collection=${col.slug}`} className="premium-core relative block aspect-[4/5] bg-fog">
                  <div className="absolute inset-0 overflow-hidden">
                    <div
                      className="h-full w-full bg-cover bg-center transition-transform duration-[1300ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                      style={{ backgroundImage: `url(${categoryImages[col.slug] || ""})` }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,42,36,0.06)_0%,rgba(15,42,36,0.12)_42%,rgba(15,42,36,0.72)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
                    <h3 className="font-serif text-3xl leading-none text-linen md:text-4xl">{t(col.nameKey)}</h3>
                    <p className="mt-2 min-h-[2.5rem] text-sm leading-relaxed text-linen/80">{t(col.descKey)}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-beeswax transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:gap-3">
                      {t("explore")}
                      <span aria-hidden>→</span>
                    </span>
                  </div>
                </Link>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
