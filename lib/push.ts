import { createHash } from "node:crypto";
import webpush, { WebPushError } from "web-push";
import { site } from "@/content/site";
import { listAccounts } from "@/lib/auth/accounts";
import { PATHS } from "@/lib/cms/types";
import { nowIso } from "@/lib/cms/util";
import { privateBucket, StorageConflictError } from "@/lib/storage";

/**
 * Push-Benachrichtigungen der Admin-App.
 *
 * Jedes Gerät, auf dem Push eingeschaltet ist, hat ein Abo beim Push-Dienst
 * seines Browsers (Apple, Google, Mozilla, Microsoft). Die Nachricht enthält
 * keine Angaben aus der Anfrage, nur dass eine da ist.
 */

export interface DeviceSubscription {
  id: string;
  endpoint: string;
  keys: { p256dh: string; auth: string };
  accountId: string;
  /** Kurze Beschreibung für die Liste in den Einstellungen, z. B. „iPhone“. */
  device: string;
  createdAt: string;
}

export interface BrowserSubscription {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

export interface PushMessage {
  title: string;
  body: string;
  /** Seite der App, die sich beim Antippen öffnet. */
  url: string;
  /** Gleiches Tag ersetzt eine noch sichtbare Benachrichtigung statt eine zweite zu zeigen. */
  tag?: string;
}

interface VapidKeys {
  publicKey: string;
  privateKey: string;
}

export class PushError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PushError";
  }
}

/*
 * Nur an die Push-Dienste der Browserhersteller senden, nie an beliebige
 * Adressen. PUSH_TEST_HOSTS erweitert die Liste für lokale Tests.
 */
const PUSH_HOSTS = [
  "push.apple.com",
  "fcm.googleapis.com",
  "android.googleapis.com",
  "push.services.mozilla.com",
  "notify.windows.com",
];

function allowedHosts(): string[] {
  const extra = (process.env.PUSH_TEST_HOSTS ?? "")
    .split(",")
    .map((host) => host.trim())
    .filter(Boolean);
  return [...PUSH_HOSTS, ...extra];
}

