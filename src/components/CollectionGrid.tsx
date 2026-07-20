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
    <section className="premium-section py-24 md:py-32 lg:py-40 bg-linen/70 relative z-10">
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

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">
          {collectionSlugs.map((col, index) => (
            <ScrollReveal key={col.slug} delay={index * 0.06} y={36}>
              <div className="premium-shell group transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1">
                <Link href={`/shop?collection=${col.slug}`} className="premium-core block relative aspect-[4/5] bg-fog">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[1300ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                    style={{ backgroundImage: `url(${categoryImages[col.slug] || ""})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/85 via-forest/22 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                  <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
                    <span className="font-serif text-2xl md:text-3xl text-linen">{t(col.nameKey)}</span>
                    <span className="mt-1 text-linen/80 text-sm">{t(col.descKey)}</span>
                    <span className="mt-5 inline-flex items-center gap-2 text-amber text-sm font-semibold group-hover:gap-3 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]">
                      {t("explore")}
                      <span aria-hidden>→</span>
                    </span>
                  </div>
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
