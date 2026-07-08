-- Cart model + checkout persistence

create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'active' check (status in ('active','checked_out','abandoned')),
  currency_code text not null default 'EUR',
  checked_out_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists carts_one_active_per_user_idx
on public.carts (profile_id)
where status = 'active';

create index if not exists carts_profile_id_idx on public.carts(profile_id);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_slug text,
  product_name text not null,
  product_image_url text,
  quantity int not null default 1 check (quantity > 0),
  unit_price numeric(12,2) not null,
  currency_code text not null default 'EUR',
  line_total numeric(12,2) generated always as (quantity * unit_price) stored,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(cart_id, product_id)
);

create index if not exists cart_items_cart_id_idx on public.cart_items(cart_id);

alter table public.carts enable row level security;
alter table public.cart_items enable row level security;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'carts_set_updated_at') THEN
    CREATE TRIGGER carts_set_updated_at BEFORE UPDATE ON public.carts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'cart_items_set_updated_at') THEN
    CREATE TRIGGER cart_items_set_updated_at BEFORE UPDATE ON public.cart_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

drop policy if exists "users can read own carts" on public.carts;
create policy "users can read own carts" on public.carts
for select using (auth.uid() = profile_id);

drop policy if exists "users can insert own carts" on public.carts;
create policy "users can insert own carts" on public.carts
for insert with check (auth.uid() = profile_id);

drop policy if exists "users can update own carts" on public.carts;
create policy "users can update own carts" on public.carts
for update using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

drop policy if exists "users can delete own carts" on public.carts;
create policy "users can delete own carts" on public.carts
for delete using (auth.uid() = profile_id);

drop policy if exists "users can read own cart items" on public.cart_items;
create policy "users can read own cart items" on public.cart_items
for select using (
  exists (
    select 1 from public.carts c
    where c.id = cart_items.cart_id
      and c.profile_id = auth.uid()
  )
);

drop policy if exists "users can insert own cart items" on public.cart_items;
create policy "users can insert own cart items" on public.cart_items
for insert with check (
  exists (
    select 1 from public.carts c
    where c.id = cart_items.cart_id
      and c.profile_id = auth.uid()
  )
);

drop policy if exists "users can update own cart items" on public.cart_items;
create policy "users can update own cart items" on public.cart_items
for update using (
  exists (
    select 1 from public.carts c
    where c.id = cart_items.cart_id
      and c.profile_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.carts c
    where c.id = cart_items.cart_id
      and c.profile_id = auth.uid()
  )
);

drop policy if exists "users can delete own cart items" on public.cart_items;
create policy "users can delete own cart items" on public.cart_items
for delete using (
  exists (
    select 1 from public.carts c
    where c.id = cart_items.cart_id
      and c.profile_id = auth.uid()
  )
);

create or replace function public.checkout_active_cart(order_note text default null)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid;
  active_cart_id uuid;
  subtotal numeric(12,2);
  cart_currency text;
  new_order_id uuid;
  generated_order_number text;
begin
  uid := auth.uid();
  if uid is null then
    raise exception 'Not authenticated';
  end if;

  select id, currency_code
    into active_cart_id, cart_currency
  from public.carts
  where profile_id = uid and status = 'active'
  order by created_at desc
  limit 1
  for update;

  if active_cart_id is null then
    raise exception 'No active cart found';
  end if;

  select coalesce(sum(line_total), 0)
    into subtotal
  from public.cart_items
  where cart_id = active_cart_id;

  if subtotal <= 0 then
    raise exception 'Cart is empty';
  end if;

  generated_order_number := concat('BA-', to_char(now(), 'YYYYMMDD'), '-', upper(substring(replace(gen_random_uuid()::text, '-', '') from 1 for 6)));

  insert into public.orders (
    profile_id,
    order_number,
    status,
    currency_code,
    subtotal_amount,
    shipping_amount,
    tax_amount,
    total_amount,
    notes
  )
  values (
    uid,
    generated_order_number,
    'pending',
    coalesce(cart_currency, 'EUR'),
    subtotal,
    0,
    0,
    subtotal,
    order_note
  )
  returning id into new_order_id;

  insert into public.order_items (
    order_id,
    product_id,
    product_slug,
    product_name,
    quantity,
    unit_price,
    line_total,
    meta
  )
  select
    new_order_id,
    ci.product_id,
    ci.product_slug,
    ci.product_name,
    ci.quantity,
    ci.unit_price,
    ci.line_total,
    ci.metadata
  from public.cart_items ci
  where ci.cart_id = active_cart_id;

  update public.orders o
  set
    shipping_address = coalesce((
      select jsonb_build_object(
        'first_name', a.first_name,
        'last_name', a.last_name,
        'line1', a.line1,
        'line2', a.line2,
        'city', a.city,
        'postal_code', a.postal_code,
        'country_code', a.country_code
      )
      from public.customer_addresses a
      where a.profile_id = uid and a.is_default_shipping = true
      order by a.updated_at desc
      limit 1
    ), '{}'::jsonb),
    billing_address = coalesce((
      select jsonb_build_object(
        'first_name', a.first_name,
        'last_name', a.last_name,
        'line1', a.line1,
        'line2', a.line2,
        'city', a.city,
        'postal_code', a.postal_code,
        'country_code', a.country_code
      )
      from public.customer_addresses a
      where a.profile_id = uid and a.is_default_billing = true
      order by a.updated_at desc
      limit 1
    ), '{}'::jsonb)
  where o.id = new_order_id;

  update public.carts
  set status = 'checked_out', checked_out_at = now(), updated_at = now()
  where id = active_cart_id;

  insert into public.carts (profile_id, status, currency_code)
  values (uid, 'active', coalesce(cart_currency, 'EUR'));

  return new_order_id;
end;
$$;

grant execute on function public.checkout_active_cart(text) to authenticated;
