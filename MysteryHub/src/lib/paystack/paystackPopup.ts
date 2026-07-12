"use client";

/**
 * Paystack inline popup loader — client-only.
 *
 * Resumes a transaction that was already initialized server-side (via
 * POST /api/checkout -> paymentService.initializePayment), using the
 * `access_code` it returned. This "resume transaction" flow is
 * deliberately used instead of `PaystackPop().newTransaction(...)` because
 * it does not require exposing a public key or re-specifying the amount
 * client-side — the transaction (amount, currency, reference) was already
 * fixed server-side with the secret key.
 *
 * If the popup script fails to load, or throws for any reason, this falls
 * back to a full-page redirect to `authorizationUrl` — satisfying the
 * "Paystack popup or redirect" requirement without leaving the customer
 * stuck.
 */

interface PaystackResumeCallbacks {
  onSuccess: (transaction: { reference: string }) => void;
  onCancel: () => void;
  onLoad?: (response: unknown) => void;
  onError?: (error: unknown) => void;
}

interface PaystackPopInstance {
  resumeTransaction: (
    accessCode: string,
    callbacks: PaystackResumeCallbacks
  ) => void;
}

declare global {
  interface Window {
    PaystackPop?: new () => PaystackPopInstance;
  }
}

const PAYSTACK_INLINE_SCRIPT_SRC = "https://js.paystack.co/v2/inline.js";

let scriptLoadPromise: Promise<void> | null = null;

function loadPaystackScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Paystack popup can only run in the browser."));
  }
  if (window.PaystackPop) return Promise.resolve();
  if (scriptLoadPromise) return scriptLoadPromise;

  scriptLoadPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(
      `script[src="${PAYSTACK_INLINE_SCRIPT_SRC}"]`
    );
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = PAYSTACK_INLINE_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load the Paystack checkout script."));
    document.body.appendChild(script);
  });

  return scriptLoadPromise;
}

export interface ResumePaystackTransactionOptions {
  accessCode: string;
  /** Fallback destination if the popup can't be opened. */
  authorizationUrl: string;
  onSuccess: (reference: string) => void;
  onCancel: () => void;
}

/** Opens the Paystack popup for an already-initialized transaction.
 * Never throws — any failure results in a redirect to `authorizationUrl`. */
export async function resumePaystackTransaction({
  accessCode,
  authorizationUrl,
  onSuccess,
  onCancel,
}: ResumePaystackTransactionOptions): Promise<void> {
  const fallbackToRedirect = () => {
    window.location.href = authorizationUrl;
  };

  try {
    await loadPaystackScript();

    if (!window.PaystackPop) {
      fallbackToRedirect();
      return;
    }

    const popup = new window.PaystackPop();
    popup.resumeTransaction(accessCode, {
      onSuccess: (transaction) => onSuccess(transaction.reference),
      onCancel,
      onError: fallbackToRedirect,
    });
  } catch {
    fallbackToRedirect();
  }
}
