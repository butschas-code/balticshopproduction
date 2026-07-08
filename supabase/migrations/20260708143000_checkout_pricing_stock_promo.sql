-- Stock, promo codes, and checkout pricing pipeline

drop function if exists public.checkout_active_cart(text);

alter table public.products
  add column if not exists stock_quantity int,
  add column if not exists track_inventory boolean not null default false;

update public.products
set stock_quantity = coalesce(stock_quantity, 99),
    track_inventory = coalesce(track_inventory, false)
where stock_quantity is null;

alter table public.orders
  add column if not exists promo_code text,
  add column if not exists discount_amount numeric(12,2) not null default 0;

create table if not exists public.promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description text,
  discount_type text not null check (discount_type in ('percent','fixed')),
  discount_value numeric(12,2) not null check (discount_value > 0),
  min_order_amount numeric(12,2) not null default 0,
  max_uses int,
  used_count int not null default 0,
  valid_from timestamptz,
  valid_until timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.promo_codes enable row level security;

drop policy if exists "public can read active promo codes" on public.promo_codes;
create policy "public can read active promo codes" on public.promo_codes
for select using (is_active = true);

insert into public.promo_codes (code, description, discount_type, discount_value, min_order_amount, is_active)
values
  ('WELCOME10', '10% off orders over EUR 50', 'percent', 10, 50, true),
  ('BALTIC5', 'EUR 5 off orders over EUR 30', 'fixed', 5, 30, true)
on conflict (code) do nothing;

create or replace function public.normalize_address(input jsonb)
returns jsonb
language sql
immutable
as $$
  select jsonb_build_object(
    'first_name', coalesce(input->>'first_name', ''),
    'last_name', coalesce(input->>'last_name', ''),
    'line1', coalesce(input->>'line1', ''),
    'line2', coalesce(input->>'line2', ''),
    'city', coalesce(input->>'city', ''),
    'postal_code', coalesce(input->>'postal_code', ''),
    'country_code', upper(coalesce(nullif(input->>'country_code', ''), 'LV'))
  );
$$;

create or replace function public.calculate_shipping_amount(
  subtotal numeric,
  country_code text
)
returns numeric
language plpgsql
immutable
as $$
declare
  country text := upper(coalesce(country_code, 'LV'));
begin
  if subtotal >= 120 then
    return 0;
  end if;

  if country in ('LV', 'LT', 'EE', 'DE') then
    return 8.00;
  end if;

  if country in ('AT', 'BE', 'DK', 'FI', 'FR', 'IE', 'IT', 'LU', 'NL', 'PL', 'SE', 'ES', 'PT', 'CZ', 'SK', 'SI', 'HU', 'RO', 'BG', 'HR', 'GR', 'CY', 'MT') then
    return 12.00;
  end if;

  return 18.00;
end;
$$;

create or replace function public.calculate_tax_amount(
  taxable_subtotal numeric,
  country_code text
)
returns numeric
language plpgsql
immutable
as $$
declare
  country text := upper(coalesce(country_code, 'LV'));
  rate numeric := 0.21;
begin
  if taxable_subtotal <= 0 then
    return 0;
  end if;

  if country in ('DE') then
    rate := 0.19;
  elsif country in ('LV', 'LT', 'EE') then
    rate := 0.21;
  else
    rate := 0.20;
  end if;

  return round(taxable_subtotal * rate, 2);
end;
$$;

