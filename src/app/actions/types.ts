export interface ActionState {
  readonly status: 'idle' | 'ok' | 'error';
  readonly message: string;
  readonly fieldErrors?: Record<string, string>;
}

export const IDLE: ActionState = { status: 'idle', message: '' };

export function fieldErrorsFrom(issues: readonly { path: PropertyKey[]; message: string }[]) {
  const out: Record<string, string> = {};
  for (const i of issues) {
    const k = String(i.path[0] ?? '');
    if (k && !out[k]) out[k] = i.message;
  }
  return out;
}
