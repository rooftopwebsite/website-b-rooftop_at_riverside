import { getMenuPdfs, type MenuPdf } from '@/lib/restoexp';
import { activeTrucks, truckPorNombre, type Truck } from '@/content/trucks';

/**
 * ══════════════════════════════════════════════════════════════════════════
 * LAS CARTAS DEL LUGAR, REPARTIDAS ENTRE LOS TRUCKS Y LA BARRA.
 *
 * Camila, 2026-09-21: «hagamos que las cards sean dinámicas, que si yo elimino
 * uno de los menús se borre la card en la web; ojo que Sunset Bar sólo debe
 * levantarse en Sunset Bar».
 *
 * ⚠️ EL QUE MANDA ES EL DASHBOARD Y YA NO EL ROSTER. Hasta hoy `/food-trucks`
 * dibujaba una tarjeta por cada truck de `content/trucks.ts` y la carta era un
 * dato más de la ficha; ahora dibuja una tarjeta por cada CARTA cargada en la
 * base. La consecuencia es exactamente la que se pidió: el cliente borra un
 * menú en el dashboard y la tarjeta desaparece del sitio, sin tocar código.
 *
 * ⚠️ Y LA CONSECUENCIA DE ATRÁS, que conviene tener escrita: un truck sin carta
 * cargada NO tiene tarjeta. Es un cambio de criterio respecto del 2026-09-16
 * —«en todas poné el see the menu; en las que aún no lo tengamos, no linkees
 * nada»—, y lo reemplaza: aquella regla era para un roster fijo con dos cartas
 * de cuatro. Con las cuatro cargadas, el botón muerto ya no existe.
 *
 * ⚠️ EL ROSTER NO SE BORRA: sigue siendo de dónde salen la foto, la cocina y el
 * slug. Lo que cambió es quién decide CUÁNTAS tarjetas hay.
 * ══════════════════════════════════════════════════════════════════════════
 */

/**
 * El nombre de la carta de la barra, tal como está cargada en el dashboard.
 *
 * ⚠️ ESTA CONSTANTE ES EL ÚNICO LUGAR DONDE EL SITIO SABE CUÁL DE LAS CARTAS NO
 * ES DE UN TRUCK. Camila: «ojo que Sunset Bar sólo debe levantarse en Sunset
 * Bar». Si el cliente le cambia el nombre a esa carta en el dashboard, la
 * barra se queda sin carta Y aparece una tarjeta de truck llamada «Sunset Bar»
 * en `/food-trucks`. Es el riesgo de emparejar por nombre, y no hay otro campo:
 * los `menus` cuelgan del restaurante, no de un espacio.
 */
export const CARTA_DEL_BAR = 'Sunset Bar';

const normalizar = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

const esDelBar = (m: MenuPdf) => normalizar(m.name) === normalizar(CARTA_DEL_BAR);

/** Una tarjeta de truck ya resuelta: la carta de la base más su ficha, si la hay. */
export interface CartaDeTruck {
  /** El nombre que se publica. */
  readonly name: string;
  /** La bajada. Sale de la base y cae a la del roster. */
  readonly description: string | null;
  /** El PDF que abre la tarjeta. */
  readonly pdfUrl: string | null;
  /** La ficha del roster, si el nombre coincide con alguna. */
  readonly truck: Truck | null;
}

/**
 * Las cartas de los trucks, en el orden del dashboard.
 *
 * ⚠️ SI LA BASE NO CONTESTA, CAE AL ROSTER ENTERO, y es deliberado: una lista
 * vacía dejaría `/food-trucks` sin food trucks, que es peor que publicar los
 * cuatro sin carta. Con la base caída, las tarjetas salen con su foto y su
 * bajada de siempre y el botón de la carta queda deshabilitado.
 *
 * ⚠️ UNA CARTA QUE NO COINCIDE CON NINGÚN TRUCK IGUAL SE PUBLICA, con el nombre
 * y la bajada que le puso el cliente y sin foto. Es lo que hace que un truck
 * nuevo aparezca solo: se le carga la carta y ya está en la página. La foto y
 * la cocina las suma después quien edite el roster.
 */
export async function cartasDeTrucks(): Promise<readonly CartaDeTruck[]> {
  const cartas = await getMenuPdfs();

  if (cartas.length === 0) {
    return activeTrucks().map((t) => ({
      name: t.name,
      description: t.blurb ?? t.story,
      pdfUrl: t.menuImage,
      truck: t,
    }));
  }

  return cartas.filter((m) => !esDelBar(m)).map((m) => {
    const truck = truckPorNombre(m.name) ?? null;
    return {
      name: truck?.name ?? m.name,
      description: m.description ?? truck?.blurb ?? truck?.story ?? null,
      pdfUrl: m.pdfUrl,
      truck,
    };
  });
}

/**
 * La carta de la barra.
 *
 * ⚠️ DEVUELVE `null` SI NO ESTÁ CARGADA O SI LA BASE NO CONTESTA, y quien la
 * usa —`/sunset-bar`— tiene que seguir mostrando algo: hoy cae a las dos
 * láminas del sitio viejo que están en `public/menus/`.
 */
export async function cartaDelBar(): Promise<MenuPdf | null> {
  const cartas = await getMenuPdfs();
  return cartas.find(esDelBar) ?? null;
}
