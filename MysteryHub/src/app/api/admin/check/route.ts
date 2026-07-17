/**
 * GET /api/admin/check — "am I an admin?" for the current session.
 *
 * Used by `AdminGuard` (client-side UX gate) and the Navbar's conditional
 * "Admin Console" link. This is a UX convenience only — it is NOT the
 * security boundary. Every route under `/api/admin/*` independently
 * re-verifies the caller via `requireAdmin` (see
 * `src/lib/supabase/serverAuth.ts`); a client that never calls this route
 * still cannot read/write admin data without a valid admin session token.
 * See docs/authentication.md.
 */
import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/supabase/serverAuth";
import { isAdminEmail } from "@/config/env";

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  return NextResponse.json({ isAdmin: isAdminEmail(user?.email) });
}
