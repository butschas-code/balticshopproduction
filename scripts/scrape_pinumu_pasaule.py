#!/usr/bin/env python3
import hashlib
import json
import math
import re
import time
from html import unescape
from pathlib import Path
from urllib.parse import parse_qs, quote, urlencode, urljoin, urlparse, urlunparse

import requests
from bs4 import BeautifulSoup


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data" / "partners"
PUBLIC_DIR = ROOT / "public" / "partners"
MIGRATIONS_DIR = ROOT / "supabase" / "migrations"

PARTNER_SLUG = "pinumu-pasaule"
BASE_URL = "https://www.pinumupasaule.lv"
SHOP_URL = f"{BASE_URL}/veikals?lang=en"
ABOUT_URL = f"{BASE_URL}/par-mums?lang=en"
WORKSHOPS_URL = f"{BASE_URL}/meistarklases?lang=en"
APP_ID = "1380b703-ce81-ff05-f115-39571d94dfcd"

SESSION = requests.Session()
SESSION.headers.update({"User-Agent": "Mozilla/5.0 (compatible; BalticProductsCatalog/1.0)"})

LATVIAN_NAME_PARTS = {
    "sēņu grozs": ("Mushroom basket", "Pilzkorb"),
    "sēņu grozi": ("Mushroom baskets", "Pilzkörbe"),
    "malkas grozs": ("Firewood basket", "Feuerholzkorb"),
    "malkas grozi": ("Firewood baskets", "Feuerholzkörbe"),
    "ceļojumu grozs": ("Travel basket", "Reisekorb"),
    "piknika grozs": ("Picnic basket", "Picknickkorb"),
    "pudeļu grozs": ("Bottle basket", "Flaschenkorb"),
    "tortes grozs": ("Cake basket", "Tortenkorb"),
    "iepirkumu grozs": ("Shopping basket", "Einkaufskorb"),
    "grozs": ("Basket", "Korb"),
    "groziņš": ("Small basket", "Kleiner Korb"),
    "groziņi": ("Small baskets", "Kleine Körbe"),
    "apaļš grozs": ("Round basket", "Runder Korb"),
    "apaļi grozi": ("Round baskets", "Runde Körbe"),
    "kamolgrozs": ("Yarn basket", "Wollkorb"),
    "velo grozs": ("Bicycle basket", "Fahrradkorb"),
    "veļas grozs": ("Laundry basket", "Wäschekorb"),
    "lampa": ("Wicker lamp", "Flechtlampe"),
    "lampas": ("Wicker lamps", "Flechtlampen"),
    "kaste": ("Wicker box", "Flechtkasten"),
    "kastes": ("Wicker boxes", "Flechtkästen"),
    "avīžu grozs": ("Magazine basket", "Zeitungskorb"),
    "sienas grozs": ("Wall basket", "Wandkorb"),
    "maizes kaste": ("Bread basket", "Brotkorb"),
    "paplāte": ("Wicker tray", "Flechttablett"),
    "paplātes": ("Wicker trays", "Flechttabletts"),
    "lietussargu grozs": ("Umbrella basket", "Schirmkorb"),
    "ziedu grozs": ("Flower basket", "Blumenkorb"),
    "klūgas": ("Willow wicker", "Weidenruten"),
}

