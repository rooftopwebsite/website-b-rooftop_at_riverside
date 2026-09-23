export interface GameTruckRate {
  readonly label: string;
  readonly price: number;
  readonly unit: string;
  readonly note: string | null;
}

export interface PartyPackage {
  readonly slug: string;
  readonly name: string;
  readonly days: string;
  readonly hours: number;
  readonly price: number;
  readonly extraHour: number;
  readonly diferencias: readonly string[];
}

export const RATES: readonly GameTruckRate[] = [
  { label: 'First 30 minutes', price: 10, unit: 'per person', note: 'plus tax' },
  { label: 'Every 15 minutes after that', price: 5, unit: 'per person', note: null },
];

export const PACKAGES: readonly PartyPackage[] = [
  {
    slug: 'weeknight',
    name: 'Weeknight party',
    days: 'Monday – Thursday',
    hours: 2,
    price: 400,
    extraHour: 200,
    diferencias: ['Monday through Thursday', 'Extra hour at $200'],
  },
  {
    slug: 'weekend',
    name: 'Weekend party',
    days: 'Friday – Sunday',
    hours: 2,
    price: 500,
    extraHour: 250,
    diferencias: ['Friday through Sunday', 'Extra hour at $250'],
  },
];

export const SCREENS = 6;

export const PACKAGE_INCLUDES: readonly string[] = [
  'Two hours in the truck',
  'A Game Coach on site the whole time',
  `${SCREENS} TVs with Xbox Series X, PlayStation 5 and Nintendo Switch 2`,
  'Over 30 games, from E-rated to M-rated',
  'Physical games plus the subscription libraries',
  'Air conditioning',
];

export const GAMES: readonly string[] = [
  'NBA 2K26',
  'Madden 26',
  'College Football 26',
  'EA Sports FC 25',
  'PGA Tour 2K25',
  'MLB The Show 25',
  'NHL 25',
  'UFC 5',
  'Star Wars Outlaws',
  'Call of Duty Modern Warfare III',
  'Call of Duty Black Ops 6',
  'GTA V',
  'Mortal Kombat 11',
  'F1 25',
  'Big Buck Hunter',
  'Donkey Kong Bonanza',
  'Kirby and the Forgotten Land',
  'Mario Golf',
  'Switch Sports',
  'Super Smash Bros',
  'Mario World',
  'Fortnite',
  'Minecraft',
];

export const GAMES_TOTAL = '30+';
export const CONSOLES: readonly string[] = [
  'Xbox Series X',
  'PlayStation 5',
  'Nintendo Switch 2',
];
