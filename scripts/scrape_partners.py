#!/usr/bin/env python3
import argparse
import json
import re
import shutil
import hashlib
import unicodedata
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup
from deep_translator import GoogleTranslator

ROOT = Path('/Users/sascha/Latvian Products Shop/Website')
DATA_DIR = ROOT / 'data' / 'partners'
PUBLIC_PARTNERS_DIR = ROOT / 'public' / 'partners'
CATALOG_TS = ROOT / 'src' / 'data' / 'catalog.ts'
RAIBI_LOCAL_DIR = Path('/Users/sascha/Latvian Products Shop/product images/Raibi Koki')

PARTNER_ORDER = [
    'vaidava-ceramics',
    'cepli',
    'cerannic',
    'latvijas-labumu-tirgus-mals',
    'raibi-koki',
    'studio-natural',
]

session = requests.Session()
session.headers.update({'User-Agent': 'Mozilla/5.0 (compatible; BalticShopBot/2.0)'})

EN_TRANSLATOR = GoogleTranslator(source='auto', target='en')
DE_TRANSLATOR = GoogleTranslator(source='auto', target='de')
_translate_pool = ThreadPoolExecutor(max_workers=4)
_trans_cache: dict[tuple[str, str], str] = {}


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'&[a-z]+;', ' ', text)
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return re.sub(r'-+', '-', text).strip('-') or 'item'


def to_text(value) -> str:
    if value is None:
        return ''
    if isinstance(value, (list, tuple, set)):
        return ', '.join(str(v) for v in value if v is not None)
    return str(value)


def strip_html(html: str) -> str:
    if not html:
        return ''
    soup = BeautifulSoup(html, 'html.parser')
    return re.sub(r'\s+', ' ', soup.get_text(' ', strip=True)).strip()


def is_probably_latvian(text: str) -> bool:
    if not text:
        return False
    if re.search(r'[āčēģīķļņšūžĀČĒĢĪĶĻŅŠŪŽ]', text):
        return True
    lv_words = [' un ', ' ar ', ' no ', ' par ', ' krūze ', ' šķīvis ', ' bļoda ', ' dēlis ', ' latvijā ']
    lt = f" {text.lower()} "
    return sum(1 for w in lv_words if w in lt) >= 2


def translate_text(text: str, target: str) -> str:
    text = (text or '').strip()
    if not text:
        return ''
    key = (text, target)
    if key in _trans_cache:
        return _trans_cache[key]

    translator = EN_TRANSLATOR if target == 'en' else DE_TRANSLATOR

    def do_translate(payload: str) -> str:
        return translator.translate(payload)

    try:
        if len(text) <= 4800:
            out = _translate_pool.submit(do_translate, text).result(timeout=12)
        else:
            chunks: list[str] = []
            cur = ''
            for sentence in re.split(r'(?<=[.!?])\s+', text):
                if len(cur) + len(sentence) > 4200 and cur:
                    chunks.append(cur)
                    cur = sentence
                else:
                    cur = (cur + ' ' + sentence).strip()
            if cur:
                chunks.append(cur)
            out = ' '.join(_translate_pool.submit(do_translate, c).result(timeout=12) for c in chunks)
    except Exception:
        out = text

    _trans_cache[key] = out
    return out


def ensure_dirs(partner_slug: str):
    p_data = DATA_DIR / partner_slug
    p_imgs = PUBLIC_PARTNERS_DIR / partner_slug / 'images'
    p_data.mkdir(parents=True, exist_ok=True)
    p_imgs.mkdir(parents=True, exist_ok=True)
    return p_data, p_imgs


def image_ext_from_url(url: str) -> str:
    ext = Path(urlparse(url).path).suffix.lower()
    return ext if ext in {'.jpg', '.jpeg', '.png', '.webp', '.gif'} else '.jpg'


def download_image(url: str, dest_dir: Path) -> str:
    if not url:
        return ''
    h = hashlib.sha1(url.encode()).hexdigest()[:14]
    filename = f'{h}{image_ext_from_url(url)}'
    out = dest_dir / filename
    if not out.exists():
        try:
            r = session.get(url, timeout=40)
            if r.status_code == 200 and r.content:
                out.write_bytes(r.content)
        except Exception:
            return ''
    return '/' + str(out.relative_to(ROOT / 'public')).replace('\\', '/')


def download_named_image(url: str, dest_dir: Path, filename: str) -> str:
    if not url:
        return ''
    dest_dir.mkdir(parents=True, exist_ok=True)
    out = dest_dir / filename
    try:
        r = session.get(url, timeout=40)
        if r.status_code == 200 and r.content:
            out.write_bytes(r.content)
            return '/' + str(out.relative_to(ROOT / 'public')).replace('\\', '/')
    except Exception:
        return ''
    return '/' + str(out.relative_to(ROOT / 'public')).replace('\\', '/') if out.exists() else ''


