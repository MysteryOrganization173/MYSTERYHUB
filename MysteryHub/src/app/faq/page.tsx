import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_CATEGORIES, getFaqItemsByCategory } from "@/data/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about Mystery Hub — how orders and delivery work, payments, refunds, the wallet, referral commissions, and security.",
};

export default function FaqPage() {
  const groups = getFaqItemsByCategory();

  return (
    <PageContainer narrow>
      <PageHeader
        badge="Help"
        title="Frequently Asked Questions"
        description="Straight answers about how Mystery Hub actually works today — no vague promises, no features that don't exist yet."
      />

      <div className="mt-10 space-y-10">
        {groups.map(({ category, items }) => (
          <section key={category} aria-labelledby={`faq-${category}`}>
            <h2
              id={`faq-${category}`}
              className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand"
            >
              {FAQ_CATEGORIES[category]}
            </h2>
            <Accordion type="single" collapsible className="w-full space-y-2">
              {items.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
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
          </section>
        ))}
      </div>
    </PageContainer>
  );
}
