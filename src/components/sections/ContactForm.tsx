'use client';

import Link from 'next/link';
import { useVenue } from '@/components/shared/VenueProvider';
import { useActionState, useState } from 'react';
import { submitContact } from '@/app/actions/contact';
import { IDLE } from '@/app/actions/types';
import {
  FormShell,
  SelectField,
  SubmitButton,
  TextAreaField,
  TextField,
} from '@/components/form/Fields';
import { Eyebrow, Heading } from '@/components/shared/Type';
import { CONTACT_REASONS, reasonByValue } from '@/content/contact-reasons';
import { BRAND } from '@/lib/brand';

/**
 * El formulario de `/contact`.
 *
 * ⚠️ DOS MOTIVOS NO SE CONTESTAN ACÁ. Eventos privados y market tienen su
 * propio flujo, y esos flujos piden cosas que este formulario no tiene: fecha,
 * cantidad de invitados y tier de comida en un caso; tamaño de puesto y qué
 * vende en el otro. Duplicarlos acá significaría o pedir todo dos veces o
 * recibir una consulta incompleta que obliga a un mail de ida y vuelta.
 *
 * Así que cuando alguien elige uno de esos dos, el formulario **cambia**: en
 * lugar del mensaje y el botón aparece la explicación de por qué y el link a
 * la página que corresponde. No es un error ni una validación fallida, es la
 * respuesta correcta, y por eso no se pinta en rojo.
 *
 * ⚠️ El servidor hace lo mismo por su cuenta (ver `app/actions/contact.ts`):
 * si alguien fuerza el POST con uno de esos dos motivos, se le devuelve el
 * link igual. Esta lógica del cliente es la experiencia, no la garantía.
 *
 * ⚠️ El `<select>` sigue siendo un `<select>` nativo y NO un combobox propio.
 * Cambiar de opción con el teclado, el gesto de selección del sistema en
 * móvil y el anuncio del lector de pantalla ya funcionan; un componente
 * propio tendría que reimplementar los tres.
 */

const LABELS: Record<string, string> = {
  name: 'Your name',
  email: 'Email',
  phone: 'Phone',
  reason: 'What is this about',
  message: 'Your message',
};

export default function ContactForm() {
  const venue = useVenue();
  const [state, action] = useActionState(submitContact, IDLE);
  const [reason, setReason] = useState('');

  const redirect = reasonByValue(reason)?.redirect;

  if (state.status === 'ok') {
    return (
      <div
        role="status"
        className="rounded-card border border-ink/15 bg-cream sombra-card p-[32px] lg:p-[40px]"
      >
        <Eyebrow tone="deep">Message sent</Eyebrow>
        <Heading level={2} className="mt-gap-kicker text-d5 lg:text-d4">
          It landed
        </Heading>
        <p className="mt-gap-bajada max-w-[52ch] text-lead text-body/80">{state.message}</p>
        <p className="mt-[16px] max-w-[52ch] text-[16px] leading-[1.65] text-body/75">
          If it is urgent, calling is faster:{' '}
          <a href={venue.phoneHref} className="link-texto font-bold">
            {venue.phone}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <FormShell state={state} action={action} labels={LABELS}>
      <div className="grid gap-[16px] sm:grid-cols-2">
        <TextField name="name" label={LABELS.name} required autoComplete="name" />
        <TextField name="email" label={LABELS.email} type="email" required autoComplete="email" />
      </div>

      <div className="grid gap-[16px] sm:grid-cols-2">
        <TextField
          name="phone"
          label={LABELS.phone}
          type="tel"
          autoComplete="tel"
          hint="Optional"
        />
        <SelectField
          name="reason"
          label={LABELS.reason}
          required
          placeholder="Choose one"
          options={CONTACT_REASONS.map((r) => ({ value: r.value, label: r.label }))}
          onValueChange={setReason}
        />
      </div>

      {redirect ? (
        /*
          Es un aviso, no un error: fondo `bone` y no `tomato`. Lleva
          `role="status"` para que un lector de pantalla lo anuncie al
          aparecer, porque el cambio no lo produjo un envío sino un cambio de
          opción, y sin esto pasaría en silencio.
        */
        <div role="status" className="rounded-card border border-ink/15 bg-bone p-[24px]">
          <Heading level={3} role="card">
            This one has its own page
          </Heading>
          <p className="mt-[10px] max-w-[54ch] text-[16px] leading-[1.7] text-body/80">
            {redirect.why}
          </p>
          <p className="mt-[18px]">
            <Link
              href={redirect.href}
              className="inline-flex h-10.5 items-center justify-center rounded-pill bg-sunset px-[28px] font-body text-cta font-bold tracking-cta text-ink transition-colors hover:bg-sunset-hover"
            >
              {redirect.cta}
            </Link>
          </p>
        </div>
      ) : (
        <>
          <TextAreaField name="message" label={LABELS.message} required rows={6} />
          <div className="flex flex-wrap items-center gap-[16px]">
            <SubmitButton idle="Send message" busy="Sending…" />
            <p className="text-[15px] text-body/70">We answer within one business day.</p>
          </div>
        </>
      )}
    </FormShell>
  );
}
