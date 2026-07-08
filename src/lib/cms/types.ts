export type StoryStatus = "draft" | "published" | "archived";
export type CmsRole = "admin" | "editor";
export type SocialPostStatus = "needs_review" | "ready" | "used" | "skipped";

export type StoryCategory = {
  id: string;
  slug: string;
  name: string;
  name_de: string | null;
};

export type StoryListItem = {
  id: string;
  slug: string;
  status: StoryStatus;
  hero_image_url: string | null;
  read_time_minutes: number;
  featured: boolean;
  published_at: string | null;
  updated_at: string;
  category: StoryCategory | null;
  title: string;
  excerpt: string | null;
};

export type StoryDetail = StoryListItem & {
  hero_image_alt: string | null;
  body_html: string;
  seo_title: string | null;
  seo_description: string | null;
  locale: string;
};

export type StorySocialPost = {
  id: string;
  story_id: string | null;
  platform: "instagram";
  caption: string;
  short_caption: string;
  hashtags: string;
  status: SocialPostStatus;
  instagram_media_url: string | null;
  used_at: string | null;
  created_at: string;
  updated_at: string;
  story_title?: string | null;
};

export type PipelineSettings = {
  id: string;
  enabled: boolean;
  social_platforms: string[];
  brand_voice: string;
  instagram_handle: string | null;
  openai_model: string;
  auto_generate_instagram: boolean;
};

export type PipelineTopic = {
  id: string;
  title: string;
  brief: string | null;
  status: "queued" | "processing" | "completed" | "failed";
  error_message: string | null;
  created_at: string;
};
