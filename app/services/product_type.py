"""Product type detection for classification and search.

Every product is assigned one product_type via keyword mapping and priority rules.
Used at ingestion and for intent-based search (search by type, not raw keywords).
"""

from __future__ import annotations

import re
from dataclasses import dataclass

from app.services.normalize import normalize_text


@dataclass
class ProductTypeRule:
    """One product type: include keywords (any match) and exclude keywords (disqualify)."""
    key: str
    include: list[str]   # normalized tokens/phrases that indicate this type
    exclude: list[str]  # if present, do not assign this type
    priority: int = 0    # higher = checked first


def _r(key: str, include: list[str], exclude: list[str], priority: int = 0) -> ProductTypeRule:
    return ProductTypeRule(key=key, include=[normalize_text(x) for x in include],
                           exclude=[normalize_text(x) for x in exclude], priority=priority)


# ---------------------------------------------------------------------------
# 40–60 product types: include + exclude, priority for disambiguation
# Keys must align with search intent (product_taxonomy category keys) where used for search.
# ---------------------------------------------------------------------------

PRODUCT_TYPE_RULES: list[ProductTypeRule] = [
    # Household & personal care (high priority so "toilet paper" doesn't become "paper")
    _r("toilet_paper", ["tualetes papirs", "tualetes papīrs", "toilet paper", "wc papirs"], ["ēdiens", "maize", "saldejums"], 100),
    _r("dish_soap", ["trauku", "dish soap", "fairy", "trauku mazg", "mazgāšanas līdzeklis traukiem"], ["ēdiens", "zupa", "maize", "piens", "gala"], 100),
    _r("laundry_detergent", ["velas", "veļas", "laundry", "washing", "pulveris mazg", "mazgāšanas pulveris"], ["ēdiens", "zupa", "trauku"], 100),
    _r("shampoo", ["sampuns", "šampūns", "shampoo"], ["ēdiens", "zupa", "maize"], 95),
    _r("toothpaste", ["zobu pasta", "toothpaste", "zobu ziepes"], ["ēdiens", "makaroni", "maize", "pasta"], 95),
    _r("soap", ["ziepes", "soap", "hand soap"], ["trauku", "veļas", "zobu", "maize"], 90),
    _r("deodorant", ["deodorant", "deodorants"], [], 90),
    _r("tissue", ["saldētājā kaktiņi", "tissue", "kaktiņi", "paper handkerchief"], ["tualetes", "toilet"], 85),
    _r("kitchen_roll", ["virtuves ruļļi", "kitchen roll", "papīra ruļļi ēdamistabai"], ["tualetes", "toilet"], 85),

    # Dairy (order matters: yogurt/cheese/butter before milk so "yogurt" doesn't match milk)
    _r("yogurt", ["jogurts", "jogurti", "yoghurt", "yogurt"], ["saldējums", "deserts", "zupa", "merce"], 80),
    _r("cheese", ["siers", "sieri", "cheese", "mozzarella", "cheddar", "brie", "feta"], ["sieriņš", "deserts", "biezpiens", "ziepes"], 80),
    _r("butter", ["sviests", "butter"], ["margarīns", "ziepes", "siers", "deserts"], 80),
    _r("cream", ["krējums", "krejums", "cream", "smetana"], ["siers", "ziepes", "deserts kūka"], 78),
    _r("sour_cream", ["skābais krējums", "sour cream", "skabais krejums"], [], 79),
    _r("cottage_cheese", ["biezpiens", "cottage cheese", "biezpiens"], ["siers", "ziepes"], 79),
    _r("milk", ["piens", "piena", "milk", "uht", "bez laktozes", "sojas piens", "auzu piens", "rīsu piens"], ["jogurts", "siers", "sviests", "iebiezināts", "kondensētais", "saldējums", "šokolāde", "cepumi", "merce"], 70),

    # Meat & fish
    _r("chicken", ["vista", "vistas", "chicken", "fileja", "file"], ["zupa", "deserts", "saldējums", "buljons"], 75),
    _r("beef", ["liellops", "liellopa", "gala", "beef", "steak"], ["vista", "cūka", "zivis", "deserts"], 75),
    _r("pork", ["cūka", "cūkas", "pork", "cūkas gala"], ["vista", "zivis", "deserts"], 75),
    _r("minced_meat", ["malta gala", "malta gaļa", "minced", "ground meat", "farš"], ["vista", "deserts", "saldējums"], 76),
    _r("sausage", ["desa", "desas", "sausage", "wurst", "kolbasa"], ["zupa", "mērce"], 74),
    _r("fish", ["zivis", "zivs", "fish", "lasi", "sardines", "tuna", "salmon"], ["ēdiens", "eļļa", "deserts"], 74),

    # Eggs
    _r("eggs", ["olas", "ola", "eggs", "egg"], ["majonēze", "cepumi", "deserts", "saldējums"], 75),

    # Bakery & grains
    _r("bread", ["maize", "maizite", "rupjmaize", "bread", "loaf"], ["flakes", "popkorns", "milti", "ziepes", "batonins"], 75),
    _r("rice", ["rīsi", "risi", "rice", "basmati", "jasmin", "jasmine"], ["kūka", "pudins", "deserts", "flakes", "sauce"], 75),
    _r("pasta", ["makaroni", "spageti", "penne", "pasta", "noodles"], ["merce", "sauce", "deserts"], 75),
    _r("flour", ["milti", "flour"], ["kūka", "cepumi", "maize", "deserts"], 74),
    _r("cereal", ["graudu pārslas", "cereal", "corn flakes", "mīkla"], ["maize", "ziepes"], 73),
    _r("oats", ["auzu", "oats", "oatmeal", "auzu pārslas"], [], 73),

    # Vegetables
    _r("potatoes", ["kartupeli", "kartupeļi", "potatoes", "potato"], ["milti", "čipsi", "chips", "deserts"], 75),
    _r("onion", ["sipoli", "sīpoli", "onion", "onions"], ["merce", "sauce", "čipsi"], 74),
    _r("tomato", ["tomati", "tomāti", "tomato", "tomatoes"], ["merce", "sula", "deserts", "ketchup"], 74),
    _r("carrot", ["burkāni", "burkani", "carrot", "carrots"], [], 72),
    _r("cucumber", ["gurki", "cucumber", "cucumbers"], [], 72),
    _r("lettuce", ["salāti", "salati", "lettuce", "salad"], ["mērce", "sauce"], 71),
    _r("frozen_vegetables", ["saldēti darzeni", "saldēti dārzeņi", "frozen vegetables"], ["svaigi", "sula", "deserts"], 76),

    # Fruit
    _r("banana", ["banani", "banāni", "banana", "bananas"], ["kūka", "maize", "deserts", "čipsi", "dzeriens"], 75),
    _r("apple", ["aboli", "āboli", "apple", "apples"], ["sula", "dzeriens", "deserts", "čipsi"], 75),
    _r("avocado", ["avokado", "avocado", "avo"], ["merce", "čipsi", "eļļa", "salsas"], 75),
    _r("orange", ["apelsini", "apelsīni", "orange", "oranges"], ["sula", "dzeriens"], 74),
    _r("lemon", ["citroni", "lemon", "lemons"], ["sula", "dzeriens", "merce"], 73),
    _r("berries", ["ogu", "ogas", "berries", "zemenes", "aveņas", "mellenes"], ["saldējums", "dzeriens", "sula"], 73),
    _r("grapes", ["vīnogas", "vinogas", "grapes"], [], 72),

    # Drinks
    _r("water", ["udens", "ūdens", "water"], ["gāze", "garša", "sula", "minerāl"], 74),
    _r("juice", ["sula", "juice"], ["deserts", "merce", "saldējums"], 74),
    _r("coffee", ["kafija", "coffee", "graudi", "malts"], ["dzeriens", "ledus", "kapsulas", "gatavs"], 75),
    _r("tea", ["teja", "tēja", "tea"], ["dzeriens", "ledus", "deserts"], 75),
    _r("soda", ["gāzēts", "soda", "cola", "limonāde", "soft drink"], [], 72),
    _r("beer", ["alus", "beer", "bīrs"], [], 73),
    _r("wine", ["vīns", "vins", "wine"], [], 73),

    # Pantry & condiments
    _r("oil", ["ella", "eļļa", "oil", "oleja"], [], 74),
    _r("salt", ["sals", "sāls", "salt"], ["deserts", "rieksti"], 73),
    _r("sugar", ["cukurs", "sugar"], ["aizvietotājs", "deserts", "saldējums"], 73),
    _r("honey", ["medus", "honey"], [], 73),
    _r("ketchup", ["ketčups", "ketchup", "tomātu mērce"], [], 72),
    _r("mayonnaise", ["majonēze", "mayonnaise"], [], 72),
    _r("mustard", ["sinepes", "mustard"], [], 72),
    _r("jam", ["ievārījums", "ievarijums", "jam", "marmelade"], [], 72),

    # Snacks & sweets
    _r("chocolate", ["sokolade", "šokolāde", "chocolate"], ["merce", "sula", "cepumi"], 74),
    _r("cookies", ["cepumi", "cookies", "biscuits"], ["saldējums", "maize", "deserts"], 74),
    _r("chips", ["čipsi", "chips"], ["kartupeļi", "dārzeņi", "deserts"], 74),
    _r("ice_cream", ["saldējums", "saldejums", "ice cream"], ["merce", "zupa", "maize"], 75),
    _r("nuts", ["rieksti", "nuts", "mandeles", "riekstiņi"], ["sāls", "salt"], 72),

    # Canned & legumes
    _r("beans", ["pupi", "beans", "pākšaugi"], [], 72),
    _r("lentils", ["lēcas", "lentils", "lecas"], [], 72),
    _r("canned_tomatoes", ["tomātu paste", "tomato paste", "konservēti tomāti"], ["svaigi", "sula"], 71),

    # Baby & pet
    _r("baby_food", ["bērnu", "baby", "zīdaiņu"], ["pieaugušo"], 85),
    _r("pet_food", ["suņu", "kaķu", "pet food", "dog", "cat", "zīdītāji"], ["ēdiens cilvēkiem"], 84),

    # Default / uncategorized
]

