import { unstable_cache } from "next/cache";
import { draftMode } from "next/headers";
import { cache } from "react";
import { signPreview } from "@/lib/auth/session";
import { getSettings } from "@/lib/cms/settings";
import { isStorageConfigured } from "@/lib/storage";

export const SITE_STATUS_TAG = "site-status";

/*
 * Freigabe: Solange sie fehlt, sehen Besucher nur einen kurzen Hinweis mit den
 * Kontaktdaten. Daniela (und wer den Vorschau-Link hat) sieht die ganze
 * Website über den Draft Mode von Next.
 */
const isReleased = unstable_cache(
  async (): Promise<boolean> => Boolean((await getSettings()).publishedAt),
  ["site-release-v1"],
  { tags: [SITE_STATUS_TAG], revalidate: 3600 },
);

export type SiteView = { live: boolean; preview: boolean };

/** Was diese Anfrage zu sehen bekommt: die Website, die Vorschau oder den Pausenhinweis. */
export const siteView = cache(async (): Promise<SiteView> => {
  // Ohne Speicher gibt es keine Freigabe — die Website ist dann einfach online.
  if (!isStorageConfigured()) return { live: true, preview: false };
  const [live, draft] = await Promise.all([isReleased(), draftMode()]);
  return { live, preview: draft.isEnabled };
});

/** Ist die Website für diese Anfrage online (oder in der Vorschau)? */
export async function isSiteOnline(): Promise<boolean> {
  const view = await siteView();
  return view.live || view.preview;
}

/** Pausiert und keine Vorschau? */
export async function sitePaused(): Promise<boolean> {
  return !(await isSiteOnline());
}

/** So lange gilt ein Vorschau-Link zum Weitergeben. */
const SHARE_DAYS = 14;

/**
 * Vorschau-Link für andere, z. B. per Mail. Gilt bis zum Ende des Tages in
 * 14 Tagen — so bleibt er einen Tag lang derselbe.
 */
export async function sharePreviewLink(origin: string): Promise<{ url: string; until: Date } | null> {
  const until = new Date();
  until.setDate(until.getDate() + SHARE_DAYS);
  until.setHours(23, 59, 59, 0);
  const exp = until.getTime();
  const sig = await signPreview(exp);
  if (!sig) return null;
  return { url: `${origin}/api/vorschau?bis=${exp}&sig=${sig}`, until };
}
