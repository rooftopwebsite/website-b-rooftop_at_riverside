import type { Metadata } from 'next';
import LegalPage from '@/components/legal/LegalPage';
import { PRIVACY_POLICY_DRAFT } from '@/content/legal/borradores';
import { SITE_LEGAL_DOCS } from '@/content/legal-docs';
import { pageMeta } from '@/lib/seo';

/**
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ PÁGINA EN BORRADOR: EL CUERPO ES LOREM. El cliente no tiene política de
 * privacidad escrita —no está en el sitio viejo, no está en el brief y no está
 * en los PDF que mandó— así que lo que se publica es la maqueta con los
 * rótulos reales y relleno debajo. Pedido de Camila el 2026-09-22.
 *
 * ⚠️ `noIndex` HASTA QUE ENTRE EL TEXTO, y no es una precaución de más: una
 * política de privacidad indexada con lorem ipsum es lo que ve un auditor, un
 * partner o el propio cliente buscándose en Google. La ruta tampoco está en
 * `ALL_ROUTES`, así que no entra al sitemap. Las dos cosas se sacan juntas.
 *
 * ⚠️ CUANDO ENTRE EL TEXTO, ESTA ES LA PÁGINA QUE MÁS HAY QUE MIRAR de las
 * cuatro: es la única que tiene que describir formularios que ya existen y
 * campos que ya se piden. Son cinco y están en `/contact`, `/events/inquire`,
 * `/join-us` y `/market`, más el newsletter del pie. Una política que enumera
 * formularios que el sitio no tiene, o que se olvida de uno, es peor que no
 * tenerla.
 * ══════════════════════════════════════════════════════════════════════════
 */
export const metadata: Metadata = pageMeta({ route: '/privacy-policy', noIndex: true });

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="The fine print"
      title="Privacy"
      accent="policy"
      currentHref="/privacy-policy"
      docs={SITE_LEGAL_DOCS}
      intro="What we collect when you write to us, book with us or sign up for the newsletter, and what we do with it."
      blocks={PRIVACY_POLICY_DRAFT}
    />
  );
}
