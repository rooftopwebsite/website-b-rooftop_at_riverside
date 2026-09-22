/**
 * Interruptores de estado del sitio.
 *
 * ⚠️ Son TEMPORALES por definición. Cada uno tiene que decir qué lo apaga y
 * quién lo pidió, o en tres semanas nadie se anima a tocarlo.
 */

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
