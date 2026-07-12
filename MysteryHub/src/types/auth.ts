/**
 * Auth domain types — V1 Phase 1B.
 *
 * `AuthUser` is a slimmed-down projection of Supabase's `User` object — only
 * the fields the app actually uses. Components and the `AuthProvider` only
 * ever see `AuthUser`; the raw Supabase `User`/`Session` types stay inside
 * `src/services/auth.ts`.
 *
 * `SignUpCredentials` / `SignInCredentials` are the service-layer input
 * shapes. They are intentionally distinct from the React Hook Form inputs
 * in `src/utils/validators.ts` (`SignUpInput` includes a UI-only
 * `confirmPassword` field that the service never needs).
 */
import type { User } from "@supabase/supabase-js";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string | null;
}

export interface SignUpCredentials {
  name: string;
  email: string;
  password: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export function mapSupabaseUser(user: User): AuthUser {
  return {
    id: user.id,
    email: user.email ?? "",
    fullName:
      typeof user.user_metadata?.full_name === "string"
        ? user.user_metadata.full_name
        : null,
  };
}