PARTNER_MEDIA_SOURCES = {
    'vaidava-ceramics': {
        'portrait': 'https://vaidava.com/cdn/shop/files/clay-craftsman-working.jpg?v=1679904289&width=2000',
        'workshop': [
            'https://vaidava.com/cdn/shop/files/ceramic-bowl-sculpting.jpg?v=1681718822&width=2000',
            'https://vaidava.com/cdn/shop/files/01.07.2022_VAIDAVA_323_of_376.jpg?v=1739278644&width=2000',
        ],
    },
    'cepli': {
        'portrait': 'https://www.cepli.lv/wp-content/uploads/2026/03/IMG_0822.jpg',
        'workshop': [
            'https://www.cepli.lv/wp-content/uploads/2020/06/Galvenā-bilde-ceplis.jpg',
            'https://www.cepli.lv/wp-content/uploads/2026/03/IMG_0769.jpg',
            'https://www.cepli.lv/wp-content/uploads/2026/03/IMG_0774.jpg',
        ],
    },
    'cerannic': {
        'portrait': 'https://site-2141663.mozfiles.com/files/2141663/inlinepicturesbox/medium/215902030_10223384337911088_5391095339784461632_n-1.jpg',
        'workshop': [],
    },
    'latvijas-labumu-tirgus-mals': {
        'portrait': 'https://www.latvijaslabumstirgus.lv/pictures/scs-6937c50e4817d.jpg',
        'workshop': [
            'https://www.latvijaslabumstirgus.lv/pictures/c43-hiviqepywu.jpeg',
            'https://www.latvijaslabumstirgus.lv/pictures/c43-gikatuzyla.jpeg',
        ],
    },
    'studio-natural': {
        'portrait': 'https://www.studionatural.lv/cdn/shop/files/1_6a42e69a-7033-4419-8dec-741c2f529db3_2000x.jpg?v=1652790117',
        'workshop': [
            'https://www.studionatural.lv/cdn/shop/files/2_b146d559-ba9c-4bb9-a1bf-30c3a067846b_2000x.jpg?v=1652790116',
            'https://www.studionatural.lv/cdn/shop/files/blavaka_c5b22617-f092-4da1-a4be-5ad7301637f5_2000x.jpg?v=1652790117',
        ],
    },
    'raibi-koki': {
        'portrait': 'https://z-p3-scontent.frix8-1.fna.fbcdn.net/v/t39.30808-1/308497356_417853597130534_2144390544630018623_n.png?stp=dst-png&_nc_sid=3ab345',
        'workshop': [],
    },
}


def scrape_partner_media(partner_slug: str, artisan: dict, scraped_products: list[dict] | None = None) -> dict:
    """Download maker portraits and workshop imagery from partner sources."""
    _, img_dir = ensure_dirs(partner_slug)
    media_dir = img_dir / 'media'
    media_dir.mkdir(parents=True, exist_ok=True)

    source = PARTNER_MEDIA_SOURCES.get(partner_slug, {})
    portrait = download_named_image(source.get('portrait', ''), media_dir, f'{partner_slug}-portrait{image_ext_from_url(source.get("portrait", ""))}')
    if portrait:
        artisan['portrait'] = portrait

    workshop: list[str] = []
    for idx, url in enumerate(source.get('workshop') or [], start=1):
        if url == source.get('portrait'):
            continue
        local = download_named_image(url, media_dir, f'{partner_slug}-workshop-{idx:02d}{image_ext_from_url(url)}')
        if local and local not in workshop:
            workshop.append(local)

    if partner_slug == 'raibi-koki' and scraped_products:
        lielais = next((p for p in scraped_products if p.get('slug') == 'raibi-koki-lielais-raibis-43x27-cm'), None)
        if lielais:
            gallery = lielais.get('images') or []
            fallback_portrait = gallery[2] if len(gallery) > 2 else gallery[0] if gallery else ''
            if fallback_portrait and (not artisan.get('portrait') or 'lielais-raibis-43x27-cm-01' in artisan.get('portrait', '')):
                artisan['portrait'] = fallback_portrait

        for slug in ['raibi-koki-triskasu-32x23-cm', 'raibi-koki-triskrasu-40x26-cm-02']:
            product = next((p for p in scraped_products if p.get('slug') == slug), None)
            image = product.get('image') if product else ''
            if image and image != artisan.get('portrait') and image not in workshop:
                workshop.append(image)

    if workshop:
        artisan['workshopImages'] = workshop[:3]

    return artisan


def format_eur(raw: str) -> str:
    s = (raw or '').replace(',', '.').strip()
    m = re.search(r'\d+(?:\.\d+)?', s)
    if not m:
        return '€ —'
    return f"€ {float(m.group(0)):.2f}"


def parse_wc_price(prices: dict) -> str:
    if not prices:
        return '€ —'
    raw = prices.get('price')
    if raw is None:
        return '€ —'
    try:
        value = int(raw) / (10 ** int(prices.get('currency_minor_unit') or 2))
        code = prices.get('currency_code') or 'EUR'
        symbol = '€' if code == 'EUR' else code
        return f'{symbol} {value:.2f}'
    except Exception:
        return '€ —'


