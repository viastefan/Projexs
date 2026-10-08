"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { buttonBase, buttonVariants } from "@/components/ui/Button";

export const INQUIRY_EVENT = "projexs:inquiry";

/** Herkunft der Anfrage – wird als verstecktes Feld „source“ mitgesendet. */
export type InquirySource = "dialog" | "form" | "contact-page" | "popup";

export function openInquiry(source: InquirySource = "dialog") {
  window.dispatchEvent(new CustomEvent<{ source: InquirySource }>(INQUIRY_EVENT, { detail: { source } }));
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
  source = "dialog",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "light" | "ghost-light" | "plain";
  /** Display-Klassen getrennt, damit responsive Varianten wie "hidden md:inline-flex" greifen. */
  display?: string;
  className?: string;
  source?: InquirySource;
}) {
  const styles = variant === "plain" ? "" : cn(buttonBase.replace("inline-flex ", ""), buttonVariants[variant]);
  return (
    <a
      href={href}
      className={cn(display, styles, className)}
      onClick={(e) => {
        e.preventDefault();
        openInquiry(source);
      }}
    >
      {children}
    </a>
  );
}
