import { timingSafeEqual } from "node:crypto";
import { purgeExpiredInquiries } from "@/lib/cms/inquiries";
import { getSettings } from "@/lib/cms/settings";
import { isStorageConfigured } from "@/lib/storage";

export const dynamic = "force-dynamic";

/**
 * Täglicher Lauf (vercel.json → crons): löscht erledigte Anfragen nach Ablauf
 * der eingestellten Frist — auch wenn tagelang niemand die App öffnet. Vercel
 * schickt das CRON_SECRET als Bearer-Token mit, sobald die Variable gesetzt ist.
 */
function cronAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  // Zeitkonstant vergleichen: Die Antwortzeit verrät nichts über das Geheimnis.
  const given = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function GET(request: Request) {
  if (!cronAuthorized(request)) {
    return Response.json({ error: "Nicht berechtigt." }, { status: 401 });
  }
  if (!isStorageConfigured()) return Response.json({ skipped: "Speicher nicht eingerichtet." });
  const { retentionMonths } = await getSettings();
  try {
    const deleted = await purgeExpiredInquiries(retentionMonths);
    return Response.json({ deleted, retentionMonths });
  } catch (error) {
    console.error("[Aufbewahrung] Löschen fehlgeschlagen:", error);
    return Response.json({ error: "Löschen fehlgeschlagen." }, { status: 500 });
  }
}
