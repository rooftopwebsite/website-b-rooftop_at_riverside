import type { Hours } from '@/types/content';

/**
 * Los datos del local, leídos de la base de RestoExp.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ SÍ SE PUEDE LEER CON LA ANON KEY, y el repo tenía anotado lo contrario.
 *
 * La nota vieja decía que la anon key «autentica pero no tiene permiso sobre
 * nada», porque la prueba se había hecho contra `/rest/v1/events`, una tabla
 * que NO EXISTE. Las que existen son `locations`, `location_hours`,
 * `location_events` y `menu_items`, y las cuatro devuelven 200 con la anon key
 * que ya está en `.env.local`. Verificado el 2026-09-15.
 *
 * ⚠️ NO FALTA NINGUNA VARIABLE DE ENTORNO. Las tres que hacen falta ya están:
 *   · NEXT_PUBLIC_SUPABASE_URL
 *   · NEXT_PUBLIC_SUPABASE_ANON_KEY
 *   · NEXT_PUBLIC_SUPABASE_RESTAURANT_ID
 * Lo que faltaba era el código que las usara. Esto es ese código.
 *
 * ⚠️ NUNCA la `SUPABASE_SERVICE_ROLE_KEY` acá. La instancia es COMPARTIDA por
 * todos los sitios de la casa y lo único que separa un cliente de otro es el
 * `restaurant_id`: la service role saltea el row-level security y daría acceso
 * de administrador a los datos de todos los demás restaurantes.
 *
 * ⚠️ FETCH PLANO Y NO `@supabase/supabase-js`. Son dos GET con filtro; el
 * paquete pesa más que el código que lo usaría, y así el caché lo maneja Next
 * con `revalidate` en vez de una capa propia.
 * ══════════════════════════════════════════════════════════════════════════
 */

const URL_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const RESTAURANT_ID = process.env.NEXT_PUBLIC_SUPABASE_RESTAURANT_ID;

/** Una hora. El dato del local cambia poco y una página vieja de una hora no rompe nada. */
const REVALIDATE = 3600;

export interface RestoexpLocation {
  readonly id: string;
  readonly name: string;
  readonly address: string | null;
  readonly city: string | null;
  readonly country: string | null;
  readonly phone: string | null;
  readonly email: string | null;
  readonly website_url: string | null;
  readonly google_maps_url: string | null;
  readonly latitude: number | null;
  readonly longitude: number | null;
  readonly timezone: string | null;
  /** Hoy viene `null` en este restaurante. Ver `docs/`. */
  readonly social_links: readonly { readonly platform: string; readonly url: string }[] | null;
}

interface LocationHourRow {
  readonly day_of_week: number; // 0 = domingo
  readonly open_time: string | null;
  readonly close_time: string | null;
  readonly is_closed: boolean;
}

/**
 * SIN EM DASHES. Se aplica a TODO texto que entra de la base.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ REGLA ESTRICTA DEL PROYECTO: ningún texto visible del sitio lleva em dash
 * (—). Vale para copy, titulares, alt, aria-label y metadatos. Se reemplaza
 * por punto, coma, dos puntos o paréntesis, el que corresponda al sentido.
 *
 * ⚠️ HACE FALTA ACÁ PORQUE EL CLIENTE LOS ESCRIBE. Verificado el 2026-09-15:
 * el menú cargado en el dashboard tiene seis, entre nombres de ítem («Xtini —
 * The Espresso Martini»), categorías («Wine — White») y descripciones («a new
 * frozen flavor — ask us what's blending now»). Ahora que la fuente es la
 * base, el texto ya no pasa por nuestras manos antes de publicarse.
 *
 * ⚠️ LA ELECCIÓN NO ES AL AZAR, y son sólo dos casos:
 *   · Si lo que va antes son tres palabras o menos, es un RÓTULO y su
 *     calificador: «Wine — White» → «Wine: White». Dos puntos.
 *   · Si es más largo, son dos oraciones: «…flavor — ask us…» → «…flavor. Ask
 *     us…». Punto, y mayúscula en la que sigue.
 *
 * ⚠️ EL EN DASH (–) SE CONSERVA. En rangos —«3–6 PM», «$25–35»— es la forma
 * tipográfica correcta y no es lo que la regla prohíbe.
 *
 * TODO: pedirle al cliente que los corrija en el dashboard. Esto es una red,
 * no el arreglo: el texto correcto tiene que estar en la fuente.
 */
export function sinEmDash(t: string): string;
export function sinEmDash(t: string | null): string | null;
export function sinEmDash(t: string | null): string | null {
  if (!t || !t.includes('—')) return t;
  return t
    .split('—')
    .map((p) => p.trim())
    .reduce((acc, parte, i) => {
      if (i === 0) return parte;
      if (!parte) return acc;
      const palabras = acc.split(/\s+/).filter(Boolean).length;
      // Rótulo corto y su calificador: dos puntos.
      if (palabras <= 3) return `${acc}: ${parte}`;
      // Dos oraciones: punto y mayúscula en la que sigue.
      const conMayuscula = parte.charAt(0).toUpperCase() + parte.slice(1);
      return `${acc.replace(/[.,;:]$/, '')}. ${conMayuscula}`;
    }, '')
    .trim();
}

