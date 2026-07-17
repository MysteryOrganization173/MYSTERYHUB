import type { Metadata } from "next";
import { Users, Link2, Gift, Wallet } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { AuthAwareCTA } from "@/components/shared/AuthAwareCTA";
import { ROUTES } from "@/constants";

export const metadata: Metadata = {
  title: "Referrals",
  description:
    "Refer friends to Mystery Hub and earn a real 5% commission on every order they pay for — credited to your wallet instantly.",
};

const STEPS = [
  {
    icon: Link2,
    title: "1. Get your link",
    description: "Every account gets a unique referral link the moment you sign up — find it on your Referrals dashboard.",
  },
  {
    icon: Users,
    title: "2. Share it",
    description: "Send it to friends. When they sign up through your link, they're linked to your account permanently.",
  },
  {
    icon: Gift,
    title: "3. They pay, you earn",
    description: "Every time a referred customer's order is paid, you earn a flat 5% commission — no cap, no expiry.",
  },
  {
    icon: Wallet,
    title: "4. It lands in your wallet",
    description: "Commissions are credited instantly. Spend them at checkout or request a withdrawal to mobile money.",
  },
] as const;

export default function ReferralsPage() {
  return (
    <PageContainer>
      <PageHeader
        badge="Referral Program"
        title="Refer a friend. Earn 5% on everything they buy."
        description="A real referral program with a real commission — no points, no vague 'rewards', just a flat 5% of every paid order from someone you referred, credited straight to your wallet."
      />

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="card-base rounded-2xl p-6 flex flex-col gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand/20 bg-brand/10 text-brand">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-brand/20 bg-brand/5 p-8 text-center">
        <Users className="h-8 w-8 text-brand" aria-hidden />
        <p className="max-w-md text-sm text-muted-foreground">
          Sign in to grab your referral link and see your commission history, or create a free
          account to get one.
        </p>
        <AuthAwareCTA authedHref={ROUTES.dashboardReferrals} authedLabel="Go to your referrals" />
      </div>
    </PageContainer>
  );
}
