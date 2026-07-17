import type { Metadata } from "next";
import { History, Wallet, Gift, ShieldCheck } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignInForm } from "@/components/forms/SignInForm";

// ─── SEO ──────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to your Mystery Hub account to track orders, manage your wallet, and check your referral earnings.",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const BENEFITS = [
  {
    icon: History,
    title: "Pick up right where you left off",
    description: "Your order history, saved numbers, and open referrals are all right here.",
  },
  {
    icon: Wallet,
    title: "Check your wallet balance",
    description: "See every credit and debit, and request a withdrawal whenever you're ready.",
  },
  {
    icon: Gift,
    title: "Track your referral earnings",
    description: "See exactly who you've referred and how much you've earned from each order.",
  },
  {
    icon: ShieldCheck,
    title: "Bank-grade authentication",
    description: "Your account is protected by Supabase — we never see or store your password.",
  },
] as const;

export default function SignInPage() {
  return (
    <AuthShell
      eyebrow="Welcome back"
      headline="Sign in to Mystery Hub."
      subheadline="Continue to your orders, wallet balance, and referral earnings."
      benefits={BENEFITS}
    >
      <SignInForm />
    </AuthShell>
  );
}
