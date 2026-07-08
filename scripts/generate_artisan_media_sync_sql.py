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
    artisans = json.loads((DATA_DIR / 'all-artisans.json').read_text(encoding='utf-8'))

    lines = [
        '-- Sync artisan portrait and workshop media',
        'begin;',
        '',
    ]

    for artisan in artisans:
        slug = artisan['slug']
        lines.append(
            f"update public.partners set portrait_url = {q(artisan.get('portrait'))}, workshop_images = {qjson(artisan.get('workshopImages') or [])} where slug = {q(slug)};"
        )
        lines.append(
            f"update public.artisans set portrait_url = {q(artisan.get('portrait'))}, workshop_images = {qjson(artisan.get('workshopImages') or [])} where slug = {q(slug)};"
        )

    lines.append('')
    lines.append('commit;')

    migration_path = MIGRATIONS_DIR / '20260708154500_sync_artisan_portrait_media.sql'
    migration_path.write_text('\n'.join(lines) + '\n', encoding='utf-8')
    print(f'Wrote {migration_path}')


if __name__ == '__main__':
    main()
