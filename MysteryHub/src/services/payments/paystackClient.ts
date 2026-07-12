/**
 * Paystack API client — server-only.
 *
 * The ONLY file that talks to Paystack's REST API directly. Imports the
 * secret key (`serverEnv.paystackSecretKey`), so — like
 * `src/lib/supabase/admin.ts` — this must never be imported into
 * client-bundled code. The runtime guard below fails loudly if it ever is.
 *
 * Callers: `src/services/payments/paymentService.ts` only. Nothing else
 * should import this file — go through `paymentService` instead so wire
 * shapes stay contained here.
 */
import { serverEnv, isPaystackConfigured } from "@/config/env";
import type { ApiResponse } from "@/types";
import type {
  PaystackInitializeRequestBody,
  PaystackInitializeResponse,
  PaystackVerifyResponse,
} from "@/types/payment";

if (typeof window !== "undefined") {
  throw new Error("paystackClient must never be imported into client-side code.");
}

const PAYSTACK_BASE_URL = "https://api.paystack.co";

async function paystackRequest<T>(
  path: string,
  init: RequestInit
): Promise<ApiResponse<T>> {
  if (!isPaystackConfigured) {
    return {
      data: null,
      error: "Paystack is not configured (missing PAYSTACK_SECRET_KEY).",
    };
  }

  try {
    const res = await fetch(`${PAYSTACK_BASE_URL}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${serverEnv.paystackSecretKey}`,
        "Content-Type": "application/json",
        ...init.headers,
      },
    });

    const json = await res.json().catch(() => null);

    if (!res.ok || !json || json.status === false) {
      const message =
        (json && typeof json.message === "string" && json.message) ||
        `Paystack request failed with status ${res.status}`;
      return { data: null, error: message };
    }

    return { data: json as T, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Paystack request failed",
    };
  }
}

export const paystackClient = {
  /** POST /transaction/initialize — starts a transaction and returns the
   * `authorization_url` (redirect) and `access_code` (popup resume). */
  async initializeTransaction(
    body: PaystackInitializeRequestBody
  ): Promise<ApiResponse<PaystackInitializeResponse>> {
    return paystackRequest<PaystackInitializeResponse>("/transaction/initialize", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  /** GET /transaction/verify/:reference — confirms a transaction's status
   * directly against Paystack. Not called by any route today; prepared for
   * a future "confirm on return" flow alongside the webhook. */
  async verifyTransaction(
    reference: string
  ): Promise<ApiResponse<PaystackVerifyResponse>> {
    return paystackRequest<PaystackVerifyResponse>(
      `/transaction/verify/${encodeURIComponent(reference)}`,
      { method: "GET" }
    );
  },
};
