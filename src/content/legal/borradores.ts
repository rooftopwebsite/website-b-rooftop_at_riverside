import type { LegalBlock } from '@/content/legal-docs';

const LOREM: readonly string[] = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
  'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.',
  'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
  'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.',
];

const ITEMS: readonly string[] = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.',
];

interface Seccion {
  readonly titulo: string;
  readonly parrafos: number;
  readonly lista?: number;
}

const bloques = (secciones: readonly Seccion[]): readonly LegalBlock[] => {
  let cursor = 0;
  const siguiente = () => LOREM[cursor++ % LOREM.length];

  return secciones.flatMap((s): LegalBlock[] => [
    { kind: 'titulo', text: s.titulo },
    ...Array.from(
      { length: s.parrafos },
      (): LegalBlock => ({ kind: 'parrafo', text: siguiente() }),
    ),
    ...(s.lista
      ? [{ kind: 'lista' as const, items: ITEMS.slice(0, s.lista).map((texto) => ({ texto })) }]
      : []),
  ]);
};

const AVISO: LegalBlock = {
  kind: 'aviso',
  text: 'DRAFT LAYOUT. The body text below is filler, not a legal document, and this page stays hidden from search engines until the final wording is in. The section headings are the real ones.',
};

export const PRIVACY_POLICY_DRAFT: readonly LegalBlock[] = [
  AVISO,
  ...bloques([
    { titulo: '1. Information we collect', parrafos: 2, lista: 4 },
    { titulo: '2. How we use your information', parrafos: 2 },
    { titulo: '3. The forms on this site', parrafos: 1, lista: 4 },
    { titulo: '4. Sharing and disclosure', parrafos: 2 },
    { titulo: '5. Cookies and tracking', parrafos: 1 },
    { titulo: '6. Data retention', parrafos: 1 },
    { titulo: '7. Your rights and choices', parrafos: 2, lista: 3 },
    { titulo: '8. Children under thirteen', parrafos: 1 },
    { titulo: '9. Changes to this policy', parrafos: 1 },
    { titulo: '10. How to reach us', parrafos: 1 },
  ]),
];

export const TERMS_OF_SERVICE_DRAFT: readonly LegalBlock[] = [
  AVISO,
  ...bloques([
    { titulo: '1. Acceptance of these terms', parrafos: 2 },
    { titulo: '2. Who may use this site', parrafos: 1 },
    { titulo: '3. Tickets, events and the calendar', parrafos: 2 },
    { titulo: '4. Private event bookings and deposits', parrafos: 2, lista: 3 },
    { titulo: '5. The food trucks and the market', parrafos: 2 },
    { titulo: '6. Conduct at the venue', parrafos: 1, lista: 4 },
    { titulo: '7. Intellectual property', parrafos: 1 },
    { titulo: '8. Third party links and services', parrafos: 1 },
    { titulo: '9. Disclaimers', parrafos: 2 },
    { titulo: '10. Limitation of liability', parrafos: 1 },
    { titulo: '11. Governing law', parrafos: 1 },
    { titulo: '12. How to reach us', parrafos: 1 },
  ]),
];

export const COOKIE_POLICY_DRAFT: readonly LegalBlock[] = [
  AVISO,
  ...bloques([
    { titulo: '1. What cookies are', parrafos: 2 },
    { titulo: '2. The cookies this site sets', parrafos: 1, lista: 4 },
    { titulo: '3. Third party cookies', parrafos: 2 },
    { titulo: '4. Managing your preferences', parrafos: 2 },
    { titulo: '5. Changes to this policy', parrafos: 1 },
    { titulo: '6. How to reach us', parrafos: 1 },
  ]),
];

export const ACCESSIBILITY_DRAFT: readonly LegalBlock[] = [
  AVISO,
  ...bloques([
    { titulo: '1. Our commitment', parrafos: 2 },
    { titulo: '2. Conformance status', parrafos: 1 },
    { titulo: '3. What we do', parrafos: 1, lista: 4 },
    { titulo: '4. Known limitations', parrafos: 2 },
    { titulo: '5. Getting around the venue', parrafos: 2 },
    { titulo: '6. Feedback and assistance', parrafos: 1 },
  ]),
];
