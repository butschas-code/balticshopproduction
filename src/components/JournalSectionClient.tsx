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

  return (
    <section className="premium-section py-24 md:py-32 lg:py-40 bg-linen/80 relative z-10">
      <div className="relative max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 md:mb-24">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {featured.map((post, index) => (
            <ScrollReveal key={post.slug} delay={index * 0.07}>
              <Link href={`/stories/${post.slug}`} className="group block">
                <div className="premium-shell mb-6 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1">
                  <div className="premium-core relative aspect-[4/5] bg-fog">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.055]"
                      style={{ backgroundImage: `url(${post.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest/35 to-transparent" />
                  </div>
                </div>
                <span className="text-xs uppercase tracking-widest text-amber">{post.category}</span>
                <h3 className="font-serif text-2xl text-forest mt-2 group-hover:text-amber transition-colors">{post.title}</h3>
                <p className="mt-3 text-driftwood text-sm leading-relaxed">{post.excerpt}</p>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
