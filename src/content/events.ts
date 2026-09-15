import raw from './events.json';
import { getEvents } from '@/lib/restoexp';

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
  /** La pieza del evento, subida al dashboard. Storage público de Supabase. */
  readonly bannerUrl: string | null;
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
 * El texto alternativo de la pieza de cada evento, por slug.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ES LO ÚNICO QUE SOBREVIVE DEL MAPA MANUAL DE IMÁGENES, que vivía acá y
 * se fue el 2026-09-11. Aquel mapa asociaba slug → archivo del repo, y era un
 * parche con dos costos: había que tocar código para publicar la foto de un
 * evento, y el sitio no podía mostrar nada que el cliente subiera.
 *
 * Resultó que la tabla `events` SÍ tiene campo de imagen (`bannerUrl`) y que
 * el sync simplemente no lo bajaba. Ahora lo baja, así que la imagen sale del
 * dashboard y este archivo ya no decide cuál es.
 *
 * ⚠️ QUEDA EL `alt` PORQUE EL DASHBOARD NO LO GUARDA. Y acá importa más que
 * en una foto cualquiera: estas piezas son GRÁFICAS con el texto incrustado
 * —el nombre del artista, el día, el horario—, así que sin `alt` quien usa un
 * lector de pantalla se pierde información que para el resto está a la vista.
 * Por eso el `alt` TRANSCRIBE lo que la pieza dice.
 *
 * ⚠️ Un evento que no esté acá no se queda sin `alt`: cae en el genérico
 * «<título> — event poster», que es pobre pero honesto.
 *
 * El día que el dashboard tenga campo de texto alternativo, esto se va igual
 * que se fue el mapa de imágenes.
 */
const ALT: Readonly<Record<string, string>> = {
  'ross-brown':
    'Event poster reading “Live Entertainment: Ross Brown”, with Ross Brown singing into a microphone in a palm-print shirt',
  'la-noche-dj-david-cast':
    'Event poster reading “La Noche: every Saturday 10 PM to 2 AM, Latin music from DJ David Cast, free dance classes”',
};

/**
 * LAS URLS DE ENTRADAS, POR CÓDIGO.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ESTO ESTÁ ACÁ PORQUE LA BASE NO TIENE DÓNDE GUARDARLO. Revisadas las 22
 * columnas de `location_events` el 2026-09-15: hay `price`, `capacity` y
 * `requires_reservation`, pero ningún campo para un link de Eventbrite.
 * Decisión de Camila: mientras no exista la columna, el link va por código.
 *
 * ⚠️ Y ES UN PARCHE, con fecha de vencimiento. El costo real: **el cliente no
 * puede publicar un show con entrada sin que alguien toque el repo y
 * despliegue.** Carga el evento en el dashboard, aparece en el calendario, y
 * el botón de comprar no está hasta que se agregue una línea acá.
 *
 * ⚠️ ESTE ARCHIVO YA TUVO UN DICCIONARIO ASÍ Y SE SACÓ POR ESTE MOTIVO. Era
 * `IMAGENES[slug]`, slug → archivo de imagen, y se fue el 2026-09-11 cuando se
 * descubrió que la tabla SÍ tenía `bannerUrl` y que el sync no lo bajaba. La
 * diferencia es que ahí el campo existía y acá no: éste no esquiva una columna,
 * la suple.
 *
 * ⚠️ NO INVENTAR URLS. Una clave acá es una promesa de que se puede comprar
 * una entrada. Hoy el diccionario está VACÍO a propósito: el perfil de
 * Eventbrite del cliente dice «No upcoming events».
 *
 * CÓMO SE USA: la clave es el `slug` del evento, que sale del título.
 *   'swamp-fest': 'https://www.eventbrite.com/e/…'
 *
 * TODO: confirmar con cliente las URLs de Eventbrite de cada show con entrada.
 * TODO: pedirle a RestoExp la columna `ticket_url` en `location_events` y
 *       borrar este diccionario.
 * ══════════════════════════════════════════════════════════════════════════
 */
const TICKETS: Readonly<Record<string, string>> = {};

function adapt(r: RawEvent): VenueEvent {
  const weekday = r.isRecurring ? parseWeekday(r.recurrenceDays) : null;
  const start = hhmm(r.startTime);
  const end = hhmm(r.endTime) || start;
  const paragraphs = r.description.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const price = r.price === null ? null : Number(r.price);
  const slug = slugify(r.title);

  return {
    slug,
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
    ticketUrl: TICKETS[slug] ?? null,
    price: price !== null && Number.isFinite(price) && price > 0 ? price : null,
    /*
     * ⚠️ LA IMAGEN SALE DEL DASHBOARD, no de un mapa nuestro. Acá vivía
     * `IMAGENES[slug]`, un diccionario a mano de slug → archivo del repo, y
     * se fue el 2026-09-11 cuando se descubrió que la tabla `events` SÍ
     * tiene campo de imagen (`bannerUrl`) y que el sync simplemente no lo
     * bajaba.
     *
     * El mapa era un parche con dos costos: había que tocar código para
     * publicar la foto de un evento, y el sitio no podía mostrar nada que el
     * cliente subiera. Ahora el cliente sube la pieza en el dashboard,
     * corre el sync y aparece.
     */
    image: r.bannerUrl,
    imageAlt: r.bannerUrl ? (ALT[slugify(r.title)] ?? `${r.title} — event poster`) : null,
    tags: r.tags,
  };
}

