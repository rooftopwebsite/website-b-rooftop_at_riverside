import { HOURS } from '@/content/hours';
import type { Hours } from '@/types/content';
import { BRAND } from './brand';
import { getHours, getLocation } from './restoexp';

/**
 * EL LOCAL, RESUELTO. La única función que el sitio llama para saber el
 * teléfono, la dirección o los horarios.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LA BASE MANDA, `brand.ts` ES EL RESPALDO.
 *
 * Todo lo que la tabla `locations` de RestoExp sabe contestar, lo contesta
 * ella: nombre, dirección, ciudad, teléfono, mail, link de Maps, coordenadas y
 * zona horaria. Los horarios salen de `location_hours`. El cliente los edita
 * en el dashboard y el sitio los sigue sin que nadie toque código.
 *
 * `brand.ts` sólo entra cuando la base no contesta, o para los campos que la
 * base NO PUEDE guardar porque no tiene columna. Son cuatro y están marcados
 * abajo uno por uno.
 *
 * ⚠️ POR QUÉ UNA SOLA FUNCIÓN Y NO UN FETCH POR PÁGINA. Antes de esto había
 * veintitrés archivos leyendo `BRAND.contact.phone` a mano. Con un solo punto
 * de entrada, el día que la base sume el código postal se cambia acá y
 * aparece en todo el sitio.
 *
 * ⚠️ NO CUESTA VEINTITRÉS REQUESTS. `fetch` de Next dedupe por URL dentro del
 * mismo render, y arriba de eso hay `revalidate: 3600`. Llamar a `getVenue()`
 * en cinco componentes de la misma página es un solo viaje a la base.
 * ══════════════════════════════════════════════════════════════════════════
 */

export interface Venue {
  readonly name: string;
  readonly phone: string;
  readonly phoneHref: string;
  readonly email: string;
  /** Sin columna propia en la base. Sale de `brand.ts`. */
  readonly emailEvents: string;
  /** Sin columna propia en la base. Sale de `brand.ts`. */
  readonly emailHiring: string;
  readonly street: string;
  readonly locality: string;
  /** Sin columna en la base: la tabla salta de `city` a `country`. */
  readonly region: string;
  /** Sin columna en la base. */
  readonly postalCode: string;
  /** Sin columna en la base. Es texto editorial, no un dato de ficha. */
  readonly neighborhood: string;
  readonly mapsUrl: string;
  readonly geo: { readonly lat: number; readonly lng: number } | null;
  readonly timezone: string;
  /** Los siete días, con los dos sets. Ver la nota de abajo. */
  readonly hours: readonly Hours[];
  /** `true` si los datos vinieron de la base; `false` si se sirvió el respaldo. */
  readonly fromDb: boolean;
}

/** `(239) 268-0080` → `tel:+12392680080`. */
const telHref = (phone: string) => `tel:+1${phone.replace(/\D/g, '')}`;

export async function getVenue(): Promise<Venue> {
  const loc = await getLocation();

  /*
   * ⚠️ LOS HORARIOS SE FUSIONAN, NO SE REEMPLAZAN. La base guarda UN set por
   * local y el negocio tiene DOS: la barra abre a las 3 y los trucks a las 4,
   * todos los días. La columna de la barra sale de la base; la de los trucks
   * no tiene dónde vivir todavía.
   * TODO: confirmar con cliente si el dashboard puede guardar los dos sets.
   */
  const deLaBase = loc ? await getHours(loc.id) : null;
  const hours: readonly Hours[] = deLaBase
    ? deLaBase.map((fila, i) => ({ ...fila, trucks: HOURS[i]?.trucks ?? '' }))
    : HOURS;

  const phone = loc?.phone ?? BRAND.contact.phone;

  return {
    name: loc?.name ?? BRAND.name,
    phone,
    phoneHref: telHref(phone),
    email: loc?.email ?? BRAND.contact.email,
    emailEvents: BRAND.contact.events,
    emailHiring: BRAND.contact.hiring,
    street: loc?.address ?? BRAND.address.street,
    locality: loc?.city ?? BRAND.address.locality,
    region: BRAND.address.region,
    postalCode: BRAND.address.postalCode,
    neighborhood: BRAND.address.neighborhood,
    mapsUrl:
      loc?.google_maps_url ??
      `https://www.google.com/maps/search/?api=1&query=${BRAND.address.mapsQuery}`,
    geo:
      loc?.latitude != null && loc?.longitude != null
        ? { lat: loc.latitude, lng: loc.longitude }
        : BRAND.address.geo,
    timezone: loc?.timezone ?? BRAND.address.timezone,
    hours,
    fromDb: loc !== null,
  };
}

/** La dirección en una línea, para metadatos y para el pie. */
export const venueAddressLine = (v: Venue) =>
  `${v.street}, ${v.locality}, ${v.region} ${v.postalCode}`;
