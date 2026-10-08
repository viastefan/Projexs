'use client';

import styles from './install-demo.module.css';

export type DemoKind = 'ios' | 'android' | 'desktop' | 'mac';

/*
 * Kurzer Film in Dauerschleife, gebaut aus HTML und CSS statt als Video:
 * gestochen scharf, ohne Ladezeit, mit dem echten App-Symbol. Die Schritte
 * daneben (InstallSteps) laufen mit derselben Dauer und leuchten synchron auf.
 */

function ShareGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3v12M7.5 7.5 12 3l4.5 4.5" />
      <path d="M8 10H6.5A1.5 1.5 0 0 0 5 11.5v8A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 17.5 10H16" />
    </svg>
  );
}

function AddGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <path d="M12 8.5v7M8.5 12h7" />
    </svg>
  );
}

function InstallGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M12 7.5v6M9.5 11l2.5 2.5 2.5-2.5M8 21h8" />
    </svg>
  );
}

function MiniPage({ icon, name }: { icon: string; name: string }) {
  return (
    <div className={styles.page}>
      {/* eslint-disable-next-line @next/next/no-img-element -- Vorschau im Film */}
      <img className={styles.pageIcon} src={icon} alt="" />
      <span className={styles.pageTitle}>{name}</span>
      <span className={styles.pageLine} />
      <span className={`${styles.pageLine} ${styles.short}`} />
      <span className={styles.pageField} />
      <span className={styles.pageField} />
      <span className={styles.pageButton} />
    </div>
  );
}

function HomeScreen({ icon, name, dock = false }: { icon: string; name: string; dock?: boolean }) {
  return (
    <div className={`${styles.layer} ${styles.home}`}>
      <div className={styles.homeGrid}>
        {Array.from({ length: 11 }, (_, index) => (
          <span key={index} className={styles.homeApp} style={{ '--hue': `${(index * 37) % 360}` } as React.CSSProperties} />
        ))}
        <span className={styles.homeNew}>
          {/* eslint-disable-next-line @next/next/no-img-element -- Vorschau im Film */}
          <img src={icon} alt="" />
          <span>{name}</span>
        </span>
      </div>
      {dock ? null : <span className={styles.homeDock} />}
    </div>
  );
}

export function InstallDemo({ kind, icon, name }: { kind: DemoKind; icon: string; name: string }) {
  if (kind === 'desktop' || kind === 'mac') {
    const safari = kind === 'mac';
    return (
      <div className={`${styles.stage} ${styles.desktopStage}`} aria-hidden="true">
        <div className={styles.window}>
          <div className={styles.windowBar}>
            <span className={styles.lights}>
              <i />
              <i />
              <i />
            </span>
            <span className={styles.address}>
              <span>anna-kipp-menke-beratung.de/admin</span>
              {safari ? null : (
                <span className={styles.addressInstall}>
                  <InstallGlyph />
                </span>
              )}
            </span>
            {safari ? (
              <span className={styles.windowShare}>
                <ShareGlyph />
              </span>
            ) : null}
          </div>
          <div className={styles.windowBody}>
            <MiniPage icon={icon} name={name} />
          </div>
          <div className={`${styles.popover} ${safari ? styles.popoverSafari : ''}`}>
            {safari ? (
              <>
                <span className={styles.popoverRow}>Kopieren</span>
                <span className={`${styles.popoverRow} ${styles.popoverHit}`}>
                  <AddGlyph /> Zum Dock hinzufügen …
                </span>
                <span className={styles.popoverRow}>Nachrichten</span>
              </>
            ) : (
              <>
                <span className={styles.popoverHead}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- Vorschau im Film */}
                  <img src={icon} alt="" />
                  <span>
                    <b>App installieren?</b>
                    <small>{name}</small>
                  </span>
                </span>
                <span className={styles.popoverActions}>
                  <span>Abbrechen</span>
                  <span className={styles.popoverPrimary}>Installieren</span>
                </span>
              </>
            )}
          </div>
          <span className={`${styles.tap} ${styles.tapD1} ${safari ? styles.tapSafari1 : ''}`} />
          <span className={`${styles.tap} ${styles.tapD2} ${safari ? styles.tapSafari2 : ''}`} />
        </div>
        <div className={styles.appWindow}>
          <div className={styles.windowBar}>
            <span className={styles.lights}>
              <i />
              <i />
              <i />
            </span>
            <span className={styles.appWindowTitle}>{name}</span>
          </div>
          <div className={styles.windowBody}>
            <MiniPage icon={icon} name={name} />
          </div>
        </div>
        {safari ? (
          <div className={styles.dock}>
            {Array.from({ length: 5 }, (_, index) => (
              <span key={index} style={{ '--hue': `${(index * 61) % 360}` } as React.CSSProperties} />
            ))}
            {/* eslint-disable-next-line @next/next/no-img-element -- Vorschau im Film */}
            <img src={icon} alt="" />
          </div>
        ) : null}
      </div>
    );
  }

  const android = kind === 'android';
  return (
    <div className={styles.stage} aria-hidden="true">
      <div className={styles.phone}>
        <div className={styles.screen}>
          <div className={styles.status}>
            <span>9:41</span>
            {android ? null : <span className={styles.island} />}
            <span className={styles.statusIcons} />
          </div>

          {android ? (
            <div className={styles.chromeBar}>
              <span className={styles.chromeUrl}>anna-kipp-menke…</span>
              <span className={styles.chromeMore}>⋮</span>
            </div>
          ) : null}

          <MiniPage icon={icon} name={name} />

          {android ? null : (
            <div className={styles.safariBar}>
              <span className={styles.safariBack}>‹</span>
              <span className={styles.safariUrl}>anna-kipp-menke…</span>
              <span className={styles.safariMore}>···</span>
            </div>
          )}

          {android ? (
            <>
              <div className={`${styles.layer} ${styles.chromeMenu}`}>
                <span>Neuer Tab</span>
                <span>Lesezeichen</span>
                <span>Verlauf</span>
                <span className={styles.menuHit}>
                  <InstallGlyph /> App installieren
                </span>
                <span>Einstellungen</span>
              </div>
              <div className={`${styles.layer} ${styles.androidDialog}`}>
                {/* eslint-disable-next-line @next/next/no-img-element -- Vorschau im Film */}
                <img src={icon} alt="" />
                <b>App installieren</b>
                <small>{name}</small>
                <span className={styles.androidActions}>
                  <span>Abbrechen</span>
                  <span className={styles.androidPrimary}>Installieren</span>
                </span>
              </div>
            </>
          ) : (
            <>
              <div className={`${styles.layer} ${styles.iosMenu}`}>
                <span className={styles.menuHit}>
                  <ShareGlyph /> Teilen
                </span>
                <span>Zu Favoriten</span>
                <span>Tab-Übersicht</span>
              </div>
              <div className={`${styles.layer} ${styles.iosSheet}`}>
                <span className={styles.grabber} />
                <span className={styles.sheetHead}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- Vorschau im Film */}
                  <img src={icon} alt="" />
                  <span>{name}</span>
                </span>
                <span className={styles.sheetRow}>Kopieren</span>
                <span className={styles.sheetRow}>Zur Leseliste</span>
                <span className={`${styles.sheetRow} ${styles.sheetHit}`}>
                  Zum Home-Bildschirm <AddGlyph />
                </span>
              </div>
              <div className={`${styles.layer} ${styles.iosAdd}`}>
                <span className={styles.addBar}>
                  <span>Abbrechen</span>
                  <b>Hinzufügen</b>
                </span>
                <span className={styles.addCard}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- Vorschau im Film */}
                  <img src={icon} alt="" />
                  <span>
                    <b>{name}</b>
                    <small>anna-kipp-menke…</small>
                  </span>
                </span>
                <span className={styles.addToggle}>
                  Als Web-App öffnen <i />
                </span>
              </div>
            </>
          )}

          <HomeScreen icon={icon} name={name} />

          <span className={`${styles.tap} ${android ? styles.tapA1 : styles.tapI1}`} />
          <span className={`${styles.tap} ${android ? styles.tapA2 : styles.tapI2}`} />
          <span className={`${styles.tap} ${android ? styles.tapA3 : styles.tapI3}`} />
          {android ? null : <span className={`${styles.tap} ${styles.tapI4}`} />}
          <span className={styles.homeIndicator} />
        </div>
      </div>
    </div>
  );
}

