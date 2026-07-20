export type ShopCollection = "linen" | "woodcraft" | "ceramics" | "baskets";

export type ProductType =
  | "bowl"
  | "cup"
  | "plate"
  | "vase"
  | "teapot"
  | "set"
  | "scarf"
  | "towel"
  | "apron"
  | "dress"
  | "shirt"
  | "jacket"
  | "blanket"
  | "bag"
  | "textile"
  | "painting"
  | "game"
  | "object"
  | "flower-basket"
  | "firewood-basket"
  | "travel-basket"
  | "bottle-basket"
  | "shopping-basket"
  | "mushroom-basket"
  | "round-basket"
  | "gift-basket"
  | "bicycle-basket"
  | "laundry-basket"
  | "lamp"
  | "animal-basket"
  | "box"
  | "magazine-basket"
  | "wall-basket"
  | "tray"
  | "children-basket"
  | "umbrella-basket"
  | "other";

export const SHOP_COLLECTIONS: ShopCollection[] = ["linen", "woodcraft", "ceramics", "baskets"];

export const COLLECTION_ARTISANS: Record<ShopCollection, string[]> = {
  linen: ["studio-natural"],
  woodcraft: ["raibi-koki"],
  ceramics: ["vaidava-ceramics", "cepli", "cerannic", "latvijas-labumu-tirgus-mals"],
  baskets: ["pinumu-pasaule"],
};

export const COLLECTION_TYPES: Record<ShopCollection, ProductType[]> = {
  ceramics: ["bowl", "cup", "plate", "vase", "teapot", "set", "other"],
  linen: ["scarf", "towel", "apron", "dress", "shirt", "jacket", "blanket", "bag", "textile", "other"],
  woodcraft: ["painting", "game", "object", "other"],
  baskets: [
    "flower-basket",
    "firewood-basket",
    "travel-basket",
    "bottle-basket",
    "shopping-basket",
    "mushroom-basket",
    "round-basket",
    "gift-basket",
    "bicycle-basket",
    "laundry-basket",
    "lamp",
    "animal-basket",
    "box",
    "magazine-basket",
    "wall-basket",
    "tray",
    "children-basket",
    "umbrella-basket",
    "other",
  ],
};

export const COLLECTION_TYPE_GROUPS: Record<
  ShopCollection,
  Array<{ id: string; labelKey: string; types: ProductType[] }>
> = {
  ceramics: [
    { id: "tableware", labelKey: "typeGroups.tableware", types: ["bowl", "cup", "plate", "set"] },
    { id: "vessels", labelKey: "typeGroups.vessels", types: ["vase", "teapot"] },
    { id: "objects", labelKey: "typeGroups.objects", types: ["other"] },
  ],
  linen: [
    { id: "apparel", labelKey: "typeGroups.apparel", types: ["scarf", "dress", "shirt", "jacket", "apron"] },
    { id: "home", labelKey: "typeGroups.homeTextiles", types: ["towel", "blanket", "bag", "textile", "other"] },
  ],
  woodcraft: [
    { id: "all", labelKey: "typeGroups.woodcraft", types: ["painting", "game", "object", "other"] },
  ],
  baskets: [
    {
      id: "basketCarrying",
      labelKey: "typeGroups.basketCarrying",
      types: [
        "firewood-basket",
        "travel-basket",
        "bottle-basket",
        "shopping-basket",
        "mushroom-basket",
        "round-basket",
        "gift-basket",
        "bicycle-basket",
        "laundry-basket",
      ],
    },
    {
      id: "basketHome",
      labelKey: "typeGroups.basketHome",
      types: ["lamp", "animal-basket", "box", "magazine-basket", "wall-basket", "tray", "children-basket", "umbrella-basket"],
    },
    {
      id: "basketGarden",
      labelKey: "typeGroups.basketGarden",
      types: ["flower-basket"],
    },
  ],
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
  baskets: {
    titleKey: "basketsEditorialTitle",
    subtitleKey: "basketsEditorialSubtitle",
    moodKey: "basketsMood",
  },
};

import { classifyProductType } from "@/lib/shop/classify-product";

export function inferCollectionFromArtisan(artisanSlug: string): ShopCollection {
  if (artisanSlug === "studio-natural") return "linen";
  if (artisanSlug === "raibi-koki") return "woodcraft";
  if (artisanSlug === "pinumu-pasaule") return "baskets";
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
  return value === "linen" || value === "woodcraft" || value === "ceramics" || value === "baskets";
}

export function isProductType(value: string | null | undefined): value is ProductType {
  return COLLECTION_TYPES.ceramics.includes(value as ProductType)
    || COLLECTION_TYPES.linen.includes(value as ProductType)
    || COLLECTION_TYPES.woodcraft.includes(value as ProductType)
    || COLLECTION_TYPES.baskets.includes(value as ProductType);
}
