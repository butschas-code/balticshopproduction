"""Maxima Latvia adapter — scrapes full product catalog from Barbora.lv.

Barbora.lv is Maxima's e-grocery platform in Latvia.  Products are rendered
client-side (React SPA), so we use Playwright to:

1. Load the homepage (establishes session / cookies).
2. Discover leaf subcategory URLs from each grocery top-level category.
3. Navigate to every leaf subcategory and extract products.

Each product card exposes ``data-b-item-id``, a title (from ``<img alt>``),
a product URL slug, and concatenated price text that we parse with regex.

No login is required — the catalog is publicly browsable.
"""

from __future__ import annotations

import json
import re
import time
from typing import TYPE_CHECKING

from app.core.config import RATE_LIMIT_MIN
from app.core.logging import get_logger
from app.retailers.base import RetailerAdapter
from app.schemas.dto import OfferDTO, RetailerMeta

if TYPE_CHECKING:
    from playwright.sync_api import Page

logger = get_logger(__name__)

RETAILER_ID = "maxima_lv"
BASE_URL = "https://www.barbora.lv"

# Grocery top-level categories to crawl (skip cosmetics, cleaning, baby, home)
_GROCERY_ROOTS: list[str] = [
    "/piena-produkti-un-olas",
    "/augli-un-darzeni",
    "/maize-un-konditorejas-izstradajumi",
    "/gala-zivs-un-gatava-kulinarija",
    "/bakaleja",
    "/saldeta-partika",
    "/dzerieni",
]


