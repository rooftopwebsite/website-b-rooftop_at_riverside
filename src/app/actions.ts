'use server';

import { z } from 'zod';
import { BRAND } from '@/lib/brand';
import { sendMail } from '@/lib/mail';
import { EVENT_TYPES, FOOD_TIERS, GUEST_RANGES, REFERRAL_SOURCES } from '@/content/spaces';

/**
 * Server Actions de los dos formularios del sitio.
 *
 * ⚠️ La validación se repite ACÁ aunque el cliente ya valide. La del cliente es
 * para la experiencia; la del servidor es la que manda. Un POST a mano se salta
 * la primera entera.
 *
 * ⚠️ Los dropdowns se validan contra la MISMA lista que renderiza el formulario
 * (`z.enum` sobre las constantes de `content/spaces.ts`), así que no se pueden
 * desincronizar: si alguien agrega un tipo de evento en un lado y no en el otro,
 * TypeScript lo marca.
 */

export interface ActionState {
  readonly status: 'idle' | 'ok' | 'error';
  readonly message: string;
  /** Errores por campo, para pintarlos donde corresponde. */
  readonly fieldErrors?: Record<string, string>;
}

/* ==========================================================================
   Consulta de eventos
   ========================================================================== */

const inquirySchema = z.object({
  name: z.string().trim().min(2, 'Your name is required.'),
  email: z.string().trim().email('Enter a valid email address, like you@example.com.'),
  phone: z
    .string()
    .trim()
    .refine((v) => v.replace(/\D/g, '').length >= 10, 'Enter a phone number with at least 10 digits.'),
  company: z.string().trim().optional().default(''),
  eventType: z.enum(EVENT_TYPES, { message: 'Choose a type of event.' }),
  date: z.string().trim().min(1, 'Event date is required.'),
  startTime: z.string().trim().optional().default(''),
  endTime: z.string().trim().optional().default(''),
  guests: z.enum(GUEST_RANGES, { message: 'Choose a guest count.' }),
  foodTier: z.enum(FOOD_TIERS.map((t) => t.value) as [string, ...string[]], {
    message: 'Choose a food tier.',
  }),
  comments: z.string().trim().max(4000).optional().default(''),
  referral: z.enum(REFERRAL_SOURCES).optional(),
  /**
   * Honeypot. Un campo oculto que una persona nunca llena y un bot sí.
   * Es la defensa antispam más barata y no le pide nada al usuario — a
   * diferencia de un captcha, que además es una barrera de accesibilidad.
   */
  website: z.string().max(0).optional().default(''),
});

export async function submitEventInquiry(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const parsed = inquirySchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form');
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    // Si cayó el honeypot no se dice por qué: se responde como éxito para no
    // enseñarle al bot dónde estuvo el problema.
    if (fieldErrors.website) return { status: 'ok', message: 'Thanks. Your request is in.' };
    return { status: 'error', message: 'Please check the highlighted fields.', fieldErrors };
  }

  const d = parsed.data;
  const lines = [
    `New event inquiry from ${BRAND.name}`,
    '',
    `Name:        ${d.name}`,
    `Email:       ${d.email}`,
    `Phone:       ${d.phone}`,
    d.company ? `Company:     ${d.company}` : null,
    '',
    `Event type:  ${d.eventType}`,
    `Date:        ${d.date}`,
    d.startTime || d.endTime ? `Time:        ${d.startTime || '?'} – ${d.endTime || '?'}` : null,
    `Guests:      ${d.guests}`,
    `Food tier:   ${d.foodTier}`,
    d.referral ? `Heard via:   ${d.referral}` : null,
    '',
    d.comments ? `Comments:\n${d.comments}` : null,
  ]
    .filter((l) => l !== null)
    .join('\n');

  const res = await sendMail({
    to: process.env.EVENTS_INBOX ?? BRAND.contact.events,
    subject: `Event inquiry: ${d.name}, ${d.date} (${d.guests})`,
    text: lines,
    // Responder al mail va directo a quien consultó, no al buzón genérico.
    replyTo: d.email,
  });

  if (!res.ok) {
    return {
      status: 'error',
      message: `${res.message} You can reach us at ${BRAND.contact.events}.`,
    };
  }

  return { status: 'ok', message: 'Thanks. Your request is in.' };
}

