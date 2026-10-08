'use client';

import type { CSSProperties, RefObject } from 'react';
import styles from './CodeBoxes.module.css';
import ui from './ui.module.css';

type CodeBoxesProps = {
  id: string;
  /** Unsichtbare Beschriftung für Screenreader. */
  label: string;
  value: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  inputRef: RefObject<HTMLInputElement | null>;
  length?: number;
  /** PIN: Punkte statt Ziffern, damit niemand mitliest. */
  masked?: boolean;
  pending?: boolean;
  /** Zählt Fehlversuche; bei jedem neuen schütteln sich die Kästchen. */
  attempt?: number;
  describedBy?: string;
  autoComplete?: string;
};

/*
 * Sechs Kästchen, darüber liegt unsichtbar das echte Eingabefeld: Tippen,
 * Einfügen, Passwort-Manager und das Einsetzen von SMS-/App-Codes durch das
 * Handy funktionieren wie gewohnt.
 */
export function CodeBoxes({
  id,
  label,
  value,
  onChange,
  onEnter,
  inputRef,
  length = 6,
  masked = false,
  pending = false,
  attempt = 0,
  describedBy,
  autoComplete = 'one-time-code',
}: CodeBoxesProps) {
  return (
    <div
      key={attempt}
      className={styles.boxes}
      data-shake={attempt > 0 ? 'true' : 'false'}
      data-pending={pending ? 'true' : 'false'}
      onClick={() => inputRef.current?.focus()}
    >
      <label className={ui.visuallyHidden} htmlFor={id}>
        {label}
      </label>
      <input
        ref={inputRef}
        id={id}
        className={styles.input}
        type={masked ? 'password' : 'text'}
        inputMode="numeric"
        autoComplete={autoComplete}
        pattern="[0-9]*"
        maxLength={length}
        value={value}
        onChange={(event) => onChange(event.target.value.replace(/\D/g, '').slice(0, length))}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            onEnter?.();
          }
        }}
        disabled={pending}
        aria-describedby={describedBy}
      />
      {Array.from({ length }, (_, index) => {
        const filled = index < value.length;
        const active = index === value.length && !pending;
        return (
          <span
            key={index}
            className={styles.box}
            data-filled={filled ? 'true' : 'false'}
            data-active={active ? 'true' : 'false'}
            style={{ '--i': index } as CSSProperties}
            aria-hidden="true"
          >
            {filled ? masked ? <span className={styles.dot} /> : <span className={styles.digit}>{value[index]}</span> : null}
          </span>
        );
      })}
    </div>
  );
}
