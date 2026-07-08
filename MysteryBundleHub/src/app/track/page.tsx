import type { Metadata } from "next";
import { PackageSearch } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { ComingSoon } from "@/components/shared/ComingSoon";

export const metadata: Metadata = {
  title: "Track Order",
  description: "Track the status of your Mystery Hub orders in real time.",
};

export default function TrackPage() {
  return (
    <PageContainer>
      <PageHeader
        badge="Orders"
        title="Track Your Order"
        description="Enter your order ID or sign in to see real-time delivery and fulfillment status for all your purchases."
      />
      <ComingSoon
        icon={<PackageSearch className="h-8 w-8 text-brand" aria-hidden />}
        title="Order tracking is on the way"
        description="Real-time order status, delivery updates, and history are coming soon."
      />
    </PageContainer>
  );
}