/* ==========================================================================
   Alta de newsletter
   ==========================================================================

   ⚠️ ESTA ACTION SE BORRÓ UNA VEZ Y VOLVIÓ. Vale la pena saber por qué, para
   que no la borren de nuevo.

   Se eliminó el 2026-09-09 junto con el formulario del footer, con este
   argumento: «la web actual no tiene nada parecido —no figura en
   docs/current-site-inventory.md— y el cliente nunca lo pidió».

   El argumento era correcto y la premisa falsa. `eatdrinkparadise.com` SÍ
   tiene el formulario, en el pre-footer, verificado el 2026-09-11:

       título      «Sign Up»
       bajada      «Stay up to date with all the latest from Rooftop at Riverside»
       campos      First name · Last name · Email
       botón       «Join»
       éxito       «Thanks for subscribing!»

   O sea que el error no estuvo en la decisión sino en el inventario, que no
   lo registró. Ya está corregido en `docs/current-site-inventory.md`.

   ⚠️ NO USA RESEND, a diferencia de `submitEventInquiry`. Un mail por alta no
   es una lista: alguien tendría que copiar las direcciones a mano antes de
   poder mandar nada. Va a una planilla por webhook de Apps Script, que es el
   mismo mecanismo de casa-pirul y deja la lista exportable.

   ⚠️ PENDIENTE BLOQUEANTE: la planilla y el Apps Script NO EXISTEN todavía.
   Sin `NEWSLETTER_SHEETS_WEBHOOK_URL` en el entorno, esta action responde
   error —a propósito: ver la nota de `falta la URL` más abajo—. El código del
   script y el paso a paso están en `docs/pedido-al-cliente.md`. */

const newsletterSchema = z.object({
  firstName: z.string().trim().min(2, 'Enter your first name.'),
  email: z.string().trim().email('Enter a valid email address, like you@example.com.'),
  /* El mismo honeypot que el formulario de eventos. Ver la nota de arriba. */
  website: z.string().max(0).optional().default(''),
});

export async function subscribeToNewsletter(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = newsletterSchema.safeParse(Object.fromEntries(formData) as Record<string, string>);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form');
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    // Igual que en eventos: si cayó el honeypot se responde como éxito, para
    // no enseñarle al bot dónde estuvo el problema.
    if (fieldErrors.website) return { status: 'ok', message: 'Thanks for subscribing!' };
    return { status: 'error', message: 'Please check the highlighted fields.', fieldErrors };
  }

  const { firstName, email } = parsed.data;
  const webhook = process.env.NEWSLETTER_SHEETS_WEBHOOK_URL;

  /*
   * ⚠️ FALTA LA URL → ERROR, y NO un «gracias» de mentira.
   *
   * Es tentador devolver `ok` mientras la planilla no exista, para que la
   * página se vea terminada. Sería el peor de los dos mundos: la persona se
   * va creyendo que se suscribió, no vuelve a intentar, y nadie se entera de
   * que el sitio está tirando altas a la basura. Un error visible se arregla;
   * un éxito falso no se detecta nunca.
   */
  if (!webhook) {
    console.error('[newsletter] falta NEWSLETTER_SHEETS_WEBHOOK_URL — el alta NO se guardó');
    return {
      status: 'error',
      message: `Sign-up isn’t live yet. Write to us at ${BRAND.contact.email} and we’ll add you.`,
    };
  }

  /*
   * ⚠️ EL TIMEOUT NO ES OPCIONAL. Apps Script es lento y a veces no contesta;
   * sin `AbortController` un `fetch` colgado deja la Server Action esperando
   * hasta el tope de la plataforma y el usuario mirando un botón en «Adding…».
   * Doce segundos es lo que usa casa-pirul y alcanza de sobra.
   */
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  try {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, email, source: 'rooftopatriverside.com' }),
      signal: controller.signal,
    });

    if (!res.ok) throw new Error(`Apps Script respondió ${res.status}`);

    /*
     * ⚠️ APPS SCRIPT DEVUELVE 200 AUNQUE FALLE. Es una particularidad suya: el
     * `doPost` que rompe igual contesta 200 con `{result:'error'}` en el
     * cuerpo. Si sólo se mirara `res.ok`, un fallo de escritura en la planilla
     * se le reportaría al usuario como éxito.
     */
    const cuerpo = (await res.json().catch(() => null)) as { result?: string; error?: string } | null;
    if (cuerpo?.result === 'error') throw new Error(`Apps Script: ${cuerpo.error}`);
  } catch (err) {
    console.error('[newsletter] no se pudo guardar el alta:', err);
    return { status: 'error', message: 'Something went wrong. Please try again in a moment.' };
  } finally {
    clearTimeout(timeout);
  }

  return { status: 'ok', message: 'Thanks for subscribing!' };
}
