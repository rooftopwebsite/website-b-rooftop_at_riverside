'use client';

import { submitEventInquiry } from '@/app/actions/event-inquiry';
import {
  CheckboxGroup,
  DateField,
  FormShell,
  SelectField,
  SubmitButton,
  TextAreaField,
  TextField,
  useRadioGroup,
} from '@/components/form/Fields';
import { IDLE } from '@/app/actions/types';
import { Eyebrow, Heading } from '@/components/shared/Type';
import { useActionState } from 'react';
import {
  AREAS_OF_INTEREST,
  BUDGET_RANGES,
  EVENT_SUBTYPES,
  FOOD_TIERS,
  GUEST_RANGES,
  REFERRAL_SOURCES,
} from '@/content/spaces';

/**
 * El formulario de `/events`. UNA PANTALLA, sin pasos.
 * Envía por Resend a través de una Server Action.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ EL 2026-09-21 DEJÓ DE TENER CONTROLES PROPIOS. Hasta ese día este archivo
 * definía su propio `Field`, su propio `SelectField`, su propio resumen de
 * errores y su propio honeypot: unas 180 líneas que eran una SEGUNDA
 * implementación de lo que ya estaba en `components/form/Fields.tsx`, que se
 * creó justamente para que hubiera una sola y cuya cabecera decía que «los
 * cinco formularios del sitio la usan». Éste no la usaba.
 *
 * El costo no era teórico. `Fields.tsx` apagaba la flecha del navegador con
 * `appearance-none` y dibujaba la suya a 18px del borde; la copia de acá
 * dejaba el `<select>` nativo, así que en el mismo sitio había desplegables
 * con la flecha adentro de la píldora y desplegables con la flecha del sistema
 * montada sobre la curva. Camila marcó las dos con un círculo el 2026-09-21:
 * «fijate de reorganizar para que se vea bien y que los iconos ocupen bien su
 * lugar».
 *
 * Todo lo que este archivo documentaba sobre los controles —la píldora, los
 * 22px de padding, los 42px de alto, el textarea como única excepción— sigue
 * escrito, pero donde vive el control: arriba de `INPUT_BASE` en `Fields.tsx`.
 *
 * ⚠️ LO QUE SIGUE SIENDO PROPIO DE ACÁ son las dos piezas que ningún otro
 * formulario tiene: las tarjetas de radio de `foodTier` y el bloque de éxito.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ⚠️ LAS FECHAS Y LAS HORAS PASARON DE UNA FILA DE TRES A DOS FILAS DE DOS, y
 * es el otro pedido del mismo mensaje. Eran CUATRO campos en una grilla de
 * tres columnas, así que el cuarto —«End time»— caía solo a un renglón nuevo y
 * la fila de arriba quedaba con un hueco. Peor: «A second date that works» es
 * la única etiqueta larga del formulario y partía en dos renglones, lo que
 * empujaba su campo 24px más abajo que sus dos vecinos.
 *
 * Dos filas de dos agrupan lo que se piensa junto —las dos fechas primero, las
 * dos horas después— y no dejan huecos. La diferencia de alto entre etiquetas
 * la resuelve el `flex-1` de `Label`, que también es de este commit.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ⚠️ Es un `<form action={...}>` de verdad, no un `onSubmit` con `fetch`. Eso
 * significa que **funciona sin JavaScript**: si el bundle no carga, el POST
 * sale igual y la respuesta se renderiza en el servidor. Para el formulario
 * que más plata mueve del sitio, esa diferencia importa.
 *
 * ⚠️ Accesibilidad: la garantiza `FormShell` para los cinco formularios de
 * una vez —`<label>` real por campo, errores por texto además de por borde,
 * resumen enfocable con `role="alert"`, `aria-live` que existe siempre en el
 * DOM y honeypot en vez de captcha—. Ver la nota de ese archivo.
 * ══════════════════════════════════════════════════════════════════════════
 */

/*
 * ⚠️ DOS TEXTOS NO, UNO SOLO. `LABELS` es a la vez lo que se pinta encima del
 * campo y lo que dice el resumen de errores de arriba («Your name: required»),
 * así que cada uno tiene que funcionar suelto, fuera del formulario.
 */
