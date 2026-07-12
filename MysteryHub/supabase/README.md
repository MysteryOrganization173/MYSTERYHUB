# Supabase

This directory contains Supabase-related configuration and migrations for
the Mystery Hub backend foundation (see `docs/v1-implementation-plan.md`).

## Structure

```
supabase/
  migrations/
    0001_init_profiles_and_orders.sql  — profiles + orders tables, RLS, triggers
  README.md       — this file
```

`seed.sql` and `config.toml` are not present yet — they will be added if/when
local Supabase CLI development is adopted. For now this migration is meant to
be run against a hosted Supabase project via the SQL editor or the CLI.

## What `0001_init_profiles_and_orders.sql` creates

| Object | Kind | Purpose |
|---|---|---|
| `public.profiles` | table | Minimal 1:1 user record alongside `auth.users` |
| `public.orders` | table | Internet package purchase orders |
| `public.order_payment_status` | enum | `pending \| paid \| failed \| refunded` |
| `public.order_fulfillment_status` | enum | `pending \| processing \| delivered \| failed` |
| `handle_new_user()` + `on_auth_user_created` trigger | function + trigger | Auto-creates a `profiles` row whenever a user signs up (no sign-up UI exists yet, but the row will already be there once it ships) |
| `set_updated_at()` + triggers | function + triggers | Keeps `updated_at` current on both tables |
| RLS policies | policy | Owners can `select` their own `profiles`/`orders` row; all writes happen server-side via the service role key for now |

## Setup — hosted project (current approach for this phase)

1. Create a project at https://supabase.com (or use an existing one).
2. Copy the Project URL, anon/public key, and service role key into
   `.env.local` (see `.env.example`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Open the Supabase SQL editor and run the contents of
   `migrations/0001_init_profiles_and_orders.sql` once.
4. Verify in the Table Editor that `profiles` and `orders` now exist under
   the `public` schema, and that RLS is enabled on both.

## Setup — Supabase CLI (optional, for local development later)

1. Install the Supabase CLI: https://supabase.com/docs/guides/cli
2. Run `supabase init` to add `config.toml` (not yet present in this repo)
3. Run `supabase start` to start a local instance
4. Run `supabase db push` (or `supabase migration up`) to apply
   `migrations/0001_init_profiles_and_orders.sql`
5. Point `.env.local` at the local instance's URL/keys, or keep using the
   hosted project — either works with the current code.

## Regenerating TypeScript types

`src/types/database.ts` is currently hand-authored to match this migration
exactly. Once the project is linked with the CLI, regenerate it instead of
hand-editing:

```bash
npx supabase gen types typescript --project-id <your-project-id> > src/types/database.ts
```
