import type { Metadata } from 'next';
import LegalPage from '@/components/legal/LegalPage';
import { GAME_ZONE_WAIVER } from '@/content/legal/game-zone-waiver';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({ route: '/game-zone-waiver' });

/**
 * ⚠️ ESTA RUTA YA EXISTÍA EN EL SITIO VIEJO, y acá era una 301 a
 * `/game-truck#policies`. O sea que quien llegaba de un link viejo, o del
 * correo de confirmación de su fiesta, terminaba en un resumen de siete puntos
 * en vez del documento que había firmado. La redirección se fue de
 * `next.config.ts` y el slug se mantuvo igual para no romper esos links.
 *
 * ⚠️ NO SE REPLICA EL FORMULARIO DE FIRMA. El original termina con los campos
 * de la firma electrónica de Wix. Firmar el waiver es un acto legal y no se
 * mueve de lugar por una migración de sitio: hoy se firma en el lugar, antes de
 * subir al camión, y esta página es donde se lee antes. Ver la nota de
 * `content/legal/game-zone-waiver.ts`.
 */

/** La fecha en que capturamos el texto publicado. Ver `/gaming-truck-policies`. */
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
