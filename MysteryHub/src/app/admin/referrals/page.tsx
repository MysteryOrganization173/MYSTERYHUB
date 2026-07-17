"use client";

/**
 * /admin/referrals — platform-wide referral analytics.
 *
 * This replaces the old `/admin/agents` placeholder (see
 * docs/product-audit.md) with the real thing: total commissions paid,
 * how many commission events fired, the top referrers by earnings, and
 * how much of that is currently sitting in pending withdrawal requests.
 */
import * as React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatGrid } from "@/components/layout/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { apiClient } from "@/services/api";
import { formatGHS } from "@/lib/utils";
import { Gift, Users, Banknote, Trophy } from "lucide-react";

interface TopReferrer {
  referrerId: string;
  referrerEmail: string;
  referredCount: number;
  totalEarned: number;
}

interface AdminReferralAnalytics {
  totalCommissionsPaid: number;
  totalCommissionCount: number;
  topReferrers: TopReferrer[];
  pendingWithdrawalCount: number;
  pendingWithdrawalAmount: number;
}

export default function AdminReferralsPage() {
  const [analytics, setAnalytics] = React.useState<AdminReferralAnalytics | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    apiClient.get<AdminReferralAnalytics>("/admin/referrals").then(({ data, error }) => {
      setAnalytics(data ?? null);
      setError(error);
    });
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        badge="Admin"
        title="Referrals"
        description="Commission rate is a flat 5% of order value, credited to the referrer's wallet automatically when a referred customer's order is paid."
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      {analytics && (
        <>
          <StatGrid
            stats={[
              {
                label: "Total Commissions Paid",
                value: formatGHS(analytics.totalCommissionsPaid),
                icon: <Banknote className="h-4 w-4" />,
              },
              {
                label: "Commission Events",
                value: String(analytics.totalCommissionCount),
                icon: <Gift className="h-4 w-4" />,
              },
              {
                label: "Pending Withdrawals",
                value: String(analytics.pendingWithdrawalCount),
                icon: <Users className="h-4 w-4" />,
              },
              {
                label: "Pending Withdrawal Amount",
                value: formatGHS(analytics.pendingWithdrawalAmount),
                icon: <Banknote className="h-4 w-4" />,
              },
            ]}
          />

          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Trophy className="h-4 w-4 text-brand" aria-hidden />
              Top referrers
            </h2>

            {analytics.topReferrers.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-sm text-muted-foreground">
                  No referral commissions have been earned yet. They&apos;ll show up here as soon as a
                  referred customer&apos;s first order is paid.
                </CardContent>
              </Card>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[560px] text-sm">
                  <thead className="border-b border-border bg-muted/30 text-left text-xs text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-medium">Referrer</th>
                      <th className="px-4 py-3 font-medium">People referred</th>
                      <th className="px-4 py-3 font-medium">Total earned</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {analytics.topReferrers.map((r, i) => (
                      <tr key={r.referrerId} className="hover:bg-muted/20">
                        <td className="px-4 py-3 text-foreground">
                          <span className="mr-2 text-xs text-muted-foreground">#{i + 1}</span>
                          {r.referrerEmail}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{r.referredCount}</td>
                        <td className="px-4 py-3 font-medium text-foreground">
                          {formatGHS(r.totalEarned)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
