'use client';

import { useActionState, useEffect, useRef, useTransition, type FormEvent } from 'react';
import { idle, type ActionState } from '@/app/admin/actions/state';

/**
 * Formular an eine Server-Aktion senden, ohne dass die Eingaben verloren gehen.
 *
 * React 19 leert ein Formular mit `action={…}` automatisch, sobald die Aktion
 * fertig ist — auch wenn sie mit einem Fehler zurückkommt. Für ein Formular,
 * in dem ein ganzer Artikeltext steht, ist das inakzeptabel. Deshalb wird hier
 * über `onSubmit` gesendet; geleert wird nur auf Wunsch und nur nach Erfolg.
 */
export function useSubmitAction(
  action: (previous: ActionState, formData: FormData) => Promise<ActionState>,
  options: { resetOnSuccess?: boolean; confirm?: string } = {},
) {
  const [state, dispatch, pending] = useActionState(action, idle);
  const [, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (options.resetOnSuccess && state.status === 'ok') formRef.current?.reset();
  }, [state, options.resetOnSuccess]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (options.confirm && !window.confirm(options.confirm)) return;
    formRef.current = event.currentTarget;
    const formData = new FormData(event.currentTarget);
    startTransition(() => dispatch(formData));
  }

  return [state, onSubmit, pending] as const;
}