def partner_artisan(slug: str, name: str, location: str, craft: str, bio: str):
    return {
        'slug': slug,
        'name': name,
        'location': location,
        'craft': craft,
        'craftDe': translate_text(craft, 'de'),
        'bio': bio,
        'bioDe': translate_text(bio, 'de'),
        'portrait': '',
        'workshopImages': [],
        'isPartner': True,
    }


def build_product(base: dict) -> dict:
    name = to_text(base.get('name')).strip() or 'Untitled product'
    desc = to_text(base.get('description')).strip()
    story = to_text(base.get('story') or desc).strip()
    craft = to_text(base.get('craft') or 'Handcrafted product').strip()
    materials = to_text(base.get('materials') or 'Natural materials').strip()
    technique = to_text(base.get('technique') or 'Traditional craftsmanship').strip()

    is_lv = is_probably_latvian(' '.join([name, desc, story, craft, materials, technique]))
    if is_lv:
        name_en = translate_text(name, 'en')
        src = desc or story or name
        desc_en = translate_text(src, 'en')
        story_en = desc_en
        name_de = translate_text(name_en or name, 'de')
        desc_de = translate_text(desc_en or src, 'de')
        story_de = desc_de
    else:
        name_en = name
        desc_en = desc
        story_en = story
        name_de = base.get('nameDe') or name_en
        desc_de = base.get('descriptionDe') or desc_en
        story_de = base.get('storyDe') or story_en

    return {
        'slug': base['slug'],
        'name': name_en,
        'nameDe': name_de,
        'description': desc_en,
        'descriptionDe': desc_de,
        'price': base.get('price') or '€ —',
        'image': base.get('image') or '',
        'images': base.get('images') or ([base.get('image')] if base.get('image') else []),
        'artisanSlug': base['artisanSlug'],
        'artisanName': base['artisanName'],
        'location': base.get('location') or 'Latvia',
        'craft': craft,
        'craftDe': base.get('craftDe') or craft,
        'materials': materials,
        'materialsDe': base.get('materialsDe') or materials,
        'technique': technique,
        'techniqueDe': base.get('techniqueDe') or technique,
        'story': story_en,
        'storyDe': story_de,
        'details': base.get('details') or [],
        'isPartnerProduct': True,
    }


def scrape_shopify(partner_slug: str, base_url: str, artisan_meta: dict):
    p_data, p_imgs = ensure_dirs(partner_slug)
    all_products, seen_signatures, page = [], set(), 1
    while True:
        r = session.get(f"{base_url.rstrip('/')}/products.json?limit=250&page={page}", timeout=40)
        r.raise_for_status()
        items = r.json().get('products', [])
        if not items:
            break
        sig = tuple(i.get('id') for i in items[:10])
        if sig in seen_signatures:
            break
        seen_signatures.add(sig)
        all_products.extend(items)
        page += 1
        if page > 60:
            break

    products = []
    for item in all_products:
        imgs = [download_image(img.get('src', ''), p_imgs) for img in item.get('images', []) if img.get('src')]
        imgs = [i for i in imgs if i]
        base = {
            'slug': f"{partner_slug}-{item.get('handle') or slugify(item.get('title','product'))}",
            'name': item.get('title', 'Untitled'),
            'description': strip_html(item.get('body_html', '')),
            'price': format_eur(str(item.get('variants', [{}])[0].get('price', ''))),
            'image': imgs[0] if imgs else '',
            'images': imgs,
            'artisanSlug': artisan_meta['slug'],
            'artisanName': artisan_meta['name'],
            'location': artisan_meta['location'],
            'craft': item.get('product_type') or 'Lifestyle object',
            'materials': item.get('tags', '') or 'Natural materials',
            'technique': 'Handcrafted',
            'story': strip_html(item.get('body_html', '')),
        }
        products.append(build_product(base))

    (p_data / 'products.json').write_text(json.dumps(products, ensure_ascii=False, indent=2), encoding='utf-8')
    return products


