/**
 * Browserseite von Push: Service Worker anmelden, Abo lesen, Gerät benennen.
 * Nur aus Client-Komponenten verwenden.
 */

const WORKER_URL = '/admin/sw.js';
const WORKER_SCOPE = '/admin';
const ENDPOINT_KEY = 'projexs-push-endpoint';

export type PushSupport = 'ok' | 'install' | 'unsupported' | 'denied';

function isAppleTouch(): boolean {
  // iPadOS meldet sich als Mac — erkennbar an den Touchpunkten.
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function isInstalled(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function pushSupport(): PushSupport {
  if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
    // iPhone und iPad können Push nur in der vom Home-Bildschirm gestarteten App.
    return isAppleTouch() && !isInstalled() ? 'install' : 'unsupported';
  }
  if (Notification.permission === 'denied') return 'denied';
  return 'ok';
}

export async function registerWorker(): Promise<ServiceWorkerRegistration> {
  await navigator.serviceWorker.register(WORKER_URL, { scope: WORKER_SCOPE });
  // Abonnieren geht erst, wenn der Worker aktiv ist.
  return navigator.serviceWorker.ready;
}

export async function currentSubscription(): Promise<PushSubscription | null> {
  const registration = await navigator.serviceWorker.getRegistration(WORKER_SCOPE);
  return (await registration?.pushManager.getSubscription()) ?? null;
}

export function keyBytes(base64url: string): Uint8Array<ArrayBuffer> {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='));
  const bytes = new Uint8Array(raw.length);
  for (let index = 0; index < raw.length; index++) bytes[index] = raw.charCodeAt(index);
  return bytes;
}

/** Wurde das Abo mit diesem Schlüssel angelegt? Nach neuen Schlüsseln taugt es nicht mehr. */
export function subscribedWithKey(subscription: PushSubscription, publicKey: string): boolean {
  const current = subscription.options.applicationServerKey;
  if (!current) return false;
  const a = new Uint8Array(current);
  const b = keyBytes(publicKey);
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

export function describeDevice(): string {
  const agent = navigator.userAgent;
  if (/iPhone/.test(agent)) return 'iPhone';
  if (/iPad/.test(agent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'iPad';
  const system = /Android/.test(agent)
    ? 'Android'
    : /Macintosh|Mac OS X/.test(agent)
      ? 'Mac'
      : /Windows/.test(agent)
        ? 'Windows'
        : /Linux/.test(agent)
          ? 'Linux'
          : 'Gerät';
  const browser = /Edg\//.test(agent)
    ? 'Edge'
    : /Firefox\//.test(agent)
      ? 'Firefox'
      : /Chrome\//.test(agent)
        ? 'Chrome'
        : /Safari\//.test(agent)
          ? 'Safari'
          : '';
  return browser ? `${browser} auf ${system}` : system;
}

/*
 * Das zuletzt eingetragene Abo dieses Browsers. Daran erkennt die App, ob der
 * Browser sein Abo inzwischen erneuert hat. Fehlt der Speicher (privates
 * Fenster), entfällt nur dieser Abgleich.
 */
export function storedEndpoint(): string | null {
  try {
    return localStorage.getItem(ENDPOINT_KEY);
  } catch {
    return null;
  }
}

export function rememberEndpoint(endpoint: string): void {
  try {
    localStorage.setItem(ENDPOINT_KEY, endpoint);
  } catch {
    // ohne Speicher kein Abgleich — Push funktioniert trotzdem
  }
}

export function forgetEndpoint(): void {
  try {
    localStorage.removeItem(ENDPOINT_KEY);
  } catch {
    // nichts zu tun
  }
}
