/**
 * Hand-authored Supabase database types — V1 Backend Foundation, extended in
 * V1.5 (see supabase/migrations/0003_wallet_referrals_suppliers.sql).
 *
 * Mirrors supabase/migrations/0001_init_profiles_and_orders.sql,
 * 0002_fulfillment_attempts.sql (prepared, not required for this file), and
 * 0003_wallet_referrals_suppliers.sql exactly. Regenerate with the Supabase
 * CLI once the project is linked, e.g.:
 *
 *   npx supabase gen types typescript --project-id <id> > src/types/database.ts
 *
 * Until the CLI is wired into a script, keep this file in sync by hand
 * whenever a migration adds/changes a column.
 *
 * `Views`, `Functions`, `Enums`, and `CompositeTypes` are declared as empty
 * records (this project has none of those exposed to PostgREST) rather than
 * omitted, and every table declares `Relationships: []` (no foreign-key
 * relationships are exposed to PostgREST embedding today). See the original
 * file history for the full rationale on why every one of these fields is
 * required for `SupabaseClient<Database>` to resolve query generics.
 */

export type OrderPaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type OrderFulfillmentStatus =
  | "pending"
  | "processing"
  | "delivered"
  | "failed";
export type WalletTransactionType = "credit" | "debit";
export type WithdrawalStatus = "pending" | "approved" | "paid" | "rejected";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          wallet_balance: number;
          referral_code: string | null;
          referred_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          wallet_balance?: number;
          referral_code?: string | null;
          referred_by?: string | null;
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
          /** Supplier's own order/transaction id, once accepted. Added by
           * supabase/migrations/0003_wallet_referrals_suppliers.sql. */
          supplier_reference: string | null;
          /** Last customer-safe fulfillment error message, if any. Added by
           * supabase/migrations/0003_wallet_referrals_suppliers.sql. */
          fulfillment_error: string | null;
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
          supplier_reference?: string | null;
          fulfillment_error?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
        Relationships: [];
      };
      wallet_transactions: {
        Row: {
          id: string;
          user_id: string;
          type: WalletTransactionType;
          amount: number;
          balance_after: number;
          reference: string | null;
          description: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: WalletTransactionType;
          amount: number;
          balance_after: number;
          reference?: string | null;
          description: string;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["wallet_transactions"]["Insert"]
        >;
        Relationships: [];
      };
      referral_commissions: {
        Row: {
          id: string;
          referrer_id: string;
          referred_user_id: string;
          order_reference: string;
          order_amount: number;
          commission_rate: number;
          commission_amount: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          referrer_id: string;
          referred_user_id: string;
          order_reference: string;
          order_amount: number;
          commission_rate: number;
          commission_amount: number;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["referral_commissions"]["Insert"]
        >;
        Relationships: [];
      };
      withdrawal_requests: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          payout_number: string;
          status: WithdrawalStatus;
          admin_note: string | null;
          created_at: string;
          processed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          payout_number: string;
          status?: WithdrawalStatus;
          admin_note?: string | null;
          created_at?: string;
          processed_at?: string | null;
        };
        Update: Partial<
          Database["public"]["Tables"]["withdrawal_requests"]["Insert"]
        >;
        Relationships: [];
      };
      supplier_settings: {
        Row: {
          supplier_key: string;
          label: string;
          enabled: boolean;
          priority: number;
          updated_at: string;
        };
        Insert: {
          supplier_key: string;
          label: string;
          enabled?: boolean;
          priority?: number;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["supplier_settings"]["Insert"]
        >;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
