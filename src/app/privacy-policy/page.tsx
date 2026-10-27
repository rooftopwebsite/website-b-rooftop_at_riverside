import type { Metadata } from 'next';
import LegalPage from '@/components/legal/LegalPage';
import { PRIVACY_POLICY_DRAFT } from '@/content/legal/drafts';
import { SITE_LEGAL_DOCS } from '@/content/legal-docs';
import { pageMeta } from '@/lib/seo';

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
