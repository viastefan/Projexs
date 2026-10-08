import { AlertCircle, CheckCircle2 } from 'lucide-react';
import type { ActionState } from '@/app/admin/actions/state';
import ui from './ui.module.css';

export function FormMessage({ state }: { state: ActionState }) {
  if (state.status === 'idle' || !state.message) return null;
  const ok = state.status === 'ok';
  return (
    <div className={`${ui.notice} ${ok ? ui.noticeOk : ui.noticeBad}`} role={ok ? 'status' : 'alert'}>
      {ok ? <CheckCircle2 aria-hidden="true" /> : <AlertCircle aria-hidden="true" />}
      <span>{state.message}</span>
    </div>
  );
}
