import type { Metadata } from "next";
import { History, Wallet, Gift, Zap } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { ReferralWelcomeBanner } from "@/components/auth/ReferralWelcomeBanner";
import { SignUpForm } from "@/components/forms/SignUpForm";

// ─── SEO ──────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Create a free Mystery Hub account to buy internet packages, track orders, earn real referral commissions, and access every digital service in one trusted place.",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const BENEFITS = [
  {
    icon: History,
    title: "Order history, one tap re-order",
    description: "Every bundle, voucher, and registration you've ever bought, saved to your account.",
  },
  {
    icon: Wallet,
    title: "A real wallet",
    description: "Get paid instantly for referrals and pay for orders straight from your balance — no card needed.",
  },
  {
    icon: Gift,
    title: "Earn 5% on every referral",
    description: "Share your link. When someone you referred pays for an order, your wallet is credited automatically.",
  },
  {
    icon: Zap,
    title: "Faster checkout",
    description: "Saved numbers and one account across every service we add next.",
  },
] as const;

export default function SignUpPage() {
  return (
    <AuthShell
      eyebrow="Create your account"
      headline="Keep everything digital in one trusted place."
      subheadline="One Mystery Hub account for order history, a real wallet, and referral earnings — free to create."
      benefits={BENEFITS}
      banner={<ReferralWelcomeBanner />}
    >
      <SignUpForm />
    </AuthShell>
  );
}
