import type { PipelineSettings } from "./types";

export function buildInstagramCaptionDraft(input: {
  title: string;
  excerpt: string;
  storyUrl: string;
  brandVoice: string;
  instagramHandle?: string | null;
}) {
  const handle = input.instagramHandle?.trim();
  const hashtags = [
    "#BalticArtisan",
    "#SlowLuxury",
    "#Handcrafted",
    "#BalticCraft",
    "#ArtisanStories",
  ].join(" ");

  const caption = [
    input.title,
    "",
    input.excerpt,
    "",
    "Read the full story on our stories page.",
    input.storyUrl,
    handle ? `\n@${handle.replace(/^@/, "")}` : "",
    "",
    hashtags,
  ]
    .filter(Boolean)
    .join("\n");

  const shortCaption = [input.title, "", input.excerpt.slice(0, 180), "", hashtags].join("\n");

  return { caption, shortCaption, hashtags };
}

export function defaultPipelineSettings(): PipelineSettings {
  return {
    id: "global",
    enabled: false,
    social_platforms: ["instagram"],
    brand_voice: "Calm Baltic luxury editorial voice. Poetic, premium, nature-inspired.",
    instagram_handle: null,
    openai_model: "gpt-4.1-mini",
    auto_generate_instagram: true,
  };
}

export function instagramSetupStatus(settings: PipelineSettings) {
  const hasHandle = Boolean(settings.instagram_handle?.trim());
  const hasMetaEnv =
    Boolean(process.env.INSTAGRAM_ACCESS_TOKEN?.trim()) &&
    Boolean(process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID?.trim());

  return {
    configured: hasHandle && hasMetaEnv,
    hasHandle,
    hasMetaEnv,
    message: hasMetaEnv
      ? hasHandle
        ? "Instagram API credentials are set. Connect your business account in Meta Business Suite when ready."
        : "Add your Instagram handle in pipeline settings."
      : "Instagram account not connected yet. Add INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_BUSINESS_ACCOUNT_ID when your business account is ready.",
  };
}
