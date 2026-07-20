import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { formatReadTime, formatStoryDate, getPublishedStoryBySlug } from "@/lib/cms/stories";
import { journalPostBySlug } from "@/data/journal";

export default async function StoryPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const cmsPost = await getPublishedStoryBySlug(slug, locale);
  const staticPost = journalPostBySlug[slug];

  if (!cmsPost && !staticPost) {
    notFound();
  }

  const post = cmsPost
    ? {
        title: cmsPost.title,
        category: cmsPost.category?.name ?? "Story",
        date: formatStoryDate(cmsPost.published_at, locale),
        readTime: formatReadTime(cmsPost.read_time_minutes, locale),
        excerpt: cmsPost.excerpt ?? "",
        image: cmsPost.hero_image_url ?? "/catalog/asset-974afdab4f55.jpg",
        bodyHtml: cmsPost.body_html,
      }
    : {
        title: staticPost.title,
        category: staticPost.category,
        date: staticPost.date,
        readTime: staticPost.readTime,
        excerpt: staticPost.excerpt,
        image: staticPost.image,
        bodyHtml: staticPost.body.map((p) => `<p>${p}</p>`).join(""),
      };

  return (
    <article className="pt-28 md:pt-36 pb-24">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <Link href="/stories" className="text-sm text-driftwood hover:text-amber transition-colors">
          Back to stories
        </Link>
        <div className="mt-10">
          <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-amber">
            <span>{post.category}</span>
            <span className="text-driftwood/50">/</span>
            <span>{post.date}</span>
            <span className="text-driftwood/50">/</span>
            <span>{post.readTime}</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-forest mt-4 tracking-tight">{post.title}</h1>
          <p className="mt-6 text-xl text-driftwood leading-relaxed">{post.excerpt}</p>
        </div>
      </div>
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 mt-16">
        <div className="aspect-[16/9] bg-fog overflow-hidden">
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${post.image})` }} />
        </div>
      </div>
      <div
        className="max-w-3xl mx-auto px-6 md:px-12 mt-16 space-y-7 prose prose-lg prose-forest"
        dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
      />
    </article>
  );
}
