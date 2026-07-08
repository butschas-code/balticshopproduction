import { createClient } from "@supabase/supabase-js";
import type { StoryCategory, StoryDetail, StoryListItem } from "./types";

function getPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

type StoryRow = {
  id: string;
  slug: string;
  status: string;
  hero_image_url: string | null;
  hero_image_alt: string | null;
  read_time_minutes: number;
  featured: boolean;
  published_at: string | null;
  updated_at: string;
  story_categories:
    | { id: string; slug: string; name: string; name_de: string | null }
    | { id: string; slug: string; name: string; name_de: string | null }[]
    | null;
  story_translations: Array<{
    locale: string;
    title: string;
    excerpt: string | null;
    body_html: string;
    seo_title: string | null;
    seo_description: string | null;
  }>;
};

function normalizeCategory(value: StoryRow["story_categories"]): StoryCategory | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value;
}

function pickTranslation(row: StoryRow, locale: string) {
  return (
    row.story_translations.find((t) => t.locale === locale) ??
    row.story_translations.find((t) => t.locale === "en") ??
    row.story_translations[0]
  );
}

function mapListItem(row: StoryRow, locale: string): StoryListItem | null {
  const tr = pickTranslation(row, locale);
  if (!tr) return null;

  return {
    id: row.id,
    slug: row.slug,
    status: row.status as StoryListItem["status"],
    hero_image_url: row.hero_image_url,
    read_time_minutes: row.read_time_minutes,
    featured: row.featured,
    published_at: row.published_at,
    updated_at: row.updated_at,
    category: normalizeCategory(row.story_categories),
    title: tr.title,
    excerpt: tr.excerpt,
  };
}

function mapDetail(row: StoryRow, locale: string): StoryDetail | null {
  const base = mapListItem(row, locale);
  const tr = pickTranslation(row, locale);
  if (!base || !tr) return null;

  return {
    ...base,
    hero_image_alt: row.hero_image_alt,
    body_html: tr.body_html,
    seo_title: tr.seo_title,
    seo_description: tr.seo_description,
    locale: tr.locale,
  };
}

const storySelect = `
  id, slug, status, hero_image_url, hero_image_alt, read_time_minutes, featured, published_at, updated_at,
  story_categories ( id, slug, name, name_de ),
  story_translations ( locale, title, excerpt, body_html, seo_title, seo_description )
`;

export async function getPublishedStories(locale: string, limit = 50): Promise<StoryListItem[]> {
  const client = getPublicClient();
  if (!client) return [];

  const { data, error } = await client
    .from("stories")
    .select(storySelect)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return (data as unknown as StoryRow[])
    .map((row) => mapListItem(row, locale))
    .filter((row): row is StoryListItem => row !== null);
}

export async function getPublishedStoryBySlug(slug: string, locale: string): Promise<StoryDetail | null> {
  const client = getPublicClient();
  if (!client) return null;

  const { data, error } = await client
    .from("stories")
    .select(storySelect)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return null;
  return mapDetail(data as unknown as StoryRow, locale);
}

export function formatReadTime(minutes: number, locale: string) {
  const label = locale === "de" ? "Min. Lesezeit" : "min read";
  return `${minutes} ${label}`;
}

export function formatStoryDate(iso: string | null, locale: string) {
  if (!iso) return "";
  return new Intl.DateTimeFormat(locale === "de" ? "de-DE" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}
