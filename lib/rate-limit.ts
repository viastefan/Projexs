import { createHash } from "node:crypto";
import { headers } from "next/headers";

/**
 * Einfache Bremse gegen Massenanfragen: zählt pro Absender (gekürzter Hash der
 * IP, nie die IP selbst) im Speicher der laufenden Serverinstanz.
 */

const buckets = new Map<string, number[]>();

async function clientKey(scope: string): Promise<string> {
  const incoming = await headers();
  const ip = incoming.get("x-real-ip") ?? incoming.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unbekannt";
  return `${scope}:${createHash("sha256").update(ip).digest("base64url").slice(0, 16)}`;
}

/** true, solange der Absender unter `max` Versuchen in `windowMs` liegt — zählt den Versuch dabei mit. */
export async function withinLimit(scope: string, max: number, windowMs: number): Promise<boolean> {
  const key = await clientKey(scope);
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((at) => now - at < windowMs);
  const allowed = recent.length < max;
  if (allowed) recent.push(now);
  buckets.set(key, recent);

  if (buckets.size > 5000) {
    for (const [entry, times] of buckets) {
      if (times.every((at) => now - at >= windowMs)) buckets.delete(entry);
    }
  }
  return allowed;
}
