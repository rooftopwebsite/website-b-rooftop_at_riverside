import { HOURS } from '@/content/hours';
import type { Hours } from '@/types/content';
import { BRAND } from './brand';

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
}

export async function getVenue(): Promise<Venue> {
  return {
    name: BRAND.name,
    phone: BRAND.contact.phone,
    phoneHref: BRAND.contact.phoneHref,
    email: BRAND.contact.email,
    emailEvents: BRAND.contact.events,
    emailHiring: BRAND.contact.hiring,
    street: BRAND.address.street,
    locality: BRAND.address.locality,
    region: BRAND.address.region,
    postalCode: BRAND.address.postalCode,
    neighborhood: BRAND.address.neighborhood,
    mapsUrl:
      BRAND.address.mapsUrl ||
      `https://www.google.com/maps/search/?api=1&query=${BRAND.address.mapsQuery}`,
    geo: BRAND.address.geo,
    timezone: BRAND.address.timezone,
    hours: HOURS,
  };
}

export const venueAddressLine = (v: Venue) =>
  `${v.street}, ${v.locality}, ${v.region} ${v.postalCode}`;
