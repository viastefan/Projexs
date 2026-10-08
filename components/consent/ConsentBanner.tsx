"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Cookie } from "@/components/ui/Icons";
import { CONSENT_OPEN_EVENT, useConsent, writeConsent } from "./consent";

/**
 * Datenschutz-/Cookie-Hinweis. Nicht blockierend, als Karte unten rechts (Desktop)
 * bzw. Bottom-Sheet (mobil). Erscheint nur, solange keine Auswahl gespeichert ist,
 * und lässt sich über „Cookie-Einstellungen“ im Footer erneut öffnen.
 */
export function ConsentBanner({ dict }: { dict: Dictionary }) {
  const c = dict.consent;
  const consent = useConsent(); // undefined = noch unbekannt (Hydration), null = keine Auswahl
  const [forced, setForced] = useState(false); // über Footer-Link geöffnet
  const [settings, setSettings] = useState(false);
  const [external, setExternal] = useState(false);
  const firstButton = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const open = forced || consent === null;

  // Footer-Link „Cookie-Einstellungen“ öffnet den Banner mit Einstellungen
  useEffect(() => {
    const onOpen = () => {
      returnFocus.current = document.activeElement as HTMLElement | null;
      setExternal(Boolean(consent?.external));
      setSettings(true);
      setForced(true);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, onOpen);
  }, [consent]);

  const decide = (allowExternal: boolean) => {
    writeConsent(allowExternal);
    setForced(false);
    setSettings(false);
    returnFocus.current?.focus();
  };

  // Fokus in den Dialog setzen; Escape = nur notwendige
  useEffect(() => {
    if (!open) return;
    firstButton.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        writeConsent(false);
        setForced(false);
        setSettings(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      aria-describedby="consent-text"
      data-consent-banner
      className={cn(
        "animate-sheet fixed inset-x-0 bottom-[4.25rem] z-[60] mx-auto w-full border-t border-line bg-white p-5 shadow-[0_-16px_50px_-20px_rgba(4,15,58,0.45)] lg:bottom-6 lg:left-auto lg:right-6 lg:mx-0 lg:w-[26rem] lg:rounded-xl lg:border lg:p-6 lg:shadow-[0_30px_70px_-24px_rgba(4,15,58,0.5)]",
        "lg:pb-6",
      )}
    >
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-md bg-navy/[0.06] text-navy">
          <Cookie className="size-5" />
        </span>
        <div className="min-w-0">
          <h2 id="consent-title" className="text-[1.05rem] font-semibold leading-snug">
            {c.title}
          </h2>
          <p id="consent-text" className="mt-1.5 text-[0.9rem] leading-relaxed text-stone">
            {c.text}{" "}
            <Link href={dict.routes.privacy} className="font-semibold text-navy underline underline-offset-4">
              {c.privacyLink}
            </Link>
          </p>
        </div>
      </div>

      {settings && (
        <fieldset className="mt-4 space-y-2.5 border-t border-line pt-4">
          <legend className="sr-only">{c.settings}</legend>
          <label className="flex items-start gap-3 rounded-md bg-surface p-3">
            <input type="checkbox" checked disabled className="mt-1 size-[1.05rem] shrink-0 accent-[var(--color-navy)]" />
            <span>
              <span className="block text-[0.95rem] font-semibold text-navy">{c.necessary}</span>
              <span className="block text-[0.85rem] leading-snug text-stone">{c.necessaryText}</span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 rounded-md border border-line p-3 hover:border-navy">
            <input
              type="checkbox"
              checked={external}
              onChange={(e) => setExternal(e.target.checked)}
              className="mt-1 size-[1.05rem] shrink-0 cursor-pointer accent-[var(--color-navy)]"
            />
            <span>
              <span className="block text-[0.95rem] font-semibold text-navy">{c.external}</span>
              <span className="block text-[0.85rem] leading-snug text-stone">{c.externalText}</span>
            </span>
          </label>
        </fieldset>
      )}

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
        <button
          ref={firstButton}
          type="button"
          onClick={() => decide(true)}
          className="inline-flex h-11 items-center justify-center rounded-md bg-navy px-4 text-[0.95rem] font-semibold text-white hover:bg-navy-deep"
        >
          {c.acceptAll}
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => decide(false)}
            className="inline-flex h-11 items-center justify-center rounded-md border border-navy px-3 text-[0.92rem] font-semibold text-navy hover:bg-navy hover:text-white"
          >
            {c.necessaryOnly}
          </button>
          {settings ? (
            <button
              type="button"
              onClick={() => decide(external)}
              className="inline-flex h-11 items-center justify-center rounded-md border border-line px-3 text-[0.92rem] font-semibold text-navy hover:border-navy"
            >
              {c.save}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setSettings(true)}
              aria-expanded={settings}
              className="inline-flex h-11 items-center justify-center rounded-md border border-line px-3 text-[0.92rem] font-semibold text-navy hover:border-navy"
            >
              {c.settings}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
