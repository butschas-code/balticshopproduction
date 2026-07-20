begin;

create table if not exists public.product_monitor_runs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  checked_count integer not null default 0,
  missing_source_count integer not null default 0,
  unavailable_count integer not null default 0,
  out_of_stock_count integer not null default 0,
  status_change_count integer not null default 0,
  new_product_count integer not null default 0,
  error_count integer not null default 0,
  report jsonb not null default '{}'::jsonb
);

create table if not exists public.product_monitor_discoveries (
  id uuid primary key default gen_random_uuid(),
  partner_slug text not null,
  partner_name text not null,
  source_url text not null unique,
  title text,
  price_text text,
  image_url text,
  status text not null default 'new',
  raw jsonb not null default '{}'::jsonb,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create index if not exists product_monitor_discoveries_partner_idx on public.product_monitor_discoveries(partner_slug);
create index if not exists product_monitor_discoveries_status_idx on public.product_monitor_discoveries(status);

commit;
