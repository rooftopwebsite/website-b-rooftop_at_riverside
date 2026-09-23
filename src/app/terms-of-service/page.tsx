import type { Metadata } from 'next';
import LegalPage from '@/components/legal/LegalPage';
import { TERMS_OF_SERVICE_DRAFT } from '@/content/legal/borradores';
import { SITE_LEGAL_DOCS } from '@/content/legal-docs';
import { pageMeta } from '@/lib/seo';

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
