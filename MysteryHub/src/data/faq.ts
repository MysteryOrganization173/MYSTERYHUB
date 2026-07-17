/**
 * FAQ — single shared data source for `/faq` and the homepage
 * `FAQPreview`, so the two never drift apart again (previously each
 * held its own hardcoded list — see docs/product-audit.md).
 *
 * `featured: true` items are the ones `FAQPreview` shows on the
 * homepage; every item (featured or not) appears on `/faq`, grouped by
 * `category`.
 */

export type FaqCategory =
  | "getting-started"
  | "orders-delivery"
  | "payments"
  | "wallet-referrals"
  | "security";

export interface FaqItem {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
  featured?: boolean;
}

export const FAQ_CATEGORIES: Record<FaqCategory, string> = {
  "getting-started": "Getting Started",
  "orders-delivery": "Orders & Delivery",
  payments: "Payments",
  "wallet-referrals": "Wallet & Referrals",
  security: "Security & Trust",
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "what-is-mystery-hub",
    category: "getting-started",
    question: "What is Mystery Hub?",
    answer:
      "Mystery Hub is a digital services platform, starting with instant MTN, AirtelTigo, and Telecel internet bundles. It's built to grow into one trusted place for the digital services Ghanaians use every day — connectivity today, more services as we build and verify them, never marketed before they're real.",
  },
  {
    id: "why-create-an-account",
    category: "getting-started",
    question: "Do I need an account to buy a bundle?",
    answer:
      "No — you can buy a bundle as a guest with just a phone number and payment. Creating a free account adds order history, a real wallet you can pay from and get referral commissions credited to, and a referral link to earn from. It takes under a minute.",
    featured: true,
  },
  {
    id: "delivery-speed",
    category: "orders-delivery",
    question: "How fast is delivery after payment?",
    answer:
      "Most bundles are delivered within seconds of payment confirmation through our automated fulfillment system, which runs 24/7. Delivery speed depends on the network and supplier response time — if it's ever slower than expected, you'll see the real status on the Track Order page rather than a false \"delivered\".",
    featured: true,
  },
  {
    id: "payment-methods",
    category: "payments",
    question: "What payment methods do you accept?",
    answer:
      "Card and mobile money via Paystack (MTN MoMo, AirtelTigo Money, Telecel Cash, and bank cards), plus your Mystery Hub wallet balance for a one-tap checkout with no external payment step at all.",
    featured: true,
  },
  {
    id: "failed-payment",
    category: "payments",
    question: "What happens if my payment fails or gets interrupted?",
    answer:
      "If a Paystack payment fails or you close the checkout before completing it, no money leaves your account and no bundle is sent — the order simply stays \"pending\". You can retry the same order from the Track Order page using your reference.",
  },
  {
    id: "delayed-order",
    category: "orders-delivery",
    question: "My order is paid but hasn't been delivered yet — what do I do?",
    answer:
      "First check the Track Order page with your reference — it shows the real, live fulfillment status, including any supplier error we've recorded. If it's stuck for more than a few minutes, contact support with your order reference and we'll investigate and resolve it manually if needed.",
  },
  {
    id: "refunds",
    category: "payments",
    question: "Can I get a refund if my order fails?",
    answer:
      "If an order is paid but fails to deliver and can't be retried, contact support with your reference. Refunds are currently handled manually by our team on a case-by-case basis — there is no self-serve automatic refund button yet, and we'd rather tell you that than pretend otherwise.",
  },
  {
    id: "track-order",
    category: "orders-delivery",
    question: "How do I track an order?",
    answer:
      "Use the Track Order page with your order reference (sent to you at checkout), or, if you're signed in, check your Orders page for your full history with live status.",
  },
  {
    id: "wallet-explained",
    category: "wallet-referrals",
    question: "How does the wallet actually work?",
    answer:
      "Your wallet holds a real balance backed by a full transaction ledger. It's credited automatically when a referral commission is earned, and you can pay for any order directly from it at checkout — no card or mobile money prompt needed when your balance covers the full amount.",
    featured: true,
  },
  {
    id: "referral-commission",
    category: "wallet-referrals",
    question: "How does the referral commission work?",
    answer:
      "Every account gets a unique referral link. When someone signs up through your link and their order is paid, you earn a flat 5% commission, credited to your wallet automatically — there's no cap and it never expires.",
  },
  {
    id: "withdrawals",
    category: "wallet-referrals",
    question: "How do I withdraw my wallet balance?",
    answer:
      "Request a withdrawal from your Wallet page with a mobile money number. The amount is held from your balance immediately, and an admin reviews and pays it out to that number. If a request is ever rejected, the amount is refunded to your wallet automatically.",
  },
  {
    id: "security",
    category: "security",
    question: "Is my data and money safe with Mystery Hub?",
    answer:
      "Authentication runs on Supabase, and we never see or store your card details — all card and mobile money payments are processed directly by Paystack. Every wallet credit and debit is recorded in an auditable transaction log tied to your account.",
    featured: true,
  },
  {
    id: "future-services",
    category: "getting-started",
    question: "What other services is Mystery Hub planning to add?",
    answer:
      "Our roadmap includes exam results checking, a digital voucher marketplace, and more — each one will only launch, and only be marketed, once it's actually working end to end. If it's not on this FAQ or working in your dashboard yet, it isn't live.",
  },
];

export function getFeaturedFaqItems(): FaqItem[] {
  return FAQ_ITEMS.filter((item) => item.featured);
}

export function getFaqItemsByCategory(): Array<{ category: FaqCategory; items: FaqItem[] }> {
  const order: FaqCategory[] = [
    "getting-started",
    "orders-delivery",
    "payments",
    "wallet-referrals",
    "security",
  ];
  return order.map((category) => ({
    category,
    items: FAQ_ITEMS.filter((item) => item.category === category),
  }));
}
