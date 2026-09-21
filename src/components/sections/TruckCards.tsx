import Image from 'next/image';
import { ArrowUpRight } from '@/components/shared/Icon';
import { PhotoPending } from '@/components/shared/PendingData';
import Section from '@/components/shared/Section';
import { SectionHead } from '@/components/shared/Type';
import MenuPdfDialog from '@/components/shared/MenuPdfDialog';
import { cartasDeTrucks } from '@/content/menus';
import { nombreVisible } from '@/content/trucks';
import { HOURS } from '@/content/hours';

/**
 * Las cuatro tarjetas de food truck. Es TODO lo que hay de cada uno.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LAS FICHAS POR TRUCK SE FUERON, Y ES UN CAMBIO DE ALCANCE PEDIDO. Camila,
 * 2026-09-16: «cada food truck no tendrá su página. Haremos una única con los 4
 * food truck, cada uno en una card o algo así, con una descripción pero mínima
 * tipo bajada de card y un CTA que derive a un menú PDF».
 *
 * Así que `/food-trucks/[slug]` deja de existir y las cuatro URLs redirigen acá
 * con 301. El template que tenían —hero del disco, ficha en banda oscura, carta
 * en tarjetas de plato— NO se borró: Camila lo pidió expresamente para
 * `/game-truck`, y desde el 2026-09-16 esa página lo usa. El hero es
 * `shared/DiscHero` y la ficha oscura es `sections/SpecSlab`; los dos se
 * mudaron ahí, ya sin nada que sepa de trucks. `TruckMenu` sigue esperando: es
 * la carta de platos desde la base, y un gaming truck no tiene.
 *
 * ⚠️ Y TIENE SENTIDO MÁS ALLÁ DEL PEDIDO. Una ficha por truck necesita ocho
 * fotos, una historia larga, una carta y un horario propio POR truck. De los
 * nuestros tenemos una foto, un párrafo y, en dos de cuatro, una carta. Cuatro
 * páginas con tres datos cada una son cuatro páginas flacas; cuatro tarjetas con
 * tres datos cada una son una página completa.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ EL CTA ABRE EL PDF DE LA BASE, Y DURANTE CINCO DÍAS ABRIÓ UN JPG. El
 * pedido original —2026-09-16— decía PDF y no había ninguno: el sitio vigente
 * publica cada carta como IMAGEN dentro de la página del truck, así que se
 * bajaron a `public/menus/` y el CTA abría eso, en dos de los cuatro trucks. El
 * 2026-09-21 el cliente subió las cuatro cartas al dashboard: «en la base de
 * datos ya actualicé los menús, están subidos los PDF, conectá cada card con su
 * menú de la base de datos».
 *
 * Ahora la fuente es la base —ver `getMenuPdfs` y `menuDeTruck`— y el JPG queda
 * de respaldo para el caso en que la base no conteste. Y el PDF se abre en un
 * diálogo sobre la página, no en una pestaña: «debe abrirse cada PDF como se
 * abre el de Sunset Bar». Ver `shared/MenuPdfDialog`.
 *
 * ⚠️ NO HAY CTA A INSTAGRAM, aunque de El Chilango lo tengamos. Pedido de
 * Camila: la tarjeta cierra con una sola acción. Dos links juntos al pie —uno
 * relleno y uno de texto— hacen que el ojo tenga que elegir justo donde la
 * tarjeta debería empujar a una sola cosa. El dato queda en `trucks.ts` para
 * cuando haga falta.
 */
