-- Source-of-truth schema for Baltic Products Shop
create extension if not exists pgcrypto;

-- Partners
create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  website_url text,
  location text,
  craft text,
  craft_de text,
  bio text,
  bio_de text,
  portrait_url text,
  workshop_images jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Artisans
create table if not exists public.artisans (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.partners(id) on delete cascade,
  slug text not null unique,
  name text not null,
  location text,
  craft text,
  craft_de text,
  bio text,
  bio_de text,
  portrait_url text,
  workshop_images jsonb not null default '[]'::jsonb,
  is_partner boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists artisans_partner_id_idx on public.artisans(partner_id);

-- Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.partners(id) on delete cascade,
  artisan_id uuid references public.artisans(id) on delete set null,
  slug text not null unique,
  partner_product_ref text,
  artisan_name text,
  location text,
  price_amount numeric(12,2),
  currency_code text not null default 'EUR',
  is_partner_product boolean not null default true,
  image_url text,
  details jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_partner_id_idx on public.products(partner_id);
create index if not exists products_artisan_id_idx on public.products(artisan_id);

-- Translations by locale (en/de now, extensible)
create table if not exists public.product_translations (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  locale text not null check (locale in ('en','de')),
  name text not null,
  description text,
  story text,
  craft text,
  materials text,
  technique text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(product_id, locale)
);

create index if not exists product_translations_product_id_idx on public.product_translations(product_id);

-- Product images
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  position int not null default 0,
  created_at timestamptz not null default now(),
  unique(product_id, image_url)
);

create index if not exists product_images_product_id_idx on public.product_images(product_id);

-- Customer profile data
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  locale text default 'en' check (locale in ('en','de')),
  marketing_opt_in boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customer_addresses (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  label text,
  first_name text,
  last_name text,
  company text,
  line1 text,
  line2 text,
  city text,
  postal_code text,
  country_code text,
  is_default_shipping boolean not null default false,
  is_default_billing boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists customer_addresses_profile_id_idx on public.customer_addresses(profile_id);

-- Generic updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Trigger: create profile for newly registered users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at triggers
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'partners_set_updated_at') THEN
    CREATE TRIGGER partners_set_updated_at BEFORE UPDATE ON public.partners FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'artisans_set_updated_at') THEN
    CREATE TRIGGER artisans_set_updated_at BEFORE UPDATE ON public.artisans FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'products_set_updated_at') THEN
    CREATE TRIGGER products_set_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'product_translations_set_updated_at') THEN
    CREATE TRIGGER product_translations_set_updated_at BEFORE UPDATE ON public.product_translations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'profiles_set_updated_at') THEN
    CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'customer_addresses_set_updated_at') THEN
    CREATE TRIGGER customer_addresses_set_updated_at BEFORE UPDATE ON public.customer_addresses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- RLS
alter table public.partners enable row level security;
alter table public.artisans enable row level security;
alter table public.products enable row level security;
alter table public.product_translations enable row level security;
alter table public.product_images enable row level security;
alter table public.profiles enable row level security;
alter table public.customer_addresses enable row level security;

-- Public read-only catalog access
drop policy if exists "public can read partners" on public.partners;
create policy "public can read partners" on public.partners
for select using (true);

drop policy if exists "public can read artisans" on public.artisans;
create policy "public can read artisans" on public.artisans
for select using (true);

drop policy if exists "public can read products" on public.products;
create policy "public can read products" on public.products
for select using (true);

drop policy if exists "public can read product translations" on public.product_translations;
create policy "public can read product translations" on public.product_translations
for select using (true);

drop policy if exists "public can read product images" on public.product_images;
create policy "public can read product images" on public.product_images
for select using (true);

-- Customer data ownership
drop policy if exists "users can read own profile" on public.profiles;
create policy "users can read own profile" on public.profiles
for select using (auth.uid() = id);

drop policy if exists "users can update own profile" on public.profiles;
create policy "users can update own profile" on public.profiles
for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "users can insert own profile" on public.profiles;
create policy "users can insert own profile" on public.profiles
for insert with check (auth.uid() = id);

drop policy if exists "users can read own addresses" on public.customer_addresses;
create policy "users can read own addresses" on public.customer_addresses
for select using (auth.uid() = profile_id);

drop policy if exists "users can insert own addresses" on public.customer_addresses;
create policy "users can insert own addresses" on public.customer_addresses
for insert with check (auth.uid() = profile_id);

drop policy if exists "users can update own addresses" on public.customer_addresses;
create policy "users can update own addresses" on public.customer_addresses
for update using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

drop policy if exists "users can delete own addresses" on public.customer_addresses;
create policy "users can delete own addresses" on public.customer_addresses
for delete using (auth.uid() = profile_id);
