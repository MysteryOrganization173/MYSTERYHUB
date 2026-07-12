# Mystery Hub — Product Roadmap

> Source of truth for release scope: [`project-audit.md`](./project-audit.md)  
> Brand positioning: [`BRAND.md`](./BRAND.md)  
> Last updated: July 12, 2026  
> Guiding principle: **Ship a polished, stable Version 1 as soon as possible.**

---

## How this roadmap was decided

Decisions below are derived from the audit’s inventory of what is already built, what is mock-only, and what is ComingSoon — filtered by one launch question:

> Can a real user complete one trusted digital-service transaction end-to-end without broken chrome, fake payments, or dead-end support?

Anything that does **not** answer that question is deferred, even if it appears on the homepage as a teaser.

### Prioritization rules

| Rule | Meaning |
|---|---|
| **Complete the commerce loop first** | Internet packages already have UI; V1 must make them real (catalog → pay → fulfill → track). |
| **Platform, not feature sprawl** | Brand says digital services ecosystem; V1 proves the platform with **one live service**, not every tile on the home page. |
| **Polish over breadth** | Fewer live routes, all working, beats many ComingSoon pages in primary navigation. |
| **Defer ledger complexity** | Wallet, earn, referrals, and agent economics add money-movement surface area; they wait until core checkout is stable. |
| **Hide or stub what we can’t ship** | Linked routes that 404 or tease unfinished products hurt trust more than omitting them. |

### Release definitions

| Release | Definition of done |
|---|---|
| **Version 1** | Public launch: one live paid service (internet packages), auth, track, support path, legal, no critical 404s, stable error handling. |
| **Version 2** | Deepen the platform: wallet, richer dashboard, results checker, referrals, transactional email, stronger ops. |
| **Future** | Marketplace scale, earn, agent/business, utilities, and growth/infra that is not required to operate V1–V2. |

---

## Version 1 — Launch (priority)

**Goal:** A polished digital services platform where a user can buy an **internet package** (one service in the ecosystem), pay, get fulfillment or a clear pending status, and track the order — with brand-consistent UI and basic account support.

### In scope

| Feature / work | Reasoning |
|---|---|
| **Product scope freeze** (`PRODUCT.md` + brand alignment) | Audit: dual narratives (mystery box vs digital services) cause drift. V1 needs a single written scope so engineering does not rebuild the wrong product. |
| **Live internet packages (`/buy`)** | Audit: only fully built commerce UI; still mock. Highest leverage path to a real launch. Framed as **one** digital/mobile service, not the whole brand. |
| **SuccessBizHub integration** | Audit: critical path for fulfillment; without it, checkout cannot deliver. Includes networks, packages, place order, status. |
| **One real payment rail** | Audit: payments undecided and mock. Pick **one** Ghana-viable method (e.g. MoMo and/or card via chosen PSP). Multiple rails are V2+. |
| **Order persistence** | Audit: no DB/API. Orders must survive refresh and support tracking/support. Minimal schema only (users, orders, status). |
| **Order tracking (`/track`)** | Audit: ComingSoon but linked from buy success. Guest lookup by reference is enough for V1; authenticated history can be thin. |
| **Auth (`/sign-in`, `/sign-up`) + session** | Audit: no auth. Needed for owned order history, support identity, and a credible platform — not for forcing login before every purchase if guest checkout is chosen. |
| **Thin account home** | Either a minimal `/dashboard` (recent orders + profile link) **or** “My orders” inside `/track` when signed in. **Reasoning:** full dashboard analytics are not required to launch; empty ComingSoon dashboards hurt polish. |
| **Currency & locale decision** | Audit: USD mocks vs Ghana market. Wrong currency at launch looks unfinished; decide GHS (or display policy) once and apply to buy UI. |
| **Route hygiene for launch chrome** | Audit: footer/nav 404s and ComingSoon on primary items. V1: remove, hide behind “Soon,” or replace with honest stubs — **no broken primary links**. |
| **Legal stubs (`/privacy`, `/terms`; cookies if linked)** | Audit: linked but missing. Soft requirement for public launch and payment providers. |
| **`/support` (minimal)** | Audit: ComingSoon. V1 needs a clear help path (WhatsApp/email CTA and/or simple contact form) when payments or delivery fail. Full ticket system is later. |
| **`/faq` (content page)** | Audit: homepage already has FAQ preview. Promoting that content is low effort and raises polish/trust. |
| **Global `not-found` + `error` UI** | Audit: missing quality gates. Stable empty/error states are part of “polished,” not optional polish. |
| **Maintenance mode respected** | Audit: flag exists, unused. Prevents half-broken deploys during incidents. |
| **Essential assets** | Audit: OG/logo gaps. At least OG image + home/buy visuals that don’t look broken. |
| **Docs needed to ship** | SuccessBizHub integration note, payments/currency decision record, keep architecture/README truthful. (`BRAND.md` already exists.) |

