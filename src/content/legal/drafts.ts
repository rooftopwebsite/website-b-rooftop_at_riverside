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

interface DraftSection {
  readonly title: string;
  readonly paragraphs: number;
  readonly list?: number;
}

const blocks = (sections: readonly DraftSection[]): readonly LegalBlock[] => {
  let cursor = 0;
  const next = () => LOREM[cursor++ % LOREM.length];

  return sections.flatMap((s): LegalBlock[] => [
    { kind: 'heading', text: s.title },
    ...Array.from(
      { length: s.paragraphs },
      (): LegalBlock => ({ kind: 'paragraph', text: next() }),
    ),
    ...(s.list
      ? [{ kind: 'list' as const, items: ITEMS.slice(0, s.list).map((text) => ({ text })) }]
      : []),
  ]);
};

const NOTICE: LegalBlock = {
  kind: 'notice',
  text: 'DRAFT LAYOUT. The body text below is filler, not a legal document, and this page stays hidden from search engines until the final wording is in. The section headings are the real ones.',
};

export const PRIVACY_POLICY_DRAFT: readonly LegalBlock[] = [
  NOTICE,
  ...blocks([
    { title: '1. Information we collect', paragraphs: 2, list: 4 },
    { title: '2. How we use your information', paragraphs: 2 },
    { title: '3. The forms on this site', paragraphs: 1, list: 4 },
    { title: '4. Sharing and disclosure', paragraphs: 2 },
    { title: '5. Cookies and tracking', paragraphs: 1 },
    { title: '6. Data retention', paragraphs: 1 },
    { title: '7. Your rights and choices', paragraphs: 2, list: 3 },
    { title: '8. Children under thirteen', paragraphs: 1 },
    { title: '9. Changes to this policy', paragraphs: 1 },
    { title: '10. How to reach us', paragraphs: 1 },
  ]),
];

export const TERMS_OF_SERVICE_DRAFT: readonly LegalBlock[] = [
  NOTICE,
  ...blocks([
    { title: '1. Acceptance of these terms', paragraphs: 2 },
    { title: '2. Who may use this site', paragraphs: 1 },
    { title: '3. Tickets, events and the calendar', paragraphs: 2 },
    { title: '4. Private event bookings and deposits', paragraphs: 2, list: 3 },
    { title: '5. The food trucks and the market', paragraphs: 2 },
    { title: '6. Conduct at the venue', paragraphs: 1, list: 4 },
    { title: '7. Intellectual property', paragraphs: 1 },
    { title: '8. Third party links and services', paragraphs: 1 },
    { title: '9. Disclaimers', paragraphs: 2 },
    { title: '10. Limitation of liability', paragraphs: 1 },
    { title: '11. Governing law', paragraphs: 1 },
    { title: '12. How to reach us', paragraphs: 1 },
  ]),
];

export const COOKIE_POLICY_DRAFT: readonly LegalBlock[] = [
  NOTICE,
  ...blocks([
    { title: '1. What cookies are', paragraphs: 2 },
    { title: '2. The cookies this site sets', paragraphs: 1, list: 4 },
    { title: '3. Third party cookies', paragraphs: 2 },
    { title: '4. Managing your preferences', paragraphs: 2 },
    { title: '5. Changes to this policy', paragraphs: 1 },
    { title: '6. How to reach us', paragraphs: 1 },
  ]),
];

export const ACCESSIBILITY_DRAFT: readonly LegalBlock[] = [
  NOTICE,
  ...blocks([
    { title: '1. Our commitment', paragraphs: 2 },
    { title: '2. Conformance status', paragraphs: 1 },
    { title: '3. What we do', paragraphs: 1, list: 4 },
    { title: '4. Known limitations', paragraphs: 2 },
    { title: '5. Getting around the venue', paragraphs: 2 },
    { title: '6. Feedback and assistance', paragraphs: 1 },
  ]),
];
