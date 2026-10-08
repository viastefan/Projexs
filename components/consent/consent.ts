import { useSyncExternalStore } from "react";

/**
 * Consent-Speicher (localStorage, fallback-sicher).
 * Die Website setzt selbst keine Tracking-Cookies; gespeichert wird nur,
 * ob externe Inhalte (Google Maps) geladen werden dürfen.
 */
export type Consent = {
  v: 1;
  necessary: true;
  external: boolean;
  ts: number;
};

export const CONSENT_KEY = "projexs:consent";
/** Wird ausgelöst, wenn sich die Einwilligung ändert. */
export const CONSENT_EVENT = "projexs:consent";
/** Öffnet den Banner erneut (z. B. über „Cookie-Einstellungen“ im Footer). */
export const CONSENT_OPEN_EVENT = "projexs:consent-open";

/** Fallback, wenn localStorage nicht verfügbar ist (z. B. privater Modus). */
let memoryFallback: Consent | null = null;

export function readConsent(): Consent | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return memoryFallback;
    const parsed = JSON.parse(raw) as Partial<Consent>;
    if (parsed?.v !== 1) return null;
    return { v: 1, necessary: true, external: Boolean(parsed.external), ts: Number(parsed.ts) || Date.now() };
  } catch {
    return memoryFallback;
  }
}

export function writeConsent(external: boolean): Consent {
  const consent: Consent = { v: 1, necessary: true, external, ts: Date.now() };
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  } catch {
    // Speicher nicht verfügbar (privater Modus o. ä.) – Auswahl gilt dann nur für diese Ansicht.
  }
  memoryFallback = consent;
  window.dispatchEvent(new CustomEvent<Consent>(CONSENT_EVENT, { detail: consent }));
  return consent;
}

export function openConsentSettings() {
  window.dispatchEvent(new CustomEvent(CONSENT_OPEN_EVENT));
}

/* ---------- React-Anbindung (useSyncExternalStore) ---------- */

let cachedRaw: string | null | undefined;
let cachedValue: Consent | null = null;

function snapshot(): Consent | null {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(CONSENT_KEY);
  } catch {
    raw = null;
  }
  if (raw !== cachedRaw || (raw === null && cachedValue !== memoryFallback)) {
    cachedRaw = raw;
    cachedValue = readConsent();
  }
  return cachedValue;
}

function subscribe(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/**
 * Aktuelle Einwilligung als React-Hook.
 * `undefined` = noch nicht bekannt (Server/Hydration), `null` = keine Auswahl gespeichert.
 */
export function useConsent(): Consent | null | undefined {
  return useSyncExternalStore(subscribe, snapshot, () => undefined);
}
