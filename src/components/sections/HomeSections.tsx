import { ArrowLink } from '@/components/shared/Button';
import { Marquee, RevealItem, StaggerGroup } from '@/components/shared/Motion';
import { type Step } from '@/components/shared/StepStair';
import Section, { GUTTER } from '@/components/shared/Section';
import { Heading, SectionHead } from '@/components/shared/Type';
import { HAPPY_HOUR } from '@/lib/brand';

/*
 * ⚠️ SE LIMPIARON ONCE IMPORTS SIN USAR, y no eran todos míos: `Link`,
 * `CSSProperties`, `TilePattern`, `Eyebrow`, `ButtonLink`, `PhotoPending`,
 * `recurringEvents`, `whenLabel`, `addressLine`, `mapsUrl` y `BRAND` venían de
 * versiones anteriores de secciones que ya no viven en este archivo. `Image`,
 * `RevealMedia` y el default de `StepStair` quedaron sin usar al cambiar «How
 * this place works» a la cuarta forma.
 *
 * TypeScript no marca un import sin usar como error, así que se acumulan en
 * silencio. Se detectan con `grep` del identificador contra su uso en código —
 * no con el build.
 *
 * ⚠️ De `StepStair` se sigue importando el TIPO `Step`: los datos de los pasos
 * mantienen esa forma, y el componente sigue existiendo para cuando se quiera
 * volver a la escalera.
 */

/* ==========================================================================
   How this place works — el módulo que desarma la confusión
   ========================================================================== */

/**
 * ⚠️ Las etiquetas de cada paso son datos YA confirmados en otro lado del
 * sitio: los cuatro camiones, el happy hour de `HAPPY_HOUR`, las cinco noches
 * de música. No hay ni un dato nuevo acá. Este módulo explica, no anuncia.
 */
const STEPS: readonly Step[] = [
  {
    n: '01',
    title: 'Order at whichever window you want',
    body: 'Four trucks park in the yard and each one is somebody’s own business. You order at the window, you pay that truck. Separate line, separate card, separate receipt.',
    tags: ['Four independent kitchens', 'Order at the window', 'A tab per truck', 'No table service'],
  },
  {
    n: '02',
    title: 'Get your drinks upstairs',
    body: 'The Sunset Bar on the roof is ours. Cocktails made that morning, drafts from breweries twenty minutes away. It’s the one tab we run, and the only menu on this site with prices.',
    tags: ['Cocktails made daily', 'Local drafts', `Happy hour ${HAPPY_HOUR.days}, ${HAPPY_HOUR.time}`, 'The one tab we run'],
  },
  {
    n: '03',
    title: 'Stay for whoever’s playing',
    body: 'Live music five nights a week, Bingo on Wednesdays, DJ sets late on Saturdays. Almost all of it is free and none of it needs a ticket.',
    tags: ['Live music five nights', 'Bingo Wednesdays', 'DJ sets Saturdays', 'No ticket, no cover'],
  },
];

/**
 * El color de cada cuadro, y NO es una elección decorativa.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LOS TRES CUADROS SON LAS TRES HORAS DEL DÍA, EN ORDEN.
 *
 * La secuencia de los pasos ya es temporal: primero comés (tarde), después
 * subís a la barra (atardecer), después te quedás a la música (noche). Los
 * colores la siguen:
 *
 *     01 · pedir      `cream`   el amarillo del mediodía
 *     02 · subir      `sunset`  la hora dorada — y la barra se llama Sunset Bar
 *     03 · quedarse   `deep`    la noche
 *
 * Es la misma idea que sostiene toda la rama: el sitio es la HORA, no el
 * lugar. Acá la paleta cuenta el mismo relato que el texto en lugar de
 * decorarlo, y eso es lo que separa tres cuadros de color de tres muestras de
 * pintura.
 *
 * ⚠️ Y ADEMÁS ES LO QUE MANTIENE EL PRESUPUESTO DE SUPERFICIE. Tres cuadros
 * altos son ~6 % de la página. Los tres del mismo color habrían empujado ese
 * color solo fuera de su techo —`deep` estaba en 18,6 % y el objetivo es
 * 20-25 %; `cream` y `sunset` tienen techo de 5 %—. Repartidos, cada uno suma
 * ~2 %: `deep` queda en ~21 %, `cream` en ~2,5 % y `sunset` en ~2,5 %. Los
 * tres adentro.
 *
 * ⚠️ El texto de cada cuadro NO es intercambiable, y los ratios están medidos
 * en `design-audit/CONTRASTE.md`: negro sobre `cream` da 18.30:1 y sobre
 * `sunset` 8.26:1 —encima del naranja el blanco daría 2.54:1 y está
 * prohibido—; sobre `deep` va `paper`, 10.83:1.
 * ══════════════════════════════════════════════════════════════════════════
 */
