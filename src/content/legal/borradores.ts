import type { LegalBlock } from '@/content/legal-docs';

/**
 * LOS CUATRO DOCUMENTOS DE LA FILA LEGAL DEL PIE, EN BORRADOR.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ESTOS CUATRO NO SON LOS DEL CAMIÓN, Y LA DIFERENCIA ES TODA. Los tres de
 * `content/legal/` —policies, game zone, bar games— son transcripción verbatim
 * de papeles que el cliente ya tenía publicados. Estos cuatro NO EXISTEN en
 * ninguna parte: el sitio viejo no tiene privacidad, ni términos, ni cookies,
 * ni declaración de accesibilidad. Se buscó en el brief, en los PDF de
 * `_interno/` y en lo que se scrapeó del sitio viejo: no hay texto.
 *
 * ⚠️ POR ESO EL CUERPO ES LOREM IPSUM Y NO UN TEXTO PLAUSIBLE. Es un pedido
 * explícito de Camila el 2026-09-22: «las que no tienes texto van con lorem».
 * Y es lo correcto: un párrafo de privacidad inventado que suena bien es lo
 * más peligroso que se puede publicar, porque nadie lo revisa. Nadie confunde
 * «dolor sit amet» con una política; cualquiera confunde «no vendemos tus
 * datos a terceros» con una.
 *
 * ⚠️ LO QUE SÍ ES REAL ES LA ESTRUCTURA. Los rótulos de sección son los que
 * cada documento tiene que llevar, en el orden en que se leen. Es lo que la
 * fase de maqueta tiene que poder aprobar: cuántas secciones, qué largo, cómo
 * respira la tarjeta. El texto entra después, sección por sección, sin tocar
 * un margen.
 *
 * ⚠️ LAS CUATRO PÁGINAS VAN `noindex` Y FUERA DEL SITEMAP mientras digan esto.
 * Ver `app/privacy-policy/page.tsx` y la lista de `lib/nav.ts`.
 *
 * ⚠️ LA SEMILLA DE LA PRIVACIDAD YA ESTÁ ESCRITA Y NO SE TOCA DESDE ACÁ: el
 * documento del camión, en `gaming-truck-policies.ts`, trae un apartado
 * «Privacy policy» del propio cliente —«We do not sell, trade, or rent your
 * personal information to others»—. Es el único texto de privacidad que el
 * negocio tiene publicado, y es por donde debería arrancar el abogado.
 * ══════════════════════════════════════════════════════════════════════════
 */

/**
 * Los párrafos de relleno. Seis, porque con menos la repetición se nota a la
 * tercera sección y deja de servir para juzgar el ritmo de la página.
 */
const LOREM: readonly string[] = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
  'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.',
  'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
  'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.',
];

/** Ítems de relleno para las secciones que en el documento final llevan lista. */
const ITEMS: readonly string[] = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.',
];

/**
 * Una sección del borrador: el rótulo real, y debajo el relleno.
 *
 * `parrafos` y `lista` son cuántos, no cuáles: el contenido rota sobre `LOREM`
 * desde un cursor que avanza con el documento, así dos secciones seguidas nunca
 * abren con la misma frase.
 */
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

/**
 * El aviso que abre los cuatro. Va primero, en la caja del `aviso`, que es el
 * único bloque del documento que se destaca del cuerpo.
 *
 * ⚠️ NO DICE «lorem ipsum» NI «placeholder» A SECAS. Dice qué es, qué falta y
 * que la página no está indexada, en el idioma del sitio, porque lo va a leer
 * el cliente en una preview y no un desarrollador leyendo el repo.
 */
const AVISO: LegalBlock = {
  kind: 'aviso',
  text: 'DRAFT LAYOUT. The body text below is filler, not a legal document, and this page stays hidden from search engines until the final wording is in. The section headings are the real ones.',
};

/**
 * ⚠️ LA PRIVACIDAD ES LA MÁS LARGA DE LAS CUATRO, y tiene que serlo ya en el
 * borrador: es la única que describe formularios reales —contacto, consulta de
 * eventos, vendors del market, Join Us y el newsletter— y por lo tanto la única
 * que se alarga sola cuando entre el texto de verdad.
 */
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

/**
 * ⚠️ ACCESSIBILITY NO ES UNA POLÍTICA Y ESTÁ EN LA MISMA FILA IGUAL. Es una
 * declaración: qué estándar se persigue, con qué se probó y a quién se escribe
 * si algo no funciona. Va con los otros tres porque el template de la agencia
 * la pone ahí, y porque es el único de los cuatro cuyo texto final lo
 * escribimos nosotros y no el abogado del cliente.
 */
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