def scrape_woocommerce_store(partner_slug: str, base_url: str, artisan_meta: dict):
    p_data, p_imgs = ensure_dirs(partner_slug)
    products, page, total_pages = [], 1, None
    seen_signatures = set()
    while True:
        r = session.get(f"{base_url.rstrip('/')}/wp-json/wc/store/products?per_page=100&page={page}", timeout=40)
        if r.status_code != 200:
            break
        if total_pages is None:
            try:
                total_pages = int(r.headers.get('X-WP-TotalPages', '0')) or None
            except Exception:
                total_pages = None
        items = r.json()
        if not items:
            break
        sig = tuple(i.get('id') for i in items[:10])
        if sig in seen_signatures:
            break
        seen_signatures.add(sig)

        for item in items:
            imgs = [download_image(img.get('src', ''), p_imgs) for img in item.get('images', []) if img.get('src')]
            imgs = [i for i in imgs if i]
            cats = [c.get('name', '') for c in item.get('categories', []) if c.get('name')]
            base = {
                'slug': f"{partner_slug}-{item.get('slug') or slugify(item.get('name','product'))}",
                'name': item.get('name', 'Untitled'),
                'description': strip_html(item.get('short_description') or item.get('description') or ''),
                'price': parse_wc_price(item.get('prices', {})),
                'image': imgs[0] if imgs else '',
                'images': imgs,
                'artisanSlug': artisan_meta['slug'],
                'artisanName': artisan_meta['name'],
                'location': artisan_meta['location'],
                'craft': ', '.join(cats[:2]) if cats else 'Handcrafted product',
                'materials': 'Natural materials',
                'technique': 'Handcrafted',
                'story': strip_html(item.get('description') or item.get('short_description') or ''),
            }
            products.append(build_product(base))
        page += 1
        if total_pages is not None and page > total_pages:
            break

    (p_data / 'products.json').write_text(json.dumps(products, ensure_ascii=False, indent=2), encoding='utf-8')
    return products


def scrape_cerannic(artisan_meta: dict):
    partner_slug = 'cerannic'
    p_data, p_imgs = ensure_dirs(partner_slug)
    root = 'https://www.cerannic.com'
    home = BeautifulSoup(session.get(f'{root}/veikals/', timeout=30).text, 'html.parser')
    category_links = {urljoin(root, a['href']) for a in home.find_all('a', href=True) if '/veikals/category/' in a['href'] or '/veikals/params/category/' in a['href']}

    product_links = set()
    for link in sorted(category_links):
        try:
            s = BeautifulSoup(session.get(link, timeout=30).text, 'html.parser')
        except Exception:
            continue
        for a in s.find_all('a', href=True):
            if '/veikals/item/' in a['href']:
                product_links.add(urljoin(root, a['href']))

    products = []
    for url in sorted(product_links):
        try:
            s = BeautifulSoup(session.get(url, timeout=30).text, 'html.parser')
        except Exception:
            continue
        title = s.find('h1').get_text(strip=True) if s.find('h1') else (s.title.get_text(strip=True) if s.title else 'cerannic product')
        text = s.get_text(' ', strip=True)
        pm = re.search(r'€\s*\d+[\.,]\d+', text)
        price = pm.group(0).replace('\xa0', ' ') if pm else '€ —'

        desc = ''
        for sel in ['.moze-item-description', '.moze-shop-item-description', '.moze-wysiwyg-content']:
            n = s.select_one(sel)
            if n:
                desc = (desc + ' ' + n.get_text(' ', strip=True)).strip()
        desc = re.sub(r'\s+', ' ', desc).strip() or title

        image_urls = [img['src'] for img in s.find_all('img', src=True) if 'mozfiles.com' in img['src']]
        og = s.find('meta', attrs={'property': 'og:image'})
        if og and og.get('content'):
            image_urls.insert(0, og['content'])
        image_urls = list(dict.fromkeys(image_urls))
        imgs = [download_image(u, p_imgs) for u in image_urls]
        imgs = [i for i in imgs if i]

        base = {
            'slug': f"{partner_slug}-{slugify(title)}",
            'name': title,
            'description': desc,
            'price': price,
            'image': imgs[0] if imgs else '',
            'images': imgs,
            'artisanSlug': artisan_meta['slug'],
            'artisanName': artisan_meta['name'],
            'location': artisan_meta['location'],
            'craft': 'Porcelain ceramics',
            'materials': 'Porcelain',
            'technique': 'Handmade ceramics',
            'story': desc,
        }
        products.append(build_product(base))

    (p_data / 'products.json').write_text(json.dumps(products, ensure_ascii=False, indent=2), encoding='utf-8')
    return products


