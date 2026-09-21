/**
 * Interruptores de estado del sitio.
 *
 * ⚠️ Son TEMPORALES por definición. Cada uno tiene que decir qué lo apaga y
 * quién lo pidió, o en tres semanas nadie se anima a tocarlo.
 */

/**
 * LAS PÁGINAS QUE SE PUEDEN NAVEGAR. El resto del sitio existe, pero ningún
 * link lleva hasta ahí.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ QUÉ HACE Y POR QUÉ EXISTE.
 *
 * Pedido de Camila con el sitio ya en Vercel y el cliente mirándolo: cuatro
 * páginas están terminadas y las otras seis todavía tienen trabajo encima. Si
 * el cliente hace clic en «About» o en «Plan an Event» se cae del rediseño a
 * una página a medio hacer, y en una revisión eso arruina la presentación.
 *
 * Con esta lista, todo link cuyo destino NO esté acá adentro deja de navegar.
 * El botón sigue donde está, con su color, su tamaño y su lugar en el diseño
 * —decisión de Camila, «visibles pero sin link», para no reacomodar el home
 * ahora y tener que volver a acomodarlo cuando las páginas estén—, pero el
 * clic no va a ningún lado.
 *
 * Lo que SÍ sigue funcionando, y es a propósito:
 *
 *   · los anclajes de la misma página (`#whats-on`, `#find-us`)
 *   · los links externos (Instagram, Facebook, Google, Toast, el mapa)
 *   · `mailto:` y `tel:`, que son las dos vías de contacto reales del sitio
 *
 * ⚠️ ESCRIBIR LA URL A MANO ENTRA IGUAL, y está pedido así. Hay que poder
 * abrir `/events` para trabajarla mientras el cliente, que navega con el
 * mouse, no llega nunca. No es un control de acceso: es una tranca de
 * presentación. Si algún día hace falta que la página no se pueda ver ni
 * escribiendo la URL, eso es otra cosa y va en un `proxy.ts`.
 *
 * ⚠️ CÓMO SE ABRE UNA PÁGINA: se le suma el renglón a esta lista. Nada más.
 * Ni un componente cambia, porque el bloqueo vive en un único listener
 * —`NavLock`— y no en cada link. Cuando la lista tenga las diez rutas del
 * sitio, se borra este bloque junto con `NavLock`.
 *
 * ⚠️ LA COMPARACIÓN ES EXACTA Y NO POR PREFIJO. `/food-trucks` está abierta y
 * `/food-trucks/el-chilango` no: las fichas de truck todavía no existen como
 * ruta, así que un prefijo habilitaría links que terminan en 404.
 * ══════════════════════════════════════════════════════════════════════════
 */
export const PAGINAS_PUBLICADAS: readonly string[] = [
  '/',
  '/sunset-bar',
  '/food-trucks',
  '/whats-on',
];

/**
 * ¿Este destino navega?
 *
 * Recibe el `pathname` de una URL ya resuelta —no una `href` cruda— y le saca
 * la barra final, porque `/whats-on/` y `/whats-on` son la misma página y un
 * `<Link>` puede escribir cualquiera de las dos.
 *
 * ⚠️ Con la lista completa devuelve `true` siempre, que es exactamente lo que
 * tiene que pasar el día que esto se apague.
 */
export function esNavegable(pathname: string): boolean {
  const ruta = pathname.replace(/\/$/, '') || '/';
  return PAGINAS_PUBLICADAS.includes(ruta);
}

/**
 * CAJA ALTA EN LO QUE SE TOCA — botones y links de navegación en mayúsculas.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ES UNA PRUEBA Y ESTÁ PEDIDA COMO PRUEBA. Camila, sobre la home: «modo
 * prueba: botones y links en mayúscula, para que vayan con el logo».
 *
 * El argumento es bueno y es de marca: el lockup es una condensada en caja
 * alta, y hoy es lo ÚNICO en mayúsculas de la barra superior. Todo lo demás
 * —nav, «More», el CTA, el footer— va en caja baja. La prueba es si la
 * mayúscula en lo que se navega hace que el header se lea como una pieza sola.
 *
 * ⚠️ REVIERTE UNA DECISIÓN ANTERIOR, Y CONVIENE SABERLO ANTES DE MIRARLO. Los
 * botones YA ESTUVIERON en caja alta y salieron: está argumentado entero
 * arriba de `VARIANTS` en `Button.tsx`. El motivo que mandaba era que Camila
 * había fijado un criterio único para todo lo que se navega o se toca —«la
 * letra del cuerpo, en negrita, un escalón más grande»— y la caja alta lo
 * rompía. Si esta prueba queda, ese criterio se reescribe; si no queda, se
 * apaga el flag y no hay nada más que deshacer.
 *
 * ⚠️ LA MAYÚSCULA VIENE CON TRACKING Y NO SE SEPARAN. `uppercase` sin
 * `tracking-cta` aprieta las mayúsculas de la Jost hasta que «PLAN AN EVENT»
 * se lee como una palabra sola. Los 0.06em son los mismos que tenía el botón
 * la vez anterior.
 *
 * ⚠️ QUÉ ALCANZA: los seis botones (`Button.tsx`), la nav y el mega-menú
 * (`Header.tsx`), los links de columna del footer y `ArrowLink`. NO alcanza al
 * cuerpo de texto, a los títulos ni a los `Eyebrow`, que ya tienen su propia
 * caja y su propio tracking.
 *
 * ⚠️ CÓMO SE SACA: se pone en `false`. Los cuatro archivos leen esta constante
 * y nada más.
 * ══════════════════════════════════════════════════════════════════════════
 */
export const CAJA_ALTA = true;

/** La clase que aplica la prueba. Vacía cuando `CAJA_ALTA` está en `false`. */
export const CAJA_ALTA_CLS = CAJA_ALTA ? 'uppercase tracking-cta' : '';
