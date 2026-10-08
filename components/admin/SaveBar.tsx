'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, Check, Loader2, Save } from 'lucide-react';
import type { ActionState } from '@/app/admin/actions/state';
import ui from './ui.module.css';

export type SaveStatus = 'clean' | 'dirty' | 'saving' | 'saved' | 'error';

/** So lange zeigt der Knopf „Gespeichert“, bevor er wieder zu „Speichern“ wird. */
const SAVED_MS = 3200;

/**
 * Merkt sich, ob es Ungespeichertes gibt, und meldet den Speicherstand:
 * geändert → wird gespeichert → gespeichert (kurz) → alles gespeichert.
 * `onEdit` gehört an das Formular (`onInput`). Wer mit Ungespeichertem die
 * Seite verlässt, wird vorher gefragt.
 */
export function useSaveStatus(state: ActionState, pending: boolean) {
  const [dirty, setDirty] = useState(false);
  const [editedWhileSaving, setEditedWhileSaving] = useState(false);
  const [seen, setSeen] = useState(state);
  const [saves, setSaves] = useState(0);
  const [settled, setSettled] = useState(0);

  // Neue Antwort vom Server: bei Erfolg ist gespeichert, was beim Absenden drin war.
  if (state !== seen) {
    setSeen(state);
    if (state.status === 'ok') {
      setDirty(editedWhileSaving);
      setSaves((count) => count + 1);
    }
    setEditedWhileSaving(false);
  }

  useEffect(() => {
    if (saves === 0) return;
    const timer = window.setTimeout(() => setSettled(saves), SAVED_MS);
    return () => window.clearTimeout(timer);
  }, [saves]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  function onEdit() {
    if (pending) {
      if (!editedWhileSaving) setEditedWhileSaving(true);
    } else if (!dirty) {
      setDirty(true);
    }
  }

  const status: SaveStatus = pending
    ? 'saving'
    : state.status === 'error' && dirty
      ? 'error'
      : saves !== settled
        ? 'saved'
        : dirty
          ? 'dirty'
          : 'clean';
  return { status, onEdit, everSaved: saves > 0 };
}

/**
 * Speichern mit deutlicher Rückmeldung: links, was los ist, rechts der Knopf —
 * beim Speichern mit Kreisel, danach kurz grün mit Haken. Gibt es
 * Ungespeichertes, schwebt die Leiste unten im Bild, damit der Knopf immer
 * erreichbar ist.
 */
export function SaveBar({
  status,
  everSaved = false,
  savedText = 'Gespeichert.',
  savedShort = 'Gespeichert',
  label = 'Speichern',
  variant = 'primary',
}: {
  status: SaveStatus;
  everSaved?: boolean;
  /** Was nach dem Speichern kurz daneben steht, z. B. „Die Website ist aktualisiert.“ */
  savedText?: string;
  /** Dasselbe in kurz — für schmale Handys, damit die Leiste einzeilig bleibt. */
  savedShort?: string;
  label?: string;
  variant?: 'primary' | 'secondary';
}) {
  const note: { icon: React.ReactNode; text: string; short: string } =
    status === 'dirty'
      ? {
          icon: <span className={ui.saveDot} aria-hidden="true" />,
          text: 'Änderungen noch nicht gespeichert',
          short: 'Nicht gespeichert',
        }
      : status === 'saved'
        ? { icon: <Check aria-hidden="true" />, text: savedText, short: savedShort }
        : status === 'error'
          ? {
              icon: <AlertCircle aria-hidden="true" />,
              text: 'Nicht gespeichert — bitte noch einmal versuchen.',
              short: 'Bitte noch einmal',
            }
          : status === 'clean' && everSaved
            ? { icon: <Check aria-hidden="true" />, text: 'Alles gespeichert', short: 'Alles gespeichert' }
            : { icon: null, text: '', short: '' };

  return (
    <div className={ui.saveBar} data-status={status}>
      <button
        type="submit"
        className={`${ui.button} ${ui[variant]} ${ui.saveButton}`}
        data-status={status}
        disabled={status === 'saving'}
      >
        {status === 'saving' ? (
          <Loader2 aria-hidden="true" className={ui.spin} />
        ) : status === 'saved' ? (
          <Check aria-hidden="true" />
        ) : (
          <Save aria-hidden="true" />
        )}
        {status === 'saving' ? 'Wird gespeichert …' : status === 'saved' ? 'Gespeichert' : label}
      </button>
      <span className={ui.saveNote} data-status={status} role="status" aria-live="polite">
        {note.icon}
        <span className={ui.saveLong}>{note.text}</span>
        <span className={ui.saveShort} aria-hidden="true">
          {note.short}
        </span>
      </span>
    </div>
  );
}
