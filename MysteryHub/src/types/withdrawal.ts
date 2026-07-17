/**
 * Withdrawal domain types — V1.5 Product Transformation.
 *
 * Backed by `public.withdrawal_requests` (see
 * supabase/migrations/0003_wallet_referrals_suppliers.sql). This is a real,
 * admin-mediated payout queue — no automated bank/mobile-money transfer
 * exists. Requesting a withdrawal debits the wallet immediately; an admin
 * later marks it "paid" (after sending the money through a channel outside
 * this codebase) or "rejected" (which refunds the wallet). See
 * docs/product-audit.md for why this scope was chosen over a fully
 * automated payout integration.
 */
import type { Database, WithdrawalStatus } from "./database";

export type { WithdrawalStatus };

export type WithdrawalRequestRow =
  Database["public"]["Tables"]["withdrawal_requests"]["Row"];

export interface WithdrawalRequestRecord {
  id: string;
  userId: string;
  amount: number;
  payoutNumber: string;
  status: WithdrawalStatus;
  adminNote: string | null;
  createdAt: string;
  processedAt: string | null;
}

export function mapWithdrawalRequestRow(
  row: WithdrawalRequestRow
): WithdrawalRequestRecord {
  return {
    id: row.id,
    userId: row.user_id,
    amount: row.amount,
    payoutNumber: row.payout_number,
    status: row.status,
    adminNote: row.admin_note,
    createdAt: row.created_at,
    processedAt: row.processed_at,
  };
}