CATEGORY_TRANSLATIONS = {
    "Flower baskets": ("flower-basket", "Flower basket", "Blumenkorb"),
    "Firewood baskets": ("firewood-basket", "Firewood basket", "Feuerholzkorb"),
    "Travel baskets": ("travel-basket", "Travel basket", "Reisekorb"),
    "Bottle baskets": ("bottle-basket", "Bottle basket", "Flaschenkorb"),
    "Botte baskets": ("bottle-basket", "Bottle basket", "Flaschenkorb"),
    "Cake baskets": ("cake-basket", "Cake basket", "Tortenkorb"),
    "Wicker shopping baskets": ("shopping-basket", "Shopping basket", "Einkaufskorb"),
    "Shopping baskets": ("shopping-basket", "Shopping basket", "Einkaufskorb"),
    "Mushroom baskets": ("mushroom-basket", "Mushroom basket", "Pilzkorb"),
    "Round baskets": ("round-basket", "Round basket", "Runder Korb"),
    "Gift baskets": ("gift-basket", "Gift basket", "Geschenkkorb"),
    "Baskets for yarn": ("yarn-basket", "Yarn basket", "Wollkorb"),
    "Small baskets": ("small-basket", "Small basket", "Kleiner Korb"),
    "Bicycle baskets": ("bicycle-basket", "Bicycle basket", "Fahrradkorb"),
    "Laundry baskets": ("laundry-basket", "Laundry basket", "Wäschekorb"),
    "Wicker furniture": ("furniture", "Wicker furniture", "Flechtmöbel"),
    "Wicker lamps": ("lamp", "Wicker lamp", "Flechtlampe"),
    "Wickerwork for animals": ("animal-basket", "Wickerwork for animals", "Flechtwerk für Tiere"),
    "Wicker boxes": ("box", "Wicker box", "Flechtkasten"),
    "Magazine baskets": ("magazine-basket", "Magazine basket", "Zeitungskorb"),
    "Wall baskets": ("wall-basket", "Wall basket", "Wandkorb"),
    "Bread baskets": ("bread-basket", "Bread basket", "Brotkorb"),
    "Bread boxes": ("bread-basket", "Bread basket", "Brotkorb"),
    "Wicker trays": ("tray", "Wicker tray", "Flechttablett"),
    "Wickerwork for children": ("children-basket", "Wickerwork for children", "Flechtwerk für Kinder"),
    "Wickerwork for kitchens and restaurants": ("kitchen-basket", "Kitchen and restaurant wickerwork", "Flechtwerk für Küchen und Restaurants"),
    "Wicker for kitchens & restaurants": ("kitchen-basket", "Kitchen and restaurant wickerwork", "Flechtwerk für Küchen und Restaurants"),
    "Baskets for umbrellas": ("umbrella-basket", "Umbrella basket", "Schirmkorb"),
    "Wickerwork for shops": ("shop-display", "Shop display wickerwork", "Flechtwerk für Geschäfte"),
    "Wickerwork for gardens": ("garden-basket", "Garden wickerwork", "Flechtwerk für Gärten"),
    "Wicker": ("wicker", "Willow wicker", "Weidenruten"),
}

COMMON_STORY_EN = (
    "Each basket is unique. Pinumu Pasaule works with natural willow wicker, so twig marks and insect bites can appear "
    "without affecting quality. Basket sizes may vary by approximately 2 to 3 centimeters. Peeled, unpeeled and stained "
    "willow wicker are used, and the exact wicker combinations may differ from the photographs."
)

COMMON_STORY_DE = (
    "Jeder Korb ist ein Unikat. Pinumu Pasaule arbeitet mit natürlicher Weide, daher können Zweigspuren und kleine "
    "Insektenstellen sichtbar sein, ohne die Qualität zu beeinträchtigen. Die Korbgrößen können um etwa 2 bis 3 "
    "Zentimeter variieren. Verwendet werden geschälte, ungeschälte und gebeizte Weidenruten; die genaue Kombination "
    "kann von den Fotos abweichen."
)

ARTISAN_BIO_EN = (
    "Pinumu Pasaule is the wicker world of the Tutāns family. The family's weaving story began in 1985 as a shared "
    "passion and grew into a business in 1999, starting with small baskets and trays. Today the makers work with "
    "peeled and unpeeled home-grown willow, an ecologically clean material, and every step from preparing the wicker "
    "to the finished object is handmade. The workshop makes baskets, trays, cradles, furniture, lamps and custom "
    "wickerwork. Master weaver Pēteris Tutāns learned the craft as a child and has shown his work in Latvia, France, "
    "China, the United States and Japan."
)

