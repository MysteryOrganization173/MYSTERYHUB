import type { Metadata } from "next";
import { TrendingUp, Gift, Wallet, ArrowRight } from "lucide-react";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { AuthAwareCTA } from "@/components/shared/AuthAwareCTA";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants";

export const metadata: Metadata = {
  title: "Earn",
  description:
    "The one real way to earn on Mystery Hub today: referral commissions, credited instantly to your wallet.",
};

export default function EarnPage() {
  return (
    <PageContainer>
      <PageHeader
        badge="Earn"
        title="Right now, referrals are how you earn."
        description="We'd rather tell you exactly what's live than promise a rewards system that doesn't exist yet. Today, that's one real, working way to earn: referral commissions."
      />

      <div className="mt-10 rounded-2xl border border-brand/20 bg-brand/5 p-8">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-brand/25 bg-brand/15 text-brand">
              <Gift className="h-6 w-6" aria-hidden />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Referral commissions — 5% flat</h2>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Share your referral link. Every time someone you referred pays for an order, you
                earn 5% of it, credited to your wallet instantly.
              </p>
            </div>
          </div>
          <Link
            href={ROUTES.referrals}
            className="flex shrink-0 items-center gap-1 text-sm font-medium text-brand hover:underline"
          >
            How it works
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-xl border border-dashed border-border p-5">
        <TrendingUp className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
        <div className="flex-1">
          <p className="text-sm text-foreground">More ways to earn are on the roadmap.</p>
          <p className="text-xs text-muted-foreground">
            Task-based rewards and promotions aren&apos;t live yet — we&apos;ll only list them
            here once they actually work.
          </p>
        </div>
        <Badge variant="muted" className="shrink-0">Planned</Badge>
      </div>

      <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center">
        <Wallet className="h-8 w-8 text-brand" aria-hidden />
        <p className="max-w-md text-sm text-muted-foreground">
          Sign in to grab your referral link, or create a free account to get one.
        </p>
        <AuthAwareCTA authedHref={ROUTES.dashboardReferrals} authedLabel="Go to your referrals" />
      </div>
    </PageContainer>
  );
}