def scrape_latvijas_mals(artisan_meta: dict):
    partner_slug = 'latvijas-labumu-tirgus-mals'
    p_data, p_imgs = ensure_dirs(partner_slug)
    base = 'https://www.latvijaslabumstirgus.lv'
    root = f'{base}/lv/prechu-katalogs/keramika/mals/'

    product_urls = set()
    for lu in [root] + [f'{root}?page={i}' for i in range(0, 10)]:
        try:
            html = session.get(lu, timeout=40).text
        except Exception:
            continue
        for path in re.findall(r'/lv/prechu-katalogs/keramika/mals/[^"\'\s>]+\.html', html):
            if not path.endswith('/mals/.html'):
                product_urls.add(urljoin(base, path))

    products = []
    for url in sorted(product_urls):
        try:
            s = BeautifulSoup(session.get(url, timeout=30).text, 'html.parser')
        except Exception:
            continue
        title_node = s.find('h1')
        title = title_node.get_text(strip=True) if title_node else ''
        if not title or title.lower() in {'māls', 'mals'}:
            continue

        text = s.get_text(' ', strip=True)
        pm = re.search(r'(\d+[\.,]\d+)\s*€', text)
        price = f"€ {pm.group(1).replace(',', '.')}" if pm else '€ —'
        desc = next((p.get_text(' ', strip=True) for p in s.select('main p, .product-description p, .description p') if p.get_text(' ', strip=True) and len(p.get_text(' ', strip=True)) > 40), title)

        seller = ''
        for sel in ['.merchant', '.trader-name', '.product-author']:
            n = s.select_one(sel)
            if n:
                seller = n.get_text(' ', strip=True)

        image_urls = [urljoin(base, img['src']) for img in s.find_all('img', src=True) if '/pictures/' in img['src']]
        image_urls = list(dict.fromkeys(image_urls))
        imgs = [download_image(u, p_imgs) for u in image_urls[:6]]
        imgs = [i for i in imgs if i]

        base_p = {
            'slug': f"{partner_slug}-{slugify(title)}",
            'name': title,
            'description': desc,
            'price': price,
            'image': imgs[0] if imgs else '',
            'images': imgs,
            'artisanSlug': artisan_meta['slug'],
            'artisanName': seller or artisan_meta['name'],
            'location': artisan_meta['location'],
            'craft': 'Clay ceramics',
            'materials': 'Clay',
            'technique': 'Handmade pottery',
            'story': desc,
        }
        products.append(build_product(base_p))

    (p_data / 'products.json').write_text(json.dumps(products, ensure_ascii=False, indent=2), encoding='utf-8')
    return products


def scrape_raibi_local(artisan_meta: dict):
    partner_slug = 'raibi-koki'
    p_data, p_imgs = ensure_dirs(partner_slug)

    if p_imgs.exists():
        for existing in p_imgs.iterdir():
            if existing.is_file():
                existing.unlink()

    known_prices = {
        'liels-un-krasains-gala-skiedru-virtuves-delis-lielais-raibais-43x27-cm': '€ 162.00',
        'galda-spele-marble-solitaire': '€ 48.00',
        'mazais-triskasu-virtuves-gala-skiedru-delitis-32x23-cm': '€ 60.00',
        'liels-triskrasu-vienpuseji-lietojams-virtuves-delis-40x26cm': '€ 126.00',
        'triskrasu-divpusejs-gala-skiedru-delis-40x26cm': '€ 126.00',
    }

    product_map = [
        {
            'folder': 'Board Lielais raibis 43x27 cm',
            'slug': f'{partner_slug}-lielais-raibis-43x27-cm',
            'name': 'Lielais raibis 43x27 cm',
            'price_slug': 'liels-un-krasains-gala-skiedru-virtuves-delis-lielais-raibais-43x27-cm',
            'hero_file': 'Screenshot 2026-07-08 at 11.12.56.png',
        },
        {
            'folder': 'Board Triskasu 32x23 cm',
            'slug': f'{partner_slug}-triskasu-32x23-cm',
            'name': 'Triskasu 32x23 cm',
            'price_slug': 'mazais-triskasu-virtuves-gala-skiedru-delitis-32x23-cm',
            'hero_file': 'Screenshot 2026-07-08 at 11.15.44.png',
        },
        {
            'folder': 'Board Triskrasu 40x26 cm',
            'slug': f'{partner_slug}-triskrasu-40x26-cm',
            'name': 'Triskrasu 40x26 cm',
            'price_slug': 'liels-triskrasu-vienpuseji-lietojams-virtuves-delis-40x26cm',
            'hero_file': 'Screenshot 2026-07-08 at 11.17.39.png',
        },
        {
            'folder': 'Board Triskrasu 40x26 cm 02',
            'slug': f'{partner_slug}-triskrasu-40x26-cm-02',
            'name': 'Triskrasu 40x26 cm 02',
            'price_slug': 'triskrasu-divpusejs-gala-skiedru-delis-40x26cm',
            'hero_file': 'Screenshot 2026-07-08 at 11.18.40.png',
        },
        {
            'folder': 'Marble Solitair',
            'slug': f'{partner_slug}-galda-sp-le-marble-solitaire',
            'name': 'Board game Marble solitaire',
            'price_slug': 'galda-spele-marble-solitaire',
            'hero_file': 'Screenshot 2026-07-08 at 11.14.40.png',
        },
    ]

    products = []
    if not RAIBI_LOCAL_DIR.exists():
        (p_data / 'products.json').write_text('[]', encoding='utf-8')
        return products

    for item in product_map:
        folder = RAIBI_LOCAL_DIR / item['folder']
        if not folder.is_dir():
            continue

        files = sorted(
            [f for f in folder.iterdir() if f.suffix.lower() in {'.jpg', '.jpeg', '.png', '.webp'}],
            key=lambda f: f.name,
        )
        if not files:
            continue

        hero_file = item['hero_file']
        hero = next((f for f in files if f.name == hero_file), files[0])
        ordered_files = [hero] + [f for f in files if f.name != hero.name]

        imgs = []
        for idx, source in enumerate(ordered_files, start=1):
            dest_name = f"{item['slug']}-{idx:02d}{source.suffix.lower()}"
            dest = p_imgs / dest_name
            shutil.copy2(source, dest)
            imgs.append('/' + str(dest.relative_to(ROOT / 'public')).replace('\\', '/'))

        base = {
            'slug': item['slug'],
            'name': item['name'],
            'description': item['name'],
            'price': known_prices.get(item['price_slug'], '€ —'),
            'image': imgs[0],
            'images': imgs,
            'artisanSlug': artisan_meta['slug'],
            'artisanName': artisan_meta['name'],
            'location': artisan_meta['location'],
            'craft': 'Woodcraft',
            'materials': 'Wood',
            'technique': 'End-grain woodworking',
            'story': item['name'],
        }
        products.append(build_product(base))

    (p_data / 'products.json').write_text(json.dumps(products, ensure_ascii=False, indent=2), encoding='utf-8')
    return products