ARTISAN_BIO_DE = (
    "Pinumu Pasaule ist die Flechtwelt der Familie Tutāns. Die Geschichte der Familie begann 1985 als gemeinsame "
    "Leidenschaft und wurde 1999 zu einem Betrieb, zunächst mit kleinen Körben und Tabletts. Heute arbeiten die "
    "Macher mit geschälten und ungeschälten, selbst angebauten Weidenruten, einem ökologisch sauberen Material; "
    "jeder Schritt von der Vorbereitung der Ruten bis zum fertigen Objekt ist Handarbeit. Die Werkstatt fertigt "
    "Körbe, Tabletts, Wiegen, Möbel, Lampen und individuelle Flechtarbeiten. Flechtmeister Pēteris Tutāns lernte "
    "das Handwerk als Kind und zeigte seine Arbeiten in Lettland, Frankreich, China, den USA und Japan."
)


def slugify(value: str) -> str:
    value = value.lower()
    replacements = {
        "ā": "a",
        "č": "c",
        "ē": "e",
        "ģ": "g",
        "ī": "i",
        "ķ": "k",
        "ļ": "l",
        "ņ": "n",
        "š": "s",
        "ū": "u",
        "ž": "z",
        "ä": "a",
        "ö": "o",
        "ü": "u",
        "ß": "ss",
    }
    for source, target in replacements.items():
        value = value.replace(source, target)
    value = re.sub(r"[^a-z0-9]+", "-", value).strip("-")
    return value or hashlib.sha1(value.encode("utf-8")).hexdigest()[:10]


def fetch(url: str) -> str:
    last_error: Exception | None = None
    for attempt in range(4):
        try:
            response = SESSION.get(url, timeout=90)
            response.raise_for_status()
            return response.text
        except Exception as exc:
            last_error = exc
            time.sleep(1.5 + attempt)
    raise last_error or RuntimeError(f"Failed to fetch {url}")


def soup_for(url: str) -> BeautifulSoup:
    return BeautifulSoup(fetch(url), "html.parser")


def warmup(soup: BeautifulSoup) -> dict:
    script = soup.find("script", id="wix-warmup-data")
    if not script:
        return {}
    return json.loads(script.string or script.get_text())


def walk(value):
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from walk(child)
    elif isinstance(value, list):
        for child in value:
            yield from walk(child)


def strip_html(html: str) -> str:
    text = BeautifulSoup(html or "", "html.parser").get_text("\n", strip=True)
    text = unescape(text).replace("\xa0", " ")
    text = re.sub(r"\n{2,}", "\n", text)
    return text.strip()


def ensure_lang(url: str) -> str:
    parsed = urlparse(url)
    query = parse_qs(parsed.query)
    query["lang"] = ["en"]
    return urlunparse(parsed._replace(query=urlencode(query, doseq=True)))


def page_url(base: str, page: int) -> str:
    parsed = urlparse(base)
    query = parse_qs(parsed.query)
    query["lang"] = ["en"]
    if page > 1:
        query["page"] = [str(page)]
    else:
        query.pop("page", None)
    return urlunparse(parsed._replace(query=urlencode(query, doseq=True)))


def category_links() -> list[tuple[str, str]]:
    soup = soup_for(SHOP_URL)
    links: list[tuple[str, str]] = []
    seen = set()
    for a in soup.find_all("a", href=True):
        title = a.get_text(" ", strip=True)
        href = a["href"]
        if title not in CATEGORY_TRANSLATIONS:
            continue
        url = ensure_lang(urljoin(BASE_URL, href))
        key = (title, urlparse(url).path)
        if key in seen:
            continue
        seen.add(key)
        links.append((title, url))
    return links


def find_category_payload(data: dict) -> dict | None:
    for item in walk(data):
        if "productsWithMetaData" in item and "name" in item:
            return item
    return None


