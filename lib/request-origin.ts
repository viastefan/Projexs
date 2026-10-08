import { headers } from "next/headers";
import { site } from "@/content/site";

/** Die Adresse, unter der diese Anfrage hereinkam — Vorschau, vercel.app oder Domain. */
export async function requestOrigin(): Promise<string> {
  const incoming = await headers();
  const host = incoming.get("x-forwarded-host") ?? incoming.get("host");
  if (!host) return site.url;
  const proto =
    incoming.get("x-forwarded-proto") ?? (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https");
  return `${proto}://${host}`;
}
