/**
 * Hand-authored Supabase database types — V1 Backend Foundation.
 *
 * Mirrors supabase/migrations/0001_init_profiles_and_orders.sql exactly.
 * Regenerate with the Supabase CLI once the project is linked, e.g.:
 *
 *   npx supabase gen types typescript --project-id <id> > src/types/database.ts
 *
 * Until the CLI is wired into a script, keep this file in sync by hand
 * whenever a migration adds/changes a column.
 *
 * `Views`, `Functions`, `Enums`, and `CompositeTypes` are declared as empty
 * records (this project has none of those yet) rather than omitted, and
 * every table declares `Relationships: []` (no foreign-key relationships
 * are exposed to PostgREST embedding today). `@supabase/postgrest-js`'s
 * `GenericSchema` constraint requires `Tables: Record<string, GenericTable>`
 * where `GenericTable` itself requires `Row`/`Insert`/`Update`/
 * `Relationships`, plus top-level `Views`/`Functions` on the schema, for
 * `SupabaseClient<Database>` to resolve query/insert/update generics
 * correctly — omitting any of these causes the schema to fail the
 * `extends GenericSchema` check, which makes every `.insert()` /
 * `.update()` payload type collapse to `never`. Keeping all of these here
 * also matches the real `supabase gen types typescript` output shape, so
 * regenerating this file later is a drop-in replacement.
 */

export type OrderPaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type OrderFulfillmentStatus =
  | "pending"
  | "processing"
  | "delivered"
  | "failed";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          reference: string;
          user_id: string | null;
          network: string;
          bundle_id: string;
          bundle_name: string;
          recipient_phone: string;
          amount: number;
          currency: string;
          payment_status: OrderPaymentStatus;
          payment_reference: string | null;
          fulfillment_status: OrderFulfillmentStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          reference: string;
          user_id?: string | null;
          network: string;
          bundle_id: string;
          bundle_name: string;
          recipient_phone: string;
          amount: number;
          currency?: string;
          payment_status?: OrderPaymentStatus;
          payment_reference?: string | null;
          fulfillment_status?: OrderFulfillmentStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
