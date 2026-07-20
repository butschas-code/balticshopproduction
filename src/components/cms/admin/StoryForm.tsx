"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { buildInstagramCaptionDraft } from "@/lib/cms/instagram-pipeline";
import type { StoryCategory, StoryStatus } from "@/lib/cms/types";

type StoryFormProps = {
  storyId?: string;
};

type FormState = {
  slug: string;
  title: string;
  excerpt: string;
  bodyHtml: string;
  heroImageUrl: string;
  heroImageAlt: string;
  categoryId: string;
  status: StoryStatus;
  readTimeMinutes: number;
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
};

const emptyForm: FormState = {
  slug: "",
  title: "",
  excerpt: "",
  bodyHtml: "<p></p>",
  heroImageUrl: "",
  heroImageAlt: "",
  categoryId: "",
  status: "draft",
  readTimeMinutes: 4,
  featured: false,
  seoTitle: "",
  seoDescription: "",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function StoryForm({ storyId }: StoryFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<StoryCategory[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [publishedAt, setPublishedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(storyId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    const { data } = await supabase.from("story_categories").select("id, slug, name, name_de").order("name");
    setCategories((data as StoryCategory[]) ?? []);
  }, []);

  const loadStory = useCallback(async () => {
    if (!storyId) return;
    setLoading(true);

    const { data, error: queryError } = await supabase
      .from("stories")
      .select(
        `id, slug, status, hero_image_url, hero_image_alt, read_time_minutes, featured, published_at, category_id,
         story_translations ( locale, title, excerpt, body_html, seo_title, seo_description )`,
      )
      .eq("id", storyId)
      .maybeSingle();

    if (queryError || !data) {
      setError(queryError?.message ?? "Story not found.");
      setLoading(false);
      return;
    }

    const tr =
      (data.story_translations as Array<{
        locale: string;
        title: string;
        excerpt: string | null;
        body_html: string;
        seo_title: string | null;
        seo_description: string | null;
      }>).find((t) => t.locale === "en") ??
      (data.story_translations as Array<{ title: string; excerpt: string | null; body_html: string; seo_title: string | null; seo_description: string | null }>)[0];

    setForm({
      slug: data.slug,
      title: tr?.title ?? "",
      excerpt: tr?.excerpt ?? "",
      bodyHtml: tr?.body_html ?? "<p></p>",
      heroImageUrl: data.hero_image_url ?? "",
      heroImageAlt: data.hero_image_alt ?? "",
      categoryId: data.category_id ?? "",
      status: data.status as StoryStatus,
      readTimeMinutes: data.read_time_minutes,
      featured: data.featured,
      seoTitle: tr?.seo_title ?? "",
      seoDescription: tr?.seo_description ?? "",
    });
    setPublishedAt(data.published_at ?? null);
    setLoading(false);
  }, [storyId]);

  useEffect(() => {
    void loadCategories();
    void loadStory();
  }, [loadCategories, loadStory]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && !storyId && !prev.slug) {
        next.slug = slugify(String(value));
      }
      return next;
    });
  }

  async function save() {
    setSaving(true);
    setError(null);
    setMessage(null);

    const nextPublishedAt =
      form.status === "published" ? publishedAt ?? new Date().toISOString() : null;
    const storyPayload = {
      slug: form.slug.trim(),
      hero_image_url: form.heroImageUrl.trim() || null,
      hero_image_alt: form.heroImageAlt.trim() || null,
      category_id: form.categoryId || null,
      status: form.status,
      read_time_minutes: form.readTimeMinutes,
      featured: form.featured,
      published_at: nextPublishedAt,
    };

    let id = storyId;
    if (storyId) {
      const { error: updateError } = await supabase.from("stories").update(storyPayload).eq("id", storyId);
      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }
    } else {
      const { data, error: insertError } = await supabase.from("stories").insert(storyPayload).select("id").single();
      if (insertError || !data) {
        setError(insertError?.message ?? "Could not create story.");
        setSaving(false);
        return;
      }
      id = data.id;
    }

    const translationPayload = {
      story_id: id,
      locale: "en",
      title: form.title.trim(),
      excerpt: form.excerpt.trim() || null,
      body_html: form.bodyHtml,
      seo_title: form.seoTitle.trim() || null,
      seo_description: form.seoDescription.trim() || null,
    };

    const { error: translationError } = await supabase.from("story_translations").upsert(translationPayload, {
      onConflict: "story_id,locale",
    });

    if (translationError) {
      setError(translationError.message);
      setSaving(false);
      return;
    }

    if (form.status === "published") {
      const { data: settings } = await supabase.from("story_pipeline_settings").select("*").eq("id", "global").maybeSingle();
      const { caption, shortCaption, hashtags } = buildInstagramCaptionDraft({
        title: form.title,
        excerpt: form.excerpt,
        storyUrl: `${window.location.origin}/en/stories/${form.slug}`,
        brandVoice: settings?.brand_voice ?? "",
        instagramHandle: settings?.instagram_handle,
      });

      await supabase.from("story_social_posts").upsert(
        {
          story_id: id,
          platform: "instagram",
          caption,
          short_caption: shortCaption,
          hashtags,
          instagram_media_url: form.heroImageUrl.trim() || null,
          status: "needs_review",
        },
        { onConflict: "story_id,platform", ignoreDuplicates: false },
      );
    }

    setSaving(false);
    setMessage("Saved.");
    if (!storyId && id) {
      router.replace(`/admin/stories/${id}`);
    }
  }

  if (loading) return <p className="text-sm text-driftwood">Loading story…</p>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl text-forest">{storyId ? "Edit story" : "New story"}</h2>
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {message ? <p className="text-sm text-forest">{message}</p> : null}

      <div className="admin-card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <input className="admin-input mt-1" value={form.title} onChange={(e) => update("title", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Slug</label>
            <input className="admin-input mt-1" value={form.slug} onChange={(e) => update("slug", slugify(e.target.value))} />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Excerpt</label>
          <textarea className="admin-input mt-1 min-h-[80px]" value={form.excerpt} onChange={(e) => update("excerpt", e.target.value)} />
        </div>

        <div>
          <label className="text-sm font-medium">Body (HTML)</label>
          <textarea className="admin-input mt-1 min-h-[220px] font-mono text-xs" value={form.bodyHtml} onChange={(e) => update("bodyHtml", e.target.value)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Hero image URL</label>
            <input className="admin-input mt-1" value={form.heroImageUrl} onChange={(e) => update("heroImageUrl", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Hero image alt</label>
            <input className="admin-input mt-1" value={form.heroImageAlt} onChange={(e) => update("heroImageAlt", e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Category</label>
            <select className="admin-input mt-1" value={form.categoryId} onChange={(e) => update("categoryId", e.target.value)}>
              <option value="">—</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Status</label>
            <select className="admin-input mt-1" value={form.status} onChange={(e) => update("status", e.target.value as StoryStatus)}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Read time (minutes)</label>
            <input
              type="number"
              min={1}
              className="admin-input mt-1"
              value={form.readTimeMinutes}
              onChange={(e) => update("readTimeMinutes", Number(e.target.value))}
            />
          </div>
        </div>

        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} />
          Featured on homepage
        </label>

        <div className="flex gap-3 pt-2">
          <button type="button" className="admin-btn-primary" disabled={saving} onClick={() => void save()}>
            {saving ? "Saving…" : "Save story"}
          </button>
        </div>
      </div>
    </div>
  );
}
