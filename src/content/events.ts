import raw from './events.json';
import { BRAND } from '@/lib/brand';
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

/*
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ «EVENT» O «HAPPENING»: CUÁL ELEGIR AL CARGAR EN EL DASHBOARD.
 *
 * El dashboard ofrece dos tipos al crear, y no son intercambiables. Probados
 * los dos el 2026-09-17, esto es lo que cambia:
 *
 *   EVENT      «a specific dated experience». Pide FECHA de inicio y tiene
 *              hora de inicio, pero NO hora de fin salvo que se prenda «set
 *              end date». La repetición es un switch aparte, y es el switch
 *              que alguien puede apagar sin querer: es exactamente lo que
 *              dejó a Wooftop Wednesdays y a Bingo Night fuera del sitio,
 *              convertidos en eventos de un solo día con fecha ya pasada.
 *
 *   HAPPENING  «recurring, no fixed dates». Pide DÍAS de la semana (varios) y
 *              un rango de hora «From / To». No se puede desactivar la
 *              repetición porque es lo que el tipo significa. La fecha de
 *              inicio la pone el sistema en el día de la carga.
 *
 * ⚠️ LA REGLA DEL PROYECTO, entonces:
 *   · Algo que pasa SIEMPRE (happy hour, bingo, la noche de música) → HAPPENING.
 *   · Algo con FECHA propia (un festival, un show puntual) → EVENT.
 *   · Algo de TEMPORADA (los domingos de fútbol) → EVENT, porque la fecha de
 *     arranque es un dato real que conviene conservar.
 *
 * Los dos guardan `is_recurring` y `recurrence_days`, que es lo único que
 * este archivo mira: el sitio no distingue los tipos, los lee igual.
 * ══════════════════════════════════════════════════════════════════════════
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
  /**
   * Los días de la semana en que se repite. Vacío si es un evento puntual.
   *
   * ⚠️ ES UNA LISTA Y ERA UN DÍA SOLO. Ver `parseWeekdays`: el happy hour es
   * sábado y domingo, y con un solo día se publicaba la mitad.
   */
  readonly weekdays: readonly Weekday[];
  readonly date: string | null;
  /**
   * LA TEMPORADA DE UN RECURRENTE: desde cuándo y hasta cuándo se repite.
   *
   * ══════════════════════════════════════════════════════════════════════
   * ⚠️ ANTES NO EXISTÍAN Y EL CALENDARIO MENTÍA EN LOS DOS EXTREMOS. Un
   * recurrente se expandía sobre TODOS los días del mes que cayeran en su
   * día de la semana, mirara uno el mes que mirara: NFC North HQ, que
   * arranca el 13 de septiembre, aparecía los domingos de julio y va a
   * seguir apareciendo los domingos de junio del año que viene.
   *
   * ⚠️ LOS DOS DATOS YA VENÍAN EN LA BASE y nadie los usaba: `start_date` es
   * obligatorio en el dashboard y `end_date` es la columna que estaba ahí
   * sin consumir. Ahora `from` es el piso y `until` el techo, y un evento de
   * temporada se apaga solo el día que corresponde.
   *
   * ⚠️ `until` EN `null` SIGNIFICA «hasta que alguien lo saque», que es lo
   * correcto mientras el cliente no diga hasta cuándo corre. No es un dato
   * que podamos deducir: es una decisión del negocio.
   * ══════════════════════════════════════════════════════════════════════
   */
  readonly from: string;
  readonly until: string | null;
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

/**
 * `"[6,0]"` → `[0, 6]`, o sea sábado y domingo.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ DEVUELVE TODOS LOS DÍAS Y ANTES DEVOLVÍA SÓLO EL PRIMERO. La versión
 * vieja hacía `arr[0]` y tiraba el resto, lo cual no se notaba porque los
 * cinco eventos cargados caían en un día cada uno.
 *
 * Se notó el 2026-09-17 con el happy hour, que es **sábado y domingo**: con
 * un solo día, la mitad de la semana de happy hour desaparecía del calendario
 * sin ningún aviso. La columna de la base siempre guardó una lista; el que
 * leía de menos era este código.
 *
 * ⚠️ VIENEN ORDENADOS, que es lo que permite escribirlos como rango
 * («Saturday – Sunday») sin volver a pensar el orden en cada lugar donde se
 * dibujan. 0 es domingo.
 * ══════════════════════════════════════════════════════════════════════════
 */
