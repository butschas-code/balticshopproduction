from __future__ import annotations

import json
import re

from bs4 import BeautifulSoup, Tag

from app.core.config import RETAILER_CATEGORY_URLS
from app.core.http import fetch_url, get_session
from app.core.logging import get_logger
from app.retailers.base import RetailerAdapter
from app.schemas.dto import OfferDTO, RetailerMeta

logger = get_logger(__name__)

RETAILER_ID = "rimi_lv"
_BASE = "https://www.rimi.lv"
_CATEGORY_TREE_API = f"{_BASE}/e-veikals/api/v1/content/category-tree"
_PAGE_SIZE = 100
_MAX_PAGES = 20

# Top-level Rimi categories that contain grocery products.
# Non-grocery roots (home, pets, hygiene, baby, services) are excluded.
_GROCERY_ROOT_CODES: set[str] = {
    "SH-1",   # Alkoholiskie dzērieni
    "SH-2",   # Augļi un dārzeņi
    "SH-4",   # Iepakotā pārtika
    "SH-5",   # Dzērieni
    "SH-6",   # Gaļa, zivis un gatavā kulinārija
    "SH-7",   # Maize un konditoreja
    "SH-11",  # Piena produkti un olas
    "SH-12",  # Saldētie ēdieni
    "SH-13",  # Saldumi un uzkodas
    "SH-16",  # Vegāniem un veģetāriešiem
    "SH-20",  # Gatavots Rimi (prepared food)
}