### Explicitly out of Version 1 (and why)

| Deferred item | Why not V1 |
|---|---|
| Full **wallet** (balance, top-up, withdraw) | Audit listed as P1, but a prepaid ledger is a second money system. Per-order payment ships faster and with less risk. Tease on home OK; live wallet → V2. |
| Full **dashboard** (stats, referrals panel, multi-section shell) | Not required to complete a purchase. Thin “my orders” is enough. |
| **Results checker (`/checker`)** | Marketed on home but no page/backend. Building it delays the paid loop. Hide/unlink or “Coming soon” card only until V2. |
| **Referrals / Earn / Marketplace / Agent / Business** | Audit P2. Large product surfaces with no backend; shipping as live nav items would dilute polish. |
| **Order email (Resend)** | Valuable, not blocking if in-app track + support exist. |
| **React Query / Zustand / Framer Motion programs** | Architecture wish-list; add only when a V1 feature needs them. |
| **Broad automated test suite** | Smoke path for buy + payment webhook is enough for launch; full suite is V2+. |
| **GA / growth analytics** | Optional after core loop works. |
| **Legacy mystery-box catalog cleanup** | Hygiene; do not block launch if unused code is simply not linked. |

### Version 1 success criteria

1. A new user can complete an internet-package purchase with **real payment** and receive **fulfilled or clearly pending** status.  
2. The same order is findable via **`/track`** (reference and/or account).  
3. Primary navigation and footer do **not** lead to 404s or fake “completed” flows.  
4. Support and legal paths exist.  
5. Homepage still presents a **digital services platform**; only live services are clearly actionable.

---

## Version 2 — Platform depth

**Goal:** Turn the launched commerce loop into a fuller digital services platform — retention, second services, and operational maturity — without rewriting V1.

### In scope

| Feature / work | Reasoning |
|---|---|
| **Digital wallet** | Natural next money surface after checkout is stable; enables faster repeat buys and future earn/referral payouts. |
| **Richer dashboard** | Orders, wallet snapshot, profile, basic activity — now justified because wallet + history exist. |
| **Results checker (`/checker`)** | Already in brand/home narrative; second live service proves “ecosystem,” not data-only. Depends on a checker provider/API decision. |
| **Referral program (basic)** | Growth loop once purchase + wallet/payout path exist; weak without trusted balances. |
| **Transactional email (Resend)** | Order confirmation, receipt, failure notices — reduces support load once volume grows. |
| **Second payment rail or MoMo expansion** | Diversify after one rail is proven in production. |
| **Support upgrades** | Tickets or structured contact form beyond CTA; still not a full helpdesk unless needed. |
| **Targeted automated tests** | Buy flow unit tests + payment webhook / order status integration tests. |
| **Archive/namespace legacy mystery-box types** | Maintainability once V1 is live and domain is frozen. |
| **Barrel / validator hygiene** | `dataBundlesService` exports, Ghana phone schema shared with UI — reduces bugs as team grows. |
| **Supabase ERD + RLS hardening** | Expand beyond minimal V1 tables with documented policies. |

### Version 2 success criteria

1. Users can hold balance and see transactions in **wallet**.  
2. At least **two** live digital services (e.g. internet packages + results checker).  
3. Referrals (if launched) credit reliably into wallet or clear pending rewards.  
4. Operational emails cover happy-path and failure-path orders.

