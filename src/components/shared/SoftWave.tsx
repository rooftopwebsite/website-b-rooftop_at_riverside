import { OLA_SUAVE } from '@/lib/brand-art';
import type { Surface } from './WaveBorder';

/**
 * LA OLA SUAVE: UNA sola ondulación larga entre dos superficies.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ES LA TERCERA OLA DEL REPO Y LA QUE EL CLIENTE ELIGIÓ. Las tres conviven
 * y es fácil agarrar la que no es:
 *
 *   · `WaveBorder`    la cenefa de rulos chiquitos, uno al lado del otro.
 *   · `HorizonBorder` los dos paths grandes del brand book con el medallón.
 *   · ésta            `wave-only.svg`: una ondulación suave, la de la home.
 *
 * ⚠️ NACIÓ INLINE EN `/sunset-bar` Y SUBE ACÁ POR LA REGLA DE LAS DOS COPIAS.
 * Estuvo escrita a mano dentro de la página desde el 2026-09-17 —«debajo del
 * hero esté la ola como en la home»— con la nota de que si una segunda página
 * pedía el mismo corte, subía a `shared/`. Camila, 2026-09-21, sobre
 * `/food-trucks`: «que las olas sean como la de sunset bar, no estas». Esa es
 * la segunda página, así que el corte sube entero, con sus trampas.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ EL FONDO ES LA SUPERFICIE DE ABAJO Y EL DIBUJO EL DE ARRIBA, al revés que
 * `WaveBorder`. Acá el path se espeja y TAPA la parte de arriba de la franja
 * con el color del que viene: lo que asoma por debajo de la curva es la
 * superficie que sigue, que es la que emerge.
 *
 * ⚠️ SE VE LA MITAD DEL DIBUJO, NO EL DIBUJO ENTERO, y eso es lo que saca el
 * pico del medio. El archivo son dos caminos espejados que se encuentran en el
 * centro y en esa junta las curvas no empalman: forman un vértice que,
 * estirado, se lee como un pico. Camila: «cuidado, no quiero que tenga este
 * pico». Con el `viewBox` recortado a 800 de los 1570 del original, la junta
 * queda afuera de cuadro.
 *
 * ⚠️ EL ALTO VA ESCRITO Y NO SALE DE LA PROPORCIÓN: con `preserveAspectRatio="none"`
 * el dibujo se estira sólo en vertical, que es lo que hacen todas las cenefas
 * del repo.
 *
 * ⚠️ `rt-wave` ES LA MISMA ANIMACIÓN QUE LA HOME: un vaivén de 11s que corre el
 * dibujo un 3,5 % de su propio ancho. El 110 % de ancho con −5 % de margen es
 * lo que lo hace posible: sobra dibujo para los dos lados, así que no aparece
 * borde en ningún momento del ciclo. Con `prefers-reduced-motion` se apaga
 * sola: el corte global vive en `globals.css`.
 *
 * ⚠️ `grano-capa` Y NO `grano`: el color de la ola lo pinta el path, donde un
 * `background-image` no llega.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LA POSICIÓN LA PONE QUIEN LA USA, Y ES OBLIGATORIA. `grano-capa` pinta el
 * grano con dos pseudoelementos `absolute inset-0`, así que esta franja tiene
 * que ser un contexto posicionado sí o sí: `relative` si va en flujo, o
 * `absolute` si se apoya sobre el pie de una sección.
 *
 * ⚠️ Y NO PUEDE VENIR DE FÁBRICA. La clase base traía `relative` y el call site
 * le pasaba `absolute` por `className`: en el atributo ganaba `absolute`, pero
 * en el CSS emitido las utilidades de `position` salen en orden fijo y
 * `.relative` se escribe DESPUÉS de `.absolute`, así que ganaba `relative` y la
 * ola quedaba en flujo. En `/food-trucks` eso sumaba 168px de aire entre la
 * bajada del hero y las tarjetas, que era el hueco que Camila veía —«que se
 * vean las cards al entrar»— y que ningún `pb` explicaba.
 * ══════════════════════════════════════════════════════════════════════════
 */
export default function SoftWave({
  from,
  to,
  className,
}: {
  /** La superficie de arriba: es la que dibuja la ola. */
  readonly from: Surface;
  /** La superficie de abajo: queda de fondo y emerge bajo la curva. */
  readonly to: Surface;
  /**
   * ⚠️ TIENE QUE TRAER UNA CLASE DE `position`. Ver la nota de arriba: sin
   * `relative` o `absolute` el grano se va a buscar el ancestro posicionado
   * más cercano y la franja sale sin textura.
   */
  readonly className: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={['grano-capa w-full overflow-hidden leading-[0]', className]
        .filter(Boolean)
        .join(' ')}
      style={{ backgroundColor: `var(--color-${to})` }}
    >
      {/*
        ⚠️ EL ESPEJO VA ADENTRO DEL SVG Y NO EN CSS: la animación `rt-wave`
        escribe `transform: translateX(...)` sobre este mismo elemento, así que
        un `-scale-y-100` en la clase quedaría pisado y la ola se daría vuelta
        al arrancar el ciclo. Dentro del `<path>` el espejo es coordenadas, no
        CSS, y los dos conviven.
      */}
      <svg
        viewBox={OLA_SUAVE.viewBox}
        preserveAspectRatio="none"
        role="presentation"
        className="rt-wave -ml-[5%] block h-[104px] w-[110%] sm:h-[136px] lg:h-[168px]"
        style={{ color: `var(--color-${from})` }}
      >
        <path
          d={OLA_SUAVE.d}
          fill="currentColor"
          transform={`translate(0 ${OLA_SUAVE.alto}) scale(1 -1)`}
        />
      </svg>
    </div>
  );
}
