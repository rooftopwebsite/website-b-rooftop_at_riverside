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
  /*
   * ⚠️ EL TECHO DE LAS SERVER ACTIONS SUBE DE 1 MB A 4,5 MB, que es el techo
   * de un request en Vercel: pasar de ahí no sirve, porque la plataforma corta
   * antes. Con 1 MB, cualquier CV en PDF de más de una página tiraba la action
   * entera. Lo que el navegador deja enviar está un poco por debajo
   * (`MAX_REQUEST_MB` en `lib/schemas/join.ts`) para dejar lugar al resto del
   * cuerpo multipart.
   */
  experimental: {
    serverActions: {
      bodySizeLimit: '4.5mb',
    },
  },

  images: {
    formats: ['image/avif', 'image/webp'],

    /*
     * Los assets de marca del Figma vienen en SVG (lockup reversado, isotipo
     * del camión, las olas), y `next/image` los rechaza si no se habilita esto.
     *
     * ⚠️ El nombre asusta más de lo que corresponde acá. El riesgo real de
     * `dangerouslyAllowSVG` es servir SVG de TERCEROS: un SVG puede traer
     * `<script>`. Todos los nuestros son archivos propios en `public/brand`,
     * revisados, de un solo `fill`. Aun así van con la red de seguridad que
     * recomienda Next: CSP con `script-src 'none'` y `sandbox`, que desactiva
     * el script incluso si algún día entra uno.
     */
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
      { source: '/game-lounge', destination: '/game-truck', statusCode: 301 },
      { source: '/find-us', destination: '/contact#visit', statusCode: 301 },
      { source: '/parking', destination: '/contact#parking', statusCode: 301 },

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
       *   /blank, /blank-1, /inquiry-services-page — plantillas de Wix sin tocar
       *
       * ⚠️ `/bar-games-waiver` Y `/game-zone-waiver` YA NO ESTÁN ACÁ, y tenían
       * una 301 a `/game-truck#policies` cada una. El 2026-09-22 pasaron a ser
       * páginas nuestras con el texto completo de cada documento, así que las
       * dos rutas ahora resuelven solas y conservan su slug: los links viejos,
       * y el correo de confirmación que el cliente le manda a cada fiesta,
       * siguen llegando a donde decían.
       *
       * Mandarlas a un ancla era el peor destino posible de los dos: quien
       * buscaba el papel que había firmado aterrizaba en un resumen de siete
       * puntos, y encima el de los juegos de barra ni siquiera es del camión.
       */
      { source: '/giveback', destination: '/our-story', statusCode: 301 },
      { source: '/tnt-sign-ups', destination: '/whats-on', statusCode: 301 },
      { source: '/blank', destination: '/market', statusCode: 301 },
      { source: '/blank-1', destination: '/', statusCode: 301 },
      { source: '/inquiry-services-page', destination: '/events#inquire', statusCode: 301 },

      /*
       * ══════════════════════════════════════════════════════════════════
       * ⚠️ LAS RUTAS QUE SE FUSIONARON. Son 301 a un ANCLA, no a una página.
       *
       * El sitio pasó de 23 rutas a 10. Camila, revisando qué páginas
       * secundarias tiene que tener el sitio de verdad: «eventos privados con
       * sus servicios ahí, no cada pág de servicios», «about y dentro las
       * preguntas, no una pág de preguntas», «contact con visit dentro».
       *
       * ⚠️ ESTOS REDIRECTS NO SON OPCIONALES aunque el sitio no esté todavía
       * en producción con tráfico. Dos motivos concretos:
       *
       *   · los ~60 CTA del sitio apuntan a `/events/inquire`, y no hubo que
       *     tocar ni uno: el redirect los lleva al ancla;
       *   · las URLs viejas ya circularon —hay un `/inquiry-services-page`
       *     del sitio de Wix que apunta ahí— y el cliente pudo compartirlas.
       *
       * ⚠️ EL ANCLA TIENE QUE EXISTIR. Cada destino de acá abajo es un `id`
       * puesto a mano en su componente. Renombrar uno rompe el redirect en
       * silencio: el navegador carga la página y se queda arriba de todo.
       * Están anotados en cada archivo.
       * ══════════════════════════════════════════════════════════════════
       */
      { source: '/the-experience', destination: '/our-story', statusCode: 301 },
      { source: '/faq', destination: '/our-story', statusCode: 301 },
      { source: '/visit', destination: '/contact#visit', statusCode: 301 },
      /*
       * ⚠️ EL FÚTBOL NO VA A UN ANCLA, VA AL CALENDARIO. `/nfc-north-hq` no se
       * fusionó con otra página: dejó de ser una página. Ahora es un evento
       * recurrente cargado en el dashboard con el tag `featured`, y `/whats-on`
       * lo abre con una card grande. Camila: «domingos de fútbol debería ser un
       * evento recurrente del calendario» + «irán en calendario pero con un
       * espacio o card grande, mucho más destacada».
       */
      { source: '/nfc-north-hq', destination: '/whats-on', statusCode: 301 },
      { source: '/events/inquire', destination: '/events#inquire', statusCode: 301 },
      { source: '/events/spaces', destination: '/events#spaces', statusCode: 301 },
      { source: '/events/game-truck', destination: '/game-truck', statusCode: 301 },
      { source: '/events/corporate', destination: '/events#corporate', statusCode: 301 },
      { source: '/events/celebrations', destination: '/events#celebrations', statusCode: 301 },
      { source: '/events/fundraisers', destination: '/events#fundraisers', statusCode: 301 },
      {
        source: '/events/holiday-parties',
        destination: '/events#holiday-parties',
        statusCode: 301,
      },

      // ── Generados desde los datos ─────────────────────────────────────
      ...retiredTruckRedirects(),
    ];
  },
};

export default nextConfig;
