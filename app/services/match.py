"""Product matching with category-aware keyword filtering and product-type
penalty system.

Two entry points:
- similarity_score()  – general fuzzy search (for /search)
- match_product()     – strict category-aware match (for /basket)

The penalty system prevents generic searches like "vista" (chicken) from
matching processed products like "vistas pastēte" (chicken pate) when
real/primary products (chicken fillets, legs, etc.) are available.
"""

from __future__ import annotations

from dataclasses import dataclass, field

from app.services.normalize import normalize_text, tokenize, tokenize_for_match, trigrams

# ---------------------------------------------------------------------------
# Grocery keyword filter
#
# Maps normalised (and optionally stemmed) query tokens → root prefixes that
# MUST appear at the START of a token in the product title.  Stems are used
# for lookup when tokenize_for_match is used (piens/piena → pien).
# ---------------------------------------------------------------------------
KEYWORD_FILTER: dict[str, list[str]] = {
    # --- dairy (stems + forms) ---
    "pien":      ["pien"],
    "piens":     ["pien"],
    "piena":     ["pien"],
    "pienu":     ["pien"],
    "sier":      ["sier"],
    "siers":     ["sier"],
    "siera":     ["sier"],
    "sieru":     ["sier"],
    "jogurt":    ["jogurt"],
    "jogurts":   ["jogurt"],
    "jogurta":   ["jogurt"],
    "jogurtu":   ["jogurt"],
    "sviest":    ["sviest"],
    "sviests":   ["sviest"],
    "sviesta":   ["sviest"],
    "sviestu":   ["sviest"],
    "biezpien":  ["biezpien"],
    "biezpiens": ["biezpien"],
    "krejum":    ["krejum"],
    "krejums":   ["krejum"],
    "kefir":     ["kefir"],
    "kefirs":    ["kefir"],
    "kefira":    ["kefir"],
    # --- eggs ---
    "ola":   ["ola", "olu"],
    "olas":  ["ola", "olu"],
    "olu":   ["ola", "olu"],
    # --- bread ---
    "maiz":  ["maiz"],
    "maize":  ["maiz"],
    "maizes": ["maiz"],
    "maizi":  ["maiz"],
    # --- meat / chicken ---
    "vist":    ["vist", "cal", "majputn"],
    "vista":   ["vist", "cal", "majputn"],
    "vistas":  ["vist", "cal", "majputn"],
    "vistiena": ["vist", "cal", "majputn"],
    "gal":     ["gal", "cukg", "liellop", "vist", "cal", "jera", "trus"],
    "gala":    ["gal", "cukg", "liellop", "vist", "cal", "jera", "trus"],
    "galas":   ["gal", "cukg", "liellop", "vist", "cal", "jera", "trus"],
    "cukgala":  ["cukg"],
    # --- sausages ---
    "des":     ["des"],
    "desas":   ["des"],
    "desa":    ["des"],
    "cisin":   ["cisin", "sardel"],
    "cisini":  ["cisin", "sardel"],
    "sardel":  ["sardel", "cisin"],
    "sardeles": ["sardel", "cisin"],
    # --- grains ---
    "ris":     ["ris"],
    "risi":    ["ris"],
    "risu":    ["ris"],
    "grik":    ["grik"],
    "griki":   ["grik"],
    "putraim": ["putraim"],
    "putraimi": ["putraim"],
    # --- pasta ---
    "makaron":  ["makaron"],
    "makaroni": ["makaron"],
    "makaronus": ["makaron"],
    "pasta":     ["makaron", "past"],
    # --- vegetables / staples ---
    "kartupel":  ["kartupel"],
    "kartupeli": ["kartupel"],
    "kartupelu": ["kartupel"],
    "banan":     ["banan"],
    "banani":    ["banan"],
    "bananu":    ["banan"],
    "cuk":       ["cuk"],
    "cukurs":    ["cuk"],
    "cukura":    ["cuk"],
    "kafij":     ["kafij"],
    "kafija":    ["kafij"],
    "kafiju":    ["kafij"],
    # --- canned ---
    "konserv":  ["konserv"],
    "konservi": ["konserv"],
    # --- snacks ---
    "cips":  ["cips"],
    "cipsi": ["cips"],
    "cipsu": ["cips"],
    # --- drinks ---
    "uden":  ["uden"],
    "udens": ["uden"],
    "sul":   ["sul"],
    "sula":  ["sul"],
    "sulas": ["sul"],
    "sulu":  ["sul"],
    "limonad":   ["limonad"],
    "limonade":  ["limonad"],
    "limonades": ["limonad"],
    # --- frozen ---
    "saldejum":  ["saldejum"],
    "saldejums": ["saldejum"],
    "pelmen":    ["pelmen"],
    "pelmeni":   ["pelmen"],
}


