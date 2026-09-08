/**
 * El separador festoneado del brand book: la transición entre una superficie y
 * la siguiente.
 *
 * ⚠️ NO va en cada sección. Dos o tres por página como máximo, y sólo donde el
 * fondo CAMBIA de verdad — blanco a crema, crema a teal. Puesto en cada corte
 * deja de leerse como un gesto de marca y pasa a ser un patrón de fondo, que es
 * justo lo que la ley del color prohíbe.
 *
 * Cómo funciona: el festón se dibuja del color de la sección de ARRIBA y se
 * apoya sobre la de abajo, así que el recorte es real y no una franja pegada.
 * Por eso hay que pasarle los dos colores.
 *
 * ⚠️ ASSET PLACEHOLDER. El festón exacto del brand book todavía no lo tengo.
 * Éste es un arco de circunferencia repetido, que es la forma genérica de un
 * festón; cuando llegue el SVG real se cambia el `<path>` y nada más.
 */

const SURFACES = {
  paper: 'var(--color-paper)',
  cream: 'var(--color-cream)',
  deep: 'var(--color-deep)',
} as const;

export type Surface = keyof typeof SURFACES;

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
      className={['relative w-full overflow-hidden leading-[0]', className].join(' ')}
      style={{ backgroundColor: SURFACES[to] }}
    >
      <svg
        width="100%"
        height="22"
        viewBox="0 0 120 22"
        preserveAspectRatio="none"
        role="presentation"
        className="block"
      >
        {/*
          Un festón cada 20 unidades: seis por ancho de viewBox. Con
          `preserveAspectRatio="none"` se estira al ancho de la pantalla, así
          que en mobile son más anchos y más chatos — que es lo que se quiere:
          en un teléfono un festón chico se vuelve ruido.
        */}
        <path
          d="M0 0 H120 V6
             a10 10 0 0 1 -10 10 a10 10 0 0 1 -10 -10
             a10 10 0 0 1 -10 10 a10 10 0 0 1 -10 -10
             a10 10 0 0 1 -10 10 a10 10 0 0 1 -10 -10
             a10 10 0 0 1 -10 10 a10 10 0 0 1 -10 -10
             a10 10 0 0 1 -10 10 a10 10 0 0 1 -10 -10
             a10 10 0 0 1 -10 10 a10 10 0 0 1 -10 -10
             Z"
          fill={SURFACES[from]}
        />
      </svg>
    </div>
  );
}
