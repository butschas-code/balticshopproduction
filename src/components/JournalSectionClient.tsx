"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { StoryListItem } from "@/lib/cms/types";
import { journalPosts } from "@/data/journal";

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
    <section className="py-24 md:py-32 lg:py-40 bg-linen relative z-10">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 md:mb-24">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-forest tracking-tight">{t("title")}</h2>
            <p className="mt-4 text-driftwood text-lg max-w-xl">{t("subtitle")}</p>
          </div>
          <Link href="/journal" className="text-forest font-medium hover:text-amber transition-colors inline-flex items-center gap-2">
            {t("viewAll")}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {featured.map((post) => (
            <article key={post.slug}>
              <Link href={`/journal/${post.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-fog mb-6">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${post.image})` }}
                  />
                </div>
                <span className="text-xs uppercase tracking-widest text-amber">{post.category}</span>
                <h3 className="font-serif text-2xl text-forest mt-2 group-hover:text-amber transition-colors">{post.title}</h3>
                <p className="mt-3 text-driftwood text-sm leading-relaxed">{post.excerpt}</p>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
