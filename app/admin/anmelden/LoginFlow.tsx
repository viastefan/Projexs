'use client';

import { useActionState } from 'react';
import { pinLoginAction, type PinState } from '../actions/auth';
import { idle } from '../actions/state';
import { PinPad } from './PinPad';

/* Anmeldung mit der sechsstelligen PIN — bei Erfolg direkt in die App. */
export function LoginFlow({ next }: { next: string }) {
  const [state, dispatch, pending] = useActionState<PinState, FormData>(pinLoginAction, idle);
  return <PinPad state={state} dispatch={dispatch} pending={pending} next={next} />;
}