const CUADROS = [
  {
    campo: 'bg-cream',
    texto: 'text-ink',
    /* La greca en el verde de marca sobre el amarillo: 9.44:1, así que la
       trama se ve sin tapar el texto. La opacidad la pone la clase. */
    trama: 'text-deep/15',
    hora: 'Afternoon',
  },
  {
    campo: 'bg-sunset',
    texto: 'text-ink',
    trama: 'text-ink/15',
    hora: 'Golden hour',
  },
  {
    campo: 'bg-deep',
    texto: 'text-paper',
    trama: 'text-cream/20',
    hora: 'Night',
  },
] as const;

/**
 * El módulo que desarma la confusión, contado como una ESCALERA.
 *
 * ⚠️ TERCERA forma. Fueron tres columnas en paralelo, después una lista fijada
 * que abría un paso por vez con el scroll, y ahora una escalera con los tres
 * pasos abiertos. La referencia la mandó Camila: for-living.it, el bloque «We
 * handle all the complexity».
 *
 * Por qué la escalera gana a la lista fijada, que es lo que reemplaza:
 *
 *   · **El orden se ve de una.** Primero pedís, después subís, después te
 *     quedás. Una escalera dice «esto va en orden» de un vistazo; la lista
 *     fijada obligaba a scrollear tres pantallas para descubrir que había un
 *     orden.
 *   · **Devuelve 2,3 pantallas.** A 42vh por paso la sección medía 2.226px en
 *     un viewport de 900 — casi un tercio del recorrido de la home para tres
 *     párrafos cortos.
 *
 * Ver `StepStair` para la geometría y para qué pasa en mobile.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ DEJÓ DE SER LA LOSA OSCURA — `redesign/light-tropical`.
 *
 * Era `tone="deep"` y medía **1.430px**: la superficie oscura más grande del
 * sitio, y con la escalera diagonal dejando dos tercios de la grilla vacíos era
 * también el agujero más grande de la home — 1.430px de verde para tres
 * párrafos cortos.
 *
 * Ahora es `bone`, la segunda superficie clara. Dos cosas lo justifican:
 *
 *   · **Esta sección EXPLICA.** Es el módulo que desarma la confusión de quién
 *     te cobra qué. Un explicador tiene que ser el bloque más callado de la
 *     página, y una losa oscura a pantalla completa es lo contrario.
 *   · **El presupuesto de oscuro se gasta donde factura.** Queda para la banda
 *     de Events y el footer. Dos zonas, nunca dos seguidas.
 *
 * ⚠️ Y EL HUECO DE LA DIAGONAL SE LLENA CON UNA FOTO REAL. Es una de las dos
 * únicas fotografías que la home puede tener: mapeadas las 22 del proyecto,
 * la entrega nueva trae algo mejor: `truck-window-night.jpg` es la ventanilla
 * de un truck de noche con gente pidiendo, o sea LITERALMENTE lo que dice el
 * paso 01 («order at whichever window you want»). Reemplaza a
 * `venue-truck-line.jpg`, que era una fila de camiones vacía.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ El encabezado ya NO va en una columna al costado. Con la lista fijada eran
 * dos columnas —el título quieto a la izquierda, los pasos a la derecha—
 * porque el título tenía que acompañar tres pantallas de recorrido. La escalera
 * necesita el ancho completo para desplegar la diagonal, así que el título pasa
 * arriba, que es además como está en la referencia.
 */
