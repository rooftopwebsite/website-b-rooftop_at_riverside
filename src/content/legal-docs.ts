export type LegalBlock =
  | { readonly kind: 'aviso'; readonly text: string }
  | { readonly kind: 'titulo'; readonly text: string }
  | { readonly kind: 'parrafo'; readonly text: string }
  | {
      readonly kind: 'clausula';
      readonly rotulo: string;
      readonly cuerpo: readonly string[];
    }
  | {
      readonly kind: 'lista';
      readonly orden?: 'letras';
      readonly items: readonly { readonly rotulo?: string; readonly texto: string }[];
    };

export interface LegalDoc {
  readonly href: string;
  readonly label: string;
  readonly blurb: string;
}

export const LEGAL_DOCS: readonly LegalDoc[] = [
  {
    href: '/gaming-truck-policies',
    label: 'Policies and procedures',
    blurb: 'Booking, deposits, cancellations, weather and behavior.',
  },
  {
    href: '/game-zone-waiver',
    label: 'Game zone waiver',
    blurb: 'What you sign before anyone gets in the truck.',
  },
  {
    href: '/bar-games-waiver',
    label: 'Bar games waiver',
    blurb: 'For the games upstairs, at the bar. 21 and over.',
  },
];

export const SITE_LEGAL_DOCS: readonly LegalDoc[] = [
  {
    href: '/privacy-policy',
    label: 'Privacy Policy',
    blurb: 'What we collect, why, and what we never do with it.',
  },
  {
    href: '/terms-of-service',
    label: 'Terms of Service',
    blurb: 'The rules for using this site and for booking with us.',
  },
  {
    href: '/cookie-policy',
    label: 'Cookie Policy',
    blurb: 'Which cookies this site sets and how to say no.',
  },
  {
    href: '/accessibility',
    label: 'Accessibility',
    blurb: 'What we build for, what we test, and what still needs work.',
  },
];
