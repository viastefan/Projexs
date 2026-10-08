'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2, Mail, PenLine, Send } from 'lucide-react';
import { sendInquiryReplyAction } from '@/app/admin/actions/inquiries';
import { idle, type ActionState } from '@/app/admin/actions/state';
import styles from '@/app/admin/(app)/pages.module.css';
import { FormMessage } from './FormMessage';
import ui from './ui.module.css';
import { useSubmitAction } from './useSubmitAction';

/**
 * Antworten wie in Apple Mail: An, Von, Betreff, darunter der vorbereitete
 * Text — der Eingang ist bestätigt, die persönliche Rückmeldung angekündigt.
 * Gesendet wird unter der Praxis-Adresse; ist das (noch) nicht eingerichtet,
 * öffnet sich stattdessen das Mailprogramm mit demselben Text.
 */
export function ReplyComposer({
  inquiryKey,
  to,
  from,
  senderName,
  draft,
  followUp,
  quote,
  replied,
  techHint,
}: {
  inquiryKey: string;
  to: { name: string; email: string };
  /** Praxis-Adresse, unter der die App sendet — null, wenn Senden nicht eingerichtet ist */
  from: string | null;
  senderName: string;
  draft: { subject: string; text: string };
  /** Rahmen für jede weitere Nachricht */
  followUp: string;
  /** Die ursprüngliche Nachricht, zitiert — kommt unter jede Antwort */
  quote: string;
  /** Schon einmal aus der App beantwortet? */
  replied: boolean;
  /** Nur für die technische Betreuung */
  techHint?: string;
}) {
  const [state, onSubmit, pending] = useSubmitAction(sendInquiryReplyAction);
  const [subject, setSubject] = useState(draft.subject);
  const [body, setBody] = useState(draft.text);
  const [composing, setComposing] = useState(!replied);
  const [handled, setHandled] = useState<ActionState>(idle);

  const justSent = state.status === 'ok' && state !== handled;
  const mailto = `mailto:${to.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${body}${quote}`)}`;

  function writeAnother() {
    setHandled(state);
    setSubject(subject.startsWith('Re: ') ? subject : `Re: ${subject}`);
    setBody(followUp);
    setComposing(true);
  }

  if (justSent) {
    return (
      <div className={styles.replyDone} role="status">
        <CheckCircle2 aria-hidden="true" />
        <div className={styles.replyDoneText}>
          <strong>Antwort gesendet</strong>
          <span>{state.message} Die Anfrage steht jetzt bei „Beantwortet“.</span>
        </div>
        <button type="button" className={`${ui.button} ${ui.secondary}`} onClick={writeAnother}>
          <PenLine aria-hidden="true" /> Weitere Nachricht
        </button>
      </div>
    );
  }

  if (!composing) {
    return (
      <div className={styles.replyDone}>
        <CheckCircle2 aria-hidden="true" />
        <div className={styles.replyDoneText}>
          <strong>Beantwortet</strong>
          <span>Was gesendet wurde, steht unten unter „Gesendet“.</span>
        </div>
        <button type="button" className={`${ui.button} ${ui.secondary}`} onClick={writeAnother}>
          <PenLine aria-hidden="true" /> Weitere Nachricht
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={styles.composer}>
      <input type="hidden" name="key" value={inquiryKey} />
      <div className={styles.composerHead}>
        <div className={styles.composerRow}>
          <span className={styles.composerLabel}>An</span>
          <span className={styles.composerValue}>
            <strong>{to.name}</strong> <span className={ui.muted}>{to.email}</span>
          </span>
        </div>
        <div className={styles.composerRow}>
          <span className={styles.composerLabel}>Von</span>
          <span className={styles.composerValue}>
            {from ? (
              <>
                <strong>{senderName}</strong> <span className={ui.muted}>{from}</span>
              </>
            ) : (
              <span className={ui.muted}>Ihr Mailprogramm</span>
            )}
          </span>
        </div>
        <label className={styles.composerRow}>
          <span className={styles.composerLabel}>Betreff</span>
          <input
            className={styles.composerSubject}
            name="subject"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            maxLength={200}
            required
          />
        </label>
      </div>

      <textarea
        className={styles.composerText}
        name="text"
        aria-label="Nachricht"
        value={body}
        onChange={(event) => setBody(event.target.value)}
        rows={13}
        maxLength={20000}
        required
      />
      <p className={ui.hint}>Die ursprüngliche Nachricht wird darunter angehängt.</p>

      <FormMessage state={state.status === 'error' ? state : idle} />

      <div className={styles.composerActions}>
        {from ? (
          <button type="submit" className={`${ui.button} ${ui.primary}`} disabled={pending}>
            {pending ? <Loader2 aria-hidden="true" className={ui.spin} /> : <Send aria-hidden="true" />}
            {pending ? 'Wird gesendet …' : 'Antwort senden'}
          </button>
        ) : null}
        <a href={mailto} className={`${ui.button} ${from ? ui.ghost : ui.primary}`}>
          <Mail aria-hidden="true" /> Im Mailprogramm öffnen
        </a>
      </div>
      {!from ? (
        <p className={ui.hint}>Öffnet Ihr Mailprogramm mit diesem Text. Danach rechts den Status auf „Beantwortet“ setzen.</p>
      ) : null}
      {techHint ? <p className={ui.small}>{techHint}</p> : null}
    </form>
  );
}