def german_quality_pass(text: str) -> str:
    if not text:
        return text
    replacements = {
        'Handcrafted product': 'Handgefertigtes Produkt',
        'Natural materials': 'Natürliche Materialien',
        'Traditional craftsmanship': 'Traditionelle Handwerkskunst',
        'Handmade ceramics': 'Handgemachte Keramik',
        'Lifestyle object': 'Lifestyle-Objekt',
        'Handcrafted': 'Handgefertigt',
    }
    out = text
    for src, dst in replacements.items():
        out = out.replace(src, dst)
    out = re.sub(r'\s+', ' ', out).strip()
    return out


def merge_details(a: list, b: list) -> list:
    seen = set()
    out = []
    for detail in (a or []) + (b or []):
        label = (detail.get('label') or '').strip().lower()
        val = (detail.get('value') or '').strip().lower()
        key = (label, val)
        if key in seen or (not label and not val):
            continue
        seen.add(key)
        out.append(detail)
    return out


def pick_richer(a: str, b: str) -> str:
    a, b = (a or '').strip(), (b or '').strip()
    return a if len(a) >= len(b) else b


def normalize_name_key(name: str) -> str:
    base = unicodedata.normalize('NFKD', (name or '').lower())
    base = ''.join(ch for ch in base if not unicodedata.combining(ch))
    base = re.sub(r'[^a-z0-9]+', ' ', base)
    return re.sub(r'\s+', ' ', base).strip()


def price_key(price: str) -> str:
    m = re.search(r'\d+(?:[\.,]\d+)?', price or '')
    return m.group(0).replace(',', '.') if m else ''


def dedupe_and_merge_products(products: list[dict]) -> list[dict]:
    grouped: dict[tuple, dict] = {}
    for p in products:
        first_img = Path((p.get('image') or '').split('?')[0]).name
        key = (p.get('artisanSlug'), normalize_name_key(p.get('name')), price_key(p.get('price')), first_img)
        if key not in grouped:
            grouped[key] = p
            continue
        cur = grouped[key]
        cur['description'] = pick_richer(cur.get('description', ''), p.get('description', ''))
        cur['descriptionDe'] = pick_richer(cur.get('descriptionDe', ''), p.get('descriptionDe', ''))
        cur['story'] = pick_richer(cur.get('story', ''), p.get('story', ''))
        cur['storyDe'] = pick_richer(cur.get('storyDe', ''), p.get('storyDe', ''))
        cur['materials'] = pick_richer(cur.get('materials', ''), p.get('materials', ''))
        cur['technique'] = pick_richer(cur.get('technique', ''), p.get('technique', ''))
        cur['details'] = merge_details(cur.get('details') or [], p.get('details') or [])
        imgs = []
        for x in (cur.get('images') or []) + (p.get('images') or []):
            if x and x not in imgs:
                imgs.append(x)
        cur['images'] = imgs
        if not cur.get('image') and imgs:
            cur['image'] = imgs[0]

    out = list(grouped.values())
    out.sort(key=lambda p: (p.get('artisanSlug', ''), p.get('name', '')))
    return out


def enforce_unique_slugs(products: list[dict]) -> None:
    seen: dict[str, int] = {}
    for p in products:
        base = (p.get('slug') or slugify(p.get('name') or 'product')).strip()
        n = seen.get(base, 0)
        if n == 0:
            p['slug'] = base
        else:
            p['slug'] = f"{base}-{n+1}"
        seen[base] = n + 1


def quality_pass_products(products: list[dict]):
    for p in products:
        if not p.get('name'):
            p['name'] = 'Handcrafted object'
        if not p.get('nameDe'):
            p['nameDe'] = german_quality_pass(p.get('name', ''))
        if not p.get('description'):
            p['description'] = p.get('story') or 'Handcrafted product from Baltic artisans.'
        if not p.get('descriptionDe'):
            p['descriptionDe'] = german_quality_pass(p.get('description', ''))
        if not p.get('story'):
            p['story'] = p.get('description', '')
        if not p.get('storyDe'):
            p['storyDe'] = german_quality_pass(p.get('story', ''))

        p['craft'] = p.get('craft') or 'Handcrafted product'
        p['materials'] = p.get('materials') or 'Natural materials'
        p['technique'] = p.get('technique') or 'Traditional craftsmanship'

        p['craftDe'] = german_quality_pass(p.get('craftDe') or p['craft'])
        p['materialsDe'] = german_quality_pass(p.get('materialsDe') or p['materials'])
        p['techniqueDe'] = german_quality_pass(p.get('techniqueDe') or p['technique'])

        if not p.get('price'):
            p['price'] = '€ —'
        if not p.get('image') and p.get('images'):
            p['image'] = p['images'][0]
        if not p.get('images') and p.get('image'):
            p['images'] = [p['image']]
        p['details'] = p.get('details') or []


