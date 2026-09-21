import Link from 'next/link';
import { CalendarGrid, GridFour } from '@/components/shared/Icon';
import { GUTTER } from '@/components/shared/Section';
import type { CalendarView } from '@/lib/calendar';

/**
 * ══════════════════════════════════════════════════════════════════════════
 * LA BARRA DE CONTROL DEL CALENDARIO.
 *
 * Camila, 2026-09-21: «hay que hacer una barra de navegación (fija al
 * scrolear) que permita cambiar de mes y cambiar de vista». Los filtros por
 * tipo se mudaron acá adentro el mismo día, «como segunda línea».
 *
 * ⚠️ TODO ES `<Link>` Y NO HAY UN SOLO `useState`. Mes, vista y filtro viajan
 * en la URL (`?month=2026-10&view=calendar&type=music`), así que la barra es
 * un componente de servidor: cada combinación es una dirección que se
 * comparte, que Google rastrea y que funciona con JavaScript apagado. Es la
 * misma decisión que rige la página desde que existe, y la razón por la que
 * este calendario reemplaza a un iframe de un tercero que no devuelve un solo
 * nombre de evento en el HTML.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ TODOS LOS LINKS LLEVAN `scroll={false}`, Y NO ES UN DETALLE: ES LA MITAD
 * DE QUE LA BARRA SIRVA. Camila, 2026-09-21: «cada vez que cambio la vista o el
 * mes o el filtro no quiero que la página se scrolee, que quede en el mismo
 * lugar y sólo cambie el contenido».
 *
 * Next, ante una navegación, manda el scroll al tope. En una barra PEGADA eso
 * es exactamente lo peor que puede pasar: alguien mira octubre con la barra
 * apoyada bajo el header, toca la flecha, y la página lo devuelve al hero —o
 * sea que cada clic en un control cuesta volver a bajar—. Con `scroll={false}`
 * la posición no se toca: la barra se queda donde está y debajo cambia el
 * contenido, que es el gesto de un calendario y no el de un link.
 *
 * ⚠️ NO ROMPE NADA SIN JAVASCRIPT. Son links de verdad: sin JS el navegador
 * hace una carga completa y cae arriba, como cualquier página. La mejora es
 * progresiva y la función —cambiar de mes, de vista o de filtro— no depende de
 * ella.
 *
 * ⚠️ VA EN TODOS LOS CONTROLES O EN NINGUNO. Con la mitad puestos, la barra se
 * comporta distinto según cuál botón se toca, que es peor que saltar siempre.
 * Los dos `ButtonLink` del vacío de `/whats-on` también lo llevan.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ ES UN COMPONENTE TONTO: recibe los `href` ya armados. No sabe qué es un
 * mes ni cómo se construye una URL, y por eso se puede mover de página sin
 * arrastrar la lógica de `/whats-on`.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ VA DE BORDE A BORDE DE LA PANTALLA Y ESTUVO UN RATO COMO UNA CARD FLOTANTE
 * CON LAS ESQUINAS REDONDEADAS. Camila, 2026-09-21, con flechas dibujadas hacia
 * los dos bordes de la captura: «el header este debería llegar al borde de la
 * pantalla».
 *
 * Y es lo correcto por lo que la barra ES: la segunda mitad del header. Una
 * card centrada con aire a los costados se lee como un objeto más de la página
 * —uno que encima flota por encima de los otros al scrollear—; una banda que
 * toca los dos bordes se lee como barra, que es lo que hace.
 *
 * ⚠️ POR ESO VIVE FUERA DE LA `Section` Y NO ADENTRO. La `Section` pagina con
 * `gutter` y encierra su contenido en una `caja` con ancho máximo: desde
 * adentro, ningún margen negativo llega al borde de la pantalla sin recurrir a
 * `100vw`, que en un navegador con barra de scroll visible mide MÁS que el
 * viewport y arrastra scroll horizontal a todo el documento. La barra se pagina
 * sola: `GUTTER` afuera para el filete, `caja` adentro para que las flechas
 * queden alineadas con las tarjetas de abajo.
 *
 * ⚠️ QUIEN DEFINE HASTA DÓNDE SE PEGA ES EL `<div>` QUE LA ENVUELVE JUNTO CON
 * LA SECCIÓN, en `/whats-on`. Un elemento `sticky` se pega DENTRO DE SU PADRE:
 * con la barra sola en su envoltorio no tiene un píxel de recorrido y scrollea
 * como si el `sticky` no existiera —pasó, y medido en el navegador—; suelta en
 * la página se quedaría pegada hasta el footer.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ `top-[79px]` NO ES UN NÚMERO MÁGICO: ES LA ALTURA DEL HEADER, FILETE
 * INCLUIDO. El header del sitio es `sticky top-0` con `min-h-19.5` —78px— más
 * `border-b`, y medido en el navegador da 79. Con 78 queda una hendija de 1px
 * por la que se ve pasar el contenido. El header no cambia de alto al pegarse
 * (Camila lo pidió expresamente: «cuando se scrollea, no achicar el header»),
 * así que el número es estable; si esa altura cambia, esto se corre.
 *
 * ⚠️ `z-30` Y NO MÁS. El header es `z-50` y tiene que seguir por encima de
 * todo: «los elementos no deben pisar o pasar por arriba del header». El
 * escalón de 30 a 40 queda libre para las piezas que se salen de su sección.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ NO LLEVA SOMBRA, Y LA LLEVÓ. Camila, 2026-09-21, con la captura del punto
 * en que la barra todavía NO está pegada: «antes de quedarse sticky no quiero
 * que se vea así, en el recuadro y destacadito».
 *
 * El problema es que una barra pegajosa tiene dos estados y el CSS sólo sabe
 * dibujar uno. Con `sombra-card`, pegada arriba se lee bien —algo que flota
 * sobre lo que pasa por debajo— y en reposo, en medio de la página, se lee como
 * una plancha blanca recortada encima de una sección que ya era blanca: un
 * recuadro que nadie pidió, justo donde la página tiene que arrancar directo
 * con el contenido.
 *
 * ⚠️ LO QUE LA SEPARA ES EL FILETE DE ABAJO Y NADA MÁS. En reposo desaparece
 * dentro de su sección, que es lo correcto —la barra es el arranque del
 * contenido, no un objeto aparte—; pegada, ese hairline alcanza para que el
 * texto que scrollea no parezca tocar las píldoras.
 *
 * ⚠️ DISTINGUIR LOS DOS ESTADOS EN CSS HOY NO SE PUEDE sin quedar atado a un
 * solo navegador: `@container scroll-state(stuck: top)` es Chrome 133+ y no
 * existe en Safari ni Firefox. La otra salida es un `IntersectionObserver`
 * sobre un centinela, y eso convierte la barra en componente de cliente: hoy
 * toda esta página se resuelve en el servidor y no vale gastar eso en una
 * sombra. Si algún día se agrega, el estado pegado es el que la recibe.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ NO NECESITA `overflow` EN NINGÚN ANCESTRO. `position: sticky` deja de
 * funcionar, sin avisar, si cualquier padre tiene `overflow` distinto de
 * `visible`. Hoy ni `html`, ni `body`, ni `Section` lo tienen. Si alguna vez
 * alguien agrega `overflow-x-hidden` al layout para tapar un scroll lateral,
 * esta barra se despega y el síntoma no va a parecerse a la causa.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ EL SELECCIONADO ES `deep` Y ESTUVO EN `sunset`. Camila, 2026-09-21: «que
 * no use el mismo naranja que los CTAs principales, algo secundario».
 *
 * Tiene razón y es una regla de jerarquía, no de gusto: en esta misma pantalla
 * el naranja es «Plan an event» en el header y «Get tickets» en cada tarjeta,
 * o sea LA ACCIÓN. Una píldora que sólo dice en qué mes y en qué vista estás
 * parado no compite con eso. El verde de la casa dice «acá estás» sin pedir un
 * clic.
 *
 * ⚠️ Y NO PIERDE CONTRASTE: `paper` sobre `deep` (#014545) da 14.9:1, contra
 * los 6.7:1 que daba `ink` sobre `sunset`. Medido en el navegador.
 * ══════════════════════════════════════════════════════════════════════════
 */