export function isPushEndpoint(endpoint: string): boolean {
  let url: URL;
  try {
    url = new URL(endpoint);
  } catch {
    return false;
  }
  if (url.protocol !== "https:") return false;
  return allowedHosts().some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`));
}

function decodedLength(value: unknown): number {
  return typeof value === "string" && /^[A-Za-z0-9_-]+={0,2}$/.test(value) ? Buffer.from(value, "base64url").length : 0;
}

function subscriptionId(endpoint: string): string {
  return createHash("sha256").update(endpoint).digest("base64url").slice(0, 32);
}

// ---------- Schlüssel ----------

let storedKeys: Promise<VapidKeys> | null = null;

/**
 * Das Schlüsselpaar, mit dem sich die App bei den Push-Diensten ausweist.
 * Aus der Umgebung, wenn gesetzt — sonst beim ersten Bedarf erzeugt und im
 * privaten Speicher abgelegt.
 */
function vapidKeys(): Promise<VapidKeys> {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (publicKey && privateKey) return Promise.resolve({ publicKey, privateKey });
  storedKeys ??= loadOrCreateKeys().catch((error) => {
    storedKeys = null;
    throw error;
  });
  return storedKeys;
}

async function loadOrCreateKeys(): Promise<VapidKeys> {
  const bucket = privateBucket();
  const existing = await bucket.readJson<VapidKeys>(PATHS.vapid);
  if (existing) return existing.data;
  const fresh = webpush.generateVAPIDKeys();
  try {
    await bucket.writeJson(PATHS.vapid, fresh, { createOnly: true });
    return fresh;
  } catch (error) {
    if (!(error instanceof StorageConflictError)) throw error;
    const winner = await bucket.readJson<VapidKeys>(PATHS.vapid);
    if (!winner) throw error;
    return winner.data;
  }
}

export async function vapidPublicKey(): Promise<string> {
  return (await vapidKeys()).publicKey;
}

function vapidSubject(): string {
  return process.env.VAPID_SUBJECT || site.url;
}

// ---------- Abos ----------

export async function saveSubscription(
  input: BrowserSubscription & { device: string },
  accountId: string,
): Promise<DeviceSubscription> {
  if (!isPushEndpoint(input.endpoint)) {
    throw new PushError("Dieser Browser nutzt einen unbekannten Push-Dienst.");
  }
  if (decodedLength(input.keys?.p256dh) !== 65 || decodedLength(input.keys?.auth) !== 16) {
    throw new PushError("Das Abo des Browsers ist unvollständig.");
  }

  const id = subscriptionId(input.endpoint);
  const bucket = privateBucket();
  const existing = await bucket.readJson<DeviceSubscription>(PATHS.pushSubscription(id));
  const record: DeviceSubscription = {
    id,
    endpoint: input.endpoint,
    keys: { p256dh: input.keys.p256dh, auth: input.keys.auth },
    accountId,
    device: input.device.trim().slice(0, 60) || "Gerät",
    createdAt: existing?.data.createdAt ?? nowIso(),
  };
  const unchanged =
    existing &&
    existing.data.accountId === record.accountId &&
    existing.data.keys.p256dh === record.keys.p256dh &&
    existing.data.keys.auth === record.keys.auth &&
    existing.data.device === record.device;
  if (!unchanged) await bucket.writeJson(PATHS.pushSubscription(id), record);
  return record;
}

export async function listSubscriptions(): Promise<DeviceSubscription[]> {
  const bucket = privateBucket();
  const { files } = await bucket.list(PATHS.pushPrefix, { limit: 500 });
  const docs = await Promise.all(files.map((file) => bucket.readJson<DeviceSubscription>(file.pathname)));
  return docs.flatMap((doc) => (doc ? [doc.data] : []));
}

export async function removeSubscriptionById(id: string): Promise<void> {
  await privateBucket().remove([PATHS.pushSubscription(id)]);
}

export async function findSubscription(endpoint: string): Promise<DeviceSubscription | null> {
  const doc = await privateBucket().readJson<DeviceSubscription>(PATHS.pushSubscription(subscriptionId(endpoint)));
  return doc?.data ?? null;
}

// ---------- Versand ----------

export interface PushResult {
  sent: number;
  failed: number;
  removed: number;
}

export async function sendPush(
  message: PushMessage,
  filter: (subscription: DeviceSubscription) => boolean = () => true,
): Promise<PushResult> {
  const all = await listSubscriptions();
  if (all.length === 0) return { sent: 0, failed: 0, removed: 0 };

  const accountIds = new Set((await listAccounts()).map((account) => account.id));
  const orphaned = all.filter((subscription) => !accountIds.has(subscription.accountId));
  const targets = all.filter((subscription) => accountIds.has(subscription.accountId) && filter(subscription));

  const { publicKey, privateKey } = await vapidKeys();
  const payload = JSON.stringify(message);
  const results = await Promise.allSettled(
    targets.map((subscription) =>
      webpush.sendNotification({ endpoint: subscription.endpoint, keys: subscription.keys }, payload, {
        vapidDetails: { subject: vapidSubject(), publicKey, privateKey },
        TTL: 3 * 24 * 60 * 60,
        urgency: "high",
        timeout: 8000,
      }),
    ),
  );

  const gone = [...orphaned];
  let sent = 0;
  let failed = 0;
  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      sent++;
      return;
    }
    const error = result.reason;
    if (error instanceof WebPushError && (error.statusCode === 404 || error.statusCode === 410)) {
      gone.push(targets[index]);
      return;
    }
    failed++;
    const detail = error instanceof WebPushError ? `${error.statusCode} ${error.body}` : String(error);
    console.error(`[Push] Zustellung an ${targets[index].device} fehlgeschlagen: ${detail}`);
  });

  if (gone.length > 0) {
    await privateBucket()
      .remove(gone.map((subscription) => PATHS.pushSubscription(subscription.id)))
      .catch((error) => console.error("[Push] Aufräumen fehlgeschlagen:", error));
  }
  return { sent, failed, removed: gone.length };
}

/** Benachrichtigung zu einer neuen Anfrage — ohne deren Inhalt. */
export function sendInquiryPush(key: string): Promise<PushResult> {
  return sendPush({
    title: "Neue Anfrage",
    body: "Über die Website ist eine neue Projektanfrage eingegangen.",
    url: `/admin/anfragen/${key}`,
    tag: `anfrage-${key}`,
  });
}
