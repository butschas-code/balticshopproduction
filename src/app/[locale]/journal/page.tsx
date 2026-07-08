import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { formatReadTime, formatStoryDate, getPublishedStories } from "@/lib/cms/stories";
import { journalPosts } from "@/data/journal";

export default async function JournalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("journal");
  const cmsPosts = await getPublishedStories(locale);
  const posts =
    cmsPosts.length > 0
      ? cmsPosts.map((post) => ({
          slug: post.slug,
          title: post.title,
          category: post.category?.name ?? "Story",
          excerpt: post.excerpt ?? "",
          image: post.hero_image_url ?? "/catalog/asset-974afdab4f55.jpg",
          readTime: formatReadTime(post.read_time_minutes, locale),
        }))
      : journalPosts.map((post) => ({
          slug: post.slug,
          title: post.title,
          category: post.category,
          excerpt: post.excerpt,
          image: post.image,
          readTime: post.readTime,
        }));

  return (
    <div className="pt-28 md:pt-36 pb-24">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="mb-16 md:mb-24">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-forest tracking-tight">{t("title")}</h1>
          <p className="mt-4 text-driftwood text-lg max-w-xl">{t("subtitle")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
          {posts.map((post) => (
            <article key={post.slug}>
              <Link href={`/journal/${post.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-fog mb-6">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${post.image})` }}
                  />
                </div>
                <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-amber">
                  <span>{post.category}</span>
                  <span className="text-driftwood/50">/</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="font-serif text-2xl text-forest mt-2 group-hover:text-amber transition-colors">{post.title}</h2>
                <p className="mt-3 text-driftwood text-sm leading-relaxed">{post.excerpt}</p>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
