"""Detect product type from search query only.

Maps user query (e.g. "milk", "piens", "avokado") to a canonical product type key.
Used to enable strict filter mode: show only products of that type.
"""

from __future__ import annotations

from app.services.normalize import normalize_text


# Query keywords (EN + LV) -> product type key. Built from type -> keywords.
QUERY_TO_TYPE: dict[str, str] = {}

_TYPE_KEYWORDS: list[tuple[str, list[str]]] = [
    ("milk", ["milk", "piens", "piena"]),
    ("yogurt", ["yogurt", "yoghurt", "jogurts", "jogurti"]),
    ("cheese", ["cheese", "siers", "sieri"]),
    ("eggs", ["eggs", "egg", "olas", "ola"]),
    ("bread", ["bread", "maize", "maizite", "rupjmaize"]),
    ("rice", ["rice", "rīsi", "risi", "basmati", "jasmin"]),
    ("chicken", ["chicken", "vista", "vistas", "fileja"]),
    ("butter", ["butter", "sviests"]),
    ("avocado", ["avocado", "avokado", "avo"]),
    ("banana", ["banana", "bananas", "banāni", "banani"]),
    ("apple", ["apple", "apples", "āboli", "aboli"]),
    ("dish_soap", ["dish soap", "trauku", "trauku mazg", "trauku mazgāšanas"]),
    ("shampoo", ["shampoo", "šampūns", "sampuns"]),
    ("toothpaste", ["toothpaste", "zobu pasta", "zobu ziepes"]),
    ("coffee", ["coffee", "kafija"]),
    ("tea", ["tea", "teja", "tēja"]),
    ("water", ["water", "ūdens", "udens"]),
    ("juice", ["juice", "sula"]),
    ("pasta", ["pasta", "makaroni", "spageti", "penne"]),
    ("potatoes", ["potatoes", "potato", "kartupeļi", "kartupeli"]),
    ("tomato", ["tomato", "tomatoes", "tomāti", "tomati"]),
    ("onion", ["onion", "onions", "sīpoli", "sipoli"]),
    ("flour", ["flour", "milti"]),
    ("oil", ["oil", "eļļa", "ella"]),
    ("salt", ["salt", "sāls", "sals"]),
    ("sugar", ["sugar", "cukurs"]),
    ("chocolate", ["chocolate", "šokolāde", "sokolade"]),
    ("cookies", ["cookies", "biscuits", "cepumi"]),
    ("ice_cream", ["ice cream", "saldējums", "saldejums"]),
    ("toilet_paper", ["toilet paper", "tualetes papīrs", "tualetes papirs"]),
    ("laundry_detergent", ["laundry", "washing", "veļas", "velas"]),
    ("fish", ["fish", "zivis", "zivs"]),
    ("beef", ["beef", "liellops", "gala"]),
    ("pork", ["pork", "cūka", "cukas"]),
    ("minced_meat", ["minced", "ground meat", "malta gaļa", "malta gala"]),
]

for _type, keywords in _TYPE_KEYWORDS:
    for kw in keywords:
        norm = normalize_text(kw)
        if norm and norm not in QUERY_TO_TYPE:
            QUERY_TO_TYPE[norm] = _type
    type_norm = normalize_text(_type.replace("_", " "))
    if type_norm and type_norm not in QUERY_TO_TYPE:
        QUERY_TO_TYPE[type_norm] = _type


def detect_product_type(query: str) -> str | None:
    """Detect product type from search query.

    Normalizes query (lowercase, remove diacritics) and checks against
    known keywords. Returns canonical type key or None.
    """
    if not (query or "").strip():
        return None
    norm = normalize_text(query.strip())
    if not norm:
        return None
    if norm in QUERY_TO_TYPE:
        return QUERY_TO_TYPE[norm]
    for t in norm.split():
        if len(t) >= 2 and t in QUERY_TO_TYPE:
            return QUERY_TO_TYPE[t]
    return None


RELATED_PRODUCT_TYPES: dict[str, list[str]] = {
    "milk": ["yogurt", "cheese", "butter"],
    "yogurt": ["milk", "cheese", "butter"],
    "cheese": ["milk", "yogurt", "butter"],
    "butter": ["milk", "cheese"],
    "chicken": ["beef", "pork", "fish", "minced_meat"],
    "beef": ["chicken", "pork", "minced_meat"],
    "pork": ["chicken", "beef", "minced_meat"],
    "dish_soap": ["laundry_detergent"],
    "laundry_detergent": ["dish_soap"],
    "coffee": ["tea"],
    "tea": ["coffee"],
}

PRODUCT_TYPE_DISPLAY: dict[str, str] = {
    "milk": "Milk",
    "yogurt": "Yogurt",
    "cheese": "Cheese",
    "eggs": "Eggs",
    "bread": "Bread",
    "rice": "Rice",
    "chicken": "Chicken",
    "butter": "Butter",
    "avocado": "Avocados",
    "banana": "Bananas",
    "apple": "Apples",
    "dish_soap": "Dish soap",
    "shampoo": "Shampoo",
    "toothpaste": "Toothpaste",
    "coffee": "Coffee",
    "tea": "Tea",
    "water": "Water",
    "juice": "Juice",
    "pasta": "Pasta",
    "potatoes": "Potatoes",
    "ice_cream": "Ice cream",
    "chocolate": "Chocolate",
    "toilet_paper": "Toilet paper",
    "laundry_detergent": "Laundry detergent",
    "fish": "Fish",
    "beef": "Beef",
    "pork": "Pork",
    "minced_meat": "Minced meat",
}


def get_product_type_display(type_key: str) -> str:
    """Human-readable label for product type (e.g. avocado -> Avocados)."""
    return PRODUCT_TYPE_DISPLAY.get(type_key, type_key.replace("_", " ").title())