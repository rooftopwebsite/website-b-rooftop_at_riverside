import type { Metadata } from 'next';
import LegalPage from '@/components/legal/LegalPage';
import { COOKIE_POLICY_DRAFT } from '@/content/legal/borradores';
import { SITE_LEGAL_DOCS } from '@/content/legal-docs';
import { pageMeta } from '@/lib/seo';

/**
 * ⚠️ PÁGINA EN BORRADOR. El porqué del lorem y del `noIndex` está completo en
 * `/privacy-policy/page.tsx` y en `content/legal/borradores.ts`.
 *
 * ⚠️ ESTA ES LA ÚNICA DE LAS CUATRO QUE NO SE PUEDE TERMINAR SÓLO CON TEXTO.
 * La sección «The cookies this site sets» tiene que enumerar cookies reales, y
 * hoy el sitio no setea ninguna: no hay analytics, no hay pixel y no hay banner.
 * El día que se monte medición, esta lista y el banner nacen juntos o el
 * documento miente desde el primer deploy.
 *
 * ⚠️ Y «Managing your preferences» va a tener que apuntar a un control que
 * todavía no existe. La skill `paginas-legales` lo llama «Cookies preferences»
 * y vive en la fila legal del pie, reabriendo el banner. Está anotado en
 * `Footer.tsx`, en el bloque de `LEGALES`: es lo único de esa fila que sigue
 * faltando.
 */
export const metadata: Metadata = pageMeta({ route: '/cookie-policy', noIndex: true });

export default function CookiePolicyPage() {
  return (
    <LegalPage
      eyebrow="The fine print"
      title="Cookie"
      accent="policy"
      currentHref="/cookie-policy"
      docs={SITE_LEGAL_DOCS}
      intro="Which cookies this site sets, which ones come from somewhere else, and how to change what you allow."
      blocks={COOKIE_POLICY_DRAFT}
    />
  );
}
