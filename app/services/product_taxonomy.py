"""Structured product taxonomy: core categories only.

Scalable structure: Category with key, display names, synonyms, required/exclude tokens, priority.
~35 core categories. Use detect_category(query) for intent; extend CATEGORIES to add more.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

from app.services.normalize import normalize_text, tokenize


@dataclass
class Category:
    """One taxonomy category for strict product search."""
    key: str
    display_lv: str
    display_en: str
    synonyms_lv: list[str]
    synonyms_en: list[str]
    required_tokens: list[str]
    exclude_tokens: list[str]
    priority: int = 0


def _c(
    key: str,
    display_lv: str,
    display_en: str,
    synonyms_lv: list[str],
    synonyms_en: list[str],
    required: list[str],
    exclude: list[str],
    priority: int = 0,
) -> Category:
    return Category(
        key=key,
        display_lv=display_lv,
        display_en=display_en,
        synonyms_lv=synonyms_lv,
        synonyms_en=synonyms_en,
        required_tokens=required,
        exclude_tokens=exclude,
        priority=priority,
    )


# ---------------------------------------------------------------------------
# ~35 core categories (required_tokens = must appear; exclude_tokens = must not)
# ---------------------------------------------------------------------------

CATEGORIES: list[Category] = [
    _c("milk", "piens", "milk", ["piens", "piena"], ["milk", "milks"], ["piens"], ["šokolāde", "cepumi", "saldējums", "mērce", "milka", "batonins", "konfektes"]),
    _c("yogurt", "jogurts", "yogurt", ["jogurts", "jogurti"], ["yogurt", "yogurts"], ["jogurts", "jogurti"], ["saldējums", "deserts", "zupa", "mērce"]),
    _c("butter", "sviests", "butter", ["sviests"], ["butter"], ["sviests"], ["margarīns", "ziepes", "siers", "deserts"]),
    _c("cheese", "siers", "cheese", ["siers", "sieri"], ["cheese"], ["siers", "sieri"], ["sieriņš", "deserts", "biezpiens", "ziepes"]),
    _c("eggs", "olas", "eggs", ["olas", "ola"], ["eggs", "egg"], ["olas", "ola"], ["majonēze", "cepumi", "deserts", "saldējums"]),
    _c("bread", "maize", "bread", ["maize", "maizīte", "rupjmaize"], ["bread"], ["maize", "maizite", "rupjmaize"], ["flakes", "popkorns", "milti", "ziepes"]),
    _c("rice", "rīsi", "rice", ["rīsi", "risi"], ["rice"], ["risi"], ["kūka", "pudins", "deserts", "flakes"]),
    _c("pasta", "makaroni", "pasta", ["makaroni", "spageti", "penne"], ["pasta"], ["makaroni", "spageti", "penne"], ["mērce", "sauce", "deserts"]),
    _c("potatoes", "kartupeļi", "potatoes", ["kartupeļi", "kartupeli"], ["potatoes", "potato"], ["kartupeli"], ["milti", "čipsi", "chips", "deserts"]),
    _c("onion", "sīpoli", "onion", ["sīpoli", "sipoli"], ["onion", "onions"], ["sipoli", "sipolu"], ["mērce", "sauce", "čipsi"]),
    _c("tomato", "tomāti", "tomato", ["tomāti", "tomati"], ["tomato", "tomatoes"], ["tomati", "tomatu"], ["mērce", "sula", "deserts"]),
    _c("banana", "banāni", "banana", ["banāni", "banani"], ["banana", "bananas"], ["banani", "bananu"], ["kūka", "maize", "deserts", "čipsi", "dzeriens"]),
    _c("apple", "āboli", "apple", ["āboli", "aboli"], ["apple", "apples"], ["aboli", "abolu"], ["sula", "dzeriens", "deserts", "čipsi"]),
    _c("avocado", "avokado", "avocado", ["avokado"], ["avocado", "avocados", "avo"], ["avokado"], ["mērce", "čipsi", "eļļa", "salsas"]),
    _c("chicken", "vista", "chicken", ["vista", "vistas"], ["chicken"], ["vista", "vistas"], ["zupa", "deserts", "saldējums"]),
    _c("beef", "liellops", "beef", ["liellopa", "gala", "liellops"], ["beef"], ["gala", "liellopa"], ["vista", "cūka", "zivis", "deserts"]),
    _c("minced_meat", "malta gaļa", "minced meat", ["malta", "gaļa", "malta gaļa"], ["minced", "minced meat", "ground meat"], ["malta", "gala"], ["vista", "deserts", "saldējums"]),
    _c("coffee", "kafija", "coffee", ["kafija", "graudi", "malts"], ["coffee"], ["kafija", "graudi", "malts"], ["dzeriens", "ledus", "kapsulas", "gatavs"]),
    _c("tea", "tēja", "tea", ["tēja", "teja"], ["tea"], ["teja", "tejas"], ["dzeriens", "ledus", "deserts"]),
    _c("water", "ūdens", "water", ["ūdens", "udens"], ["water"], ["udens", "ūdens"], ["gāze", "garša", "sula"]),
    _c("juice", "sula", "juice", ["sula"], ["juice"], ["sula"], ["deserts", "mērce", "saldējums"]),
    _c("chocolate", "šokolāde", "chocolate", ["šokolāde", "sokolade"], ["chocolate"], ["sokolade", "šokolāde"], ["mērce", "sula", "cepumi"]),
    _c("cookies", "cepumi", "cookies", ["cepumi"], ["cookies", "biscuits"], ["cepumi"], ["saldējums", "maize", "deserts"]),
    _c("chips", "čipsi", "chips", ["čipsi", "chips"], ["chips"], ["čipsi", "chips"], ["kartupeļi", "dārzeņi", "deserts"]),
    _c("sugar", "cukurs", "sugar", ["cukurs"], ["sugar"], ["cukurs"], ["aizvietotājs", "deserts", "saldējums"]),
    _c("flour", "milti", "flour", ["milti"], ["flour"], ["milti"], ["kūka", "cepumi", "maize", "deserts"]),
    _c("oil", "eļļa", "oil", ["eļļa", "ella"], ["oil"], ["ella", "eļļa"], []),
    _c("salt", "sāls", "salt", ["sāls", "sals"], ["salt"], ["sals", "sāls"], ["deserts", "rieksti"]),
    _c("dish_soap", "trauku mazgāšanas līdzeklis", "dish soap", ["trauku", "mazgāšanas", "līdzeklis"], ["dish soap", "detergent"], ["trauku", "mazg"], ["ēdiens", "zupa", "maize", "piens", "gala"]),
    _c("laundry", "veļas pulveris", "laundry", ["veļas", "pulveris", "mazgāšanas"], ["laundry", "detergent"], ["velas", "pulveris", "mazg"], ["ēdiens", "zupa", "trauku"]),
    _c("toilet_paper", "tualetes papīrs", "toilet paper", ["tualetes", "papīrs", "papirs"], ["toilet paper", "toilet paper"], ["tualetes", "papirs"], ["ēdiens", "maize", "saldējums"]),
    _c("shampoo", "šampūns", "shampoo", ["šampūns", "sampuns"], ["shampoo"], ["sampuns", "šampūns"], ["ēdiens", "zupa", "maize"]),
    _c("toothpaste", "zobu pasta", "toothpaste", ["zobu", "pasta", "zobu pasta"], ["toothpaste"], ["zobu", "pasta"], ["ēdiens", "makaroni", "maize"]),
    _c("frozen_vegetables", "saldēti dārzeņi", "frozen vegetables", ["saldēti", "dārzeņi"], ["frozen", "vegetables", "frozen vegetables"], ["saldēti", "dārzeņi"], ["svaigi", "sula", "deserts"]),
    _c("ice_cream", "saldējums", "ice cream", ["saldējums", "saldejums"], ["ice cream", "ice cream"], ["saldejums"], ["mērce", "zupa", "maize"]),
]

# Normalized synonym -> Category (for detect_category)
_QUERY_TO_CATEGORY: dict[str, Category] = {}
for cat in CATEGORIES:
    _QUERY_TO_CATEGORY[normalize_text(cat.display_en)] = cat
    _QUERY_TO_CATEGORY[normalize_text(cat.display_lv)] = cat
    for s in cat.synonyms_en:
        _QUERY_TO_CATEGORY[normalize_text(s)] = cat
    for s in cat.synonyms_lv:
        _QUERY_TO_CATEGORY[normalize_text(s)] = cat
# Multi-word phrases
_QUERY_TO_CATEGORY[normalize_text("dish soap")] = next(c for c in CATEGORIES if c.key == "dish_soap")
_QUERY_TO_CATEGORY[normalize_text("trauku mazgāšanas")] = _QUERY_TO_CATEGORY[normalize_text("dish soap")]
_QUERY_TO_CATEGORY[normalize_text("minced meat")] = next(c for c in CATEGORIES if c.key == "minced_meat")
_QUERY_TO_CATEGORY[normalize_text("ground meat")] = _QUERY_TO_CATEGORY[normalize_text("minced meat")]
_QUERY_TO_CATEGORY[normalize_text("ice cream")] = next(c for c in CATEGORIES if c.key == "ice_cream")
_QUERY_TO_CATEGORY[normalize_text("frozen vegetables")] = next(c for c in CATEGORIES if c.key == "frozen_vegetables")
_QUERY_TO_CATEGORY[normalize_text("toilet paper")] = next(c for c in CATEGORIES if c.key == "toilet_paper")


def detect_category(query: str) -> Optional[Category]:
    """Detect category from search query. Returns Category or None.

    1. Normalize query
    2. Check EN + LV synonyms (and full phrase)
    3. Return matched category
    4. Else return None
    """
    q = (query or "").strip()
    if not q:
        return None
    normalized = normalize_text(q)
    tokens = tokenize(q)
    tokens_norm = [normalize_text(t) for t in tokens]

    if normalized in _QUERY_TO_CATEGORY:
        return _QUERY_TO_CATEGORY[normalized]
    for t in tokens_norm:
        if t in _QUERY_TO_CATEGORY:
            return _QUERY_TO_CATEGORY[t]
    return None
