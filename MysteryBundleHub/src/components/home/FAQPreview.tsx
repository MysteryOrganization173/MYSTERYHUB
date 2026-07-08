import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section, SectionHeader } from "@/components/layout";

// ─── Static data ──────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    value:    "delivery",
    question: "How fast is delivery after payment?",
    answer:
      "Almost all data bundles and digital products are delivered within seconds of payment confirmation. Our automated system runs 24/7 with no manual intervention needed.",
  },
  {
    value:    "payment",
    question: "What payment methods do you accept?",
    answer:
      "We accept MTN MoMo, AirtelTigo Money, Telecel Cash, bank transfers, and your Mystery Hub wallet balance. All payments are processed instantly and securely.",
  },
  {
    value:    "security",
    question: "Is my data and money safe with Mystery Hub?",
    answer:
      "Absolutely. All transactions are encrypted with bank-grade security. We never store your payment credentials, and all funds in your wallet are fully protected.",
  },
  {
    value:    "referral",
    question: "How does the referral commission work?",
    answer:
      "When someone signs up using your unique referral link and makes a purchase, you earn a commission. Commissions are credited instantly to your wallet and can be withdrawn at any time.",
  },
] as const;

// ─── Section ──────────────────────────────────────────────────────────────────

export function FAQPreview() {
  return (
    <Section size="lg">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

        {/* Left: heading + CTA (sticky on desktop) */}
        <div className="lg:sticky lg:top-28">
          <SectionHeader
            badge="FAQ"
            title="Questions? We've Got Answers."
            description="Everything you need to know about Mystery Hub, your bundles, and how our platform works."
            centered={false}
          />
          <Button
            asChild
            variant="outline-brand"
            className="rounded-xl gap-2 mt-2"
          >
            <Link href="/faq">
              View All FAQs
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>

        {/* Right: accordion */}
        <Accordion
          type="single"
          collapsible
          defaultValue="delivery"
          className="w-full space-y-2"
        >
          {FAQ_ITEMS.map((item) => (
            <AccordionItem
              key={item.value}
              value={item.value}
              className="card-base rounded-xl border px-5 data-[state=open]:border-brand/30 transition-colors duration-150"
            >
              <AccordionTrigger className="text-sm font-semibold text-left py-4 hover:no-underline hover:text-brand [&[data-state=open]]:text-brand transition-colors duration-150">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}
