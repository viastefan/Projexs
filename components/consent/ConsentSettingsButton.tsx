"use client";

import { openConsentSettings } from "./consent";

/** Öffnet den Datenschutz-Banner erneut (Footer-Link „Cookie-Einstellungen“). */
export function ConsentSettingsButton({ label, className }: { label: string; className?: string }) {
  return (
    <button type="button" onClick={openConsentSettings} className={className}>
      {label}
    </button>
  );
}
