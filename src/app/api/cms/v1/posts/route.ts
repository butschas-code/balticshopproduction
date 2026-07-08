import { NextResponse } from "next/server";
import { getPublishedStories } from "@/lib/cms/stories";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") ?? "en";
  const limit = Math.min(Number(searchParams.get("limit") ?? "20"), 50);

  const items = await getPublishedStories(locale, limit);

  return NextResponse.json({
    items: items.map((item) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt,
      heroImageUrl: item.hero_image_url,
      category: item.category?.name ?? null,
      readTimeMinutes: item.read_time_minutes,
      featured: item.featured,
      publishedAt: item.published_at,
    })),
  });
}
