"use client";

/**
 * useIsAdmin — client-side UX hint only, mirroring `AdminGuard`'s check.
 *
 * Calls `GET /api/admin/check` (which itself just wraps `isAdminEmail`)
 * rather than trusting any client-side email list. Used to conditionally
 * show the "Admin Console" link in the Navbar — genuinely conditional on
 * the same server check already used for gating `/admin/**`, not a
 * hardcoded public link. See src/components/shared/AdminGuard.tsx.
 */
import * as React from "react";
import { useAuth } from "@/providers/AuthProvider";
import { apiClient } from "@/services/api";

export function useIsAdmin(): boolean {
  const { user, isLoading } = useAuth();
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    if (isLoading || !user) {
      setIsAdmin(false);
      return;
    }

    let cancelled = false;
    apiClient.get<{ isAdmin: boolean }>("/admin/check").then(({ data }) => {
      if (!cancelled) setIsAdmin(Boolean(data?.isAdmin));
    });

    return () => {
      cancelled = true;
    };
  }, [user, isLoading]);

  return isAdmin;
}
