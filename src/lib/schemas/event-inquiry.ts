import { z } from 'zod';
import {
  AREAS_OF_INTEREST,
  BAR_TIERS,
  BUDGET_RANGES,
  EVENT_SUBTYPES,
  FOOD_TIERS,
  GUEST_RANGES,
  REFERRAL_SOURCES,
} from '@/content/spaces';

/**
 * El schema de la consulta de eventos de `/events`.
 *
 * ⚠️ VIVÍA ADENTRO DE LA SERVER ACTION y se mudó acá el 2026-09-23, por el
 * mismo motivo que los otros cuatro: el navegador valida con ESTE objeto antes
 * de enviar, así que los mensajes de error son texto por texto los del
 * servidor. Un archivo `'use server'` sólo puede exportar funciones async, así
 * que el cliente no tenía cómo importarlo desde allá.
 *
 * ⚠️ Los dropdowns se validan contra la MISMA lista que renderiza el formulario
 * (`z.enum` sobre las constantes de `content/spaces.ts`), así que no se pueden
 * desincronizar: si alguien agrega un tipo de evento en un lado y no en el otro,
 * TypeScript lo marca.
 */
export const inquirySchema = z
  .object({
    name: z.string().trim().min(2, 'Your name is required.').max(100, 'Keep this under 100 characters.'),
    email: z.string().trim().email('Enter a valid email.').max(254, 'That email is too long.'),
    phone: z
      .string()
      .trim()
      .max(30, 'That phone number is too long.')
      .refine((v) => v.replace(/\D/g, '').length >= 10, 'Enter a phone number with at least 10 digits.'),
    company: z.string().trim().max(160).optional().default(''),
    /**
     * ⚠️ PASÓ DE OCHO TIPOS PLANOS A FAMILIA + SUBTIPO, pedido de Camila el
     * 2026-09-15. El valor que viaja es «Corporate: Fundraiser or benefit», así
     * que el mail de la consulta se lee solo sin abrir nada.
     */
    eventType: z.enum(EVENT_SUBTYPES, { message: 'Choose what kind of event it is.' }),
    /**
     * ⚠️ LA FECHA NO PUEDE SER PASADA. El `min` del input ya lo dice, pero un
     * `min` es una sugerencia al selector: se puede tipear una fecha vieja a
     * mano, y una consulta para el martes pasado es un mail que nadie puede
     * contestar.
     *
     * ⚠️ SE COMPARA COMO TEXTO `YYYY-MM-DD` contra hoy EN FLORIDA. Un
     * `new Date()` del servidor corre en UTC y a las 9 de la noche en Bonita
     * Springs ya sería mañana: el «hoy» se rechazaría.
     */
    date: z
      .string()
      .trim()
      .min(1, 'Event date is required.')
      /*
       * ⚠️ EL FORMATO SE VALIDA ANTES QUE «ES FUTURA». El input es
       * `type="date"`, pero el servidor recibe texto: sin este chequeo,
       * cualquier cadena que compare mayor que la fecha de hoy pasaba el
       * `refine` de abajo tal cual, y esa cadena viaja tal cual al asunto del
       * mail.
       */
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Pick a date.')
      .refine((v) => v >= hoyEnFlorida(), 'Pick a date from today on.'),
    /**
     * ⚠️ LA FECHA ALTERNATIVA ES OPCIONAL PERO SE PIDE SIEMPRE, y es el campo
     * que más llamadas ahorra: la mitad de las consultas caen en un sábado que
     * ya está tomado, y sin una segunda fecha eso son dos mails de ida y vuelta
     * antes de poder contestar algo.
     */
    altDate: z
      .string()
      .trim()
      .optional()
      .default('')
      .refine((v) => v === '' || /^\d{4}-\d{2}-\d{2}$/.test(v), 'Pick a date.')
      .refine((v) => v === '' || v >= hoyEnFlorida(), 'Pick a date from today on.'),
    startTime: z.string().trim().max(200, 'Keep this under 200 characters.').optional().default(''),
    endTime: z.string().trim().max(200, 'Keep this under 200 characters.').optional().default(''),
    guests: z.enum(GUEST_RANGES, { message: 'Choose a guest count.' }),
    foodTier: z.enum(FOOD_TIERS.map((t) => t.value) as [string, ...string[]], {
      message: 'Choose a food tier.',
    }),
    /**
     * ⚠️ OPCIONAL, al revés que la comida: se puede alquilar el lugar sin cerrar
     * la barra en un paquete. Ver la nota del campo en `InquiryForm`.
     *
     * ⚠️ EL `preprocess` CONVIERTE EL «SIN ELEGIR» EN `undefined`. El `<select>`
     * con placeholder manda `''` cuando no se toca, y `z.enum().optional()`
     * acepta `undefined` pero rechaza `''`: sin esto, dejar el campo opcional
     * sin tocar daba error.
     */
    barTier: z.preprocess((v) => (v === '' ? undefined : v), z.enum(BAR_TIERS).optional()),
    budget: z.enum(BUDGET_RANGES, { message: 'Pick a range, even a rough one.' }),
    /** Casillas: se leen con `getAll`, no con `fromEntries`. */
    areas: z
      .array(z.enum(AREAS_OF_INTEREST.map((a) => a.value) as [string, ...string[]]))
      .optional()
      .default([]),
    comments: z
      .string()
      .trim()
      .max(4000, 'Keep it under 4000 characters.')
      .optional()
      .default(''),
    referral: z.preprocess((v) => (v === '' ? undefined : v), z.enum(REFERRAL_SOURCES).optional()),
    /**
     * Honeypot. Un campo oculto que una persona nunca llena y un bot sí.
     * Es la defensa antispam más barata y no le pide nada al usuario — a
     * diferencia de un captcha, que además es una barrera de accesibilidad.
     */
    website: z.string().max(0).optional().default(''),
  })
  /*
   * ⚠️ LA HORA DE FIN TIENE QUE SER DESPUÉS DE LA DE INICIO, salvo que el
   * evento cruce la medianoche. El sábado la barra cierra a las 2 AM, así que
   * «9 PM a 1 AM» es una consulta real y no un error de tipeo. Se acepta
   * cuando el fin cae en la madrugada (antes de las 4), que es lo único que
   * puede significar.
   */
  .refine(
    (d) =>
      !d.startTime || !d.endTime || d.endTime > d.startTime || d.endTime < '04:00',
    { path: ['endTime'], message: 'End time has to be after the start time.' },
  )
  .refine((d) => !d.altDate || d.altDate !== d.date, {
    path: ['altDate'],
    message: 'Pick a different day than the first one.',
  });

export type InquiryInput = z.infer<typeof inquirySchema>;

/** `YYYY-MM-DD` de hoy en el huso del venue. */
export function hoyEnFlorida(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

/** Del `FormData` al objeto que valida el schema. Lo usan el cliente y la action. */
export function inquiryFromForm(fd: FormData) {
  return {
    ...Object.fromEntries(fd),
    areas: fd.getAll('areas').map(String),
  };
}