/**
 * ══════════════════════════════════════════════════════════════════════════
 * EL TOLDO que corona cada tarjeta de truck.
 *
 * Pedido de Camila, 2026-09-17: que las tarjetas lleven «un tildito, típico de
 * los íconos que representan una tienda», y que no dé sensación de aniñado. El
 * ícono de referencia es el de Google Business: una casilla con el toldo
 * arriba. Con él, la tarjeta de un negocio que no tiene local pasa a tener
 * frente.
 *
 * ⚠️ EL 2026-09-21 PASÓ DE SER UN RECORTE A SER UNA PIEZA, en tres pedidos
 * seguidos de Camila sobre la página:
 *
 *   1. «que el toldo esté por fuera de la card, como sobre ella no dentro de
 *      ella, y que tenga color, para que sean vistosos» → salió del `article`,
 *      que es `overflow-hidden`, y pasó a colgar del `<li>`.
 *   2. «que sea más alto y no recto, arriba más angosto, y el alto debe tapar
 *      el radius de las esquinas superiores» → trapecio de 60px.
 *   3. «que tenga dos colores, usemos los verdes; que las puntas sean
 *      redonditas y que las esquinas derechas no se corten» → esto.
 *
 * ⚠️ LAS RAYAS SON DOS VERDES DE LA PALETA, `deep` y `teal600`. Las rayas
 * estuvieron descartadas hasta hoy —«cuatro toldos a rayas son una calesita»—
 * y lo que las hace funcionar ahora es el par elegido: dos tonos del MISMO
 * color, uno oscuro y uno medio, que a distancia se leen como un toldo con
 * volumen y no como una guirnalda. El naranja quedó libre para el CTA, que es
 * lo único que hay que apretar en la tarjeta.
 *
 * ⚠️ LAS RAYAS SE ESTIRAN, NO SE RECORTAN, y ése es el arreglo de «las esquinas
 * derechas no se cortan». Antes el dibujo era un patrón de 26px recortado con
 * `slice` a lo ancho de la tarjeta: la última punta caía donde caía y quedaba
 * cortada al medio contra el borde derecho. Ahora son SIEMPRE diez rayas
 * iguales con `preserveAspectRatio="none"`, así que la primera empieza exacta
 * en el borde izquierdo y la décima termina exacta en el derecho, en cualquier
 * ancho de pantalla.
 *
 * ⚠️ Y POR ESO LAS PUNTAS SON REDONDAS SIEMPRE: el alto del SVG está fijo en
 * píxeles, así que el estirado es sólo horizontal y la profundidad del arco no
 * cambia. Una raya más ancha da una punta más ancha, no una punta chata.
 * ══════════════════════════════════════════════════════════════════════════
 */
const TOLDO = {
  /**
   * Cuántas rayas tiene el toldo, siempre.
   *
   * ⚠️ ES UN NÚMERO PAR A PROPÓSITO. Con impar, la primera y la última raya son
   * del mismo color y el toldo se ve desbalanceado contra la tarjeta.
   *
   * ⚠️ Y SON DIEZ PORQUE ES LO QUE DA UNA RAYA DE ~28px en la tarjeta de
   * desktop, que es el ancho al que la punta se lee redonda. En mobile la
   * tarjeta mide más y la raya llega a ~37: más gorda, pero entera.
   */
  rayas: 10,
  /** El alto de la lona, sin contar las puntas. */
  lona: 48,
  /**
   * Cuánto baja la punta por debajo de la lona.
   *
   * ⚠️ SUBIÓ DE 10 A 12 CON EL TOLDO ALTO. La punta se mide contra la lona que
   * la sostiene: colgando de 48px, los 10 de antes se leían como un borde
   * ondulado y no como la caída de una lona.
   */
  punta: 12,
  /**
   * Cuánto entra la lona por cada lado ARRIBA: es lo que la hace trapecio.
   *
   * ⚠️ VA EN PÍXELES FIJOS Y NO EN PORCENTAJE. Con porcentaje, la tarjeta ancha
   * de mobile tendría el doble de caída que la angosta de desktop y los cuatro
   * toldos de la fila no se parecerían entre sí.
   */
  entrada: 18,
  /**
   * Cuánto vuela por cada lado, fuera de la tarjeta.
   *
   * ⚠️ ESTÁ ATADO AL `gap` DE LA GRILLA, QUE ES 24px. Camila: «tené cuidado que
   * en ningún device se toquen los toldos entre sí ni toquen la card que no le
   * pertenece». Con 8 de vuelo quedan 8px de aire entre dos toldos vecinos
   * (24 − 8 − 8). Si cambia el `gap`, cambia esto.
   */
  vuelo: 8,
  /**
   * Cuánto asoma por encima del borde de la tarjeta.
   *
   * ⚠️ EL OTRO LADO DE LA MISMA CUENTA, y el que obliga a que la grilla tenga
   * `gap-y` propio: hacia arriba el toldo invade el espacio de la FILA de
   * arriba. Con 26 de asomo, la grilla necesita 48 de aire vertical para dejar
   * 22px entre el toldo y la tarjeta de arriba. Ver la nota de la grilla.
   */
  asomo: 26,
} as const;

