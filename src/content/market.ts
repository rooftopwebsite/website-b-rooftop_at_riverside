export interface VendorTerm {
  readonly label: string;
  readonly value: string;
}

export const TERMS: readonly VendorTerm[] = [
  { label: 'Booth fee', value: '$30' },
  { label: 'Space', value: '10 × 10' },
  { label: 'Spots', value: 'First come' },
];

export const PROVIDES = {
  venue: [
    'The space in the yard, 10 by 10',
    'Electricity, if you ask for it ahead',
    'The crowd that is already here for the trucks and the bar',
    'Approval at check-in on the day',
  ],
  vendor: [
    'Your table, your display and your own change',
    'A pop-up tent if you want one, they are allowed',
    'Anything bigger than 10 by 10 needs approval first',
  ],
} as const;

export interface MarketStep {
  readonly kicker: string;
  readonly title: string;
  readonly body: string;
  readonly tags: readonly string[];
}

export const STEPS: readonly MarketStep[] = [
  {
    kicker: 'Two minutes',
    title: 'Fill in the form',
    body: 'Tell us what you make, where we can see it, and which market days you are after. That is the whole thing.',
    tags: [],
  },
  {
    kicker: 'One business day',
    title: 'We write back',
    body: 'A person reads it and answers within one business day, with what is open and who else is set up that day.',
    tags: [],
  },
  {
    kicker: 'On the day',
    title: 'Bring your table',
    body: 'Pull in, check in with us and set up your ten by ten. The booth is $30 and spots go first come, so the earlier you write the better.',
    tags: [],
  },
];

export interface MarketShot {
  readonly src: string;
  readonly alt: string;
  readonly ratio: 'aspect-[4/5]' | 'aspect-[4/3]';
}

export const SHOTS: readonly MarketShot[] = [
  {
    src: '/images/market/stall-jewelry.webp',
    alt: 'Three vendors standing behind a table of handmade necklaces and earrings',
    ratio: 'aspect-[4/5]',
  },
  {
    src: '/images/market/stall-picnic.webp',
    alt: 'A vendor beside a low table set for a picnic, with cushions and baskets on the turf',
    ratio: 'aspect-[4/3]',
  },
  {
    src: '/images/market/stall-art.webp',
    alt: 'Two vendors at a stand of framed paintings and prints of the coast',
    ratio: 'aspect-[4/5]',
  },
  {
    src: '/images/market/stall-flowers.webp',
    alt: 'Two vendors at a flower stand, with buckets of cut stems and potted plants',
    ratio: 'aspect-[4/3]',
  },
  {
    src: '/images/market/vendor-boba.webp',
    alt: 'A vendor in an apron handing an order across her counter',
    ratio: 'aspect-[4/5]',
  },
  {
    src: '/images/market/stall-home.webp',
    alt: 'A long table laid with plates, candles and dried flowers at a homeware stand',
    ratio: 'aspect-[4/3]',
  },
];

export const PRODUCT_CATEGORIES = [
  'Handmade goods',
  'Art and prints',
  'Jewelry',
  'Clothing and accessories',
  'Home and candles',
  'Plants and flowers',
  'Packaged food',
  'Skincare and wellness',
  'Vintage and resale',
  'Something else',
] as const;

export const VENDOR_NEEDS = [
  { value: 'electricity', label: 'Electricity' },
  { value: 'table', label: 'A table' },
  { value: 'tent', label: 'Room for a pop-up tent' },
  { value: 'oversized', label: 'More than 10 by 10' },
] as const;
