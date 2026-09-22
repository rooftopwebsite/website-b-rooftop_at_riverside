import type { Metadata } from 'next';
import LegalPage from '@/components/legal/LegalPage';
import { BAR_GAMES_WAIVER } from '@/content/legal/bar-games-waiver';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({ route: '/bar-games-waiver' });

/**
 * ⚠️ ESTE NO ES EL WAIVER DEL CAMIÓN. Es el de los juegos de la barra, arriba,
 * y arranca en 21 años porque hay alcohol de por medio. Los dos se confunden
 * todo el tiempo: el del camión es `/game-zone-waiver`.
 *
 * ⚠️ RUTA HEREDADA. En el sitio viejo existía igual y acá era una 301 a
 * `/game-truck#policies`, que además mandaba a la página equivocada: este
 * documento no es del camión. El slug se mantiene para no romper links viejos.
 */

/** La fecha en que capturamos el texto publicado. Ver `/gaming-truck-policies`. */
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
