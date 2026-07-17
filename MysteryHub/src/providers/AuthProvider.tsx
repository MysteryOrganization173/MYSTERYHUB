"use client";

/**
 * AuthProvider — Supabase Auth session context.
 *
 * Reads/subscribes via `authService` only — never calls the Supabase SDK
 * directly, per the architecture rule that components (and providers)
 * consume the service layer, not the SDK. Exposes the current user, a
 * loading flag, a `signOut()` action, and (V1.5 addition) the user's
 * `profile` — including `walletBalance`/`referralCode` — through
 * `useAuth()`, fetched via `GET /api/profile` (see
 * `src/lib/supabase/serverAuth.ts` for why this is a normal authenticated
 * API call rather than a server-rendered value).
 *
 * Added to the composition root in `src/providers/AppProviders.tsx`,
 * innermost relative to `ThemeProvider`/`TooltipProvider` (order does not
 * matter functionally here, but keeping it close to `children` avoids
 * re-rendering unrelated providers on auth state changes).
 */
import * as React from "react";
import { authService } from "@/services/auth";
import { apiClient } from "@/services/api";
import type { AuthUser } from "@/types/auth";
import type { Profile } from "@/types/profile";

interface AuthContextValue {
  /** Null when signed out. Undefined-vs-null is collapsed to null on
   * purpose — components only need to check truthiness. */
  user: AuthUser | null;
  /** True until the initial session check resolves. Use this to avoid a
   * flash of "signed out" UI before Supabase reports the real state. */
  isLoading: boolean;
  signOut: () => Promise<void>;
  /** Null while signed out or before the first successful fetch. Includes
   * `walletBalance`/`referralCode` — the dashboard/wallet/referrals pages
   * read this instead of re-fetching `/api/profile` themselves whenever a
   * "good enough" cached value is fine; anything money-sensitive (wallet
   * balance shown for a debit/withdraw action) should still call
   * `refreshProfile()` first. */
  profile: Profile | null;
  isProfileLoading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = React.useState(false);

  const refreshProfile = React.useCallback(async () => {
    setIsProfileLoading(true);
    const { data } = await apiClient.get<Profile>("/profile");
    setProfile(data ?? null);
    setIsProfileLoading(false);
  }, []);

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

  React.useEffect(() => {
    if (user) {
      refreshProfile();
    } else {
      setProfile(null);
    }
  }, [user, refreshProfile]);

  const signOut = React.useCallback(async () => {
    await authService.signOut();
    setUser(null);
    setProfile(null);
  }, []);

  const value = React.useMemo<AuthContextValue>(
    () => ({ user, isLoading, signOut, profile, isProfileLoading, refreshProfile }),
    [user, isLoading, signOut, profile, isProfileLoading, refreshProfile]
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
