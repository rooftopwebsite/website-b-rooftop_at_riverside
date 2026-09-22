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

  /*
   * ══════════════════════════════════════════════════════════════════════
   * ⚠️ VA EN `bone`, LA MISMA SUPERFICIE DEL HERO, Y ESO ES EL PEDIDO.
   * Camila, 2026-09-22, con la captura de
   * `defoodtruckclub.nl/diensten/foodtruck-festivals`: «esta sección me
   * gustaría que la pongas igual que la refe, debajo de los heros».
   *
   * En la referencia la foto del hero y este bloque comparten el mismo panel
   * claro: la foto tiene las esquinas redondeadas y el texto cae abajo sin que
   * cambie el fondo, así que las dos cosas se leen como UNA portada. Con el
   * bloque en `paper` había un escalón justo debajo de la foto.
   *
   * ⚠️ DIJO «LOS HEROS», EN PLURAL, así que es una regla y no un arreglo de
   * una página: el bloque que cae debajo de un `PlateHero` comparte su
   * superficie. `/game-truck` recibió el mismo cambio en el mismo commit.
   *
   * ⚠️ Y ARRASTRA LA SECCIÓN SIGUIENTE. En `/our-story` lo que viene abajo es
   * la tira de cifras, que estaba en `bone`: con ésta también en `bone`
   * quedaban dos bandas del mismo color pegadas. La tira pasó a `paper` y la
   * ola que entra a la losa oscura se movió con ella.
   * ══════════════════════════════════════════════════════════════════════
   */
  return (
    <Section tone="bone" band="lg" labelledBy={id}>
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
          {/*
            ⚠️ EL TITULAR SUBIÓ A `d3/d2` (46 → 58px) EL 2026-09-22. En la
            referencia la columna izquierda es un rótulo GRANDE de dos o tres
            renglones y es la mitad del peso del bloque; a `d4/d3` quedaba del
            tamaño de un título de sección cualquiera y la prosa de al lado se
            lo comía.

            ⚠️ LA MEDIDA BAJÓ DE 14ch A 12ch para acompañar: a más cuerpo, menos
            caracteres por renglón, o el titular se estira y deja de leerse como
            una columna.
          */}
          <Heading level={2} id={id} className="max-w-[12ch] text-d3 lg:text-d2">
            A rooftop built over a food truck park
          </Heading>

          <div>
            {/*
              ⚠️ LA PROSA VA EN `intro` (25px) Y YA NO EN `lead` (22px), y los
              dos párrafos del bloque van al MISMO cuerpo. En la referencia este
              bloque es un solo párrafo grande, no una escalera de tamaños: el
              contraste lo hace el salto contra el titular, no un escalón
              interno de 22 a 17.
            */}
            <p className="m-0 max-w-[52ch] font-body text-intro font-light text-ink">
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
