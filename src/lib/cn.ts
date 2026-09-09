import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
