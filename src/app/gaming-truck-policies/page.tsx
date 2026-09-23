import type { Metadata } from 'next';
import LegalPage from '@/components/legal/LegalPage';
import { GAMING_TRUCK_POLICIES } from '@/content/legal/gaming-truck-policies';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({ route: '/gaming-truck-policies' });

const ULTIMA_ACTUALIZACION = '2026-09-15';

export default function GamingTruckPoliciesPage() {
  return (
    <LegalPage
      eyebrow="The paperwork"
      title="Gaming truck"
      accent="policies"
      lastUpdated={ULTIMA_ACTUALIZACION}
      currentHref="/gaming-truck-policies"
      intro="Booking a party with us means agreeing to all of this. It is the same document the Game Coach works from."
      blocks={GAMING_TRUCK_POLICIES}
    />
  );
}
