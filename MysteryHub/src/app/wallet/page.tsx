import type { Metadata } from "next";
import { Wallet, ArrowDownCircle, Gift, ShieldCheck, Banknote } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { AuthAwareCTA } from "@/components/shared/AuthAwareCTA";
import { ROUTES } from "@/constants";

export const metadata: Metadata = {
  title: "Wallet",
  description:
    "Your Mystery Hub wallet: get paid instantly for referral commissions, pay for orders straight from your balance, and request withdrawals anytime.",
};

const HOW_IT_WORKS = [
  {
    icon: Gift,
    title: "You get credited automatically",
    description: "Referral commissions land in your wallet the moment a referred customer's order is paid — no manual claiming.",
  },
  {
    icon: ArrowDownCircle,
    title: "Pay for orders from your balance",
    description: "At checkout, choose \"Pay with Wallet\" to cover the full order amount instantly — no card, no MoMo prompt.",
  },
  {
    icon: Banknote,
    title: "Withdraw to mobile money",
    description: "Request a withdrawal any time. Your balance is held immediately and paid out once an admin approves it.",
  },
  {
    icon: ShieldCheck,
    title: "Every transaction is logged",
    description: "Every credit and debit — commissions, payments, withdrawals — is recorded in your transaction history.",
  },
] as const;

export default function WalletPage() {
  return (
    <PageContainer>
      <PageHeader
        badge="Wallet"
        title="A real balance you can pay with and get paid into."
        description="No hidden points, no fake balance — every cedi in your wallet came from a real referral commission or was topped up by you, and can be spent at checkout or withdrawn."
      />

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {HOW_IT_WORKS.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="card-base rounded-2xl p-6 flex flex-col gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand/20 bg-brand/10 text-brand">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-brand/20 bg-brand/5 p-8 text-center">
        <Wallet className="h-8 w-8 text-brand" aria-hidden />
        <p className="max-w-md text-sm text-muted-foreground">
          Sign in to see your balance and transaction history, or create a free account to start
          earning from referrals.
        </p>
        <AuthAwareCTA authedHref={ROUTES.dashboardWallet} authedLabel="Go to your wallet" />
      </div>
    </PageContainer>
  );
}
