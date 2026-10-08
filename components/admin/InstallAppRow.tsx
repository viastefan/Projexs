'use client';

import { useSyncExternalStore } from 'react';
import { Download } from 'lucide-react';
import { isStandalone, openInstallPrompt } from '@/components/install-prompt';
import ui from './ui.module.css';

const noSubscription = () => () => {};

/** „App installieren“ in den Einstellungen — oder der Hinweis, dass sie es schon ist. */
export function InstallAppRow() {
  const installed = useSyncExternalStore<boolean | null>(noSubscription, isStandalone, () => null);
  if (installed === null) return null;
  return installed ? (
    <p className={ui.hint}>Sie nutzen die installierte App. Updates kommen automatisch.</p>
  ) : (
    <div className={ui.row}>
      <button type="button" className={`${ui.button} ${ui.secondary}`} onClick={openInstallPrompt}>
        <Download aria-hidden="true" /> App installieren
      </button>
    </div>
  );
}
