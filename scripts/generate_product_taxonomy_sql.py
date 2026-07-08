#!/usr/bin/env python3
"""Generate SQL to classify products and apply shop curation rules."""

from __future__ import annotations

import re
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SEED = ROOT / "supabase/migrations/20260708130600_seed_catalog_data.sql"
OUT = ROOT / "supabase/migrations/20260708180000_product_taxonomy_and_curation.sql"

COLLECTION_BY_ARTISAN = {
    "studio-natural": "linen",
    "raibi-koki": "woodcraft",
    "cepli": "ceramics",
    "vaidava-ceramics": "ceramics",
    "cerannic": "ceramics",
    "latvijas-labumu-tirgus-mals": "ceramics",
}

PREFERRED_FEATURED = {
    "cepli-zupas-zirnu-bloda",
    "cepli-lezena-salatu-bloda",
    "vaidava-ceramics-plant-pot-with-saucer-s-soil",
    "raibi-koki-lielais-raibis-43x27-cm",
    "cerannic-slow-cup",
}

SET_SLUG_HINTS = re.compile(
    r"komplekts|mug-and-plate|plate-set|dining-set|espresso-set|plate-mug|trauku-komplekts|"
    r"pusdienu-trauku-komplekts|set-of-",
    re.I,
)
SET_TEXT_HINTS = re.compile(
    r"\bset\b|komplekt|mug and plate|plate set|dining set|espresso set|plate & mug|plate and mug|"
    r"tasse.*teller|cup.*plate|schale.*teller|gentleman.?s set",
    re.I,
)

SLUG_TYPE_HINTS: list[tuple[str, list[str | re.Pattern[str]]]] = [
    ("set", [SET_SLUG_HINTS]),
    ("cup", [r"kruze", r"krūz", r"-mug", r"mug-", r"-cup\b", r"cup-"]),
    ("bowl", [r"bloda", r"blod-", r"bowl-", r"bowl\b"]),
    ("plate", [r"skivis", r"šķīv", r"paplate", r"servejamais", r"servejam", r"kuku-skivis", r"-plate", r"plate-"]),
    ("vase", [r"vaze", r"vase-"]),
    ("planter", [r"plant-pot", r"flowerpot", r"puķu-pod"]),
    ("teapot", [r"teapot", r"tea-pot", r"tējkann"]),
    ("pitcher", [r"pitcher", r"-jug\b", r"krūk"]),
    ("scarf", [r"scarf"]),
    ("towel", [r"towel", r"dviel"]),
    ("apron", [r"apron", r"priekšaut"]),
    ("dress", [r"dress", r"kleid"]),
    ("shirt", [r"shirt", r"blouse", r"-top\b"]),
    ("pants", [r"pants", r"trousers", r"bikses"]),
    ("jacket", [r"jacket", r"coat"]),
    ("blanket", [r"blanket", r"throw", r"sega", r"decke"]),
    ("bag", [r"-bag\b", r"\bbag-"]),
    ("painting", [r"painting", r"glezno", r"studija"]),
    ("game", [r"solitaire", r"\bgame\b", r"marble", r"aromalampa"]),
    ("board", [r"cutting-board", r"brett"]),
]

