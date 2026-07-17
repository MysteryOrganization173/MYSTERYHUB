-- ============================================================
-- Mystery Hub — Wallet, Referrals, Withdrawals, Supplier Settings
-- Phase: V1.5 Product Transformation
-- ============================================================
--
-- This migration adds the real backend for three product surfaces that,
-- before this phase, existed only as marketing copy and hardcoded-zero UI:
--
--   1. Wallet — every profile gets a `wallet_balance`, backed by a full
--      audit ledger (`wallet_transactions`). Credits/debits only ever
--      happen server-side (service role), matching the existing
--      `orders`/`profiles` write convention.
--   2. Referrals — every profile gets a unique `referral_code` (generated
--      automatically) and an optional `referred_by` (set once, at signup,
--      from a referral code passed through Supabase Auth's
--      `raw_user_meta_data`). When a referred user's order is paid, a
--      commission is recorded in `referral_commissions` (unique on
--      `order_reference` — the idempotency guard against duplicate
--      webhook deliveries) and credited to the referrer's wallet.
--   3. Withdrawals — `withdrawal_requests` is a real, admin-mediated
--      payout queue. Requesting a withdrawal debits the wallet
--      immediately (preventing double-spend); rejecting one credits it
--      back. No automated bank/mobile-money transfer is implemented here
--      — an admin marks a request "paid" once they've sent the money
--      through a channel outside this codebase. This is a deliberate
--      scope decision (see docs/product-audit.md) to avoid fabricating a
--      payout automation that doesn't exist.
--   4. Supplier settings — `supplier_settings` lets an admin enable/
--      disable/prioritize catalogue+fulfillment suppliers at runtime,
--      without redeploying. Never stores secrets (those stay in env
--      vars) — only routing metadata.
--
-- Also adds `orders.supplier_reference` / `orders.fulfillment_error`
-- (the detail columns `supabase/migrations/0002_fulfillment_attempts.sql`
-- assumed would exist eventually) so `/track` and the admin orders view
-- can surface exactly what a supplier said, never a fabricated status.
--
-- ─── orders: fulfillment detail columns ────────────────────────────────────
alter table public.orders
  add column if not exists supplier_reference text,
  add column if not exists fulfillment_error text;

comment on column public.orders.supplier_reference is
  'The active supplier''s own order/transaction id, once accepted by fulfillmentService.';
comment on column public.orders.fulfillment_error is
  'Last customer-safe fulfillment error message, if any. Never set to a fabricated success.';

-- ─── profiles: wallet + referral columns ───────────────────────────────────
alter table public.profiles
  add column if not exists wallet_balance numeric(12, 2) not null default 0,
  add column if not exists referral_code text,
  add column if not exists referred_by uuid references public.profiles (id) on delete set null;

comment on column public.profiles.wallet_balance is
  'Authoritative only via wallet_transactions ledger — every change to this column must be paired with a wallet_transactions row written in the same transaction (see src/services/wallet.ts).';
comment on column public.profiles.referral_code is
  'Unique, auto-generated at signup (see handle_new_user() below). Shared as ?ref=<code> links.';
comment on column public.profiles.referred_by is
  'Set once, at signup, from the referral code in the new user''s auth metadata. Never changed after insert.';

create unique index if not exists profiles_referral_code_key
  on public.profiles (referral_code);

-- ─── referral_code generator ────────────────────────────────────────────────
create or replace function public.generate_referral_code()
returns text
language plpgsql
as $$
declare
  candidate text;
  exists_already boolean;
begin
  loop
    -- 7 chars, uppercase alphanumeric, human-shareable (no ambiguous 0/O/1/I).
    candidate := (
      select string_agg(
        substr('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', ceil(random() * 33)::int, 1),
        ''
      )
      from generate_series(1, 7)
    );
    select exists(select 1 from public.profiles where referral_code = candidate) into exists_already;
    if not exists_already then
      return candidate;
    end if;
  end loop;
end;
$$;

-- ─── handle_new_user(): now also resolves referral_code + referred_by ─────
-- Replaces the 0001 version. Reads an optional referral code from the new
-- auth user's `raw_user_meta_data->>'referral_code'` (passed through
-- `authService.signUp`'s `options.data`, the same mechanism already used
-- for `full_name`). Resolving the referrer here — inside the same trigger
-- that creates the profile — means signup and referral attribution are
-- atomic; there is no separate follow-up write, no race, and no window
-- where a profile exists without its referred_by ever being set.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  incoming_code text;
  referrer_id uuid;
begin
  incoming_code := new.raw_user_meta_data->>'referral_code';
  referrer_id := null;

  if incoming_code is not null and length(trim(incoming_code)) > 0 then
    select id into referrer_id
    from public.profiles
    where referral_code = upper(trim(incoming_code));
  end if;

  insert into public.profiles (id, email, referral_code, referred_by)
  values (
    new.id,
    new.email,
    public.generate_referral_code(),
    referrer_id
  );
  return new;
end;
$$;

