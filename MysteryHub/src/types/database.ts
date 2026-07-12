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
      };
    };
  };
}
