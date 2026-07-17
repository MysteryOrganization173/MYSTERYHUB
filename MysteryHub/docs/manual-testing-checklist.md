# Manual Testing Checklist — V1.5 Wallet / Referral / Admin System

This environment has no `.env.local` (no live Supabase, Paystack, Cloudinary,
or SuccessBizHub credentials), so the flows below could not be exercised
against a real database during this pass. Everything was verified through
`tsc --noEmit`, `next lint`, `next build`, an HTTP smoke pass against the
production build (status codes, auth-guard responses, rendered copy/images —
see `docs/product-audit.md`), and manual code review against the existing
RLS/service conventions. Run this checklist once real credentials are set in
`.env.local` (see `.env.example`) and the migrations in `supabase/migrations/`
have been applied to a real Supabase project.

## 0. Setup
- [ ] Apply `supabase/migrations/0001` → `0003` to a fresh/staging Supabase
      project (SQL editor or `supabase db push`).
- [ ] Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
      `SUPABASE_SERVICE_ROLE_KEY`, `PAYSTACK_SECRET_KEY`, `ADMIN_EMAILS`
      (include the account you'll test with), and — if available —
      `CLOUDINARY_CLOUD_NAME`/`CLOUDINARY_API_KEY`/`CLOUDINARY_API_SECRET` +
      `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`.
- [ ] `npm run assets:upload` (optional) to push the generated brand images
      to Cloudinary, then set `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` to switch
      `BrandImage` from local `/public` assets to `CldImage` delivery.

## 1. Homepage
- [ ] Hero renders with the generated background image, headline "Everything
      Digital. One Trusted Place.", and the "(example)" label on the
      decorative earnings figure.
- [ ] Trust section's "Earn Rewards" pillar reads "5% commission... credited
      to your wallet instantly" (not "earn points").
- [ ] Referral section shows "5% flat" / "wallet, instantly" and the
      referral banner image.
- [ ] FAQ preview shows featured questions; "View all FAQs" links to `/faq`
      and the content matches (no drift).

## 2. Sign-up with a referral link
- [ ] Visit `/?ref=<existing-user's-referral-code>` (get a code from a test
      user's `/dashboard/referrals` page, or `select referral_code from
      profiles limit 1`).
- [ ] Confirm the `mh-ref` cookie is set, then go to `/sign-up` — the
      `ReferralWelcomeBanner` should appear ("You were invited...").
- [ ] Complete sign-up. Confirm in the DB: the new profile's `referred_by`
      equals the referrer's id, and a fresh `referral_code` was generated for
      the new user.

## 3. Dashboard
- [ ] `/dashboard` greets by first name + time of day, shows wallet balance
      (₵0.00 for a new user), order count, referral count, and an empty
      "recent orders" state using the generated `empty-orders` illustration.
- [ ] `/dashboard/orders`, `/dashboard/wallet`, `/dashboard/referrals`,
      `/dashboard/settings` all load without console errors.

## 4. Buy flow + webhook-driven wallet credit
- [ ] As the *referred* test user, complete a real purchase via `/buy` →
      Paystack popup (test mode) → success.
- [ ] Confirm the webhook (`/api/payments/webhook`) marks the order paid,
      calls `fulfillmentService.processOrder`, and inserts one
      `referral_commissions` row with the referrer's id and 5% of the order
      amount.
- [ ] Confirm the referrer's `profiles.wallet_balance` increased by exactly
      that amount and a matching `wallet_transactions` credit row exists.
- [ ] Re-deliver the same webhook payload (Paystack dashboard "resend" or a
      manual replay) and confirm **no second commission row** is created
      (unique `order_reference` constraint) and the wallet balance is
      unchanged.

## 5. Pay with Wallet
- [ ] As the referrer (now with a positive balance), start a checkout whose
      total is ≤ their wallet balance and choose "Pay with Wallet".
- [ ] Confirm the order is marked paid immediately (no Paystack popup),
      wallet debited, a `wallet_transactions` debit row is created, and
      fulfillment is triggered via the same path as a card payment.
- [ ] Attempt a wallet payment for an amount greater than the balance —
      confirm it's rejected with a clear error and no partial debit occurs.

## 6. Withdrawals
- [ ] From `/dashboard/wallet`, request a withdrawal for less than or equal
      to the current balance. Confirm the balance drops immediately and a
      `withdrawal_requests` row (`status = pending`) appears.
- [ ] As an admin, open `/admin/withdrawals`, approve then mark "paid" —
      confirm `processed_at` is set and the row moves out of the pending
      queue.
- [ ] Create a second withdrawal request, then **reject** it as admin —
      confirm the wallet balance is refunded by exactly that amount and a
      matching `wallet_transactions` credit row is created.

## 7. Admin panel
- [ ] Sign in with an email in `ADMIN_EMAILS` — confirm "Admin Console"
      appears in the navbar (desktop + mobile) and `/admin/*` pages load.
- [ ] Sign in with an email *not* in `ADMIN_EMAILS` — confirm the link is
      absent and every `/api/admin/*` route returns 403 for that user's
      token (not just a hidden UI link).
- [ ] `/admin/suppliers` — toggle `enabled`/`priority` for a supplier and
      confirm `supplier_settings` updates and `supplierRegistry` picks it up
      on the next catalogue/fulfillment call.
- [ ] `/admin/referrals` — confirm total commissions, top referrers, and
      pending withdrawal totals match the DB.

## 8. FAQ
- [ ] `/faq` renders every category from `src/data/faq.ts`, accordions
      expand/collapse, and content matches the homepage preview.

## 9. Mobile responsiveness spot-check
- [ ] At a 375px viewport: homepage hero, navbar (hamburger menu incl. any
      Admin Console link), sign-up/sign-in `AuthShell` (form-first stacking),
      dashboard sidebar (collapses to a usable mobile nav), and `/faq`
      accordions all remain usable with no horizontal overflow.

## 10. Security spot-check
- [ ] Inspect Network tab responses for `/api/admin/*` and `/api/wallet/*`
      while signed out / signed in as a non-admin — confirm no Supabase
      service-role key, Paystack secret key, SuccessBizHub key, or
      Cloudinary API secret ever appears in any response body or the client
      JS bundle (`next build` output / browser devtools "Sources").