# ---------------------------------------------------------------------------
# Product-type penalty system
#
# For categories where a generic single-word query (e.g. "vista") could match
# both primary products (chicken fillets) AND processed/derivative products
# (chicken pate, chicken sausage), we define penalty tokens.
#
# If a product title contains a penalty token, the match is classified as
# CONFIDENCE_WEAK.  The basket engine then prefers primary (non-penalized)
# matches and rejects weak-only results entirely.
# ---------------------------------------------------------------------------

@dataclass(frozen=True)
class _CategoryProfile:
    penalty_roots: tuple[str, ...]


_PROFILES: dict[str, _CategoryProfile] = {
    "chicken": _CategoryProfile(
        penalty_roots=(
            "pastet",       # pate
            "des",          # sausage (desa, desiņas)
            "cisin",        # hot dogs (cīsiņi)
            "pelmen",       # dumplings
            "frikadel",     # meatballs
            "naget",        # nuggets
            "uzkod",        # snack
            "konserv",      # canned
            "cepam",        # fried (cepampelmeņi)
            "nudel",        # noodles (nūdeles ar vistas garšu)
            "cips",         # chips (čipsi ar vistas garšu)
            "gars",         # "garšu" – flavored, not actual meat
            "zup",          # soup
        ),
    ),
    "cheese": _CategoryProfile(
        penalty_roots=(
            "cips",         # chips (čipsi)
            "uzkod",        # snack (uzkoda)
            "kukuruz",      # corn (kukurūzas uzkoda)
            "kartupel",     # potato (kartupeļu čipsi)
            "pelmen",       # dumplings (pelmeņi ar sieru)
            "des",          # sausage (desa ar sieru, desiņas)
            "doktord",      # compound: doktordesa (doctor's sausage)
            "nujin",        # sticks (siera nūjiņas)
            "plaksn",       # crisps (plāksnes)
            "bumba",        # balls (siera bumbas snack)
            "longchip",     # Longchips brand
            "gars",         # flavor (ar siera garšu)
            "krauksk",      # crunchy snacks (kraukšķi)
        ),
    ),
    "bread": _CategoryProfile(
        penalty_roots=(
            "mikl",         # dough (mīkla)
            "margarin",     # margarine
        ),
    ),
    "rice": _CategoryProfile(
        penalty_roots=(
            "des",          # sausage
            "cisin",        # hot dogs
        ),
    ),
}

_QUERY_TO_PROFILE: dict[str, str] = {
    "vist": "chicken", "vista": "chicken", "vistas": "chicken", "vistiena": "chicken",
    "chicken": "chicken",
    "sier": "cheese", "siers": "cheese", "siera": "cheese", "sieru": "cheese",
    "cheese": "cheese",
    "maiz": "bread", "maize": "bread", "maizes": "bread", "maizi": "bread",
    "bread": "bread",
    "ris": "rice", "risi": "rice", "risu": "rice",
    "rice": "rice",
}


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _any_token_starts_with(tokens: set[str], prefix: str) -> bool:
    return any(t.startswith(prefix) for t in tokens)


def _get_required_roots(query: str) -> list[str] | None:
    """If any query token (after stem) maps to a known grocery keyword, return required roots."""
    for token in tokenize_for_match(query):
        roots = KEYWORD_FILTER.get(token)
        if roots is not None:
            return roots
    return None


