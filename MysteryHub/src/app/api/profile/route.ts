/**
 * GET/PATCH /api/profile — the signed-in user's own profile.
 *
 * GET returns the full `Profile` (full name, wallet balance, referral
 * code). PATCH updates `full_name` — the only self-editable field today
 * (see `profilesService.updateFullName`'s doc comment for why nothing
 * else is offered yet). Both require a signed-in user.
 */
import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/supabase/serverAuth";
import { profilesService } from "@/services/profiles";

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const result = await profilesService.getProfile(user.id);
  if (result.error || !result.data) {
    return NextResponse.json({ error: result.error ?? "Profile not found" }, { status: 404 });
  }
  return NextResponse.json(result.data);
}

export async function PATCH(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  let body: { fullName?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body?.fullName !== "string") {
    return NextResponse.json({ error: "fullName is required" }, { status: 400 });
  }

  const result = await profilesService.updateFullName(user.id, body.fullName);
  if (result.error || !result.data) {
    return NextResponse.json({ error: result.error ?? "Update failed" }, { status: 400 });
  }
  return NextResponse.json(result.data);
}
