'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { InstallDemo, InstallSteps, type DemoKind } from './InstallDemo';
import styles from './install-prompt.module.css';
import {
  deferredPrompt,
  detectPlatform,
  isPhone,
  isStandalone,
  OPEN_EVENT,
  onInstallAvailabilityChange,
  type InstallPlatform,
} from './platform';

/**
 * Pop-up „App installieren“ für jede Web-App (PWA).
 *
 * - erkennt iPhone, Android, Mac und Windows und zeigt die passende Anleitung
 *   als kurzen Film; Chrome/Edge installieren mit einem Klick
 * - erscheint beim ersten Besuch von selbst, danach als schmales Banner
 * - am Computer mit QR-Code und Link, um die App aufs Handy zu holen
 * - bleibt weg, sobald die App installiert geöffnet wird
 *
 * Einbinden und anpassen: siehe README.md in diesem Ordner.
 */
export interface InstallPromptProps {
  appName: string;
  /** Quadratisches App-Symbol (mind. 192 px) */
  appIcon: string;
  tagline?: string;
  /** Drei kurze Vorteile, erscheinen als Häkchen-Liste */
  features?: string[];
  /** Adresse für QR-Code, „Link kopieren“ und E-Mail; Standard: Startseite der App */
  shareUrl?: string;
  /** Pfad, unter dem die App startet — für die Standard-Adresse */
  startPath?: string;
  /** Akzentfarbe (Knöpfe, Schrittnummern) */
  accent?: string;
  /** Echte Bildschirmaufnahmen statt des eingebauten Films, je Plattform */
  videos?: Partial<Record<DemoKind, string>>;
  /** Eigener Schlüssel im localStorage — pro App verschieden wählen */
  storageKey?: string;
  /** Wie lange nach dem Laden das Pop-up von selbst aufgeht */
  autoOpenDelayMs?: number;
  /** Nach „Später“ so viele Tage nur das Banner zeigen */
  snoozeDays?: number;
  /** Höchstens so oft von selbst öffnen */
  maxAutoOpens?: number;
  /** Schmales Banner nach „Später“ zeigen */
  banner?: boolean;
  /** Abstand des Banners vom unteren Rand (CSS), z. B. über einer Tab-Leiste */
  bannerBottom?: string;
}

interface Memory {
  dismissedAt?: number;
  autoOpens?: number;
}

const DAY = 24 * 60 * 60 * 1000;

function readMemory(key: string): Memory {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '{}') as Memory;
  } catch {
    return {};
  }
}

function writeMemory(key: string, memory: Memory) {
  try {
    localStorage.setItem(key, JSON.stringify(memory));
  } catch {
    // ohne Speicher erscheint das Pop-up eben erneut
  }
}

function demoKindFor(platform: InstallPlatform): DemoKind {
  if (platform === 'ios' || platform === 'ios-other') return 'ios';
  if (platform === 'android') return 'android';
  if (platform === 'mac-safari') return 'mac';
  return 'desktop';
}

const noSubscription = () => () => {};
type Env = { platform: InstallPlatform; installed: boolean } | null;
let envCache: Env = null;
function readEnv(): Env {
  envCache ??= { platform: detectPlatform(), installed: isStandalone() };
  return envCache;
}

function Check() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="m5 10.5 3.2 3.2L15 7" />
    </svg>
  );
}