function parseWeekdays(days: string | null): readonly Weekday[] {
  if (!days) return [];
  try {
    const arr = JSON.parse(days);
    if (!Array.isArray(arr)) return [];
    return arr
      .map(Number)
      .filter((n): n is Weekday => Number.isInteger(n) && n >= 0 && n <= 6)
      .sort((a, b) => a - b);
  } catch {
    return [];
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
 * «Poster for <título>», que es pobre pero honesto. Era «<título> — event
 * poster» hasta el 2026-09-23, y el guion largo no va en ningún texto visible.
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
 * una entrada.
 *
 * CÓMO SE USA: la clave es el `slug` del evento, que sale del título.
 *   'swamp-fest': 'https://www.eventbrite.com/e/…'
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LOS DOS SHOWS APUNTAN AL PERFIL DEL ORGANIZADOR Y NO A SU PROPIA PÁGINA
 * DE VENTA, y hay que saberlo antes de mirar el botón.
 *
 * Camila, 2026-09-17: «Ross Brown y La Noche · DJ David Cast son los únicos
 * dos que deben decir que son con entrada sacada por link externo y de alguna
 * manera debemos redirigir a la página de la ticketera». O sea: la decisión de
 * que llevan entrada está tomada; lo que falta es la URL de cada uno.
 *
 * ⚠️ EL RIESGO ESTÁ ANOTADO PORQUE ES REAL: al 2026-09-15 el perfil de
 * Eventbrite del cliente dice «No upcoming events». Un botón que promete
 * entradas y cae en un perfil vacío es peor que no tener botón, así que esto
 * dura hasta que lleguen las dos URLs (ítem 22 y 39 del pedido al cliente). Es
 * lo mejor disponible hoy y es explícitamente lo que se pidió.
 *
 * TODO: reemplazar por la URL del evento de cada show.
 * TODO: pedirle a RestoExp la columna `ticket_url` en `location_events` y
 *       borrar este diccionario.
 * ══════════════════════════════════════════════════════════════════════════
 */
const TICKETS: Readonly<Record<string, string>> = {
  ...(BRAND.eventbrite
    ? {
        'ross-brown': BRAND.eventbrite,
        'la-noche-dj-david-cast': BRAND.eventbrite,
      }
    : {}),
};

/** Un renglón que es ítem de lista y no prosa: «1. …», «2) …» o «$8 …». */
const ES_ITEM = /^(?:\d+[.)]|\$\d)/;

/** La primera frase del primer renglón que no sea un ítem. Ver `summary`. */
function bajadaDe(parrafos: readonly string[]): string | null {
  const prosa = parrafos.find((p) => !ES_ITEM.test(p.trim()));
  if (!prosa) return parrafos[0] ?? null;
  return prosa.split(/(?<=\.)\s/)[0] ?? prosa;
}

function adapt(r: RawEvent): VenueEvent {
  const weekdays = r.isRecurring ? parseWeekdays(r.recurrenceDays) : [];
  const start = hhmm(r.startTime);
  const end = hhmm(r.endTime) || start;
  /*
   * ⚠️ UN BLOQUE DEL DASHBOARD ES UN PÁRRAFO, y antes hacía falta un renglón
   * vacío en el medio para que contara como tal (`\n{2,}`). Verificado el
   * 2026-09-17 creando el happy hour: el editor del dashboard es por BLOQUES
   * —cada uno con su botón «¶»— y los guarda unidos con UN solo salto de
   * línea. O sea que toda descripción de varios bloques llegaba como un
   * párrafo gigante y se renderizaba como un solo bloque de texto corrido.
   *
   * Ahora `\n+`: lo que el cliente separó en el editor, se publica separado.
   */
  const paragraphs = r.description.split(/\n+/).map((p) => p.trim()).filter(Boolean);
  const price = r.price === null ? null : Number(r.price);
  const slug = slugify(r.title);

  return {
    slug,
    title: r.title,
    kind: r.isRecurring ? 'recurring' : 'one-off',
    /*
      ⚠️ LA BAJADA ES LA PRIMERA FRASE QUE SEA UNA FRASE, y no el primer renglón
      a secas. Camila, 2026-09-21, sobre el sorteo de los domingos: «el primer
      párrafo previo a los pasos se puede quitar». Sacado ése, el primer renglón
      de ese evento pasó a ser «1. Everyone at the table gets a ticket…», y la
      bajada se publica en dos lugares donde un paso suelto no tiene sentido: la
      tarjeta del carrusel de la home y la `description` del JSON-LD que lee
      Google.

      Así que se saltean los renglones que son ÍTEM y no prosa: los numerados
      —«1.», «2)»— y los que arrancan con un precio, que es como el cliente
      carga las ofertas del happy hour. Es la misma lectura que hace la tarjeta
      de `/whats-on` para dibujarlos como lista.

      ⚠️ SI TODO EL TEXTO SON ÍTEMS, cae al primero igual: una bajada rara es
      mejor que ninguna, y el título del evento sigue estando arriba.
    */
    summary: bajadaDe(paragraphs) ?? r.title,
    body: paragraphs,
    weekdays,
    date: r.isRecurring ? null : r.startDate,
    from: r.startDate,
    until: r.endDate,
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
    imageAlt: r.bannerUrl ? (ALT[slugify(r.title)] ?? `Poster for ${r.title}`) : null,
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

/*
 * ⚠️ ACÁ VIVÍA `EVENTS_FALLBACK`, el respaldo sincrónico, y se fue el
 * 2026-09-17. Lo usaba un solo llamador —la grilla del mes de `/whats-on`— y
 * era la causa de que esa grilla contradijera a la tira de la semana de la
 * misma página: una leía el volcado versionado y la otra la base.
 *
 * El respaldo NO desapareció, cambió de lugar: sigue adentro de
 * `getVenueEvents()`, que cae en `events.json` cuando la base no contesta. La
 * diferencia es que ahora es un plan B y no una fuente paralela.
 */

/*
 * ⚠️ ACÁ VIVÍA `recurringEvents()` y se fue el 2026-09-17, el mismo día y por
 * el mismo motivo que `EVENTS_FALLBACK`: se quedó sin llamadores.
 *
 *   · La home dejó de preguntar «qué se repite» para preguntar «qué viene».
 *     Ver `upcomingOccurrences` en `lib/calendar.ts`.
 *   · `/whats-on` sigue mostrando la grilla semanal, pero ya no pide la lista
 *     aparte: filtra la ÚNICA lectura de la página, que es lo que garantiza
 *     que la tira de la semana y la grilla del mes no puedan contradecirse.
 */

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

/**
 * `2026-09-21` → `Sun, Sep 21`. El renglón del día en las tarjetas de la home.
 *
 * ⚠️ REEMPLAZA AL NOMBRE DEL DÍA SUELTO, que era lo que se podía decir cuando
 * la home mostraba la programación semanal: «WEDNESDAY» sirve para algo que
 * pasa todos los miércoles y miente para algo que pasa UN miércoles. Ahora
 * cada tarjeta es una fecha concreta y el renglón lo dice.
 *
 * ⚠️ `timeZone: 'UTC'` con la hora clavada al mediodía. La fecha ya viene
 * resuelta en el huso del venue; volver a interpretarla en el huso del
 * visitante la correría un día para medio planeta.
 */
export function shortDate(date: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * Los días de un recurrente, escritos. «Saturday – Sunday», «Wednesday».
 *
 * ⚠️ DOS DÍAS SEGUIDOS SE ESCRIBEN COMO RANGO y dos sueltos con «and». El en
 * dash de un rango es correcto y la regla del proyecto lo conserva; el que no
 * se usa nunca es el em dash.
 *
 * ⚠️ SÁBADO Y DOMINGO SON UN RANGO aunque los números no sean consecutivos:
 * 6 y 0 es el fin de semana, que es como lo lee cualquiera. Es el único caso
 * especial y está acá para no tener que pensarlo en cada lugar que lo dibuja.
 */
export function weekdaysLabel(days: readonly Weekday[], corto = false): string {
  /*
   * ⚠️ LA VERSIÓN CORTA EXISTE POR LA PÍLDORA DEL HERO, que tiene un
   * presupuesto real de ~22 caracteres medido en pantalla (ver `Hero.tsx`):
   * «Happy hour Saturday – Sunday» cae en dos renglones y «Happy hour Sat –
   * Sun» entra. No es un capricho de estilo, es el ancho de la caja.
   */
  const nombre = (d: Weekday) => (corto ? weekdayLabel(d).slice(0, 3) : weekdayLabel(d));

  if (days.length === 0) return '';
  if (days.length === 1) return nombre(days[0]);

  const finDeSemana = days.length === 2 && days[0] === 0 && days[1] === 6;
  if (finDeSemana) return `${nombre(6)} – ${nombre(0)}`;

  const seguidos = days.every((d, i) => i === 0 || d === days[i - 1] + 1);
  if (seguidos) return `${nombre(days[0])} – ${nombre(days[days.length - 1])}`;

  const nombres = days.map(nombre);
  return `${nombres.slice(0, -1).join(', ')} and ${nombres[nombres.length - 1]}`;
}

/** Cuándo pasa, en una línea. «Every Wednesday · 7 – 9 PM» */
export function whenLabel(e: VenueEvent): string {
  const time = timeRange(e);
  if (e.kind === 'recurring' && e.weekdays.length > 0) {
    return `Every ${weekdaysLabel(e.weekdays)} · ${time}`;
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
  return (await getVenueEvents()).filter(
    (e) => e.kind === 'recurring' && e.weekdays.includes(day),
  );
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

/**
 * ══════════════════════════════════════════════════════════════════════════
 * ¿ESTO SE TERMINA? Una fecha única, o una temporada con fecha de fin.
 *
 * ⚠️ `until === null` SIGNIFICA «hasta que alguien lo saque», o sea que el
 * evento corre para siempre: el bingo de los miércoles, el happy hour del fin
 * de semana. Ésos no se pierden, y por eso no se destacan.
 *
 * ⚠️ TODO LO QUE NO ES RECURRENTE ES, POR DEFINICIÓN, ACOTADO: un `one-off` o
 * un festival son una fecha y nada más.
 * ══════════════════════════════════════════════════════════════════════════
 */
export const isLimitedRun = (e: VenueEvent): boolean =>
  e.kind !== 'recurring' || e.until !== null;

/**
 * ══════════════════════════════════════════════════════════════════════════
 * LO QUE EL CALENDARIO DESTACA CON FONDO.
 *
 * Camila, 2026-09-21: «quiero que las que son únicas se destaquen con fondito;
 * bingo queda como ahora, happy hour también, pero la del DJ va destacadita;
 * las que si no asistís ahora, que tiene fechas después, no están más».
 *
 * ⚠️ SON DOS CONDICIONES Y ES UNA DECISIÓN TOMADA, NO UN DESCUIDO. La regla que
 * Camila describió es la de arriba —lo que tiene fin—, pero al verificarla
 * contra la base apareció que HOY NINGÚN EVENTO TIENE `endDate` CARGADO: La
 * Noche, que era su ejemplo, está como semanal sin fin y sigue apareciendo en
 * septiembre de 2027. Con la regla sola, su ejemplo no se habría destacado.
 *
 * Elección de Camila con ese dato a la vista: «ambas». Así que el fondo marca
 * lo que se termina Y lo que se paga, que son las dos formas que tiene un
 * evento de pedir que vayas a ése y no al de la semana que viene.
 *
 * ⚠️ EL DÍA QUE EL CLIENTE CARGUE LOS FINES DE TEMPORADA, ESTO NO SE TOCA: los
 * eventos entran solos. Ver el bloque de huecos de datos en
 * `docs/pedido-al-cliente.md`.
 * ══════════════════════════════════════════════════════════════════════════
 */
export const standsOut = (e: VenueEvent): boolean => isLimitedRun(e) || isTicketed(e);
