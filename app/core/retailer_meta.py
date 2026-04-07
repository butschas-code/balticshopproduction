"""Retailer metadata registry — single source of truth for catalog type,
display names, and data-quality descriptors.

Every piece of logic that behaves differently per retailer (basket eligibility,
UI labels, index tracking) reads from this registry instead of hardcoding.
"""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum


class CatalogType(str, Enum):
    FULL_CATALOG = "full_catalog"
    PROMO_ONLY = "promo_only"
    PARTIAL_CATALOG = "partial_catalog"


@dataclass(frozen=True)
class RetailerInfo:
    retailer_id: str
    display_name: str
    catalog_type: CatalogType
    description: str

    @property
    def basket_eligible(self) -> bool:
        return self.catalog_type == CatalogType.FULL_CATALOG


_REGISTRY: dict[str, RetailerInfo] = {
    "rimi_lv": RetailerInfo(
        retailer_id="rimi_lv",
        display_name="Rimi Latvia",
        catalog_type=CatalogType.FULL_CATALOG,
        description="Full online assortment with daily price tracking",
    ),
    "maxima_lv": RetailerInfo(
        retailer_id="maxima_lv",
        display_name="Maxima Latvia",
        catalog_type=CatalogType.FULL_CATALOG,
        description="Full online assortment via Barbora",
    ),
    "top_lv": RetailerInfo(
        retailer_id="top_lv",
        display_name="Top! Latvia",
        catalog_type=CatalogType.PROMO_ONLY,
        description="Only weekly promotions published online",
    ),
    "lidl_lv": RetailerInfo(
        retailer_id="lidl_lv",
        display_name="Lidl Latvia",
        catalog_type=CatalogType.PARTIAL_CATALOG,
        description="Full online assortment (~230 items); Lidl does not publish complete in-store catalog",
    ),
}

_FALLBACK = RetailerInfo(
    retailer_id="unknown",
    display_name="Unknown",
    catalog_type=CatalogType.PARTIAL_CATALOG,
    description="No metadata configured",
)


def get_retailer_info(retailer_id: str) -> RetailerInfo:
    return _REGISTRY.get(retailer_id, _FALLBACK)


def get_all_retailer_info() -> list[RetailerInfo]:
    return list(_REGISTRY.values())


def get_full_catalog_ids() -> set[str]:
    return {rid for rid, info in _REGISTRY.items() if info.basket_eligible}


def is_basket_eligible(retailer_id: str) -> bool:
    return get_retailer_info(retailer_id).basket_eligible
