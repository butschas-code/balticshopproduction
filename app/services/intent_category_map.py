"""Map product intent to allowed category roots for filtering search universe.

Before ranking, offers are restricted to those whose category_path or category_root
matches (case-insensitive partial) one of the allowed values for the detected intent.
This prevents category contamination: milk → only milk/dairy, avocado → only fruit/veg.
"""

from __future__ import annotations

# Intent key -> list of allowed category substrings (case-insensitive partial match).
# Match if any allowed string appears in offer.category_root or offer.category_path.
INTENT_CATEGORY_MAP: dict[str, list[str]] = {
    "milk": ["piens", "piena", "dairy", "piena produkti", "piena produkti un olas", "olas"],
    "yogurt": ["jogurt", "jogurts", "dairy", "piena produkti"],
    "avocado": ["augli", "darzeni", "augli un darzeni", "fruit", "vegetables", "auglu", "darcenu"],
    "chicken": ["gala", "gaļa", "meat", "gala zivs", "gala zivs un gatava", "vista"],
    "dish_soap": ["majas kimija", "mājas ķīmija", "cleaning", "trauku", "tirašana", "tirasana"],
    "cheese": ["siers", "sieri", "dairy", "piena produkti"],
    "eggs": ["olas", "dairy", "piena produkti un olas"],
    "bread": ["maize", "maizite", "maize un konditoreja", "bakaleja"],
    "rice": ["rīsi", "risi", "bakaleja", "graudi", "pasta"],
    "butter": ["sviests", "dairy", "piena produkti"],
    "banana": ["augli", "augli un darzeni", "fruit"],
    "apple": ["augli", "augli un darzeni", "fruit"],
    "coffee": ["kafija", "dzerieni", "tea", "teja"],
    "tea": ["teja", "dzerieni", "kafija"],
    "water": ["udens", "dzerieni", "ūdens"],
    "juice": ["sula", "dzerieni", "sulas"],
    "pasta": ["makaroni", "bakaleja", "pasta", "graudi"],
    "potatoes": ["darzeni", "augli un darzeni", "kartupeli", "vegetables"],
    "tomato": ["darzeni", "augli un darzeni", "tomati", "vegetables"],
    "onion": ["darzeni", "augli un darzeni", "sipoli", "vegetables"],
    "flour": ["milti", "bakaleja", "graudi"],
    "oil": ["eļļa", "ella", "bakaleja"],
    "salt": ["sals", "bakaleja", "garšvielas"],
    "sugar": ["cukurs", "bakaleja", "saldumi"],
    "chocolate": ["sokolade", "saldumi", "saldumi un uzkodas", "konfekte"],
    "cookies": ["cepumi", "saldumi", "bakaleja", "maize un konditoreja"],
    "ice_cream": ["saldetie", "saldētie", "saldeti", "saldējums", "saldejums"],
    "toilet_paper": ["majas kimija", "tualete", "papirs", "hygiene"],
    "laundry_detergent": ["majas kimija", "velas", "veļas", "washing", "cleaning", "tirašana"],
    "shampoo": ["kopsana", "hygiene", "sampuns", "vīriešiem", "sievietem"],
    "toothpaste": ["zobu", "hygiene", "kopsana"],
    "fish": ["zivis", "zivs", "gala zivs", "gala zivs un gatava", "meat"],
    "beef": ["gala", "gaļa", "meat", "gala zivs un gatava"],
    "pork": ["gala", "gaļa", "meat", "cuka", "cūka"],
    "minced_meat": ["gala", "gaļa", "malta", "meat", "gala zivs un gatava"],
}


def get_allowed_categories(intent_key: str) -> list[str]:
    """Return list of allowed category substrings for an intent (empty = no category filter)."""
    return INTENT_CATEGORY_MAP.get(intent_key, [])


def offer_matches_category(
    category_path: str | None,
    category_root: str | None,
    allowed: list[str],
) -> bool:
    """True if offer's category_path or category_root matches any allowed (case-insensitive partial)."""
    if not allowed:
        return True
    path_norm = (category_path or "").lower()
    root_norm = (category_root or "").lower()
    for term in allowed:
        t = term.lower()
        if t in path_norm or t in root_norm:
            return True
    return False
