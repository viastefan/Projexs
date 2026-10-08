import { revalidatePath, revalidateTag } from "next/cache";
import { updateSettings } from "@/lib/cms/settings";
import { PATHS } from "@/lib/cms/types";
import { nowIso } from "@/lib/cms/util";
import { SITE_STATUS_TAG } from "@/lib/site-status";
import { readJson, updateJson } from "@/lib/storage";

export type ReleaseEvent = { at: string; action: "published" | "paused"; by: string };

interface ReleaseHistoryDoc {
  version: 1;
  items: ReleaseEvent[];
}

/* Verlauf der Freigaben: wer die Website wann veröffentlicht oder pausiert hat. */
const KEEP = 50;

export async function releaseHistory(): Promise<ReleaseEvent[]> {
  return (await readJson<ReleaseHistoryDoc>(PATHS.releaseHistory))?.items ?? [];
}

/** Website veröffentlichen oder pausieren — gilt sofort für alle Seiten und landet im Verlauf. */
export async function setSiteLive(live: boolean, by: string): Promise<void> {
  let changed = false;
  await updateSettings((current) => {
    changed = Boolean(current.publishedAt) !== live;
    return { ...current, publishedAt: live ? (current.publishedAt ?? nowIso()) : null };
  });
  if (changed) {
    const event: ReleaseEvent = { at: nowIso(), action: live ? "published" : "paused", by };
    await updateJson<ReleaseHistoryDoc>(PATHS.releaseHistory, () => ({ version: 1, items: [] }), (doc) => ({
      version: 1,
      items: [event, ...doc.items].slice(0, KEEP),
    }));
  }
  revalidateTag(SITE_STATUS_TAG, { expire: 0 });
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
}
