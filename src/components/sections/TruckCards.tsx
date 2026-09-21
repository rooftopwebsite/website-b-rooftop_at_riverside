import Image from 'next/image';
import { ArrowUpRight } from '@/components/shared/Icon';
import { PhotoPending } from '@/components/shared/PendingData';
import Section from '@/components/shared/Section';
import { SectionHead } from '@/components/shared/Type';
import { activeTrucks, nombreVisible } from '@/content/trucks';
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
 * ⚠️ EL CTA VA A UNA IMAGEN Y NO A UN PDF, y el pedido decía PDF. El motivo es
 * que el PDF no existe: el sitio vigente publica cada carta como IMAGEN dentro
 * de la página del truck, y los únicos tres PDF que tiene son el mapa de
 * estacionamiento, el del game lounge y el de eventos. Están bajadas en
 * `public/menus/`. Una carta de una página como imagen abre en cualquier
 * teléfono y se hace zoom con dos dedos; el día que el cliente mande PDF se
 * cambia la ruta en `trucks.ts` y esta sección no se entera.
 *
 * ⚠️ NO HAY CTA A INSTAGRAM, aunque de El Chilango lo tengamos. Pedido de
 * Camila: la tarjeta cierra con una sola acción. Dos links juntos al pie —uno
 * relleno y uno de texto— hacen que el ojo tenga que elegir justo donde la
 * tarjeta debería empujar a una sola cosa. El dato queda en `trucks.ts` para
 * cuando haga falta.
 */
/**
 * EL TOLDO que corona la foto de cada tarjeta.
 *
 * Pedido de Camila, 2026-09-17: que las tarjetas lleven «un tildito, típico de
 * los íconos que representan una tienda», y que no dé sensación de aniñado. El
 * ícono que mandó de referencia es el de Google Business: una casilla con el
 * toldo a rayas arriba. Esto es ese toldo, y con él la tarjeta de un negocio
 * que no tiene local pasa a tener frente.
 *
 * ⚠️ VA ARRIBA DE LA FOTO Y NO ABAJO. La primera versión lo puso al pie, como
 * remate; Camila mandó la referencia y marcó el borde de arriba: «con toldito
 * me refería a algo así». Y tiene razón por dibujo: un toldo cuelga, no se
 * apoya. Al pie los mismos dientes se leen como un recorte ondulado cualquiera.
 *
 * ⚠️ NO ES EL FESTÓN QUE SE BORRÓ. `Scallop.tsx` murió porque pretendía ser el
 * SEPARADOR de marca, y el brand book tiene olas para eso. Eso no cambia: la
 * cenefa entre dos superficies de la página sigue siendo `WaveBorder` y esto no
 * compite con ella. Es otra pieza y otra escala: no corta la página, corona una
 * foto adentro de una tarjeta de 266px.
 *
 * ⚠️ EL ARCO ES CHATO A PROPÓSITO. 10px de hondo contra 13 de medio período es
 * 0,77 de un semicírculo. El semicírculo entero es la forma de una guirnalda de
 * cumpleaños, que era exactamente lo que había que esquivar; achatado se lee
 * como la caída de una lona tensada.
 *
 * ⚠️ VA DEL COLOR DE LA TARJETA Y NO A RAYAS. El ícono de referencia tiene el
 * toldo rayado, y rayas es justo por donde esto se vuelve infantil: cuatro
 * tarjetas con cuatro toldos a rayas es una calesita. Del color del cuerpo es
 * el CUERPO el que baja sobre la foto, y la tarjeta se lee como una sola pieza
 * recortada en vez de como una foto con un adorno encima.
 *
 * ⚠️ SÓLO VA DONDE HAY FOTO DE VERDAD. Sobre el placeholder de «falta la foto»
 * cortaría su filete punteado por arriba, que es la misma razón por la que el
 * `bg-fog` tampoco va ahí.
 */
