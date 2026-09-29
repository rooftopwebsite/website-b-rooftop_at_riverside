export interface RentalRate {
  readonly label: string;
  readonly price: string | null;
  readonly unit: string | null;
  readonly extra: string | null;
}

export interface FoodOption {
  readonly slug: string;
  readonly name: string;
  readonly price: string | null;
  readonly body: string;
}

export const RENTAL: readonly RentalRate[] = [
  {
    label: 'Upstairs, Sunday – Thursday',
    price: '$1,250',
    unit: '/ 2 hours',
    extra: '$250 each additional hour',
  },
  {
    label: 'Upstairs, Friday – Saturday',
    price: '$2,000',
    unit: '/ 2 hours',
    extra: '$500 each additional hour',
  },
  { label: 'The rooftop patio', price: '$1,000', unit: 'flat', extra: null },
  { label: 'The full venue', price: null, unit: null, extra: null },
];

export const RENTAL_MINIMUM_HOURS = 2;
export const RENTAL_DEPOSIT = true;

export const FOOD_OPTIONS: readonly FoodOption[] = [
  {
    slug: 'meal-tickets',
    name: 'Meal tickets',
    price: '$30 each',
    body: 'Good at any of the food trucks, for any meal at any price. Gratuity and taxes are included, and tickets have to be used the same day.',
  },
  {
    slug: 'small-bites',
    name: 'Food truck small bites',
    price: null,
    body: 'Every truck offers small bite options for medium to large parties.',
  },
  {
    slug: 'outside-catering',
    name: 'Outside catering',
    price: 'Inquire for pricing',
    body: 'Choose an alternative menu from the trucks with one of our preferred catering partners.',
  },
];

export const ENHANCEMENTS: readonly { readonly name: string; readonly body: string }[] = [
  { name: 'DJ', body: 'A custom playlist tailored to your event.' },
  { name: 'Live music', body: 'A local musician on the stage that is already there.' },
  { name: 'Photo booth', body: 'Fun, interactive photos your guests take home.' },
  { name: 'Event photographer', body: 'Professional coverage of the whole night.' },
  { name: 'Decorations', body: 'Party design: custom bouquets, balloons and more.' },
];

export const ENHANCEMENTS_NOTE =
  'Pricing depends on availability and group size, so these get quoted with your request.';

export const EVENTS_PDF = {
  label: 'Events Packages',
  href: 'https://www.eatdrinkparadise.com/_files/ugd/526079_a57cd7cf0ea149ec9fc0a6edb745d1c1.pdf',
  format: 'PDF',
  size: '13 MB',
} as const;

export const DRINK_OPTIONS: readonly FoodOption[] = [
  {
    slug: 'drink-tickets',
    name: 'Drink tickets',
    price: 'From $12.99',
    body: '$12.99 a ticket for beer, wine and seltzers, or $14.99 for beer, wine, seltzers and well liquor. One ticket is one drink.',
  },
  {
    slug: 'wristband',
    name: 'Wristband tab',
    price: 'One check',
    body: 'An open tab for the whole group on wristbands, settled once at the end of the night, with the automatic gratuity on it.',
  },
  {
    slug: 'open-bar',
    name: 'Open bar',
    price: 'Inquire about pricing',
    body: 'Give your guests access to a full bar throughout your event.',
  },
];

export const SMALL_PARTY_MAX = 12;
