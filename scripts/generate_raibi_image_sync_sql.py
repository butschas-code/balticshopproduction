#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path('/Users/sascha/Latvian Products Shop/Website')
DATA_DIR = ROOT / 'data' / 'partners'
MIGRATIONS_DIR = ROOT / 'supabase' / 'migrations'


def q(value):
    if value is None:
        return 'NULL'
    return "'" + str(value).replace("'", "''") + "'"


def qjson(value):
    return q(json.dumps(value, ensure_ascii=False)) + '::jsonb'


def main():
    artisan = json.loads((DATA_DIR / 'raibi-koki' / 'artisan.json').read_text(encoding='utf-8'))
    products = json.loads((DATA_DIR / 'raibi-koki' / 'products.json').read_text(encoding='utf-8'))

    lines = [
        '-- Sync Raibi Koki local product images',
        'begin;',
        '',
        f"update public.partners set portrait_url = {q(artisan['portrait'])}, workshop_images = {qjson(artisan.get('workshopImages') or [])} where slug = 'raibi-koki';",
        f"update public.artisans set portrait_url = {q(artisan['portrait'])}, workshop_images = {qjson(artisan.get('workshopImages') or [])} where slug = 'raibi-koki';",
        '',
    ]

    for product in products:
        slug = product['slug']
        price = product.get('price', '')
        price_sql = 'NULL'
        if price and '€' in price:
            try:
                price_sql = f"{float(price.replace('€', '').replace(',', '.').strip()):.2f}"
            except ValueError:
                price_sql = 'NULL'

        lines.append(
            f"update public.products set image_url = {q(product['image'])}, price_amount = {price_sql} where slug = {q(slug)};"
        )
        lines.append(
            'delete from public.product_images where product_id in (select id from public.products where slug = '
            f"{q(slug)});"
        )
        for position, image_url in enumerate(product.get('images') or []):
            lines.append(
                'insert into public.product_images (product_id, image_url, position) '
                f"select pr.id, {q(image_url)}, {position} from public.products pr where pr.slug = {q(slug)};"
            )
        lines.append('')

    lines.append('commit;')

    migration_path = MIGRATIONS_DIR / '20260708152000_sync_raibi_koki_images.sql'
    migration_path.write_text('\n'.join(lines) + '\n', encoding='utf-8')
    print(f'Wrote {migration_path}')


if __name__ == '__main__':
    main()
