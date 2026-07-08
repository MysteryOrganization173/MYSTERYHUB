"use client";

import { useState, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Package,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NETWORK_OPTIONS, getBundlesByNetwork } from "@/data/bundles";
import { dataBundlesService } from "@/services/dataBundles";
import type {
  DataBundle,
  NetworkId,
  NetworkOption,
  PurchaseStep,
} from "@/types/bundle";
import { PurchaseSteps } from "./PurchaseSteps";
import { NetworkSelector } from "./NetworkSelector";
import { BundleGrid } from "./BundleGrid";
import { PhoneInput } from "./PhoneInput";
import { OrderSummary } from "./OrderSummary";

// ─── Step metadata ────────────────────────────────────────────────────────────

const STEP_META: Record<PurchaseStep, { heading: string; hint: string }> = {
  1: {
    heading: "Choose Your Network",
    hint: "Select the Ghana mobile network for this data bundle.",
  },
  2: {
    heading: "Choose Your Bundle",
    hint: "Pick the data size that fits your needs and budget.",
  },
  3: {
    heading: "Enter Phone Number",
    hint: "Who receives this bundle? Enter the Ghanaian number below.",
  },
  4: {
    heading: "Review Your Order",
    hint: "Everything look right? Confirm to place your order.",
  },
};

// ─── Success screen ───────────────────────────────────────────────────────────

interface SuccessScreenProps {
  reference: string;
  bundle: DataBundle;
  network: NetworkOption;
  phoneNumber: string;
  onBuyAnother: () => void;
}

function SuccessScreen({
  reference,
  bundle,
  network,
  phoneNumber,
  onBuyAnother,
}: SuccessScreenProps) {
  const displayPhone = `+233 ${phoneNumber.replace(/^0/, "")}`;

  return (
    <div className="flex flex-col items-center gap-6 py-6 text-center">
      {/* Animated checkmark */}
      <div className="relative flex h-20 w-20 items-center justify-center">
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-brand/20 animate-ping"
          style={{ animationDuration: "1.8s" }}
        />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-brand bg-brand/15">
          <CheckCircle2 className="h-10 w-10 text-brand" />
        </div>
      </div>

      {/* Heading */}
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold text-foreground">Order Received!</h2>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          Your {bundle.volume} {network.name} bundle is queued for{" "}
          <span className="font-medium text-foreground">{displayPhone}</span>.
        </p>
      </div>

      {/* Reference card */}
      <div className="w-full rounded-xl border border-brand/25 bg-brand/6 px-5 py-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground font-medium">Order Reference</span>
          <span className="font-mono text-sm font-bold text-brand">{reference}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground font-medium">Bundle</span>
          <span className="text-sm font-semibold text-foreground">{bundle.volume}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground font-medium">Est. Delivery</span>
          <span className="text-sm font-semibold text-foreground">{bundle.deliveryTime}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground font-medium">Total Paid</span>
          <span className="text-sm font-bold text-foreground">${bundle.price.toFixed(2)}</span>
        </div>
      </div>

      {/* Info note */}
      <p className="text-[11px] text-muted-foreground max-w-[260px] leading-relaxed">
        Payment processing is coming soon. This order has been logged and will
        be fulfilled once payments go live.
      </p>

      {/* Actions */}
      <div className="flex w-full flex-col gap-2 sm:flex-row">
        <Button
          variant="outline"
          className="flex-1 gap-2 rounded-xl"
          asChild
        >
          <a href="/track">
            <Package className="h-4 w-4" />
            Track Order
          </a>
        </Button>
        <Button
          variant="brand"
          className="flex-1 gap-2 rounded-xl"
          onClick={onBuyAnother}
        >
          <RefreshCw className="h-4 w-4" />
          Buy Another
        </Button>
      </div>
    </div>
  );
}

// ─── Main BuyFlow component ────────────────────────────────────────────────────