def find_product_payload(data: dict, url_part: str) -> dict | None:
    direct_key = f"productPage_EUR_{url_part}"
    app_data = data.get("appsWarmupData", {}).get(APP_ID, {})
    if direct_key in app_data:
        return app_data[direct_key].get("catalog", {}).get("product")
    for item in walk(data):
        if item.get("urlPart") == url_part and item.get("name") and "formattedPrice" in item:
            return item
    return None


def media_url(media: dict) -> str:
    media_id = media.get("id") or media.get("url")
    if media_id:
        return f"https://static.wixstatic.com/media/{media_id}/v1/fit/w_1200,h_1200,q_90/file.jpg"
    return media.get("fullUrl") or ""


def download_image(url: str, destination: Path) -> str | None:
    if destination.exists() and destination.stat().st_size > 1024:
        return f"/partners/{PARTNER_SLUG}/images/{destination.name}"
    try:
        response = SESSION.get(url, timeout=60)
        response.raise_for_status()
    except Exception as exc:
        print(f"warning: failed image {url}: {exc}")
        return None
    ctype = response.headers.get("content-type", "")
    if "image" not in ctype:
        return None
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_bytes(response.content)
    return f"/partners/{PARTNER_SLUG}/images/{destination.name}"


def translate_description(text: str, lang: str) -> str:
    if not text:
        return ""
    lines = [line.strip(" .") for line in text.splitlines() if line.strip()]
    translated: list[str] = []
    for line in lines:
        original = line
        lower = line.lower()
        line = re.sub(r"^izmērs:?$", "Size:" if lang == "en" else "Größe:", line, flags=re.I)
        line = re.sub(r"^izmēri:?$", "Sizes:" if lang == "en" else "Größen:", line, flags=re.I)
        line = re.sub(r"^diametrs:?$", "Diameter:" if lang == "en" else "Durchmesser:", line, flags=re.I)
        line = re.sub(r"^augstums:?$", "Height:" if lang == "en" else "Höhe:", line, flags=re.I)
        line = re.sub(r"^garums:?$", "Length:" if lang == "en" else "Länge:", line, flags=re.I)
        line = re.sub(r"^platums:?$", "Width:" if lang == "en" else "Breite:", line, flags=re.I)
        line = re.sub(r"^dziļums:?$", "Depth:" if lang == "en" else "Tiefe:", line, flags=re.I)
        line = re.sub(r"^krāsa:?$", "Color:" if lang == "en" else "Farbe:", line, flags=re.I)
        if "cena norādīta bez pvn" in lower:
            line = "Price excludes VAT." if lang == "en" else "Preis ohne MwSt."
        elif "the price is without vat" in lower:
            line = "Price excludes VAT." if lang == "en" else "Preis ohne MwSt."
        elif "pēc pasūtījuma" in lower:
            line = "Made to order." if lang == "en" else "Auf Bestellung gefertigt."
        elif "izgatavojam pēc pasūtījuma" in lower:
            line = "Made to order." if lang == "en" else "Auf Bestellung gefertigt."
        elif line == original:
            line = line.replace("h ", "h ")
        translated.append(line)
    text = " ".join(translated)
    if lang == "de":
        replacements = [
            ("Sizes:", "Größen:"),
            ("Size:", "Größe:"),
            ("Sample size:", "Beispielgröße:"),
            ("Base size:", "Grundmaß:"),
            ("Lower size:", "Unteres Maß:"),
            ("Upper size:", "Oberes Maß:"),
            ("Bottom tray size:", "Maß des unteren Tabletts:"),
            ("Top tray size:", "Maß des oberen Tabletts:"),
            ("Total height of the stand:", "Gesamthöhe des Ständers:"),
            ("Dimensions of the house:", "Maße des Hauses:"),
            ("The price is without VAT", "Preis ohne MwSt."),
            ("Price excludes VAT.", "Preis ohne MwSt."),
            ("Price", "Preis"),
            ("VAT", "MwSt."),
            ("PVN", "MwSt."),
            ("Available with and without lid", "Mit und ohne Deckel erhältlich"),
            ("Available with or without lid", "Mit oder ohne Deckel erhältlich"),
            ("Plywood bottom", "Sperrholzboden"),
            ("Can be made to individual sizes", "Kann nach individuellen Maßen gefertigt werden"),
            ("It is possible to make according to individual sizes", "Kann nach individuellen Maßen gefertigt werden"),
            ("We make according to individual sizes", "Wir fertigen nach individuellen Maßen"),
            ("The price depends on the size", "Der Preis hängt von der Größe ab"),
            ("Price depends on dimension of the basket", "Der Preis hängt von den Korbmaßen ab"),
        ]
        for source, target in replacements:
            text = text.replace(source, target)
    else:
        text = text.replace("The price is without VAT", "Price excludes VAT.")
        text = text.replace("PVN", "VAT")
    return text


