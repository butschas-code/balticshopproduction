"""Intent-based product search: category from taxonomy, strict filter, fallback fuzzy.

Uses product_taxonomy.detect_category(query). If category detected → STRICT MODE.
Ranking: exact category match first, then price, then relevance.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Literal

from app.services.normalize import normalize_text
from app.services.product_taxonomy import Category, detect_category


def _normalize_tokens(tokens: list[str]) -> list[str]:
    return [normalize_text(t) for t in tokens]


# ---------------------------------------------------------------------------
# SearchIntent: built from Category for filtering
# ---------------------------------------------------------------------------

@dataclass
class SearchIntent:
    type: Literal["product_type", "free_text"]
    category: Category | None = None
    required_tokens: list[str] = ()
    exclude_tokens: list[str] = ()

    def __post_init__(self) -> None:
        if self.required_tokens is None:
            self.required_tokens = []
        if self.exclude_tokens is None:
            self.exclude_tokens = []

    @property
    def canonical_lv(self) -> str:
        if self.category and self.category.required_tokens:
            return normalize_text(self.category.required_tokens[0])
        return ""

    @property
    def name_en(self) -> str:
        return self.category.display_en if self.category else ""

    @property
    def name_lv(self) -> str:
        return self.category.display_lv if self.category else ""


def classify_query(query: str) -> SearchIntent:
    """If category detected → product_type (strict). Else → free_text (fuzzy)."""
    q = (query or "").strip()
    if not q:
        return SearchIntent(type="free_text")

    cat = detect_category(q)
    if cat is None:
        return SearchIntent(type="free_text")

    return SearchIntent(
        type="product_type",
        category=cat,
        required_tokens=_normalize_tokens(cat.required_tokens),
        exclude_tokens=_normalize_tokens(cat.exclude_tokens),
    )


def passes_strict_filter(
    offer_title: str,
    offer_brand: str | None,
    offer_size_text: str | None,
    intent: SearchIntent,
) -> bool:
    """True if product contains at least one required_token (word or prefix) and no exclude_token (word)."""
    if intent.type != "product_type" or not intent.required_tokens:
        return True

    text = " ".join(filter(None, [offer_title, offer_brand or "", offer_size_text or ""]))
    norm = normalize_text(text)

    for ex in intent.exclude_tokens:
        if re.search(r"\b" + re.escape(ex) + r"\b", norm):
            return False

    for req in intent.required_tokens:
        if re.search(r"\b" + re.escape(req) + r"\b", norm):
            return True
        if len(req) >= 3 and re.search(r"\b" + re.escape(req), norm):
            return True
    return False
