"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { StoryListItem } from "@/lib/cms/types";
import { journalPosts } from "@/data/journal";
import { ScrollReveal, ScrollRevealItem, ScrollRevealStagger } from "@/components/shop/ScrollReveal";

type Props = {
  posts: StoryListItem[];
};

export function JournalSectionClient({ posts }: Props) {
  const t = useTranslations("journal");

  const featured =
    posts.length > 0
      ? posts.map((post) => ({
          slug: post.slug,
          title: post.title,
          category: post.category?.name ?? "Story",
          excerpt: post.excerpt ?? "",
          image: post.hero_image_url ?? "/catalog/asset-974afdab4f55.jpg",
        }))
      : journalPosts.slice(0, 3).map((post) => ({
          slug: post.slug,
          title: post.title,
          category: post.category,
          excerpt: post.excerpt,
          image: post.image,
        }));
  const [lead, ...supporting] = featured;

  return (
    <section className="premium-section py-24 md:py-32 lg:py-40 bg-linen/80 relative z-10">
      <div className="relative max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="mb-16 flex flex-col gap-6 md:mb-24 md:flex-row md:items-end md:justify-between">
          <ScrollRevealStagger>
            <ScrollRevealItem>
              <p className="premium-eyebrow">{t("viewAll")}</p>
            </ScrollRevealItem>
            <ScrollRevealItem>
              <h2 className="mt-6 font-serif text-3xl md:text-4xl lg:text-5xl text-forest tracking-tight">{t("title")}</h2>
            </ScrollRevealItem>
            <ScrollRevealItem>
              <p className="mt-4 text-driftwood text-lg max-w-xl">{t("subtitle")}</p>
            </ScrollRevealItem>
          </ScrollRevealStagger>
          <ScrollReveal delay={0.15}>
            <Link href="/stories" className="inline-flex items-center gap-3 rounded-full border border-forest/10 bg-white/35 px-5 py-3 text-xs font-semibold tracking-[0.18em] uppercase text-forest hover:text-amber transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group">
              {t("viewAll")}
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-forest/8 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1" aria-hidden>
                →
              </span>
            </Link>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          {lead ? (
            <ScrollReveal className="lg:col-span-7">
              <Link href={`/stories/${lead.slug}`} className="group block">
                <div className="premium-shell mb-8 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1">
                  <div className="premium-core relative aspect-[4/5] bg-fog md:aspect-[16/10]">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045]"
                      style={{ backgroundImage: `url(${lead.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest/35 to-transparent" />
                  </div>
                </div>
                <span className="text-xs font-bold uppercase tracking-[0.24em] text-amber">{lead.category}</span>
                <h3 className="mt-3 font-serif text-4xl leading-tight text-forest transition-colors group-hover:text-amber md:text-5xl">{lead.title}</h3>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-driftwood">{lead.excerpt}</p>
              </Link>
            </ScrollReveal>
          ) : null}
          <div className="space-y-10 lg:col-span-5 lg:pt-20">
            {supporting.map((post, index) => (
              <ScrollReveal key={post.slug} delay={index * 0.07}>
                <Link href={`/stories/${post.slug}`} className="group grid grid-cols-[120px_minmax(0,1fr)] gap-5 rounded-[1.25rem] border border-forest/8 bg-white/25 p-3 shadow-[0_18px_48px_rgba(18,52,45,0.06)] backdrop-blur-sm transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1">
                  <div className="aspect-[4/5] overflow-hidden rounded-[1rem] bg-fog">
                    <div
                      className="h-full w-full bg-cover bg-center transition-transform duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                      style={{ backgroundImage: `url(${post.image})` }}
                    />
                  </div>
                  <div className="py-2 pr-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber">{post.category}</span>
                    <h3 className="mt-2 font-serif text-2xl leading-tight text-forest transition-colors group-hover:text-amber">{post.title}</h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-driftwood">{post.excerpt}</p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
