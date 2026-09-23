export interface RentalRate {
  readonly days: string;
  readonly perHour: number;
}

export interface EventFee {
  readonly label: string;
  readonly amount: string;
}

export interface FoodOption {
  readonly slug: string;
  readonly name: string;
  readonly price: string | null;
  readonly body: string;
}

export const RENTAL: readonly RentalRate[] = [
  { days: 'Sunday – Thursday', perHour: 750 },
  { days: 'Friday – Saturday', perHour: 1250 },
];

export const RENTAL_MINIMUM_HOURS = 2;
export const RENTAL_DEPOSIT = true;

export const FEES: readonly EventFee[] = [
  { label: 'Automatic gratuity', amount: '22%' },
  { label: 'Tax', amount: '6.5%' },
  { label: 'Reservation fee', amount: '$150' },
];

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
    slug: 'upscale-catering',
    name: 'Upscale catering',
    price: 'From $1,500',
    body: 'A buffet option with specialty menus, provided by in house catering.',
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
    price: '$14 each',
    body: 'One ticket is one drink, top shelf aside. They get sold in fives, so ten, fifteen or twenty at a time.',
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
    price: 'From $25',
    body: '$25 per person per hour for wine, beer and seltzers, or $35 for the full liquor bar. Two hour minimum, and $15 per person for each hour after that.',
  },
];

export const SMALL_PARTY_MAX = 12;