const TOLDO = {
  /** Cada cuánto se repite el diente. Fijo en px: el tamaño no depende del
      ancho de la tarjeta, porque es textura y no grilla. */
  periodo: 26,
  /**
   * La banda lisa de arriba, antes de que empiecen los dientes.
   *
   * ⚠️ SIN ELLA NO HAY TOLDO. La primera versión eran los dientes pelados
   * colgando del borde, y ahí dos dientes vecinos sólo se tocan en un punto:
   * se leía como una fila de medialunas, no como una lona. La banda es lo que
   * los une en UNA pieza, y es lo que tiene el ícono de la tienda.
   */
  banda: 7,
  /** Cuánto baja el diente por debajo de la banda. */
  alto: 10,
  /** Ancho del `viewBox`. Más que cualquier tarjeta, así el dibujo se recorta
      en vez de estirarse. Ver `preserveAspectRatio` abajo. */
  ancho: 1600,
} as const;

/**
 * El camino, armado una vez al cargar el módulo y no una vez por tarjeta.
 *
 * Va por el borde de arriba hacia la derecha, baja el alto de la banda y
 * vuelve hacia la izquierda en arcos: cada arco es un diente.
 *
 * ⚠️ SE DIBUJAN LOS ARCOS UNO POR UNO Y NO CON UN `<pattern>`, que es como lo
 * resuelve `WaveBorder`. Un `pattern` necesita un `id`, y acá el mismo SVG se
 * repite cuatro veces en la misma página: cuatro `id` iguales es HTML inválido.
 * Sin `id` no hay nada que pueda chocar.
 *
 * ⚠️ EL `sweep-flag` VA EN 1 Y NO EN 0, y es al revés de lo que pide la
 * intuición. Los arcos se recorren de DERECHA A IZQUIERDA, y en esa dirección
 * el que sale hacia abajo es el 1. Con 0 los dientes muerden hacia arriba y el
 * toldo queda dado vuelta.
 */
/**
 * ⚠️ EL CAMINO YA NO TRAE LA BANDA LISA, Y NO ES QUE SE HAYA PERDIDO: desde que
 * el toldo se montó ENCIMA de la tarjeta, la banda es un `<span>` con fondo y
 * esquinas redondeadas arriba —que un `<path>` no puede redondear sin volverse
 * ilegible— y acá quedan sólo los dientes, colgando de su borde inferior.
 *
 * Las dos piezas se solapan un píxel (`-mt-px`) porque entre dos elementos
 * pintados del mismo color, en pantallas con DPR fraccional, el redondeo deja
 * una línea del fondo asomando en la junta.
 */
const TOLDO_D = (() => {
  const { periodo: p, alto: a, ancho } = TOLDO;
  const dientes = Math.ceil(ancho / p);
  const w = dientes * p;
  let d = `M0 0L${w} 0`;
  for (let i = dientes; i >= 1; i -= 1) d += ` A${p / 2} ${a} 0 0 1 ${(i - 1) * p} 0`;
  return `${d}Z`;
})();

/**
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ EL TOLDO SE MONTÓ ENCIMA DE LA TARJETA Y ESTABA ADENTRO. Camila,
 * 2026-09-21, con el dibujo hecho sobre la captura: «quiero que el toldo esté
 * por fuera de la card, como sobre ella no dentro de ella, así como dibujo en
 * la imagen, y que tenga color, para que sean vistosos y no pasen
 * desapercibidos».
 *
 * Los tres cambios que pide el dibujo, y son tres cosas distintas:
 *
 *   · SOBRESALE POR LOS COSTADOS. Antes medía exactamente el ancho de la foto,
 *     así que era un recorte del borde superior y no una pieza apoyada encima.
 *     Un toldo real vuela sobre la vereda: sobresale 10px por lado.
 *   · ASOMA POR ARRIBA. La lona sube 12px por encima del borde de la tarjeta,
 *     que es lo que lo despega de la foto y lo convierte en frente.
 *   · VA EN COLOR. En `paper` era el cuerpo de la tarjeta bajando sobre la
 *     foto —deliberado entonces, invisible ahora—.
 *
 * ⚠️ POR ESO VIVE FUERA DEL `article` Y NO ADENTRO: la tarjeta es
 * `overflow-hidden` para recortar la foto en sus esquinas, y ahí adentro nada
 * puede sobresalir. Cuelga del `<li>`, que es `relative` justamente para esto.
 *
 * ⚠️ LOS 10px DE VUELO NO SON UN NÚMERO SUELTO: el `gap` de la grilla es 24, así
 * que dos toldos vecinos se acercan a 4px sin tocarse. Si cambia el `gap`,
 * cambia esto.
 *
 * ⚠️ EL COLOR ES `sunset` Y NO UNA RAYA. La referencia del ícono de tienda
 * tiene el toldo rayado y eso se descartó desde el principio: cuatro toldos a
 * rayas son una calesita. Liso y en el naranja de marca es la misma pieza con
 * el volumen que faltaba, y cierra con el CTA naranja al pie de la tarjeta: la
 * tarjeta queda enmarcada arriba y abajo por el mismo color.
 *
 * ⚠️ AHORA VA EN LAS CUATRO TARJETAS, incluida la del placeholder. Antes se
 * salteaba esa porque el dibujo le cortaba el filete punteado por arriba; fuera
 * de la tarjeta no toca nada, y un roster donde tres tienen frente y una no se
 * lee como un error de carga.
 * ══════════════════════════════════════════════════════════════════════════
 */
