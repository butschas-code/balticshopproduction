"""Household-preference scoring for basket product selection.

When multiple products match a generic query like "piens" (milk), this module
scores each candidate by how well it represents a *typical household purchase*:
standard packaging size, regular (not specialty) variant, correct product form.

Only applied for single-word generic basket queries.  Multi-word queries
(e.g. "vistas fileja") have enough specificity that similarity alone handles
selection correctly.

Scoring model: Start at 1.0 and subtract penalties.  No bonuses — being a
normal, standard product IS the baseline.
"""

from __future__ import annotations

import re

from app.services.normalize import normalize_text, tokenize, tokenize_for_match

# ---------------------------------------------------------------------------
# Size extraction — runs on RAW title (not normalize_text output) because
# normalize_text strips commas/periods used in "1,5l" notation.
# ---------------------------------------------------------------------------

_SIZE_RE = re.compile(
    r"(\d+[.,]?\d*)\s*(ml|l|g|kg|gab)\b",
    re.IGNORECASE,
)

_MULTI_RE = re.compile(
    r"(\d+)\s*[xX]\s*(\d+[.,]?\d*)\s*(ml|l|g|kg)\b",
    re.IGNORECASE,
)


def _parse_num(s: str) -> float:
    return float(s.replace(",", "."))


def _extract_volume_ml(raw_title: str) -> float | None:
    m = _MULTI_RE.search(raw_title)
    if m:
        count = int(m.group(1))
        per_unit = _parse_num(m.group(2))
        unit = m.group(3).lower()
        if unit == "l":
            return count * per_unit * 1000
        if unit == "ml":
            return count * per_unit

    for val_s, unit in _SIZE_RE.findall(raw_title):
        u = unit.lower()
        val = _parse_num(val_s)
        if u == "l":
            return val * 1000
        if u == "ml":
            return val
    return None


def _extract_weight_g(raw_title: str) -> float | None:
    m = _MULTI_RE.search(raw_title)
    if m:
        count = int(m.group(1))
        per_unit = _parse_num(m.group(2))
        unit = m.group(3).lower()
        if unit == "kg":
            return count * per_unit * 1000
        if unit == "g":
            return count * per_unit

    for val_s, unit in _SIZE_RE.findall(raw_title):
        u = unit.lower()
        val = _parse_num(val_s)
        if u == "kg":
            return val * 1000
        if u == "g":
            return val
    return None


def _extract_count(raw_title: str) -> float | None:
    for val_s, unit in _SIZE_RE.findall(raw_title):
        if unit.lower() == "gab":
            return _parse_num(val_s)
    return None


# ---------------------------------------------------------------------------
# Keyword penalty lists
# ---------------------------------------------------------------------------

# Product is NOT the base form (milk drink ≠ milk, condensed ≠ regular)
_WRONG_FORM_TOKENS: frozenset[str] = frozenset({
    "dzeriens", "dzerien",  # drink (piena dzēriens); stemmed form for match
})

_WRONG_FORM_ROOTS: tuple[str, ...] = (
    "iebiezin",     # condensed
    "olbaltumviel",  # protein product
    "karamel",      # caramelized
)

# Specialty/niche variant (still correct category, but not standard)
_SPECIALTY_TOKENS: frozenset[str] = frozenset({
    "bio", "eko", "eco",
})

_SPECIALTY_ROOTS: tuple[str, ...] = (
    "laktozes",     # (bez) laktozes — lactose-free
    "mandel",       # almond
    "sojas",        # soy
    "auzu",         # oat
    "kokos",        # coconut
    "protein",      # protein
    "paipalu",      # quail (eggs)
    "kazas",        # goat
    "himalaj",      # himalayan salt
    "baltum",       # egg whites only (olu baltums)
)

_MILD_PENALTY_ROOTS: tuple[str, ...] = (
    "kafijai",      # for coffee (specialty milk)
    "lauku",        # farm/premium
)


# ---------------------------------------------------------------------------
# Category-specific ideal packaging sizes
# ---------------------------------------------------------------------------

