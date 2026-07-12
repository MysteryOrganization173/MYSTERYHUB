/**
 * Guest checkout email placeholder.
 *
 * Paystack requires an email address to initialize a transaction, but
 * Mystery Hub's buy flow only collects a Ghana phone number today (no
 * email field, no required sign-in). Rather than blocking Phase 3 on adding
 * a new form field, checkout synthesizes a deterministic, clearly-fake
 * placeholder address for guest orders that didn't supply a real one.
 *
 * Uses the `.invalid` TLD (reserved by RFC 2606 for addresses that are
 * guaranteed not to resolve) so nothing is ever emailed to a real inbox by
 * mistake. Paystack only validates email *format*, not deliverability, so
 * this is accepted by their API.
 *
 * Replace this once a real email is collected (e.g. a form field, or a
 * signed-in user's account email) — `checkoutService`/`paymentService`
 * already accept a real `email` when one is provided; this is only the
 * fallback.
 */
export function synthesizeGuestEmail(recipientPhone: string): string {
  const digits = recipientPhone.replace(/\D/g, "") || "unknown";
  return `guest.${digits}@mysteryhub-checkout.invalid`;
}
