-- Customer order flow tables + profile enhancement

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  order_number text not null unique,
  status text not null check (status in ('pending','processing','paid','packed','shipped','delivered','cancelled','refunded')),
  currency_code text not null default 'EUR',
  subtotal_amount numeric(12,2) not null default 0,
  shipping_amount numeric(12,2) not null default 0,
  tax_amount numeric(12,2) not null default 0,
  total_amount numeric(12,2) not null default 0,
  notes text,
  shipping_address jsonb not null default '{}'::jsonb,
  billing_address jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_profile_id_idx on public.orders(profile_id);
create index if not exists orders_status_idx on public.orders(status);
create index if not exists orders_created_at_idx on public.orders(created_at desc);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_slug text,
  product_name text not null,
  quantity int not null check (quantity > 0),
  unit_price numeric(12,2) not null,
  line_total numeric(12,2) not null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists order_items_order_id_idx on public.order_items(order_id);

-- make profile trigger include full_name if provided in signup metadata
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', null))
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(excluded.full_name, public.profiles.full_name);
  return new;
end;
$$;

-- updated_at trigger for orders
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'orders_set_updated_at') THEN
    CREATE TRIGGER orders_set_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- RLS
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- user can only access own orders
DROP POLICY IF EXISTS "users can read own orders" ON public.orders;
CREATE POLICY "users can read own orders" ON public.orders
FOR SELECT USING (auth.uid() = profile_id);

DROP POLICY IF EXISTS "users can create own orders" ON public.orders;
CREATE POLICY "users can create own orders" ON public.orders
FOR INSERT WITH CHECK (auth.uid() = profile_id);

DROP POLICY IF EXISTS "users can update own orders" ON public.orders;
CREATE POLICY "users can update own orders" ON public.orders
FOR UPDATE USING (auth.uid() = profile_id) WITH CHECK (auth.uid() = profile_id);

-- item access through parent order ownership
DROP POLICY IF EXISTS "users can read own order items" ON public.order_items;
CREATE POLICY "users can read own order items" ON public.order_items
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_items.order_id
      AND o.profile_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "users can manage own order items" ON public.order_items;
CREATE POLICY "users can manage own order items" ON public.order_items
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_items.order_id
      AND o.profile_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_items.order_id
      AND o.profile_id = auth.uid()
  )
);
