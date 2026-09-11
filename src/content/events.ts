import raw from './events.json';

/**
 * Los eventos. **La fuente de verdad es el dashboard, no este archivo.**
 *
 * Se cargan y editan en app.restoexp.com → Rooftop at Riverside → Events.
 * `npm run sync:events` los baja a `events.json` y esto los adapta al tipo que
 * usa el sitio. Nadie escribe un evento a mano acá.
 *
 * ⚠️ Por qué hay un JSON en el medio y no un fetch en cada request: la API del
 * dashboard exige sesión (401 sin cookie) y la plataforma no emite API keys ni
 * expone lectura pública — verificado el 2026-09-08. Ver `scripts/sync-events.mjs`.
 * Cuando eso exista, este archivo pasa a hacer el fetch y el JSON desaparece;
 * el resto del sitio no se entera porque todo consume estas funciones.
 *
 * ⚠️ El error que estamos corrigiendo: el calendario de Wix es un iframe de
 * `calendar.boomte.ch` y no devuelve un solo nombre de evento en el HTML
 * servido. Acá cada evento se renderiza en el servidor y tiene URL propia.
 */

export type EventKind = 'recurring' | 'one-off' | 'festival';
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** La fila cruda tal como la devuelve el dashboard. */
interface RawEvent {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly startDate: string;
  readonly endDate: string | null;
  readonly startTime: string;
  readonly endTime: string | null;
  readonly isRecurring: boolean;
  readonly recurrenceType: string | null;
  /** JSON serializado: `"[3]"` = miércoles. 0 = domingo. */
  readonly recurrenceDays: string | null;
  readonly price: number | string | null;
  readonly tags: readonly string[];
}

export interface VenueEvent {
  readonly slug: string;
  readonly title: string;
  readonly kind: EventKind;
  /** Bajada de una línea, para cards y meta description. */
  readonly summary: string;
  /** Cuerpo, en párrafos. */
  readonly body: readonly string[];
  readonly weekday: Weekday | null;
  readonly date: string | null;
  readonly startTime: string;
  readonly endTime: string;
  readonly endsNextDay: boolean;
  readonly space: 'Sunset Bar' | 'The Yard' | 'Game Lounge' | 'Venue-wide';
  readonly ticketUrl: string | null;
  readonly price: number | null;
  readonly image: string | null;
  readonly imageAlt: string | null;
  readonly tags: readonly string[];
}

