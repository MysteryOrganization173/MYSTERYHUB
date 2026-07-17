/**
 * GET /api/catalogue/bundles/[networkId] — server-side catalogue read.
 * See src/app/api/catalogue/networks/route.ts for why this exists.
 */
import { NextRequest, NextResponse } from "next/server";
import { supplierCatalogueService } from "@/services/catalogue/supplierCatalogueService";
import type { NetworkId } from "@/types/bundle";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ networkId: string }> }
) {
  const { networkId } = await params;

  if (!networkId) {
    return NextResponse.json({ error: "Missing network id" }, { status: 400 });
  }

  try {
    const bundles = await supplierCatalogueService.fetchBundles(
      networkId as NetworkId
    );
    return NextResponse.json(bundles);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load bundles";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
