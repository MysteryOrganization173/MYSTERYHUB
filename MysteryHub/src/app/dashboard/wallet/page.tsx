"use client";

/**
 * /dashboard/wallet — real balance, real ledger, real withdrawal request.
 *
 * Backed by `GET /api/wallet` (balance + transactions) and
 * `GET/POST /api/wallet/withdraw`. See `src/services/wallet.ts` and
 * `src/services/withdrawals.ts` — every credit/debit here already
 * happened server-side; this page only reads and requests.
 */
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Wallet, ArrowDownCircle, ArrowUpCircle, Banknote } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatGrid } from "@/components/layout/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandImage } from "@/components/shared/BrandImage";
import { apiClient } from "@/services/api";
import { toast } from "@/components/ui/toast";
import { formatGHS, formatDate } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import { UTILITY_IMAGES } from "@/config/images";
import type { WalletTransactionRecord } from "@/types/wallet";
import type { WithdrawalRequestRecord, WithdrawalStatus } from "@/types/withdrawal";

const MIN_WITHDRAWAL_AMOUNT = 10;

const withdrawSchema = z.object({
  amount: z.coerce
    .number({ invalid_type_error: "Enter an amount" })
    .min(MIN_WITHDRAWAL_AMOUNT, `Minimum withdrawal is ₵${MIN_WITHDRAWAL_AMOUNT.toFixed(2)}`),
  payoutNumber: z
    .string()
    .min(9, "Enter a valid mobile money number")
    .max(20, "Enter a valid mobile money number"),
});
type WithdrawInput = z.infer<typeof withdrawSchema>;

const STATUS_BADGE: Record<WithdrawalStatus, "brand" | "muted" | "destructive"> = {
  pending: "muted",
  approved: "brand",
  paid: "brand",
  rejected: "destructive",
};

export default function DashboardWalletPage() {
  const { profile, refreshProfile } = useAuth();
  const [transactions, setTransactions] = React.useState<WalletTransactionRecord[] | null>(null);
  const [withdrawals, setWithdrawals] = React.useState<WithdrawalRequestRecord[] | null>(null);

  const loadWallet = React.useCallback(() => {
    apiClient
      .get<{ balance: number; transactions: WalletTransactionRecord[] }>("/wallet")
      .then(({ data }) => setTransactions(data?.transactions ?? []));
    apiClient
      .get<WithdrawalRequestRecord[]>("/wallet/withdraw")
      .then(({ data }) => setWithdrawals(data ?? []));
  }, []);

  React.useEffect(() => {
    loadWallet();
  }, [loadWallet]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WithdrawInput>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: { amount: undefined, payoutNumber: "" },
  });

  async function onSubmit(values: WithdrawInput) {
    const { error } = await apiClient.post("/wallet/withdraw", values);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success("Withdrawal requested — an admin will process it shortly.");
    reset();
    await Promise.all([refreshProfile(), Promise.resolve(loadWallet())]);
  }

  const pendingWithdrawals = (withdrawals ?? []).filter(
    (w) => w.status === "pending" || w.status === "approved"
  );

  return (
    <div className="space-y-8">
      <PageHeader
        badge="My Account"
        title="Wallet"
        description="Every credit and debit is recorded here — referral commissions land automatically, and withdrawals are reviewed by an admin before payout."
      />

      <StatGrid
        stats={[
          {
            label: "Available Balance",
            value: formatGHS(profile?.walletBalance ?? 0),
            icon: <Wallet className="h-4 w-4" />,
          },
        ]}
        className="sm:grid-cols-1 lg:grid-cols-1 max-w-xs"
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        {/* Withdrawal request form */}
        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-2">
              <Banknote className="h-4 w-4 text-brand" aria-hidden />
              <h2 className="text-sm font-semibold text-foreground">Request a withdrawal</h2>
            </div>
            <p className="text-xs text-muted-foreground">
              Minimum ₵{MIN_WITHDRAWAL_AMOUNT.toFixed(2)}. Your balance is debited immediately;
              an admin sends the money to your mobile money number and marks the request paid. If
              rejected, the amount is refunded to your wallet automatically.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="field-wrapper">
                <Label htmlFor="withdraw-amount" className="field-label">
                  Amount (₵)
                </Label>
                <Input
                  id="withdraw-amount"
                  type="number"
                  step="0.01"
                  placeholder="50.00"
                  error={Boolean(errors.amount)}
                  {...register("amount")}
                />
                {errors.amount && <p className="field-error">{errors.amount.message}</p>}
              </div>

              <div className="field-wrapper">
                <Label htmlFor="withdraw-number" className="field-label">
                  Mobile money number
                </Label>
                <Input
                  id="withdraw-number"
                  type="tel"
                  placeholder="024XXXXXXX"
                  error={Boolean(errors.payoutNumber)}
                  {...register("payoutNumber")}
                />
                {errors.payoutNumber && (
                  <p className="field-error">{errors.payoutNumber.message}</p>
                )}
              </div>

              <Button type="submit" variant="brand" className="w-full" loading={isSubmitting}>
                Request Withdrawal
              </Button>
            </form>

            {pendingWithdrawals.length > 0 && (
              <div className="space-y-2 border-t border-border/60 pt-4">
                <p className="text-xs font-medium text-muted-foreground">Awaiting processing</p>
                {pendingWithdrawals.map((w) => (
                  <div
                    key={w.id}
                    className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 text-sm"
                  >
                    <span className="text-foreground">{formatGHS(w.amount)}</span>
                    <Badge variant={STATUS_BADGE[w.status]}>{w.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transaction history */}
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 text-sm font-semibold text-foreground">Transaction history</h2>

            {transactions && transactions.length === 0 && (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <BrandImage image={UTILITY_IMAGES.emptyWallet} className="h-24 w-24" />
                <p className="text-sm text-muted-foreground">
                  No transactions yet. Referral commissions and wallet payments will show up here.
                </p>
              </div>
            )}

            {transactions && transactions.length > 0 && (
              <ul className="space-y-3">
                {transactions.map((tx) => (
                  <li key={tx.id} className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      {tx.type === "credit" ? (
                        <ArrowDownCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
                      ) : (
                        <ArrowUpCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                      )}
                      <div>
                        <p className="text-sm text-foreground">{tx.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(tx.createdAt, { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`whitespace-nowrap text-sm font-semibold ${
                        tx.type === "credit" ? "text-brand" : "text-foreground"
                      }`}
                    >
                      {tx.type === "credit" ? "+" : "-"}
                      {formatGHS(tx.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
