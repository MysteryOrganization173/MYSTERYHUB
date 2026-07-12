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
 */
import { supabaseBrowserClient } from "@/lib/supabase/client";
import {
  mapSupabaseUser,
  type AuthUser,
  type SignInCredentials,
  type SignUpCredentials,
} from "@/types/auth";
import type { ApiResponse } from "@/types";

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
    const { error } = await supabaseBrowserClient.auth.signOut();
    if (error) {
      return { data: null, error: error.message };
    }
    return { data: null, error: null };
  },

  /** Reads the current session (if any) and projects it to `AuthUser`.
   * Returns `{ data: null, error: null }` when there is simply no session —
   * that is not treated as an error. */
  async getCurrentUser(): Promise<ApiResponse<AuthUser | null>> {
    const { data, error } = await supabaseBrowserClient.auth.getSession();
    if (error) {
      return { data: null, error: error.message };
    }
    const user = data.session?.user;
    return { data: user ? mapSupabaseUser(user) : null, error: null };
  },

  /** Subscribes to Supabase auth state changes (sign in/out/token refresh).
   * Returns an unsubscribe function. Intended caller: `AuthProvider` only —
   * everything else should read state via `useAuth()`. */
  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    const { data } = supabaseBrowserClient.auth.onAuthStateChange(
      (_event, session) => {
        callback(session?.user ? mapSupabaseUser(session.user) : null);
      }
    );
    return () => data.subscription.unsubscribe();
  },
};
