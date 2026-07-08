#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path('/Users/sascha/Latvian Products Shop/Website')
DATA_DIR = ROOT / 'data' / 'partners'
MIGRATIONS_DIR = ROOT / 'supabase' / 'migrations'

artisans = json.loads((DATA_DIR / 'all-artisans.json').read_text(encoding='utf-8'))
products = json.loads((DATA_DIR / 'all-products.json').read_text(encoding='utf-8'))


def q(value):
    if value is None:
        return 'NULL'
    s = str(value).replace("'", "''")
    return f"'{s}'"


def qjson(value):
    return q(json.dumps(value, ensure_ascii=False)) + '::jsonb'


def parse_price(price: str):
    if not price:
        return 'NULL', "'EUR'"
    clean = price.replace('€', '').replace(',', '.').strip()
    try:
        val = float(clean)
        return f"{val:.2f}", "'EUR'"
    except Exception:
        return 'NULL', "'EUR'"

partners_by_slug = {}
for a in artisans:
    partners_by_slug[a['slug']] = {
        'slug': a['slug'],
        'name': a['name'],
        'website_url': None,
        'location': a.get('location'),
        'craft': a.get('craft'),
        'craft_de': a.get('craftDe'),
        'bio': a.get('bio'),
        'bio_de': a.get('bioDe'),
        'portrait_url': a.get('portrait'),
        'workshop_images': a.get('workshopImages') or [],
    }

lines = []
lines.append('-- Seed scraped catalog data into source-of-truth tables')
lines.append('begin;')
lines.append('')
lines.append('-- full refresh for catalog entities')
lines.append('delete from public.product_images;')
lines.append('delete from public.product_translations;')
lines.append('delete from public.products;')
lines.append('delete from public.artisans;')
lines.append('delete from public.partners;')
lines.append('')

for p in partners_by_slug.values():
    lines.append(
        'insert into public.partners (slug, name, website_url, location, craft, craft_de, bio, bio_de, portrait_url, workshop_images) '
        f"values ({q(p['slug'])}, {q(p['name'])}, {q(p['website_url'])}, {q(p['location'])}, {q(p['craft'])}, {q(p['craft_de'])}, {q(p['bio'])}, {q(p['bio_de'])}, {q(p['portrait_url'])}, {qjson(p['workshop_images'])});"
    )

lines.append('')

for a in artisans:
    lines.append(
        'insert into public.artisans (partner_id, slug, name, location, craft, craft_de, bio, bio_de, portrait_url, workshop_images, is_partner) '
        'select p.id, '
        f"{q(a['slug'])}, {q(a['name'])}, {q(a.get('location'))}, {q(a.get('craft'))}, {q(a.get('craftDe'))}, {q(a.get('bio'))}, {q(a.get('bioDe'))}, {q(a.get('portrait'))}, {qjson(a.get('workshopImages') or [])}, true "
        f"from public.partners p where p.slug = {q(a['slug'])};"
    )

lines.append('')

for p in products:
    price_amount, currency = parse_price(p.get('price', ''))
    lines.append(
        'insert into public.products '
        '(partner_id, artisan_id, slug, partner_product_ref, artisan_name, location, price_amount, currency_code, is_partner_product, image_url, details, metadata) '
        'select '
        f"pr.id, ar.id, {q(p['slug'])}, {q(p['slug'])}, {q(p.get('artisanName'))}, {q(p.get('location'))}, {price_amount}, {currency}, true, {q(p.get('image'))}, {qjson(p.get('details') or [])}, {qjson({'source': 'scraper'})} "
        'from public.partners pr '
        'left join public.artisans ar on ar.slug = '
        f"{q(p.get('artisanSlug'))} "
        f"where pr.slug = {q(p.get('artisanSlug'))};"
    )

lines.append('')

for p in products:
    lines.append(
        'insert into public.product_translations (product_id, locale, name, description, story, craft, materials, technique) '
        'select pr.id, '
        f"'en', {q(p.get('name'))}, {q(p.get('description'))}, {q(p.get('story'))}, {q(p.get('craft'))}, {q(p.get('materials'))}, {q(p.get('technique'))} "
        'from public.products pr '
        f"where pr.slug = {q(p['slug'])};"
    )
    lines.append(
        'insert into public.product_translations (product_id, locale, name, description, story, craft, materials, technique) '
        'select pr.id, '
        f"'de', {q(p.get('nameDe'))}, {q(p.get('descriptionDe'))}, {q(p.get('storyDe'))}, {q(p.get('craftDe'))}, {q(p.get('materialsDe'))}, {q(p.get('techniqueDe'))} "
        'from public.products pr '
        f"where pr.slug = {q(p['slug'])};"
    )

lines.append('')

for p in products:
    for idx, image_url in enumerate(p.get('images') or []):
        lines.append(
            'insert into public.product_images (product_id, image_url, position) '
            'select pr.id, '
            f"{q(image_url)}, {idx} from public.products pr where pr.slug = {q(p['slug'])};"
        )

lines.append('')
lines.append('commit;')

migration_name = '20260708130600_seed_catalog_data.sql'
out = MIGRATIONS_DIR / migration_name
out.write_text('\n'.join(lines) + '\n', encoding='utf-8')
print(f'wrote {out} with {len(products)} products and {len(artisans)} artisans')
