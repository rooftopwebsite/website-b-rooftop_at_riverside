import { getVenueEvents } from './events';

export interface HappyHourGroup {
  readonly id: string;
  readonly title: string;
  readonly days: string;
  readonly time: string;
  readonly deals: readonly { readonly price: string; readonly what: string }[];
}

export const HAPPY_HOUR_GROUPS: readonly HappyHourGroup[] = [
  {
    id: 'weekday',
    title: 'Weekday Happy Hour',
    days: 'Wednesday – Friday',
    time: '3 PM – 6 PM',
    deals: [
      { price: '$4.00', what: 'Drafts' },
      { price: '$5', what: 'House Wine' },
      { price: '$6', what: 'Wells' },
    ],
  },
  {
    id: 'weekend',
    title: 'Weekend Happy Hour',
    days: 'Saturday & Sunday',
    time: '11 AM – 6 PM',
    deals: [
      { price: '$10', what: 'House Margaritas' },
      { price: '$20', what: 'Bucket Specials' },
      { price: '$1 Off', what: 'Beers & Seltzers' },
      { price: '$8', what: 'Kettle Cucumber Mash Martinis' },
    ],
  },
];

const PILL_CAP = 22;

export async function happyHourPhrase(): Promise<string> {
  const events = await getVenueEvents();
  const title = events.find((e) => /happy\s*hour/i.test(e.title))?.title;
  if (title && title.length <= PILL_CAP) return title;
  return 'Happy hour';
}
