/**
 * Withdrawals Service — V1.5 Product Transformation.
 *
 * Server-only. See `src/types/withdrawal.ts` for the scope decision this
 * implements: admin-mediated payouts, no automated bank/mobile-money
 * transfer. Requesting a withdrawal debits the wallet immediately
 * (prevents a user from requesting more than they have, or spending the
 * same balance twice while a request is pending); rejecting a request
 * refunds it.
 */
import { supabaseAdminClient } from "@/lib/supabase/admin";
import { walletService } from "@/services/wallet";
import {
  mapWithdrawalRequestRow,
  type WithdrawalRequestRecord,
  type WithdrawalStatus,
} from "@/types/withdrawal";
import type { ApiResponse } from "@/types";

/** Placeholder minimum withdrawal amount — flagged as a business decision
 * to revisit, not a verified operational constraint. */
export const MIN_WITHDRAWAL_AMOUNT = 10;

async function createRequest(
  userId: string,
  amount: number,
  payoutNumber: string
): Promise<ApiResponse<WithdrawalRequestRecord>> {
  const trimmedNumber = payoutNumber.trim();

  if (!(amount >= MIN_WITHDRAWAL_AMOUNT)) {
    return {
      data: null,
      error: `Minimum withdrawal is ₵${MIN_WITHDRAWAL_AMOUNT.toFixed(2)}`,
    };
  }
  if (trimmedNumber.length < 9) {
    return { data: null, error: "Enter a valid mobile money number" };
  }

  const debitResult = await walletService.debit(
    userId,
    amount,
    "Withdrawal request"
  );
  if (debitResult.error) {
    return { data: null, error: debitResult.error };
  }

  const { data, error } = await supabaseAdminClient
    .from("withdrawal_requests")
    .insert({ user_id: userId, amount, payout_number: trimmedNumber })
    .select()
    .single();

  if (error || !data) {
    // The debit already happened — refund it since the request itself
    // never made it to the table. Never leave a debited-but-unrecorded
    // amount.
    await walletService.credit(
      userId,
      amount,
      "Withdrawal request failed — refunded"
    );
    return {
      data: null,
      error: error?.message ?? "Failed to create withdrawal request",
    };
  }

  return { data: mapWithdrawalRequestRow(data), error: null };
}

async function listForUser(
  userId: string
): Promise<ApiResponse<WithdrawalRequestRecord[]>> {
  const { data, error } = await supabaseAdminClient
    .from("withdrawal_requests")
    .select()
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return { data: null, error: error.message };
  return { data: (data ?? []).map(mapWithdrawalRequestRow), error: null };
}

/** Admin-only: every withdrawal request, newest first. */
async function listAll(): Promise<ApiResponse<WithdrawalRequestRecord[]>> {
  const { data, error } = await supabaseAdminClient
    .from("withdrawal_requests")
    .select()
    .order("created_at", { ascending: false });

  if (error) return { data: null, error: error.message };
  return { data: (data ?? []).map(mapWithdrawalRequestRow), error: null };
}

/** Admin-only: approve/mark-paid/reject a request. Rejecting refunds the
 * wallet (the amount was debited at request time); approving/marking paid
 * does not touch the wallet again — the money already left it. */
async function setStatus(
  id: string,
  status: WithdrawalStatus,
  adminNote?: string
): Promise<ApiResponse<WithdrawalRequestRecord>> {
  const existing = await supabaseAdminClient
    .from("withdrawal_requests")
    .select()
    .eq("id", id)
    .maybeSingle();

  if (existing.error) return { data: null, error: existing.error.message };
  if (!existing.data) return { data: null, error: "Withdrawal request not found" };

  if (existing.data.status !== "pending" && existing.data.status !== "approved") {
    return { data: null, error: `This request is already ${existing.data.status}` };
  }

  if (status === "rejected") {
    const refund = await walletService.credit(
      existing.data.user_id,
      existing.data.amount,
      "Withdrawal request rejected — refunded"
    );
    if (refund.error) return { data: null, error: refund.error };
  }

  const { data, error } = await supabaseAdminClient
    .from("withdrawal_requests")
    .update({
      status,
      admin_note: adminNote ?? null,
      processed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    return { data: null, error: error?.message ?? "Failed to update withdrawal request" };
  }
  return { data: mapWithdrawalRequestRow(data), error: null };
}

export const withdrawalsService = {
  createRequest,
  listForUser,
  listAll,
  setStatus,
};
