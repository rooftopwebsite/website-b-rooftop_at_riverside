import type { HappyHour } from '@/types/content';
import { formatTime, getVenueEvents, weekdaysLabel, type VenueEvent } from './events';

/**
 * EL HAPPY HOUR, LEÍDO DE LA BASE.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ERA UNA CONSTANTE ESCRITA A MANO Y EL DATO ESTABA MAL. Salía del footer
 * del sitio Wix —«$4 Drafts | $5 House Wines | $6 House Drinks, Wednesday -
 * Friday, 3pm - 6pm»— y el 2026-09-17 el cliente pasó el dato real, que no se
 * parece: es **sábado y domingo de 12 a 6**, es de TODO el venue, y los
 * precios son otros.
 *
 * Camila, 2026-09-17: «cuidado, la info que teníamos estaba mal, hay que crear
 * el evento y donde se nombre happy hour y se exponga su info debe levantar la
 * info de la base de datos».
 *
 * ⚠️ LOS DOS DATOS DUROS SALEN DE COLUMNAS REALES Y NO DE PARSEAR TEXTO:
 *   · los DÍAS, de `recurrence_days` (`[6,0]` = sábado y domingo)
 *   · el HORARIO, de `start_time` y `end_time`
 * O sea que el cliente cambia el horario en el dashboard y el sitio lo sigue,
 * sin que nadie tenga que escribir una frase.
 *
 * ⚠️ LAS OFERTAS SÍ SON TEXTO, porque la base no tiene dónde guardarlas: un
 * evento no tiene lista de precios. La convención es **una oferta por
 * renglón, empezando con el precio**:
 *
 *     $1 off drafts, bottles and cans
 *     $8 Tito's, Captain, Crown's
 *     $10 Margaritas
 *
 * Un renglón que no empieza con `$` NO se pierde: cae en la nota de abajo, que
 * es donde va «Superior Light Beer is the featured pour». Nada de lo que el
 * cliente escriba desaparece por no cumplir el formato.
 *
 * ⚠️ QUÉ EVENTO ES: el que se LLAMA «happy hour», y NO el que lleva el tag
 * `happy-hour`. La diferencia importa y está verificada contra la base el
 * 2026-09-17: **Wooftop Wednesdays llevaba ese tag** —tenía 2x1 en tragos, así
 * que la etiqueta no estaba mal— y era el primero de la lista. Seleccionando
 * por tag, el bloque de happy hour de `/sunset-bar` publicaba los miércoles de
 * perros.
 *
 * ⚠️ ESE EVENTO YA NO LLEVA EL TAG, y el criterio del título sigue igual de
 * necesario. El 2026-09-21 Wooftop Wednesdays pasó a ser **Wooftop Fest**, el
 * tercer miércoles de cada mes, y se le sacó `happy-hour` porque Madeline
 * Powers avisó que el 2x1 está sin confirmar y que los extras de temporada no
 * rigen en octubre. O sea que el choque de hoy no existe, pero la razón por la
 * que el título manda sobre el tag no cambió: el cliente etiqueta como quiere
 * y nada impide que mañana vuelva a poner `happy-hour` en otro evento.
 *
 * El título es el criterio porque es lo único que distingue AL evento de los
 * que se le parecen, y el cliente lo escribe igual sin que nadie se lo pida.
 * ══════════════════════════════════════════════════════════════════════════
 */

/**
 * El respaldo, para cuando la base no contesta.
 *
 * ⚠️ ES EL DATO NUEVO, NO EL VIEJO. Un respaldo existe para que la página no
 * quede vacía, así que tiene que decir lo mismo que la base: si repitiera el
 * horario viejo, una caída de la base publicaría un dato equivocado, que es
 * peor que no publicar nada.
 *
 * ⚠️ HAY QUE ACTUALIZARLO SI EL CLIENTE CAMBIA EL EVENTO. Es el precio de
 * tener respaldo, y por eso es corto: cinco líneas que se leen de un vistazo.
 */
export const HAPPY_HOUR: HappyHour = {
  days: 'Saturday – Sunday',
  daysShort: 'Sat – Sun',
  time: '12 PM – 6 PM',
  deals: [
    { price: '$1 off', what: 'Drafts, bottles and cans' },
    { price: '$8', what: "Tito's, Captain, Crown's" },
    { price: '$10', what: 'Margaritas' },
  ],
  note: 'Superior Light Beer is the featured pour.',
};