class MaximaLvAdapter(RetailerAdapter):
    """Full-catalog adapter for Maxima Latvia via Barbora.lv (Playwright)."""

    def retailer_meta(self) -> RetailerMeta:
        return RetailerMeta(
            id=RETAILER_ID,
            name="Maxima Latvia",
            country="LV",
            currency="EUR",
            base_url=BASE_URL,
        )

    def fetch_offers(self) -> list[OfferDTO]:
        try:
            from playwright.sync_api import sync_playwright
        except ImportError:
            logger.error(
                "playwright is not installed — run: pip install playwright && playwright install chromium"
            )
            return []

        all_offers: list[OfferDTO] = []
        seen_ids: set[str] = set()

        with sync_playwright() as pw:
            browser = pw.chromium.launch(headless=True)
            ctx = browser.new_context(locale="lv-LV")
            page = ctx.new_page()

            try:
                self._init_session(page)
                leaf_cats = self._discover_leaf_categories(page)
                logger.info("Discovered %d leaf subcategories to crawl", len(leaf_cats))

                for i, cat_path in enumerate(leaf_cats):
                    try:
                        products = self._scrape_subcategory(page, cat_path)
                        new_count = 0
                        for pid, offer in products:
                            if pid not in seen_ids:
                                seen_ids.add(pid)
                                all_offers.append(offer)
                                new_count += 1
                        logger.info(
                            "[%d/%d] %s: %d products (%d new)",
                            i + 1, len(leaf_cats), cat_path.split("/")[-1],
                            len(products), new_count,
                        )
                    except Exception:
                        logger.exception("Failed subcategory %s", cat_path)

                    time.sleep(max(RATE_LIMIT_MIN, 0.3))
            finally:
                browser.close()

        logger.info("Total unique offers from %s: %d", RETAILER_ID, len(all_offers))
        return all_offers

    # ------------------------------------------------------------------
    # Session & category discovery
    # ------------------------------------------------------------------

    @staticmethod
    def _init_session(page: Page) -> None:
        page.goto(f"{BASE_URL}/", timeout=30_000)
        page.wait_for_timeout(2000)
        try:
            page.locator(
                "#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll"
            ).click(timeout=3000)
            page.wait_for_timeout(500)
        except Exception:
            pass

    @staticmethod
    def _discover_leaf_categories(page: Page) -> list[str]:
        """Visit each grocery root and collect leaf subcategory paths."""
        all_leaves: list[str] = []
        seen: set[str] = set()

        for root in _GROCERY_ROOTS:
            try:
                page.goto(f"{BASE_URL}{root}", timeout=30_000)
                page.wait_for_timeout(2500)

                subcats: list[dict[str, str]] = page.evaluate(
                    """(rootPath) => {
                    const links = document.querySelectorAll('a[href]');
                    const results = [];
                    const seen = new Set();
                    for (const a of links) {
                        const href = a.getAttribute('href') || '';
                        if (href.startsWith(rootPath + '/') && !seen.has(href)) {
                            seen.add(href);
                            const parts = href.split('/').filter(Boolean);
                            if (parts.length >= 3) results.push(href);
                        }
                    }
                    return results;
                }""",
                    root,
                )
                for path in subcats:
                    if path not in seen:
                        seen.add(path)
                        all_leaves.append(path)

                logger.info(
                    "Root %s: %d leaf subcategories", root.lstrip("/"), len(subcats),
                )
            except Exception:
                logger.exception("Failed to discover subcategories for %s", root)

        return all_leaves

    # ------------------------------------------------------------------
    # Product scraping
    # ------------------------------------------------------------------

    def _scrape_subcategory(
        self, page: Page, cat_path: str
    ) -> list[tuple[str, OfferDTO]]:
        page.goto(f"{BASE_URL}{cat_path}", timeout=30_000)
        page.wait_for_timeout(3000)

        # Scroll down a few times to trigger any lazy-loading
        for _ in range(3):
            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            page.wait_for_timeout(800)

        raw_products: list[dict] = page.evaluate(
            """() => {
            const items = document.querySelectorAll('[data-b-item-id]');
            return Array.from(items).map(item => {
                const id = item.getAttribute('data-b-item-id') || '';
                const img = item.querySelector('img');
                const title = img ? (img.getAttribute('alt') || '') : '';
                const link = item.querySelector('a[href*=produkti]');
                const href = link ? (link.getAttribute('href') || '') : '';
                const text = item.textContent.replace(/\\s+/g, ' ').trim();
                return { id, title, href, text };
            });
        }"""
        )

        results: list[tuple[str, OfferDTO]] = []
        for raw in raw_products:
            parsed = self._parse_product(raw, cat_path)
            if parsed:
                results.append(parsed)
        return results

    # ------------------------------------------------------------------
    # Price parsing
    # ------------------------------------------------------------------

    _PRICE_RE = re.compile(r"(\d+[.,]\d{2})\s*€")
    _UNIT_RE = re.compile(r"(\d+[.,]\d{2})\s*€\s*/\s*(kg|l|gab)")
    _SIZE_RE = re.compile(r"(\d+(?:[.,]\d+)?)\s*(kg|g|ml|l|gab)\b", re.I)

    def _parse_product(
        self, raw: dict, cat_path: str
    ) -> tuple[str, OfferDTO] | None:
        pid = raw.get("id", "").strip()
        title = raw.get("title", "").strip()
        if not pid or not title:
            return None

        text = raw.get("text", "")
        href = raw.get("href", "")

        # Extract prices from the concatenated text.
        # Pattern: promo€ unit€/x regular€ unit€/x  OR  price€ unit€/x
        # Remove "Pievienot" (add-to-cart text) before parsing
        clean = text.replace("Pievienot", "").replace("pievienot", "")
        price_matches = self._PRICE_RE.findall(clean)
        unit_match = self._UNIT_RE.search(clean)

        if not price_matches:
            return None

        prices = [float(p.replace(",", ".")) for p in price_matches]
        # First price is always the effective/current price
        effective_price = prices[0]
        if effective_price <= 0:
            return None

        unit_price: float | None = None
        unit: str | None = None
        if unit_match:
            unit_price = float(unit_match.group(1).replace(",", "."))
            unit = unit_match.group(2).lower()

        size_match = self._SIZE_RE.search(title)
        size_text = size_match.group(0) if size_match else None

        product_url = f"{BASE_URL}{href}" if href else f"{BASE_URL}{cat_path}"

        raw_json = json.dumps(
            {"barbora_id": pid, "prices_found": [str(p) for p in prices]},
            ensure_ascii=False,
        )

        offer = OfferDTO(
            title=title,
            price=effective_price,
            url=product_url,
            size_text=size_text,
            unit_price=unit_price,
            unit=unit,
            raw_json=raw_json,
            source="playwright",
            category_path=cat_path,
            category_root=cat_path.strip("/").replace("-", " ") or cat_path.strip("/"),
        )
        return pid, offer
