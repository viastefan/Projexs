"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const INQUIRY_EVENT = "projexs:inquiry";

export function openInquiry() {
  window.dispatchEvent(new CustomEvent(INQUIRY_EVENT));
}

/**
 * Öffnet den Anfrage-Dialog. Ohne JavaScript führt der Link auf die Kontaktseite,
 * damit die Anfrage in jedem Fall möglich bleibt.
 */
export function InquiryTrigger({
  href,
  children,
  variant = "primary",
  display = "inline-flex",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "plain";
  /** Display-Klassen getrennt, damit responsive Varianten wie "hidden md:inline-flex" greifen. */
  display?: string;
  className?: string;
}) {
  const styles = {
    primary:
      "h-12 items-center justify-center gap-2 rounded-md bg-navy px-6 text-[1rem] font-semibold text-white transition-colors hover:bg-navy-deep",
    secondary:
      "h-12 items-center justify-center gap-2 rounded-md border border-navy px-6 text-[1rem] font-semibold text-navy transition-colors hover:bg-navy hover:text-white",
    plain: "",
  };
  return (
    <a
      href={href}
      className={cn(display, styles[variant], className)}
      onClick={(e) => {
        e.preventDefault();
        openInquiry();
      }}
    >
      {children}
    </a>
  );
}
