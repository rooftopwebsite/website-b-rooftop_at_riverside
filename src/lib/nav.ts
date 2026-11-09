import { BRAND } from '@/lib/brand';

export interface NavLink {
  readonly label: string;
  readonly href: string;
  readonly hint?: string;
  readonly badge?: string;
  readonly external?: boolean;
  readonly side?: boolean;
}

export interface NavGroup {
  readonly label: string;
  readonly links: readonly NavLink[];
}

export const NAV_PRIMARY: readonly NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Sunset Bar', href: '/sunset-bar' },
  { label: 'Food Trucks', href: '/food-trucks' },
  { label: "What's On", href: '/whats-on', side: true },
];

export const NAV_MAIN: readonly NavLink[] = NAV_PRIMARY.filter((l) => !l.side);
export const NAV_SIDE: readonly NavLink[] = NAV_PRIMARY.filter((l) => l.side);

export const NAV_MORE_GROUPS: readonly NavGroup[] = [
  {
    label: 'Get to know us',
    links: [
      { label: 'Blog', href: '/blog', hint: 'Stories from the rooftop, the trucks and the people.' },
      { label: 'Join Us', href: '/join-us', hint: 'Work here, play here.' },
      { label: 'Contact', href: '/contact', hint: 'The right inbox, hours, parking and the map.' },
    ],
  },
  {
    label: 'While you’re here',
    links: [
      { label: 'Market', href: '/market', hint: 'Local vendors and handmade goods in the yard.' },
      {
        label: 'Gift Cards',
        href: BRAND.giftCards,
        external: true,
        hint: 'Any amount, good at the bar and every truck.',
      },
    ],
  },
];

export const NAV_MORE_FEATURED = {
  eyebrow: 'Featured',
  label: 'NFC North HQ',
  href: '/sunset-bar#nfc-north-hq',
  hint: 'Your hometown bar for Green Bay, Chicago, Detroit and Minnesota fans, every Sunday of the season.',
  points: [
    'The 1 PM and 4:30 PM games on every screen upstairs',
    'Drink specials for Green Bay, Chicago, Detroit and Minnesota',
    'Weekly giveaways for each NFC North team',
    'Week 18 draw for Beckett Witnessed autographed jerseys',
  ],
  cta: 'See NFC North HQ',
} as const;

export const NAV_MORE: readonly NavLink[] = NAV_MORE_GROUPS.flatMap((g) => g.links);

export const BLOG_HREF = '/blog';

export const withoutBlog = <T extends { readonly href: string }>(links: readonly T[]): readonly T[] =>
  links.filter((l) => l.href !== BLOG_HREF);

export const NAV_CTA = {
  primary: { label: 'Plan an Event', href: '/events' },
  stayInTouch: { label: 'Follow us', href: '#stay-in-touch' },
  secondary: { label: "What's On", href: '/whats-on' },
} as const;

export const FOOTER_QUICK_LINKS: readonly NavLink[] = [
  { label: 'Events Packet', href: '/events#inquire' },
  { label: 'Event Spaces', href: '/events#spaces' },
  { label: 'Corporate Events', href: '/events#corporate' },
  { label: 'Join Us', href: '/join-us' },
  { label: 'Gift Cards', href: 'GIFT_CARDS', external: true },
  { label: 'Careers', href: '/join-us#work' },
];

export const ALL_ROUTES: readonly string[] = [
  '/',
  '/sunset-bar',
  '/food-trucks',
  '/whats-on',
  '/events',
  '/market',
  '/blog',
  '/join-us',
  '/contact',

  '/gaming-truck-policies',
  '/game-zone-waiver',
  '/bar-games-waiver',
];