def write_partner_meta(partner_slug: str, artisan: dict):
    p_data, _ = ensure_dirs(partner_slug)
    (p_data / 'artisan.json').write_text(json.dumps(artisan, ensure_ascii=False, indent=2), encoding='utf-8')


def load_all_partner_products() -> list[dict]:
    all_products: list[dict] = []
    for partner in PARTNER_ORDER:
        f = DATA_DIR / partner / 'products.json'
        if f.exists():
            all_products.extend(json.loads(f.read_text(encoding='utf-8')))
    return all_products


def load_all_partner_artisans(defaults: dict[str, dict]) -> list[dict]:
    artisans = []
    for partner in PARTNER_ORDER:
        f = DATA_DIR / partner / 'artisan.json'
        if f.exists():
            artisans.append(json.loads(f.read_text(encoding='utf-8')))
        elif partner in defaults:
            artisans.append(defaults[partner])
    return artisans


def generate_catalog_ts(artisans: list[dict], products: list[dict]):
    lines = [
        'export type Artisan = {',
        '  slug: string;',
        '  name: string;',
        '  location: string;',
        '  craft: string;',
        '  craftDe: string;',
        '  bio: string;',
        '  bioDe: string;',
        '  portrait: string;',
        '  workshopImages: string[];',
        '  isPartner: boolean;',
        '};',
        '',
        'export type ProductDetail = {',
        '  label: string;',
        '  labelDe: string;',
        '  value: string;',
        '  valueDe: string;',
        '};',
        '',
        'export type CatalogProduct = {',
        '  slug: string;',
        '  name: string;',
        '  nameDe: string;',
        '  description: string;',
        '  descriptionDe: string;',
        '  price: string;',
        '  image: string;',
        '  images: string[];',
        '  artisanSlug: string;',
        '  artisanName: string;',
        '  location: string;',
        '  craft: string;',
        '  craftDe: string;',
        '  materials: string;',
        '  materialsDe: string;',
        '  technique: string;',
        '  techniqueDe: string;',
        '  story: string;',
        '  storyDe: string;',
        '  details: ProductDetail[];',
        '  isPartnerProduct: boolean;',
        '};',
        '',
        'export const artisans = ' + json.dumps(artisans, ensure_ascii=False, indent=2) + ' satisfies Artisan[];',
        '',
        'export const products = ' + json.dumps(products, ensure_ascii=False, indent=2) + ' satisfies CatalogProduct[];',
        '',
        'export const artisanBySlug = Object.fromEntries(artisans.map((artisan) => [artisan.slug, artisan])) as Record<string, Artisan>;',
        'export const productBySlug = Object.fromEntries(products.map((product) => [product.slug, product])) as Record<string, CatalogProduct>;',
        '',
        'export function getProductsByArtisan(artisanSlug: string) {',
        '  return products.filter((product) => product.artisanSlug === artisanSlug);',
        '}',
    ]
    CATALOG_TS.write_text('\n'.join(lines) + '\n', encoding='utf-8')


def default_artisans() -> dict[str, dict]:
    return {
        'vaidava-ceramics': partner_artisan('vaidava-ceramics', 'VAIDAVA CERAMICS', 'Vaidava, Latvia', 'Handcrafted Latvian ceramics', 'Vaidava Ceramics creates artisanal terracotta-inspired tableware with Nordic minimalism and Baltic heritage.'),
        'cepli': partner_artisan('cepli', 'Cepļi', 'Vidzemes jūrmalas piekraste, Latvia', 'Black ceramics and tableware', 'Cepļi is a Latvian black-ceramics workshop active since 1985, producing tableware and traditional clay objects.'),
        'cerannic': partner_artisan('cerannic', 'cerannic', 'Latvia', 'Handmade ceramics', 'cerannic creates handcrafted ceramics and giftable objects in limited runs.'),
        'latvijas-labumu-tirgus-mals': partner_artisan('latvijas-labumu-tirgus-mals', 'Latvijas Labumu Tirgus: Māls', 'Latvia', 'Clay and ceramics marketplace', 'The clay section of Latvijas Labumu Tirgus features many independent ceramic makers from across Latvia.'),
        'raibi-koki': partner_artisan('raibi-koki', 'Raibi Koki', 'Ķekava, Latvia', 'Woodcraft objects and cutting boards', 'Raibi Koki crafts colorful end-grain cutting boards and small wooden lifestyle objects.'),
        'studio-natural': partner_artisan('studio-natural', 'Studio Natural', 'Riga, Latvia', 'Handwoven linen textiles', 'Studio Natural produces handwoven linen home and apparel products made in Latvia.'),
    }