async function query<T>(path: string): Promise<readonly T[]> {
  if (!URL_BASE || !ANON || !RESTAURANT_ID) {
    console.warn('[restoexp] faltan variables de Supabase, se usa el contenido local');
    return [];
  }
  try {
    const res = await fetch(`${URL_BASE}/rest/v1/${path}`, {
      headers: { apikey: ANON, Authorization: `Bearer ${ANON}` },
      next: { revalidate: REVALIDATE, tags: ['restoexp'] },
    });
    if (!res.ok) {
      console.error(`[restoexp] ${path} devolvió ${res.status}`);
      return [];
    }
    return (await res.json()) as readonly T[];
  } catch (e) {
    // ⚠️ Nunca tirar: si la base no contesta, el sitio se sirve igual con el
    // contenido local. Un teléfono viejo es infinitamente mejor que un 500.
    console.error('[restoexp]', e instanceof Error ? e.message : e);
    return [];
  }
}

/** La ficha del local. `null` si la base no contesta: el llamador usa el respaldo. */
export async function getLocation(): Promise<RestoexpLocation | null> {
  const rows = await query<RestoexpLocation>(
    `locations?restaurant_id=eq.${RESTAURANT_ID}&select=*&limit=1`,
  );
  return rows[0] ?? null;
}

