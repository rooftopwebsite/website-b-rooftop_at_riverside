import { OLA } from '@/lib/brand-art';

/**
 * El azulejo de la marca, como BANDA.
 *
 * ⚠️ YA NO ES UN PLACEHOLDER. Hasta ahora esto dibujaba una onda inventada por
 * mí a partir del isotipo, porque el azulejo real no lo tenía. Camila mandó el
 * archivo de Figma y el motivo verdadero está en la página «Elementos»: un
 * rombo naranja con una estrella de ocho puntas en menta, sobre teal, separado
 * por un filete crema, y entre rombo y rombo un cuadrado teal con un círculo
 * menta. Vive en `public/brand/tile-pattern.svg`, exportado de ahí.
 *
 * ⚠️ Va como imagen de fondo y no como SVG en línea, al revés que `WaveBorder`.
 * La diferencia es el color: la cenefa tiene que tomar el color de la sección
 * donde cae, y una imagen de fondo no puede leer un token CSS. El azulejo, en
 * cambio, tiene sus cuatro colores fijos —son parte del dibujo—, así que puede
 * ir como archivo y de paso se cachea en vez de repetirse en cada HTML.
 *
 * ⚠️ SE FUE EL PROP `tone`. Existía para teñir la onda inventada de river,
 * cream o deep. El azulejo real no se tiñe: es policromo por definición, y un
 * filtro CSS encima sólo lo ensuciaría.
 *
 * ⚠️ El brief: «El patrón de azulejo se usa como banda o como detalle, nunca
 * como fondo de sección completa». Por eso este componente ES una banda de alto
 * fijo y no acepta usarse como background. Con el motivo real la regla importa
 * más que antes, no menos: el azulejo es de saturación alta y a página completa
 * se comería todo lo demás.
 *
 * ⚠️ La altura por defecto subió de 28px a 44. A 28 la celda se escalaba a
 * menos de un cuarto y la estrella se cerraba hasta ser una mancha; el motivo
 * dejaba de reconocerse y quedaba un ruido de colores. A 44 se lee el rombo.
 *
 * Es decorativo y no transporta información, así que va `aria-hidden` y no le
 * aplica el mínimo de contraste.
 */

export default function TilePattern({
  height = 'h-[44px]',
  className = '',
}: {
  readonly height?: string;
  readonly className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      /* `bg-size-[auto_100%]` ata la celda a la altura de la banda y deja que
         el ancho salga de la proporción: la celda es cuadrada, así que se
         repite en horizontal sin deformarse. Con `contain` o un tamaño en px
         habría que mantener dos números en sincronía. */
      className={[
        'w-full bg-[url(/brand/tile-pattern.svg)] bg-size-[auto_100%] bg-center bg-repeat-x',
        height,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );
}

/**
 * El mismo mundo gráfico como DETALLE chico: un separador de ~44px para
 * acompañar un eyebrow o cerrar un bloque. El otro uso que el brief autoriza.
 *
 * ⚠️ Acá NO va el azulejo. A 12px de alto el rombo con la estrella adentro es
 * una mancha, y cuatro colores en un adorno de 44×12 al lado de un título es
 * ruido. Va la ola de la cenefa, que es el otro motivo del brand book y a este
 * tamaño sigue leyéndose. Comparte el path con `WaveBorder`.
 */
export function TileMark({ className = '' }: { readonly className?: string }) {
  return (
    <svg
      width="52"
      height="12"
      viewBox="0 0 383.5 50"
      fill="none"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
      className={className}
    >
      <path d={OLA.d} fill="var(--color-river)" />
    </svg>
  );
}
