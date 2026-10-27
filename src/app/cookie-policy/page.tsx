import type { Metadata } from 'next';
import LegalPage from '@/components/legal/LegalPage';
import { COOKIE_POLICY_DRAFT } from '@/content/legal/drafts';
import { SITE_LEGAL_DOCS } from '@/content/legal-docs';
import { pageMeta } from '@/lib/seo';

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