def translate_name(name: str, category_title: str, lang: str) -> str:
    code_match = re.match(r"^([A-Za-z]+[0-9A-Za-z.-]*)", name.strip())
    code = code_match.group(1) if code_match else ""
    if category_title in CATEGORY_TRANSLATIONS:
        english = CATEGORY_TRANSLATIONS[category_title][1]
        german = CATEGORY_TRANSLATIONS[category_title][2]
    else:
        english = "Wicker basket"
        german = "Flechtkorb"
    lower = name.lower()
    for part, translated in LATVIAN_NAME_PARTS.items():
        if part in lower:
            english, german = translated
            break
    if not code and re.search(r"[A-Za-z]{3,}", name) and not re.search(r"[āčēģīķļņšūž]", name, re.I):
        return name
    translated = english if lang == "en" else german
    return f"{code} {translated}".strip()


def product_type_from_category(category_title: str) -> str:
    return CATEGORY_TRANSLATIONS.get(category_title, ("basket", "Basket", "Korb"))[0]


def detail_rows(description_en: str, product: dict) -> list[dict[str, str]]:
    rows: list[dict[str, str]] = []
    if description_en:
        for piece in re.split(r"(?<=\\.)\\s+", description_en):
            if not piece.strip():
                continue
            if ":" in piece or re.search(r"\d+\\s*(cm|m|mm|kg|g|l)\\b", piece, re.I):
                rows.append({"label": "Description", "value": piece.strip()})
    if product.get("sku"):
        rows.append({"label": "SKU", "value": str(product["sku"])})
    if product.get("ribbon"):
        rows.append({"label": "Availability", "value": str(product["ribbon"])})
    stock = product.get("inventory", {}).get("status")
    if stock:
        rows.append({"label": "Stock", "value": stock.replace("_", " ")})
    return rows


def q(value):
    if value is None:
        return "NULL"
    return "'" + str(value).replace("'", "''") + "'"


def qjson(value):
    return q(json.dumps(value, ensure_ascii=False)) + "::jsonb"