/** «La Noche · DJ David Cast» → `la-noche-dj-david-cast`. */
function slugify(title: string): string {
  return title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** `15:00:00` → `15:00`. El dashboard devuelve segundos, el sitio no los usa. */
const hhmm = (t: string | null): string => (t ?? '').slice(0, 5);

/**
 * En qué espacio pasa.
 *
 * ⚠️ El dashboard no tiene campo de espacio, así que se deduce del TAG. Es una
 * convención acordada: al cargar el evento se le pone `sunset-bar`, `the-yard`
 * o `game-lounge`. Sin tag cae en «Venue-wide», que es lo correcto para algo
 * como Wooftop Wednesdays, que pasa en todo el lugar.
 */
function spaceFromTags(tags: readonly string[]): VenueEvent['space'] {
  if (tags.includes('sunset-bar')) return 'Sunset Bar';
  if (tags.includes('the-yard')) return 'The Yard';
  if (tags.includes('game-lounge')) return 'Game Lounge';
  return 'Venue-wide';
}

function parseWeekday(days: string | null): Weekday | null {
  if (!days) return null;
  try {
    const arr = JSON.parse(days);
    const first = Array.isArray(arr) ? Number(arr[0]) : NaN;
    return Number.isInteger(first) && first >= 0 && first <= 6 ? (first as Weekday) : null;
  } catch {
    return null;
  }
}

/**
 * La foto de cada evento, por slug.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ VIVE ACÁ Y NO EN `events.json`, y es importante. Ese JSON lo sobreescribe
 * `npm run sync:events` desde la fuente del cliente, así que cualquier campo
 * agregado a mano ahí se pierde en la siguiente sincronización. Este mapa es
 * nuestro y sobrevive.
 *
 * ⚠️ QUÉ FOTO SE LE PUEDE PONER A UN EVENTO, que es una decisión de honestidad
 * y no de diseño. La entrega del cliente no trae fotos DE estos eventos: trae
 * fotos del lugar. Así que la regla que se aplicó es que la imagen muestre el
 * **tipo de noche y el espacio** donde el evento pasa, y que el `alt` describa
 * lo que se ve —no lo que dice el título—. Un `alt` que diga «Bingo Night»
 * sobre una foto donde no hay bingo es una mentira para quien usa lector de
 * pantalla.
 *
 * ⚠️ `wooftop-wednesdays` QUEDA SIN FOTO A PROPÓSITO. Es la noche de perros y
 * en las 36 fotos entregadas **no hay ni un perro**. Cualquier foto del patio
 * puesta ahí diría «traé al perro» sobre una imagen sin perros, que es
 * justamente lo que el placeholder marcado evita. Sigue mostrando el hueco con
 * el brief de la toma que hay que pedir. Ver `docs/media.md`.
 * ══════════════════════════════════════════════════════════════════════════
 */
/**
 * La pieza gráfica de cada evento.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ SÓLO ENTRAN PIEZAS DEL EVENTO, NO FOTOS DE AMBIENTE. Es la regla que
 * cambió acá el 2026-09-11, por pedido de Camila, y conviene entenderla
 * antes de agregar una entrada.
 *
 * Antes esto mapeaba tres eventos a fotos genéricas del venue: un guitarrista
 * cualquiera para Ross Brown, el patio de noche para Bingo, la pista para La
 * Noche. Se leía bien pero decía algo falso — la foto del guitarrista no era
 * Ross Brown, y la del patio no era una noche de Bingo. En una tarjeta que
 * lleva el nombre del artista arriba, la imagen de abajo se lee como ESE
 * artista.
 *
 * Ahora hay dos entradas y las dos son la pieza real que el local publica
 * para ese evento, bajadas del calendario del sitio viejo. Los otros dos
 * eventos NO tienen entrada y muestran el hueco gris marcado, que es lo
 * honesto: decir «falta la pieza» en vez de poner una foto que no es.
 *
 * ⚠️ SON GRÁFICAS 4:5 CON TEXTO INCRUSTADO, no fotos. Quien agregue una acá
 * tiene que mandarla al pipeline con el mismo tratamiento (ver los dos
 * `calendar-*.jpg` en `scripts/build-media.mjs`): 4:5 y sin recorte, o el
 * `fit:'cover'` le come el nombre del artista.
 *
 * ⚠️ El `alt` describe la PIEZA y transcribe lo que dice, porque el texto
 * está dentro de la imagen: quien no la ve tiene que recibir la misma
 * información que quien la ve.
 * ══════════════════════════════════════════════════════════════════════════
 */
const IMAGENES: Readonly<Record<string, { readonly src: string; readonly alt: string }>> = {
  'ross-brown': {
    src: '/images/venue/event-ross-brown.jpg',
    alt: 'Event poster: “Live Entertainment — Ross Brown”, with Ross Brown singing into a microphone in a palm-print shirt',
  },
  'la-noche-dj-david-cast': {
    src: '/images/venue/event-la-noche.jpg',
    alt: 'Event poster: “La Noche — every Saturday 10 PM to 2 AM, Latin music from DJ David Cast, free dance classes”',
  },
  /*
   * ⚠️ `bingo-night` y `wooftop-wednesdays` NO TIENEN ENTRADA, Y NO ES UN
   * OLVIDO. Son los dos eventos que el calendario del cliente no publica
   * (ver `docs/current-site-inventory.md` §9), así que no existe pieza
   * gráfica de la que bajarlas.
   *
   * Bingo SÍ tenía una foto acá —el patio de noche— y se le sacó a
   * propósito: era una foto del lugar, no de una noche de Bingo. Prefiere
   * Camila el hueco gris marcado antes que una foto que no corresponde.
   *
   * `event-yard-night.jpg` y `event-dj-night.jpg` siguen en
   * `public/images/venue/` y los sigue usando el divisor de fotos de la
   * home. No se borran.
   */
};

function adapt(r: RawEvent): VenueEvent {
  const weekday = r.isRecurring ? parseWeekday(r.recurrenceDays) : null;
  const start = hhmm(r.startTime);
  const end = hhmm(r.endTime) || start;
  const paragraphs = r.description.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const price = r.price === null ? null : Number(r.price);

  return {
    slug: slugify(r.title),
    title: r.title,
    kind: r.isRecurring ? 'recurring' : 'one-off',
    // La bajada es la primera frase; el cuerpo, todo.
    summary: (paragraphs[0] ?? '').split(/(?<=\.)\s/)[0] ?? r.title,
    body: paragraphs,
    weekday,
    date: r.isRecurring ? null : r.startDate,
    startTime: start,
    endTime: end,
    // Cierra después de medianoche: 22:00 → 02:00.
    endsNextDay: end < start,
    space: spaceFromTags(r.tags),
    // Ticketing externo por Eventbrite. Todavía no tenemos la URL del cliente,
    // así que ningún evento es de entrada paga por ahora.
    ticketUrl: null,
    price: price !== null && Number.isFinite(price) && price > 0 ? price : null,
    // Ver `IMAGENES` arriba: `null` cuando no hay una foto honesta para ese
    // evento, y ahí el componente muestra el hueco marcado con su brief.
    image: IMAGENES[slugify(r.title)]?.src ?? null,
    imageAlt: IMAGENES[slugify(r.title)]?.alt ?? null,
    tags: r.tags,
  };
}

export const EVENTS: readonly VenueEvent[] = (raw as readonly RawEvent[]).map(adapt);

export const recurringEvents = () => EVENTS.filter((e) => e.kind === 'recurring');
export const eventBySlug = (slug: string) => EVENTS.find((e) => e.slug === slug);

const WEEKDAY_LABEL = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

export const weekdayLabel = (d: Weekday) => WEEKDAY_LABEL[d];

/** `15:00` → `3 PM`, `19:30` → `7:30 PM`. Sin ceros a la izquierda. */
export function formatTime(hm: string): string {
  const [h, m] = hm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour} ${suffix}` : `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
}

export function timeRange(e: VenueEvent): string {
  return `${formatTime(e.startTime)} – ${formatTime(e.endTime)}`;
}

/** Cuándo pasa, en una línea. «Every Wednesday · 7 – 9 PM» */
export function whenLabel(e: VenueEvent): string {
  const time = timeRange(e);
  if (e.kind === 'recurring' && e.weekday !== null) {
    return `Every ${weekdayLabel(e.weekday)} · ${time}`;
  }
  if (e.date) {
    const label = new Date(`${e.date}T12:00:00Z`).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    });
    return `${label} · ${time}`;
  }
  return time;
}

/** Los eventos recurrentes que caen en un día de la semana dado. */
export function eventsOnWeekday(day: Weekday): readonly VenueEvent[] {
  return EVENTS.filter((e) => e.kind === 'recurring' && e.weekday === day);
}
