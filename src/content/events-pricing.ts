export interface FoodOption {
  readonly slug: string;
  readonly name: string;
  readonly body: string;
}

export const RENTAL_MINIMUM_HOURS = 2;

export const FOOD_OPTIONS: readonly FoodOption[] = [
  {
    slug: 'meal-tickets',
    name: 'Meal tickets',
    body: 'Good at any of the food trucks, for any meal. Tickets have to be used the same day.',
  },
  {
    slug: 'small-bites',
    name: 'Food truck small bites',
    body: 'Every truck offers small bite options for medium to large parties.',
  },
  {
    slug: 'outside-catering',
    name: 'Outside catering',
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

export interface EventsPdf {
  readonly label: string;
  readonly href: string;
  readonly format: string;
  readonly size: string;
}

export const EVENTS_PDF: EventsPdf | null = null;

export const DRINK_OPTIONS: readonly FoodOption[] = [
  {
    slug: 'drink-tickets',
    name: 'Drink tickets',
    body: 'Choose tickets for beer, wine and seltzers, or add well liquor. One ticket is one drink.',
  },
  {
    slug: 'wristband',
    name: 'Wristband tab',
    body: 'An open tab for the whole group on wristbands, settled once at the end of the night.',
  },
  {
    slug: 'open-bar',
    name: 'Open bar',
    body: 'Give your guests access to a full bar throughout your event.',
  },
];

export const SMALL_PARTY_MAX = 12;
