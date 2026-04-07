"""Text normalisation helpers for Latvian grocery product matching."""

from __future__ import annotations

import re
import unicodedata

_LATVIAN_MAP: dict[str, str] = {
    "\u0101": "a",  # ā
    "\u010d": "c",  # č
    "\u0113": "e",  # ē
    "\u0123": "g",  # ģ
    "\u012b": "i",  # ī
    "\u0137": "k",  # ķ
    "\u013c": "l",  # ļ
    "\u0146": "n",  # ņ
    "\u0161": "s",  # š
    "\u016b": "u",  # ū
    "\u017e": "z",  # ž
}

_LV_TRANS = str.maketrans(_LATVIAN_MAP)


def normalize_text(text: str) -> str:
    """Lowercase, strip diacritics, collapse whitespace."""
    text = text.lower().translate(_LV_TRANS)
    text = unicodedata.normalize("NFKD", text)
    text = "".join(c for c in text if not unicodedata.combining(c))
    text = re.sub(r"[^\w\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def tokenize(text: str) -> list[str]:
    return normalize_text(text).split()


# ------------------------------------------------------------------
# Basic Latvian stemming for grocery matching (singular/plural, case)
#
# Strip common noun endings only; minimum stem length 3 to avoid over-stemming.
# Order: longest suffix first so we strip "as" before "s".
# ------------------------------------------------------------------

_LV_ENDINGS = ("us", "as", "u", "s", "i", "a")
_MIN_STEM_LEN = 3


def stem_latvian_token(token: str) -> str:
    """One-step suffix strip for common Latvian noun endings. Grocery-safe."""
    if len(token) < _MIN_STEM_LEN + 1:
        return token
    for suffix in _LV_ENDINGS:
        if token.endswith(suffix):
            stem = token[: -len(suffix)]
            if len(stem) >= _MIN_STEM_LEN:
                return stem
            break
    return token


def tokenize_for_match(text: str) -> list[str]:
    """Normalize (lowercase, strip diacritics) then stem each token for matching.

    Use for query vs title comparison so that piens/piena/pienu and banāns/banāni
    match. Does not change fingerprint or other non-matching logic.
    """
    tokens = tokenize(text)
    return [stem_latvian_token(t) for t in tokens]


def trigrams(text: str) -> set[str]:
    normalized = normalize_text(text).replace(" ", "")
    if len(normalized) < 3:
        return {normalized} if normalized else set()
    return {normalized[i : i + 3] for i in range(len(normalized) - 2)}


# ------------------------------------------------------------------
# Product fingerprint — stable identifier across minor title changes
# ------------------------------------------------------------------

_PROMO_WORDS: set[str] = {
    "akcija", "atlaide", "jaunums", "izpardosana", "piedavajums",
    "sale", "new", "promo", "super", "mega",
    "1+1", "2+1", "3+1",
}

_UNIT_CONVERSIONS: list[tuple[re.Pattern, str]] = [
    (re.compile(r"\b1000\s*ml\b"), "1l"),
    (re.compile(r"\b500\s*ml\b"), "0 5l"),
    (re.compile(r"\b750\s*ml\b"), "0 75l"),
    (re.compile(r"\b250\s*ml\b"), "0 25l"),
    (re.compile(r"\b100\s*ml\b"), "0 1l"),
    (re.compile(r"\b1000\s*g\b"), "1kg"),
    (re.compile(r"\b500\s*g\b"), "0 5kg"),
    (re.compile(r"\b250\s*g\b"), "0 25kg"),
    (re.compile(r"\b100\s*g\b"), "0 1kg"),
    # Collapse spacing within common size expressions
    (re.compile(r"(\d+)\s*(kg|g|ml|l|gab|pcs)\b"), r"\1\2"),
]


def generate_fingerprint(title: str, retailer_id: str, size_text: str | None = None) -> str:
    """Build a stable product fingerprint resilient to minor title variations.

    Pipeline:
    1. Normalize text (lowercase, strip diacritics, drop punctuation).
    2. Remove known promo/noise words.
    3. Standardize size/unit expressions (1000ml → 1l, etc.).
    4. Prepend retailer_id for per-retailer uniqueness.
    """
    combined = title
    if size_text and size_text.lower() not in title.lower():
        combined = f"{title} {size_text}"

    norm = normalize_text(combined)

    tokens = norm.split()
    tokens = [t for t in tokens if t not in _PROMO_WORDS]
    norm = " ".join(tokens)

    for pattern, replacement in _UNIT_CONVERSIONS:
        norm = pattern.sub(replacement, norm)

    norm = re.sub(r"\s+", " ", norm).strip()

    return f"{retailer_id}:{norm}"