-- Trigger already exists from 0001 (on_auth_user_created); re-creating the
-- function body above is enough — no need to drop/recreate the trigger
-- itself since it just calls the function by name.

-- Backfill: any profile created before this migration has no
-- referral_code yet. Give every existing row one so referral links work
-- immediately for pre-existing users too.
update public.profiles
set referral_code = public.generate_referral_code()
where referral_code is null;

-- ─── wallet_transactions ────────────────────────────────────────────────────
do $$
begin
  if not exists (select 1 from pg_type where typname = 'wallet_transaction_type') then
    create type public.wallet_transaction_type as enum ('credit', 'debit');
  end if;
end$$;

create table if not exists public.wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type public.wallet_transaction_type not null,
  amount numeric(12, 2) not null check (amount > 0),
  balance_after numeric(12, 2) not null,
  reference text,
  description text not null,
  created_at timestamptz not null default now()
);

comment on table public.wallet_transactions is
  'Full audit ledger for every wallet balance change. Written exclusively by src/services/wallet.ts using the service-role client — profiles.wallet_balance is never updated without a matching row here.';

create index if not exists wallet_transactions_user_id_idx
  on public.wallet_transactions (user_id, created_at desc);

alter table public.wallet_transactions enable row level security;

create policy "Wallet transactions are viewable by owner"
  on public.wallet_transactions for select
  using (auth.uid() = user_id);

-- No insert/update/delete policy: writes happen exclusively server-side via
-- the service-role client, matching the existing orders/profiles convention.

-- ─── referral_commissions ──────────────────────────────────────────────────
create table if not exists public.referral_commissions (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references public.profiles (id) on delete cascade,
  referred_user_id uuid not null references public.profiles (id) on delete cascade,
  order_reference text not null unique,
  order_amount numeric(12, 2) not null,
  commission_rate numeric(5, 4) not null,
  commission_amount numeric(12, 2) not null,
  created_at timestamptz not null default now()
);

comment on table public.referral_commissions is
  'One row per commission ever paid. Unique on order_reference — this is the idempotency guard that makes crediting safe even if the Paystack webhook fires more than once for the same order (see src/services/referrals.ts creditCommission()).';

create index if not exists referral_commissions_referrer_id_idx
  on public.referral_commissions (referrer_id, created_at desc);

alter table public.referral_commissions enable row level security;

create policy "Referral commissions are viewable by the referrer"
  on public.referral_commissions for select
  using (auth.uid() = referrer_id);

-- ─── withdrawal_requests ────────────────────────────────────────────────────
do $$
begin
  if not exists (select 1 from pg_type where typname = 'withdrawal_status') then
    create type public.withdrawal_status as enum ('pending', 'approved', 'paid', 'rejected');
  end if;
end$$;

create table if not exists public.withdrawal_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  amount numeric(12, 2) not null check (amount > 0),
  payout_number text not null,
  status public.withdrawal_status not null default 'pending',
  admin_note text,
  created_at timestamptz not null default now(),
  processed_at timestamptz
);

comment on table public.withdrawal_requests is
  'Admin-mediated payout queue. Requesting a withdrawal debits the wallet immediately (see src/services/wallet.ts + src/app/api/wallet/withdraw). No automated bank/mobile-money transfer exists — an admin marks a request "paid" after sending the money through an external channel; rejecting refunds the wallet.';

create index if not exists withdrawal_requests_user_id_idx
  on public.withdrawal_requests (user_id, created_at desc);
create index if not exists withdrawal_requests_status_idx
  on public.withdrawal_requests (status, created_at desc);

alter table public.withdrawal_requests enable row level security;

create policy "Withdrawal requests are viewable by owner"
  on public.withdrawal_requests for select
  using (auth.uid() = user_id);

-- No client insert/update policy: creation and status changes happen
-- exclusively server-side (POST /api/wallet/withdraw and the admin
-- withdrawal routes), both using the service-role client.

-- ─── supplier_settings ──────────────────────────────────────────────────────
create table if not exists public.supplier_settings (
  supplier_key text primary key,
  label text not null,
  enabled boolean not null default false,
  priority integer not null default 100,
  updated_at timestamptz not null default now()
);

comment on table public.supplier_settings is
  'Admin-editable routing metadata only — NEVER stores credentials/secrets (those stay in env vars, see src/config/env.ts). src/services/suppliers/supplierRegistry.ts reads this to pick the active catalogue/fulfillment adapter by lowest enabled priority.';

alter table public.supplier_settings enable row level security;

-- No client policy at all: read exclusively via GET /api/admin/suppliers
-- (service-role, admin-gated); write exclusively via the matching PATCH
-- route. Never queried directly by the browser/anon client.

insert into public.supplier_settings (supplier_key, label, enabled, priority)
values
  ('successbizhub', 'SuccessBizHub (live)', true, 10),
  ('mock', 'Mock / Test adapter', false, 100)
on conflict (supplier_key) do nothing;

drop trigger if exists set_supplier_settings_updated_at on public.supplier_settings;
create trigger set_supplier_settings_updated_at
  before update on public.supplier_settings
  for each row execute procedure public.set_updated_at();
