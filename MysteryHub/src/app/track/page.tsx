import type { Metadata } from "next";
import { Suspense } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { OrderLookupView } from "@/components/track";

export const metadata: Metadata = {
  title: "Track Order",
  description: "Track the status of your Mystery Hub orders in real time.",
};

export default function TrackPage() {
  return (
    <PageContainer narrow className="py-8 md:py-10">
      <div className="mb-8">
        <PageHeader
          badge="Orders"
          title="Track Your Order"
          description="Enter your order reference to see real-time payment and delivery status."
        />
      </div>

      {/* useSearchParams (inside OrderLookupView) requires a Suspense
       * boundary in the App Router. */}
      <Suspense fallback={null}>
        <OrderLookupView />
      </Suspense>
    </PageContainer>
  );
}
