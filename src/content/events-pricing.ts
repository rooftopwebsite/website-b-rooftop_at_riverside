/**
 * Los precios de eventos privados.
 *
 * ⚠️ FUENTE ÚNICA: el PDF «Events Packages» que el cliente publica hoy en su
 * propio sitio, en un botón visible a mitad de `/hostanevent`. Volcado en
 * `content/_source/hostanevent-pdf.md` el 2026-09-15. **Nada de esto se
 * dedujo ni se redondeó**: los números están tal cual salen del PDF.
 *
 * ⚠️ EL PDF NO TIENE FECHA en ninguna parte. Podría ser de 2024. Publicar un
 * precio de alquiler es una promesa comercial, así que antes de que esto salga
 * a producción el cliente tiene que confirmar que sigue vigente.
 * TODO: confirmar con cliente que los precios del PDF siguen vigentes.
 *
 * ⚠️ LAS CAPACIDADES NO ESTÁN ACÁ y siguen en `null` en `content/spaces.ts`.
 * El PDF trae precio pero no dice cuánta gente entra en cada espacio, y
 * Camila confirmó que ese dato hoy se desconoce. No se estima.
 */

export interface RentalRate {
  readonly days: string;
  readonly perHour: number;
}

export interface EventFee {
  readonly label: string;
  /** Texto tal cual lo escribe el PDF. */
  readonly amount: string;
}

export interface FoodOption {
  readonly slug: string;
  readonly name: string;
  /** `null` cuando el PDF no fija un precio. */
  readonly price: string | null;
  readonly body: string;
}

/**
 * Alquiler del segundo piso.
 *
 * PDF: «SECOND FLOOR BUYOUT · $750 per hour | Sun. - Thu. · $1,250 per hour |
 * Fri. - Sat. · 2 hours minimum · Deposit required».
 */
export const RENTAL: readonly RentalRate[] = [
  { days: 'Sunday – Thursday', perHour: 750 },
  { days: 'Friday – Saturday', perHour: 1250 },
];

export const RENTAL_MINIMUM_HOURS = 2;
export const RENTAL_DEPOSIT = true;

/** PDF: «ADDITIONAL FEES · Automatic Gratuity / 22% · Tax / 6.5% · $150 Reservation Fees». */
export const FEES: readonly EventFee[] = [
  { label: 'Automatic gratuity', amount: '22%' },
  { label: 'Tax', amount: '6.5%' },
  { label: 'Reservation fee', amount: '$150' },
];

/**
 * Las tres formas de comer, textuales del PDF.
 *
 * ⚠️ «UPSCALE CATERING» dice «specialty menus provided by in house catering».
 * Eso CONTRADICE lo que el sitio nuevo venía afirmando («no tenemos cocina»).
 * Se publica lo que dice el cliente, no nuestra versión.
 * TODO: confirmar con cliente qué es exactamente el catering in house.
 */
export const FOOD_OPTIONS: readonly FoodOption[] = [
  {
    slug: 'meal-tickets',
    name: 'Meal tickets',
    price: '$30 each',
    body: 'Good at any of the food trucks, for any meal at any price. Gratuity and taxes are included, and tickets have to be used the same day.',
  },
  {
    slug: 'small-bites',
    name: 'Food truck small bites',
    price: null,
    body: 'Every truck offers small bite options for medium to large parties.',
  },
  {
    slug: 'upscale-catering',
    name: 'Upscale catering',
    price: 'From $1,500',
    body: 'A buffet option with specialty menus, provided by in house catering.',
  },
];

/**
 * PDF: «ENHANCEMENTS · LIVE DJ · LIVE MUSIC · PHOTOS … *Pricing is based on
 * availability and group size. Please inquire for details.»
 *
 * ⚠️ Ninguno tiene precio en el PDF, y por eso ninguno lo tiene acá.
 */
export const ENHANCEMENTS: readonly { readonly name: string; readonly body: string }[] = [
  { name: 'DJ', body: 'A custom playlist tailored to your event.' },
  { name: 'Live music', body: 'A local musician on the stage that is already there.' },
  { name: 'Photo booth', body: 'Fun, interactive photos your guests take home.' },
  { name: 'Event photographer', body: 'Professional coverage of the whole night.' },
  { name: 'Decorations', body: 'Party design: custom bouquets, balloons and more.' },
];

export const ENHANCEMENTS_NOTE =
  'Pricing depends on availability and group size, so these get quoted with your request.';

/* ==========================================================================
   EL PDF
   ========================================================================== */

/*
 * ⚠️ ACÁ VIVÍA `GALERIA`, las seis casillas de «nights that already happened»
 * de /events, y se fue con esa sección el 2026-09-21. Camila: «eliminemos esta
 * parte». Cuatro de las seis eran fotos de `public/images/venue/` que la misma
 * página ya muestra en el hero y en los espacios, y las otras dos eran huecos
 * esperando material que el cliente no mandó. Los archivos siguen en el repo:
 * lo que se borró es la lista, no las fotos.
 */

/**
 * El PDF de eventos que el cliente ya publica.
 *
 * ⚠️ NO ESTÁ EN `public/` Y ES A PROPÓSITO: pesa 13 MB, y 13 MB versionados
 * viajan en cada deploy para siempre. Mientras no haya una versión liviana, el
 * link apunta al que el cliente ya sirve desde su sitio.
 *
 * ⚠️ EL PESO Y EL FORMATO SE MUESTRAN EN EL BOTÓN, pedido de Camila. En un
 * celular con datos, 13 MB es una descarga que conviene decidir antes de
 * empezarla.
 *
 * TODO: pedir al cliente una versión comprimida para hospedarla en `public/`.
 */
export const EVENTS_PDF = {
  label: 'Events Packages',
  href: 'https://www.eatdrinkparadise.com/_files/ugd/526079_a57cd7cf0ea149ec9fc0a6edb745d1c1.pdf',
  format: 'PDF',
  size: '13 MB',
} as const;
