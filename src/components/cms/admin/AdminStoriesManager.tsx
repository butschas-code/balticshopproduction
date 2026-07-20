"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { StoryListItem } from "@/lib/cms/types";

export function AdminStoriesManager() {
  const [stories, setStories] = useState<StoryListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: queryError } = await supabase
      .from("stories")
      .select(
        `id, slug, status, hero_image_url, read_time_minutes, featured, published_at, updated_at,
         story_categories ( id, slug, name, name_de ),
         story_translations ( locale, title, excerpt )`,
      )
      .order("updated_at", { ascending: false });

    if (queryError) {
      setError(queryError.message);
      setLoading(false);
      return;
    }

    const mapped = (data ?? []).map((row) => {
      const translations = row.story_translations as Array<{ locale: string; title: string; excerpt: string | null }>;
      const tr = translations.find((t) => t.locale === "en") ?? translations[0];
      return {
        id: row.id as string,
        slug: row.slug as string,
        status: row.status as StoryListItem["status"],
        hero_image_url: row.hero_image_url as string | null,
        read_time_minutes: row.read_time_minutes as number,
        featured: row.featured as boolean,
        published_at: row.published_at as string | null,
        updated_at: row.updated_at as string,
        category: (Array.isArray(row.story_categories) ? row.story_categories[0] : row.story_categories) as StoryListItem["category"],
        title: tr?.title ?? "(untitled)",
        excerpt: tr?.excerpt ?? null,
      } satisfies StoryListItem;
    });

    setStories(mapped);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function removeStory(id: string) {
    if (!confirm("Delete this story?")) return;
    const { error: deleteError } = await supabase.from("stories").delete().eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl text-forest">Stories</h2>
          <p className="mt-2 text-driftwood text-sm">Your story content for the site.</p>
        </div>
        <Link href="/admin/stories/new" className="admin-btn-primary">
          New story
        </Link>
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {loading ? <p className="text-sm text-driftwood">Loading stories…</p> : null}

      {!loading && stories.length === 0 ? (
        <div className="admin-card text-sm text-driftwood">No stories yet. Create your first one.</div>
      ) : null}

      {!loading && stories.length > 0 ? (
        <div className="admin-card overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Category</th>
                <th>Updated</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {stories.map((story) => (
                <tr key={story.id}>
                  <td>
                    <div className="font-medium text-forest">{story.title}</div>
                    <div className="text-xs text-driftwood mt-1">/{story.slug}</div>
                  </td>
                  <td className="capitalize">{story.status}</td>
                  <td>{story.category?.name ?? "—"}</td>
                  <td>{new Date(story.updated_at).toLocaleString()}</td>
                  <td className="text-right space-x-2 whitespace-nowrap">
                    <Link href={`/admin/stories/${story.id}`} className="text-amber hover:underline text-sm">
                      Edit
                    </Link>
                    <button type="button" onClick={() => void removeStory(story.id)} className="text-red-700 text-sm hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