export function HowThisPlaceWorks() {
  return (
    <Section tone="bone" bandTop="lg" bandBottom="lg" labelledBy="how-title">
      {/*
        ══════════════════════════════════════════════════════════════════════
        ⚠️ CUARTA FORMA de este módulo, y la pidió Camila con una referencia:
        columna de texto a la izquierda y tres cuadros altos a la derecha, «en
        lugar de fotos que sean cuadros de color con textura».

        Las tres anteriores: tres columnas en paralelo, una lista fijada que
        abría un paso por vez con el scroll, y la escalera diagonal.

        ⚠️ `StepStair` NO SE BORRA. Sigue en el árbol, con su geometría de
        grilla N×N y su slot de media: es la tercera forma y puede volver. Lo
        que cambia es que la home ya no la importa. Ver el encabezado del
        componente.

        ⚠️ LA REFERENCIA QUE MANDÓ ES LA QUE YO HABÍA DESCARTADO, y conviene
        decirlo. En `design-audit/MOODBOARD.md` tiré `IMG_2907` —la plantilla de
        viajes con marca de agua «Modificado por IA»— por ser el kit por
        defecto: hero con buscador, fila de íconos, tres tarjetas de foto
        idénticas. La estructura de esta sección es justamente ese bloque de
        tres tarjetas.

        Qué la saca del molde acá, y no es una excusa: **no hay fotos**. Lo que
        hace genérico a ese bloque es que tres fotos de stock recortadas igual
        no dicen nada; tres campos de color con la greca del brand book y las
        tres horas del día dicen exactamente lo que dice el texto. La
        estructura es la misma, el contenido es nuestro.
        ══════════════════════════════════════════════════════════════════════
      */}
      <div className="caja grid gap-y-11 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.6fr)] lg:items-start lg:gap-x-14">
        {/* ── La columna de texto ─────────────────────────────────────────
            ⚠️ Sin eyebrow. «How this place works» sólo repetía en versalitas
            lo que el h2 dice mejor, y era uno de los 14 que tenía la home
            contra los 3 que permite el brief.

            `lg:sticky` la deja quieta mientras pasan los cuadros: la columna
            mide bastante menos que la fila de tres, así que sin esto queda un
            hueco largo debajo del CTA. */}
        <div className="lg:sticky lg:top-30">
          <SectionHead
            id="how-title"
            title={
              <>
                Five businesses, <br className="hidden sm:block" />
                one set of stairs.
              </>
            }
            lead="It catches people out the first time, so here it is plainly."
          />

          {/* El enlace va al pie de la columna y no dentro de un cuadro: los
              tres son la secuencia y meter una salida en el medio invita a
              abandonarla antes de terminar de leerla. */}
          <ArrowLink href="/the-yard" className="mt-8">
            See how the yard is laid out
          </ArrowLink>
        </div>

        {/* ── Los tres cuadros ────────────────────────────────────────────
            ⚠️ En MOBILE no se apilan en una columna de tres cuadros altos: eso
            daría tres pantallas seguidas de campo de color. Se vuelven una
            fila que se desliza, con el mismo `snap` que el resto del sitio.

            ⚠️ `StaggerGroup` acá y no un `Reveal` por cuadro: son tres piezas
            equivalentes de una lista, así que el desfasaje es el mecanismo que
            corresponde. Y ninguna lleva `RevealMedia` adentro — ver la nota de
            propagación de variantes en `Motion.tsx`. */}
        {/*
          ⚠️ `tabIndex={0}` y `aria-label`, y los encontró `npm run a11y`: una
          región que se puede scrollear pero no tiene nada enfocable adentro es
          contenido que EXISTE y no se puede alcanzar con teclado. Los tres
          cuadros son texto, no links, así que sin esto el segundo y el tercero
          quedaban inaccesibles en mobile — donde esto es un track.

          Es el mismo remedio que ya usan las columnas de `VideoWall`, por el
          mismo motivo.

          ⚠️ El costo: en desktop, donde deja de ser scrolleable y pasa a ser
          una grilla de tres, queda una parada de tabulación que no lleva a
          ninguna parte. Es preferible a que dos tercios del contenido sean
          inalcanzables, y no se puede condicionar por breakpoint sin mover la
          decisión al cliente.
        */}
        <StaggerGroup
          as="ul"
          tabIndex={0}
          aria-label="How this place works, in three steps"
          className="-mx-gutter flex snap-x snap-mandatory gap-4 overflow-x-auto px-gutter pb-2 md:-mx-gutter-lg md:px-gutter-lg lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:px-0"
        >
          {STEPS.map((paso, i) => {
            const c = CUADROS[i];
            return (
              <RevealItem
                as="li"
                key={paso.n}
                className="w-[78vw] shrink-0 snap-start sm:w-[52vw] lg:w-auto"
              >
                <div
                  className={`relative flex h-full min-h-115 flex-col justify-end overflow-hidden rounded-image p-5.5 lg:min-h-130 lg:p-6.5 ${c.campo} ${c.texto}`}
                >
                  {/* ⚠️ LA TEXTURA. La greca del brand book como máscara, así
                      que su color sale de `currentColor` —el `text-*` de la
                      clase— y no hay un hex suelto. Ver la utilidad `greca` en
                      globals.css.

                      ⚠️ Va al 15-20 % y no más. Es una TRAMA de fondo: por
                      encima de eso empieza a competir con el texto que va
                      apoyado sobre ella, y el contraste deja de ser el del
                      campo de color y pasa a ser un color compuesto que la
                      tabla no puede prever. */}
                  <div
                    aria-hidden="true"
                    className={`greca pointer-events-none absolute inset-0 ${c.trama}`}
                  />

                  {/* El número y la hora, arriba. Es la píldora de
                      `IMG_2909`: clasifica el peldaño sin ocupar un renglón de
                      título. */}
                  <div className="relative flex items-center gap-2.5">
                    <span className="font-body text-micro font-medium tabular-nums tracking-eyebrow">
                      {paso.n}
                    </span>
                    <span className="h-px flex-1 bg-current opacity-30" />
                    <span className="eyebrow">{c.hora}</span>
                  </div>

                  <div className="relative mt-auto pt-30">
                    <Heading level={3}>{paso.title}</Heading>
                    <p className="mt-3 max-w-[34ch] text-base">{paso.body}</p>
                  </div>
                </div>
              </RevealItem>
            );
          })}
        </StaggerGroup>
      </div>
    </Section>
  );
}

