export type ActionState = {
  status: 'idle' | 'ok' | 'error';
  message?: string;
  /** Neu angelegter Datensatz, z. B. um danach dorthin zu wechseln. */
  id?: string;
};

export const idle: ActionState = { status: 'idle' };

export function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}