function ToldoEdge() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -top-[12px] -right-[10px] -left-[10px] z-10 block"
    >
      {/* La lona: el lomo liso que se apoya sobre el borde de la tarjeta. */}
      <span className="block h-[13px] rounded-t-[10px] bg-sunset" />
      <svg
        role="presentation"
        width="100%"
        height={TOLDO.alto}
        viewBox={`0 0 ${TOLDO.ancho} ${TOLDO.alto}`}
        /* `slice` recorta lo que sobra a la derecha en vez de escalar: así el
           diente mide 26px igual en la tarjeta angosta de desktop que en la
           ancha de mobile, que es lo que lo mantiene leyéndose como toldo. */
        preserveAspectRatio="xMinYMin slice"
        className="-mt-px block"
      >
        <path d={TOLDO_D} fill="var(--color-sunset)" />
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

export default function TruckCards({
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
  const trucks = activeTrucks();
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
        className={`grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-4 ${head ? 'mt-bloque' : ''}`}
      >
        {trucks.map((t) => (
          <li key={t.slug} className="relative h-full">
            <ToldoEdge />
            <article className="flex h-full flex-col overflow-hidden rounded-shell bg-paper sombra-card">
              {/* ⚠️ EL `bg-fog` VA SÓLO DETRÁS DE UNA FOTO REAL, donde tapa el hueco
                  mientras carga. Debajo del placeholder NO: el relleno del
                  placeholder es `ink` al 6 %, o sea que se compone sobre lo que
                  tenga atrás, y sobre `fog` daba #d1cdbd. Ahí su propio rótulo
                  caía a 4.38:1 y axe lo marcó. */}
              <div className={`relative aspect-[3/2] ${t.photo ? 'bg-fog' : ''}`}>
                {t.photo ? (
                  <>
                    <Image
                      src={t.photo}
                      alt={t.photoAlt ?? t.name}
                      fill
                      sizes="(min-width: 1024px) 280px, (min-width: 640px) 46vw, 92vw"
                      className="object-cover"
                    />
                  </>
                ) : (
                  <PhotoPending brief={t.photoBrief} ratio="aspect-[3/2]" className="h-full" />
                )}
              </div>

              <div className="flex flex-1 flex-col p-5">
                <p className="m-0 font-body text-micro font-bold uppercase tracking-cta text-muted">
                  {t.cuisine}
                </p>

                <h3 className="m-0 mt-1.5 font-display text-d5 font-bold uppercase leading-none text-ink">
                  {nombreVisible(t)}
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
                {t.blurb ?? t.story ? (
                  <p className="m-0 mt-3 font-body text-dato font-light leading-[1.5] text-body">
                    {t.blurb ?? t.story}
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
                  {t.menuImage ? (
                    <a
                      href={t.menuImage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-pill bg-sunset px-4.5 py-2 font-body text-dato font-semibold uppercase tracking-cta text-ink transition-colors duration-200 hover:bg-sunset-hover"
                    >
                      See the menu
                      <ArrowUpRight className="size-3.5 shrink-0" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
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
        ))}
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

          <dl className="m-0 grid grid-cols-2 gap-x-8 gap-y-6 lg:gap-x-14 lg:gap-y-7">
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
