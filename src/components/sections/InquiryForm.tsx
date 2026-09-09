'use client';

import { useActionState, useEffect, useId, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { submitEventInquiry, type ActionState } from '@/app/actions';
import { Button } from '@/components/shared/Button';
import { Eyebrow, Heading } from '@/components/shared/Type';
import { EVENT_TYPES, FOOD_TIERS, GUEST_RANGES, REFERRAL_SOURCES } from '@/content/spaces';
import { BRAND } from '@/lib/brand';

/**
 * El formulario de `/events/inquire`. UNA PANTALLA, sin pasos.
 * Envía por Resend a través de una Server Action.
 *
 * ⚠️ Es un `<form action={...}>` de verdad, no un `onSubmit` con `fetch`. Eso
 * significa que **funciona sin JavaScript**: si el bundle no carga, el POST
 * sale igual y la respuesta se renderiza en el servidor. Para el formulario que
 * más plata mueve del sitio, esa diferencia importa.
 *
 * ⚠️ Accesibilidad (Fase 4):
 *   · `<label>` real por campo, asociado con `htmlFor`.
 *   · Los errores se comunican por TEXTO además del borde, y se resumen arriba
 *     en un bloque enfocable con `role="alert"`.
 *   · `aria-invalid` + `aria-describedby` en cada campo con error.
 *   · El estado de envío va en un `aria-live` que existe siempre en el DOM.
 *   · Honeypot en vez de captcha: no le pide nada al usuario y no es una
 *     barrera de accesibilidad.
 */

const INITIAL: ActionState = { status: 'idle', message: '' };

const LABELS = {
  name: 'Your name',
  email: 'Email',
  phone: 'Phone',
  company: 'Company',
  eventType: 'Type of event',
  date: 'Event date',
  startTime: 'Start time',
  endTime: 'End time',
  guests: 'Guest count',
  foodTier: 'Food tier',
  comments: 'Anything else',
  referral: 'How did you hear about us?',
} as const;

type FieldName = keyof typeof LABELS;

const INPUT_BASE =
  'h-[50px] w-full rounded-btn border bg-paper px-[14px] font-body text-[16px] transition-colors';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" size="lg" disabled={pending}>
      {pending ? 'Sending…' : 'Send the request'}
    </Button>
  );
}

