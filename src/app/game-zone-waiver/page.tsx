import type { Metadata } from 'next';
import LegalPage from '@/components/legal/LegalPage';
import { GAME_ZONE_WAIVER } from '@/content/legal/game-zone-waiver';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({ route: '/game-zone-waiver' });

const ULTIMA_ACTUALIZACION = '2026-09-15';

export default function GameZoneWaiverPage() {
  return (
    <LegalPage
      eyebrow="The paperwork"
      title="Game zone"
      accent="waiver"
      lastUpdated={ULTIMA_ACTUALIZACION}
      currentHref="/game-zone-waiver"
      intro="The document a parent or guardian signs before anyone gets in the gaming truck. Signing happens on site, with the Game Coach."
      blocks={GAME_ZONE_WAIVER}
    />
  );
}