const LABELS: Record<string, string> = {
  name: 'Your name',
  email: 'Email',
  phone: 'Phone',
  company: 'Company',
  eventType: 'Type of event',
  date: 'Event date',
  altDate: 'A second date that works',
  startTime: 'Start time',
  endTime: 'End time',
  guests: 'Guest count',
  budget: 'Rough budget',
  areas: 'What you are interested in',
  foodTier: 'Food tier',
  comments: 'Anything else',
  referral: 'How did you hear about us?',
};

/** Un rótulo de grupo dentro del formulario. */
function Grupo({ children }: { readonly children: React.ReactNode }) {
  return <legend className="eyebrow mb-[6px] text-body/75">{children}</legend>;
}

export default function InquiryForm() {
  const [state, action] = useActionState(submitEventInquiry, IDLE);

  if (state.status === 'ok') {
    return (
      <div
        role="status"
        className="rounded-card border border-ink/15 bg-cream sombra-card p-[32px] lg:p-[48px]"
      >
        <Eyebrow tone="deep">Request received</Eyebrow>
        <Heading level={2} className="mt-gap-kicker text-d4">
          We&rsquo;ll come back within one business day
        </Heading>
        <p className="mt-gap-bajada max-w-[54ch] text-lead text-body/80">{state.message}</p>
        <p className="mt-[16px] max-w-[54ch] text-[16px] leading-[1.65] text-body/75">
          {/* ⚠️ ACÁ SE PROMETÍA UN PDF ADJUNTO EN LA RESPUESTA y hoy nada lo
              adjunta: el envío real todavía no está enchufado (ver
              `lib/submissions.ts`). Prometer un archivo que no llega es la
              clase de detalle por el que alguien deja de contestar. */}
          Rental rates, food options and the fees are all on this page if you want them now.
        </p>
      </div>
    );
  }

  return (
    <FormShell state={state} action={action} labels={LABELS}>
      {/* ── Quién sos ─────────────────────────────────────────────────── */}
      <fieldset className="flex flex-col gap-[16px]">
        <Grupo>About you</Grupo>
        <div className="grid gap-[16px] sm:grid-cols-2">
          <TextField name="name" label={LABELS.name} required autoComplete="name" />
          <TextField name="email" label={LABELS.email} type="email" required autoComplete="email" />
          <TextField name="phone" label={LABELS.phone} type="tel" required autoComplete="tel" />
          <TextField
            name="company"
            label={LABELS.company}
            autoComplete="organization"
            hint="Optional"
          />
        </div>
      </fieldset>

      {/* ── El evento ─────────────────────────────────────────────────── */}
      <fieldset className="flex flex-col gap-[16px]">
        <Grupo>The event</Grupo>

        <SelectField
          name="eventType"
          label={LABELS.eventType}
          required
          placeholder="Choose one"
          options={EVENT_SUBTYPES.map((o) => ({ value: o, label: o }))}
        />

        {/* Las dos fechas juntas, y las dos horas juntas. Ver la nota de
            arriba: eran cuatro campos en una grilla de tres. */}
        <div className="grid gap-[16px] sm:grid-cols-2">
          <DateField name="date" label={LABELS.date} required />
          <DateField name="altDate" label={LABELS.altDate} hint="Optional" />
        </div>
        <div className="grid gap-[16px] sm:grid-cols-2">
          <TextField name="startTime" label={LABELS.startTime} type="time" />
          <TextField name="endTime" label={LABELS.endTime} type="time" />
        </div>

        <div className="grid gap-[16px] sm:grid-cols-2">
          <SelectField
            name="guests"
            label={LABELS.guests}
            required
            placeholder="Choose a range"
            options={GUEST_RANGES.map((o) => ({ value: o, label: o }))}
          />
          {/*
            ⚠️ RANGO Y NO CAMPO ABIERTO, y está discutido en el brief:
            «Madeline y Tony advirtieron que los campos de presupuesto abierto
            traen respuestas poco realistas». El corte más bajo sale del piso
            real: dos horas del segundo piso son $1.500.
          */}
          <SelectField
            name="budget"
            label={LABELS.budget}
            required
            placeholder="Choose a range"
            options={BUDGET_RANGES.map((o) => ({ value: o, label: o }))}
          />
        </div>

        {/*
          ⚠️ CASILLAS Y NO UN SELECT: casi nadie quiere una sola parte del
          lugar. El servidor las lee con `getAll`, no con `fromEntries`.
        */}
        <div className="mt-[8px]">
          <CheckboxGroup
            name="areas"
            legend={LABELS.areas}
            options={AREAS_OF_INTEREST.map((a) => ({ value: a.value, label: a.label }))}
          />
        </div>
      </fieldset>

      {/* ── Comida ────────────────────────────────────────────────────── */}
      <FoodTier />

      {/* ── Cierre ────────────────────────────────────────────────────── */}
      <fieldset className="flex flex-col gap-[16px]">
        <Grupo>Anything else</Grupo>
        <TextAreaField name="comments" label={LABELS.comments} rows={4} />
        <SelectField
          name="referral"
          label={LABELS.referral}
          placeholder="Choose one"
          options={REFERRAL_SOURCES.map((o) => ({ value: o, label: o }))}
        />
      </fieldset>

      <div className="flex flex-col gap-[12px] border-t border-ink/15 pt-[24px]">
        <p className="text-[15px] text-body/75">
          <span className="text-terra">*</span> Required
        </p>
        <div>
          <SubmitButton idle="Send the request" busy="Sending…" />
        </div>
        {/*
          ⚠️ ACÁ DECÍA «Prefer email? …» Y SE MUDÓ A LA COLUMNA IZQUIERDA de la
          losa, junto al teléfono y al packet. Camila pidió para el cierre la
          estructura del formulario de contacto de defoodtruckclub, donde los
          datos de contacto van AL LADO del panel y no adentro. Y ahí sirven
          más: quien no quiere llenar quince campos ve la salida antes de
          empezar, no después de scrollear el formulario entero.
        */}
      </div>
    </FormShell>
  );
}

