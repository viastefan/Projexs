'use client';

import { saveInquiryNoteAction } from '@/app/admin/actions/inquiries';
import { idle } from '@/app/admin/actions/state';
import { FormMessage } from './FormMessage';
import { SaveBar, useSaveStatus } from './SaveBar';
import ui from './ui.module.css';
import { useSubmitAction } from './useSubmitAction';

export function NoteForm({ inquiryKey, note }: { inquiryKey: string; note?: string }) {
  const [state, onSubmit, pending] = useSubmitAction(saveInquiryNoteAction);
  const save = useSaveStatus(state, pending);
  return (
    <form onSubmit={onSubmit} onInput={save.onEdit} className={ui.stack}>
      <input type="hidden" name="key" value={inquiryKey} />
      <div className={ui.field}>
        <label className={ui.label} htmlFor="note">
          Eigene Notiz
        </label>
        <textarea className={ui.textarea} id="note" name="note" defaultValue={note ?? ''} rows={3} maxLength={2000} />
        <p className={ui.hint}>Nur hier sichtbar — etwa „Termin am 12. vereinbart“.</p>
      </div>
      <FormMessage state={state.status === 'error' ? state : idle} />
      <SaveBar status={save.status} everSaved={save.everSaved} label="Notiz speichern" savedText="Notiz gespeichert." variant="secondary" />
    </form>
  );
}