create or replace function public.resolve_promo_discount(
  promo_code_input text,
  subtotal numeric
)
returns table (
  promo_code text,
  discount_amount numeric,
  promo_error text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  promo public.promo_codes%rowtype;
  normalized_code text := upper(trim(coalesce(promo_code_input, '')));
  computed_discount numeric := 0;
begin
  if normalized_code = '' then
    return query select null::text, 0::numeric, null::text;
    return;
  end if;

  select * into promo
  from public.promo_codes
  where upper(code) = normalized_code
    and is_active = true
  limit 1;

  if promo.id is null then
    return query select normalized_code, 0::numeric, 'Invalid promo code';
    return;
  end if;

  if promo.valid_from is not null and now() < promo.valid_from then
    return query select normalized_code, 0::numeric, 'Promo code is not active yet';
    return;
  end if;

  if promo.valid_until is not null and now() > promo.valid_until then
    return query select normalized_code, 0::numeric, 'Promo code has expired';
    return;
  end if;

  if promo.max_uses is not null and promo.used_count >= promo.max_uses then
    return query select normalized_code, 0::numeric, 'Promo code usage limit reached';
    return;
  end if;

  if subtotal < promo.min_order_amount then
    return query select normalized_code, 0::numeric, format('Minimum order amount is EUR %s', promo.min_order_amount);
    return;
  end if;

  if promo.discount_type = 'percent' then
    computed_discount := round(subtotal * (promo.discount_value / 100.0), 2);
  else
    computed_discount := least(promo.discount_value, subtotal);
  end if;

  return query select promo.code, computed_discount, null::text;
end;
$$;

create or replace function public.validate_and_sync_active_cart()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  active_cart_id uuid;
  item record;
  price_updates jsonb := '[]'::jsonb;
  stock_issues jsonb := '[]'::jsonb;
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;

  select id into active_cart_id
  from public.carts
  where profile_id = uid and status = 'active'
  order by created_at desc
  limit 1
  for update;

  if active_cart_id is null then
    return jsonb_build_object('price_updates', '[]'::jsonb, 'stock_issues', '[]'::jsonb);
  end if;

  for item in
    select ci.id, ci.product_id, ci.product_name, ci.quantity, ci.unit_price,
           p.price_amount, p.stock_quantity, p.track_inventory
    from public.cart_items ci
    left join public.products p on p.id = ci.product_id
    where ci.cart_id = active_cart_id
  loop
    if item.product_id is null then
      stock_issues := stock_issues || jsonb_build_array(jsonb_build_object(
        'product_name', item.product_name,
        'message', 'Product no longer available'
      ));
      continue;
    end if;

    if item.price_amount is not null and item.unit_price is distinct from item.price_amount then
      update public.cart_items
      set unit_price = item.price_amount, updated_at = now()
      where id = item.id;

      price_updates := price_updates || jsonb_build_array(jsonb_build_object(
        'product_name', item.product_name,
        'old_price', item.unit_price,
        'new_price', item.price_amount
      ));
    end if;

    if coalesce(item.track_inventory, false) then
      if item.stock_quantity is null or item.stock_quantity < item.quantity then
        stock_issues := stock_issues || jsonb_build_array(jsonb_build_object(
          'product_name', item.product_name,
          'requested', item.quantity,
          'available', coalesce(item.stock_quantity, 0),
          'message', 'Insufficient stock'
        ));
      end if;
    end if;
  end loop;

  return jsonb_build_object(
    'price_updates', price_updates,
    'stock_issues', stock_issues
  );
end;
$$;

create or replace function public.calculate_checkout_totals(
  promo_code_input text default null,
  country_code_input text default 'LV'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  active_cart_id uuid;
  subtotal numeric(12,2) := 0;
  shipping numeric(12,2) := 0;
  tax numeric(12,2) := 0;
  discount numeric(12,2) := 0;
  total numeric(12,2) := 0;
  validation jsonb;
  promo_row record;
  taxable numeric(12,2);
  country_code text := upper(coalesce(country_code_input, 'LV'));
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;

  validation := public.validate_and_sync_active_cart();

  if jsonb_array_length(coalesce(validation->'stock_issues', '[]'::jsonb)) > 0 then
    return jsonb_build_object(
      'subtotal', 0,
      'shipping', 0,
      'tax', 0,
      'discount', 0,
      'total', 0,
      'currency_code', 'EUR',
      'promo_code', null,
      'promo_error', null,
      'price_updates', validation->'price_updates',
      'stock_issues', validation->'stock_issues',
      'can_checkout', false
    );
  end if;

  select id into active_cart_id
  from public.carts
  where profile_id = uid and status = 'active'
  order by created_at desc
  limit 1;

  select coalesce(sum(line_total), 0) into subtotal
  from public.cart_items
  where cart_id = active_cart_id;

  select * into promo_row
  from public.resolve_promo_discount(promo_code_input, subtotal);

  discount := coalesce(promo_row.discount_amount, 0);
  shipping := public.calculate_shipping_amount(subtotal, country_code);
  taxable := greatest(subtotal - discount, 0);
  tax := public.calculate_tax_amount(taxable, country_code);
  total := taxable + shipping + tax;

  return jsonb_build_object(
    'subtotal', subtotal,
    'shipping', shipping,
    'tax', tax,
    'discount', discount,
    'total', total,
    'currency_code', 'EUR',
    'promo_code', promo_row.promo_code,
    'promo_error', promo_row.promo_error,
    'price_updates', validation->'price_updates',
    'stock_issues', validation->'stock_issues',
    'can_checkout', subtotal > 0
  );
end;
$$;

create or replace function public.checkout_active_cart(
  promo_code_input text default null,
  shipping_address_input jsonb default '{}'::jsonb,
  billing_address_input jsonb default '{}'::jsonb,
  order_note text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid;
  active_cart_id uuid;
  subtotal numeric(12,2);
  shipping numeric(12,2);
  tax numeric(12,2);
  discount numeric(12,2);
  total numeric(12,2);
  cart_currency text;
  new_order_id uuid;
  generated_order_number text;
  validation jsonb;
  totals jsonb;
  promo_row record;
  shipping_address jsonb;
  billing_address jsonb;
  country_code text;
  item record;
  applied_promo text;
begin
  uid := auth.uid();
  if uid is null then
    raise exception 'Not authenticated';
  end if;

  shipping_address := public.normalize_address(shipping_address_input);
  billing_address := public.normalize_address(billing_address_input);
  country_code := coalesce(shipping_address->>'country_code', 'LV');

  if coalesce(shipping_address->>'line1', '') = '' or coalesce(shipping_address->>'city', '') = '' then
    raise exception 'Shipping address is incomplete';
  end if;

  if coalesce(billing_address->>'line1', '') = '' or coalesce(billing_address->>'city', '') = '' then
    raise exception 'Billing address is incomplete';
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

  validation := public.validate_and_sync_active_cart();
  if jsonb_array_length(coalesce(validation->'stock_issues', '[]'::jsonb)) > 0 then
    raise exception 'Cart has stock or availability issues';
  end if;

  select coalesce(sum(line_total), 0) into subtotal
  from public.cart_items
  where cart_id = active_cart_id;

  if subtotal <= 0 then
    raise exception 'Cart is empty';
  end if;

  select * into promo_row
  from public.resolve_promo_discount(promo_code_input, subtotal);

  if promo_row.promo_error is not null then
    raise exception '%', promo_row.promo_error;
  end if;

  discount := coalesce(promo_row.discount_amount, 0);
  applied_promo := promo_row.promo_code;
  shipping := public.calculate_shipping_amount(subtotal, country_code);
  tax := public.calculate_tax_amount(greatest(subtotal - discount, 0), country_code);
  total := greatest(subtotal - discount, 0) + shipping + tax;

  generated_order_number := concat('BA-', to_char(now(), 'YYYYMMDD'), '-', upper(substring(replace(gen_random_uuid()::text, '-', '') from 1 for 6)));

  insert into public.orders (
    profile_id,
    order_number,
    status,
    currency_code,
    subtotal_amount,
    shipping_amount,
    tax_amount,
    discount_amount,
    total_amount,
    promo_code,
    notes,
    shipping_address,
    billing_address
  )
  values (
    uid,
    generated_order_number,
    'pending',
    coalesce(cart_currency, 'EUR'),
    subtotal,
    shipping,
    tax,
    discount,
    total,
    applied_promo,
    order_note,
    shipping_address,
    billing_address
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

  for item in
    select ci.product_id, ci.quantity, p.track_inventory
    from public.cart_items ci
    join public.products p on p.id = ci.product_id
    where ci.cart_id = active_cart_id
      and coalesce(p.track_inventory, false) = true
  loop
    update public.products
    set stock_quantity = greatest(coalesce(stock_quantity, 0) - item.quantity, 0),
        updated_at = now()
    where id = item.product_id;
  end loop;

  if applied_promo is not null then
    update public.promo_codes
    set used_count = used_count + 1,
        updated_at = now()
    where upper(code) = upper(applied_promo);
  end if;

  update public.carts
  set status = 'checked_out', checked_out_at = now(), updated_at = now()
  where id = active_cart_id;

  insert into public.carts (profile_id, status, currency_code)
  values (uid, 'active', coalesce(cart_currency, 'EUR'));

  return new_order_id;
end;
$$;

grant execute on function public.validate_and_sync_active_cart() to authenticated;
grant execute on function public.calculate_checkout_totals(text, text) to authenticated;
grant execute on function public.checkout_active_cart(text, jsonb, jsonb, text) to authenticated;
