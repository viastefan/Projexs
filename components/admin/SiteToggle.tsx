'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ReleaseDialog } from '@/components/admin-site/ReleaseDialog';
import styles from './SiteRelease.module.css';

/*
 * Schalter „Website online“: an = für alle sichtbar, aus = Pausenseite.
 * Umlegen fragt erst nach (Blatt am Handy, Fenster am Computer), dann
 * Ladebalken und Bestätigung; der Schalter springt erst nach dem Erfolg um.
 */
export function SiteToggle({ live }: { live: boolean }) {
  const router = useRouter();
  const [on, setOn] = useState(live);
  // Ziel beim Öffnen festhalten: Das Fenster zeigt bis zum Schluss dieselbe Aktion.
  const [target, setTarget] = useState<boolean | null>(null);

  return (
    <>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label="Website online"
        className={styles.switch}
        data-on={on ? 'true' : 'false'}
        onClick={() => setTarget(!on)}
      >
        <span className={styles.knob} aria-hidden="true" />
      </button>
      {target !== null ? (
        <ReleaseDialog
          live={target}
          onClose={() => setTarget(null)}
          onSuccess={() => setOn(target)}
          onDone={() => {
            setTarget(null);
            router.refresh();
          }}
        />
      ) : null}
    </>
  );
}
