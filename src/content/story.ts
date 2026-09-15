import type { GiveBack } from '@/types/content';

/**
 * El Charity Partner Program.
 *
 * ⚠️ ESTE CONTENIDO NO SE ESTÁ RENDERIZANDO EN NINGÚN LADO, y es a propósito.
 *
 * Vivía en la sección «A dollar at a time» de la versión anterior de
 * `/our-story`. La especificación de la página nueva (2026-09-15) define seis
 * secciones y ésta no es una de ellas, así que se sacó del render. Pero el
 * dato es REAL —sale de `/giveback` del sitio vigente— y además
 * `next.config.ts` manda `/giveback` con un 301 a `/our-story`, con lo cual
 * hoy esa redirección aterriza en una página que ya no habla del programa.
 *
 * Se conserva acá para que no se pierda mientras Camila decide una de tres:
 * volver a meterlo en `/our-story`, darle ruta propia, o repuntar el 301.
 *
 * TODO: confirmar con cliente quién es el partner del mes. Rota todos los
 * meses y el que publica el sitio viejo está vencido.
 */
export const GIVE_BACK: GiveBack = {
  title: 'Charity Partner Program',
  tiers: [1, 3, 5],
  body: 'Close your tab and you can add a dollar, three or five. All of the net proceeds go to a different local organisation every month. Past partners include the Wonder Gardens down the road, which has been showing this town tropical plants and birds for nearly ninety years.',
  partner: null,
};
