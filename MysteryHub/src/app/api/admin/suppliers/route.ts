/**
 * GET/PATCH /api/admin/suppliers — supplier routing settings.
 * Admin-only. See src/services/suppliers/supplierRegistry.ts.
 *
 * GET also returns each supplier's `configured` flag (env vars present),
 * separate from the DB `enabled` flag — the admin UI needs to show both,
 * since enabling an unconfigured supplier is allowed (fails safe, falls
 * through to the next one) but should be visibly flagged.
 */
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/serverAuth";
import { supplierSettingsService } from "@/services/suppliers/supplierSettingsService";
import {
  supplierRegistry,
  invalidateSupplierSettingsCache,
} from "@/services/suppliers/supplierRegistry";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [settingsResult, health] = await Promise.all([
    supplierSettingsService.listSettings(),
    supplierRegistry.listHealth(),
  ]);

  if (settingsResult.error) {
    return NextResponse.json({ error: settingsResult.error }, { status: 500 });
  }

  const settings = (settingsResult.data ?? []).map((setting) => ({
    ...setting,
    configured: health.find((h) => h.supplierKey === setting.supplierKey)?.configured ?? false,
  }));

  return NextResponse.json(settings);
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: { supplierKey?: string; enabled?: boolean; priority?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body?.supplierKey !== "string") {
    return NextResponse.json({ error: "supplierKey is required" }, { status: 400 });
  }

  const result = await supplierSettingsService.updateSetting(body.supplierKey, {
    ...(typeof body.enabled === "boolean" ? { enabled: body.enabled } : {}),
    ...(typeof body.priority === "number" ? { priority: body.priority } : {}),
  });

  if (result.error || !result.data) {
    return NextResponse.json({ error: result.error ?? "Update failed" }, { status: 400 });
  }

  invalidateSupplierSettingsCache();
  return NextResponse.json(result.data);
}
