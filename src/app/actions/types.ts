/**
 * El estado que devuelven TODAS las server actions de formulario del sitio.
 *
 * Lo consume `useActionState` en el cliente. Es el mismo objeto para los cinco
 * formularios, así que `FormShell` puede pintar el resumen de errores sin
 * saber de qué formulario se trata.
 */
export interface ActionState {
  readonly status: 'idle' | 'ok' | 'error';
  readonly message: string;
  /** Errores por campo, para pintarlos donde corresponde. */
  readonly fieldErrors?: Record<string, string>;
}

export const IDLE: ActionState = { status: 'idle', message: '' };

/** Traduce el error de zod al mapa plano que espera `ActionState`. */
export function fieldErrorsFrom(issues: readonly { path: PropertyKey[]; message: string }[]) {
  const out: Record<string, string> = {};
  for (const i of issues) {
    const k = String(i.path[0] ?? '');
    if (k && !out[k]) out[k] = i.message;
  }
  return out;
}