/* ==========================================================================
   Reviews — ESCRITO Y SIN USAR, a propósito
   ========================================================================== */

/**
 * ⚠️ NO SE MONTA. El brief: «No montes módulo de reviews. Los ratings del
 * cliente no están confirmados. Dejá el componente escrito y sin usar.»
 *
 * Queda acá listo para cuando se confirmen. No se importa en ninguna página.
 * El día que se use hay que traer las reviews de una fuente real —Google o
 * Yelp— y nunca escribirlas a mano.
 */
export function ReviewsMarquee({
  reviews,
}: {
  readonly reviews: readonly { quote: string; author: string; source: string }[];
}) {
  if (reviews.length === 0) return null;

  return (
    <Section band="lg" labelledBy="reviews-title" width="full" className="px-0">
      <div className={GUTTER}>
        <div className="caja">
          <SectionHead
            eyebrow="What people say"
            id="reviews-title"
            title="Don't take our word for it"
          />
        </div>
      </div>
      <Marquee durationSeconds={45} className="mt-10" itemClassName="gap-5 pr-5">
        {reviews.map((r, i) => (
          <figure
            key={i}
            className="flex w-85 shrink-0 flex-col rounded-card border border-ink/12 p-6"
          >
            <blockquote className="flex-1 text-base leading-[1.65]">{r.quote}</blockquote>
            <figcaption className="mt-4 eyebrow text-body/75">
              {r.author} · {r.source}
            </figcaption>
          </figure>
        ))}
      </Marquee>
    </Section>
  );
}

/*
 * ⚠️ Acá había un `export { PhotoPending }` — un re-export de conveniencia para
 * que la home pudiera importar el placeholder desde este archivo. Se fue: nadie
 * lo usaba por esta puerta, y un re-export sin consumidores es una dependencia
 * falsa entre dos módulos que no tienen nada que ver. Quien necesite
 * `PhotoPending` lo importa de `shared/PendingData`, que es donde vive.
 */