const DIAS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** `15:00:00` → `3:00 PM`. El formato que ya usa el sitio. */
function reloj(t: string | null): string {
  if (!t) return '';
  const [hRaw, m] = t.split(':');
  const h = Number(hRaw);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m} ${ampm}`;
}

/**
 * Los horarios del local, en el mismo formato que consume todo el sitio.
 *
 * ⚠️ DEVUELVE LOS DE LA BARRA. La base guarda UN set de horarios por local y
 * el negocio tiene DOS: la barra y los food trucks abren y cierran a horas
 * distintas todos los días. Los de la barra coinciden exactos con la base; los
 * de los trucks no están en ninguna tabla.
 * TODO: confirmar con cliente si los horarios de los trucks pueden cargarse en
 * el dashboard. Hasta entonces esa columna sale de `content/hours.ts`.
 */
export async function getHours(location: string): Promise<readonly Hours[] | null> {
  const rows = await query<LocationHourRow>(
    `location_hours?location_id=eq.${location}&select=day_of_week,open_time,close_time,is_closed&order=day_of_week`,
  );
  if (rows.length === 0) return null;

  // La base arranca en domingo; el sitio muestra la semana de lunes a domingo.
  const porDia = new Map(rows.map((r) => [r.day_of_week, r]));
  const orden = [1, 2, 3, 4, 5, 6, 0];

  return orden.map((d) => {
    const r = porDia.get(d);
    return {
      day: DIAS[d],
      bar: !r || r.is_closed ? 'Closed' : `${reloj(r.open_time)} – ${reloj(r.close_time)}`,
      trucks: '',
    };
  });
}

/* ==========================================================================
   EL MENÚ DE LA BARRA

   ⚠️ ESTÁ CARGADO ENTERO EN LA BASE, y el repo lo tenía transcrito a mano.
   Verificado el 2026-09-15: el menú «Sunset Bar» tiene las NUEVE categorías
   exactas de `content/bar-menu.ts` y 50 ítems con precio y descripción. La
   transcripción a mano se hizo porque el sitio viejo publica el menú como dos
   imágenes JPG, y nadie había mirado la base.

   Ahora el cliente cambia un precio en el dashboard y el sitio lo sigue.
   ========================================================================== */

export interface MenuRow {
  readonly name: string;
  readonly description: string | null;
  readonly base_price: number | null;
  readonly is_active: boolean;
  readonly sort_order: number | null;
}

export interface MenuGroup {
  readonly title: string;
  readonly note: string | null;
  readonly items: readonly MenuRow[];
}

/**
 * Las nueve cartas del bar, en el orden del dashboard.
 *
 * ⚠️ FILTRA `is_active`. Un ítem desactivado en el dashboard es un ítem que el
 * cliente sacó de la carta, y publicarlo es ofrecer algo que no existe.
 */
export async function getMenu(): Promise<readonly MenuGroup[] | null> {
  const menus = await query<{ id: string }>(
    `menus?restaurant_id=eq.${RESTAURANT_ID}&select=id&limit=1`,
  );
  const menu = menus[0];
  if (!menu) return null;

  const cats = await query<{ id: string; name: string; description: string | null }>(
    `menu_categories?menu_id=eq.${menu.id}&select=id,name,description&order=sort_order`,
  );
  if (cats.length === 0) return null;

  const grupos = await Promise.all(
    cats.map(async (c) => {
      const items = await query<MenuRow>(
        `menu_items?category_id=eq.${c.id}&select=name,description,base_price,is_active,sort_order&order=sort_order`,
      );
      return {
        title: sinEmDash(c.name),
        note: sinEmDash(c.description),
        items: items
          .filter((i) => i.is_active)
          .map((i) => ({
            ...i,
            name: sinEmDash(i.name),
            description: sinEmDash(i.description),
          })),
      };
    }),
  );

  return grupos.filter((g) => g.items.length > 0);
}

/* ==========================================================================
   LOS EVENTOS

   ⚠️ SE LEEN EN VIVO Y YA NO POR SCRIPT. Hasta el 2026-09-15 los bajaba
   `npm run sync:events` a un JSON versionado, porque se creía que la única
   puerta era la API del dashboard, que exige sesión. Pero la tabla
   `location_events` se lee con la anon key, así que el JSON y el script dejan
   de hacer falta: el cliente carga un evento y aparece en el sitio sin deploy.

   ⚠️ LA FORMA QUE DEVUELVE ES LA MISMA que traía el JSON, a propósito. El
   adaptador de `content/events.ts` y las siete piezas que lo consumen no se
   enteran del cambio.
   ========================================================================== */

/** La fila cruda, con los nombres que ya espera el adaptador. */
export interface RawEventRow {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly bannerUrl: string | null;
  readonly startDate: string;
  readonly endDate: string | null;
  readonly startTime: string;
  readonly endTime: string | null;
  readonly isRecurring: boolean;
  readonly recurrenceType: string | null;
  readonly recurrenceDays: string | null;
  readonly price: number | string | null;
  readonly tags: readonly string[];
}

interface EventDbRow {
  readonly id: string;
  readonly title: string;
  readonly description: string | null;
  readonly banner_url: string | null;
  readonly start_date: string;
  readonly end_date: string | null;
  readonly start_time: string | null;
  readonly end_time: string | null;
  readonly is_recurring: boolean;
  readonly recurrence_type: string | null;
  readonly recurrence_days: unknown;
  readonly price: number | string | null;
  readonly tags: readonly string[] | null;
  readonly status: string | null;
}

export async function getEvents(): Promise<readonly RawEventRow[] | null> {
  const rows = await query<EventDbRow>(
    `location_events?restaurant_id=eq.${RESTAURANT_ID}&select=*&order=sort_order`,
  );
  if (rows.length === 0) return null;

  return rows
    // Un evento en borrador o cancelado no se publica.
    .filter((r) => r.status === null || r.status === 'active' || r.status === 'published')
    .map((r) => ({
      id: r.id,
      title: sinEmDash(r.title),
      description: sinEmDash(r.description) ?? '',
      bannerUrl: r.banner_url,
      startDate: r.start_date,
      endDate: r.end_date,
      startTime: r.start_time ?? '00:00:00',
      endTime: r.end_time,
      isRecurring: r.is_recurring,
      recurrenceType: r.recurrence_type,
      // El adaptador espera el JSON serializado, que es lo que devolvía la API.
      recurrenceDays:
        r.recurrence_days == null
          ? null
          : typeof r.recurrence_days === 'string'
            ? r.recurrence_days
            : JSON.stringify(r.recurrence_days),
      price: r.price,
      tags: r.tags ?? [],
    }));
}

/* ==========================================================================
   LAS VACANTES

   ⚠️ LA TABLA EXISTE Y HOY ESTÁ VACÍA para este restaurante. Verificado el
   2026-09-15: `job_postings` tiene título, descripción, requisitos, tipo de
   empleo, departamento, rango salarial y método de postulación, y devuelve
   cero filas con `restaurant_id` del cliente.

   Eso es exactamente lo que necesita `/join-us`: si el cliente carga una
   búsqueda en el dashboard, aparece listada; si no hay ninguna, la página
   muestra aplicación abierta. Ninguna de las dos cosas necesita un deploy, y
   NO hace falta un `content/positions.ts` escrito a mano.
   ========================================================================== */

export interface JobPosting {
  readonly id: string;
  readonly title: string;
  readonly description: string | null;
  readonly requirements: string | null;
  readonly employment_type: string | null;
  readonly department: string | null;
  readonly salary_type: string | null;
  readonly salary_min: number | null;
  readonly salary_max: number | null;
  readonly status: string | null;
}

/** Las búsquedas abiertas. Array vacío = aplicación abierta, no error. */
export async function getJobPostings(): Promise<readonly JobPosting[]> {
  const rows = await query<JobPosting>(
    `job_postings?restaurant_id=eq.${RESTAURANT_ID}&select=*&order=sort_order`,
  );
  // Una búsqueda cerrada o en borrador no se publica.
  return rows.filter((r) => r.status === null || r.status === 'open' || r.status === 'active');
}
