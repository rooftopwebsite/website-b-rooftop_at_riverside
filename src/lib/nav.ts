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
      {
        label: 'About',
        href: '/our-story',
        hint: 'The Magnus family, what this place is, and the questions.',
      },
      { label: 'Blog', href: '/blog', hint: 'Stories from the rooftop, the trucks and the people.' },
      { label: 'Join Us', href: '/join-us', hint: 'Play here, park a truck here, work here.' },
      { label: 'Contact', href: '/contact', hint: 'Three inboxes, hours, parking and the map.' },
    ],
  },
  {
    label: 'While you’re here',
    links: [
      {
        label: 'Gaming Truck',
        href: '/game-truck',
        hint: 'Three consoles, six screens and a Game Coach. Parties too.',
      },
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
  href: '/whats-on',
  hint: "Sundays in season. Sound on, screens up, and a rooftop that turns into somebody's hometown bar.",
  cta: 'See Sundays',
} as const;

export const NAV_MORE: readonly NavLink[] = NAV_MORE_GROUPS.flatMap((g) => g.links);

export const BLOG_HREF = '/blog';

export const sinBlog = <T extends { readonly href: string }>(links: readonly T[]): readonly T[] =>
  links.filter((l) => l.href !== BLOG_HREF);

export const NAV_CTA = {
  primary: { label: 'Plan an Event', href: '/events' },
  secondary: { label: "What's On", href: '/whats-on' },
} as const;

export const FOOTER_QUICK_LINKS: readonly NavLink[] = [
  { label: 'Events Packet', href: '/events#inquire' },
  { label: 'Event Spaces', href: '/events#spaces' },
  { label: 'Corporate Events', href: '/events#corporate' },
  { label: 'Join Us', href: '/join-us' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Gift Cards', href: 'GIFT_CARDS', external: true },
  { label: 'Careers', href: '/join-us#work' },
];

export const ALL_ROUTES: readonly string[] = [
  '/',
  '/sunset-bar',
  '/food-trucks',
  '/whats-on',
  '/events',
  '/game-truck',
  '/market',
  '/our-story',
  '/blog',
  '/join-us',
  '/contact',

  '/gaming-truck-policies',
  '/game-zone-waiver',
  '/bar-games-waiver',
];
