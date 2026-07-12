"use client";

/**
 * ProtectedRoute — foundation for gating a page behind an authenticated
 * session.
 *
 * Not consumed by any page yet — no dashboard/wallet/account page exists
 * in Phase 1B. It exists so those future pages can wrap their content in
 * `<ProtectedRoute>` without new auth plumbing when they're built:
 *
 *   export default function DashboardPage() {
 *     return (
 *       <ProtectedRoute>
 *         ...dashboard content...
 *       </ProtectedRoute>
 *     );
 *   }
 *
 * Reads session state via `useAuth()` (never calls Supabase directly).
 */
import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { ROUTES } from "@/constants";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Where to send unauthenticated users. Defaults to the sign-in page. */
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  redirectTo = ROUTES.signIn,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.replace(redirectTo);
    }
  }, [isLoading, user, router, redirectTo]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent"
          role="status"
          aria-label="Checking session"
        />
      </div>
    );
  }

  return <>{children}</>;
}