/** Los dos verdes de la raya, en orden. Salen de los tokens, no de un hex. */
const TOLDO_RAYAS = ['var(--color-deep)', 'var(--color-teal600)'] as const;

/**
 * Una raya con su punta: el rectángulo de la lona y el arco que le cuelga.
 *
 * ⚠️ EL `sweep-flag` VA EN 1 Y NO EN 0, y es al revés de lo que pide la
 * intuición: el arco se recorre de DERECHA A IZQUIERDA y en esa dirección el
 * que sale hacia abajo es el 1. Con 0 la punta muerde hacia arriba.
 *
 * ⚠️ SE DIBUJA RAYA POR RAYA Y NO CON UN `<pattern>`, que es como lo resuelve
 * `WaveBorder`. Un `pattern` necesita un `id`, y acá el mismo SVG se repite
 * cuatro veces en la misma página: cuatro `id` iguales es HTML inválido.
 */
const rayaD = (i: number) => {
  const { lona, punta } = TOLDO;
  const x = i;
  return `M${x} 0H${x + 1}V${lona}A0.5 ${punta} 0 0 1 ${x} ${lona}Z`;
};

function ToldoEdge() {
  const { rayas, lona, punta, entrada, vuelo, asomo } = TOLDO;
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute z-10 block"
      style={{
        top: -asomo,
        left: -vuelo,
        right: -vuelo,
        /*
          El trapecio se recorta sobre el contenedor y no se dibuja adentro del
          SVG: así la inclinación se mide en píxeles reales de pantalla —los 18
          de `entrada`— y no en unidades de un `viewBox` que se estira.

          ⚠️ EL `clip-path` VA EN `style` Y NO COMO CLASE porque lleva un
          `calc()` con porcentaje y píxeles adentro de un `polygon()`: como
          utilidad arbitraria de Tailwind hay que codificar cada espacio con un
          guión bajo y queda ilegible para lo que es.
        */
        clipPath: `polygon(${entrada}px 0, calc(100% - ${entrada}px) 0, 100% 100%, 0 100%)`,
      }}
    >
      <svg
        role="presentation"
        width="100%"
        height={lona + punta}
        viewBox={`0 0 ${rayas} ${lona + punta}`}
        /*
          ⚠️ `none` Y NO `slice`: es lo que garantiza que la última raya termine
          EXACTA en el borde derecho en cualquier ancho. El estirado es sólo
          horizontal —el alto va fijo en píxeles— así que la punta se ensancha
          pero no se achata.
        */
        preserveAspectRatio="none"
        className="block"
      >
        {Array.from({ length: rayas }, (_, i) => (
          <path key={i} d={rayaD(i)} fill={TOLDO_RAYAS[i % TOLDO_RAYAS.length]} />
        ))}
      </svg>
    </span>
  );
}

/**
 * Agrupa días seguidos con el mismo horario de trucks: «Wednesday to Thursday».
 *
 * ⚠️ AGRUPA POR CONSECUTIVOS Y NO POR VALOR, que es la misma regla que la tira
 * de horarios del encabezado: dos días con el mismo horario pero separados en la
 * semana no pueden mostrarse como un rango, porque eso afirmaría que los días
 * del medio también abren a esa hora.
 */
function tramosDeTrucks() {
  const out: { label: string; horario: string; primero: string }[] = [];
  HOURS.filter((h) => !/closed/i.test(h.trucks)).forEach((row) => {
    const ultimo = out[out.length - 1];
    if (ultimo && ultimo.horario === row.trucks) {
      ultimo.label = `${ultimo.primero} to ${row.day}`;
      return;
    }
    out.push({ label: row.day, horario: row.trucks, primero: row.day });
  });
  return out;
}

