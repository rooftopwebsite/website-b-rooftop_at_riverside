import type { Metadata } from 'next';
import LegalPage from '@/components/legal/LegalPage';
import { BAR_GAMES_WAIVER } from '@/content/legal/bar-games-waiver';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({ route: '/bar-games-waiver' });

const ULTIMA_ACTUALIZACION = '2026-09-15';

export default function BarGamesWaiverPage() {
  return (
    <LegalPage
      eyebrow="The paperwork"
      title="Bar games"
      accent="waiver"
      lastUpdated={ULTIMA_ACTUALIZACION}
      currentHref="/bar-games-waiver"
      intro="Terms and conditions for the games at the bar upstairs. Twenty one and over, and everyone who plays agrees to them."
      blocks={BAR_GAMES_WAIVER}
    />
  );
}
