'use client';

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { createPortal } from 'react-dom';
import { useSiteLive } from '@/lib/use-site-live';
import styles from './ReleaseDialog.module.css';

const TEXT = {
  publish: {
    title: 'Website veröffentlichen?',
    text: 'Danach sehen alle Besucher die aktuelle Fassung – so, wie in der Vorschau.',
    confirm: 'Ja, veröffentlichen',
    busy: 'Website wird veröffentlicht …',
    doneTitle: 'Veröffentlicht',
    doneText: 'Die Website ist jetzt für alle sichtbar.',
  },
  pause: {
    title: 'Website pausieren?',
    text: 'Besucher sehen dann nur einen kurzen Hinweis, bis die Website wieder veröffentlicht wird.',
    confirm: 'Ja, pausieren',
    busy: 'Website wird pausiert …',
    doneTitle: 'Pausiert',
    doneText: 'Besucher sehen jetzt den Hinweis „Diese Website wird gerade bearbeitet“.',
  },
} as const;

/* Ab hier schließt ein Zug nach unten das Blatt (Handy). */
const DRAG_CLOSE_PX = 90;

/**
 * Rückfrage vor dem Veröffentlichen bzw. Pausieren — am Handy als Blatt von
 * unten mit Ziehgriff, am Computer als Fenster. Nach „Ja“ zeigt es den
 * Ladebalken und die Bestätigung; `onDone` lädt danach den neuen Stand.
 */
export function ReleaseDialog({
  live,
  onClose,
  onSuccess,
  onDone,
}: {
  /** true: veröffentlichen, false: pausieren */
  live: boolean;
  onClose: () => void;
  /** Sofort nach dem Erfolg, während die Bestätigung noch steht (z. B. Schalter umlegen). */
  onSuccess?: () => void;
  onDone: () => void;
}) {
  const { state, run } = useSiteLive();
  const [drag, setDrag] = useState(0);
  const start = useRef<number | null>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const text = live ? TEXT.publish : TEXT.pause;
  const locked = state === 'busy' || state === 'done';

  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  // Wird nur geöffnet gerendert: Beim Öffnen Fokus setzen, Escape schließt, Seite steht still.
  useEffect(() => {
    confirmRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeRef.current();
    };
    const overflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = overflow;
    };
  }, []);

  if (typeof document === 'undefined') return null;

  async function confirm() {
    if (!(await run(live))) return;
    onSuccess?.();
    window.setTimeout(onDone, 1800);
  }

  const close = () => {
    if (!locked) onClose();
  };
  const onPointerDown = (event: ReactPointerEvent) => {
    if (locked) return;
    start.current = event.clientY;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: ReactPointerEvent) => {
    if (start.current !== null) setDrag(Math.max(0, event.clientY - start.current));
  };
  const onPointerUp = () => {
    if (start.current === null) return;
    start.current = null;
    if (drag > DRAG_CLOSE_PX) onClose();
    else setDrag(0);
  };

  return createPortal(
    <div className={styles.root}>
      <div className={styles.backdrop} onClick={close} aria-hidden="true" />
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="freigabe-titel"
        style={drag ? { transform: `translateY(${drag}px)`, transition: 'none' } : undefined}
      >
        <div
          className={styles.grip}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          aria-hidden="true"
        >
          <span />
        </div>

        {state === 'busy' ? (
          <div className={styles.body} role="status" aria-live="polite">
            <p className={styles.title} id="freigabe-titel">
              {text.busy}
            </p>
            <div className={styles.track}>
              <span className={styles.fill} />
            </div>
          </div>
        ) : state === 'done' ? (
          <div className={styles.body} role="status" aria-live="polite">
            <span className={styles.check} aria-hidden="true">
              <svg viewBox="0 0 24 24" width="26" height="26">
                <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <p className={styles.title} id="freigabe-titel">
              {text.doneTitle}
            </p>
            <p className={styles.text}>{text.doneText}</p>
          </div>
        ) : (
          <div className={styles.body}>
            <p className={styles.title} id="freigabe-titel">
              {text.title}
            </p>
            <p className={styles.text}>
              {state === 'login'
                ? 'Dafür bitte zuerst in der Admin-App anmelden.'
                : state === 'error'
                  ? 'Das hat nicht geklappt. Bitte noch einmal versuchen.'
                  : text.text}
            </p>
            <div className={styles.actions}>
              {state === 'login' ? (
                <a className={styles.primary} href="/admin">
                  Zur Admin-App
                </a>
              ) : (
                <button ref={confirmRef} type="button" className={styles.primary} onClick={confirm}>
                  {state === 'error' ? 'Noch einmal versuchen' : text.confirm}
                </button>
              )}
              <button type="button" className={styles.secondary} onClick={onClose}>
                Abbrechen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