export function BuyFlow() {
  const [step, setStep] = useState<PurchaseStep>(1);
  const [selectedNetworkId, setSelectedNetworkId] = useState<NetworkId | null>(null);
  const [selectedBundle, setSelectedBundle] = useState<DataBundle | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderReference, setOrderReference] = useState<string | null>(null);

  // Derived values
  const selectedNetwork = NETWORK_OPTIONS.find((n) => n.id === selectedNetworkId) ?? null;
  const networkBundles = selectedNetworkId
    ? getBundlesByNetwork(selectedNetworkId)
    : [];

  // ── Navigation ──────────────────────────────────────────────────────────────

  const canAdvance = useCallback((): boolean => {
    if (step === 1) return selectedNetworkId !== null;
    if (step === 2) return selectedBundle !== null;
    if (step === 3) {
      const digits = phoneNumber.replace(/\D/g, "");
      return digits.length === 10 && /^0[235]\d{8}$/.test(digits);
    }
    return true;
  }, [step, selectedNetworkId, selectedBundle, phoneNumber]);

  function goToStep(target: PurchaseStep) {
    setStep(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    if (step > 1) goToStep((step - 1) as PurchaseStep);
  }

  function handleContinue() {
    if (canAdvance() && step < 4) goToStep((step + 1) as PurchaseStep);
  }

  function handleNetworkSelect(id: NetworkId) {
    setSelectedNetworkId(id);
    // Reset downstream selections when network changes
    setSelectedBundle(null);
  }

  // ── Order submission ─────────────────────────────────────────────────────────

  async function handleConfirmOrder() {
    if (!selectedBundle || !selectedNetworkId || !phoneNumber) return;

    setIsProcessing(true);
    try {
      const result = await dataBundlesService.placeOrder({
        bundle_id: selectedBundle.id,
        recipient_phone: phoneNumber.replace(/\D/g, ""),
        reference: `MH-${Date.now()}`,
      });
      setOrderReference(result.reference);
    } catch {
      // In production: show a toast error here
      console.error("Order failed");
    } finally {
      setIsProcessing(false);
    }
  }

  // ── Reset flow ────────────────────────────────────────────────────────────────

  function handleReset() {
    setStep(1);
    setSelectedNetworkId(null);
    setSelectedBundle(null);
    setPhoneNumber("");
    setOrderReference(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── Success state ─────────────────────────────────────────────────────────────

  if (orderReference && selectedBundle && selectedNetwork) {
    return (
      <SuccessScreen
        reference={orderReference}
        bundle={selectedBundle}
        network={selectedNetwork}
        phoneNumber={phoneNumber}
        onBuyAnother={handleReset}
      />
    );
  }

  const meta = STEP_META[step];

  return (
    <div className="space-y-6">
      {/* ── Step progress bar ── */}
      <PurchaseSteps currentStep={step} />

      {/* ── Step content card ── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {/* Card header */}
        <div className="border-b border-border/60 bg-muted/20 px-5 py-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-foreground">{meta.heading}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{meta.hint}</p>
            </div>
            <span className="shrink-0 text-xs font-semibold text-muted-foreground bg-muted rounded-full px-2.5 py-1">
              {step}/4
            </span>
          </div>
        </div>

        {/* Card body */}
        <div className="p-5">
          {/* Step 1 — Network */}
          {step === 1 && (
            <NetworkSelector
              networks={NETWORK_OPTIONS}
              selected={selectedNetworkId}
              onSelect={handleNetworkSelect}
            />
          )}

          {/* Step 2 — Bundle */}
          {step === 2 && selectedNetwork && (
            <BundleGrid
              bundles={networkBundles}
              network={selectedNetwork}
              selectedBundleId={selectedBundle?.id ?? null}
              onSelect={setSelectedBundle}
            />
          )}

          {/* Step 3 — Phone */}
          {step === 3 && (
            <PhoneInput
              value={phoneNumber}
              onChange={setPhoneNumber}
              networkName={selectedNetwork?.name}
            />
          )}

          {/* Step 4 — Review */}
          {step === 4 && selectedBundle && selectedNetwork && (
            <OrderSummary
              bundle={selectedBundle}
              network={selectedNetwork}
              phoneNumber={phoneNumber}
              onConfirm={handleConfirmOrder}
              onEdit={goToStep}
              isProcessing={isProcessing}
            />
          )}
        </div>
      </div>

      {/* ── Navigation footer (hidden on review step — OrderSummary has its own CTA) ── */}
      {step !== 4 && (
        <div
          className={cn(
            "flex gap-3",
            step === 1 ? "justify-end" : "justify-between"
          )}
        >
          {step > 1 && (
            <Button
              variant="outline"
              size="lg"
              onClick={handleBack}
              className="gap-2 rounded-xl"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
          )}

          <Button
            variant="brand"
            size="lg"
            onClick={handleContinue}
            disabled={!canAdvance()}
            className={cn(
              "gap-2 rounded-xl",
              step === 1 && "w-full sm:w-auto"
            )}
          >
            {step === 3 ? "Review Order" : "Continue"}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* ── Back button on review step ── */}
      {step === 4 && !isProcessing && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Edit phone number
        </Button>
      )}
    </div>
  );
}