# Optional: related types for "include related items" (e.g. milk → show yogurt, cheese, butter)
RELATED_PRODUCT_TYPES: dict[str, list[str]] = {
    "milk": ["yogurt", "cheese", "butter", "cream", "sour_cream", "cottage_cheese"],
    "yogurt": ["milk", "cheese", "butter", "cream"],
    "cheese": ["milk", "yogurt", "butter", "cream", "cottage_cheese"],
    "butter": ["milk", "cheese", "cream"],
    "bread": ["cereal", "oats", "flour"],
    "rice": ["pasta", "flour", "cereal"],
    "chicken": ["beef", "pork", "minced_meat", "sausage", "fish"],
    "beef": ["chicken", "pork", "minced_meat", "sausage"],
    "dish_soap": ["laundry_detergent", "soap"],
    "laundry_detergent": ["dish_soap", "soap"],
    "toilet_paper": ["tissue", "kitchen_roll"],
}


def _text_matches_tokens(text_norm: str, tokens: list[str]) -> bool:
    """True if any token appears as whole word or leading part of word in text."""
    for t in tokens:
        if not t:
            continue
        if re.search(r"\b" + re.escape(t) + r"\b", text_norm):
            return True
        if len(t) >= 3 and re.search(r"\b" + re.escape(t), text_norm):
            return True
    return False


def detect_product_type(title: str, category: str | None = None) -> str:
    """Classify product into a single product_type from title (and optional category).

    Uses keyword mapping and priority: higher-priority rules are checked first.
    A product gets a type if it matches any include token and no exclude token.
    Returns type key or empty string if no match.
    """
    if not (title or "").strip():
        return ""

    text = f"{title or ''} {category or ''}".strip()
    norm = normalize_text(text)

    # Sort by priority descending (higher first)
    sorted_rules = sorted(PRODUCT_TYPE_RULES, key=lambda r: (-r.priority, r.key))

    for rule in sorted_rules:
        if _text_matches_tokens(norm, rule.exclude):
            continue
        if _text_matches_tokens(norm, rule.include):
            return rule.key

    return ""
