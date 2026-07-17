/**
 * Wallet domain types — V1.5 Product Transformation.
 *
 * Mirrors `src/types/order.ts`'s pattern: `WalletTransactionRecord` is the
 * camelCase shape used by services/components, `WalletTransactionRow` is
 * the raw DB row. See `src/services/wallet.ts` for the only code path that
 * writes these — every balance change is paired with a ledger row, always
 * server-side via the service-role client.
 */
import type { Database, WalletTransactionType } from "./database";

export type { WalletTransactionType };

export type WalletTransactionRow =
  Database["public"]["Tables"]["wallet_transactions"]["Row"];

export interface WalletTransactionRecord {
  id: string;
  userId: string;
  type: WalletTransactionType;
  amount: number;
  balanceAfter: number;
  reference: string | null;
  description: string;
  createdAt: string;
}

export function mapWalletTransactionRow(
  row: WalletTransactionRow
): WalletTransactionRecord {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    amount: row.amount,
    balanceAfter: row.balance_after,
    reference: row.reference,
    description: row.description,
    createdAt: row.created_at,
  };
}
