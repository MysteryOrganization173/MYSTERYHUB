/**
 * Auth Service — V1 Phase 1B.
 *
 * Client-safe: imports the anon-key browser client
 * (`src/lib/supabase/client.ts`), never the server-only admin client.
 * Wraps Supabase Auth so components/forms never call the Supabase SDK
 * directly — per the architecture rule that services own all external
 * calls. Every method returns the same `ApiResponse<T>` shape used
 * elsewhere (`apiClient`, `ordersService`) and never throws.
 *
 * Session persistence uses Supabase's default browser storage
 * (localStorage). A cookie-based session (via `@supabase/ssr`) is
 * deliberately not wired up yet — it is unnecessary until a feature needs
 * the session on the server (e.g. a server-rendered account page), and
 * adding it now would be an unrequested dependency.
 *
 * Consumers: `src/providers/AuthProvider.tsx`,
 * `src/components/forms/SignInForm.tsx`, `src/components/forms/SignUpForm.tsx`.
 *
 * Startup resilience: `supabaseBrowserClient` is `null` whenever Supabase
 * env vars aren't configured (see `src/lib/supabase/client.ts`). Every
 * method below checks for that up front and returns a friendly
 * `ApiResponse` error rather than throwing, so sign-in/sign-up forms show
 * a normal inline error instead of crashing, and read-only methods
 * (`getCurrentUser`, `onAuthStateChange`) resolve to "no session" instead
 * of erroring — auth is simply disabled, not broken.
 */
import { supabaseBrowserClient } from "@/lib/supabase/client";
import {
  mapSupabaseUser,
  type AuthUser,
  type SignInCredentials,
  type SignUpCredentials,
} from "@/types/auth";
import type { ApiResponse } from "@/types";

const AUTH_NOT_CONFIGURED_ERROR =
  "Sign in is temporarily unavailable. Please try again later.";

export const authService = {
  /** Creates a new Supabase Auth user. Depending on the project's email
   * confirmation setting, the returned user may be unconfirmed — the
   * caller (SignUpForm) surfaces that via the success message, there is
   * no separate "confirm email" screen in this phase. */
  async signUp({
    name,
    email,
    password,
  }: SignUpCredentials): Promise<ApiResponse<AuthUser>> {
    if (!supabaseBrowserClient) {
      return { data: null, error: AUTH_NOT_CONFIGURED_ERROR };
    }
    const { data, error } = await supabaseBrowserClient.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });

    if (error) {
      return { data: null, error: error.message };
    }
    if (!data.user) {
      return { data: null, error: "Sign up did not return a user." };
    }
    return { data: mapSupabaseUser(data.user), error: null };
  },

  async signIn({
    email,
    password,
  }: SignInCredentials): Promise<ApiResponse<AuthUser>> {
    if (!supabaseBrowserClient) {
      return { data: null, error: AUTH_NOT_CONFIGURED_ERROR };
    }
    const { data, error } =
      await supabaseBrowserClient.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      return { data: null, error: error.message };
    }
    if (!data.user) {
      return { data: null, error: "Sign in did not return a user." };
    }
    return { data: mapSupabaseUser(data.user), error: null };
  },

  async signOut(): Promise<ApiResponse<null>> {
    if (!supabaseBrowserClient) {
      // Nothing to sign out of when auth is disabled — not an error.
      return { data: null, error: null };
    }
    const { error } = await supabaseBrowserClient.auth.signOut();
    if (error) {
      return { data: null, error: error.message };
    }
    return { data: null, error: null };
  },

  /** Reads the current session (if any) and projects it to `AuthUser`.
   * Returns `{ data: null, error: null }` when there is simply no session —
   * that is not treated as an error. Also returns `{ data: null, error: null }`
   * when auth is disabled (Supabase not configured), so callers like
   * `AuthProvider` naturally resolve to a signed-out state instead of
   * erroring. */
  async getCurrentUser(): Promise<ApiResponse<AuthUser | null>> {
    if (!supabaseBrowserClient) {
      return { data: null, error: null };
    }
    const { data, error } = await supabaseBrowserClient.auth.getSession();
    if (error) {
      return { data: null, error: error.message };
    }
    const user = data.session?.user;
    return { data: user ? mapSupabaseUser(user) : null, error: null };
  },

  /** Subscribes to Supabase auth state changes (sign in/out/token refresh).
   * Returns an unsubscribe function. Intended caller: `AuthProvider` only —
   * everything else should read state via `useAuth()`. When auth is
   * disabled, returns a no-op unsubscribe and never invokes `callback` —
   * there is nothing to subscribe to. */
  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    if (!supabaseBrowserClient) {
      return () => {};
    }
    const { data } = supabaseBrowserClient.auth.onAuthStateChange(
      (_event, session) => {
        callback(session?.user ? mapSupabaseUser(session.user) : null);
      }
    );
    return () => data.subscription.unsubscribe();
  },
};
