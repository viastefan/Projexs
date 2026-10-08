'use client';

import { useFormStatus } from 'react-dom';
import ui from './ui.module.css';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

export function SubmitButton({
  children,
  pendingLabel,
  variant = 'primary',
  block = false,
  confirm,
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  variant?: Variant;
  block?: boolean;
  /** Rückfrage vor dem Absenden — für alles, was sich nicht rückgängig machen lässt. */
  confirm?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={`${ui.button} ${ui[variant]} ${block ? ui.block : ''}`}
      disabled={pending}
      onClick={(event) => {
        if (confirm && !window.confirm(confirm)) event.preventDefault();
      }}
    >
      {pending && pendingLabel ? pendingLabel : children}
    </button>
  );
}
