import Section from '@/components/shared/Section';
import { Heading } from '@/components/shared/Type';
import { Reveal } from '@/components/shared/Motion';
import { PEOPLE, STORY_LEAD } from '@/content/people';
import { GIVE_BACK } from '@/content/story';

/**
 * El relato, en dos columnas: titular grande a la izquierda, prosa a la derecha.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ES EL SEGUNDO BLOQUE DE defoodtruckclub.nl/over-ons, CALCADO. Camila,
 * 2026-09-16: «de la misma forma debés tomarla para nuestra página de about».
 *
 * La composición de allá, que es la que se copia:
 *
 *   · columna izquierda: un titular de display de tres o cuatro renglones,
 *     corto de medida, que ocupa un tercio;
 *   · columna derecha: el relato, con el PRIMER párrafo un escalón más grande
 *     que los demás y los siguientes en cuerpo de texto;
 *   · nada más. Sin foto, sin botón, sin dato al costado.
 *
 * ⚠️ Y ES EL BLOQUE QUE MÁS FALTABA, que es lo que lo justifica más allá del
 * calco: `/our-story` no tenía UN SOLO PÁRRAFO de historia. Tenía el hero, la
 * grilla de espacios por piso, las dos personas, el mapa y el cierre. La
 * historia vivía en la bajada del hero y en ningún otro lado, o sea que la
 * página «nuestra historia» no contaba ninguna.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LOS TRES PÁRRAFOS SON DATO VERIFICADO Y NINGUNO ESTÁ ESCRITO POR MÍ.
 * Importa dejarlo asentado porque un bloque de prosa en una página «sobre
 * nosotros» es exactamente donde se cuela el relleno verosímil.
 *
 *   1. `STORY_LEAD` sale de la primera línea de `/this-is-us` del sitio
 *      vigente, con los hechos intactos —cuatro años de planificación, una
 *      familia local, Bonita Springs— y la sintaxis arreglada. La procedencia
 *      está anotada arriba de la constante.
 *
 *   2. La cita de Chris Magnus es TEXTUAL de `/this-is-us`. No se recorta ni
 *      se parafrasea: entra entera y entre comillas, con su nombre y su cargo.
 *
 *   3. El Charity Partner Program sale de `/giveback`, también del sitio
 *      vigente.
 *
 * ⚠️ Y EL TERCERO ARREGLA ALGO QUE ESTABA ROTO. `next.config.ts` manda
 * `/giveback` con un 301 a `/our-story`, y desde el rediseño esa redirección
 * aterrizaba en una página que no mencionaba el programa: quien buscaba
 * «giveback» terminaba en una página sobre otra cosa. El contenido estaba
 * guardado en `content/story.ts` esperando decisión, con la nota puesta. Acá
 * vuelve al render y el 301 vuelve a tener sentido.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ NO SE INVENTA LA FECHA DE APERTURA NI EL NOMBRE DE LA FAMILIA. Los dos
 * datos existen en el brief, pero el relato de esta página no los necesita para
 * funcionar y cada afirmación de más es una que hay que verificar. Si el cliente
 * confirma la fecha, entra como un cuarto párrafo.
 */
export default function AboutStory({ id = 'story-title' }: { readonly id?: string }) {
  const chris = PEOPLE[0];

  return (
    <Section tone="paper" band="lg" labelledBy={id}>
      <Reveal>
        {/*
          ⚠️ UN TERCIO Y DOS TERCIOS, Y NO MITADES. Es la proporción de la
          referencia y es la que hace que el titular se lea como un rótulo del
          bloque en vez de como una columna de contenido: a mitades, cuatro
          renglones de display a 46px compiten con la prosa de al lado.

          ⚠️ `items-start` y no `items-center`: los dos bloques tienen que
          arrancar en la misma línea de base de arriba. Centrados, el titular
          —que es más corto— queda flotando a media altura del párrafo.
        */}
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.9fr)] lg:gap-20">
          <Heading level={2} id={id} className="max-w-[14ch] text-d4 lg:text-d3">
            A rooftop built over a food truck park
          </Heading>

          <div>
            {/*
              EL PRIMER PÁRRAFO VA UN ESCALÓN MÁS GRANDE, que es el recurso de
              la referencia: `text-lead` son 22px contra los 17 del cuerpo. Es
              lo que hace que el bloque tenga una entrada y no sea un muro.
            */}
            <p className="m-0 max-w-[58ch] font-body text-lead font-light leading-[1.55] text-ink">
              {STORY_LEAD}
            </p>

            {/*
              LA CITA. Va como `<blockquote>` y con `<cite>`, no como un
              párrafo entre comillas: es palabra de una persona identificada y
              la estructura tiene que decirlo. El filete naranja de la
              izquierda es el mismo recurso que el CTA de texto del sitio.
            */}
            <figure className="m-0 mt-9 border-l-2 border-sunset pl-6">
              <blockquote className="m-0">
                <p className="m-0 max-w-[56ch] font-display text-d5 font-bold uppercase leading-[1.1] text-ink">
                  {chris.quote}
                </p>
              </blockquote>
              <figcaption className="mt-4 font-body text-caption font-bold uppercase tracking-eyebrow text-muted">
                <cite className="not-italic">{chris.name}</cite>, {chris.role}
              </figcaption>
            </figure>

            {/*
              EL TERCER PÁRRAFO: el programa de donaciones. Ver la nota de
              arriba sobre el 301 de `/giveback`.

              ⚠️ LOS TRES MONTOS SE LEEN DE `GIVE_BACK.tiers` y no se escriben
              acá. Si el cliente cambia los importes, se cambian en un lado.
            */}
            <div className="mt-10 border-t border-fog pt-8">
              <Heading level={3} className="text-d6">
                {GIVE_BACK.title}
              </Heading>
              <p className="m-0 mt-3.5 max-w-[62ch] font-body text-base font-light leading-[1.6] text-body">
                {GIVE_BACK.body}
              </p>
              <ul className="m-0 mt-5 flex list-none flex-wrap gap-2 p-0">
                {GIVE_BACK.tiers.map((monto) => (
                  <li
                    key={monto}
                    className="rounded-pill bg-cream px-3.5 py-1 font-display text-d7 font-bold tabular-nums text-deep"
                  >
                    ${monto}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