export default async function TruckCards({
  id = 'roster-title',
  tone = 'paper',
  head = true,
}: {
  readonly id?: string;
  /** La superficie. La manda la onda del encabezado: ver `PageHeroWave`. */
  readonly tone?: 'paper' | 'bone';
  /**
   * ¿Lleva encabezado propio?
   *
   * ⚠️ EN `/food-trucks` VA EN `false`, y es por adyacencia. Desde que la
   * página abre con el hero centrado que termina en onda, las tarjetas quedan
   * INMEDIATAMENTE debajo de él: el hero dice «Four kitchens. One yard.» y el
   * encabezado de la sección decía «The four kitchens» cuatro renglones más
   * abajo, con una bajada que repetía la misma idea con otras palabras. Dos
   * titulares seguidos diciendo lo mismo se leen como un error de armado.
   *
   * El `<h2>` no desaparece: queda para lectores de pantalla, porque la sección
   * igual necesita nombre.
   */
  readonly head?: boolean;
}) {
  /*
    ══════════════════════════════════════════════════════════════════════════
    ⚠️ LA LISTA DE TARJETAS LA DECIDE EL DASHBOARD, NO ESTE ARCHIVO NI EL
    ROSTER. Camila, 2026-09-21: «hagamos que las cards sean dinámicas, que si yo
    elimino uno de los menús se borre la card en la web».

    Una consulta para toda la sección, y quién es cada carta —de qué truck, con
    qué foto, y cuál de todas es la de la barra, que acá no va— lo resuelve
    `content/menus.ts`. Si la base no contesta, esa misma función cae al roster
    y la página se sirve igual.
    ══════════════════════════════════════════════════════════════════════════
  */
  const cartas = await cartasDeTrucks();
  const tramos = tramosDeTrucks();

  /*
    ⚠️ SIN ENCABEZADO NO HAY BANDA DE ARRIBA, Y NO ES UN DESCUIDO. Con `head` la
    sección arranca con su título y los 128px de `lg` son el aire que ese
    título necesita. Sin él —que es `/food-trucks`— lo primero de la sección
    son las tarjetas, y el aire ya lo puso la ola del hero: la franja de la ola
    termina en unos 100px del color de esta sección, así que otros 128px abajo
    eran aire sobre aire, y era lo que empujaba las tarjetas fuera de la
    primera pantalla. Camila, 2026-09-21: «que se vean las cards al entrar».

    ⚠️ EL `pb` NO CAMBIA: abajo sigue el `lg`, porque ahí lo que hay es el
    final de la sección y el corte con lo que venga.
  */
  return (
    <Section tone={tone} band="lg" bandTop={head ? undefined : 'none'} labelledBy={id}>
      {head ? (
        <SectionHead
          eyebrow="In the yard"
          eyebrowTone="plum"
          id={id}
          title="The four kitchens"
          lead="Each one is its own business. You order at the window and you pay that truck: separate line, separate card, separate receipt."
        />
      ) : (
        <h2 id={id} className="sr-only">
          The four kitchens
        </h2>
      )}

      {/*
        ══════════════════════════════════════════════════════════════════
        ⚠️ SON CUATRO COLUMNAS Y ERAN DOS. Camila, 2026-09-16: «las 4 cards las
        veo muy grotescas, tan grandes; ¿qué otra opción podemos hacer para que
        no se vea tan grande?».

        A dos columnas cada tarjeta medía 572px de ancho con una foto de 358 de
        alto: dos filas de eso son 1.400px de página para cuatro nombres y
        cuatro párrafos cortos. La tarjeta no estaba mal hecha, estaba
        sobredimensionada para lo que lleva adentro.

        A cuatro quedan en 266px. La foto pasa a 4/5 —vertical, que es la
        proporción de una ficha y no la de un banner—, el nombre baja un escalón
        y la bajada se recorta en tres renglones. La sección entera pasa de
        1.400px a unos 520.

        ⚠️ LA BAJADA SE RECORTA MÁS Y NO ES UNA PÉRDIDA. El pedido original de
        esta tarjeta era «una descripción pero mínima, tipo bajada de card». A
        266px de ancho entran unos 95 caracteres en tres renglones, que es
        exactamente eso. El texto completo de cada truck no se pierde: está en
        `trucks.ts` y lo muestra la carta.

        ⚠️ EL SALTO ES 1 → 2 → 4 Y NUNCA 3. Con tres columnas, cuatro tarjetas
        dejan una huérfana sola en la segunda fila, que es la regla que rige
        todas las grillas de este sitio.
        ══════════════════════════════════════════════════════════════════
      */}
      {/*
        ⚠️ ESTA GRILLA NO SE REVELA AL SCROLL Y ANTES SÍ. Camila, 2026-09-21:
        «quiero que al entrar a esta página ya estén cargadas las 4 cards».

        Era un `StaggerGroup` con cuatro `RevealItem`, o sea las tarjetas en
        `opacity: 0` hasta que el scroll las cruzaba. El problema es DÓNDE caen:
        con el hero centrado arriba, las cuatro asoman por el pie de la primera
        pantalla, y el `viewport` del repo dispara con `-20%` de margen —o sea
        cuando al elemento le falta un quinto de pantalla para entrar—. Así que
        al abrir la página se veían cuatro huecos blancos justo donde está el
        contenido, y aparecían recién al mover la rueda.

        ⚠️ NO SE TOCÓ EL MECANISMO DE REVELADO DEL REPO, que sigue siendo el de
        `Motion` y sigue en todas las demás secciones. Lo que cambia es esta
        grilla, que es la primera de su página: lo que está arriba del pliegue
        no se revela, se muestra.
      */}
      <ul
        /*
          ⚠️ EL AIRE VERTICAL ES EL DOBLE QUE EL HORIZONTAL, Y LO PIDE EL TOLDO.
          Camila, 2026-09-21: «tené cuidado que en ningún device se toquen los
          toldos entre sí ni toquen la card que no le pertenece».

          El toldo asoma 26px por ENCIMA de su tarjeta, o sea que invade el
          espacio de la fila de arriba. Con `gap-6` —24px— en un layout de dos
          columnas, el toldo de la segunda fila se montaba 2px sobre la tarjeta
          de la primera. Con 48 quedan 22px de aire, y como el `gap-x` sigue en
          24 y el vuelo lateral es de 8 por lado, entre dos toldos vecinos
          quedan 8px. Los tres números viven en `TOLDO` y están anotados ahí.
        */
        className={`grid list-none grid-cols-1 gap-x-6 gap-y-12 p-0 sm:grid-cols-2 lg:grid-cols-4 ${head ? 'mt-bloque' : ''}`}
      >
        {cartas.map((carta) => {
          const t = carta.truck;
          return (
          <li key={carta.name} className="relative h-full">
            <ToldoEdge />
            <article className="flex h-full flex-col overflow-hidden rounded-shell bg-paper sombra-card">
              {/* ⚠️ EL `bg-fog` VA SÓLO DETRÁS DE UNA FOTO REAL, donde tapa el hueco
                  mientras carga. Debajo del placeholder NO: el relleno del
                  placeholder es `ink` al 6 %, o sea que se compone sobre lo que
                  tenga atrás, y sobre `fog` daba #d1cdbd. Ahí su propio rótulo
                  caía a 4.38:1 y axe lo marcó. */}
              <div className={`relative aspect-[3/2] ${t?.photo ? 'bg-fog' : ''}`}>
                {t?.photo ? (
                  <>
                    <Image
                      src={t.photo}
                      alt={t.photoAlt ?? carta.name}
                      fill
                      sizes="(min-width: 1024px) 280px, (min-width: 640px) 46vw, 92vw"
                      className="object-cover"
                    />
                  </>
                ) : (
                  /* Sin ficha en el roster no hay brief escrito, así que el
                     placeholder pide lo mínimo: el truck y un plato. */
                  <PhotoPending
                    brief={t?.photoBrief ?? `El truck de ${carta.name} y un plato servido.`}
                    ratio="aspect-[3/2]"
                    className="h-full"
                  />
                )}
              </div>

              <div className="flex flex-1 flex-col p-5">
                {/* La cocina sale del roster: una carta nueva no la trae, y en
                    ese caso la tarjeta abre directamente por el nombre. */}
                {t ? (
                  <p className="m-0 font-body text-micro font-bold uppercase tracking-cta text-muted">
                    {t.cuisine}
                  </p>
                ) : null}

                <h3
                  className={`m-0 font-display text-d5 font-bold uppercase leading-none text-ink ${t ? 'mt-1.5' : ''}`}
                >
                  {t ? nombreVisible(t) : carta.name}
                </h3>

                {/*
                  ⚠️ SE USA `blurb` Y NO `story`, y ya no hay `line-clamp`. La
                  historia completa del cliente mide hasta 290 caracteres y a
                  266px de ancho el recorte entraba siempre: la tarjeta
                  terminaba en puntos suspensivos en las cuatro. El porqué del
                  campo está arriba de `blurb` en `trucks.ts`.

                  El respaldo a `story` queda para un truck que todavía no tenga
                  bajada propia: es mejor una frase cortada que ninguna.
                */}
                {carta.description ? (
                  <p className="m-0 mt-3 font-body text-dato font-light leading-[1.5] text-body">
                    {carta.description}
                  </p>
                ) : null}

                {/* El `mt-auto` apoya la línea de acción en el piso de la
                    tarjeta, que es lo que las alinea entre sí. */}
                <div className="mt-auto pt-5">
                  {/*
                    ══════════════════════════════════════════════════════════
                    ⚠️ EL BOTÓN VA EN LAS CUATRO TARJETAS, Y ANTES IBA SÓLO EN
                    LAS DOS QUE TIENEN CARTA. Camila, 2026-09-16: «en todas poné
                    el see the menu; en las que aún no lo tengamos, no linkees
                    nada».

                    ⚠️ ES UN `<button disabled>` Y NO UN `<a>` SIN `href`. Un
                    botón que se ve vivo, responde al hover y no hace nada al
                    apretarlo se lee como que la página está rota — es
                    exactamente el argumento que este proyecto ya escribió para
                    las flechas del carrusel de `WhatsOn`. `disabled` lo saca
                    del tabulador y lo anuncia como no disponible.
                    ══════════════════════════════════════════════════════════
                  */}
                  {carta.pdfUrl ? (
                    /*
                      ⚠️ LA CARTA ABRE EN UN DIÁLOGO Y YA NO EN UNA PESTAÑA.
                      Camila: «debe abrirse cada PDF como se abre el de Sunset
                      Bar». Lo que se copia es el mecanismo —`<dialog>` nativo,
                      telón que cierra al clic, Escape— y está todo en el
                      componente, con el link a la pestaña como salida por si el
                      visor embebido no dibuja.
                    */
                    <MenuPdfDialog url={carta.pdfUrl} label={t ? nombreVisible(t) : carta.name} />
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="inline-flex items-center gap-2 rounded-pill bg-sunset px-4.5 py-2 font-body text-dato font-semibold uppercase tracking-cta text-ink opacity-50"
                    >
                      See the menu
                      <ArrowUpRight className="size-3.5 shrink-0" />
                    </button>
                  )}
                </div>
              </div>
            </article>
          </li>
          );
        })}
      </ul>

      {/*
        ══════════════════════════════════════════════════════════════════
        EL HORARIO, UNA VEZ Y PARA LOS CUATRO.

        ⚠️ ES EL DEL PATIO Y NO UNO POR TRUCK. Camila, 2026-09-16: «el horario
        es el mismo para todos los food trucks y sí lo tenemos, lo tenemos con
        los horarios del espacio en sí».

        ⚠️ Y NO ES EL MISMO QUE EL DE LA BARRA. `content/hours.ts` guarda dos
        sets porque el sitio vigente los publica separados en cada página: los
        trucks abren exactamente una hora más tarde que la barra, todos los días.
        Acá se muestra la columna `trucks`.

        ══════════════════════════════════════════════════════════════════
        ⚠️ AHORA ES UNA TARJETA HORIZONTAL DESTACADA Y ERA UN FILETE CON UNA
        LISTA. Camila: «la parte de los horarios debe tener más peso, quizá
        ponerlo en una card horizontal destacada o darle más protagonismo de
        otra forma».

        Tenía razón por jerarquía: es el dato más buscado de la página —a qué
        hora abren— y estaba compuesto igual que una nota al pie, en gris, tras
        un filete de 1px. Ahora es una losa oscura, que en esta página es la
        única pieza de ese color antes del comparativo, así que se ve desde
        lejos.

        ⚠️ LOS DÍAS VAN EN DOS COLUMNAS Y ANTES IBAN EN CUATRO. Camila,
        2026-09-17: «poné los días en dos columnas así se distribuye mejor la
        información».

        En cuatro columnas cada tramo medía 170px y el rótulo más largo
        —«Wednesday to Thursday»— era el Único que se partía en dos renglones.
        Eso empujaba su horario un renglón más abajo que los otros tres, y una
        fila de horarios que no se alinea es exactamente lo contrario de lo que
        una fila de horarios tiene que hacer.

        En dos columnas entran los cuatro rótulos en una sola línea, los cuatro
        horarios apoyan en la misma base y el bloque queda cuadrado al lado del
        título en vez de estirado a lo ancho de la losa.

        ⚠️ Y LA COLUMNA DE LOS DÍAS PASÓ A SER LA QUE NO CRECE. Con `1fr` del
        lado de la `<dl>` las dos columnas se repartían media losa cada una y
        quedaba un hueco muerto después de cada horario. Ahora el `1fr` lo toma
        el título y la `<dl>` mide lo que mide su contenido.

        ⚠️ EN EL CELULAR LOS CUATRO TRAMOS VAN UNO ABAJO DEL OTRO. Camila,
        2026-09-21: «en mobile esto debe ir en una única fila uno sobre otro».
        Con dos columnas a 375px cada tramo medía ~150px y ahí «Wednesday to
        Thursday» se partía en dos renglones y «12:00 PM – 11:00 PM» en tres:
        la misma desprolijidad que las cuatro columnas causaban en escritorio,
        pero peor. Una sola columna deja cada rótulo y cada horario en su
        renglón. Las dos columnas vuelven desde `sm`.

        ⚠️ LOS DÍAS CERRADOS NO SE LISTAN. Es la misma decisión que el cliente
        pidió para la barra de horarios del encabezado: se comunica por cuándo
        ABRE, no por cuándo no.
        ══════════════════════════════════════════════════════════════════
      */}
      {/*
        ⚠️ LA LOSA NO OCUPA TODO EL ANCHO Y ANTES SÍ. Camila, 2026-09-21:
        «borra todo este espacio extra, haz la card angosta para no tener ese
        espacio». Con la losa a ancho completo el `1fr` del título se estiraba
        hasta el borde y entre «When the trucks are open» y la primera columna
        de horarios quedaba un hueco de ~400px sin nada adentro.

        El ancho máximo está calculado sobre el contenido: ~300px de la columna
        del título (su bajada mide `34ch`), 56px de `gap`, ~450px de las dos
        columnas de horarios y los 88px de `p-11`. Se centra con `mx-auto`, así
        que lo que sobra queda de los dos lados en vez de adentro.
      */}
      <div className="mx-auto mt-bloque overflow-hidden rounded-shell bg-deep grano sombra-card lg:max-w-[58rem]">
        <div className="grid gap-8 p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,auto)] lg:items-center lg:gap-14 lg:p-11">
          <div>
            <h3 className="m-0 font-display text-d4 font-bold uppercase leading-none text-paper lg:text-d3">
              When the trucks
              <br className="hidden lg:block" /> are open
            </h3>
            <p className="m-0 mt-3.5 max-w-[34ch] font-body text-dato font-light text-muted-dark">
              The bar upstairs opens an hour earlier every day.
            </p>
          </div>

          <dl className="m-0 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 sm:gap-y-6 lg:gap-x-14 lg:gap-y-7">
            {tramos.map((t) => (
              <div key={t.label} className="border-t border-paper/20 pt-4">
                <dt className="font-body text-micro font-bold uppercase tracking-cta text-cream">
                  {t.label}
                </dt>
                <dd className="m-0 mt-2 font-display text-d6 font-bold tabular-nums leading-none text-paper">
                  {t.horario}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
