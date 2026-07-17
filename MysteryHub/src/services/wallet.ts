/**
 * Wallet Service — V1.5 Product Transformation.
 *
 * Server-only (imports the service-role admin client). Every balance
 * change is written as: read current balance -> compute new balance ->
 * update `profiles.wallet_balance` -> insert a `wallet_transactions` row
 * with that transaction's own `balance_after`. This is not wrapped in a
 * single DB transaction (this codebase has no RPC/transaction helper
 * today) — under concurrent writes for the *same* user there is a narrow
 * window for a lost update. Acceptable for this phase's real-money volume
 * (see docs/product-audit.md); the honest fix if volume grows is a
 * Postgres function that does the read-modify-write atomically. Duplicate
 * *referral* credits are already prevented at a stronger layer: the
 * unique constraint on `referral_commissions.order_reference` (see
 * `src/services/referrals.ts`), not by this file.
 *
 * Every method returns `ApiResponse<T>` and never throws, matching every
 * other service in this codebase.
 */
import { supabaseAdminClient } from "@/lib/supabase/admin";
import {
  mapWalletTransactionRow,
  type WalletTransactionRecord,
} from "@/types/wallet";
import type { ApiResponse } from "@/types";

async function getBalance(userId: string): Promise<ApiResponse<number>> {
  const { data, error } = await supabaseAdminClient
    .from("profiles")
    .select("wallet_balance")
    .eq("id", userId)
    .maybeSingle();

  if (error) return { data: null, error: error.message };
  if (!data) return { data: null, error: "Profile not found" };
  return { data: data.wallet_balance, error: null };
}

async function listTransactions(
  userId: string,
  limit = 50
): Promise<ApiResponse<WalletTransactionRecord[]>> {
  const { data, error } = await supabaseAdminClient
    .from("wallet_transactions")
    .select()
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return { data: null, error: error.message };
  return { data: (data ?? []).map(mapWalletTransactionRow), error: null };
}

async function credit(
  userId: string,
  amount: number,
  description: string,
  reference?: string
): Promise<ApiResponse<WalletTransactionRecord>> {
  if (!(amount > 0)) {
    return { data: null, error: "Credit amount must be greater than zero" };
  }

  const balanceResult = await getBalance(userId);
  if (balanceResult.error || balanceResult.data === null) {
    return { data: null, error: balanceResult.error ?? "Profile not found" };
  }

  const balanceAfter = Number((balanceResult.data + amount).toFixed(2));

  const { error: updateError } = await supabaseAdminClient
    .from("profiles")
    .update({ wallet_balance: balanceAfter })
    .eq("id", userId);

  if (updateError) {
    return { data: null, error: updateError.message };
  }

  const { data, error } = await supabaseAdminClient
    .from("wallet_transactions")
    .insert({
      user_id: userId,
      type: "credit",
      amount,
      balance_after: balanceAfter,
      reference: reference ?? null,
      description,
    })
    .select()
    .single();

  if (error || !data) {
    return { data: null, error: error?.message ?? "Failed to record credit" };
  }
  return { data: mapWalletTransactionRow(data), error: null };
}

async function debit(
  userId: string,
  amount: number,
  description: string,
  reference?: string
): Promise<ApiResponse<WalletTransactionRecord>> {
  if (!(amount > 0)) {
    return { data: null, error: "Debit amount must be greater than zero" };
  }

  const balanceResult = await getBalance(userId);
  if (balanceResult.error || balanceResult.data === null) {
    return { data: null, error: balanceResult.error ?? "Profile not found" };
  }

  if (balanceResult.data < amount) {
    return { data: null, error: "Insufficient wallet balance" };
  }

  const balanceAfter = Number((balanceResult.data - amount).toFixed(2));

  const { error: updateError } = await supabaseAdminClient
    .from("profiles")
    .update({ wallet_balance: balanceAfter })
    .eq("id", userId);

  if (updateError) {
    return { data: null, error: updateError.message };
  }

  const { data, error } = await supabaseAdminClient
    .from("wallet_transactions")
    .insert({
      user_id: userId,
      type: "debit",
      amount,
      balance_after: balanceAfter,
      reference: reference ?? null,
      description,
    })
    .select()
    .single();

  if (error || !data) {
    return { data: null, error: error?.message ?? "Failed to record debit" };
  }
  return { data: mapWalletTransactionRow(data), error: null };
}

export const walletService = {
  getBalance,
  listTransactions,
  credit,
  debit,
};
