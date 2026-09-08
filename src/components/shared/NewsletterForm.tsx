'use client';

import { useActionState, useId } from 'react';
import { useFormStatus } from 'react-dom';
import { subscribeToNewsletter, type ActionState } from '@/app/actions';
import { Button } from './Button';

/**
 * Captura de email del footer. Envía por Resend vía Server Action.
 *
 * Doble función según el brief: novedades y aviso de arranque de temporada.
 * El negocio cierra unos seis meses al año, así que «avisame cuando abran» es
 * una razón de suscripción tan fuerte como el newsletter en sí.
 *
 * ⚠️ Accesibilidad (Fase 4):
 *   · `<label>` real asociado por `htmlFor`/`id`, nunca un placeholder de etiqueta.
 *   · El error se comunica por TEXTO, no sólo por color.
 *   · El estado de envío va en un `aria-live="polite"` que existe SIEMPRE en el
 *     DOM, para que el lector de pantalla lo tenga bajo observación desde el
 *     principio (si el contenedor aparece junto con el mensaje, no se anuncia).
 *   · El botón se deshabilita mientras envía y lo dice por texto.
 */

const INITIAL: ActionState = { status: 'idle', message: '' };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" size="lg" disabled={pending} className="h-[52px] w-full sm:w-auto">
      {pending ? 'Sending…' : 'Join'}
    </Button>
  );
}

export default function NewsletterForm() {
  const uid = useId();
  const emailId = `${uid}-email`;
  const errorId = `${uid}-error`;
  const [state, action] = useActionState(subscribeToNewsletter, INITIAL);

  const error = state.status === 'error' ? state.fieldErrors?.email ?? state.message : null;

  return (
    <form action={action} className="flex w-full flex-col gap-[10px]">
      <div className="flex flex-col gap-[10px] sm:flex-row">
        <div className="flex-1">
          <label htmlFor={emailId} className="eyebrow mb-[8px] block text-paper/70">
            Email address
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            placeholder="you@example.com"
            className={[
              'h-[52px] w-full rounded-btn border bg-paper px-[16px]',
              'font-body text-[16px] text-body placeholder:text-body/45',
              'transition-colors duration-200',
              error ? 'border-2 border-tomato' : 'border-transparent',
            ].join(' ')}
          />
        </div>
        <div className="flex items-end">
          <SubmitButton />
        </div>
      </div>

      {/* Honeypot. Oculto para la vista Y para el lector de pantalla, y fuera
          del recorrido del tabulador: sólo lo llena un bot. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <label htmlFor={`${uid}-website`}>Leave this empty</label>
        <input id={`${uid}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {error ? (
        <p id={errorId} className="text-[14px] font-bold text-cream">
          {error}
        </p>
      ) : null}

      <p aria-live="polite" className="min-h-[20px] text-[14px] text-cream">
        {state.status === 'ok' ? state.message : ''}
      </p>
    </form>
  );
}
