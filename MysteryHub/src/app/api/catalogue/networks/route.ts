/**
 * GET /api/catalogue/networks — server-side catalogue read.
 *
 * Exists so `src/services/catalogue/catalogueService.ts` (called directly
 * from client components like `BuyFlow.tsx`) never needs a supplier
 * API key in the browser bundle — see
 * `src/services/catalogue/apiCatalogueSource.ts`. This route is the only
 * thing that touches `supplierCatalogueService`/`supplierRegistry`.
 */
import { NextResponse } from "next/server";
import { supplierCatalogueService } from "@/services/catalogue/supplierCatalogueService";

export async function GET() {
  const networks = await supplierCatalogueService.fetchNetworks();
  return NextResponse.json(networks);
}
