import type { Metadata } from 'next';
import LegalPage from '@/components/legal/LegalPage';
import { ACCESSIBILITY_DRAFT } from '@/content/legal/borradores';
import { SITE_LEGAL_DOCS } from '@/content/legal-docs';
import { pageMeta } from '@/lib/seo';

/**
 * ⚠️ PÁGINA EN BORRADOR. El porqué del lorem y del `noIndex` está completo en
 * `/privacy-policy/page.tsx` y en `content/legal/borradores.ts`.
 *
 * ⚠️ ESTA ES LA ÚNICA DE LAS CUATRO QUE NO ESPERA AL ABOGADO DEL CLIENTE: una
 * declaración de accesibilidad la escribe quien construyó el sitio, porque dice
 * contra qué estándar se trabajó, con qué se probó y qué falta. Los datos ya
 * los tenemos casi todos: están en `scripts/a11y.mjs`, en `scripts/contrast.mjs`
 * y en los checks de movimiento reducido.
 *
 * ⚠️ Y TIENE UNA SECCIÓN QUE NO ES DEL SITIO: «Getting around the venue». Es un
 * rooftop con escalera y ascensor, un patio de tierra y baños abajo. Alguien
 * que usa silla de ruedas busca eso, no el nivel de conformidad WCAG. Ese dato
 * lo tiene que confirmar el cliente y hoy no lo tenemos.
 */
export const metadata: Metadata = pageMeta({ route: '/accessibility', noIndex: true });

export default function AccessibilityPage() {
  return (
    <LegalPage
      eyebrow="The fine print"
      title="Accessibility"
      accent="statement"
      currentHref="/accessibility"
      docs={SITE_LEGAL_DOCS}
      intro="What we build for, what we test against, and what to tell us when something here does not work for you."
      blocks={ACCESSIBILITY_DRAFT}
    />
  );
}
