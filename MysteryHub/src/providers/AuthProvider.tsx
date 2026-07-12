"use client";

/**
 * AuthProvider — Supabase Auth session context.
 *
 * Reads/subscribes via `authService` only — never calls the Supabase SDK
 * directly, per the architecture rule that components (and providers)
 * consume the service layer, not the SDK. Exposes the current user, a
 * loading flag, and a `signOut()` action through `useAuth()`.
 *
 * Added to the composition root in `src/providers/AppProviders.tsx`,
 * innermost relative to `ThemeProvider`/`TooltipProvider` (order does not
 * matter functionally here, but keeping it close to `children` avoids
 * re-rendering unrelated providers on auth state changes).
 */
import * as React from "react";
import { authService } from "@/services/auth";
import type { AuthUser } from "@/types/auth";

interface AuthContextValue {
  /** Null when signed out. Undefined-vs-null is collapsed to null on
   * purpose — components only need to check truthiness. */
  user: AuthUser | null;
  /** True until the initial session check resolves. Use this to avoid a
   * flash of "signed out" UI before Supabase reports the real state. */
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;

    authService.getCurrentUser().then(({ data }) => {
      if (!isMounted) return;
      setUser(data ?? null);
      setIsLoading(false);
    });

    const unsubscribe = authService.onAuthStateChange((nextUser) => {
      if (!isMounted) return;
      setUser(nextUser);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const signOut = React.useCallback(async () => {
    await authService.signOut();
    setUser(null);
  }, []);

  const value = React.useMemo<AuthContextValue>(
    () => ({ user, isLoading, signOut }),
    [user, isLoading, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Reads the current auth session. Must be called from within
 * `<AuthProvider>` (already true for every page, via `AppProviders`). */
export function useAuth(): AuthContextValue {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
