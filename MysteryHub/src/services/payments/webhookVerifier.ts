/**
 * Paystack webhook signature verification — server-only.
 *
 * Paystack signs every webhook request body with an HMAC SHA512 digest of
 * the raw (unparsed) body, using the SAME secret key used for API calls —
 * there is no separate webhook signing secret, unlike Stripe. The result is
 * sent in the `x-paystack-signature` header.
 *
 * Reference: https://paystack.com/docs/payments/webhooks/#verifying-events
 *
 * Callers: `src/app/api/payments/webhook/route.ts` only. Requires the raw
 * request body as a string — do not `JSON.parse` before verifying, or the
 * signature will never match.
 */
import { createHmac, timingSafeEqual } from "crypto";
import { serverEnv, isPaystackConfigured } from "@/config/env";

export function verifyPaystackSignature(
  rawBody: string,
  signatureHeader: string | null
): boolean {
  if (!isPaystackConfigured || !signatureHeader) return false;

  const expected = createHmac("sha512", serverEnv.paystackSecretKey)
    .update(rawBody)
    .digest("hex");

  const expectedBuffer = Buffer.from(expected, "hex");
  const receivedBuffer = Buffer.from(signatureHeader, "hex");

  // Buffers of different lengths would throw inside timingSafeEqual.
  if (expectedBuffer.length !== receivedBuffer.length) return false;

  return timingSafeEqual(expectedBuffer, receivedBuffer);
}
