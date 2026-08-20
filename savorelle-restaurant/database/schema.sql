create extension if not exists pgcrypto;

create table if not exists reservations (
  id uuid primary key default gen_random_uuid(),
  reservation_date date not null,
  reservation_time time not null,
  guests integer not null check (guests between 1 and 10),
  name text not null check (length(trim(name)) >= 2),
  email text not null check (position('@' in email) > 1),
  phone text not null check (length(regexp_replace(phone, '\D', '', 'g')) >= 7),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  source text not null default 'website',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reservations_date_time_idx
  on reservations (reservation_date, reservation_time);

create index if not exists reservations_status_idx
  on reservations (status);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists reservations_set_updated_at on reservations;

create trigger reservations_set_updated_at
before update on reservations
for each row
execute function set_updated_at();

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  idempotency_key text not null unique,
  customer_first_name text not null,
  customer_last_name text not null,
  email text not null,
  phone text not null,
  fulfillment_type text not null check (fulfillment_type in ('pickup', 'delivery')),
  pickup_time text,
  address text,
  city text,
  postal_code text,
  apartment text,
  customer_note text,
  delivery_note text,
  delivery_zone text,
  subtotal numeric(10, 2) not null check (subtotal >= 0),
  delivery_fee numeric(10, 2) not null default 0 check (delivery_fee >= 0),
  discount numeric(10, 2) not null default 0 check (discount >= 0),
  total numeric(10, 2) not null check (total >= 0),
  currency text not null default 'BAM',
  order_status text not null default 'confirmed' check (order_status in ('draft', 'confirmed', 'cancelled', 'fulfilled')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded')),
  payment_method text not null check (payment_method in ('cash', 'card')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id text not null,
  product_name_snapshot text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  line_total numeric(10, 2) not null check (line_total >= 0)
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references orders(id) on delete cascade,
  provider text not null,
  provider_payment_id text,
  amount numeric(10, 2) not null check (amount >= 0),
  currency text not null default 'BAM',
  status text not null check (status in ('pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded')),
  payment_method text not null check (payment_method in ('cash', 'card')),
  card_brand text check (card_brand in ('visa', 'mastercard', 'amex', 'discover', 'unknown')),
  card_last4 text check (card_last4 is null or card_last4 ~ '^[0-9]{4}$'),
  transaction_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on orders (created_at desc);
create index if not exists order_items_order_id_idx on order_items (order_id);

alter table payments drop constraint if exists payments_card_last4_check;
alter table payments add constraint payments_card_last4_check check (card_last4 is null or card_last4 ~ '^[0-9]{4}$');

drop trigger if exists orders_set_updated_at on orders;
create trigger orders_set_updated_at before update on orders for each row execute function set_updated_at();
drop trigger if exists payments_set_updated_at on payments;
create trigger payments_set_updated_at before update on payments for each row execute function set_updated_at();
