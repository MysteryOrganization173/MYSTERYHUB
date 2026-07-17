"use client";

/**
 * /dashboard/referrals — the user's real referral link, stats, and
 * commission history. Backed by `GET /api/referrals`
 * (`referralsService.getReferralStats`).
 */
import * as React from "react";
import { Gift, Users, Banknote, Copy, Check, Share2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatGrid } from "@/components/layout/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/services/api";
import { toast } from "@/components/ui/toast";
import { formatGHS, formatDate, absoluteUrl } from "@/lib/utils";
import type { ReferralStats } from "@/types/referral";

export default function DashboardReferralsPage() {
  const [stats, setStats] = React.useState<ReferralStats | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    apiClient.get<ReferralStats>("/referrals").then(({ data, error }) => {
      setStats(data ?? null);
      setError(error);
    });
  }, []);

  const referralLink = stats?.referralCode
    ? absoluteUrl(`/?ref=${stats.referralCode}`)
    : null;

  async function copyLink() {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success("Referral link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy — copy the link manually");
    }
  }

  async function shareLink() {
    if (!referralLink) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Mystery Hub",
          text: "Sign up on Mystery Hub with my referral link — everything digital, one trusted place.",
          url: referralLink,
        });
      } catch {
        // User cancelled the share sheet — not an error.
      }
    } else {
      copyLink();
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        badge="My Account"
        title="Referrals"
        description="Share your link. When someone you referred pays for an order, you earn a 5% commission — credited to your wallet automatically."
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      {stats && (
        <>
          <StatGrid
            stats={[
              {
                label: "People Referred",
                value: String(stats.referredCount),
                icon: <Users className="h-4 w-4" />,
              },
              {
                label: "Total Earned",
                value: formatGHS(stats.totalEarned),
                icon: <Banknote className="h-4 w-4" />,
              },
              {
                label: "Commission Rate",
                value: "5%",
                icon: <Gift className="h-4 w-4" />,
              },
            ]}
          />

          <Card>
            <CardContent className="space-y-4 p-6">
              <h2 className="text-sm font-semibold text-foreground">Your referral link</h2>
              {referralLink ? (
                <>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input readOnly value={referralLink} className="font-mono text-xs" />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="shrink-0 gap-1.5"
                        onClick={copyLink}
                      >
                        {copied ? (
                          <Check className="h-3.5 w-3.5" aria-hidden />
                        ) : (
                          <Copy className="h-3.5 w-3.5" aria-hidden />
                        )}
                        Copy
                      </Button>
                      <Button
                        type="button"
                        variant="brand"
                        className="shrink-0 gap-1.5"
                        onClick={shareLink}
                      >
                        <Share2 className="h-3.5 w-3.5" aria-hidden />
                        Share
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Anyone who signs up through this link is linked to your account. You earn a
                    commission on every order they pay for.
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Your referral code is still being generated — refresh in a moment.
                </p>
              )}
            </CardContent>
          </Card>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-foreground">Commission history</h2>

            {stats.commissions.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-sm text-muted-foreground">
                  No commissions yet — they&apos;ll appear here as soon as someone you referred
                  pays for their first order.
                </CardContent>
              </Card>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[560px] text-sm">
                  <thead className="border-b border-border bg-muted/30 text-left text-xs text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-medium">Order reference</th>
                      <th className="px-4 py-3 font-medium">Order amount</th>
                      <th className="px-4 py-3 font-medium">Commission</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {stats.commissions.map((c) => (
                      <tr key={c.id} className="hover:bg-muted/20">
                        <td className="px-4 py-3 font-mono text-xs text-foreground">
                          {c.orderReference}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{formatGHS(c.orderAmount)}</td>
                        <td className="px-4 py-3 font-medium text-brand">
                          +{formatGHS(c.commissionAmount)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                          {formatDate(c.createdAt, { month: "short", day: "numeric", year: "numeric" })}
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