class RimiLvAdapter(RetailerAdapter):
    def retailer_meta(self) -> RetailerMeta:
        return RetailerMeta(
            id=RETAILER_ID,
            name="Rimi Latvia",
            country="LV",
            currency="EUR",
            base_url=_BASE,
        )

    def fetch_offers(self) -> list[OfferDTO]:
        session = get_session()

        urls = self._discover_category_urls(session)
        if not urls:
            urls = RETAILER_CATEGORY_URLS.get(RETAILER_ID, [])
            logger.warning(
                "Category API unavailable, falling back to %d manual URLs",
                len(urls),
            )
        if not urls:
            logger.warning("No category URLs for %s", RETAILER_ID)
            return []

        all_offers: list[OfferDTO] = []
        seen_keys: set[str] = set()

        for i, url in enumerate(urls):
            try:
                path_part = url.replace(_BASE, "").strip("/") if url.startswith(_BASE) else url
                category_path = path_part or url
                category_root = path_part.split("/")[-1] if path_part else ""
                cat_offers = self._fetch_category_all_pages(session, url, category_path, category_root)

                new_count = 0
                for offer in cat_offers:
                    dedup = f"{offer.title}|{offer.price}"
                    if dedup not in seen_keys:
                        seen_keys.add(dedup)
                        all_offers.append(offer)
                        new_count += 1

                cat_id = url.rsplit("/c/", 1)[-1] if "/c/" in url else url[-30:]
                logger.info(
                    "[%d/%d] %s: %d products (%d new, %d duplicate)",
                    i + 1, len(urls), cat_id,
                    len(cat_offers), new_count, len(cat_offers) - new_count,
                )
            except Exception:
                logger.exception("Failed to fetch %s", url)

        logger.info("Total unique offers from %s: %d", RETAILER_ID, len(all_offers))
        return all_offers

    # ------------------------------------------------------------------
    # Auto-discover categories from Rimi's API
    # ------------------------------------------------------------------

    def _discover_category_urls(self, session) -> list[str]:  # noqa: ANN001
        """Fetch the category tree API and return all 2nd-level grocery URLs."""
        try:
            resp = fetch_url(session, _CATEGORY_TREE_API)
            data = resp.json()
        except Exception:
            logger.warning("Could not fetch Rimi category tree API")
            return []

        urls: list[str] = []
        for top in data.get("categories", []):
            top_url = top.get("url", "")
            top_code = top_url.rsplit("/c/", 1)[-1] if "/c/" in top_url else ""
            if top_code not in _GROCERY_ROOT_CODES:
                continue

            for child in top.get("descendants", []):
                child_url = child.get("url", "")
                if not child_url:
                    continue
                if child_url.startswith("/"):
                    full_url = f"{_BASE}{child_url}"
                else:
                    full_url = child_url
                urls.append(full_url)

        logger.info(
            "Discovered %d grocery category URLs from Rimi API", len(urls),
        )
        return urls

    # ------------------------------------------------------------------
    # Paginated category fetch
    # ------------------------------------------------------------------

    def _fetch_category_all_pages(self, session, base_url: str, category_path: str = "", category_root: str = "") -> list[OfferDTO]:  # noqa: ANN001
        """Fetch ALL pages for a single category using ``?pageSize=&currentPage=``."""
        all_page_offers: list[OfferDTO] = []

        for page in range(1, _MAX_PAGES + 1):
            sep = "&" if "?" in base_url else "?"
            page_url = f"{base_url}{sep}pageSize={_PAGE_SIZE}&currentPage={page}"

            offers = self._try_api_first(session, page_url, category_path, category_root)
            if not offers:
                offers = self._parse_html_category(session, page_url, category_path, category_root)

            if not offers:
                break

            all_page_offers.extend(offers)
            logger.debug(
                "  page %d: %d products (running total %d)",
                page, len(offers), len(all_page_offers),
            )

            if len(offers) < _PAGE_SIZE:
                break

        return all_page_offers

    # ------------------------------------------------------------------
    # Strategy 1: embedded JSON / API data in page source
    # ------------------------------------------------------------------

    def _try_api_first(self, session, category_url: str, category_path: str = "", category_root: str = "") -> list[OfferDTO]:  # noqa: ANN001
        try:
            response = fetch_url(session, category_url)
            html = response.text

            offers = self._extract_from_datalayer(html, category_url, category_path, category_root)
            if offers:
                return offers

            soup = BeautifulSoup(html, "lxml")
            for script in soup.find_all("script", type="application/ld+json"):
                try:
                    data = json.loads(script.string or "")
                    if isinstance(data, dict) and data.get("@type") == "ItemList":
                        return self._parse_jsonld(data, category_url, category_path, category_root)
                except (json.JSONDecodeError, TypeError):
                    continue

            for script in soup.find_all("script"):
                text = script.string or ""
                for pattern in (
                    r"window\.__INITIAL_STATE__\s*=\s*(\{.+?\});",
                    r"window\.__NEXT_DATA__\s*=\s*(\{.+?\});",
                ):
                    m = re.search(pattern, text, re.DOTALL)
                    if m:
                        try:
                            data = json.loads(m.group(1))
                            parsed = self._parse_initial_state(data, category_url, category_path, category_root)
                            if parsed:
                                return parsed
                        except json.JSONDecodeError:
                            continue
        except Exception:
            logger.debug("API/JSON extraction failed for %s", category_url, exc_info=True)
        return []

    def _extract_from_datalayer(self, html: str, base_url: str, category_path: str = "", category_root: str = "") -> list[OfferDTO]:
        """Try to grab product info from GTM dataLayer pushes."""
        offers: list[OfferDTO] = []
        for m in re.finditer(
            r"dataLayer\.push\((\{.*?\})\);", html, re.DOTALL
        ):
            try:
                blob = json.loads(m.group(1))
                ecommerce = blob.get("ecommerce", {})
                impressions = ecommerce.get("impressions", ecommerce.get("items", []))
                for item in impressions:
                    name = item.get("name", "")
                    price = item.get("price")
                    if name and price:
                        offers.append(
                            OfferDTO(
                                title=name,
                                price=float(price),
                                url=base_url,
                                brand=item.get("brand"),
                                raw_json=json.dumps(item, ensure_ascii=False),
                                source="api",
                                category_path=category_path or None,
                                category_root=category_root or None,
                            )
                        )
            except (json.JSONDecodeError, TypeError, ValueError):
                continue
        return offers

    def _parse_jsonld(self, data: dict, base_url: str, category_path: str = "", category_root: str = "") -> list[OfferDTO]:
        offers: list[OfferDTO] = []
        for item in data.get("itemListElement", []):
            try:
                product = item.get("item", item)
                offer_data = product.get("offers", {})
                if isinstance(offer_data, list):
                    offer_data = offer_data[0] if offer_data else {}
                offers.append(
                    OfferDTO(
                        title=product.get("name", ""),
                        price=float(offer_data.get("price", 0)),
                        url=product.get("url", base_url),
                        brand=(
                            product["brand"].get("name")
                            if isinstance(product.get("brand"), dict)
                            else product.get("brand")
                        ),
                        raw_json=json.dumps(item, ensure_ascii=False),
                        source="api",
                        category_path=category_path or None,
                        category_root=category_root or None,
                    )
                )
            except (ValueError, TypeError):
                logger.debug("Skipping JSON-LD item", exc_info=True)
        return offers

    def _parse_initial_state(self, data: dict, base_url: str, category_path: str = "", category_root: str = "") -> list[OfferDTO]:
        products = data.get(
            "products",
            data.get("categoryProducts", {}).get("products", []),
        )
        if isinstance(products, dict):
            products = products.get("items", [])
        offers: list[OfferDTO] = []
        for p in products:
            try:
                offers.append(
                    OfferDTO(
                        title=p.get("name", ""),
                        price=float(
                            p.get("priceWithDiscount", p.get("currentPrice", p.get("price", 0)))
                        ),
                        url=base_url + p.get("url", ""),
                        brand=p.get("brand"),
                        size_text=p.get("content"),
                        raw_json=json.dumps(p, ensure_ascii=False),
                        source="api",
                        category_path=category_path or None,
                        category_root=category_root or None,
                    )
                )
            except (ValueError, TypeError):
                logger.debug("Skipping state product", exc_info=True)
        return offers

    # ------------------------------------------------------------------
    # Strategy 2: HTML scraping fallback
    # ------------------------------------------------------------------

    def _parse_html_category(self, session, url: str, category_path: str = "", category_root: str = "") -> list[OfferDTO]:  # noqa: ANN001
        try:
            response = fetch_url(session, url)
            soup = BeautifulSoup(response.text, "lxml")
            offers: list[OfferDTO] = []

            product_cards = self._find_product_cards(soup)
            if not product_cards:
                logger.warning(
                    "No product containers found for %s – trying price-pattern fallback", url
                )
                return self._extract_by_price_patterns(soup, url, category_path, category_root)

            for card in product_cards:
                try:
                    offer = self._parse_product_card(card, url, category_path, category_root)
                    if offer:
                        offers.append(offer)
                except Exception:
                    logger.debug("Failed to parse product card", exc_info=True)

            return offers
        except Exception:
            logger.exception("HTML parsing failed for %s", url)
            return []

    @staticmethod
    def _find_product_cards(soup: BeautifulSoup) -> list[Tag]:
        selectors = [
            "div.product-grid__item",
            "li.product-grid__item",
            "div[data-product-code]",
            ".js-product-container",
            "div.card.card--product",
            "div.card",
        ]
        for sel in selectors:
            cards = soup.select(sel)
            if cards:
                logger.debug("Found %d cards with selector '%s'", len(cards), sel)
                return cards  # type: ignore[return-value]
        return []

    def _parse_product_card(self, card: Tag, base_url: str, category_path: str = "", category_root: str = "") -> OfferDTO | None:
        title = self._extract_title(card)
        if not title:
            return None

        price = self._extract_price(card)
        if price is None or price <= 0:
            return None

        link = card.select_one("a[href]")
        product_url = (link["href"] if link else "") or ""
        if product_url and not str(product_url).startswith("http"):
            product_url = "https://www.rimi.lv" + str(product_url)

        size_el = card.select_one(
            ".card__size, .product-weight, .card__weight, .card__params"
        )
        size_text = size_el.get_text(strip=True) if size_el else None

        unit_price, unit = self._extract_unit_price(card)

        return OfferDTO(
            title=title,
            price=price,
            url=str(product_url) or base_url,
            size_text=size_text,
            unit_price=unit_price,
            unit=unit,
            source="html",
            category_path=category_path or None,
            category_root=category_root or None,
        )

    @staticmethod
    def _extract_title(card: Tag) -> str:
        for sel in (
            ".card__name",
            ".product-name",
            "[data-product-name]",
            "h3",
            "h4",
            ".name",
        ):
            el = card.select_one(sel)
            if el:
                return el.get_text(strip=True)
        parts = card.select(".card__name-text, .product__name-text")
        return " ".join(p.get_text(strip=True) for p in parts)

    @staticmethod
    def _extract_price(card: Tag) -> float | None:
        price_attr = card.get("data-price") or card.get("data-product-price")
        if price_attr:
            try:
                return float(str(price_attr))
            except ValueError:
                pass

        euros_el = card.select_one(
            ".card__price-value, .price-whole, .price__whole"
        )
        cents_el = card.select_one(
            ".card__price-decimal, .price-decimal, .price__decimal"
        )
        if euros_el:
            try:
                euros = int(re.sub(r"\D", "", euros_el.get_text(strip=True)))
                cents = (
                    int(re.sub(r"\D", "", cents_el.get_text(strip=True)))
                    if cents_el
                    else 0
                )
                return euros + cents / 100
            except (ValueError, TypeError):
                pass

        price_el = card.select_one(
            ".card__price, .product-price, .price, [data-price]"
        )
        if price_el:
            m = re.search(r"(\d+)[.,](\d{2})", price_el.get_text(strip=True))
            if m:
                return float(f"{m.group(1)}.{m.group(2)}")

        return None

    @staticmethod
    def _extract_unit_price(card: Tag) -> tuple[float | None, str | None]:
        el = card.select_one(".card__price-per, .product-unit-price")
        if not el:
            return None, None
        text = el.get_text(strip=True)
        m = re.search(
            r"([\d,.]+)\s*[^\d]*?/?\s*(kg|l|gab|pcs|100g|100ml)", text, re.I
        )
        if m:
            return float(m.group(1).replace(",", ".")), m.group(2).lower()
        return None, None

    @staticmethod
    def _extract_by_price_patterns(soup: BeautifulSoup, base_url: str, category_path: str = "", category_root: str = "") -> list[OfferDTO]:
        """Last-resort: scan entire page for price-like strings."""
        offers: list[OfferDTO] = []
        seen: set[str] = set()
        for el in soup.find_all(string=re.compile(r"\d+[.,]\d{2}\s*\u20ac")):
            parent = el.find_parent()
            if not parent:
                continue
            container = parent.find_parent() or parent
            title_candidate = container.get_text(" ", strip=True)[:200]
            if title_candidate in seen:
                continue
            seen.add(title_candidate)
            m = re.search(r"(\d+[.,]\d{2})", str(el))
            if m:
                price = float(m.group(1).replace(",", "."))
                if 0.01 < price < 1000:
                    offers.append(
                        OfferDTO(
                            title=title_candidate,
                            price=price,
                            url=base_url,
                            source="html",
                            category_path=category_path or None,
                            category_root=category_root or None,
                        )
                    )
        return offers
