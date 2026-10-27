import type { Metadata } from 'next';
import LegalPage from '@/components/legal/LegalPage';
import { ACCESSIBILITY_DRAFT } from '@/content/legal/drafts';
import { SITE_LEGAL_DOCS } from '@/content/legal-docs';
import { pageMeta } from '@/lib/seo';

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