def scrape_partner(partner: str, artisans_map: dict[str, dict]):
    if partner == 'vaidava-ceramics':
        return scrape_shopify(partner, 'https://vaidava.com', artisans_map[partner])
    if partner == 'cepli':
        return scrape_woocommerce_store(partner, 'https://www.cepli.lv', artisans_map[partner])
    if partner == 'cerannic':
        return scrape_cerannic(artisans_map[partner])
    if partner == 'latvijas-labumu-tirgus-mals':
        return scrape_latvijas_mals(artisans_map[partner])
    if partner == 'raibi-koki':
        return scrape_raibi_local(artisans_map[partner])
    if partner == 'studio-natural':
        return scrape_shopify(partner, 'https://www.studionatural.lv', artisans_map[partner])
    raise ValueError(f'Unknown partner: {partner}')


def main():
    parser = argparse.ArgumentParser(description='Scrape partner catalogs and regenerate site catalog.')
    parser.add_argument('--partners', nargs='+', choices=PARTNER_ORDER, help='Only update selected partners.')
    parser.add_argument('--incremental', action='store_true', help='Keep existing partner data and only update selected ones.')
    parser.add_argument('--media-only', action='store_true', help='Only refresh artisan portrait/workshop media from partner websites.')
    args = parser.parse_args()

    targets = args.partners or PARTNER_ORDER
    artisans_map = default_artisans()

    if args.media_only:
        for partner in targets:
            print(f'Updating media for {partner}...')
            products_path = DATA_DIR / partner / 'products.json'
            scraped = json.loads(products_path.read_text(encoding='utf-8')) if products_path.exists() else []
            artisan = artisans_map[partner]
            meta_path = DATA_DIR / partner / 'artisan.json'
            if meta_path.exists():
                artisan = {**artisan, **json.loads(meta_path.read_text(encoding='utf-8'))}
            artisan = scrape_partner_media(partner, artisan, scraped)
            write_partner_meta(partner, artisan)

        all_artisans = load_all_partner_artisans(artisans_map)
        for a in all_artisans:
            meta_path = DATA_DIR / a['slug'] / 'artisan.json'
            if meta_path.exists():
                saved = json.loads(meta_path.read_text(encoding='utf-8'))
                a['portrait'] = saved.get('portrait') or a.get('portrait')
                a['workshopImages'] = saved.get('workshopImages') or a.get('workshopImages') or []
        (DATA_DIR / 'all-artisans.json').write_text(json.dumps(all_artisans, ensure_ascii=False, indent=2), encoding='utf-8')
        all_products = load_all_partner_products()
        generate_catalog_ts(all_artisans, all_products)
        print('Refreshed artisan media.')
        return

    if not args.incremental:
        for partner in targets:
            shutil.rmtree(DATA_DIR / partner, ignore_errors=True)
            shutil.rmtree(PUBLIC_PARTNERS_DIR / partner, ignore_errors=True)

    for partner in targets:
        print(f'Updating {partner}...')
        scraped = scrape_partner(partner, artisans_map)
        artisan = artisans_map[partner]
        artisan = scrape_partner_media(partner, artisan, scraped or [])
        write_partner_meta(partner, artisan)

    all_products = load_all_partner_products()
    all_products = dedupe_and_merge_products(all_products)
    enforce_unique_slugs(all_products)
    quality_pass_products(all_products)

    all_artisans = load_all_partner_artisans(artisans_map)
    for a in all_artisans:
        meta_path = DATA_DIR / a['slug'] / 'artisan.json'
        if meta_path.exists():
            saved = json.loads(meta_path.read_text(encoding='utf-8'))
            if saved.get('portrait'):
                a['portrait'] = saved['portrait']
            if saved.get('workshopImages'):
                a['workshopImages'] = saved['workshopImages']
        if not a.get('portrait'):
            sample = next((p for p in all_products if p.get('artisanSlug') == a.get('slug') and p.get('image')), None)
            if sample:
                a['portrait'] = sample['image']
        a['craftDe'] = german_quality_pass(a.get('craftDe') or a.get('craft') or '')
        a['bioDe'] = german_quality_pass(a.get('bioDe') or a.get('bio') or '')
        a['workshopImages'] = a.get('workshopImages') or []

    (DATA_DIR / 'all-products.json').write_text(json.dumps(all_products, ensure_ascii=False, indent=2), encoding='utf-8')
    (DATA_DIR / 'all-artisans.json').write_text(json.dumps(all_artisans, ensure_ascii=False, indent=2), encoding='utf-8')
    generate_catalog_ts(all_artisans, all_products)

    print(f'Generated {len(all_products)} deduped products across {len(all_artisans)} partners.')


if __name__ == '__main__':
    main()