/**
 * Los tres tiers de comida, en tarjetas de radio.
 *
 * ⚠️ ES LA ÚNICA PIEZA DE CONTROL QUE SIGUE VIVIENDO EN ESTE ARCHIVO, porque
 * es la única del sitio: ningún otro formulario elige entre tres opciones con
 * una línea de explicación cada una. Si mañana aparece una segunda, se muda a
 * `Fields.tsx` como se mudó todo lo demás.
 *
 * ⚠️ SON TARJETAS Y NO UN DESPLEGABLE porque la diferencia entre los tres está
 * en la explicación, no en el nombre: «Full service» contra «Drop-off» no
 * significa nada sin el renglón de abajo, y un `<option>` no lo puede llevar.
 */
function FoodTier() {
  const { eid, err, aria } = useRadioGroup('foodTier');
  return (
    <fieldset className="flex flex-col gap-[12px]">
      <legend className="eyebrow mb-[6px] text-body/75">
        Food tier <span className="text-terra">*</span>
      </legend>
      <p className="text-[15px] leading-[1.55] text-body/75">
        The trucks cook. We coordinate them. Pick how involved you want that to be.
      </p>
      <div className="grid gap-[12px] sm:grid-cols-3">
        {FOOD_TIERS.map((tier) => (
          <label
            key={tier.value}
            className="flex cursor-pointer flex-col gap-[6px] rounded-card border border-ink/20 bg-paper p-[16px] transition-colors hover:border-ink/45 has-[:checked]:border-2 has-[:checked]:border-ink has-[:checked]:bg-cream"
          >
            <span className="flex items-center gap-[10px]">
              <input
                type="radio"
                name="foodTier"
                value={tier.value}
                {...aria}
                className="h-[18px] w-[18px] accent-black"
              />
              <span className="font-body text-[16px] font-bold">{tier.label}</span>
            </span>
            <span className="text-[13px] leading-[1.5] text-body/75">{tier.hint}</span>
          </label>
        ))}
      </div>
      {err ? (
        <p id={eid} className="text-[15px] font-bold text-terra">
          {err}
        </p>
      ) : null}
    </fieldset>
  );
}
