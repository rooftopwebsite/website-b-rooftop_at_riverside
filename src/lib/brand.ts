import CONTACT from '@/content/contact.json';

export const COLORS = {
  sunset: '#F58521',
  'sunset-hover': '#E0741A',
  river: '#0EB6B8',
  cream: '#FDF0B4',
  mint: '#C4F2EC',
  deep: '#014545',
  deeper: '#013434',
  teal600: '#028382',
  tomato: '#EB452C',
  terra: '#A62000',
  'sunset-deep': '#D66A0A',
  'tomato-soft': '#FF8F7A',
  plum: '#402639',
  magenta: '#A24584',
  ink: '#0A1F1E',
  body: '#0A1F1E',
  paper: '#FFFFFF',
  bone: '#FAF6EA',
  muted: '#487270',
  'muted-dark': '#A8C6C4',
  fog: '#DED8C7',
} as const;

export const COLOR_RULES = {
  neverAsTextOnLight: ['sunset', 'river'],
  textOnBrandFill: '#000000',
  colorTextOnPaper: ['ink', 'body', 'muted', 'deep', 'plum', 'terra', 'magenta', 'teal600'],
  colorTextOnBone: ['ink', 'body', 'muted', 'deep', 'plum', 'terra', 'magenta'],
  textOnDeep: ['paper', 'cream'],
  headlineAccent: { onLight: 'sunset-deep', onDark: 'sunset' },
  displayOnly: ['sunset on deep', 'sunset-deep on paper', 'sunset-deep on bone'],
} as const;

export const BRAND = {
  name: 'Rooftop at Riverside',
  shortName: 'Rooftop',
  group: 'Paradise Food Group',
  concept: 'Rooftop bar over a curated food truck park in downtown Bonita Springs',
  opened: 'January 2024',

  contact: {
    phone: CONTACT.phone,
    phoneHref: `tel:+1${CONTACT.phone.replace(/\D/g, '')}`,
    email: CONTACT.email,
    events: CONTACT.emailEvents,
    hiring: CONTACT.emailHiring,
  },

  address: {
    street: CONTACT.address.street,
    locality: CONTACT.address.city,
    region: CONTACT.address.state,
    postalCode: CONTACT.address.zip,
    country: CONTACT.address.country,
    neighborhood: CONTACT.address.neighborhood,
    timezone: CONTACT.address.timezone,
    geo: { lat: CONTACT.address.latitude, lng: CONTACT.address.longitude } as {
      lat: number;
      lng: number;
    } | null,
    mapsUrl: CONTACT.address.googleMapsUrl,
    mapsQuery: encodeURIComponent(
      `${CONTACT.address.street}, ${CONTACT.address.city}, ${CONTACT.address.state} ${CONTACT.address.zip}`,
    ),
  },

  social: CONTACT.social,

  giftCards: CONTACT.giftCards,

  eventbrite: CONTACT.eventbrite as string | null,
} as const;

export const SEO_LOCAL = {
  primary: 'Bonita Springs',
  secondary: ['Naples', 'Estero'],
} as const;

export function addressLine(): string {
  const a = BRAND.address;
  return `${a.street}, ${a.locality}, ${a.region} ${a.postalCode}`;
}

export function mapsUrl(): string {
  return `https://www.google.com/maps/search/?api=1&query=${BRAND.address.mapsQuery}`;
}

export function instagramHandle(): string {
  const u = BRAND.social.instagram;
  if (!u) return '';
  return u.replace(/\/+$/, '').split('/').pop() ?? '';
}
