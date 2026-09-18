import FeaturedEventCard, { type FeaturedDeal } from '@/components/shared/FeaturedEventCard';
import { Reveal } from '@/components/shared/Motion';
import Section from '@/components/shared/Section';
import { featuredEvent } from '@/content/events';

/**
 * ══════════════════════════════════════════════════════════════════════════
 * EL EVENTO DESTACADO DEL CALENDARIO, EN GRANDE.
 *
 * ⚠️ EXISTE PORQUE UNA PÁGINA SE CONVIRTIÓ EN UN EVENTO. `/nfc-north-hq` —los
 * domingos de fútbol— era una landing propia con su hero y sus 152 líneas.
 * Revisando qué páginas secundarias tiene que tener el sitio, Camila la mandó
 * al calendario: «domingos de fútbol debería ser un evento recurrente del
 * calendario». Y después puso la condición que hace que el cambio no sea una
 * degradación: «irán en calendario pero con un espacio o card grande, mucho
 * más destacada».
 *
 * ⚠️ ESTO ES LA BANDA, NO LA CARD. La card se mudó a
 * `shared/FeaturedEventCard` el 2026-09-17, cuando `/sunset-bar` pidió la misma
 * pieza debajo del happy hour: el mismo domingo se publicaba en dos páginas con
 * dos formas que no se parecían en nada. Lo que queda acá es lo propio de
 * `/whats-on`: buscar el destacado, darle su banda oscura y su `Reveal`.
 *
 * ⚠️ NO ES UNA LISTA, ES UNO SOLO. Si hubiera dos destacados a la vez, el
 * recurso deja de destacar: son dos cards grandes seguidas y el calendario
 * arranca con dos pantallas antes de la primera fecha. `featuredEvent()`
 * devuelve el PRIMERO que lleve el tag y nada más.
 *
 * ⚠️ QUIÉN ES EL DESTACADO SE DECIDE EN EL DASHBOARD, no acá: es el evento que
 * lleva el tag `featured`. El cliente puede cambiarlo sin tocar el código, que
 * es la razón por la que el dato vive en la base y no en un `const` de este
 * archivo.
 *
 * ⚠️ SI NADIE LLEVA EL TAG, ESTO NO RENDERIZA NADA. El calendario arranca
 * directamente por la lista, como antes. Un bloque vacío con un título sería
 * peor que no tener bloque.
 * ══════════════════════════════════════════════════════════════════════════
 */
export default async function FeaturedEvent({
  deals,
  dealsLabel,
}: {
  /** Las promos con precio que van en el lugar de la foto. Ver la card. */
  readonly deals?: readonly FeaturedDeal[];
  /** El rótulo del bloque. Va arriba de la lista. */
  readonly dealsLabel?: string;
} = {}) {
  const event = await featuredEvent();
  if (!event) return null;

  return (
    <Section tone="deep" band="md" labelledBy="featured-title">
      <Reveal>
        <FeaturedEventCard
          event={event}
          deals={deals}
          dealsLabel={dealsLabel}
          headingLevel={2}
          headingId="featured-title"
        />
      </Reveal>
    </Section>
  );
}
