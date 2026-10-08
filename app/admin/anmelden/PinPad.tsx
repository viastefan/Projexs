'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { CodeBoxes } from '@/components/admin/CodeBoxes';
import type { PinState } from '../actions/auth';
import styles from './pin.module.css';

const LENGTH = 6;

/*
 * Sechsstelliger PIN-Zugang — ruhig wie die Website, flüssig wie eine App.
 * Tippen/Einfügen am Computer; auf dem Handy System-Zifferntastatur.
 * Nach sechs Ziffern wird geprüft; Bestätigen bleibt als klarer CTA.
 * Die PIN erscheint als Punkte, damit niemand über die Schulter mitliest.
 */
export function PinPad({
  state,
  dispatch,
  pending,
  next,
}: {
  state: PinState;
  dispatch: (payload: FormData) => void;
  pending: boolean;
  next: string;
}) {
  const [, startTransition] = useTransition();
  const [digits, setDigits] = useState('');
  const [attempt, setAttempt] = useState(0);
  // Zuletzt geschickte PIN — verhindert doppeltes Absenden derselben Eingabe.
  const [sent, setSent] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  /* Nach einer Antwort mit Fehler: leeren und schütteln — direkt beim Rendern,
     damit daraus kein zweiter Durchlauf per Effekt wird. */
  const [seen, setSeen] = useState(state);
  if (seen !== state) {
    setSeen(state);
    if (state.status === 'error') {
      setDigits('');
      setSent('');
      setAttempt((value) => value + 1);
    }
  }

  function submit(pin: string) {
    if (pin.length !== LENGTH || pending || sent === pin) return;
    setSent(pin);
    const data = new FormData();
    data.set('pin', pin);
    data.set('next', next);
    startTransition(() => dispatch(data));
  }

  function update(value: string) {
    if (pending) return;
    setDigits(value);
    if (value.length === LENGTH) submit(value);
  }

  useEffect(() => {
    if (window.matchMedia('(pointer: fine)').matches) inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (attempt > 0 && window.matchMedia('(pointer: fine)').matches) inputRef.current?.focus();
  }, [attempt]);

  // Tippt jemand, während das Feld nicht aktiv ist, landet die Ziffer trotzdem hier.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.target === inputRef.current || event.metaKey || event.ctrlKey || event.altKey) return;
      if (/^\d$/.test(event.key)) update((digits + event.key).slice(0, LENGTH));
      else if (event.key === 'Backspace') update(digits.slice(0, -1));
      else if (event.key === 'Enter') submit(digits);
      else return;
      event.preventDefault();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const ready = digits.length === LENGTH && !pending;

  return (
    <div className={styles.pad}>
      <CodeBoxes
        id="pin-eingabe"
        label="Sechsstellige PIN"
        inputRef={inputRef}
        value={digits}
        onChange={update}
        onEnter={() => submit(digits)}
        masked
        pending={pending}
        attempt={attempt}
        describedBy="pin-hinweis"
        autoComplete="current-password"
      />

      <button type="button" className={styles.submit} onClick={() => submit(digits)} disabled={!ready}>
        {pending ? 'Wird geprüft …' : 'Weiter'}
      </button>

      <p id="pin-hinweis" className={styles.message} role="alert" aria-live="assertive">
        {state.status === 'error' ? state.message : ' '}
      </p>

      <p className={styles.help}>PIN vergessen? Die PIN aus den Vercel-Einstellungen (ADMIN_PIN) öffnet den Zugang immer.</p>
    </div>
  );
}
