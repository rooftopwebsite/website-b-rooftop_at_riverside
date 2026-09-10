/**
 * Los tokens de movimiento. Un solo lugar, para que ningún componente escriba
 * una curva o una duración a mano.
 *
 * ⚠️ Antes vivían dentro de `components/shared/Motion.tsx` como `EASE_BRAND`,
 * `DURATION`, `REVEAL_OFFSET`, `STAGGER` y `REVEAL_AMOUNT`. Se mudan acá porque
 * ahora los consumen también `PageTransition`, `Preloader` y los componentes de
 * media, y porque un token de diseño no debería vivir dentro de un componente.
 * `Motion.tsx` los re-exporta con los nombres viejos, así que ningún call site
 * se rompe.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ EL TOPE DE 600ms Y LA EXCEPCIÓN DEL HERO.
 *
 * La regla de la casa era «ninguna animación pasa de 600ms», y sigue en pie
 * para todo lo que el usuario dispara o ve repetidas veces: hovers, taps, nav,
 * y las entradas al scroll. Una entrada lenta que se repite ocho veces
 * mientras scrolleás no se lee como elegante, se lee como lag.
 *
 * La secuencia del hero es la única excepción, y es de otra categoría: corre
 * **una vez, al cargar**, no se repite, y es el momento memorable de la página.
 * Ahí 1,1s es lo que le da peso. Es el valor que pide el brief de
 * `redesign/light-tropical` y el que usan las referencias de la rama.
 *
 * O sea: `micro`, `ui` y `reveal` respetan el espíritu del tope; `hero` es la
 * excepción declarada y no se usa en ningún otro lado.
 * ══════════════════════════════════════════════════════════════════════════
 */

/**
 * Las dos curvas, y sólo dos.
 *
 * `out` es la de siempre —easeOutExpo— y ya era la curva de marca: arranca
 * rápido y frena largo, que es lo que hace que una entrada se sienta que
 * «llega» en vez de que «se desliza».
 *
 * `inOut` es para lo que tiene que volver: acordeones, alturas que se abren y
 * se cierran, elementos que salen y entran. Una curva puramente `out` en un
 * cierre se ve cortada.
 *
 * ⚠️ Tipadas como tuplas de 4 con `as const` porque `motion` espera
 * `[number, number, number, number]` y un `number[]` no le sirve.
 */
export const ease = {
  out: [0.16, 1, 0.3, 1] as const,
  inOut: [0.22, 1, 0.36, 1] as const,
} as const;

/** Duraciones, en segundos. Ver la nota del tope de 600ms arriba. */
export const dur = {
  /** Hover, tap. Tiene que ser casi imperceptible. */
  micro: 0.2,
  /** Nav, dropdowns, acordeones. */
  ui: 0.35,
  /** Entradas de sección al scroll. */
  reveal: 0.7,
  /** ⚠️ SÓLO la secuencia del hero, y sólo al cargar. Ver la nota de arriba. */
  hero: 1.1,
} as const;

/** El desfasaje entre hijos de una grilla o una fila. */
export const stagger = 0.08;

/**
 * Cuánto se desplaza cada cosa al entrar.
 *
 * ⚠️ Son DOS valores y no uno, y es la diferencia que hace que el motion no se
 * lea autogenerado: un bloque de texto que viaja 48px se ve pesado, y una foto
 * a sangre que viaja 32px se ve que no se movió. La masa del objeto decide.
 */
export const dist = {
  text: 32,
  media: 48,
} as const;

/**
 * El disparador de los reveals al scroll.
 *
 * ⚠️ `margin` y no `amount`. `amount: 0.2` esperaba que el 20 % del elemento
 * estuviera visible, lo que en una sección alta significa scrollear media
 * pantalla más allá de que asome. El margen negativo dispara cuando al
 * elemento le falta un 20 % del viewport para entrar, que es cuando el ojo ya
 * lo está buscando.
 *
 * ⚠️ `once: true` NO ES NEGOCIABLE acá. Que todo se desarme al scrollear para
 * arriba se siente roto, no premium. Las salidas son otra cosa y viven en
 * `useScroll`/`useTransform` sobre secciones designadas — ver `MOTION.md`.
 */
export const viewport = { once: true, margin: '0px 0px -20% 0px' } as const;

/**
 * El `clip-path` con el que abren las imágenes: `inset()` de abajo hacia
 * arriba. Se escribe acá porque las dos puntas tienen que ser el mismo par en
 * todos los componentes; si divergen, la imagen salta al terminar.
 */
export const clip = {
  hidden: 'inset(0% 0% 100% 0%)',
  visible: 'inset(0% 0% 0% 0%)',
} as const;
