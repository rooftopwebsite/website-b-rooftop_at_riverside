import type { Metadata } from 'next';
import LegalPage from '@/components/legal/LegalPage';
import { TERMS_OF_SERVICE_DRAFT } from '@/content/legal/borradores';
import { SITE_LEGAL_DOCS } from '@/content/legal-docs';
import { pageMeta } from '@/lib/seo';

/**
 * ⚠️ PÁGINA EN BORRADOR. El porqué del lorem y del `noIndex` está completo en
 * `/privacy-policy/page.tsx` y en `content/legal/borradores.ts`.
 *
 * ⚠️ ESTOS TÉRMINOS NO SON LOS DEL CAMIÓN. `/gaming-truck-policies` ya cubre
 * reservas, depósitos, cancelaciones y clima, y ese texto SÍ es del cliente y
 * está publicado. Lo de acá es el otro contrato: el del sitio y el de venir al
 * lugar. Cuando entre el texto de verdad, la sección de eventos privados tiene
 * que REMITIR al documento del camión y no repetirlo: dos documentos con
 * plazos de cancelación distintos es exactamente el problema que se evita
 * teniendo uno solo.
 */
export const metadata: Metadata = pageMeta({ route: '/terms-of-service', noIndex: true });

export default function TermsOfServicePage() {
  return (
    <LegalPage
      eyebrow="The fine print"
      title="Terms of"
      accent="service"
      currentHref="/terms-of-service"
      docs={SITE_LEGAL_DOCS}
      intro="The rules for using this site, for buying a ticket, and for booking the yard or the rooftop."
      blocks={TERMS_OF_SERVICE_DRAFT}
    />
  );
}