def build_migration(products: list[dict], artisan: dict) -> None:
    lines = [
        "-- Add Pinumu Pasaule catalog data",
        "begin;",
        "",
        "insert into public.partners (slug, name, website_url, location, craft, craft_de, bio, bio_de, portrait_url, workshop_images, is_active)",
        (
            f"values ({q(artisan['slug'])}, {q(artisan['name'])}, NULL, {q(artisan['location'])}, "
            f"{q(artisan['craft'])}, {q(artisan['craftDe'])}, {q(artisan['bio'])}, {q(artisan['bioDe'])}, "
            f"{q(artisan['portrait'])}, {qjson(artisan['workshopImages'])}, true)"
        ),
        "on conflict (slug) do update set",
        "  name = excluded.name,",
        "  website_url = NULL,",
        "  location = excluded.location,",
        "  craft = excluded.craft,",
        "  craft_de = excluded.craft_de,",
        "  bio = excluded.bio,",
        "  bio_de = excluded.bio_de,",
        "  portrait_url = excluded.portrait_url,",
        "  workshop_images = excluded.workshop_images,",
        "  is_active = true;",
        "",
        "insert into public.artisans (partner_id, slug, name, location, craft, craft_de, bio, bio_de, portrait_url, workshop_images, is_partner)",
        (
            f"select p.id, {q(artisan['slug'])}, {q(artisan['name'])}, {q(artisan['location'])}, "
            f"{q(artisan['craft'])}, {q(artisan['craftDe'])}, {q(artisan['bio'])}, {q(artisan['bioDe'])}, "
            f"{q(artisan['portrait'])}, {qjson(artisan['workshopImages'])}, true from public.partners p where p.slug = {q(artisan['slug'])}"
        ),
        "on conflict (slug) do update set",
        "  partner_id = excluded.partner_id,",
        "  name = excluded.name,",
        "  location = excluded.location,",
        "  craft = excluded.craft,",
        "  craft_de = excluded.craft_de,",
        "  bio = excluded.bio,",
        "  bio_de = excluded.bio_de,",
        "  portrait_url = excluded.portrait_url,",
        "  workshop_images = excluded.workshop_images,",
        "  is_partner = true;",
        "",
    ]

    for index, product in enumerate(products, start=1):
        price = "NULL" if product["priceAmount"] is None else f"{product['priceAmount']:.2f}"
        lines.extend(
            [
                "insert into public.products (partner_id, artisan_id, slug, partner_product_ref, artisan_name, location, price_amount, currency_code, is_partner_product, image_url, details, metadata, collection_slug, product_type, is_featured, shop_visible, shop_rank)",
                (
                    "select pr.id, ar.id, "
                    f"{q(product['slug'])}, {q(product['sourceRef'])}, {q(product['artisanName'])}, {q(product['location'])}, "
                    f"{price}, {q(product['currencyCode'])}, true, {q(product['image'])}, {qjson(product['details'])}, "
                    f"{qjson(product['metadata'])}, 'baskets', {q(product['productType'])}, "
                    f"{'true' if product['isFeatured'] else 'false'}, true, {index} "
                    "from public.partners pr left join public.artisans ar on ar.slug = "
                    f"{q(product['artisanSlug'])} where pr.slug = {q(product['artisanSlug'])}"
                ),
                "on conflict (slug) do update set",
                "  partner_id = excluded.partner_id,",
                "  artisan_id = excluded.artisan_id,",
                "  partner_product_ref = excluded.partner_product_ref,",
                "  artisan_name = excluded.artisan_name,",
                "  location = excluded.location,",
                "  price_amount = excluded.price_amount,",
                "  currency_code = excluded.currency_code,",
                "  image_url = excluded.image_url,",
                "  details = excluded.details,",
                "  metadata = excluded.metadata,",
                "  collection_slug = excluded.collection_slug,",
                "  product_type = excluded.product_type,",
                "  is_featured = excluded.is_featured,",
                "  shop_visible = excluded.shop_visible,",
                "  shop_rank = excluded.shop_rank;",
                "",
            ]
        )
        for locale, suffix in (("en", ""), ("de", "De")):
            lines.extend(
                [
                    "insert into public.product_translations (product_id, locale, name, description, story, craft, materials, technique)",
                    (
                        "select p.id, "
                        f"{q(locale)}, {q(product['name' + suffix])}, {q(product['description' + suffix])}, "
                        f"{q(product['story' + suffix])}, {q(product['craft' + suffix])}, "
                        f"{q(product['materials' + suffix])}, {q(product['technique' + suffix])} "
                        f"from public.products p where p.slug = {q(product['slug'])}"
                    ),
                    "on conflict (product_id, locale) do update set",
                    "  name = excluded.name,",
                    "  description = excluded.description,",
                    "  story = excluded.story,",
                    "  craft = excluded.craft,",
                    "  materials = excluded.materials,",
                    "  technique = excluded.technique;",
                    "",
                ]
            )
        lines.append(f"delete from public.product_images where product_id = (select id from public.products where slug = {q(product['slug'])});")
        for image_index, image_url in enumerate(product["images"]):
            lines.append(
                "insert into public.product_images (product_id, image_url, position) "
                f"select p.id, {q(image_url)}, {image_index} from public.products p where p.slug = {q(product['slug'])} "
                "on conflict (product_id, image_url) do update set position = excluded.position;"
            )
        lines.append("")

    lines.extend(["commit;", ""])
    out = MIGRATIONS_DIR / "20260715120000_add_pinumu_pasaule_catalog.sql"
    out.write_text("\n".join(lines), encoding="utf-8")


