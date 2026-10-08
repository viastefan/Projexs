'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { currentSubscription, pushSupport } from './push-client';
import ui from './ui.module.css';

const DISMISSED_KEY = 'projexs-push-hinweis';
const QUIET_FOR = 14 * 24 * 60 * 60 * 1000;

function dismissedRecently(): boolean {
  try {
    const at = Number(localStorage.getItem(DISMISSED_KEY));
    return at > 0 && Date.now() - at < QUIET_FOR;
  } catch {
    return false;
  }
}

/**
 * Push lässt sich nur auf dem Gerät selbst einschalten — voreinstellen geht
 * nicht. Solange es hier aus ist, erinnert die Übersicht freundlich daran,
 * bis es an ist oder „Später“ gewählt wurde (dann zwei Wochen Ruhe).
 */
export function PushNudge() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Auf iPhone/iPad ohne installierte App übernimmt das Installations-Fenster.
    if (pushSupport() !== 'ok' || dismissedRecently()) return;
    let cancelled = false;
    currentSubscription()
      .then((subscription) => {
        if (!cancelled && !subscription) setShow(true);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  if (!show) return null;

  function later() {
    try {
      localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    } catch {
      // ohne Speicher kommt der Hinweis beim nächsten Öffnen wieder
    }
    setShow(false);
  }

  return (
    <div className={`${ui.notice} ${ui.noticeInfo}`} role="status">
      <Bell aria-hidden="true" />
      <span>
        Neue Anfragen sofort mitbekommen: ein kurzer Hinweis aufs Gerät, ohne Namen oder Inhalt.{' '}
        <Link href="/admin/einstellungen#push">Push einschalten</Link>
        {' · '}
        <button type="button" className={ui.noticeLink} onClick={later}>
          Später
        </button>
      </span>
    </div>
  );
}
