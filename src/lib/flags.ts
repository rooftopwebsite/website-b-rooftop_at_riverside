/**
 * Interruptores de estado del sitio.
 *
 * ⚠️ Son TEMPORALES por definición. Cada uno tiene que decir qué lo apaga y
 * quién lo pidió, o en tres semanas nadie se anima a tocarlo.
 */

/**
 * SOLO HOME — la navegación a las otras páginas está bloqueada.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ QUÉ HACE Y POR QUÉ EXISTE.
 *
 * Pedido de Camila mientras el rediseño está en revisión: la home nueva ya
 * está, pero las 22 páginas internas todavía tienen el diseño anterior. Si
 * alguien que está mirando la home hace clic en «Sunset Bar», se cae del
 * rediseño a una página que no se parece en nada — y en una revisión con el
 * cliente eso arruina la presentación.
 *
 * Con esto en `true`, todo link que salga de la página actual no navega. Lo
 * que SÍ sigue funcionando, y es a propósito:
 *
 *   · los anclajes de la misma página (`#whats-on`, `#find-us`)
 *   · los links externos (Instagram, Facebook, Google, Toast, el mapa)
 *   · `mailto:` y `tel:` — son las dos vías de contacto reales del sitio
 *
 * ⚠️ CÓMO SE SACA: se pone en `false`. Nada más. Ni un componente cambia,
 * porque el bloqueo vive en un único listener (`NavLock`) y no en cada link.
 * Ese fue el criterio al elegir la forma: un flag que se apaga solo en un
 * lado no deja restos cuando se apaga.
 *
 * ⚠️ NO ES SEGURIDAD y no pretende serlo. Alguien que escriba la URL a mano
 * entra igual. Es una tranca de presentación, no un control de acceso.
 * ══════════════════════════════════════════════════════════════════════════
 */
export const SOLO_HOME = true;
