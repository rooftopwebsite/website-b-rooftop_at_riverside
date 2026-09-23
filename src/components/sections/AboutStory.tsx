import IntroSplit from '@/components/shared/IntroSplit';
import { STORY_LEAD } from '@/content/people';

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
 * ⚠️ LOS DOS PÁRRAFOS SON DATO VERIFICADO Y NINGUNO ESTÁ ESCRITO POR MÍ.
 * Importa dejarlo asentado porque un bloque de prosa en una página «sobre
 * nosotros» es exactamente donde se cuela el relleno verosímil. `STORY_LEAD`
 * sale de la primera línea de `/this-is-us` del sitio vigente, con los hechos
 * intactos —cuatro años de planificación, una familia local, Bonita Springs— y
 * la sintaxis arreglada; el segundo párrafo es la bajada que tenía el hero,
 * que a su vez no afirma nada que el resto del sitio no diga.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ⚠️ QUÉ SE FUE DE ACÁ EL 2026-09-22, y los dos por pedido de Camila sobre la
 * captura de la página:
 *
 *   · LA CITA DE CHRIS MAGNUS. «La frase pongámosla en una sección separada,
 *     con fondo distintivo y que tenga mucho espacio para que destaque». No se
 *     perdió: es la sección propia que `/our-story` monta justo debajo de este
 *     bloque, y sigue siendo textual de `/this-is-us`.
 *
 *   · EL CHARITY PARTNER PROGRAM. «La parte de beneficencia eliminémosla».
 *
 *     ⚠️ ESO REABRE UN PROBLEMA CONOCIDO: `next.config.ts` manda `/giveback`
 *     con un 301 a `/our-story`, así que esa redirección vuelve a aterrizar en
 *     una página que no menciona el programa. Es exactamente el estado del que
 *     este bloque venía a sacarnos. El contenido queda guardado en
 *     `content/story.ts` —con su nota— y la decisión sobre el 301 queda
 *     abierta: repuntarlo a la home, darle ruta propia, o dejarlo así.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ NO SE INVENTA LA FECHA DE APERTURA NI EL NOMBRE DE LA FAMILIA. Los dos
 * datos existen en el brief, pero el relato de esta página no los necesita para
 * funcionar y cada afirmación de más es una que hay que verificar. Si el cliente
 * confirma la fecha, entra como un cuarto párrafo.
 */
export default function AboutStory({ id = 'story-title' }: { readonly id?: string }) {

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
    /*
      ⚠️ ARRIBA VA UN ESCALÓN MÁS CHICO (`bandTop="sm"`), desde el 2026-09-23.
      Camila: «reducí el espacio entre esta sección y el hero, que estén casi
      pegados, sólo que no se vea apenas entrás a la página». El hero ya deja
      ~40px de fondo visibles debajo de la foto en la primera pantalla y su
      propio `pb` sigue abajo, así que con 48 a 64px de acá el titular sigue
      cayendo fuera del primer vistazo.
    */
    <IntroSplit id={id} title="A rooftop built over " accent="a food truck park">
            {/*
              ⚠️ LA PROSA VA EN `intro` (25px) Y YA NO EN `lead` (22px), y los
              dos párrafos del bloque van al MISMO cuerpo. En la referencia este
              bloque es un solo párrafo grande, no una escalera de tamaños: el
              contraste lo hace el salto contra el titular, no un escalón
              interno de 22 a 17.
            */}
            {/*
              ⚠️ EL PRIMER PÁRRAFO ERA LA BAJADA DEL HERO Y AHORA ABRE ACÁ.
              Camila, 2026-09-22: «unifica el párrafo con la bajada del hero
              para unirlas y tratarlo como en "Dentro del camión" de la página
              game truck».

              Es el mismo movimiento que ya recibió `/game-truck` el mismo día,
              y por el mismo motivo: la bajada y este párrafo decían los mismos
              hechos a una pantalla de distancia. El hero decía «one local
              family, a corner of Old 41 across from Riverside Park, and a bar
              built on the roof of a yard with four independent kitchens» y este
              bloque abría con «four years of planning, one local family, and a
              corner of Old 41…». Dos veces la familia, dos veces la esquina.

              ⚠️ NO SE PERDIÓ UN SOLO HECHO. Lo que la bajada tenía y
              `STORY_LEAD` no —el parque enfrente, el bar sobre el patio, las
              cuatro cocinas independientes— está en la segunda oración, que es
              nueva sólo en el orden de las palabras.

              ⚠️ EL HERO QUEDA SIN BAJADA, que es la forma de la referencia:
              foto, y el texto recién abajo. `PlateHero` ya lo contempla —el
              hueco es condicional— y `/sunset-bar` y `/game-truck` abren igual.
            */}
            <p className="m-0 max-w-[52ch] font-body text-intro font-light text-ink">
              {STORY_LEAD}
            </p>

            <p className="m-0 mt-8 max-w-[52ch] font-body text-intro font-light text-ink">
              What went up on that corner is a bar on the roof of a yard with four independent
              kitchens in it, across the street from Riverside Park.
            </p>
    </IntroSplit>
  );
}