export interface MonthBarLink {
  readonly href: string;
  /** Lo que se lee. En las flechas va sólo para lector de pantalla. */
  readonly label: string;
}

export interface MonthBarFilter {
  readonly id: string | null;
  readonly label: string;
  readonly href: string;
  readonly current: boolean;
}

const VISTAS: readonly {
  readonly id: CalendarView;
  readonly label: string;
  readonly Icon: typeof GridFour;
}[] = [
  { id: 'grid', label: 'Grid', Icon: GridFour },
  { id: 'calendar', label: 'Calendar', Icon: CalendarGrid },
];

/**
 * El dibujo de una píldora seleccionada, que es el mismo en los dos grupos.
 *
 * ⚠️ ESTÁ EN UNA CONSTANTE Y NO REPETIDO EN LOS DOS LUGARES a propósito: son la
 * misma idea —«acá estás»— y si un día se separan, se separan por una decisión
 * y no porque alguien tocó una y se olvidó de la otra.
 */
const ACTIVA = 'bg-deep text-paper';

export default function MonthBar({
  label,
  labelShort,
  titleId,
  prev,
  next,
  view,
  viewHref,
  filters,
}: {
  /** `September 2026`. El que se lee y el que escucha un lector de pantalla. */
  readonly label: string;
  /** `SEP 2026`. Sólo el dibujo del teléfono. Ver `monthLabelShort()`. */
  readonly labelShort: string;
  /** El `id` del `<h2>` del mes. La sección cuelga de él por `aria-labelledby`. */
  readonly titleId: string;
  readonly prev: MonthBarLink;
  readonly next: MonthBarLink;
  readonly view: CalendarView;
  readonly viewHref: (v: CalendarView) => string;
  /**
   * Los filtros por tipo, ya calculados sobre la programación real. Con uno
   * solo la fila no se dibuja: un filtro que no filtra nada es ruido.
   */
  readonly filters: readonly MonthBarFilter[];
}) {
  return (
    <div
      /*
        ⚠️ LLEVA `grano` Y LA CARD DEL CALENDARIO NO, y no es una inconsistencia:
        la regla del repo es que el grano va en los FONDOS y no en los objetos
        —Camila: «los elementos no deben tener noise effect, sólo los fondos»—, y
        esta barra es una banda a todo el ancho del MISMO color que la página.
        Sin grano se lee como un parche liso recortado sobre el fondo texturado,
        que es exactamente lo que `check:grano` detecta. La card del calendario,
        en cambio, es un objeto con filete y sombra aunque mida 900px.
      */
      className={`grano sticky top-[79px] z-30 border-b border-ink/12 bg-paper py-[10px] lg:py-[14px] ${GUTTER}`}
    >
      <div className="caja">
        {/* ── Renglón 1: el mes y la vista ──────────────────────────────── */}
        <div className="flex items-center justify-between gap-[10px]">
          <div className="flex min-w-0 items-center gap-[6px] lg:gap-[10px]">
            <Flecha href={prev.href} label={prev.label} rel="prev" sentido="atras" />

            {/*
              ══════════════════════════════════════════════════════════════
              ⚠️ EL MES ES EL `<h2>` DE LA SECCIÓN, Y ESTUVO COMO UN `<p>`
              MIENTRAS ARRIBA HUBO UN ENCABEZADO «WHAT IS COMING UP». Ese
              encabezado se fue el 2026-09-21 —Camila: «no debería tener título,
              bajada y eso, ir directo al contenido post hero»— y con él se fue
              el motivo por el que esto no podía ser un encabezado: ya no hay
              dos `h2` compitiendo en la misma sección.

              Y ahora ES el título de lo que se está mirando. El árbol queda
              derecho: `h1` del hero, `h2` del mes, `h3` de cada tarjeta.

              ⚠️ CAMBIA AL CAMBIAR DE MES, Y ESTÁ BIEN: el nombre accesible de
              la sección pasa a ser «October 2026» cuando el contenido es
              octubre. Un título fijo ahí mentiría.

              ⚠️ DOS TEXTOS, UNO SOLO VIVO A LA VEZ. `hidden` es `display: none`,
              así que quien escucha oye «September 2026» y nunca las dos formas.
              Es el mismo reparto que los encabezados de día de `MonthCalendar`.
              ══════════════════════════════════════════════════════════════
            */}
            <h2
              id={titleId}
              className="m-0 min-w-0 truncate font-display text-d6 uppercase leading-none text-ink lg:text-d4"
            >
              <span className="sm:hidden" aria-hidden="true">
                {labelShort}
              </span>
              <span className="hidden sm:inline">{label}</span>
              <span className="sr-only sm:hidden">{label}</span>
            </h2>

            <Flecha href={next.href} label={next.label} rel="next" sentido="adelante" />
          </div>

          {/*
            ══════════════════════════════════════════════════════════════════
            EL CONMUTADOR DE VISTAS.

            ⚠️ EL NOMBRE SE ESCONDE DESDE ABAJO DE `sm`, NO EL BOTÓN. A 360px de
            pantalla, entre las dos flechas, el mes y dos botones con texto no
            entra todo en un renglón y el conmutador se caía a un segundo. Con el
            icono solo, los dos botones miden 72px y el renglón cierra. El nombre
            sigue en el HTML, en `sr-only`: nadie pierde información.

            ⚠️ `aria-current="page"` MARCA LA VISTA ACTIVA Y NO ALCANZA EL COLOR.
            Es la misma regla que ya cumplen los filtros de esta página.
            ══════════════════════════════════════════════════════════════════
          */}
          <nav aria-label="Switch calendar view" className="shrink-0">
            <ul className="m-0 flex list-none gap-[4px] rounded-pill border border-teal600/30 p-[3px]">
              {VISTAS.map((v) => {
                const activo = v.id === view;
                return (
                  <li key={v.id}>
                    <Link
                      href={viewHref(v.id)}
                      scroll={false}
                      aria-current={activo ? 'page' : undefined}
                      className={[
                        'flex items-center gap-[6px] whitespace-nowrap rounded-pill px-[10px] py-[7px] text-caption font-bold uppercase tracking-[0.1em] transition-colors lg:px-[14px]',
                        activo ? ACTIVA : 'text-deep hover:bg-mint/60',
                      ].join(' ')}
                    >
                      <v.Icon className="size-[16px]" />
                      <span className="sr-only sm:not-sr-only">{v.label}</span>
                      <span className="sr-only sm:hidden"> view</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/*
          ══════════════════════════════════════════════════════════════════════
          ── Renglón 2: los filtros ────────────────────────────────────────────

          ⚠️ VIVÍAN CENTRADOS DEBAJO DEL HERO Y SE MUDARON ACÁ EL 2026-09-21, a
          pedido de Camila: «en la barra fija como segunda línea». El motivo es de
          uso, no de dibujo: con la barra pegada, cambiar de mes o de vista está
          siempre a mano y cambiar de filtro obligaba a volver al tope de la
          página.

          ⚠️ SIGUE SIENDO UNA SOLA FILA QUE SE ARRASTRA, y eso ya era ley acá:
          «que estos tags estén en única línea scrolleables horizontalmente como
          en los otros proyectos en los menús». Con seis filtros envueltos en tres
          renglones, la barra fija mediría media pantalla de teléfono.

          ⚠️ LA SANGRÍA NEGATIVA VALE EXACTAMENTE EL PADDING DEL CONTENEDOR, QUE
          ACÁ ES `GUTTER` —16px, y 32 desde `md`— Y ÉSE ES EL PUNTO MÁS FÁCIL DE
          ERRAR DE TODO EL ARCHIVO. Si no coinciden, la tira se sale de la barra y
          arrastra scroll horizontal a TODO el documento. Ya pasó en esta misma
          página cuando la tira usaba `borde` (fluido) dentro de un contenedor
          paginado con `gutter` (fijo): se separaban 15px a 767 de ancho, medido
          en el navegador. Si mañana cambia el paginado de la barra, cambia acá.

          ⚠️ SIN SANGRÍA LA TIRA SE CORTA CONTRA UN BORDE INVISIBLE. Con ella, el
          corte cae en el borde de la pantalla, que es donde el ojo espera que
          siga habiendo cosas.

          ⚠️ NO LLEVA `tabIndex`. La regla de axe pide que una región con scroll
          sea alcanzable por teclado; ésta lo es porque adentro hay LINKS, que ya
          reciben foco y arrastran el scroll solos.

          ⚠️ ACÁ HUBO UN `py-[5px]` CON `-mb-[5px]` Y SE FUE CON LA SOMBRA. Lo
          había pedido `check:sombras`: la píldora activa llevaba `shadow-btn`, y
          un contenedor con `overflow-x-auto` recorta TAMBIÉN en vertical —no
          existe «scroll sólo horizontal»—, así que la sombra quedaba cortada 2px
          arriba y 4 abajo. Desde que el seleccionado es `deep` macizo y sin
          sombra, no hay nada que recortar y el colchón era complejidad sirviendo
          a nadie. Si alguna vez la píldora vuelve a tener sombra, vuelve esto.
          ══════════════════════════════════════════════════════════════════════
        */}
        {filters.length > 1 ? (
          <nav
            aria-label="Filter events by type"
            className={`-mx-gutter mt-[10px] overflow-x-auto [scrollbar-width:none] md:-mx-gutter-lg lg:mt-[12px] [&::-webkit-scrollbar]:hidden ${GUTTER}`}
          >
            <ul className="m-0 flex w-max min-w-full list-none flex-nowrap gap-[6px] p-0">
              {filters.map((f) => (
                <li key={f.id ?? 'all'}>
                  <Link
                    href={f.href}
                    scroll={false}
                    aria-current={f.current ? 'true' : undefined}
                    className={[
                      /* `whitespace-nowrap` porque en una tira de un solo renglón
                         una píldora de dos palabras se partiría en dos y rompería
                         el alto de la fila. */
                      /* `text-caption` es el rótulo del sitio —12px— y no un
                         tamaño elegido para esta barra. Estuvo un rato en 11 para
                         ganar alto y es exactamente la clase de valor suelto que
                         el kit no tiene. */
                      'inline-block whitespace-nowrap rounded-pill px-[13px] py-[5px] text-caption font-bold uppercase tracking-[0.08em] transition-colors',
                      f.current
                        ? ACTIVA
                        : 'border border-teal600/35 text-deep hover:border-teal600 hover:bg-mint/50',
                    ].join(' ')}
                  >
                    {f.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Una flecha de mes.
 *
 * ⚠️ EL NOMBRE DEL MES DESTINO VA EN `sr-only` Y NO EN UN `title`. «Previous
 * month, August 2026» es lo que tiene que oír quien no ve el chevron; un
 * `title` no lo anuncia ningún lector de pantalla de forma confiable.
 *
 * ⚠️ `rel="prev"` / `rel="next"` LE DICEN A GOOGLE QUE ESTO ES UNA SERIE
 * PAGINADA, que es exactamente lo que es: un mes por URL.
 */
function Flecha({
  href,
  label,
  rel,
  sentido,
}: {
  readonly href: string;
  readonly label: string;
  readonly rel: 'prev' | 'next';
  readonly sentido: 'atras' | 'adelante';
}) {
  return (
    <Link
      href={href}
      rel={rel}
      scroll={false}
      className="grid size-[34px] shrink-0 place-items-center rounded-btn border border-ink/20 transition-colors hover:border-ink hover:bg-ink hover:text-paper lg:size-[38px]"
    >
      <span className="sr-only">{label}</span>
      <svg width="9" height="14" viewBox="0 0 9 14" fill="none" aria-hidden="true">
        <path
          d={sentido === 'atras' ? 'M8 1L2 7l6 6' : 'M1 1l6 6-6 6'}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}
