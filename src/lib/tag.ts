/**
 * LA TIPOGRAFÍA Y EL TAMAÑO DE TODOS LOS TAGS DEL SITIO.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ POR QUÉ EXISTE ESTE ARCHIVO. Los tags habían crecido sueltos, uno por
 * componente, y terminaron siendo seis familias distintas para la misma cosa:
 *
 *     YardSteps / EventTypes   12px · medium · caja baja · px-2.5 py-1.25
 *     WhatsOn (el espacio)     12px · medium · CAJA ALTA con tracking
 *     Card (el badge)          12px · bold   · CAJA ALTA con tracking
 *     TruckMenu                13px · medium · caja baja · px-2.5 py-0.75
 *     DishCard (dietarios)     13px · medium · caja baja
 *     DishCard (New, picante)  13px · bold   · CAJA ALTA con tracking
 *
 * Camila, 2026-09-16: «si los tags serán con letra minúsculas que lo sean
 * todos, debemos unificar; en color pueden ser distintos pero que sean de la
 * misma familia al menos en tipografía y tamaño».
 *
 * ⚠️ LO QUE UNIFICA Y LO QUE NO. Unifica las cuatro cosas que hacen que dos
 * tags se lean como el mismo objeto: familia, tamaño, peso y acolchado. NO
 * toca el color ni el radio, que son de cada contexto —un tag sobre una foto
 * necesita otro fondo que uno sobre papel— y que el pedido deja libres.
 *
 * ⚠️ CAJA BAJA, y ésa es la decisión de fondo. La mitad estaba en mayúsculas
 * con `tracking`, que es el tratamiento de los EYEBROW y de los CTA del
 * sitio: o sea que un tag parecía un rótulo de sección o un botón. En caja
 * baja se lee como lo que es, un dato al costado.
 *
 * ⚠️ 12px (`text-caption`) Y NO 13 (`text-micro`), aunque los nombres sugieran
 * lo contrario: en este repo `micro` es 13 y `caption` 12. El 12 es el que
 * eligió Camila señalando los chips de `YardSteps` —«a los tags de las cards
 * dales el tamaño de estos»—, así que el que se movió fue el otro.
 *
 * ⚠️ QUÉ NO ES UN TAG, y por eso no importa esto:
 *
 *   · La píldora del HORARIO en las cards de eventos («3 PM – 8 PM») y la de
 *     precio. Son DATOS: van en negrita porque el número es lo que se busca,
 *     y tienen su propio acolchado más ajustado. Un tag dice de qué tipo es
 *     algo; un dato dice cuánto o cuándo.
 *   · Los botones y los links con forma de píldora. Ver `Button.tsx`.
 *   · Los marcadores de pendiente (`PendingData`), que son una alarma de
 *     obra y tienen que verse distintos a propósito.
 * ══════════════════════════════════════════════════════════════════════════
 */
export const TAG = 'px-2.5 py-1.25 font-body text-caption font-medium';
