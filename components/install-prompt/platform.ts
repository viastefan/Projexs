/**
 * Welches Gerät, welcher Browser — und wie installiert man dort eine Web-App?
 * Ohne Abhängigkeiten; nur im Browser aufrufen.
 */

export type InstallPlatform =
  /** iPhone/iPad in Safari: Teilen → „Zum Home-Bildschirm“ */
  | 'ios'
  /** iPhone/iPad in Chrome, Edge, Firefox (ab iOS 16.4): Teilen-Knopf oben → „Zum Home-Bildschirm“ */
  | 'ios-other'
  /** Android (Chrome, Edge, Samsung): Ein-Tipp-Installation oder Menü → „App installieren“ */
  | 'android'
  /** Mac in Safari 17+: Teilen → „Zum Dock hinzufügen“ */
  | 'mac-safari'
  /** Chrome/Edge am Computer: Installieren-Symbol in der Adressleiste */
  | 'desktop'
  /** Browser ohne Installation (z. B. Firefox am Computer) */
  | 'unsupported';

export interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

declare global {
  interface Window {
    __installPromptEvent?: BeforeInstallPromptEvent | null;
  }
}

export function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: window-controls-overlay)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function detectPlatform(): InstallPlatform {
  const agent = navigator.userAgent;
  const touchMac = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  if (/iPhone|iPad|iPod/.test(agent) || touchMac) {
    return /CriOS|FxiOS|EdgiOS|OPiOS/.test(agent) ? 'ios-other' : 'ios';
  }
  if (/Android/.test(agent)) return 'android';
  const chromium = /Chrome\/|Edg\//.test(agent) && !/OPR\//.test(agent);
  if (/Macintosh/.test(agent) && /Safari\//.test(agent) && !chromium) {
    const version = Number(/Version\/(\d+)/.exec(agent)?.[1] ?? 0);
    return version >= 17 ? 'mac-safari' : 'unsupported';
  }
  if (chromium) return 'desktop';
  return 'unsupported';
}

export function isPhone(platform: InstallPlatform): boolean {
  return platform === 'ios' || platform === 'ios-other' || platform === 'android';
}

/*
 * Chrome meldet die Installierbarkeit genau einmal, oft noch bevor React
 * fertig ist. Deshalb lauscht dieses Modul schon beim Laden und hebt das
 * Ereignis auf.
 */
const listeners = new Set<() => void>();

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    window.__installPromptEvent = event as BeforeInstallPromptEvent;
    listeners.forEach((notify) => notify());
  });
  window.addEventListener('appinstalled', () => {
    window.__installPromptEvent = null;
    listeners.forEach((notify) => notify());
  });
}

export function onInstallAvailabilityChange(notify: () => void): () => void {
  listeners.add(notify);
  return () => listeners.delete(notify);
}

export function deferredPrompt(): BeforeInstallPromptEvent | null {
  return window.__installPromptEvent ?? null;
}

/** Öffnet das Pop-up von überall, z. B. aus einem Menüpunkt „App installieren“. */
export const OPEN_EVENT = 'install-prompt:open';

export function openInstallPrompt(): void {
  window.dispatchEvent(new Event(OPEN_EVENT));
}
