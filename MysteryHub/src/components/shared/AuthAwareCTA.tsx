"use client";

/**
 * AuthAwareCTA — swaps between "sign up / sign in" and "go to your
 * account" CTAs depending on session state, for public marketing pages
 * (`/wallet`, `/earn`, `/referrals`) that describe a real, authenticated
 * feature. Avoids sending a signed-in visitor back through sign-up.
 */
import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import { ROUTES } from "@/constants";

interface AuthAwareCTAProps {
  /** Where a signed-in user should be sent, e.g. ROUTES.dashboardWallet */
  authedHref: string;
  authedLabel: string;
  signedOutLabel?: string;
}

export function AuthAwareCTA({
  authedHref,
  authedLabel,
  signedOutLabel = "Create your free account",
}: AuthAwareCTAProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Button variant="brand" size="xl" className="rounded-xl gap-2" disabled loading />;
  }

  if (user) {
    return (
      <Button asChild variant="brand" size="xl" className="rounded-xl gap-2">
        <Link href={authedHref}>
          {authedLabel}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </Button>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row">
      <Button asChild variant="brand" size="xl" className="rounded-xl gap-2 w-full sm:w-auto">
        <Link href={ROUTES.signUp}>
          {signedOutLabel}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </Button>
      <Link
        href={ROUTES.signIn}
        className="text-sm font-medium text-muted-foreground hover:text-brand"
      >
        Already have an account? Sign in
      </Link>
    </div>
  );
}
