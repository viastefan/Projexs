'use client';

import { useState } from 'react';
import { ReleaseDialog } from './ReleaseDialog';
import styles from './PreviewBar.module.css';

/*
 * „Veröffentlichen“ direkt in der Vorschau: Rückfrage, Ladebalken,
 * Bestätigung — danach lädt die Seite neu und zeigt den neuen Stand.
 * Ohne Anmeldung (Vorschau-Link) führt das Fenster zur Praxis-App.
 */
export function PreviewPublish() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className={styles.link} onClick={() => setOpen(true)}>
        Veröffentlichen
      </button>
      {open ? <ReleaseDialog live onClose={() => setOpen(false)} onDone={() => window.location.reload()} /> : null}
    </>
  );
}
