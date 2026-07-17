/**
 * Server-side request identity — V1.5 Product Transformation.
 *
 * Architectural note (read before touching this file): this codebase's
 * Supabase session lives in the BROWSER (localStorage via the default
 * `@supabase/supabase-js` client — see `src/lib/supabase/client.ts`'s
 * doc comment), not in a cookie. That was a deliberate earlier decision
 * ("adding [cookie-based sessions] now would be an unrequested
 * dependency"). It also means Next.js Route Handlers/Server Components
 * cannot read the session from `cookies()` — there is nothing to read.
 *
 * Rather than force a larger, riskier migration to `@supabase/ssr` cookie
 * sessions just for this phase, every privileged API route (wallet,
 * withdrawals, admin/*) instead requires the client to send the current
 * Supabase access token as a normal `Authorization: Bearer <token>`
 * header (see `src/services/api.ts`'s `apiClient`, which attaches this
 * automatically from the browser session). `getUserFromRequest` verifies
 * that JWT directly against Supabase Auth — the same trust boundary a
 * cookie would provide, just carried over a header instead. This keeps
 * every admin/wallet route's authorization check server-side and
 * independent of anything the client renders, which is the actual
 * security requirement (see docs/authentication.md).
 *
 * This file NEVER uses the service-role key — it only verifies who the
 * caller is, using the public anon key, the same way any client-side
 * `supabase.auth.getUser()` call would. Callers that need privileged data
 * use `supabaseAdminClient` (src/lib/supabase/admin.ts) *after* confirming
 * identity via this file.
 */
import { createClient } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import { env, isSupabaseConfigured } from "@/config/env";
import { isAdminEmail } from "@/config/env";
import type { Database } from "@/types/database";

export interface RequestUser {
  id: string;
  email: string | null;
}

function extractBearerToken(req: NextRequest): string | null {
  const header = req.headers.get("authorization");
  if (!header?.toLowerCase().startsWith("bearer ")) return null;
  const token = header.slice(7).trim();
  return token.length > 0 ? token : null;
}

/** Resolves the signed-in user from the request's `Authorization` header,
 * or `null` if there is none / it's invalid / Supabase isn't configured.
 * Never throws. */
export async function getUserFromRequest(
  req: NextRequest
): Promise<RequestUser | null> {
  if (!isSupabaseConfigured) return null;

  const token = extractBearerToken(req);
  if (!token) return null;

  const supabase = createClient<Database>(env.supabaseUrl, env.supabaseAnonKey);
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) return null;
  return { id: data.user.id, email: data.user.email ?? null };
}

/** Convenience wrapper for admin-only routes: resolves the user AND checks
 * the `ADMIN_EMAILS` allowlist in one call. Every admin API route calls
 * this independently — never trust that a page-level client guard already
 * ran (see docs/authentication.md). */
export async function requireAdmin(
  req: NextRequest
): Promise<RequestUser | null> {
  const user = await getUserFromRequest(req);
  if (!user || !isAdminEmail(user.email)) return null;
  return user;
}