/**
 * LOS EVENTOS, EN VIVO DESDE LA BASE.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ES ASYNC Y ANTES ERA UNA CONSTANTE. El cambio es del 2026-09-15 y el
 * motivo está en `lib/restoexp.ts`: la tabla `location_events` se lee con la
 * anon key, así que ya no hace falta bajar los eventos con un script y
 * versionar el JSON. El cliente carga un evento en el dashboard y aparece.
 *
 * ⚠️ `events.json` QUEDA COMO RESPALDO, no como fuente. Si la base no
 * contesta, el calendario se sirve con el último volcado en vez de quedar
 * vacío. Un calendario desactualizado es malo; uno en blanco es peor.
 *
 * ⚠️ `npm run sync:events` YA NO ES NECESARIO para publicar. Sirve sólo para
 * refrescar el respaldo, que conviene hacer de vez en cuando.
 * ══════════════════════════════════════════════════════════════════════════
 */
export async function getVenueEvents(): Promise<readonly VenueEvent[]> {
  const deLaBase = await getEvents();
  const filas = deLaBase ?? (raw as readonly RawEvent[]);
  return filas.map(adapt);
}

/** El respaldo, sincrónico. Sólo para el sitemap y para cuando no se puede await. */
export const EVENTS_FALLBACK: readonly VenueEvent[] = (raw as readonly RawEvent[]).map(adapt);

export const recurringEvents = async () =>
  (await getVenueEvents()).filter((e) => e.kind === 'recurring');

/**
 * El evento DESTACADO del calendario: el que abre `/whats-on` con una card
 * grande. Es el que lleva el tag `featured` en el dashboard.
 *
 * ⚠️ DEVUELVE UNO SOLO, aunque haya varios marcados. Dos cards grandes
 * seguidas dejan de destacar y empujan la primera fecha real dos pantallas
 * abajo. Si el cliente marca dos, gana el primero del calendario y el segundo
 * aparece como una fila normal — que es el peor caso aceptable.
 *
 * ⚠️ EL TAG SE PONE EN LA BASE, NO ACÁ. Es lo que le permite al cliente
 * cambiar el destacado sin tocar el código. Hoy lo lleva el evento de los
 * domingos de fútbol, que antes era la página `/nfc-north-hq`.
 */
export const featuredEvent = async () =>
  (await getVenueEvents()).find((e) => e.tags.includes('featured')) ?? null;

export const eventBySlug = async (slug: string) =>
  (await getVenueEvents()).find((e) => e.slug === slug);

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
export async function eventsOnWeekday(day: Weekday): Promise<readonly VenueEvent[]> {
  return (await getVenueEvents()).filter((e) => e.kind === 'recurring' && e.weekday === day);
}

/* ==========================================================================
   LOS FILTROS DEL CALENDARIO

   ⚠️ SALEN DE LOS TAGS DE LA BASE, no de una lista escrita a mano. El cliente
   etiqueta el evento en el dashboard y cae en el filtro que corresponde. Si
   agrega un tag nuevo que no está mapeado, el evento sigue apareciendo en
   «Everything»: nunca desaparece por falta de etiqueta.

   ⚠️ UN FILTRO QUE NO TIENE NINGÚN EVENTO NO SE DIBUJA. Un filtro que al
   apretarlo da cero resultados es una promesa incumplida.
   ========================================================================== */

export interface EventFilter {
  readonly id: string;
  readonly label: string;
  /** Tags de la base que caen en este filtro. */
  readonly tags: readonly string[];
}

export const EVENT_FILTERS: readonly EventFilter[] = [
  { id: 'music', label: 'Live music', tags: ['live-music', 'dj', 'music'] },
  { id: 'sports', label: 'Sports', tags: ['sports'] },
  { id: 'themed', label: 'Themed nights', tags: ['bingo', 'themed', 'trivia', 'karaoke'] },
  { id: 'festival', label: 'Festivals', tags: ['festival'] },
  { id: 'family', label: 'Family and dogs', tags: ['dog-friendly', 'family', 'kids'] },
];

export const matchesFilter = (e: VenueEvent, id: string | null): boolean => {
  if (!id) return true;
  const f = EVENT_FILTERS.find((x) => x.id === id);
  if (!f) return true;
  return e.tags.some((t) => f.tags.includes(t)) || (id === 'festival' && e.kind === 'festival');
};

/** Sólo los filtros que hoy tienen al menos un evento. */
export const activeFilters = (events: readonly VenueEvent[]): readonly EventFilter[] =>
  EVENT_FILTERS.filter((f) => events.some((e) => matchesFilter(e, f.id)));

/**
 * ¿Este evento lleva entrada?
 *
 * ⚠️ NO alcanza con que tenga precio: el `price` de la base es informativo (un
 * bingo puede tener premio y no entrada). Lo que define que se venda entrada
 * es tener `ticketUrl`. Sin URL, el calendario dice «free entry» y no muestra
 * ningún botón de compra, que es lo honesto.
 */
export const isTicketed = (e: VenueEvent): boolean => e.ticketUrl !== null;
