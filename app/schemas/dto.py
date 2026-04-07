from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime


@dataclass
class RetailerMeta:
    id: str
    name: str
    country: str
    currency: str
    base_url: str


@dataclass
class OfferDTO:
    title: str
    price: float
    url: str
    brand: str | None = None
    size_text: str | None = None
    unit_price: float | None = None
    unit: str | None = None
    raw_json: str | None = None
    source: str = "html"
    category_path: str | None = None
    category_root: str | None = None


@dataclass
class SearchResult:
    retailer_id: str
    retailer_name: str
    title: str
    price: float
    unit_price: float | None
    unit: str | None
    size_text: str | None
    url: str
    scraped_at: datetime
    similarity: float = 0.0
    catalog_type: str = ""
    catalog_description: str = ""


@dataclass
class BasketItem:
    query: str
    title: str
    price: float
    score: float
    confidence: str = ""


@dataclass
class BasketResult:
    retailer_id: str
    retailer_name: str
    items: list[BasketItem] = field(default_factory=list)
    total: float = 0.0
    found_count: int = 0
    missing: list[str] = field(default_factory=list)
    catalog_type: str = ""
    catalog_description: str = ""
    basket_eligible: bool = True


@dataclass
class PricePoint:
    """A single historical price observation."""
    date: str
    price: float
    unit_price: float | None = None


@dataclass
class PriceStats:
    """Aggregated price intelligence for one product at one retailer."""
    offer_id: int
    retailer_id: str
    retailer_name: str
    title: str
    current_price: float
    lowest_price: float
    highest_price: float
    avg_price_30d: float | None
    price_range: float
    observation_count: int
    first_seen: str
    last_seen: str
    last_price_change: str | None
    price_trend: str  # "stable", "rising", "falling", "new"
    history: list[PricePoint] = field(default_factory=list)
