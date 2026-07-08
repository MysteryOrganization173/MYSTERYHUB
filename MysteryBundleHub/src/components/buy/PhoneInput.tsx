"use client";

import { useState } from "react";
import { Phone, X, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  networkName?: string;
  className?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toDigitsOnly(raw: string): string {
  return raw.replace(/\D/g, "");
}

function formatDisplay(digits: string): string {
  // Format: 0XX XXX XXXX (up to 10 digits)
  const d = digits.slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
  return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 10)}`;
}

function isValidGhanaNumber(raw: string): boolean {
  const digits = toDigitsOnly(raw);
  return digits.length === 10 && /^0[235]\d{8}$/.test(digits);
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PhoneInput({
  value,
  onChange,
  networkName,
  className,
}: PhoneInputProps) {
  const [touched, setTouched] = useState(false);

  const isValid = isValidGhanaNumber(value);
  const showError = touched && value.length > 0 && !isValid;
  const showSuccess = isValid;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = toDigitsOnly(e.target.value).slice(0, 10);
    onChange(formatDisplay(digits));
  }

  function handleClear() {
    onChange("");
    setTouched(false);
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Label */}
      <div className="field-wrapper">
        <Label htmlFor="phone-input" className="field-label text-base">
          Recipient Phone Number
        </Label>
        <p className="field-hint">
          Enter the Ghana number that will receive the
          {networkName ? ` ${networkName}` : ""} data bundle.
        </p>
      </div>

      {/* Input row */}
      <div className="relative">
        {/* Country prefix */}
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <div className="flex items-center gap-1.5 border-r border-border pr-3">
            <span className="text-base leading-none" role="img" aria-label="Ghana flag">
              🇬🇭
            </span>
            <span className="text-sm font-semibold text-muted-foreground">
              +233
            </span>
          </div>
        </div>

        {/* Number field */}
        <Input
          id="phone-input"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={value}
          onChange={handleChange}
          onBlur={() => setTouched(true)}
          placeholder="024 XXX XXXX"
          aria-invalid={showError}
          aria-describedby="phone-feedback"
          className={cn(
            "h-14 pl-[98px] pr-12 text-base font-medium tracking-wider",
            showError &&
              "border-destructive focus-visible:ring-destructive/50",
            showSuccess &&
              "border-brand focus-visible:ring-brand/50"
          )}
        />

        {/* Trailing action / status icon */}
        <div className="absolute inset-y-0 right-3 flex items-center">
          {value ? (
            showSuccess ? (
              <CheckCircle2
                className="h-5 w-5 text-brand"
                aria-label="Valid number"
              />
            ) : (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear phone number"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )
          ) : (
            <Phone className="h-4 w-4 text-muted-foreground" aria-hidden />
          )}
        </div>
      </div>

      {/* Validation feedback */}
      <div id="phone-feedback" aria-live="polite" className="min-h-[1rem]">
        {showError && (
          <p className="field-error">
            Enter a valid Ghana number (e.g. 024 XXX XXXX or 020 XXX XXXX).
          </p>
        )}
        {showSuccess && (
          <p className="text-xs font-medium text-brand">
            Looks good — number confirmed!
          </p>
        )}
      </div>

      {/* Network prefix hints */}
      <div className="rounded-lg border border-border/60 bg-muted/30 p-3 space-y-2">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
          Valid Ghana prefixes
        </p>
        <div className="grid grid-cols-3 gap-2 text-[11px]">
          <div>
            <span className="font-semibold text-yellow-400">MTN</span>
            <br />
            <span className="text-muted-foreground">024 · 025 · 053 · 054 · 055 · 059</span>
          </div>
          <div>
            <span className="font-semibold text-red-400">AirtelTigo</span>
            <br />
            <span className="text-muted-foreground">026 · 027 · 056 · 057</span>
          </div>
          <div>
            <span className="font-semibold text-red-500">Telecel</span>
            <br />
            <span className="text-muted-foreground">020 · 050</span>
          </div>
        </div>
      </div>
    </div>
  );
}