export default function InquiryForm() {
  const uid = useId();
  const [state, action] = useActionState(submitEventInquiry, INITIAL);
  const summaryRef = useRef<HTMLDivElement | null>(null);

  const fid = (k: string) => `${uid}-${k}`;
  const eid = (k: string) => `${uid}-${k}-error`;
  const errors = state.fieldErrors ?? {};
  const errorKeys = Object.keys(errors) as FieldName[];

  // Al volver con errores, el foco va al resumen: quien navega con teclado o
  // lector de pantalla tiene que enterarse sin salir a buscar qué pasó.
  useEffect(() => {
    if (state.status === 'error') summaryRef.current?.focus();
  }, [state]);

  if (state.status === 'ok') {
    return (
      <div role="status" className="rounded-card border border-ink/15 bg-cream p-[32px] lg:p-[48px]">
        <Eyebrow tone="deep">Request received</Eyebrow>
        <Heading level={2} className="mt-gap-kicker text-d4">
          We&rsquo;ll come back within one business day
        </Heading>
        <p className="mt-gap-bajada max-w-[54ch] text-lead text-body/80">{state.message}</p>
        <p className="mt-[16px] max-w-[54ch] text-[15px] leading-[1.65] text-body/75">
          The events packet — spaces, capacities and food tiers — comes attached to the reply.
        </p>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="flex flex-col gap-[28px]">
      {errorKeys.length > 0 || state.status === 'error' ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-card border-2 border-tomato bg-tomato/5 p-[20px]"
        >
          <p className="font-body text-[15px] font-bold text-terra">{state.message}</p>
          {errorKeys.length > 0 ? (
            <ul className="mt-[10px] flex flex-col gap-[4px]">
              {errorKeys.map((k) => (
                <li key={k}>
                  <a href={`#${fid(k)}`} className="link-texto text-[15px] text-terra">
                    {errors[k]}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {/* ── Quién sos ─────────────────────────────────────────────────── */}
      <fieldset className="flex flex-col gap-[16px]">
        <legend className="eyebrow mb-[6px] text-body/75">About you</legend>
        <div className="grid gap-[16px] sm:grid-cols-2">
          <Field k="name" fid={fid} eid={eid} errors={errors} required autoComplete="name" />
          <Field k="email" fid={fid} eid={eid} errors={errors} required type="email" autoComplete="email" />
          <Field k="phone" fid={fid} eid={eid} errors={errors} required type="tel" autoComplete="tel" />
          <Field k="company" fid={fid} eid={eid} errors={errors} autoComplete="organization" hint="Optional" />
        </div>
      </fieldset>

      {/* ── El evento ─────────────────────────────────────────────────── */}
      <fieldset className="flex flex-col gap-[16px]">
        <legend className="eyebrow mb-[6px] text-body/75">The event</legend>
        <SelectField k="eventType" fid={fid} eid={eid} errors={errors} required options={EVENT_TYPES} placeholder="Choose one" />
        <div className="grid gap-[16px] sm:grid-cols-3">
          <Field k="date" fid={fid} eid={eid} errors={errors} required type="date" />
          <Field k="startTime" fid={fid} eid={eid} errors={errors} type="time" />
          <Field k="endTime" fid={fid} eid={eid} errors={errors} type="time" />
        </div>
        <SelectField k="guests" fid={fid} eid={eid} errors={errors} required options={GUEST_RANGES} placeholder="Choose a range" />
      </fieldset>

      {/* ── Comida ────────────────────────────────────────────────────── */}
      <fieldset className="flex flex-col gap-[12px]">
        <legend className="eyebrow mb-[6px] text-body/75">
          Food tier <span className="text-terra">*</span>
        </legend>
        <p className="text-[14px] leading-[1.55] text-body/75">
          The trucks cook. We coordinate them. Pick how involved you want that to be.
        </p>
        <div className="grid gap-[12px] sm:grid-cols-3">
          {FOOD_TIERS.map((tier) => (
            <label
              key={tier.value}
              className="flex cursor-pointer flex-col gap-[6px] rounded-card border border-ink/20 p-[16px] transition-colors hover:border-ink/45 has-[:checked]:border-2 has-[:checked]:border-ink has-[:checked]:bg-cream"
            >
              <span className="flex items-center gap-[10px]">
                <input
                  type="radio"
                  name="foodTier"
                  value={tier.value}
                  aria-invalid={Boolean(errors.foodTier)}
                  aria-describedby={errors.foodTier ? eid('foodTier') : undefined}
                  className="h-[18px] w-[18px] accent-black"
                />
                <span className="font-body text-[15px] font-bold">{tier.label}</span>
              </span>
              <span className="text-[13px] leading-[1.5] text-body/75">{tier.hint}</span>
            </label>
          ))}
        </div>
        {errors.foodTier ? (
          <p id={eid('foodTier')} className="text-[14px] font-bold text-terra">
            {errors.foodTier}
          </p>
        ) : null}
      </fieldset>

      {/* ── Cierre ────────────────────────────────────────────────────── */}
      <fieldset className="flex flex-col gap-[16px]">
        <legend className="eyebrow mb-[6px] text-body/75">Anything else</legend>
        <div className="flex flex-col gap-[8px]">
          <label htmlFor={fid('comments')} className="font-body text-[15px] font-bold">
            {LABELS.comments}
          </label>
          <textarea
            id={fid('comments')}
            name="comments"
            rows={4}
            className="w-full rounded-btn border border-ink/25 bg-paper px-[14px] py-[12px] font-body text-[16px] transition-colors focus:border-ink"
          />
        </div>
        <SelectField k="referral" fid={fid} eid={eid} errors={errors} options={REFERRAL_SOURCES} placeholder="Choose one" />
      </fieldset>

      {/* Honeypot. Ni visible ni anunciado ni tabulable. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <label htmlFor={fid('website')}>Leave this empty</label>
        <input id={fid('website')} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-[12px] border-t border-ink/15 pt-[24px]">
        <p className="text-[14px] text-body/75">
          <span className="text-terra">*</span> Required
        </p>
        <div>
          <SubmitButton />
        </div>
        <p aria-live="polite" className="min-h-[20px] text-[14px] text-body/75">
          {state.status === 'error' && errorKeys.length === 0 ? state.message : ''}
        </p>
        <p className="text-[14px] text-body/75">
          Prefer email?{' '}
          <a href={`mailto:${BRAND.contact.events}`} className="link-texto">
            {BRAND.contact.events}
          </a>
        </p>
      </div>
    </form>
  );
}

/* ==========================================================================
   Campos
   ========================================================================== */

function Field({
  k,
  fid,
  eid,
  errors,
  required = false,
  type = 'text',
  autoComplete,
  hint,
}: {
  readonly k: FieldName;
  readonly fid: (k: string) => string;
  readonly eid: (k: string) => string;
  readonly errors: Record<string, string>;
  readonly required?: boolean;
  readonly type?: string;
  readonly autoComplete?: string;
  readonly hint?: string;
}) {
  const err = errors[k];
  return (
    <div className="flex flex-col gap-[8px]">
      <label htmlFor={fid(k)} className="font-body text-[15px] font-bold">
        {LABELS[k]}
        {required ? <span className="ml-[4px] text-terra">*</span> : null}
        {hint ? <span className="ml-[8px] font-normal text-body/75">{hint}</span> : null}
      </label>
      <input
        id={fid(k)}
        name={k}
        type={type}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={Boolean(err)}
        aria-describedby={err ? eid(k) : undefined}
        className={[INPUT_BASE, err ? 'border-2 border-tomato' : 'border-ink/25 focus:border-ink'].join(' ')}
      />
      {err ? (
        <p id={eid(k)} className="text-[14px] font-bold text-terra">
          {err}
        </p>
      ) : null}
    </div>
  );
}

function SelectField({
  k,
  fid,
  eid,
  errors,
  options,
  placeholder,
  required = false,
}: {
  readonly k: FieldName;
  readonly fid: (k: string) => string;
  readonly eid: (k: string) => string;
  readonly errors: Record<string, string>;
  readonly options: readonly string[];
  readonly placeholder: string;
  readonly required?: boolean;
}) {
  const err = errors[k];
  return (
    <div className="flex flex-col gap-[8px]">
      <label htmlFor={fid(k)} className="font-body text-[15px] font-bold">
        {LABELS[k]}
        {required ? <span className="ml-[4px] text-terra">*</span> : null}
      </label>
      <select
        id={fid(k)}
        name={k}
        required={required}
        defaultValue=""
        aria-invalid={Boolean(err)}
        aria-describedby={err ? eid(k) : undefined}
        className={[INPUT_BASE, err ? 'border-2 border-tomato' : 'border-ink/25 focus:border-ink'].join(' ')}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {err ? (
        <p id={eid(k)} className="text-[14px] font-bold text-terra">
          {err}
        </p>
      ) : null}
    </div>
  );
}
