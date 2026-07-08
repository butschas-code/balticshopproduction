import type { ProductType } from "@/lib/shop/taxonomy";

export type ClassifyProductInput = {
  slug: string;
  name?: string;
  description?: string;
  craft?: string;
  artisanSlug?: string;
};

const SET_SLUG_HINTS = /komplekts|mug-and-plate|plate-set|dining-set|espresso-set|plate-mug|trauku-komplekts|pusdienu-trauku-komplekts|set-of-/i;
const SET_TEXT_HINTS =
  /\bset\b|komplekt|mug and plate|plate set|dining set|espresso set|plate & mug|plate and mug|tasse.*teller|cup.*plate|schale.*teller|gentleman.?s set/i;

const SLUG_TYPE_HINTS: Array<{ type: ProductType; patterns: RegExp[] }> = [
  { type: "set", patterns: [SET_SLUG_HINTS] },
  { type: "cup", patterns: [/kruze|krūz|-mug|mug-|-cup\b|cup-/i] },
  { type: "bowl", patterns: [/bloda|blod-|bowl-|bowl\b/i] },
  {
    type: "plate",
    patterns: [/skivis|šķīv|paplate|servejamais|servejam|kuku-skivis|-plate|plate-/i],
  },
  { type: "vase", patterns: [/vaze|vase-/i] },
  { type: "planter", patterns: [/plant-pot|flowerpot|puķu-pod/i] },
  { type: "teapot", patterns: [/teapot|tea-pot|tējkann/i] },
  { type: "pitcher", patterns: [/pitcher|-jug\b|krūk/i] },
  { type: "scarf", patterns: [/scarf/i] },
  { type: "towel", patterns: [/towel|dviel/i] },
  { type: "apron", patterns: [/apron|priekšaut/i] },
  { type: "dress", patterns: [/dress|kleid/i] },
  { type: "shirt", patterns: [/shirt|blouse|-top\b/i] },
  { type: "pants", patterns: [/pants|trousers|bikses/i] },
  { type: "jacket", patterns: [/jacket|coat/i] },
  { type: "blanket", patterns: [/blanket|throw|sega|decke/i] },
  { type: "bag", patterns: [/-bag\b|\bbag-/i] },
  { type: "painting", patterns: [/painting|glezno|studija/i] },
  { type: "game", patterns: [/solitaire|\bgame\b|marble|aromalampa/i] },
  { type: "board", patterns: [/cutting-board|brett/i] },
];

const TEXT_TYPE_RULES: Array<{ type: ProductType; patterns: RegExp[] }> = [
  { type: "set", patterns: [SET_TEXT_HINTS] },
  { type: "teapot", patterns: [/teapot/i, /tea pot/i, /tējkann/i] },
  { type: "pitcher", patterns: [/pitcher/i, /\bjug\b/i, /krūk/i, /kanne/i] },
  { type: "planter", patterns: [/plant pot/i, /flowerpot/i, /puķu pod/i] },
  { type: "vase", patterns: [/\bvase\b/i, /vāz/i, /vaze/i] },
  {
    type: "cup",
    patterns: [
      /aromalampa/i,
      /\bglass\b/i,
      /ein glas/i,
      /coffee mug/i,
      /tea mug/i,
      /\bmug\b/i,
      /\bcup\b/i,
      /krūz/i,
      /kruze/i,
      /becher/i,
      /\btasse\b/i,
    ],
  },
  {
    type: "bowl",
    patterns: [
      /\bbowl\b/i,
      /schüssel/i,
      /\bschale\b/i,
      /soup/i,
      /ramen/i,
      /pasta dish/i,
      /buljona/i,
      /zupas/i,
      /salad bowl/i,
    ],
  },
  {
    type: "plate",
    patterns: [
      /\bplate\b/i,
      /teller/i,
      /šķīv/i,
      /skivis/i,
      /serving plate/i,
      /dinner plate/i,
      /cake plate/i,
      /dessert plate/i,
      /appetizer plate/i,
      /salad plate/i,
      /side plate/i,
      /fruit plate/i,
      /\btray\b/i,
      /paplate/i,
      /servejamais/i,
      /porcelain plate/i,
    ],
  },
  {
    type: "other",
    patterns: [
      /\bdish\b/i,
      /trauci/i,
      /trauks/i,
      /sauce dish/i,
      /garlic dish/i,
      /decorative dish/i,
      /candle holder/i,
      /chopstick/i,
    ],
  },
  { type: "sculpture", patterns: [/sculpture/i, /figurine/i, /statue/i, /dekor/i] },
  { type: "scarf", patterns: [/scarf/i, /šalle/i, /schal/i] },
  { type: "towel", patterns: [/towel/i, /dviel/i, /handtuch/i] },
  { type: "apron", patterns: [/apron/i, /priekšaut/i] },
  { type: "dress", patterns: [/dress/i, /kleid/i] },
  { type: "shirt", patterns: [/shirt/i, /blouse/i, /\btop\b/i] },
  { type: "pants", patterns: [/pants/i, /trousers/i, /bikses/i] },
  { type: "jacket", patterns: [/jacket/i, /coat/i] },
  { type: "blanket", patterns: [/blanket/i, /throw/i, /sega/i, /decke/i] },
  { type: "bag", patterns: [/\bbag\b/i, /soma/i, /tasche/i] },
  {
    type: "textile",
    patterns: [/linen/i, /textile/i, /tablecloth/i, /runner/i, /curtain/i, /cushion/i, /pillow/i],
  },
  { type: "painting", patterns: [/painting/i, /artwork/i, /glezno/i, /study of/i] },
  { type: "game", patterns: [/solitaire/i, /\bgame\b/i, /marble/i] },
  { type: "board", patterns: [/cutting board/i, /brett/i] },
];

function buildHaystack(input: ClassifyProductInput): string {
  return [input.slug.replace(/-/g, " "), input.name, input.description, input.craft]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function inferFromSlug(slug: string): ProductType | null {
  const slugLower = slug.toLowerCase();
  for (const hint of SLUG_TYPE_HINTS) {
    if (hint.patterns.some((pattern) => pattern.test(slugLower))) {
      return hint.type;
    }
  }
  return null;
}

function inferFromText(haystack: string): ProductType | null {
  for (const rule of TEXT_TYPE_RULES) {
    if (rule.patterns.some((pattern) => pattern.test(haystack))) {
      return rule.type;
    }
  }
  return null;
}

function inferCollectionFromArtisan(artisanSlug: string): "linen" | "woodcraft" | "ceramics" {
  if (artisanSlug === "studio-natural") return "linen";
  if (artisanSlug === "raibi-koki") return "woodcraft";
  return "ceramics";
}

export function classifyProductType(input: ClassifyProductInput): ProductType {
  const slugType = inferFromSlug(input.slug);
  if (slugType) return slugType;

  const haystack = buildHaystack(input);
  const textType = inferFromText(haystack);
  if (textType) return textType;

  const collection = inferCollectionFromArtisan(input.artisanSlug || "");
  if (collection === "linen") return "textile";
  if (collection === "woodcraft") return "object";
  return "other";
}

export function resolveProductType(
  stored: ProductType | string | null | undefined,
  input: ClassifyProductInput,
): ProductType {
  const inferred = classifyProductType(input);
  if (inferred !== "other") return inferred;
  if (stored && typeof stored === "string") return stored as ProductType;
  return inferred;
}
