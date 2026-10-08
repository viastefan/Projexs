'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { sendTestMailAction } from '@/app/admin/actions/settings';
import { idle, type ActionState } from '@/app/admin/actions/state';
import { FormMessage } from './FormMessage';
import ui from './ui.module.css';

export function MailTestButton() {
  const [state, setState] = useState<ActionState>(idle);
  const [busy, setBusy] = useState(false);

  async function send() {
    setBusy(true);
    setState(idle);
    try {
      setState(await sendTestMailAction());
    } catch {
      setState({ status: 'error', message: 'Das hat nicht geklappt. Bitte noch einmal versuchen.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={ui.stack}>
      <div className={ui.row}>
        <button type="button" className={`${ui.button} ${ui.secondary}`} onClick={send} disabled={busy}>
          <Send aria-hidden="true" /> {busy ? 'Wird gesendet …' : 'Testmail an mich senden'}
        </button>
      </div>
      <FormMessage state={state} />
    </div>
  );
}
