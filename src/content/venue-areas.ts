import type { VenueArea } from '@/types/content';

/**
 * De qué está hecho el lugar, recorrido de arriba hacia abajo.
 *
 * ⚠️ NO es `content/spaces.ts`. Ese archivo lista lo ALQUILABLE, con capacidad
 * y precio, y lo consume `/events`. Éste lista lo que alguien recorre cuando
 * viene un miércoles cualquiera. Por eso acá está el escenario, que no se
 * alquila suelto, y no está el Full Buyout, que se alquila y no es un lugar.
 *
 * ⚠️ Los dos nombres nuevos salen del rebrand que el cliente confirmó en el
 * check-in del 9 de septiembre de 2026: la cancha exterior pasa a llamarse
 * **the Yard** y se está cerrando con reja para habilitar eventos con entrada
 * paga, y el bar de arriba pasa a llamarse **Sunset Bar**, que queda como el
 * nombre oficial para todo uso externo.
 *
 * ⚠️ EL ESCENARIO ESTÁ ABAJO, en el patio, no en el rooftop. Lo dicen
 * `spaces.ts` («the open yard where the trucks park and the stage goes up») y
 * `event-types.ts`. Es el dato más fácil de equivocar al escribir esta página.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LOS CINCO `body` TIENEN UN TOPE DE LARGO Y ES UN CONTRATO CON LA FORMA.
 * Camila, 2026-09-22: «que el copy de cada uno no supere las dos líneas en
 * desk». `VenueTabs` los publica en `text-base` con medida de 62ch, o sea unos
 * 70 caracteres por renglón: **el tope son ~140 caracteres**. Pasado eso el
 * párrafo salta a tres renglones y el bloque de texto empuja los links fuera
 * de su línea. Estaban entre 178 y 273.
 *
 * ⚠️ QUÉ SE RECORTÓ, para que nadie lo reponga sin darse cuenta de que rompe
 * la forma. Nada de esto se perdió del sitio: cada dato sigue publicado en la
 * página a la que el propio acordeón manda con su link.
 *
 *   · Sunset Bar: los cócteles hechos a la mañana y los drafts de cervecerías
 *     a veinte minutos. Los dos están en `/sunset-bar` y en `YardSteps`.
 *   · El patio: «under the sky» y «nobody wants to leave», que repetían en
 *     otras palabras lo que ya dicen «open air» y «when the bar inside is
 *     full».
 *   · El escenario: «without renting a single thing in» pasa a «rents nothing
 *     in», que dice lo mismo en cinco palabras menos.
 *   · El Yard: los tres ejemplos de qué se puede vender con entrada —festival,
 *     benefit, show con asientos—. Los tres están en `spaces.ts` y en
 *     `event-types.ts`, que es de donde los toma `/events`.
 *   · El food truck park: «takes its own orders», que queda dicho por «keeps
 *     its own register», y «parked in the yard underneath all of it», que es
 *     justo lo que la foto del panel muestra.
 * ══════════════════════════════════════════════════════════════════════════
 */
export const VENUE_AREAS: readonly VenueArea[] = [
  {
    slug: 'sunset-bar',
    name: 'Sunset Bar',
    floor: 'Second floor',
    body: 'The bar on the roof, facing west over Riverside Park. The only thing here we make ourselves, and the one tab in the building that is ours.',
    photo: '/images/venue/wall-bartender.webp',
    photoAlt: 'A bartender making a drink behind the bar at Rooftop at Riverside',
    photoBrief:
      "La barra de arriba entera al atardecer, con la vista al oeste detrás.",
    href: '/sunset-bar',
  },
  {
    slug: 'the-patio',
    name: 'The rooftop patio',
    floor: 'Second floor',
    body: 'Open air, with the rooftop bar at your back and the yard two stories below. Where a group ends up when the bar inside is full.',
    // TODO: confirmar con cliente. No hay ninguna foto del patio de arriba en
    // la entrega del 2026-09-10: las 36 son de la barra o del patio de abajo.
    photo: null,
    photoAlt: null,
    photoBrief:
      "El patio de arriba al aire libre, con mesas y gente, mirando hacia el patio de abajo.",
  },
  {
    slug: 'the-stage',
    name: 'The stage',
    floor: 'Ground floor',
    // ⚠️ El número de noches se saca del texto: no está confirmado. Ver
    // `content/entertainment.ts`.
    body: 'Live music down in the yard where the trucks are. Sound and stage are already there, so a band, an auction or a speaker rents nothing in.',
    photo: '/images/venue/wall-live-music-tent.webp',
    photoAlt: 'A musician playing under the tent in the yard',
    photoBrief:
      "El escenario armado con una banda tocando y gente mirando.",
    href: '/whats-on',
  },
  {
    slug: 'the-yard',
    name: 'The Yard',
    floor: 'Ground floor',
    body: 'The open yard that holds the trucks, the stage and the tables. It is being gated, turning an open lot into a room you can sell a ticket to.',
    photo: '/images/venue/wall-yard-night-table.webp',
    photoAlt: 'A group at a table in the yard at night, with the food trucks lit up behind them',
    photoBrief:
      "El patio cerrado con la reja puesta, de noche, durante un show con entrada.",
  },
  {
    slug: 'food-truck-park',
    name: 'The food truck park',
    floor: 'Ground floor',
    body: 'Four kitchens, four independent businesses. Each sets its own menu and keeps its own register. We give them the yard and the crowd.',
    photo: '/images/venue/wall-truck-window-day.webp',
    photoAlt: 'People ordering at a food truck window in the yard during the day',
    photoBrief:
      "Los cuatro trucks estacionados en fila, con los carteles legibles.",
    href: '/food-trucks',
  },
];
