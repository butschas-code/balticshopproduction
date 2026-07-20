import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArtisanCard } from "./ArtisanCard";
import { ScrollReveal, ScrollRevealItem, ScrollRevealStagger } from "@/components/shop/ScrollReveal";

type ArtisanSummary = {
  slug: string;
  name: string;
  location: string;
  craft: string;
  portrait: string;
};

type ArtisansSectionProps = {
  artisans: ArtisanSummary[];
};

export function ArtisansSection({ artisans }: ArtisansSectionProps) {
  const t = useTranslations("artisans");

  return (
    <section className="premium-section py-24 md:py-32 lg:py-40 bg-fog/25 relative z-10">
      <div className="relative max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 md:mb-24">
          <ScrollRevealStagger>
            <ScrollRevealItem>
              <p className="premium-eyebrow">{t("meetAll")}</p>
            </ScrollRevealItem>
            <ScrollRevealItem>
              <h2 className="mt-6 font-serif text-3xl md:text-4xl lg:text-5xl text-forest tracking-tight">{t("title")}</h2>
            </ScrollRevealItem>
            <ScrollRevealItem>
              <p className="mt-4 text-driftwood text-lg max-w-xl">{t("subtitle")}</p>
            </ScrollRevealItem>
          </ScrollRevealStagger>
          <ScrollReveal delay={0.15}>
            <Link href="/artisans" className="inline-flex items-center gap-3 rounded-full border border-forest/10 bg-white/35 px-5 py-3 text-xs font-semibold tracking-[0.18em] uppercase text-forest hover:text-amber transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group">
              {t("meetAll")}
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-forest/8 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1" aria-hidden>
                →
              </span>
            </Link>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
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
    </section>
  );
}
