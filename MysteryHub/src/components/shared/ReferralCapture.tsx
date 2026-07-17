"use client";

/**
 * ReferralCapture — reads `?ref=<code>` from the URL on any page and
 * stores it in a first-party cookie for 30 days, so a referral link can
 * be shared to the homepage, a specific service page, anywhere — and
 * still be attributed if the visitor signs up later (not necessarily on
 * the same page load). Mounted once, globally, in `src/app/layout.tsx`.
 *
 * `getReferralCookie()` is the read-side helper `SignUpForm` uses to pass
 * the code through to `authService.signUp` (-> Supabase Auth
 * `user_metadata.referral_code` -> the `handle_new_user()` trigger, see
 * supabase/migrations/0003_wallet_referrals_suppliers.sql). Renders
 * nothing — this is a side-effect-only component.
 */
import * as React from "react";
import { useSearchParams } from "next/navigation";
import { COOKIES } from "@/constants";

const REFERRAL_COOKIE_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

export function setReferralCookie(code: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIES.referralCode}=${encodeURIComponent(code)}; max-age=${REFERRAL_COOKIE_MAX_AGE_SECONDS}; path=/; SameSite=Lax`;
}

export function getReferralCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${COOKIES.referralCode}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

export function clearReferralCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIES.referralCode}=; max-age=0; path=/`;
}

function ReferralCaptureInner() {
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref && ref.trim().length > 0) {
      setReferralCookie(ref.trim());
    }
  }, [searchParams]);

  return null;
}

export function ReferralCapture() {
  return (
    <React.Suspense fallback={null}>
      <ReferralCaptureInner />
    </React.Suspense>
  );
}
