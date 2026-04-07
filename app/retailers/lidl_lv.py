"""Lidl Latvia adapter — fetches the complete online catalog from lidl.lv.

Lidl Latvia publishes its entire website catalog (weekly offers + permanent
"everyday low price" assortment) through an internal search API.  No
authentication is required, but the API demands a specific ``Accept`` header.

Verified coverage (2026-03):
  - API ``numFound`` = 231 products (matches product sitemap count of 230).
  - All 7 top-level categories sum to exactly 231.
  - ~18 items have no price published anywhere (upcoming items) → skipped.
  - Remaining ~213 items are captured at 100%.
  - Lidl Latvia does NOT operate a full e-commerce store; the website
    publishes their curated in-store assortment (compare: Lidl DE = 10k).

Endpoint:  GET https://www.lidl.lv/q/api/search
Params:    assortment=LV  locale=lv_LV  version=v2.0.0  fetchSize=48  offset=N
Header:    Accept: application/mindshift.search+json;version=2
"""

from __future__ import annotations

import json
import re
import time

from app.core.config import RATE_LIMIT_MIN
from app.core.http import get_session
from app.core.logging import get_logger
from app.retailers.base import RetailerAdapter
from app.schemas.dto import OfferDTO, RetailerMeta

logger = get_logger(__name__)

RETAILER_ID = "lidl_lv"
_BASE = "https://www.lidl.lv"
_API_URL = f"{_BASE}/q/api/search"
_PAGE_SIZE = 48  # API returns max ~36 per page regardless of fetchSize
_ACCEPT = "application/mindshift.search+json;version=2"

_UNIT_PRICE_RE = re.compile(
    r"1\s*(kg|l)\s*=\s*(\d+[.,]?\d*)\s*€",
    re.I,
)
_SIZE_RE = re.compile(r"(\d+(?:[.,]\d+)?)\s*(kg|g|ml|l|gab)\b", re.I)
_SIMPLE_UNIT_RE = re.compile(r"^(\d+(?:[.,]\d+)?)\s*(kg|l)$", re.I)


class LidlLvAdapter(RetailerAdapter):
    """Complete catalog adapter for Lidl Latvia via search JSON API."""

    def retailer_meta(self) -> RetailerMeta:
        return RetailerMeta(
            id=RETAILER_ID,
            name="Lidl Latvia",
            country="LV",
            currency="EUR",
            base_url=_BASE,
        )

    def fetch_offers(self) -> list[OfferDTO]:
        session = get_session()
        session.headers.update({
            "Accept": _ACCEPT,
        })

        all_offers: list[OfferDTO] = []
        seen_codes: set[str] = set()
        skipped_no_price = 0
        offset = 0

        while True:
            params = {
                "assortment": "LV",
                "locale": "lv_LV",
                "version": "v2.0.0",
                "sort": "relevancy",
                "fetchSize": str(_PAGE_SIZE),
                "offset": str(offset),
            }

            try:
                time.sleep(RATE_LIMIT_MIN)
                resp = session.get(_API_URL, params=params, timeout=30)
                resp.raise_for_status()
                data = resp.json()
            except Exception:
                logger.exception("Lidl API request failed (offset %d)", offset)
                break

            items = data.get("items", [])
            num_found = data.get("numFound", 0)

            if not items:
                break

            for item in items:
                code = item.get("code", "")
                if not code or code in seen_codes:
                    continue
                seen_codes.add(code)

                offer = self._parse_product(item)
                if offer:
                    all_offers.append(offer)
                else:
                    skipped_no_price += 1

            logger.info(
                "Lidl API offset=%d: %d items (unique so far: %d / %d total)",
                offset, len(items), len(all_offers), num_found,
            )

            offset += len(items)
            if offset >= num_found:
                break

        if skipped_no_price:
            logger.info(
                "Lidl: skipped %d items without price (upcoming products not yet priced)",
                skipped_no_price,
            )
        logger.info(
            "Total unique offers from %s: %d (of %d listed, %d unpriceable)",
            RETAILER_ID, len(all_offers), len(seen_codes), skipped_no_price,
        )
        return all_offers

    @staticmethod
    def _parse_product(item: dict) -> OfferDTO | None:
        gd = item.get("gridbox", {}).get("data", {})
        title = (gd.get("fullTitle") or "").strip()
        if not title:
            return None

        price_data = gd.get("price", {})
        price = price_data.get("price")

        # Fallback to oldPrice (regular price before discount) if current
        # price is missing — covers edge cases where discount expired but
        # the regular price is still valid.
        if price is None or price == "?":
            old = price_data.get("oldPrice")
            if old and isinstance(old, (int, float)) and old > 0:
                price = old
            else:
                return None

        try:
            price = float(price)
        except (TypeError, ValueError):
            return None
        if price <= 0:
            return None

        code = gd.get("erpNumber", "")
        canonical = gd.get("canonicalUrl") or gd.get("canonicalPath") or ""
        product_url = f"{_BASE}{canonical}" if canonical else _BASE

        # Parse unit price from basePrice text
        # Formats: "55 g | 1 kg = 1,82 €", "250 g / 1 kg = 2,20 €", "1 kg", "1 l"
        base_text = price_data.get("basePrice", {}).get("text", "")
        unit_price: float | None = None
        unit: str | None = None
        size_text: str | None = None

        sz_match = _SIZE_RE.search(base_text)
        if sz_match:
            size_text = f"{sz_match.group(1)} {sz_match.group(2)}"

        # Try title for size if basePrice has none
        if not size_text:
            sz_title = _SIZE_RE.search(title)
            if sz_title:
                size_text = f"{sz_title.group(1)} {sz_title.group(2)}"

        up_match = _UNIT_PRICE_RE.search(base_text)
        if up_match:
            unit = up_match.group(1).lower()
            try:
                unit_price = float(up_match.group(2).replace(",", "."))
            except ValueError:
                pass
        else:
            simple = _SIMPLE_UNIT_RE.match(base_text.strip())
            if simple:
                qty = float(simple.group(1).replace(",", "."))
                u = simple.group(2).lower()
                unit = u
                if qty > 0:
                    unit_price = round(price / qty, 2)

        brand_data = gd.get("brand", {})
        brand_name = brand_data.get("name") if isinstance(brand_data, dict) else None
        brand: str | None = brand_name.strip() if brand_name else None

        keyfacts = gd.get("keyfacts", {})
        category = keyfacts.get("wonCategoryPrimary", "")

        raw_json = json.dumps(
            {
                "lidl_code": code,
                "ians": gd.get("ians", []),
                "oldPrice": price_data.get("oldPrice"),
                "discount": price_data.get("discount", {}).get("percentageDiscount"),
                "category": category,
                "basePrice": base_text,
            },
            ensure_ascii=False,
        )

        return OfferDTO(
            title=title,
            price=price,
            url=product_url,
            brand=brand,
            size_text=size_text,
            unit_price=unit_price,
            unit=unit,
            raw_json=raw_json,
            source="api",
            category_path=category or None,
            category_root=(category.strip().lower() if category else None),
        )
