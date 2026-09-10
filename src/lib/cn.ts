import clsx, { type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * Une clases de Tailwind resolviendo los CONFLICTOS, y no sólo concatenando.
 *
 * ⚠️ Existe por un bug concreto y medido, no por prolijidad. `Button` armaba
 * su clase con `[BASE, VARIANTS[v], SIZES[s], className].join(' ')`, y `BASE`
 * incluye `inline-flex`. El header le pasaba `className="hidden sm:inline-flex"`
 * al CTA para esconderlo en mobile, así que el elemento terminaba con
 * `inline-flex` Y `hidden` a la vez.
 *
 * En Tailwind eso NO lo decide el orden en el atributo `class`, lo decide el
 * orden en el CSS emitido — y ahí ganaba `inline-flex`. Resultado: el `hidden`
 * no ocultaba nada, los dos CTA se dibujaban a 390px de ancho, y el grupo
 * derecho del header medía 343px dentro de un viewport de 390. Estaba
 * invisible porque el header era `fixed` y el desborde de un elemento fijo no
 * agranda el área scrolleable del documento; al pasar el header a `sticky`
 * apareció como scroll horizontal en las 23 rutas.
 *
 * `twMerge` resuelve el conflicto quedándose con la ÚLTIMA de cada grupo, que
 * es lo que uno espera al pasar una clase por props: la de quien llama gana.
 *
 * `clsx` primero, para aceptar condicionales y arrays; `twMerge` después,
 * porque necesita la cadena ya aplanada.
 */

/**
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ HAY QUE DECLARARLE NUESTROS TOKENS DE TAMAÑO DE TEXTO, y esto arregla un
 * bug que rompió los botones de las 20 páginas.
 *
 * `tailwind-merge` no lee nuestro `@theme`: trae la escala de Tailwind por
 * defecto escrita adentro. Un `text-lg` lo reconoce como TAMAÑO; un
 * `text-dato` no está en su lista, así que lo clasifica como **color** —es la
 * suposición razonable, porque `text-<algo>` casi siempre es un color—.
 *
 * Y ahí aparece el bug. `Button` arma su clase como
 * `cn(BASE, VARIANTS[v], SIZES[s], className)`: el tamaño va DESPUÉS del
 * color. Creyendo que las dos son colores, `twMerge` se queda con la última y
 * **borra el color de la variante**:
 *
 *     cn('bg-cream text-deep', 'text-dato')  →  'bg-cream text-dato'
 *
 * `text-dato` no es un color, así que el botón heredaba el del contexto. En la
 * banda oscura eso era blanco sobre crema: **1.14:1**. `npm run a11y` lo
 * encontró en 44 nodos de 20 páginas en el momento en que se introdujeron los
 * tokens; antes no pasaba porque los tamaños se escribían `text-[15px]`, que
 * `twMerge` lee sin ambigüedad como longitud.
 *
 * Es exactamente el tipo de regresión que un token nuevo produce lejos de
 * donde se definió.
 *
 * ⚠️ La lista tiene que incluir TODOS los `--text-*` del `@theme`. Si mañana
 * se agrega uno y no se agrega acá, el bug vuelve — silencioso y a la
 * distancia. Lo detecta `npm run a11y`, no el build.
 * ══════════════════════════════════════════════════════════════════════════
 */
const TAMANOS_DE_TEXTO = [
  // Display
  'hero',
  'h1',
  'h2',
  'h3',
  // Display del rediseño `food-truck-club` (la home y el header)
  'titan',
  'banda',
  'nav',
  'd1',
  'd2',
  'd3',
  'd4',
  'd5',
  'd6',
  'd7',
  // Texto
  'intro',
  'lead',
  'base',
  'cta',
  'dato',
  'micro',
  'caption',
];

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: TAMANOS_DE_TEXTO }],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
