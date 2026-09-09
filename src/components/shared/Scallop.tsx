/**
 * El separador festoneado: la transición entre una superficie y la siguiente.
 *
 * ⚠️ NO va en cada sección. Dos o tres por página como máximo, y sólo donde el
 * fondo CAMBIA de verdad. Puesto en cada corte deja de leerse como un gesto de
 * marca y pasa a ser un patrón de fondo, que es justo lo que la ley del color
 * prohíbe. En la home son dos: la entrada y la salida de la losa verde.
 *
 * Cómo funciona: el festón se dibuja del color de la sección de ARRIBA y se
 * apoya sobre la de abajo, así que el recorte es real y no una franja pegada.
 * Por eso hay que pasarle los dos colores.
 *
 * ⚠️ SE REPITE, no se estira. Antes era un `<svg>` con `preserveAspectRatio
 * ="none"` y seis arcos por ancho de pantalla: en un monitor de 1440 cada arco
 * medía 240px de ancho por 22 de alto —una relación de 11:1— y el resultado no
 * se leía como festón sino como una ondulación del borde. Camila lo dibujó en
 * el boceto como un zigzag bien marcado.
 *
 * Ahora el motivo tiene un tamaño FIJO de 56×14 y se repite en `repeat-x`, así
 * que el arco mantiene su proporción en cualquier ancho: siete festones en un
 * teléfono de 390px, veinticinco en un monitor de 1440.
 *
 * La técnica es una MÁSCARA y no un `<path>` pintado: el color tiene que salir
 * del token de la superficie de arriba —que es una variable CSS— y una imagen
 * de fondo no puede tomar un color de una variable. Con máscara, el color lo
 * pone `background-color` y el SVG aporta sólo la forma.
 *
 * ⚠️ ASSET PLACEHOLDER. La curva exacta del brand book todavía no la tengo: es
 * un semicírculo, que es la forma genérica de un festón. Cuando llegue el SVG
 * real se cambia `MOTIVO` y nada más — los dos usos de la home no se tocan.
 */

const SURFACES = {
  paper: 'var(--color-paper)',
  bone: 'var(--color-bone)',
  cream: 'var(--color-cream)',
  deep: 'var(--color-deep)',
} as const;

export type Surface = keyof typeof SURFACES;

/** Ancho y alto del motivo, en px. El alto es la profundidad del festón. */
const TILE = { ancho: 56, alto: 14 } as const;

/**
 * Dos semicírculos de radio 14 por baldosa.
 *
 * ⚠️ El radio es exactamente un cuarto del ancho para que la baldosa cierre sin
 * costura: los arcos arrancan y terminan en el borde, así que al repetirse el
 * empalme cae en el punto donde la curva es tangente a la horizontal y no se ve
 * el corte. Cambiar el ancho sin cambiar el radio deja una juntura visible cada
 * 56px, que es el tipo de defecto que sólo se nota una vez publicado.
 */
const MOTIVO = `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE.ancho}" height="${TILE.alto}" viewBox="0 0 56 14"><path d="M0 0 H56 A14 14 0 0 1 28 0 A14 14 0 0 1 0 0 Z" fill="#000"/></svg>`;

const MASCARA = `url("data:image/svg+xml,${encodeURIComponent(MOTIVO)}")`;

export default function Scallop({
  from,
  to,
  className = '',
}: {
  /** La superficie de arriba: es la que dibuja el festón. */
  readonly from: Surface;
  /** La superficie de abajo: el color que se ve por los huecos. */
  readonly to: Surface;
  readonly className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={['w-full overflow-hidden leading-[0]', className].filter(Boolean).join(' ')}
      style={{ backgroundColor: SURFACES[to] }}
    >
      {/* `WebkitMask*` va explícito: Safari todavía pide el prefijo para
          `mask-image` sobre un data-URI, y sin él la franja se pinta entera del
          color de arriba — o sea, una barra sólida donde tenía que haber un
          festón. Falla en silencio, que es lo peor que puede hacer. */}
      <div
        style={{
          height: TILE.alto,
          backgroundColor: SURFACES[from],
          WebkitMaskImage: MASCARA,
          maskImage: MASCARA,
          WebkitMaskRepeat: 'repeat-x',
          maskRepeat: 'repeat-x',
          WebkitMaskSize: `${TILE.ancho}px ${TILE.alto}px`,
          maskSize: `${TILE.ancho}px ${TILE.alto}px`,
          WebkitMaskPosition: 'top left',
          maskPosition: 'top left',
        }}
      />
    </div>
  );
}
