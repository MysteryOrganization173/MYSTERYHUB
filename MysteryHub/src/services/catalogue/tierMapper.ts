/**
 * Catalogue Layer — tier mapper.
 *
 * Normalizes a raw provider tier value into the domain `DataTier`. Falls
 * back to inferring the tier from the network id, matching the behaviour
 * that previously lived inline inside `dataBundlesService`'s `mapBundle`.
 */
import type { DataTier, NetworkId } from "@/types/bundle";

const VALID_TIERS: readonly DataTier[] = ["express", "budget", "standard"];

function isValidTier(value: unknown): value is DataTier {
  return (
    typeof value === "string" &&
    (VALID_TIERS as readonly string[]).includes(value)
  );
}

/** Resolves a `DataTier` for a bundle, trusting the raw value only if it is
 * one of the known tiers; otherwise infers it from the network id. */
export function resolveTier(
  rawTier: unknown,
  networkId: NetworkId
): DataTier {
  if (isValidTier(rawTier)) return rawTier;

  if (networkId.includes("express")) return "express";
  if (networkId.includes("budget")) return "budget";
  return "standard";
}