_IDEAL_SIZES: dict[str, tuple[float, float, str]] = {
    # query_token (normalized or stemmed) → (min, max, unit_type)
    "pien":     (800, 1500, "ml"),
    "piens":    (800, 1500, "ml"),
    "piena":    (800, 1500, "ml"),
    "pienu":    (800, 1500, "ml"),
    "jogurt":   (250, 500, "g"),
    "jogurts":  (250, 500, "g"),
    "jogurta":  (250, 500, "g"),
    "jogurtu":  (250, 500, "g"),
    "sier":     (100, 500, "g"),
    "siers":    (100, 500, "g"),
    "siera":    (100, 500, "g"),
    "sieru":    (100, 500, "g"),
    "sviest":   (150, 250, "g"),
    "sviests":  (150, 250, "g"),
    "sviesta":  (150, 250, "g"),
    "sviestu":  (150, 250, "g"),
    "ola":      (10, 12, "pcs"),
    "olas":     (10, 12, "pcs"),
    "olu":      (10, 12, "pcs"),
    "maiz":     (300, 800, "g"),
    "maize":    (300, 800, "g"),
    "maizes":   (300, 800, "g"),
    "maizi":    (300, 800, "g"),
    "ris":      (400, 1000, "g"),
    "risi":     (400, 1000, "g"),
    "risu":     (400, 1000, "g"),
    "kefir":    (800, 1000, "ml"),
    "kefirs":   (800, 1000, "ml"),
    "kefira":   (800, 1000, "ml"),
    "krejum":   (200, 500, "g"),
    "krejums":  (200, 500, "g"),
    "biezpien": (200, 500, "g"),
    "biezpiens": (200, 500, "g"),
}

# Product type roots — used for title-position check (stems + forms).
_QUERY_ROOTS: dict[str, tuple[str, ...]] = {
    "pien": ("pien",), "piens": ("pien",), "piena": ("pien",), "pienu": ("pien",),
    "sier": ("sier",), "siers": ("sier",), "siera": ("sier",), "sieru": ("sier",),
    "jogurt": ("jogurt",), "jogurts": ("jogurt",), "jogurta": ("jogurt",), "jogurtu": ("jogurt",),
    "sviest": ("sviest",), "sviests": ("sviest",), "sviesta": ("sviest",), "sviestu": ("sviest",),
    "ola": ("ola", "olu"), "olas": ("ola", "olu"), "olu": ("ola", "olu"),
    "maiz": ("maiz",), "maize": ("maiz",), "maizes": ("maiz",), "maizi": ("maiz",),
    "ris": ("ris",), "risi": ("ris",), "risu": ("ris",),
    "kefir": ("kefir",), "kefirs": ("kefir",), "kefira": ("kefir",),
}


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def household_score(query: str, candidate_title: str) -> float:
    """Score how 'typical household' a product is (0.0 – 1.0).

    Designed for single-word generic basket queries.  Uses stemmed tokens
    so that banāns/banāni and piens/piena are treated consistently.
    """
    score = 1.0
    c_tokens = set(tokenize_for_match(candidate_title))
    q_tokens = tokenize_for_match(query)

    # --- Wrong-form penalty (fundamentally different product) ---
    if c_tokens & _WRONG_FORM_TOKENS:
        score -= 0.6
    for root in _WRONG_FORM_ROOTS:
        if any(t.startswith(root) for t in c_tokens):
            score -= 0.6
            break

    # --- Specialty variant penalty ---
    if c_tokens & _SPECIALTY_TOKENS:
        score -= 0.2
    for root in _SPECIALTY_ROOTS:
        if any(t.startswith(root) for t in c_tokens):
            score -= 0.25
            break

    # --- Mild specialty penalty ---
    for root in _MILD_PENALTY_ROOTS:
        if any(t.startswith(root) for t in c_tokens):
            score -= 0.1
            break

    # --- Packaging size penalty ---
    if len(q_tokens) == 1:
        size_spec = _IDEAL_SIZES.get(q_tokens[0])
        if size_spec:
            ideal_min, ideal_max, unit_type = size_spec
            product_size: float | None = None
            if unit_type == "ml":
                product_size = _extract_volume_ml(candidate_title)
            elif unit_type == "g":
                product_size = _extract_weight_g(candidate_title)
            elif unit_type == "pcs":
                product_size = _extract_count(candidate_title)

            if product_size is not None and not (
                ideal_min <= product_size <= ideal_max
            ):
                if product_size < ideal_min:
                    ratio = product_size / ideal_min
                else:
                    ratio = ideal_max / product_size
                score -= max(0.0, (1.0 - ratio)) * 0.35

    # --- Title-position penalty ---
    # If the product title does NOT start with the product type,
    # the query keyword is likely a brand/ingredient, not the product itself.
    if len(q_tokens) == 1:
        roots = _QUERY_ROOTS.get(q_tokens[0])
        if roots:
            title_tokens = tokenize_for_match(candidate_title)
            head = title_tokens[:2]
            if not any(
                t.startswith(r) for t in head for r in roots
            ):
                score -= 0.25

    return max(0.0, min(1.0, score))
