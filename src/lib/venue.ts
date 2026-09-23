import { HOURS } from '@/content/hours';
import type { Hours } from '@/types/content';
import { BRAND } from './brand';
import { getHours, getLocation } from './restoexp';

export interface Venue {
  readonly name: string;
  readonly phone: string;
  readonly phoneHref: string;
  readonly email: string;
  readonly emailEvents: string;
  readonly emailHiring: string;
  readonly street: string;
  readonly locality: string;
  readonly region: string;
  readonly postalCode: string;
  readonly neighborhood: string;
  readonly mapsUrl: string;
  readonly geo: { readonly lat: number; readonly lng: number } | null;
  readonly timezone: string;
  readonly hours: readonly Hours[];
  readonly fromDb: boolean;
}

const telHref = (phone: string) => `tel:+1${phone.replace(/\D/g, '')}`;

export async function getVenue(): Promise<Venue> {
  const loc = await getLocation();

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

export const venueAddressLine = (v: Venue) =>
  `${v.street}, ${v.locality}, ${v.region} ${v.postalCode}`;