def _title_passes_filter(candidate_tokens: set[str], roots: list[str]) -> bool:
    """At least one candidate token must start with one of the roots."""
    return any(
        _any_token_starts_with(candidate_tokens, root)
        for root in roots
    )


def _get_penalty_profile(query: str) -> _CategoryProfile | None:
    """Return the penalty profile if any query token (after stem) maps to a known category."""
    for token in tokenize_for_match(query):
        profile_name = _QUERY_TO_PROFILE.get(token)
        if profile_name is not None:
            return _PROFILES.get(profile_name)
    return None


def _is_penalized(candidate_tokens: set[str], profile: _CategoryProfile) -> bool:
    """True if any candidate token starts with a penalty root."""
    return any(
        _any_token_starts_with(candidate_tokens, root)
        for root in profile.penalty_roots
    )


# ---------------------------------------------------------------------------
# General similarity (used by /search)
# ---------------------------------------------------------------------------

def similarity_score(query: str, candidate: str) -> float:
    """Return a 0-1 score indicating how well *candidate* matches *query*.

    Uses normalized (lowercase, strip diacritics) and stemmed tokens so that
    piens/piena and banāns/banāni match. Token-start matching avoids compound
    false positives like "maize" inside "sviestmaizem".
    """
    q_norm = normalize_text(query)
    c_norm = normalize_text(candidate)

    if not q_norm or not c_norm:
        return 0.0

    if q_norm == c_norm:
        return 1.0

    q_tokens = set(tokenize_for_match(query))
    c_tokens = set(tokenize_for_match(candidate))

    # Single-token query that appears as prefix of a title token
    if len(q_tokens) == 1:
        (q_stem,) = q_tokens
        if any(t.startswith(q_stem) for t in c_tokens):
            return 0.9

    token_overlap = len(q_tokens & c_tokens) / len(q_tokens) if q_tokens else 0.0

    q_tri = trigrams(query)
    c_tri = trigrams(candidate)
    tri_union = q_tri | c_tri
    tri_sim = len(q_tri & c_tri) / len(tri_union) if tri_union else 0.0

    return 0.6 * token_overlap + 0.4 * tri_sim


# ---------------------------------------------------------------------------
# Strict basket matching (used by /basket)
# ---------------------------------------------------------------------------

CONFIDENCE_STRONG = "strong"   # >= 0.80, primary product
CONFIDENCE_OK     = "ok"       # >= 0.50, acceptable
CONFIDENCE_WEAK   = "weak"     # passed root filter but is a processed/derivative product
CONFIDENCE_REJECT = "reject"   # failed root filter or below threshold

BASKET_THRESHOLD = 0.50


def match_product(query: str, candidate: str) -> tuple[float, str]:
    """Category-aware matching for basket mode.

    Returns (score, confidence) where confidence is one of the CONFIDENCE_*
    constants.

    The penalty system applies only when the query is a single generic
    keyword (e.g. "vista") — multi-word queries like "vistas fileja" bypass
    penalties because the extra tokens provide enough specificity.

    When a penalty token is found in the product title (e.g. "pastete" in
    "Vistas pastete Lido 120g"), the match is classified as CONFIDENCE_WEAK.
    The basket engine then prefers non-penalized (primary) matches and
    rejects weak-only results.
    """
    c_tokens = set(tokenize_for_match(candidate))

    required_roots = _get_required_roots(query)

    if required_roots is not None:
        if not _title_passes_filter(c_tokens, required_roots):
            return 0.0, CONFIDENCE_REJECT

        score = similarity_score(query, candidate)
        score = max(score, 0.70)

        profile = _get_penalty_profile(query)
        if profile is not None and _is_penalized(c_tokens, profile):
            return score, CONFIDENCE_WEAK

        return score, _confidence(score)

    score = similarity_score(query, candidate)
    return score, _confidence(score)


def _confidence(score: float) -> str:
    if score >= 0.80:
        return CONFIDENCE_STRONG
    if score >= BASKET_THRESHOLD:
        return CONFIDENCE_OK
    return CONFIDENCE_REJECT