TYPE_RULES: list[tuple[str, list[str]]] = [
    ("set", [SET_TEXT_HINTS.pattern]),
    ("teapot", [r"teapot", r"tea pot", r"tējkann"]),
    ("pitcher", [r"pitcher", r"\bjug\b", r"krūk", r"kanne"]),
    ("planter", [r"plant pot", r"flowerpot", r"puķu pod"]),
    ("vase", [r"\bvase\b", r"\bvāz", r"vaze"]),
    (
        "cup",
        [
            r"aromalampa",
            r"\bglass\b",
            r"ein glas",
            r"coffee mug",
            r"tea mug",
            r"\bmug\b",
            r"\bcup\b",
            r"krūz",
            r"kruze",
            r"becher",
            r"\btasse\b",
        ],
    ),
    (
        "bowl",
        [
            r"\bbowl\b",
            r"schüssel",
            r"\bschale\b",
            r"soup",
            r"ramen",
            r"pasta dish",
            r"buljona",
            r"zupas",
            r"salad bowl",
        ],
    ),
    (
        "plate",
        [
            r"\bplate\b",
            r"teller",
            r"šķīv",
            r"skivis",
            r"serving plate",
            r"dinner plate",
            r"cake plate",
            r"dessert plate",
            r"appetizer plate",
            r"salad plate",
            r"side plate",
            r"fruit plate",
            r"\btray\b",
            r"paplate",
            r"servejamais",
            r"porcelain plate",
        ],
    ),
    (
        "other",
        [
            r"\bdish\b",
            r"trauci",
            r"trauks",
            r"sauce dish",
            r"garlic dish",
            r"decorative dish",
            r"candle holder",
            r"chopstick",
        ],
    ),
    ("sculpture", [r"sculpture", r"figurine", r"statue", r"dekor"]),
    ("scarf", [r"scarf", r"šalle", r"schal"]),
    ("towel", [r"towel", r"dviel", r"handtuch"]),
    ("apron", [r"apron", r"priekšaut"]),
    ("dress", [r"dress", r"kleid", r"krekls"]),
    ("shirt", [r"shirt", r"blouse", r"top\b", r"krekls"]),
    ("pants", [r"pants", r"trousers", r"bikses"]),
    ("jacket", [r"jacket", r"coat", r"jak"]),
    ("blanket", [r"blanket", r"throw", r"sega", r"decke"]),
    ("bag", [r"\bbag\b", r"soma", r"tasche"]),
    ("textile", [r"linen", r"textile", r"fabric", r"tablecloth", r"runner", r"curtain", r"cushion", r"pillow"]),
    ("painting", [r"painting", r"artwork", r"glezno", r"study of"]),
    ("game", [r"solitaire", r"game", r"spēle", r"marble"]),
    ("board", [r"cutting board", r"brett", r"dēlis"]),
]


def parse_products(text: str) -> dict[str, dict]:
    products: dict[str, dict] = {}
    for match in re.finditer(
        r"ar\.id, '([^']+)', '[^']*', '([^']*)', '[^']*', [^,]+, 'EUR', (?:true|false), '([^']*)'",
        text,
        re.I,
    ):
        slug, artisan_name, image_url = match.groups()
        artisan_slug = infer_artisan_slug(slug)
        products[slug] = {
            "slug": slug,
            "artisan_slug": artisan_slug,
            "artisan_name": artisan_name,
            "image_url": image_url,
            "name": "",
            "description": "",
            "craft": "",
        }

    for match in re.finditer(
        r"insert into public\.product_translations[^;]+where pr\.slug = '([^']+)';",
        text,
        re.I,
    ):
        slug = match.group(1)
        if slug not in products:
            continue
        chunk = match.group(0)
        if ", 'en', '" not in chunk:
            continue
        en_part = chunk.split(", 'en', ", 1)[1]
        parts = []
        current = ""
        in_quote = False
        for char in en_part:
            if char == "'" and not current.endswith("\\"):
                if in_quote:
                    parts.append(current)
                    current = ""
                    in_quote = False
                    if len(parts) >= 5:
                        break
                    continue
                in_quote = True
                continue
            if in_quote:
                current += char
        if len(parts) >= 5:
            products[slug]["name"] = parts[0]
            products[slug]["description"] = parts[1]
            products[slug]["craft"] = parts[4]

    return products


def infer_artisan_slug(slug: str) -> str:
    for artisan in COLLECTION_BY_ARTISAN:
        if slug.startswith(artisan):
            return artisan
    return slug.split("-")[0]


def infer_product_type(slug: str, name: str, description: str, craft: str) -> str:
    slug_lower = slug.lower()

    for product_type, patterns in SLUG_TYPE_HINTS:
        for pattern in patterns:
            if isinstance(pattern, re.Pattern):
                if pattern.search(slug_lower):
                    return product_type
            elif pattern in slug_lower:
                return product_type
            elif re.search(pattern, slug_lower, re.I):
                return product_type

    haystack = " ".join([slug.replace("-", " "), name, description, craft]).lower()

    for product_type, patterns in TYPE_RULES:
        if any(re.search(p, haystack, re.I) for p in patterns):
            return product_type

    collection = COLLECTION_BY_ARTISAN.get(infer_artisan_slug(slug), "ceramics")
    if collection == "linen":
        return "textile"
    if collection == "woodcraft":
        return "object"
    return "other"


def normalize_cluster_key(slug: str, product_type: str) -> str:
    base = re.sub(r"-\d+$", "", slug)
    base = re.sub(r"-\d{2,}$", "", base)
    return f"{product_type}:{base}"


