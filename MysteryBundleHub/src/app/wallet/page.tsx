import type { Metadata } from "next";
import { Wallet } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { ComingSoon } from "@/components/shared/ComingSoon";

export const metadata: Metadata = {
  title: "Wallet",
  description: "Manage your balance, deposits, withdrawals, and transaction history on Mystery Hub.",
};

export default function WalletPage() {
  return (
    <PageContainer>
      <PageHeader
        badge="Wallet"
        title="Your Wallet"
        description="Manage your balance, top up funds, withdraw earnings, and track all your transactions in one secure place."
      />
      <ComingSoon
        icon={<Wallet className="h-8 w-8 text-brand" aria-hidden />}
        title="Wallet is being set up"
        description="Secure wallet management and transaction tracking is coming soon."
      />
    </PageContainer>
  );
}
