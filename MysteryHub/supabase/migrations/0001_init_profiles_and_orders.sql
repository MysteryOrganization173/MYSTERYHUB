-- ============================================================
-- Mystery Hub — Backend Foundation: profiles + orders
-- Phase: V1 Backend Foundation (see docs/v1-implementation-plan.md)
-- ============================================================
--
-- Scope of this migration:
--   - profiles: minimal user record, 1:1 with auth.users, auto-created on
--     signup via trigger (no sign-up UI exists yet — this just means the
--     row will already be there once auth ships).
--   - orders: persists internet-package purchases. Payment and fulfillment
--     are tracked as two INDEPENDENT status columns, matching the V1 funnel:
--
--       customer selects package
--         -> order created (payment_status = pending, fulfillment_status = pending)
--         -> payment_status updates independently (pending/paid/failed/refunded)
--         -> fulfillment_status updates independently, can happen later
--            (pending/processing/delivered/failed)
--         -> customer tracks the order by reference (reads both statuses)
--
-- Explicitly OUT of scope for this migration (deferred to later phases):
--   - Insert/update policies for authenticated end users (all writes happen
--     server-side via the service role key until an auth UI ships)
--   - SuccessBizHub-specific columns beyond network/bundle_id
--   - Payment provider / webhook tables
--
-- ─── Extensions ────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ─── profiles ──────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'Minimal user profile, 1:1 with auth.users. Extended when auth UI / dashboard ship (V1 later phase).';

alter table public.profiles enable row level security;

create policy "Profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Profiles are updatable by owner"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user is created.
-- Safe to leave in place even though no sign-up UI exists yet.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── orders ────────────────────────────────────────────────────────────────
do $$
begin
  if not exists (select 1 from pg_type where typname = 'order_payment_status') then
    create type public.order_payment_status as enum ('pending', 'paid', 'failed', 'refunded');
  end if;
  if not exists (select 1 from pg_type where typname = 'order_fulfillment_status') then
    create type public.order_fulfillment_status as enum ('pending', 'processing', 'delivered', 'failed');
  end if;
end$$;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  user_id uuid references public.profiles (id) on delete set null,
  network text not null,
  bundle_id text not null,
  bundle_name text not null,
  recipient_phone text not null,
  amount numeric(10, 2) not null,
  currency text not null default 'GHS',
  payment_status public.order_payment_status not null default 'pending',
  payment_reference text,
  fulfillment_status public.order_fulfillment_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.orders is
  'Internet package purchase orders. payment_status and fulfillment_status are tracked independently: a paid order can still be pending fulfillment. /track reads both.';

create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_reference_idx on public.orders (reference);

alter table public.orders enable row level security;

-- Only signed-in owners can read their own orders directly from the client.
-- Guest orders (user_id is null) are intentionally NOT covered by a client
-- select policy — they must be read via a server-side route using the
-- service role key, matched by exact reference, never a broad client query.
create policy "Orders are viewable by owner"
  on public.orders for select
  using (auth.uid() = user_id);

-- No client-side insert/update policy: order creation and status updates
-- happen exclusively through src/services/orders.ts using the service role
-- key until a payment webhook / authenticated write path exists.

-- ─── updated_at maintenance ────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
  before update on public.orders
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();
