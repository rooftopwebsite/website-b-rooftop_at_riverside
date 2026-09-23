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
    phone: '(239) 268-0080',
    phoneHref: 'tel:+12392680080',
    email: 'info@eatdrinkparadise.com',
    events: 'events@eatdrinkparadise.com',
    hiring: 'hiring@eatdrinkparadise.com',
  },

  address: {
    street: '27333 Old 41 Rd',
    locality: 'Bonita Springs',
    region: 'FL',
    postalCode: '34135',
    country: 'US',
    neighborhood: 'Downtown Bonita Springs, across from Riverside Park',
    timezone: 'America/New_York',
    geo: { lat: 26.3407274, lng: -81.778603 } as { lat: number; lng: number } | null,
    mapsQuery: '27333+Old+41+Rd,+Bonita+Springs,+FL+34135',
  },

  social: {
    instagram: 'https://www.instagram.com/rooftopatriverside/',
    facebook: 'https://www.facebook.com/people/Rooftop-at-Riverside/100075964505890/',
    google: 'https://maps.google.com/?cid=17116543045499348377',
    tiktok: null,
  },

  giftCards: 'https://order.toasttab.com/egiftcards/rooftop-and-riverside-new-27333-old-41-road',

  eventbrite: 'https://www.eventbrite.com/o/rooftop-at-riverside-104153700851' as string | null,

  credit: { label: 'Resto Experience', url: 'https://restoexp.com' },
} as const;

export const AGENCY = {
  url: 'https://restoexp.com',
  label: 'Resto Experience',
  tagline: 'Content, marketing & web design',
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
