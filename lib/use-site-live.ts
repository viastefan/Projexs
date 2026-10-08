"use client";

import { useState } from "react";

export type SiteLiveState = "idle" | "busy" | "done" | "error" | "login";

/* Der Ladebalken soll kurz sichtbar sein, auch wenn der Server schneller ist. */
const MIN_BUSY_MS = 1400;

/** Veröffentlichen oder pausieren über /api/admin/website — mit Ladezustand und Ergebnis. */
export function useSiteLive() {
  const [state, setState] = useState<SiteLiveState>("idle");

  async function run(live: boolean): Promise<boolean> {
    setState("busy");
    const started = Date.now();
    let next: SiteLiveState = "error";
    try {
      const response = await fetch("/api/admin/website", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ live }),
      });
      next = response.ok ? "done" : response.status === 401 ? "login" : "error";
    } catch {
      next = "error";
    }
    await new Promise((resolve) => setTimeout(resolve, Math.max(0, MIN_BUSY_MS - (Date.now() - started))));
    setState(next);
    return next === "done";
  }

  return { state, run };
}
