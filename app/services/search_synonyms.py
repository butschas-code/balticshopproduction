"""Bilingual search: expand English query terms to Latvian equivalents before matching.

Expansion runs before token scoring and does not change fingerprint logic.
Lookup is case-insensitive and diacritics-insensitive (via normalize_text).
"""

from __future__ import annotations

from app.services.normalize import normalize_text, tokenize

# Phrase (normalized, lowercase) -> extra terms to add for matching.
PHRASE_SYNONYMS: dict[str, list[str]] = {
    "red lentils": ["sarkanas lecas"],
    "greek yogurt": ["grieku jogurts"],
    "greek yoghurt": ["grieku jogurts"],
    "dish soap": ["trauku mazgāšanas līdzeklis", "trauku", "mazgāšanas"],
}

# English (normalized lowercase) -> Latvian terms to add to the query.
# Short/partial forms also map to full terms for prefix matching.
search_synonyms: dict[str, list[str]] = {
    "milk": ["piens"],
    "bread": ["maize"],
    "eggs": ["olas"],
    "butter": ["sviests"],
    "cheese": ["siers"],
    "chicken": ["vista"],
    "rice": ["rīsi"],
    "yogurt": ["jogurts"],
    "yogurts": ["jogurts"],
    "banana": ["banāni"],
    "bananas": ["banāni"],
    "potatoes": ["kartupeļi"],
    "sugar": ["cukurs"],
    "pasta": ["makaroni"],
    "coffee": ["kafija"],
    "avocado": ["avokado"],
    "avocados": ["avokado"],
    "avokado": ["avokado"],
    "lentils": ["lēcas"],
    "lentil": ["lēcas"],
    "lecas": ["lēcas"],
    "red": ["sarkanas"],
    "greek yogurt": ["grieķu jogurts"],
    "greek yoghurt": ["grieķu jogurts"],
    # Partial/short query expansion
    "avo": ["avocado", "avokado"],
    "jogurt": ["jogurts"],
    "piens": ["piens"],
    "vista": ["vista"],
    "siers": ["siers"],
    "maize": ["maize"],
}


def expand_query_for_search(query: str) -> str:
    """Expand English terms in query with Latvian synonyms before matching.

    Runs phrase expansion first (e.g. red lentils -> sarkanas lecas), then
    token expansion. Original query is preserved; synonyms are appended.
    """
    if not (query or "").strip():
        return query
    q_norm = normalize_text(query)
    extra: list[str] = []
    for phrase, syns in PHRASE_SYNONYMS.items():
        if phrase in q_norm:
            extra.extend(syns)
    tokens = tokenize(query)
    for t in tokens:
        syns = search_synonyms.get(t)
        if syns:
            extra.extend(syns)
    if not extra:
        return query
    return query.strip() + " " + " ".join(extra)


def get_search_suggestions(query: str) -> list[str]:
    """Return suggested alternative search terms when no results (e.g. avocado -> avokado)."""
    if not (query or "").strip():
        return []
    tokens = tokenize(query)
    out: list[str] = []
    seen: set[str] = set()
    for t in tokens:
        syns = search_synonyms.get(t)
        if syns:
            for s in syns:
                if s not in seen and s != t:
                    seen.add(s)
                    out.append(s)
    return out[:5]
