"use client";

import {
  Wifi,
  Phone,
  Clock,
  Shield,
  ShieldOff,
  ArrowRight,
  Lock,
  Pencil,
  WalletMinimal,
  CreditCard,
} from "lucide-react";
import { cn, formatGHS } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { DataBundle, NetworkOption } from "@/types/bundle";
import type { CheckoutPaymentMethod } from "@/types/payment";

interface OrderSummaryProps {
  bundle: DataBundle;
  network: NetworkOption;
  phoneNumber: string;
  onConfirm: () => void;
  onEdit: (step: 1 | 2 | 3) => void;
  isProcessing?: boolean;
  className?: string;
  /** Signed-in user's wallet balance, or `null` when signed out / unknown.
   * When it covers the bundle price, a "Pay with Wallet" option appears
   * alongside the default Paystack path — see docs/product-audit.md
   * ("full-balance wallet payments, no partial split"). */
  walletBalance?: number | null;
  paymentMethod?: CheckoutPaymentMethod;
  onPaymentMethodChange?: (method: CheckoutPaymentMethod) => void;
}

export function OrderSummary({
  bundle,
  network,
  phoneNumber,
  onConfirm,
  onEdit,
  isProcessing = false,
  className,
  walletBalance = null,
  paymentMethod = "paystack",
  onPaymentMethodChange,
}: OrderSummaryProps) {
  const canPayWithWallet = walletBalance !== null && walletBalance >= bundle.price;
  const isWalletSelected = canPayWithWallet && paymentMethod === "wallet";
  // Format phone for display: strip leading 0, prepend +233
  const displayPhone = `+233 ${phoneNumber.replace(/^0/, "")}`;

  return (
    <div className={cn("space-y-4", className)}>
      {/* ── Receipt card ── */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {/* Card header — network colour strip */}
        <div
          className="flex items-center gap-3 px-5 py-4"
          style={{
            background: `linear-gradient(135deg, ${network.color}18 0%, ${network.color}08 100%)`,
            borderBottom: `1px solid ${network.color}30`,
          }}
        >
          {/* Network monogram */}
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black"
            style={{
              backgroundColor: `${network.color}20`,
              border: `1.5px solid ${network.color}50`,
              color: network.color,
            }}
          >
            {network.shortName.slice(0, 2)}
          </div>

          <div className="min-w-0">
            <p className="font-semibold text-foreground truncate">{bundle.name}</p>
            <p className="text-xs text-muted-foreground">{network.name}</p>
          </div>

          {/* Edit network */}
          <button
            type="button"
            onClick={() => onEdit(1)}
            aria-label="Change network"
            className="ml-auto shrink-0 flex items-center gap-1 text-[11px] text-brand hover:text-brand/80 transition-colors"
          >
            <Pencil className="h-3 w-3" />
            Change
          </button>
        </div>

        {/* Row list */}
        <div className="divide-y divide-border/40">
          <SummaryRow
            icon={<Wifi className="h-4 w-4" />}
            label="Package Size"
            value={bundle.volume}
            onEdit={() => onEdit(2)}
          />
          <SummaryRow
            icon={<Phone className="h-4 w-4" />}
            label="Phone Number"
            value={displayPhone}
            onEdit={() => onEdit(3)}
          />
          <SummaryRow
            icon={<Clock className="h-4 w-4" />}
            label="Delivery"
            value={bundle.deliveryTime}
          />
          <SummaryRow
            icon={
              bundle.shieldProtection ? (
                <Shield className="h-4 w-4 text-brand" />
              ) : (
                <ShieldOff className="h-4 w-4" />
              )
            }
            label="Shield Protection"
            value={bundle.shieldProtection ? "Enabled" : "Not included"}
            valueClassName={bundle.shieldProtection ? "text-brand" : ""}
          />
        </div>

        {/* Price footer */}
        <div className="flex items-center justify-between bg-muted/30 px-5 py-4">
          <div>
            <p className="text-xs text-muted-foreground">Total Due</p>
            <p className="text-2xl font-black text-foreground tabular-nums">
              {formatGHS(bundle.price)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-muted-foreground">
              Shield{" "}
              <span className={bundle.shieldProtection ? "text-brand" : ""}>
                {bundle.shieldProtection ? "✓" : "—"}
              </span>
            </p>
            <p className="text-[11px] text-muted-foreground">
              Delivery: {bundle.deliveryTime}
            </p>
          </div>
        </div>
      </div>

      {/* ── Payment method ── */}
      {canPayWithWallet && onPaymentMethodChange && (
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => onPaymentMethodChange("paystack")}
            className={cn(
              "flex flex-col items-center gap-1 rounded-xl border px-3 py-3 text-center transition-colors",
              !isWalletSelected
                ? "border-brand/40 bg-brand/8 text-foreground"
                : "border-border text-muted-foreground hover:border-border/80"
            )}
          >
            <CreditCard className="h-4 w-4" aria-hidden />
            <span className="text-xs font-semibold">Paystack</span>
            <span className="text-[10px] text-muted-foreground">MoMo / Card</span>
          </button>
          <button
            type="button"
            onClick={() => onPaymentMethodChange("wallet")}
            className={cn(
              "flex flex-col items-center gap-1 rounded-xl border px-3 py-3 text-center transition-colors",
              isWalletSelected
                ? "border-brand/40 bg-brand/8 text-foreground"
                : "border-border text-muted-foreground hover:border-border/80"
            )}
          >
            <WalletMinimal className="h-4 w-4" aria-hidden />
            <span className="text-xs font-semibold">Wallet</span>
            <span className="text-[10px] text-muted-foreground">
              Balance {formatGHS(walletBalance ?? 0)}
            </span>
          </button>
        </div>
      )}

      {/* ── CTA ── */}
      <Button
        type="button"
        onClick={onConfirm}
        variant="brand"
        size="xl"
        loading={isProcessing}
        disabled={isProcessing}
        className="w-full gap-2 rounded-xl text-base"
      >
        {isProcessing ? (
          "Processing order…"
        ) : isWalletSelected ? (
          <>
            <WalletMinimal className="h-4 w-4" aria-hidden />
            Pay {formatGHS(bundle.price)} with Wallet
          </>
        ) : (
          <>
            <Lock className="h-4 w-4" aria-hidden />
            Confirm Order
            <ArrowRight className="h-4 w-4 ml-0.5" aria-hidden />
          </>
        )}
      </Button>

      <p className="text-center text-[11px] text-muted-foreground leading-relaxed px-4">
        {isWalletSelected
          ? "Your wallet will be debited instantly and your order queued for fulfillment right away — no redirect needed."
          : "You'll be asked to complete payment via Paystack. Your order will be queued for fulfillment once payment is confirmed."}
      </p>
    </div>
  );
}

// ─── Row sub-component ────────────────────────────────────────────────────────

interface SummaryRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onEdit?: () => void;
  valueClassName?: string;
}

function SummaryRow({
  icon,
  label,
  value,
  onEdit,
  valueClassName,
}: SummaryRowProps) {
  return (
    <div className="flex items-center gap-3 px-5 py-3.5">
      <span className="shrink-0 text-muted-foreground">{icon}</span>
      <span className="flex-1 text-sm text-muted-foreground">{label}</span>
      <span className={cn("text-sm font-medium text-foreground", valueClassName)}>
        {value}
      </span>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Edit ${label}`}
          className="ml-2 shrink-0 flex items-center gap-0.5 text-[11px] font-medium text-brand hover:text-brand/80 transition-colors"
        >
          <Pencil className="h-2.5 w-2.5" />
          Edit
        </button>
      )}
    </div>
  );
}
