-- ============================================================
-- Mystery Hub — Fulfillment pipeline: fulfillment_attempts
-- Phase: Prepared, NOT YET APPLIED. See docs/fulfillment.md.
-- ============================================================
--
-- Status: this migration is written and reviewed but intentionally not
-- run against any environment yet — no code path in this codebase queries
-- this table today (src/services/fulfillment/fulfillmentService.ts uses an
-- in-memory Map as a stand-in; see that file's comments). It exists so
-- that when the fulfillment pipeline is wired to a real supplier
-- (SuccessBizHub), the persistence layer is a one-step "apply this file"
-- rather than a new design exercise.
--
-- Scope of this migration:
--   - fulfillment_attempts: one row per attempt to fulfil a given order,
--     keyed by order_reference (matches public.orders.reference — no
--     foreign key by design, since orders are looked up by the same public
--     reference everywhere else, e.g. ordersService.getOrderByReference).
--   - Provides the durable idempotency/duplicate-protection record that an
--     in-memory Map cannot: if a process restarts mid-retry, the next
--     worker still knows how many attempts already ran and whether the
--     order already reached "delivered" before calling a supplier again.
--
-- Explicitly OUT of scope for this migration:
--   - No changes to public.orders (fulfillment_status stays as-is).
--   - No queue table (src/services/fulfillment/queue.ts's in-memory
--     implementation is a separate concern from this attempts ledger; a
--     future durable queue could be a different table or an external
--     service — not decided here).
--   - No SuccessBizHub-specific columns.
--
-- ─── fulfillment_attempts ──────────────────────────────────────────────────
do $$
begin
  if not exists (select 1 from pg_type where typname = 'fulfillment_attempt_status') then
    create type public.fulfillment_attempt_status as enum ('pending', 'processing', 'delivered', 'failed');
  end if;
end$$;

create table if not exists public.fulfillment_attempts (
  id uuid primary key default gen_random_uuid(),
  order_reference text not null,
  attempt_number integer not null,
  status public.fulfillment_attempt_status not null default 'pending',
  supplier_reference text,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (order_reference, attempt_number)
);

comment on table public.fulfillment_attempts is
  'One row per attempt to fulfil an order via a SupplierAdapter. Durable idempotency/duplicate-protection ledger for src/services/fulfillment/fulfillmentService.ts. Not queried by any code path until that service is wired to a real supplier.';

create index if not exists fulfillment_attempts_order_reference_idx
  on public.fulfillment_attempts (order_reference);

alter table public.fulfillment_attempts enable row level security;

-- No client-side policy of any kind: this table is written and read
-- exclusively by server-side fulfillment worker code using the service
-- role key, the same convention public.orders already uses for writes.

drop trigger if exists set_fulfillment_attempts_updated_at on public.fulfillment_attempts;
create trigger set_fulfillment_attempts_updated_at
  before update on public.fulfillment_attempts
  for each row execute procedure public.set_updated_at();