export const DEMO_STEPS: Record<DemoKind, { title: string; text: string }[]> = {
  ios: [
    { title: 'Teilen öffnen', text: 'Unten auf „···“ und dann „Teilen“ tippen — bei älteren iPhones direkt auf das Teilen-Symbol.' },
    { title: 'Zum Home-Bildschirm', text: 'In der Liste „Zum Home-Bildschirm“ wählen (evtl. etwas nach unten scrollen).' },
    { title: 'Hinzufügen', text: 'Oben rechts auf „Hinzufügen“ tippen. Fertig — die App liegt jetzt auf dem Home-Bildschirm.' },
  ],
  android: [
    { title: 'Menü öffnen', text: 'Oben rechts auf die drei Punkte „⋮“ tippen.' },
    { title: 'App installieren', text: '„App installieren“ oder „Zum Startbildschirm hinzufügen“ wählen.' },
    { title: 'Bestätigen', text: 'Auf „Installieren“ tippen. Die App erscheint auf dem Startbildschirm.' },
  ],
  desktop: [
    { title: 'Symbol anklicken', text: 'Rechts in der Adressleiste auf das Installieren-Symbol klicken.' },
    { title: 'Installieren', text: 'Im kleinen Fenster „Installieren“ wählen.' },
    { title: 'Fertig', text: 'Die App öffnet sich im eigenen Fenster und liegt im Dock bzw. Startmenü.' },
  ],
  mac: [
    { title: 'Teilen öffnen', text: 'In Safari oben rechts auf das Teilen-Symbol klicken (oder Menü „Ablage“).' },
    { title: 'Zum Dock hinzufügen', text: '„Zum Dock hinzufügen …“ wählen und bestätigen.' },
    { title: 'Fertig', text: 'Die App liegt im Dock und öffnet sich im eigenen Fenster.' },
  ],
};

export function InstallSteps({ kind }: { kind: DemoKind }) {
  const phone = kind === 'ios' || kind === 'android';
  return (
    <ol className={`${styles.steps} ${phone ? '' : styles.stepsDesktop}`}>
      {DEMO_STEPS[kind].map((step, index) => (
        <li key={step.title} className={styles[`step${index + 1}${kind === 'ios' ? 'Ios' : ''}`]}>
          <span className={styles.stepNumber}>{index + 1}</span>
          <span>
            <b>{step.title}</b>
            <span>{step.text}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