function QrCode({ url }: { url: string }) {
  const [svg, setSvg] = useState('');
  useEffect(() => {
    let cancelled = false;
    import('qrcode')
      .then((qr) =>
        qr.toString(url, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#111111', light: '#0000' } }),
      )
      .then((markup) => !cancelled && setSvg(markup))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [url]);
  return (
    <div
      className={styles.qr}
      role="img"
      aria-label={`QR-Code für ${url}`}
      // Das SVG stammt aus der QR-Bibliothek, nicht aus Nutzereingaben.
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export function InstallPrompt({
  appName,
  appIcon,
  tagline = 'Auf dem Home-Bildschirm, im Vollbild, ohne App Store.',
  features = ['Startet wie eine App', 'Mitteilungen aufs Handy', 'Immer die neueste Version'],
  shareUrl,
  startPath = '/',
  accent = '#082078',
  videos = {},
  storageKey = 'install-prompt',
  autoOpenDelayMs = 1400,
  snoozeDays = 7,
  maxAutoOpens = 3,
  banner = true,
  bannerBottom,
}: InstallPromptProps) {
  const env = useSyncExternalStore(noSubscription, readEnv, () => null);
  const canPrompt = useSyncExternalStore(onInstallAvailabilityChange, () => deferredPrompt() !== null, () => false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [bannerShown, setBannerShown] = useState(false);
  const [kind, setKind] = useState<DemoKind | null>(null);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);

  const platform = env?.platform ?? 'desktop';
  const shownKind = kind ?? demoKindFor(platform);
  const url = shareUrl ?? (typeof window !== 'undefined' ? new URL(startPath, window.location.origin).href : startPath);

  const show = useCallback(() => {
    setClosing(false);
    setOpen(true);
    setBannerShown(false);
  }, []);

  // Beim ersten Besuch von selbst öffnen, sonst Banner
  useEffect(() => {
    if (!env || env.installed) return;
    const memory = readMemory(storageKey);
    const snoozed = memory.dismissedAt && Date.now() - memory.dismissedAt < snoozeDays * DAY;
    if (!snoozed && (memory.autoOpens ?? 0) < maxAutoOpens) {
      const timer = window.setTimeout(() => {
        writeMemory(storageKey, { ...memory, autoOpens: (memory.autoOpens ?? 0) + 1 });
        show();
      }, autoOpenDelayMs);
      return () => window.clearTimeout(timer);
    }
    // Banner nur in den Tagen nach „Später“ — danach fragt wieder das Pop-up (höchstens maxAutoOpens-mal)
    let hidden = false;
    try {
      hidden = sessionStorage.getItem(`${storageKey}:banner`) === 'aus';
    } catch {
      // egal
    }
    if (banner && snoozed && !hidden) {
      const timer = window.setTimeout(() => setBannerShown(true), 900);
      return () => window.clearTimeout(timer);
    }
  }, [env, storageKey, snoozeDays, maxAutoOpens, autoOpenDelayMs, banner, show]);

  // Von außen öffnen, z. B. aus den Einstellungen
  useEffect(() => {
    const handler = () => show();
    window.addEventListener(OPEN_EVENT, handler);
    const installed = () => setDone(true);
    window.addEventListener('appinstalled', installed);
    return () => {
      window.removeEventListener(OPEN_EVENT, handler);
      window.removeEventListener('appinstalled', installed);
    };
  }, [show]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const close = useCallback(() => {
    writeMemory(storageKey, { ...readMemory(storageKey), dismissedAt: Date.now() });
    setClosing(true);
    window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 260);
  }, [storageKey]);

  async function install() {
    const event = deferredPrompt();
    if (!event) return;
    await event.prompt();
    const { outcome } = await event.userChoice;
    window.__installPromptEvent = null;
    if (outcome === 'accepted') setDone(true);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Link kopieren:', url);
    }
  }

  async function share() {
    try {
      await navigator.share({ title: appName, url });
    } catch {
      // abgebrochen
    }
  }

  function hideBanner() {
    setBannerShown(false);
    try {
      sessionStorage.setItem(`${storageKey}:banner`, 'aus');
    } catch {
      // egal
    }
  }

  if (!env || env.installed) return null;

  const phone = isPhone(platform);
  const oneClick = canPrompt && (platform === 'android' || platform === 'desktop');
  const video = videos[shownKind];
  const tabs: { kind: DemoKind; label: string }[] = [
    { kind: 'ios', label: 'iPhone' },
    { kind: 'android', label: 'Android' },
    { kind: platform === 'mac-safari' ? 'mac' : 'desktop', label: 'Computer' },
  ];

  return (
    <>
      {bannerShown ? (
        <div className={styles.banner} style={{ '--ip-accent': accent, '--ip-banner-bottom': bannerBottom } as React.CSSProperties}>
          {/* eslint-disable-next-line @next/next/no-img-element -- App-Symbol */}
          <img src={appIcon} alt="" />
          <span className={styles.bannerText}>
            <b>{appName} installieren</b>
            <span>{phone ? 'Zum Home-Bildschirm' : 'Als App auf diesem Computer'}</span>
          </span>
          <button type="button" className={styles.bannerOpen} onClick={show}>
            {oneClick ? 'Installieren' : 'So geht’s'}
          </button>
          <button type="button" className={styles.bannerClose} onClick={hideBanner} aria-label="Banner schließen">
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="m6 6 8 8M14 6l-8 8" />
            </svg>
          </button>
        </div>
      ) : null}

      <dialog
        ref={dialogRef}
        className={`${styles.dialog} ${closing ? styles.closing : ''}`}
        style={{ '--ip-accent': accent } as React.CSSProperties}
        aria-labelledby="install-title"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        {open ? (
          <div className={styles.panel}>
            <span className={styles.grabber} aria-hidden="true" />
            <button type="button" className={styles.close} onClick={close} aria-label="Schließen">
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="m6 6 8 8M14 6l-8 8" />
              </svg>
            </button>

            <div className={`${styles.hero} ${shownKind === 'desktop' || shownKind === 'mac' ? styles.heroWide : ''}`}>
              <span className={styles.orb} aria-hidden="true" />
              <span className={`${styles.orb} ${styles.orb2}`} aria-hidden="true" />
              <span className={`${styles.orb} ${styles.orb3}`} aria-hidden="true" />
              {video ? (
                <video className={styles.video} src={video} autoPlay muted loop playsInline />
              ) : (
                <div className={styles.demo} key={shownKind}>
                  <InstallDemo kind={shownKind} icon={appIcon} name={appName} />
                </div>
              )}
            </div>

            <div className={styles.body}>
              <header className={styles.head}>
                {/* eslint-disable-next-line @next/next/no-img-element -- App-Symbol */}
                <img className={styles.icon} src={appIcon} alt="" />
                <div>
                  <h2 id="install-title" className={styles.title}>
                    {done ? `${appName} ist installiert` : `${appName} installieren`}
                  </h2>
                  <p className={styles.tagline}>
                    {done ? 'Sie finden die App jetzt auf dem Home-Bildschirm bzw. im Dock.' : tagline}
                  </p>
                </div>
              </header>

              {done ? null : (
                <>
                  <ul className={styles.features}>
                    {features.map((feature) => (
                      <li key={feature}>
                        <Check />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className={styles.tabs} role="tablist" aria-label="Anleitung für">
                    {tabs.map((tab) => (
                      <button
                        key={tab.label}
                        type="button"
                        role="tab"
                        aria-selected={shownKind === tab.kind}
                        className={styles.tab}
                        onClick={() => setKind(tab.kind)}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div key={shownKind} className={styles.steps}>
                    <InstallSteps kind={shownKind} />
                  </div>

                  {platform === 'unsupported' ? (
                    <p className={styles.note}>
                      Dieser Browser kann keine Apps installieren. Öffnen Sie die Seite in Chrome, Edge oder Safari —
                      oder holen Sie die App per QR-Code aufs Handy.
                    </p>
                  ) : null}

                  {!phone ? (
                    <div className={styles.handoff}>
                      <QrCode url={url} />
                      <div>
                        <b>Aufs Handy holen</b>
                        <span>Mit der Kamera scannen, im Browser öffnen, dann wie oben installieren.</span>
                        <span className={styles.linkRow}>
                          <button type="button" className={styles.link} onClick={copy}>
                            {copied ? 'Kopiert ✓' : 'Link kopieren'}
                          </button>
                          <a
                            className={styles.link}
                            href={`mailto:?subject=${encodeURIComponent(`${appName} installieren`)}&body=${encodeURIComponent(
                              `Hier geht es zur ${appName} — auf dem Handy öffnen und „Zum Home-Bildschirm“ wählen:\n\n${url}`,
                            )}`}
                          >
                            Per E-Mail senden
                          </a>
                        </span>
                      </div>
                    </div>
                  ) : null}
                </>
              )}

              <div className={styles.actions}>
                {done ? (
                  <button type="button" className={styles.primary} onClick={close}>
                    Fertig
                  </button>
                ) : oneClick ? (
                  <>
                    <button type="button" className={styles.primary} onClick={install}>
                      <svg viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M10 3v10M6 9l4 4 4-4M4 16h12" />
                      </svg>
                      Jetzt installieren
                    </button>
                    <button type="button" className={styles.secondary} onClick={close}>
                      Später
                    </button>
                  </>
                ) : (
                  <>
                    <button type="button" className={styles.primary} onClick={close}>
                      Alles klar
                    </button>
                    {phone && 'share' in navigator ? (
                      <button type="button" className={styles.secondary} onClick={share}>
                        Link teilen
                      </button>
                    ) : (
                      <button type="button" className={styles.secondary} onClick={close}>
                        Später
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
