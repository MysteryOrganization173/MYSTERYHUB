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
import { getFeaturedFaqItems } from "@/data/faq";

// ─── Data ─────────────────────────────────────────────────────────────────────
// Sourced from src/data/faq.ts — also consumed by /faq, so the homepage
// preview and the full FAQ page never drift apart.

const FEATURED_FAQ_ITEMS = getFeaturedFaqItems();

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
            description="Everything you need to know about Mystery Hub, our digital services, and how the platform works."
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
          defaultValue={FEATURED_FAQ_ITEMS[0]?.id}
          className="w-full space-y-2"
        >
          {FEATURED_FAQ_ITEMS.map((item) => (
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
      </div>
    </Section>
  );
}
