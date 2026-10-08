import { privateBucket, updateJson } from "@/lib/storage";
import { PATHS, type Inquiry, type InquiryReply, type InquirySource, type InquiryStatus } from "./types";
import { newId, nowIso } from "./util";

const KEY_PATTERN = /^\d{13}-[A-Za-z0-9_-]{8,24}$/;
const MAX_TS = 9_999_999_999_999;

export function isInquiryKey(value: string): boolean {
  return KEY_PATTERN.test(value);
}

/** Umgekehrter Zeitstempel vorn: Die Liste kommt so schon neueste-zuerst an. */
function newKey(): string {
  return `${String(MAX_TS - Date.now()).padStart(13, "0")}-${newId(9)}`;
}

async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const index = next++;
      results[index] = await fn(items[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

export interface NewInquiry {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  topic: string;
  timeframe: string;
  message: string;
  source: InquirySource;
  locale: "de" | "en";
}

export function inquiryName(inquiry: Pick<Inquiry, "firstName" | "lastName">): string {
  return `${inquiry.firstName} ${inquiry.lastName}`.trim();
}

export async function createInquiry(input: NewInquiry): Promise<Inquiry> {
  const now = nowIso();
  const inquiry: Inquiry = {
    key: newKey(),
    createdAt: now,
    ...input,
    status: "neu",
    read: false,
    consent: { at: now },
  };
  const bucket = privateBucket();
  await bucket.writeJson(PATHS.inquiry(inquiry.key), inquiry, { createOnly: true });
  try {
    await bucket.writeJson(PATHS.unreadMarker(inquiry.key), {});
  } catch (error) {
    console.error("[Anfragen] Ungelesen-Markierung fehlgeschlagen:", error);
  }
  return inquiry;
}

/**
 * Ungelesene Anfragen tragen eine leere Markierungsdatei. Der Zähler in der
 * Navigation braucht so nur einen Listenaufruf statt jede Anfrage zu lesen.
 */
export async function unreadCount(): Promise<number> {
  const { files } = await privateBucket().list(PATHS.unreadPrefix, { limit: 1000 });
  return files.length;
}

async function clearUnread(key: string): Promise<void> {
  await privateBucket().remove([PATHS.unreadMarker(key)]);
}

async function readAll(limit?: number): Promise<Inquiry[]> {
  const bucket = privateBucket();
  const pathnames: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await bucket.list(PATHS.inquiriesPrefix, { limit: 500, cursor });
    pathnames.push(...page.files.map((file) => file.pathname));
    cursor = page.cursor;
  } while (cursor && (!limit || pathnames.length < limit));

  const selected = pathnames.sort().slice(0, limit ?? pathnames.length);
  const docs = await mapLimit(selected, 12, (pathname) => bucket.readJson<Inquiry>(pathname));
  return docs.flatMap((doc) => (doc ? [doc.data] : []));
}

export function listInquiries(limit = 200): Promise<Inquiry[]> {
  return readAll(limit);
}

export async function getInquiry(key: string): Promise<Inquiry | null> {
  if (!isInquiryKey(key)) return null;
  const doc = await privateBucket().readJson<Inquiry>(PATHS.inquiry(key));
  return doc ? doc.data : null;
}

export async function updateInquiry(key: string, change: (inquiry: Inquiry) => Inquiry): Promise<Inquiry | null> {
  const current = await getInquiry(key);
  if (!current) return null;
  return updateJson<Inquiry>(PATHS.inquiry(key), () => current, change);
}

export async function setInquiryStatus(key: string, status: InquiryStatus) {
  await clearUnread(key);
  return updateInquiry(key, (inquiry) => ({
    ...inquiry,
    status,
    read: true,
    readAt: inquiry.readAt ?? nowIso(),
    doneAt: status === "erledigt" ? (inquiry.doneAt ?? nowIso()) : undefined,
  }));
}

export async function markInquiryRead(key: string) {
  const current = await getInquiry(key);
  if (!current || current.read) return current;
  await clearUnread(key);
  return updateInquiry(key, (inquiry) => (inquiry.read ? inquiry : { ...inquiry, read: true, readAt: nowIso() }));
}

export async function markInquiryUnread(key: string) {
  const current = await getInquiry(key);
  if (!current) return null;
  await privateBucket().writeJson(PATHS.unreadMarker(key), {});
  return updateInquiry(key, (inquiry) => ({ ...inquiry, read: false, readAt: undefined }));
}

/** Gesendete Antwort festhalten — die Anfrage gilt damit als in Bearbeitung. */
export async function addInquiryReply(key: string, reply: InquiryReply) {
  await clearUnread(key);
  return updateInquiry(key, (inquiry) => ({
    ...inquiry,
    status: inquiry.status === "neu" ? "in Bearbeitung" : inquiry.status,
    read: true,
    readAt: inquiry.readAt ?? reply.at,
    replies: [...(inquiry.replies ?? []), reply],
  }));
}

export function setInquiryNote(key: string, note: string) {
  return updateInquiry(key, (inquiry) => ({ ...inquiry, note: note.trim().slice(0, 2000) || undefined }));
}

export async function deleteInquiry(key: string): Promise<void> {
  if (!isInquiryKey(key)) return;
  await privateBucket().remove([PATHS.inquiry(key), PATHS.unreadMarker(key)]);
}

/**
 * Speicherbegrenzung: Erledigte Anfragen verschwinden nach der eingestellten
 * Frist von selbst. Offene bleiben, bis sie jemand bearbeitet hat.
 */
export async function purgeExpiredInquiries(retentionMonths: number): Promise<number> {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - retentionMonths);
  const all = await readAll();
  const expired = all.filter((inquiry) => {
    if (inquiry.status !== "erledigt") return false;
    const closedAt = Date.parse(inquiry.doneAt ?? inquiry.readAt ?? inquiry.createdAt);
    return closedAt < cutoff.getTime();
  });
  if (expired.length > 0) {
    await privateBucket().remove(
      expired.flatMap((inquiry) => [PATHS.inquiry(inquiry.key), PATHS.unreadMarker(inquiry.key)]),
    );
  }
  return expired.length;
}
