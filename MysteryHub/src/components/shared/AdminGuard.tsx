"use client";

/**
 * AdminGuard — client-side UX gate for `/admin/**` pages.
 *
 * IMPORTANT: this is UX only, not the security boundary. This app's
 * Supabase session lives in the browser (localStorage), so there is no
 * server-side middleware that can read it before a page renders (see
 * `src/lib/supabase/serverAuth.ts`'s doc comment for the full
 * rationale). The real security boundary is that every `/api/admin/*`
 * route independently re-verifies the caller via `requireAdmin` — this
 * component just avoids flashing admin UI/making admin API calls for a
 * user who isn't going to be authorized anyway, and redirects them away
 * quickly. See docs/authentication.md.
 *
 * Calls `GET /api/admin/check` (itself just a thin wrapper around
 * `isAdminEmail`) rather than trusting any client-side email list.
 */
import * as React from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { apiClient } from "@/services/api";
import { ROUTES } from "@/constants";

type CheckState = "checking" | "allowed" | "denied";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [state, setState] = React.useState<CheckState>("checking");

  React.useEffect(() => {
    if (isLoading) return;

    if (!user) {
      setState("denied");
      router.replace(ROUTES.signIn);
      return;
    }

    let cancelled = false;
    apiClient.get<{ isAdmin: boolean }>("/admin/check").then(({ data }) => {
      if (cancelled) return;
      if (data?.isAdmin) {
        setState("allowed");
      } else {
        setState("denied");
        router.replace(ROUTES.home);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [user, isLoading, router]);

  if (state !== "allowed") {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
        {state === "denied" ? (
          <>
            <ShieldAlert className="h-8 w-8 text-muted-foreground" aria-hidden />
            <p className="text-sm text-muted-foreground">
              You don&apos;t have access to this page.
            </p>
          </>
        ) : (
          <div
            className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent"
            role="status"
            aria-label="Checking admin access"
          />
        )}
      </div>
    );
  }

  return <>{children}</>;
}
