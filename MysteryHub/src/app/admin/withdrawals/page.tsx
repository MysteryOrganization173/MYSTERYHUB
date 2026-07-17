"use client";

/**
 * /admin/withdrawals — the payout approval queue.
 *
 * Requesting a withdrawal already debits the wallet immediately (see
 * `withdrawalsService.createRequest`), so this page is purely about
 * recording what actually happened next: mark "paid" once the admin has
 * sent the money through a channel outside this codebase (MoMo, bank
 * transfer, etc.), or "reject" to refund the wallet automatically.
 */
import * as React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/services/api";
import { toast } from "@/components/ui/toast";
import { formatGHS, formatDate } from "@/lib/utils";
import type { WithdrawalRequestRecord, WithdrawalStatus } from "@/types/withdrawal";

const STATUS_BADGE: Record<WithdrawalStatus, "brand" | "muted" | "destructive"> = {
  pending: "muted",
  approved: "brand",
  paid: "brand",
  rejected: "destructive",
};

export default function AdminWithdrawalsPage() {
  const [requests, setRequests] = React.useState<WithdrawalRequestRecord[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [busyId, setBusyId] = React.useState<string | null>(null);

  const load = React.useCallback(() => {
    apiClient.get<WithdrawalRequestRecord[]>("/admin/withdrawals").then(({ data, error }) => {
      setRequests(data ?? []);
      setError(error);
    });
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  async function setStatus(id: string, status: WithdrawalStatus) {
    setBusyId(id);
    const { error } = await apiClient.patch(`/admin/withdrawals`, { id, status });
    setBusyId(null);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success(
      status === "paid"
        ? "Marked as paid"
        : status === "rejected"
        ? "Rejected — wallet refunded"
        : "Approved"
    );
    load();
  }

  const pending = (requests ?? []).filter((r) => r.status === "pending" || r.status === "approved");
  const resolved = (requests ?? []).filter((r) => r.status === "paid" || r.status === "rejected");

  return (
    <div className="space-y-8">
      <PageHeader
        badge="Admin"
        title="Withdrawals"
        description="Every request already debited the requester's wallet. Reject to refund automatically; mark paid once you've sent the money through MoMo or bank transfer."
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">
          Awaiting action {pending.length > 0 && `(${pending.length})`}
        </h2>

        {requests && pending.length === 0 && (
          <p className="text-sm text-muted-foreground">Nothing pending — you&apos;re all caught up.</p>
        )}

        {pending.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="border-b border-border bg-muted/30 text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Requested</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Payout number</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {pending.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/20">
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {formatDate(r.createdAt, { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">{formatGHS(r.amount)}</td>
                    <td className="px-4 py-3 font-mono text-xs text-foreground">{r.payoutNumber}</td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_BADGE[r.status]}>{r.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        {r.status === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={busyId === r.id}
                            onClick={() => setStatus(r.id, "approved")}
                          >
                            Approve
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="brand"
                          disabled={busyId === r.id}
                          onClick={() => setStatus(r.id, "paid")}
                        >
                          Mark paid
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          disabled={busyId === r.id}
                          onClick={() => setStatus(r.id, "rejected")}
                        >
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {resolved.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">History</h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[680px] text-sm">
              <thead className="border-b border-border bg-muted/30 text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Requested</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Payout number</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Processed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {resolved.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/20">
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {formatDate(r.createdAt, { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">{formatGHS(r.amount)}</td>
                    <td className="px-4 py-3 font-mono text-xs text-foreground">{r.payoutNumber}</td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_BADGE[r.status]}>{r.status}</Badge>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {r.processedAt
                        ? formatDate(r.processedAt, { month: "short", day: "numeric", year: "numeric" })
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
