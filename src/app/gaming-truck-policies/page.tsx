import type { Metadata } from 'next';
import LegalPage from '@/components/legal/LegalPage';
import { GAMING_TRUCK_POLICIES } from '@/content/legal/gaming-truck-policies';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({ route: '/gaming-truck-policies' });

/**
 * ⚠️ RUTA NUEVA. En el sitio viejo este documento NO era una página: era el PDF
 * `526079_339e9885675e46b695c6ae0ce84cf599.pdf`, colgado del CDN de Wix y
 * linkeado desde `/game-lounge`. No se podía buscar, no se podía linkear a una
 * sección y en el teléfono abría el visor de PDF con el texto a un tercio del
 * tamaño. Ahora es una URL.
 *
 * ⚠️ EL SLUG DICE «gaming-truck» Y NO «gaming-lounge», que es como el PDF
 * titula. La página del servicio es `/game-truck` porque el copy del cliente
 * dice «our specially designed truck», y dos nombres para la misma cosa en dos
 * URLs contiguas es peor que una diferencia con el PDF.
 */

/**
 * ⚠️ ES LA FECHA EN QUE TOMAMOS EL TEXTO, NO UNA QUE INVENTAMOS. El documento
 * del cliente no trae fecha de revisión por ningún lado: ni el PDF ni las dos
 * páginas de los waivers la dicen. Poner la fecha de hoy sería afirmar que el
 * cliente revisó el documento hoy, que es un dato que no tenemos.
 *
 * Lo que sí sabemos es cuándo capturamos lo que el cliente tenía publicado:
 * el 2026-09-15. Eso es lo que dice el renglón.
 *
 * ⚠️ SE ACTUALIZA CUANDO EL CLIENTE MANDE UNA VERSIÓN NUEVA, no cuando se
 * toque la maqueta. Cambiar la fecha por haber movido un margen le miente al
 * que quiere saber si el documento que firmó sigue siendo este.
 */
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
