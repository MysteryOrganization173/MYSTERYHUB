/**
 * Profile domain types — V1 Backend Foundation, extended in V1.5 with
 * wallet + referral fields (see
 * supabase/migrations/0003_wallet_referrals_suppliers.sql).
 *
 * `Profile` is the camelCase shape used by services/components.
 * `ProfileRow` is the raw DB row shape (snake_case), imported only inside
 * the service layer — components should never see `ProfileRow` directly.
 */
import type { Database } from "./database";

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export interface Profile {
  id: string;
  email: string;
  fullName: string | null;
  walletBalance: number;
  referralCode: string | null;
  referredBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export function mapProfileRow(row: ProfileRow): Profile {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    walletBalance: row.wallet_balance,
    referralCode: row.referral_code,
    referredBy: row.referred_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
