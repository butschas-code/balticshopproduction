"""Top! Latvia adapter — fetches full promotion catalog from etop.lv JSON API.

etop.lv exposes a public POST endpoint that returns the complete set of
promotional products (all categories) in a single paginated call.  No
authentication or Playwright is required.

Endpoint:  POST https://etop.lv/v1/Products/GetPromotionProducts
           Body: {"pageSize": 2000, "pageNumber": 1}
Response:  {"categories": [...], "list": [...], "totalCount": N, "hasMore": bool}
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

RETAILER_ID = "top_lv"
_BASE = "https://etop.lv"
_API_URL = f"{_BASE}/v1/Products/GetPromotionProducts"
_PAGE_SIZE = 2000

_UNIT_MAP: dict[int, str] = {
    1: "kg",
    2: "g",
    3: "l",
    7: "l",
    9: "l",
    10: "pcs",
    11: "kg",
}

_SIZE_RE = re.compile(r"(\d+(?:[.,]\d+)?)\s*(kg|g|ml|l|gab)\b", re.I)


class TopLvAdapter(RetailerAdapter):
    """Full-catalog adapter for Top! Latvia via etop.lv JSON API."""

    def retailer_meta(self) -> RetailerMeta:
        return RetailerMeta(
            id=RETAILER_ID,
            name="Top! Latvia",
            country="LV",
            currency="EUR",
            base_url=_BASE,
        )

    def fetch_offers(self) -> list[OfferDTO]:
        session = get_session()
        session.headers.update({
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Origin": _BASE,
            "Referer": f"{_BASE}/lv/visi-akcijas-produkti",
        })

        all_offers: list[OfferDTO] = []
        seen_ids: set[str] = set()
        page = 1

        while True:
            payload = {"pageSize": _PAGE_SIZE, "pageNumber": page}
            try:
                time.sleep(RATE_LIMIT_MIN)
                resp = session.post(_API_URL, json=payload, timeout=30)
                resp.raise_for_status()
                data = resp.json()
            except Exception:
                logger.exception("Top! API request failed (page %d)", page)
                break

            products = data.get("list", [])
            if not products:
                break

            for raw in products:
                pid = raw.get("id", "")
                if not pid or pid in seen_ids:
                    continue
                seen_ids.add(pid)

                offer = self._parse_product(raw)
                if offer:
                    all_offers.append(offer)

            has_more = data.get("hasMore", False)
            logger.info(
                "Top! API page %d: %d products (total unique so far: %d, hasMore=%s)",
                page, len(products), len(all_offers), has_more,
            )

            if not has_more:
                break
            page += 1

        logger.info("Total unique offers from %s: %d", RETAILER_ID, len(all_offers))
        return all_offers

    @staticmethod
    def _parse_product(raw: dict) -> OfferDTO | None:
        name = (raw.get("name") or "").strip()
        if not name:
            return None

        price = raw.get("discountedPrice") or raw.get("price") or 0
        try:
            price = float(price)
        except (TypeError, ValueError):
            return None
        if price <= 0:
            return None

        code = raw.get("code", "")
        product_url = f"{_BASE}/lv/visi-akcijas-produkti"

        unit_price_val = raw.get("unitPrice") or raw.get("discountedUnitPrice")
        unit_price: float | None = None
        if unit_price_val:
            try:
                unit_price = float(unit_price_val)
            except (TypeError, ValueError):
                pass

        unit_type = raw.get("priceTagUnitType") or raw.get("unitType")
        unit: str | None = _UNIT_MAP.get(unit_type) if unit_type else None

        size_match = _SIZE_RE.search(name)
        size_text: str | None = size_match.group(0) if size_match else None
        if not size_text:
            neto = raw.get("netoWeight")
            if neto and neto > 0:
                size_text = f"{neto}{'l' if unit in ('l',) else 'kg'}"

        brand = (raw.get("brand") or "").strip() or None

        raw_json = json.dumps(
            {
                "top_id": raw.get("id"),
                "code": code,
                "ean": raw.get("ean"),
                "price": raw.get("price"),
                "discountedPrice": raw.get("discountedPrice"),
                "category": (raw.get("category") or {}).get("name"),
                "parentKeyCode": raw.get("parentKeyCode"),
            },
            ensure_ascii=False,
        )

        cat_name = (raw.get("category") or {}).get("name") or ""
        return OfferDTO(
            title=name,
            price=price,
            url=product_url,
            brand=brand,
            size_text=size_text,
            unit_price=unit_price,
            unit=unit,
            raw_json=raw_json,
            source="api",
            category_path=cat_name or None,
            category_root=(cat_name.strip().lower() if cat_name else None),
        )
