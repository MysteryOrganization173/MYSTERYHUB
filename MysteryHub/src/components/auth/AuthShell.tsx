import type { ReactNode } from "react";
import { ShieldCheck, type LucideIcon } from "lucide-react";
import { BrandLogo } from "@/components/brand";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Benefit {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface AuthShellProps {
  /** Small uppercase label above the headline, e.g. "Create your account" */
  eyebrow: string;
  headline: string;
  subheadline: string;
  benefits: readonly Benefit[];
  /** The form itself (SignUpForm / SignInForm) */
  children: ReactNode;
  /** Rendered above the form card — e.g. a referral welcome banner */
  banner?: ReactNode;
}

/**
 * AuthShell — shared two-column layout for /sign-up and /sign-in.
 *
 * Left column sells the *reason* to have an account (all backed by real,
 * working features as of V1.5 — see docs/product-audit.md): order
 * history, a real wallet, real referral commissions, faster repeat
 * checkout. Right column is the actual form. Collapses to a single
 * column on mobile, with the benefits panel shown first so the value
 * proposition still lands before the form.
 */
export function AuthShell({
  eyebrow,
  headline,
  subheadline,
  benefits,
  children,
  banner,
}: AuthShellProps) {
  return (
    <div className="container-padded py-10 md:py-14">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        {/* ── Left: value proposition ── */}
        <div className="order-2 space-y-8 lg:order-1">
          <div className="space-y-3">
            <BrandLogo href="/" size="md" className="lg:hidden" />
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">
              {eyebrow}
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {headline}
            </h1>
            <p className="max-w-md text-base text-muted-foreground">
              {subheadline}
            </p>
          </div>

          <ul className="space-y-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <li key={benefit.title} className="flex items-start gap-3.5">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-brand/25 bg-brand/10 text-brand">
                    <Icon className="h-4 w-4" aria-hidden />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{benefit.title}</p>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-secondary/30 px-3.5 py-2.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 shrink-0 text-brand" aria-hidden />
            <span>
              Authentication is handled by Supabase. We never store your card details —
              payments go straight to Paystack.
            </span>
          </div>
        </div>

        {/* ── Right: form ── */}
        <div className="order-1 w-full lg:order-2">
          <div className="mx-auto w-full max-w-md space-y-4">
            <BrandLogo href="/" size="md" className="mx-auto hidden lg:flex" />
            {banner}
            <Card className={cn("border-border/60")}>
              <CardContent className="p-6 sm:p-8">{children}</CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}