export type ShopCollection = "linen" | "woodcraft" | "ceramics";

export type ProductType =
  | "bowl"
  | "cup"
  | "plate"
  | "vase"
  | "planter"
  | "pitcher"
  | "teapot"
  | "sculpture"
  | "set"
  | "scarf"
  | "towel"
  | "apron"
  | "dress"
  | "shirt"
  | "pants"
  | "jacket"
  | "blanket"
  | "bag"
  | "textile"
  | "painting"
  | "game"
  | "board"
  | "object"
  | "other";

export const SHOP_COLLECTIONS: ShopCollection[] = ["linen", "woodcraft", "ceramics"];

export const COLLECTION_ARTISANS: Record<ShopCollection, string[]> = {
  linen: ["studio-natural"],
  woodcraft: ["raibi-koki"],
  ceramics: ["vaidava-ceramics", "cepli", "cerannic", "latvijas-labumu-tirgus-mals"],
};

export const COLLECTION_TYPES: Record<ShopCollection, ProductType[]> = {
  ceramics: ["bowl", "cup", "plate", "vase", "planter", "pitcher", "teapot", "sculpture", "set", "other"],
  linen: ["scarf", "towel", "apron", "dress", "shirt", "pants", "jacket", "blanket", "bag", "textile", "other"],
  woodcraft: ["painting", "game", "board", "object", "other"],
};

export const COLLECTION_EDITORIAL: Record<
  ShopCollection,
  { titleKey: string; subtitleKey: string; moodKey: string }
> = {
  ceramics: {
    titleKey: "ceramicsEditorialTitle",
    subtitleKey: "ceramicsEditorialSubtitle",
    moodKey: "ceramicsMood",
  },
  linen: {
    titleKey: "linenEditorialTitle",
    subtitleKey: "linenEditorialSubtitle",
    moodKey: "linenMood",
  },
  woodcraft: {
    titleKey: "woodcraftEditorialTitle",
    subtitleKey: "woodcraftEditorialSubtitle",
    moodKey: "woodcraftMood",
  },
};

import { classifyProductType } from "@/lib/shop/classify-product";

export function inferCollectionFromArtisan(artisanSlug: string): ShopCollection {
  if (artisanSlug === "studio-natural") return "linen";
  if (artisanSlug === "raibi-koki") return "woodcraft";
  return "ceramics";
}

export function inferProductType(input: {
  slug: string;
  name?: string;
  description?: string;
  craft?: string;
  artisanSlug?: string;
}): ProductType {
  return classifyProductType(input);
}

export function isShopCollection(value: string | null | undefined): value is ShopCollection {
  return value === "linen" || value === "woodcraft" || value === "ceramics";
}

export function isProductType(value: string | null | undefined): value is ProductType {
  return COLLECTION_TYPES.ceramics.includes(value as ProductType)
    || COLLECTION_TYPES.linen.includes(value as ProductType)
    || COLLECTION_TYPES.woodcraft.includes(value as ProductType);
}
