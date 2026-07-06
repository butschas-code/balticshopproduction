import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { journalPostBySlug } from "@/data/journal";

export default async function JournalPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = journalPostBySlug[slug];

  if (!post) {
    notFound();
  }

  return (
    <article className="pt-28 md:pt-36 pb-24">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <Link href="/journal" className="text-sm text-driftwood hover:text-amber transition-colors">
          Back to journal
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
      <div className="max-w-3xl mx-auto px-6 md:px-12 mt-16 space-y-7">
        {post.body.map((paragraph) => (
          <p key={paragraph} className="text-forest/90 leading-relaxed text-lg">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}
