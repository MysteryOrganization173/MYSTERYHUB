import Link from "next/link";
import { Users, ArrowRight, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/layout";

// ─── Static data ──────────────────────────────────────────────────────────────

const REFERRAL_STATS = [
  { label: "Commission per referral", value: "Up to 5%" },
  { label: "Payment method",          value: "Instant to wallet" },
] as const;

// ─── Section ──────────────────────────────────────────────────────────────────

export function ReferralSection() {
  return (
    <Section size="lg" aria-labelledby="referral-heading">
      {/* Full-bleed styled card inside the Section container */}
      <div className="relative rounded-3xl overflow-hidden border border-brand/20 bg-brand/5 p-8 sm:p-12">

        {/* Ambient glow orbs */}
        <div
          aria-hidden
          className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand/10 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-brand/8 blur-2xl"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-grid-subtle opacity-25"
        />

        {/* Content */}
        <div className="relative flex flex-col lg:flex-row items-center justify-between gap-10">

          {/* Left: copy */}
          <div className="flex flex-col gap-5 text-center lg:text-left items-center lg:items-start max-w-xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/15 border border-brand/25">
              <Users className="h-7 w-7 text-brand" aria-hidden />
            </div>

            <div className="space-y-3">
              <h2
                id="referral-heading"
                className="text-2xl sm:text-3xl font-bold text-foreground"
              >
                Invite Friends.{" "}
                <span className="text-gradient-brand">Earn Rewards.</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Share your unique referral link and earn a commission on every
                order your friends make — forever. No cap on earnings.
              </p>
            </div>

            {/* Stat pills */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              {REFERRAL_STATS.map(({ label, value }) => (
                <div
                  key={label}
                  className="flex flex-col items-center lg:items-start rounded-xl border border-brand/20 bg-brand/8 px-4 py-2.5"
                >
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <span className="text-sm font-bold text-brand">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: CTA */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            <Button
              asChild
              variant="brand"
              size="xl"
              className="rounded-xl gap-2 w-full sm:w-auto"
            >
              <Link href="/referrals">
                <Gift className="h-5 w-5" aria-hidden />
                Start Earning
              </Link>
            </Button>
            <Link
              href="/earn"
              className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-brand"
            >
              Learn about Earn Hub
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