---

## Future Releases

**Goal:** Scale the ecosystem and business model after the platform is trusted.

| Feature / work | Reasoning |
|---|---|
| **Marketplace (listings, sellers, vouchers at scale)** | Large catalog, trust & safety, and payout complexity; not needed to prove the platform. |
| **Earn hub (tasks / campaigns)** | Separate product line; depends on wallet, fraud controls, and content ops. |
| **Agent Hub** | Reseller economics, KYC, commissions — after referrals and wallet are proven. |
| **For Business / bulk / white-label** | B2B sales motion and reporting; different buyer than V1 consumer. |
| **Utilities (electricity, airtime-as-utility, bills)** | Additional providers and failure modes; expand after connectivity + checker. |
| **Affiliates (beyond simple referrals)** | Partner tooling and attribution; growth stage. |
| **Blog / About / marketing site expansion** | Content ops; not product-critical. |
| **Advanced analytics / experimentation** | After baseline traffic and stable funnels. |
| **Heavy client state libraries by default** | Introduce React Query/Zustand when caching/cart complexity demands them — not as a release gate. |
| **Animation system overhaul** | Use or remove Framer Motion deliberately; cosmetic relative to commerce. |
| **Multi-country expansion** | After Ghana loop is solid (locale, networks, payments, support). |

---

## Suggested sequencing inside Version 1

Order of work for fastest stable launch (still no feature creep):

1. **Scope & currency decision** (docs + constants)  
2. **Backend skeleton** (auth + orders schema)  
3. **SuccessBizHub** read path (networks/packages) wired into existing `/buy`  
4. **Payment + webhook → order status**  
5. **SuccessBizHub** fulfill / status + `/track`  
6. **Chrome polish** (legal, support, FAQ, 404/error, nav hygiene)  
7. **Thin account home** + launch checklist / maintenance mode  

Do **not** start wallet, checker, marketplace, earn, agent, or business until the above is production-ready.

---

## Mapping from `project-audit.md` checklists

| Audit bucket | Roadmap placement | Adjustment for “ASAP polished V1” |
|---|---|---|
| P0 commerce + auth + track + persistence + payment | **Version 1** | Kept |
| P0 broken links / legal / currency / docs truth | **Version 1** | Kept |
| P1 wallet | **Version 2** | Deferred — accelerates V1; wallet is ledger complexity |
| P1 full dashboard | **Version 2** (rich) / **V1 thin** | Thin orders view only in V1 |
| P1 FAQ + support + not-found/error + OG + maintenance | **Version 1** | Kept — high polish, low relative cost |
| P1 Resend email | **Version 2** | Deferred — track + support cover V1 |
| P2 checker, referrals | **Version 2** | Kept as platform depth |
| P2 earn, marketplace, agent, business | **Future** | Kept out of V2 core unless strategy changes |
| P2 test suite / GA / Framer | **V2** (tests) / **Future** (GA, motion program) | Smoke tests may land late V1 if time |
| P3 PRODUCT / integrations / payments decision | **Version 1** (parallel) | Required to avoid building the wrong thing |
| P3 BRAND.md | **Done** | Exists; maintain, don’t rebuild |

---

## What stays ComingSoon until its release

Until a feature’s release ships, homepage teasers may remain, but **primary nav and footer must not promise live tools**.

| Surface | Until |
|---|---|
| Wallet | Version 2 |
| Results checker | Version 2 |
| Referrals | Version 2 |
| Earn | Future |
| Marketplace | Future |
| Agent Hub | Future |
| For Business | Future |
| Utilities | Future |

---

## Document ownership

| Document | Role |
|---|---|
| [`project-audit.md`](./project-audit.md) | What exists / what’s missing / technical debt |
| **This file (`ROADMAP.md`)** | What ships when, and why |
| [`BRAND.md`](./BRAND.md) | How we talk about the product |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | How we build it |

Update this roadmap when release scope changes; do not expand Version 1 without revisiting the launch question at the top of this file.