/** Un renglón que arranca con un precio: `$1 off drafts…`, `$10 Margaritas`. */
const RENGLON_OFERTA = /^(\$\d+(?:\.\d{1,2})?(?:\s+off)?)\s+(.+)$/i;

/**
 * Arma el happy hour a partir del evento. `null` si el evento no está cargado,
 * para que el llamador caiga en el respaldo.
 */
function desdeEvento(e: VenueEvent): HappyHour {
  const renglones = e.body.flatMap((p) => p.split('\n')).map((l) => l.trim()).filter(Boolean);

  const deals: { price: string; what: string }[] = [];
  const sueltos: string[] = [];

  for (const renglon of renglones) {
    const m = RENGLON_OFERTA.exec(renglon);
    if (m) {
      // Mayúscula inicial: el cliente escribe «drafts» y el bloque lo muestra
      // como rótulo. No se toca nada más de lo que escribió.
      deals.push({ price: m[1], what: m[2].charAt(0).toUpperCase() + m[2].slice(1) });
    } else {
      sueltos.push(renglon);
    }
  }

  return {
    days: weekdaysLabel(e.weekdays),
    daysShort: weekdaysLabel(e.weekdays, true),
    time: `${formatTime(e.startTime)} – ${formatTime(e.endTime)}`,
    deals: deals.length > 0 ? deals : HAPPY_HOUR.deals,
    /*
     * ⚠️ EL PRIMER RENGLÓN SUELTO SE DESCARTA CUANDO ES LA BAJADA. El campo
     * descripción arranca con una frase de presentación —la que el calendario
     * usa como resumen— y esa frase no es una aclaración del bloque de
     * precios. Lo que queda después sí lo es.
     */
    note: sueltos.slice(1).join(' ') || null,
  };
}

/**
 * El happy hour vigente. Lo usan `/sunset-bar` y `/whats-on`, que son los dos
 * únicos lugares del sitio donde se publica (en el footer NO va: ver el tipo).
 */
export async function getHappyHour(): Promise<HappyHour> {
  const eventos = await getVenueEvents();
  const evento = eventos.find((e) => /happy\s*hour/i.test(e.title));
  return evento ? desdeEvento(evento) : HAPPY_HOUR;
}

/**
 * La frase de la píldora del hero: el TÍTULO del evento, «Weekend Happy Hour».
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ES EL TÍTULO Y NO «HAPPY HOUR + LOS DÍAS». Pedido de Camila, 2026-09-17:
 * «que la píldora diga el título del evento, no Happy hour Sat – Sun, porque
 * en tamaños chicos no sé si entra y no quiero que quede jamás en dos líneas».
 *
 * Y es más corto de las dos formas: «Weekend Happy Hour» son 18 caracteres
 * contra los 20 de «Happy hour Sat – Sun», y encima no crece cuando el evento
 * pasa a tres días.
 *
 * ⚠️ EL TOPE ES DURO Y ESTÁ MEDIDO. El peor caso del pill son ~22 caracteres
 * —la tabla de anchos está en `Hero.tsx`, y el renglón más angosto es el del
 * monitor grande, no el del teléfono—. Un título más largo que eso NO se
 * publica ahí: cae en «Happy hour», que entra siempre. Es la única forma de
 * garantizar el «jamás en dos líneas» cuando el texto lo escribe el cliente
 * en el dashboard y nadie lo revisa antes de que salga.
 *
 * ⚠️ VIVE ACÁ Y NO EN `Hero.tsx` por la misma razón que la frase de música
 * vive en `content/entertainment.ts`: el hero es un componente cliente y el
 * dato sale de la base, así que lo arma el servidor y baja por props.
 * ══════════════════════════════════════════════════════════════════════════
 */
const TOPE_PILL = 22;

export async function fraseHappyHour(): Promise<string> {
  const eventos = await getVenueEvents();
  const titulo = eventos.find((e) => /happy\s*hour/i.test(e.title))?.title;
  if (titulo && titulo.length <= TOPE_PILL) return titulo;
  return 'Happy hour';
}