def sql_quote(value: str) -> str:
    return value.replace("'", "''")


def main() -> None:
    text = SEED.read_text(encoding="utf-8")
    products = parse_products(text)

    for slug, row in products.items():
        row["collection_slug"] = COLLECTION_BY_ARTISAN.get(row["artisan_slug"], "ceramics")
        row["product_type"] = infer_product_type(
            slug,
            row.get("name", ""),
            row.get("description", ""),
            row.get("craft", ""),
        )
        row["is_featured"] = slug in PREFERRED_FEATURED
        row["shop_visible"] = True
        row["shop_rank"] = 500

    groups: dict[tuple[str, str, str], list[str]] = defaultdict(list)
    for slug, row in products.items():
        cluster = normalize_cluster_key(slug, row["product_type"])
        groups[(row["artisan_slug"], row["product_type"], cluster)].append(slug)

    for (artisan_slug, product_type, _cluster), slugs in groups.items():
        slugs.sort()
        visible_limit = 3 if product_type in {"vase", "cup", "bowl", "plate"} else 4
        if artisan_slug == "studio-natural":
            visible_limit = 5
        for index, slug in enumerate(slugs):
            rank = index + 1
            products[slug]["shop_rank"] = rank
            if slug in PREFERRED_FEATURED:
                products[slug]["is_featured"] = True
                products[slug]["shop_visible"] = True
                continue
            products[slug]["shop_visible"] = rank <= visible_limit

    # One featured hero per artisan + product type (rank 1, visible)
    featured_keys: set[tuple[str, str]] = set()
    for slug, row in sorted(products.items(), key=lambda item: (item[1]["shop_rank"], item[0])):
        if not row["shop_visible"]:
            continue
        key = (row["artisan_slug"], row["product_type"])
        if key in featured_keys:
            continue
        if row["product_type"] in {"other", "textile", "object"} and slug not in PREFERRED_FEATURED:
            continue
        row["is_featured"] = True
        featured_keys.add(key)

    for slug in PREFERRED_FEATURED:
        if slug in products:
            products[slug]["is_featured"] = True
            products[slug]["shop_visible"] = True

    for slug, row in products.items():
        if row["collection_slug"] == "woodcraft":
            row["is_featured"] = True
            row["shop_visible"] = True

    # Cap featured per collection for a tighter editorial default view
    caps = {"ceramics": 24, "linen": 16, "woodcraft": 5}
    for collection, cap in caps.items():
        featured_slugs = [
            slug
            for slug, row in sorted(
                products.items(),
                key=lambda item: (0 if item[1]["slug"] in PREFERRED_FEATURED else 1, item[1]["shop_rank"], item[0]),
            )
            if row["collection_slug"] == collection and row["is_featured"]
        ]
        for slug in featured_slugs[cap:]:
            if slug not in PREFERRED_FEATURED:
                products[slug]["is_featured"] = False

    lines = [
        "-- Product taxonomy, labels, and shop curation",
        "begin;",
        "",
        "alter table public.products",
        "  add column if not exists collection_slug text,",
        "  add column if not exists product_type text,",
        "  add column if not exists is_featured boolean not null default false,",
        "  add column if not exists shop_visible boolean not null default true,",
        "  add column if not exists shop_rank integer not null default 1000;",
        "",
        "create index if not exists products_collection_slug_idx on public.products(collection_slug);",
        "create index if not exists products_product_type_idx on public.products(product_type);",
        "create index if not exists products_shop_visible_idx on public.products(shop_visible);",
        "create index if not exists products_is_featured_idx on public.products(is_featured);",
        "",
    ]

    for slug, row in sorted(products.items()):
        lines.append(
            "update public.products set "
            f"collection_slug = '{sql_quote(row['collection_slug'])}', "
            f"product_type = '{sql_quote(row['product_type'])}', "
            f"is_featured = {'true' if row['is_featured'] else 'false'}, "
            f"shop_visible = {'true' if row['shop_visible'] else 'false'}, "
            f"shop_rank = {row['shop_rank']} "
            f"where slug = '{sql_quote(slug)}';"
        )

    featured_count = sum(1 for r in products.values() if r["is_featured"])
    visible_count = sum(1 for r in products.values() if r["shop_visible"])
    lines.extend(["", "commit;", ""])
    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUT.name}: {len(products)} products, {featured_count} featured, {visible_count} visible")


if __name__ == "__main__":
    main()
