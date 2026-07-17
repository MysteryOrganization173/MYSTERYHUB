/**
 * SuccessBizHub HTTP client — server-only.
 *
 * No public API documentation exists for SuccessBizHub (confirmed by web
 * search during the V1.5 audit — see docs/product-audit.md). This client
 * is written defensively against a reasonable/conventional reseller-API
 * shape (Bearer auth, JSON, `{ data, message }` envelope) and will need
 * correcting once real docs/sandbox access exist. It NEVER fabricates a
 * response on failure — every caller gets a clear `{ data: null, error }`
 * instead, so the catalogue/fulfillment layers above it can fall back to
 * the honest mock path rather than pretending a live call succeeded.
 */
import { serverEnv, isSuccessBizHubConfigured } from "@/config/env";
import type { ApiResponse } from "@/types";

if (typeof window !== "undefined") {
  throw new Error(
    "successBizHub client must never be imported into client-side code."
  );
}

interface RequestOptions {
  method?: "GET" | "POST";
  path: string;
  body?: unknown;
}

export async function successBizHubRequest<T>({
  method = "GET",
  path,
  body,
}: RequestOptions): Promise<ApiResponse<T>> {
  if (!isSuccessBizHubConfigured) {
    return {
      data: null,
      error: "SuccessBizHub is not configured (missing SUCCESSBIZHUB_BASE_URL / SUCCESSBIZHUB_API_KEY).",
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    serverEnv.successBizHubRequestTimeoutMs
  );

  try {
    const res = await fetch(`${serverEnv.successBizHubBaseUrl}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${serverEnv.successBizHubApiKey}`,
        "Content-Type": "application/json",
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      const message =
        (json && typeof json.message === "string" && json.message) ||
        `SuccessBizHub request failed with status ${res.status}`;
      return { data: null, error: message };
    }

    return { data: (json?.data ?? json) as T, error: null };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "SuccessBizHub request failed";
    return { data: null, error: message };
  } finally {
    clearTimeout(timeout);
  }
}
