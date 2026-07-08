"use client";

import { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import { STORAGE_KEYS } from "@/constants";

interface AnnouncementBannerProps {
  message?: string;
  storageKey?: string;
}

export function AnnouncementBanner({
  message = "🎉 Welcome to Mystery Hub — Everything Digital. One Trusted Place.",
  storageKey = STORAGE_KEYS.announcement,
}: AnnouncementBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem(storageKey);
      if (!dismissed) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, [storageKey]);

  const dismiss = () => {
    try {
      sessionStorage.setItem(storageKey, "1");
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="relative z-50 flex items-center justify-center gap-2 bg-brand px-4 py-2 text-center text-sm font-medium text-black">
      <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
      <span>{message}</span>
      <button
        onClick={dismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm p-0.5 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black"
        aria-label="Dismiss announcement"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
