"use client";

/**
 * ReferralWelcomeBanner — shown on /sign-up when a `mh-ref` cookie is
 * present (set by `ReferralCapture` from a `?ref=CODE` link). Purely a
 * UX nicety; the actual attribution happens server-side in
 * `handle_new_user()` regardless of whether this banner renders. See
 * supabase/migrations/0003_wallet_referrals_suppliers.sql.
 */
import * as React from "react";
import { Gift } from "lucide-react";
import { getReferralCookie } from "@/components/shared/ReferralCapture";

export function ReferralWelcomeBanner() {
  const [code, setCode] = React.useState<string | null>(null);

  React.useEffect(() => {
    setCode(getReferralCookie());
  }, []);

  if (!code) return null;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-brand/25 bg-brand/10 px-4 py-3">
      <Gift className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
      <p className="text-sm text-foreground">
        <span className="font-semibold text-brand">You were invited to Mystery Hub</span>
        {" "}with code <span className="font-mono">{code}</span>. Sign up now to start earning
        together — your friend earns a commission the moment your first order is paid.
      </p>
    </div>
  );
}