def scrape_artisan_images() -> list[str]:
    image_ids: list[str] = []
    for url in [ABOUT_URL, WORKSHOPS_URL, f"{BASE_URL}?lang=en", SHOP_URL]:
        html = fetch(url)
        for match in re.finditer(r"([a-z0-9]+_[a-f0-9]+~mv2\.(?:jpg|jpeg|png))", html, re.I):
            media_id = match.group(1)
            if media_id not in image_ids:
                image_ids.append(media_id)
    selected = [mid for mid in image_ids if "694227d456f54732b0f0e361f10320cc" not in mid][:14]
    paths: list[str] = []
    for index, media_id in enumerate(selected, start=1):
        url = f"https://static.wixstatic.com/media/{media_id}/v1/fit/w_1400,h_1400,q_90/file.jpg"
        path = download_image(url, PUBLIC_DIR / PARTNER_SLUG / "images" / f"workshop-{index:02d}.jpg")
        if path:
            paths.append(path)
    return paths


def main() -> None:
    category_products: dict[str, dict] = {}
    category_meta: dict[str, dict] = {}
    for category_title, category_url in category_links():
        first_soup = soup_for(category_url)
        payload = find_category_payload(warmup(first_soup))
        if not payload:
            continue
        total = int(payload.get("productsWithMetaData", {}).get("totalCount") or len(payload.get("productsWithMetaData", {}).get("list", [])))
        pages = max(1, math.ceil(total / 9))
        for page in range(1, pages + 1):
            url = page_url(category_url, page)
            if page == 1:
                data = payload
            else:
                data = find_category_payload(warmup(soup_for(url)))
            if not data:
                continue
            for product in data.get("productsWithMetaData", {}).get("list", []):
                url_part = product.get("urlPart")
                if not url_part:
                    continue
                if url_part not in category_products:
                    category_products[url_part] = product
                    category_meta[url_part] = {"categoryTitle": category_title, "categoryUrl": category_url}
        print(f"scraped category {category_title}: expected {total}, pages {pages}")
        time.sleep(0.15)

    products: list[dict] = []
    for index, (url_part, product_stub) in enumerate(sorted(category_products.items()), start=1):
        detail_url = f"{BASE_URL}/product-page/{quote(url_part)}?lang=en"
        product = find_product_payload(warmup(soup_for(detail_url)), url_part) or product_stub
        meta = category_meta[url_part]
        category_title = meta["categoryTitle"]
        product_type = product_type_from_category(category_title)
        slug = f"{PARTNER_SLUG}-{slugify(url_part)}"
        raw_description = strip_html(product.get("description") or "")
        description_en = translate_description(raw_description, "en")
        description_de = translate_description(raw_description, "de")
        name_en = translate_name(product.get("name") or url_part, category_title, "en")
        name_de = translate_name(product.get("name") or url_part, category_title, "de")
        media = [item for item in product.get("media", []) if item.get("mediaType", "PHOTO") == "PHOTO"]
        image_paths: list[str] = []
        for media_index, item in enumerate(media, start=1):
            path = download_image(media_url(item), PUBLIC_DIR / PARTNER_SLUG / "images" / f"{slug}-{media_index:02d}.jpg")
            if path and path not in image_paths:
                image_paths.append(path)
        if not image_paths:
            continue
        price = product.get("discountedPrice") or product.get("price")
        try:
            price_amount = float(price)
        except Exception:
            price_amount = None
        english_category = CATEGORY_TRANSLATIONS.get(category_title, ("basket", "Wicker basket", "Flechtkorb"))[1]
        german_category = CATEGORY_TRANSLATIONS.get(category_title, ("basket", "Wicker basket", "Flechtkorb"))[2]
        products.append(
            {
                "slug": slug,
                "sourceRef": product.get("id") or url_part,
                "name": name_en,
                "nameDe": name_de,
                "description": description_en,
                "descriptionDe": description_de,
                "price": product.get("formattedDiscountedPrice") or product.get("formattedPrice") or (f"€ {price_amount:.2f}" if price_amount is not None else "€ —"),
                "priceAmount": price_amount,
                "currencyCode": product.get("currency") or "EUR",
                "image": image_paths[0],
                "images": image_paths,
                "artisanSlug": PARTNER_SLUG,
                "artisanName": "Pinumu Pasaule",
                "location": "Rīga and Smārde parish, Latvia",
                "craft": f"Handwoven willow wicker, {english_category.lower()}",
                "craftDe": f"Handgeflochtene Weide, {german_category}",
                "materials": "Home-grown peeled and unpeeled willow wicker",
                "materialsDe": "Selbst angebaute geschälte und ungeschälte Weidenruten",
                "technique": "Handwoven wickerwork",
                "techniqueDe": "Handgeflochtenes Flechtwerk",
                "story": COMMON_STORY_EN,
                "storyDe": COMMON_STORY_DE,
                "details": detail_rows(description_en, product),
                "isPartnerProduct": True,
                "collectionSlug": "baskets",
                "productType": product_type,
                "isFeatured": index <= 18 or product_type in {"mushroom-basket", "shopping-basket", "tray", "lamp", "furniture"},
                "shopVisible": True,
                "shopRank": index,
                "metadata": {
                    "source": "pinumu-pasaule-scraper",
                    "category": category_title,
                    "sourcePath": url_part,
                    "isInStock": bool(product.get("isInStock", True)),
                    "rawName": product.get("name") or "",
                },
            }
        )
        if index % 25 == 0:
            print(f"scraped product details {index}/{len(category_products)}")
        time.sleep(0.05)

    workshop_images = scrape_artisan_images()
    portrait = workshop_images[0] if workshop_images else (products[0]["image"] if products else "")
    artisan = {
        "slug": PARTNER_SLUG,
        "name": "Pinumu Pasaule",
        "location": "Rīga and Smārde parish, Latvia",
        "craft": "Handwoven willow wicker baskets and objects",
        "craftDe": "Handgeflochtene Körbe und Objekte aus Weide",
        "bio": ARTISAN_BIO_EN,
        "bioDe": ARTISAN_BIO_DE,
        "portrait": portrait,
        "workshopImages": workshop_images[1:13] if len(workshop_images) > 1 else [p["image"] for p in products[:8]],
        "isPartner": True,
    }

    partner_dir = DATA_DIR / PARTNER_SLUG
    partner_dir.mkdir(parents=True, exist_ok=True)
    (partner_dir / "artisan.json").write_text(json.dumps(artisan, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (partner_dir / "products.json").write_text(json.dumps(products, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    all_artisans = json.loads((DATA_DIR / "all-artisans.json").read_text(encoding="utf-8"))
    all_artisans = [item for item in all_artisans if item.get("slug") != PARTNER_SLUG] + [artisan]
    all_artisans.sort(key=lambda item: item["name"].lower())
    (DATA_DIR / "all-artisans.json").write_text(json.dumps(all_artisans, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    all_products = json.loads((DATA_DIR / "all-products.json").read_text(encoding="utf-8"))
    all_products = [item for item in all_products if item.get("artisanSlug") != PARTNER_SLUG] + products
    (DATA_DIR / "all-products.json").write_text(json.dumps(all_products, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    build_migration(products, artisan)
    print(f"wrote {len(products)} Pinumu Pasaule products and {len(artisan['workshopImages']) + 1} artisan images")


if __name__ == "__main__":
    main()
