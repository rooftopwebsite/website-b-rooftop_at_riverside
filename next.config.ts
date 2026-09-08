import type { NextConfig } from 'next';
import { retiredTruckRedirects, truckBySlug } from './src/content/trucks';

/**
 * 301 desde el sitio de Wix.
 *
 * Los de los trucks retirados NO se escriben a mano: salen de
 * `content/trucks.ts`. Pasar un truck a `active: false` genera su redirect
 * solo, que es el requisito duro del brief.
 *
 * ⚠️ `statusCode: 301` y no `permanent: true`. Next emite **308** para
 * `permanent`, y aunque Google trata 308 igual que 301, el brief pide 301
 * explícitamente y hay crawlers viejos que no manejan 308.
 *
 * ⚠️ SIN CADENAS. Una URL vieja de Wix nunca pasa por dos saltos: si el truck
 * está retirado, el redirect apunta directo a `/food-trucks`. Ver `truckUrl()`.
 */

/**
 * A dónde manda una URL de truck del sitio viejo.
 * Si el truck sigue activo, a su ficha. Si está retirado, DIRECTO al índice
 * —no a la ficha, que a su vez redirigiría—.
 */
function truckUrl(slug: string): string {
  const truck = truckBySlug(slug);
  return truck?.active ? `/food-trucks/${slug}` : '/food-trucks';
}

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  async redirects() {
    return [
      // ── Wix → rutas nuevas ────────────────────────────────────────────
      { source: '/this-is-us', destination: '/our-story', statusCode: 301 },
      { source: '/eat', destination: '/food-trucks', statusCode: 301 },
      { source: '/drink', destination: '/sunset-bar', statusCode: 301 },
      { source: '/calendar', destination: '/whats-on', statusCode: 301 },
      { source: '/hostanevent', destination: '/events', statusCode: 301 },
      { source: '/neighborhood-market', destination: '/market', statusCode: 301 },
      // /entertainment NO es programación: es reclutamiento de músicos.
      { source: '/entertainment', destination: '/join-us', statusCode: 301 },
      { source: '/game-lounge', destination: '/the-experience', statusCode: 301 },
      { source: '/find-us', destination: '/visit', statusCode: 301 },
      { source: '/parking', destination: '/visit#parking', statusCode: 301 },

      // ── Fichas de truck del sitio viejo ───────────────────────────────
      { source: '/primecarvery', destination: truckUrl('prime-carvery'), statusCode: 301 },
      { source: '/tropicalfusion', destination: truckUrl('tropical-fusion'), statusCode: 301 },
      { source: '/seameonwheels', destination: truckUrl('sea-me-on-wheels'), statusCode: 301 },
      { source: '/el-chilango', destination: truckUrl('el-chilango'), statusCode: 301 },

      /*
       * ⚠️ `/ocn` — DESVÍO DEL BRIEF, pendiente de confirmación.
       *
       * El brief pide `/ocn → /food-trucks`. Pero en el sitio actual `/ocn`
       * NO es una página huérfana: ya devuelve un 301 a `/seameonwheels`.
       * Y OCN Seafood Co. es un truck del roster de enero 2026, o sea que la
       * URL apunta a un vendor activo, no a uno muerto.
       *
       * Mandarla al índice tira el equity de una URL viva. Acá va a la ficha
       * de OCN. Si resulta que OCN y Sea Me on Wheels no son el mismo negocio,
       * se cambia este único renglón.
       */
      { source: '/ocn', destination: truckUrl('ocn-seafood-co'), statusCode: 301 },

      /*
       * ⚠️ Rutas del sitio viejo que el brief no contempla. Ver
       * docs/current-site-inventory.md §1. Estos destinos son PROVISORIOS y
       * están a la espera de tu decisión:
       *
       *   /giveback       Charity Partner Program — contenido real, sin destino
       *   /tnt-sign-ups   sorteo de entradas — contenido real, sin destino
       *   /bar-games-waiver, /game-zone-waiver — documentos legales completos
       *   /blank, /blank-1, /inquiry-services-page — plantillas de Wix sin tocar
       */
      { source: '/giveback', destination: '/our-story', statusCode: 301 },
      { source: '/tnt-sign-ups', destination: '/whats-on', statusCode: 301 },
      { source: '/bar-games-waiver', destination: '/the-experience', statusCode: 301 },
      { source: '/game-zone-waiver', destination: '/the-experience', statusCode: 301 },
      { source: '/blank', destination: '/market', statusCode: 301 },
      { source: '/blank-1', destination: '/', statusCode: 301 },
      { source: '/inquiry-services-page', destination: '/events/inquire', statusCode: 301 },

      // ── Generados desde los datos ─────────────────────────────────────
      ...retiredTruckRedirects(),
    ];
  },
};

export default nextConfig;
