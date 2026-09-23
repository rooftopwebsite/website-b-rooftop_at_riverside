'use client';

import Link from 'next/link';
import { useVenue } from '@/components/shared/VenueProvider';
import { useActionState, useState } from 'react';
import { submitContact } from '@/app/actions/contact';
import { IDLE } from '@/app/actions/types';
import {
  FormShell,
  InlineField,
  InlineSelect,
  SentenceArea,
  SentenceRow,
  SubmitButton,
} from '@/components/form/Fields';
import { Eyebrow, Heading } from '@/components/shared/Type';
import { CONTACT_REASONS, reasonByValue } from '@/content/contact-reasons';

/**
 * El formulario de `/contact`, escrito COMO UNA FRASE.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ES EL FORMULARIO DE `defoodtruckclub.nl/contact`, CALCADO. Allá no hay
 * etiquetas encima de los campos: hay una oración con huecos, «Mijn naam is
 * [    ] van [    ]», adentro de una losa de radio grande con un filete
 * punteado por dentro. Es lo único que esa página tiene además del encabezado,
 * y funciona porque un formulario de contacto de cinco campos no necesita
 * parecer un trámite.
 *
 * Los controles no cambiaron: son los mismos de `form/Fields.tsx`, con la
 * misma píldora, el mismo alto y el mismo `<label>` asociado. Lo que cambió es
 * dónde se pinta la etiqueta. La nota larga de por qué eso sigue siendo
 * accesible está en `Fields.tsx`, arriba de `InlineField`.
 * ══════════════════════════════════════════════════════════════════════════
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

/*
 * ⚠️ DOS TEXTOS POR CAMPO Y NO UNO. `LABELS` es lo que dice el resumen de
 * errores de arriba del formulario («Your name: required»), y tiene que
 * funcionar suelto, fuera de la frase. `FRASE` es lo que se lee en línea. Si
 * el resumen dijera «My name is: required» sonaría a error de otro idioma.
 */
const LABELS: Record<string, string> = {
  name: 'Your name',
  email: 'Email',
  phone: 'Phone',
  reason: 'What is this about',
  message: 'Your message',
};

const FRASE = {
  name: 'My name is',
  reason: 'and it is about',
  email: 'You can reach me at',
  phone: 'or call me on',
  message: 'Here is the whole of it:',
};

export default function ContactForm() {
  const venue = useVenue();
  const [state, action] = useActionState(submitContact, IDLE);
  const [reason, setReason] = useState('');

  const redirect = reasonByValue(reason)?.redirect;

  if (state.status === 'ok') {
    return (
      <div role="status" className="rounded-shell border border-ink/15 bg-cream p-[32px] lg:p-[40px]">
        <Eyebrow tone="deep">Message sent</Eyebrow>
        <Heading level={2} className="mt-gap-kicker text-d5 lg:text-d4">
          It landed
        </Heading>
        <p className="mt-gap-bajada max-w-[52ch] text-lead text-body/80">{state.message}</p>
        <p className="mt-3 max-w-[52ch] text-[16px] leading-[1.65] text-body/75">
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
      {/*
        ⚠️ UN CAMPO POR RENGLÓN, y no dos como la referencia.

        Allá la losa mide unos 800px y «Mijn naam is [   ] van [   ]» entra
        entero en una línea. La nuestra mide 580: con dos campos por renglón el
        segundo se caía abajo y salía a todo el ancho, o sea que la frase se
        partía igual pero en un lugar que nadie eligió. Un campo por renglón,
        cada uno llenando lo que queda de la línea, es la misma idea sostenida
        en el ancho que tenemos.
      */}
      <div className="flex flex-col gap-[10px]">
        <SentenceRow>
          <InlineField name="name" label={FRASE.name} required autoComplete="name" />
        </SentenceRow>

        <SentenceRow>
          <InlineSelect
            name="reason"
            label={FRASE.reason}
            required
            placeholder="choose one"
            options={CONTACT_REASONS.map((r) => ({ value: r.value, label: r.label }))}
            onValueChange={setReason}
          />
        </SentenceRow>

        <SentenceRow>
          <InlineField name="email" label={FRASE.email} type="email" required autoComplete="email" />
        </SentenceRow>

        <SentenceRow>
          <InlineField
            name="phone"
            label={FRASE.phone}
            type="tel"
            autoComplete="tel"
          />
        </SentenceRow>
      </div>

      {redirect ? (
        /*
          Es un aviso, no un error: fondo claro y no `tomato`. Lleva
          `role="status"` para que un lector de pantalla lo anuncie al
          aparecer, porque el cambio no lo produjo un envío sino un cambio de
          opción, y sin esto pasaría en silencio.
        */
        <div role="status" className="rounded-shell border border-ink/15 bg-paper p-[24px]">
          <Heading level={3} role="card">
            This one has its own page
          </Heading>
          <p className="mt-[10px] max-w-[54ch] text-[16px] leading-[1.7] text-body/80">
            {redirect.why}
          </p>
          <p className="mt-[18px]">
            <Link
              href={redirect.href}
              className="inline-flex h-10.5 items-center justify-center whitespace-nowrap rounded-pill bg-sunset px-[28px] font-body text-cta font-bold tracking-cta text-ink transition-colors hover:bg-sunset-hover"
            >
              {redirect.cta}
            </Link>
          </p>
        </div>
      ) : (
        <>
          <SentenceArea name="message" label={FRASE.message} required rows={6} />
          {/*
            ⚠️ EL BOTÓN VA CENTRADO, que es lo que hace la referencia y no es
            un capricho: la losa tiene el filete punteado a los cuatro lados y
            un botón pegado a la izquierda deja un vacío raro contra la curva
            de la esquina derecha.
          */}
          <div className="mt-[8px] flex flex-col items-center gap-[12px]">
            <SubmitButton idle="Send message" busy="Sending…" />
            <p className="text-[15px] text-body/70">We answer within one business day.</p>
          </div>
        </>
      )}
    </FormShell>
  );
}
