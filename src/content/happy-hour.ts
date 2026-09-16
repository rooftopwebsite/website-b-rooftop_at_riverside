import type { HappyHour } from '@/types/content';

/**
 * El happy hour, en un solo lugar.
 *
 * ⚠️ FUENTE: el footer del sitio vigente (eatdrinkparadise.com), verificado el
 * 2026-09-15 sobre el volcado de `content/_source/home.md`, que lo publica así:
 *
 *     Happy Hour
 *     $4 Drafts | $5 House Wines | $6 House Drinks
 *     Wednesday - Friday | 3pm - 6pm
 *
 * Los tres precios, los tres días y las dos horas son EXACTAMENTE los del
 * cliente. Lo único que cambia es la tipografía del rango: el sitio escribe
 * `Wednesday - Friday` con guión corto y acá va en dash (–), que es la forma
 * correcta de un rango y la que usa el resto de este repo.
 *
 * ⚠️ Antes esto vivía en `lib/brand.ts` y lo leían CUATRO componentes, dos de
 * ellos fuera de las dos páginas donde la información corresponde. Ver el
 * comentario del tipo `HappyHour`.
 */
export const HAPPY_HOUR: HappyHour = {
  days: 'Wednesday – Friday',
  time: '3–6 PM',
  deals: [
    { price: '$4', what: 'Drafts' },
    { price: '$5', what: 'House wines' },
    { price: '$6', what: 'House drinks' },
  ],
  note: null,
};
