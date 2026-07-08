"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { instagramSetupStatus } from "@/lib/cms/instagram-pipeline";
import type { StorySocialPost } from "@/lib/cms/types";

export function AdminInstagramManager() {
  const [posts, setPosts] = useState<StorySocialPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [setupMessage, setSetupMessage] = useState("");

  const load = useCallback(async () => {
    const [{ data: socialData, error: socialError }, { data: settings }] = await Promise.all([
      supabase
        .from("story_social_posts")
        .select("*, stories ( story_translations ( title, locale ) )")
        .eq("platform", "instagram")
        .order("updated_at", { ascending: false }),
      supabase.from("story_pipeline_settings").select("*").eq("id", "global").maybeSingle(),
    ]);

    if (socialError) {
      setError(socialError.message);
      return;
    }

    const mapped = (socialData ?? []).map((row) => {
      const story = row.stories as { story_translations?: Array<{ title: string; locale: string }> } | null;
      const title = story?.story_translations?.find((t) => t.locale === "en")?.title ?? null;
      return {
        id: row.id,
        story_id: row.story_id,
        platform: row.platform,
        caption: row.caption,
        short_caption: row.short_caption,
        hashtags: row.hashtags,
        status: row.status,
        instagram_media_url: row.instagram_media_url,
        used_at: row.used_at,
        created_at: row.created_at,
        updated_at: row.updated_at,
        story_title: title,
      } satisfies StorySocialPost;
    });

    setPosts(mapped);
    setSetupMessage(instagramSetupStatus(settings ?? { social_platforms: ["instagram"], instagram_handle: null } as never).message);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function updatePost(id: string, patch: Partial<StorySocialPost>) {
    const { error: updateError } = await supabase.from("story_social_posts").update(patch).eq("id", id);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    await load();
  }

  async function copyText(label: string, text: string) {
    await navigator.clipboard.writeText(text);
    setSetupMessage(`${label} copied to clipboard.`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl text-forest">Instagram pipeline</h2>
        <p className="mt-2 text-driftwood text-sm">
          Review captions generated when stories are published. Nothing is posted automatically until your Instagram business account is connected.
        </p>
      </div>

      <div className="admin-card text-sm text-driftwood">{setupMessage}</div>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      {posts.length === 0 ? <div className="admin-card text-sm text-driftwood">No Instagram drafts yet. Publish a story to generate one.</div> : null}

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="admin-card space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-medium text-forest">{post.story_title ?? "Untitled story"}</h3>
                <p className="text-xs text-driftwood capitalize mt-1">Status: {post.status}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" className="admin-btn-ghost" onClick={() => void copyText("Caption", post.caption)}>
                  Copy caption
                </button>
                <button
                  type="button"
                  className="admin-btn-primary"
                  onClick={() => void updatePost(post.id, { status: "used", used_at: new Date().toISOString() })}
                >
                  Mark used
                </button>
              </div>
            </div>
            <textarea className="admin-input min-h-[140px]" value={post.caption} onChange={(e) => void updatePost(post.id, { caption: e.target.value })} />
            <textarea className="admin-input min-h-[80px]" value={post.short_caption} onChange={(e) => void updatePost(post.id, { short_caption: e.target.value })} />
          </div>
        ))}
      </div>
    </div>
  );
}
