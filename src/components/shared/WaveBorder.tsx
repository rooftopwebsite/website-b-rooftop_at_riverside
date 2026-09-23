import { OLA } from '@/lib/brand-art';

/**
 * La cenefa de olas del brand book: la transición entre una superficie y la
 * siguiente.
 *
 * ⚠️ REEMPLAZA A `Scallop.tsx`, que era arte provisorio. El festón de arcos que
 * había ahí lo inventé yo como marcador de posición mientras no tenía el
 * archivo de marca. Camila lo mandó, y el separador real del brand book no es
 * un festón: son OLAS rompiendo. Está en la página «Elementos» tres veces
 * —crema, teal y naranja—, que es el mismo dibujo con distinto relleno.
 *
 * El componente cambió de nombre además de contenido porque «scallop» describe
 * una forma que ya no es la que se dibuja, y un nombre que miente sobre lo que
 * hay adentro es peor que uno largo.
 *
 * ⚠️ NO va en cada sección. Dos o tres por página como máximo, y sólo donde el
 * fondo CAMBIA de verdad. Puesta en cada corte deja de leerse como un gesto de
 * marca y pasa a ser un patrón de fondo, que es justo lo que la ley del color
 * prohíbe. En la home son dos: la entrada y la salida de la losa verde.
 *
 * ⚠️ LAS OLAS LLEVAN EL COLOR DE LA SECCIÓN DE ABAJO, no el de la de arriba, y
 * es al revés de como funcionaba el festón. El dibujo tiene la base abajo y las
 * crestas hacia arriba: pintado del color de arriba quedaría colgando del techo
 * dado vuelta. Del color de abajo, la sección que viene emerge en olas sobre la
 * que termina, que es lo que el dibujo quiere decir.
 *
 * ⚠️ Se repite con un `<pattern>` de SVG y no con `background-image`, porque el
 * color tiene que salir de un token y una imagen de fondo no puede tomarlo. Con
 * máscara también se podría, pero un `<pattern>` no depende del prefijo
 * `-webkit-` ni de que el navegador deje cargar el SVG como máscara.
 */

const SURFACES = {
  paper: 'var(--color-paper)',
  bone: 'var(--color-bone)',
  cream: 'var(--color-cream)',
  /* La banda de las tarjetas de `/food-trucks`. Ver el tono `mint` de `Section`. */
  mint: 'var(--color-mint)',
  deep: 'var(--color-deep)',
  river: 'var(--color-river)',
  sunset: 'var(--color-sunset)',
} as const;

export type Surface = keyof typeof SURFACES;

/*
 * Las mismas superficies como CLASES, para no pintar con `style`. Van escritas
 * enteras a propósito: Tailwind sólo emite las clases que lee literales en el
 * código, así que un `bg-${surface}` armado en runtime no existiría en el CSS.
 */
export const SURFACE_BG: Record<Surface, string> = {
  paper: 'bg-paper',
  bone: 'bg-bone',
  cream: 'bg-cream',
  mint: 'bg-mint',
  deep: 'bg-deep',
  river: 'bg-river',
  sunset: 'bg-sunset',
};

export const SURFACE_TEXT: Record<Surface, string> = {
  paper: 'text-paper',
  bone: 'text-bone',
  cream: 'text-cream',
  mint: 'text-mint',
  deep: 'text-deep',
  river: 'text-river',
  sunset: 'text-sunset',
};

export default function WaveBorder({
  from,
  to,
  className = '',
}: {
  /** La superficie de arriba: queda de fondo, detrás de las olas. */
  readonly from: Surface;
  /** La superficie de abajo: es la que dibuja las olas. */
  readonly to: Surface;
  readonly className?: string;
}) {
  /*
    El `id` del pattern lleva los dos colores porque puede haber más de una
    cenefa en la misma página: con un id fijo, la segunda redefiniría el pattern
    de la primera y las dos saldrían del mismo color. Pasó con el primer
    prototipo y es de los errores que sólo se ven cuando hay dos en pantalla.
  */
  const id = `rt-ola-${from}-${to}`;

  return (
    <div
      aria-hidden="true"
      /* `grano-capa` y no `grano`: el color de llegada de la ola lo pintan los
         paths del SVG, donde un `background-image` no llega. Ver su nota. */
      className={['grano-capa relative w-full overflow-hidden leading-[0]', SURFACE_BG[from], className]
        .filter(Boolean)
        .join(' ')}
    >
      <svg
        width="100%"
        height={OLA.alto}
        viewBox={`0 0 1600 ${OLA.alto}`}
        preserveAspectRatio="xMinYMax slice"
        role="presentation"
        className="block"
      >
        <defs>
          <pattern
            id={id}
            width={OLA.periodo}
            height={OLA.alto}
            patternUnits="userSpaceOnUse"
          >
            <path d={OLA.d} fill={SURFACES[to]} />
          </pattern>
        </defs>
        {/*
          El rectángulo se pasa del viewBox a propósito. `slice` recorta lo que
          sobra, y así en una pantalla más ancha que 1600 la tira sigue en vez de
          estirarse: `preserveAspectRatio` sin `slice` escalaría las olas y en un
          monitor grande se verían el doble de altas que en un portátil.
        */}
        {/*
          ⚠️ LAS OLAS SE HAMACAN, Y ANTES ESTABAN QUIETAS. Camila, 2026-09-16:
          «quedémonos con las ondas verdes pero sin el sticker de la palmera,
          sólo las ondas, y animémoslas como en el home».

          Es la MISMA animación que la ola de `PhotoDivider`: `.rt-wave`, un
          vaivén horizontal de 3,5 % en 11 segundos. No se escribe una nueva ni
          se cambia la duración, porque dos olas del mismo sitio moviéndose a
          ritmos distintos se notan como dos animaciones y no como el mar.

          ⚠️ SE ANIMA EL `<rect>` Y NO EL CONTENEDOR. El rectángulo ya se pasa
          del viewBox —mide 4000 contra 1600— justamente para que sobre material
          al recortar, así que puede correrse un 3,5 % sin que aparezca un borde
          vacío. Mover el div de afuera obligaría a ensancharlo y a compensar
          con un margen negativo, que es lo que hace `PhotoDivider` porque allá
          la ola es un SVG suelto y no un patrón.

          El corte global de `prefers-reduced-motion` la apaga: ver globals.css.
        */}
        <rect className="rt-wave" width="4000" height={OLA.alto} fill={`url(#${id})`} />
      </svg>
    </div>
  );
}
