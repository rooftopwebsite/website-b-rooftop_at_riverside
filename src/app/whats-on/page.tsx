import type { Metadata } from 'next';
import MonthBar from '@/components/sections/MonthBar';
import MonthCalendar from '@/components/sections/MonthCalendar';
import UpcomingCards from '@/components/sections/UpcomingCards';
import { ButtonLink } from '@/components/shared/Button';
import PlateHero from '@/components/shared/PlateHero';
import Section from '@/components/shared/Section';
import { Heading } from '@/components/shared/Type';
import {
  activeFilters,
  getVenueEvents,
  isTicketed,
  matchesFilter,
} from '@/content/events';
import { GAME_DAY_DEALS, GAME_DAY_LABEL } from '@/content/game-day';
import { fraseEntretenimiento } from '@/content/entertainment';
import { getVenue, venueAddressLine } from '@/lib/venue';
import {
  type CalendarView,
  monthGrid,
  monthKey,
  monthLabel,
  monthLabelShort,
  occurrencesByDate,
  occurrencesInMonth,
  parseMonth,
  parseView,
  shiftMonth,
  todayInVenue,
  upcomingInMonth,
} from '@/lib/calendar';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  route: "/whats-on",
});

/**
 * /whats-on — el producto principal del venue.
 *
 * ⚠️ Todo esto se renderiza EN EL SERVIDOR. Es el error central que estamos
 * corrigiendo: el calendario actual es un iframe de un tercero que no devuelve
 * un solo nombre de evento en el HTML servido. Google no indexa nada.
 *
 * ⚠️ La navegación por mes va por QUERY STRING (`?month=2026-10`) y no por
 * estado de cliente, para que cada mes sea una URL que se puede compartir,
 * marcar y —lo importante— rastrear.
 */

export default async function WhatsOnPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; type?: string; view?: string }>;
}) {
  const sp = await searchParams;
  const { year, month } = parseMonth(sp.month);
  const type = sp.type ?? null;
  /*
   * ⚠️ LA VISTA VIAJA EN LA URL COMO EL MES Y EL FILTRO, y por el mismo motivo:
   * cada combinación tiene que ser una dirección que se comparte y que el
   * servidor resuelve entera. Ver `parseView()`, donde está anotado por qué
   * este `&view=` no es la marcha atrás del que se sacó el 2026-09-17.
   */
  const view = parseView(sp.view);
  /*
   * ⚠️ HOY EN EL HUSO DEL VENUE Y NO EN EL DEL SERVIDOR. Lo necesitan las dos
   * mitades de la página: la ventana de 15 días de las tarjetas y el círculo
   * naranja de la grilla. Ver `todayInVenue()`: con `toISOString()`, Vercel
   * corre en UTC y a las 9 de la noche en Bonita Springs ya sería mañana.
   */
  const hoy = todayInVenue();

  const venue = await getVenue();
  /*
   * ⚠️ UNA SOLA LECTURA PARA TODA LA PÁGINA, y de la base. Antes el mes salía
   * del volcado versionado y la semana de la base, así que los dos bloques de
   * esta misma pantalla podían no coincidir. Ahora la lista es una y las dos
   * vistas son dos recortes de lo mismo.
   */
  const eventos = await getVenueEvents();
  // Ver `content/entertainment.ts`: el número de noches no está confirmado.
  const musicaLarga = await fraseEntretenimiento();
  /*
   * ⚠️ LOS FILTROS SE CUENTAN SOBRE TODOS LOS EVENTOS y antes sólo sobre los
   * recurrentes. Un festival cargado con fecha propia existía en la grilla del
   * mes pero no encendía su filtro, así que «Festivals» no se dibujaba nunca.
   */
  const filtros = activeFilters(eventos);

  /*
   * ⚠️ EL FILTRO SE APLICA AL CALENDARIO ENTERO —las tarjetas de arriba y la
   * grilla del mes— y NO a la programación semanal de abajo. La semana es la
   * grilla fija del lugar y tiene que leerse entera siempre: filtrarla
   * dejaría a alguien creyendo que el miércoles no pasa nada porque estaba
   * mirando «Sports».
   *
   * ⚠️ HASTA EL 2026-09-17 SÓLO FILTRABA EL MES, porque el otro bloque de la
   * página era la programación semanal. Ahora arriba hay tarjetas de fechas
   * concretas, que son calendario igual que la grilla: si tocar «Sports» no
   * las moviera, el filtro parecería roto.
   */
  const occurrences = occurrencesInMonth(eventos, year, month).filter((o) =>
    matchesFilter(o.event, type),
  );
  const grid = monthGrid(year, month);
  const eventsByDate = occurrencesByDate(occurrences);

  /*
   * ══════════════════════════════════════════════════════════════════════
   * LA VISTA GRID: EL MES ENTERO, UNA TARJETA POR FECHA.
   *
   * ⚠️ ERA UNA VENTANA DE 15 DÍAS CON UN EVENTO UNA SOLA VEZ, y cambió el
   * 2026-09-21. Camila: «en grid no mostraremos solo los próximos 15 días,
   * mostraremos todos los próximos y repetiremos los eventos cada día que
   * corresponda; solo separaremos por mes». Se fue con eso el tope de 8
   * tarjetas, que era una red contra un mes de festival: ahora el recorte lo
   * hace el mes, que es un límite real y no un número elegido.
   *
   * ⚠️ EL MISMO FILTRO QUE LA GRILLA, y ahora es obligatorio y no una decisión:
   * son dos vistas del MISMO recorte. Si tocar «Sports» moviera una y no la
   * otra, el conmutador parecería estar cambiando de datos y no de forma.
   *
   * ⚠️ ARRANCA EN HOY Y NO EL DÍA 1. Ver `upcomingInMonth()`: en el mes en
   * curso, un afiche grande del bingo del martes pasado es ruido en una sección
   * que promete lo que viene. La grilla del calendario sí dibuja el mes entero,
   * porque ahí la pregunta es otra.
   * ══════════════════════════════════════════════════════════════════════
   */
  const delGrid = upcomingInMonth(eventos, year, month, hoy).filter((o) =>
    matchesFilter(o.event, type),
  );

  const prev = shiftMonth(year, month, -1);
  const next = shiftMonth(year, month, 1);
  const label = monthLabel(year, month);

  /*
   * ⚠️ SE FUE `&view=`. Había dos vistas, «List» y «Month», y un conmutador
   * para elegir una y esconder la otra. Desde el 2026-09-17 la página muestra
   * las dos cosas a la vez, porque contestan preguntas distintas: las
   * tarjetas dicen «qué puedo hacer estos días» y la grilla dice «qué hay el
   * 28». El parámetro viejo en una URL guardada simplemente se ignora.
   */
  /*
   * ══════════════════════════════════════════════════════════════════════
   * LA URL DE CUALQUIER COMBINACIÓN.
   *
   * ⚠️ LOS TRES PARÁMETROS VIAJAN JUNTOS SIEMPRE. Cambiar de mes tiene que
   * conservar la vista y el filtro, y cambiar de vista tiene que conservar el
   * mes: un conmutador que devuelve a septiembre cuando alguien estaba mirando
   * noviembre se lee como un botón roto.
   *
   * ⚠️ `grid` NO SE ESCRIBE EN LA URL. Es el default de `parseView()`, así
   * que ponerlo sólo agrega ruido y —lo que importa— crea DOS direcciones para
   * la misma página: `/whats-on` y `/whats-on?view=grid`. Para Google eso es
   * contenido duplicado, que es justo lo que esta página vino a arreglar.
   * ══════════════════════════════════════════════════════════════════════
   */
  const href = (
    m: { year: number; month: number },
    t: string | null = type,
    v: CalendarView = view,
  ) =>
    `/whats-on?month=${monthKey(m.year, m.month)}${t ? `&type=${t}` : ''}${
      v === 'calendar' ? '&view=calendar' : ''
    }`;

  /*
   * ⚠️ EL VACÍO LO DECIDE LA VISTA QUE SE ESTÁ MIRANDO Y NO LA OTRA. En grid
   * puede no haber nada aunque la grilla del calendario tenga medio mes lleno:
   * pasa en el mes en curso, cuando lo que quedaba ya pasó. Preguntarle a
   * `occurrences` en las dos vistas dibujaba una grilla de cero tarjetas sin
   * una palabra que dijera por qué.
   */
  const vacio = view === 'grid' ? delGrid.length === 0 : occurrences.length === 0;
  /** El mes entero quedó atrás: es el único vacío que no se arregla filtrando. */
  const mesPasado = view === 'grid' && occurrences.length > 0 && delGrid.length === 0;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(breadcrumbJsonLd([{ name: "What's On", path: '/whats-on' }])),
        }}
      />

      {/*
        ══════════════════════════════════════════════════════════════════
        JSON-LD `Event` DE LOS EVENTOS CON FECHA.

        ⚠️ Vivía en la ficha por evento, que se eliminó el 2026-09-15, así que
        se emite acá. Sin esto el calendario deja de aparecer en los
        resultados de eventos de Google, que es EXACTAMENTE el error del sitio
        viejo que vinimos a arreglar: su calendario es un iframe de un tercero
        y no devuelve un solo nombre de evento en el HTML servido.

        ⚠️ SÓLO LAS OCURRENCIAS CON FECHA CONCRETA. Un recurrente declarado
        con una única fecha le miente a Google, que después muestra en el rich
        result un día que ya pasó.

        ⚠️ `offers` SÓLO SI HAY `ticketUrl`, y NADA si no lo hay. Acá se
        emitía `isAccessibleForFree: true` para todo lo demás, o sea que el
        sitio le declaraba a Google que un evento era gratis por no tener
        cargada una URL de entrada. Es el mismo error que la píldora «Free
        entry» y se fue el mismo día, 2026-09-17, cuando se confirmó que Ross
        Brown y La Noche llevan entrada. Un rich result que dice «Free» sobre
        un show con entrada es peor que uno que no dice nada.
        ══════════════════════════════════════════════════════════════════
      */}
      {occurrences.length > 0 ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdScript(
              occurrences.map(({ date, event }) => ({
                '@context': 'https://schema.org',
                '@type': 'Event',
                name: event.title,
                description: event.summary,
                startDate: `${date}T${event.startTime}:00`,
                eventStatus: 'https://schema.org/EventScheduled',
                eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
                location: {
                  '@type': 'Place',
                  name: `${event.space}, ${venue.name}`,
                  address: venueAddressLine(venue),
                },
                ...(event.image ? { image: event.image } : {}),
                ...(isTicketed(event)
                  ? {
                      offers: {
                        '@type': 'Offer',
                        url: event.ticketUrl,
                        availability: 'https://schema.org/InStock',
                      },
                    }
                  : {}),
              })),
            ),
          }}
        />
      ) : null}

      {/*
        ══════════════════════════════════════════════════════════════════
        ⚠️ ES `PlateHero`, EL DE `/sunset-bar`, Y ERA `PageHero`. Camila,
        2026-09-21: «este hero debe ser como el de Sunset Bar, copialo».

        Lo que cambia no es sólo la forma: el hero viejo era una columna de
        texto a la izquierda sobre fondo liso, sin una sola imagen, en la página
        que justamente vende noches. Éste abre con una pregunta, el titular
        centrado en una placa que MUERDE una foto a lo ancho, y las dos esquinas
        inversas donde la placa entra en la imagen. Todo eso lo trae el
        componente; acá sólo se elige qué dice y qué foto va.

        ⚠️ «THIS WEEK» EN COLOR, y es ley del sitio y no adorno de esta página:
        «recordá siempre al menos una palabra en los heros destacar con color».
        Va en `sunset-deep` —no en `sunset`— porque es tinta sobre claro: el
        naranja de marca ahí da 2.35:1. El mismo criterio que «rooftop» en
        `/sunset-bar`.

        ⚠️ EL H1 SIGUE SIENDO EXACTAMENTE «What's on this week», que es lo que
        dice `PAGE_SEO` y lo que compara `npm run check:seo`. El `span` parte el
        renglón pero no el texto: el espacio antes del span queda dentro del
        `textContent`.

        ⚠️ SIN MIGAS, IGUAL QUE EN `/sunset-bar`. Estuvieron un rato —«Home /
        What's On»— y Camila las tachó con una cruz sobre la captura el
        2026-09-21, que es la segunda vez que las tacha en este hero: la primera
        fue en `/sunset-bar`, el 2026-09-16. El motivo vale igual acá: es un
        solo salto, y la nav de arriba ya tiene «What's On» marcado como página
        actual.

        ⚠️ EL BREADCRUMB PARA GOOGLE NO SE FUE: el JSON-LD sigue arriba, en el
        `<script>` de esta misma página. Lo que se saca es la fila de texto, que
        en un hero centrado entraba por la izquierda y rompía el eje.

        ⚠️ LA PREGUNTA ES LA QUE ALGUIEN ESCRIBE EN GOOGLE. `PlateHero` la
        publica en cuerpo, no como rótulo, justamente para que se lea como una
        pregunta y no como una etiqueta de sección.

        ⚠️ EL `lead` DICE «ONE WEDNESDAY A MONTH» Y ANTES DECÍA «THE DOGS GET
        THEIR OWN DAY». Aquello daba a entender un día fijo de la semana, que
        es lo que decía la base hasta el 2026-09-21: Wooftop Wednesdays, todos
        los miércoles. Madeline Powers confirmó que el evento es **Wooftop
        Fest, el tercer miércoles de cada mes**, así que la promesa semanal
        pasó a ser falsa. Ver el bloque G de `docs/pedido-al-cliente.md`.
        ══════════════════════════════════════════════════════════════════
      */}
      <PlateHero
        question="Looking for live music tonight in Bonita Springs?"
        title={
          <>
            {"What's on "}
            <span className="block text-sunset-deep">this week</span>
          </>
        }
        lead={`${musicaLarga}, Bingo on Wednesdays, and one Wednesday a month that belongs to the dogs.`}
        photo="/images/venue/whats-on-yard-wide.jpg"
        photoAlt="A full yard on an event afternoon: long table, tent and people under the umbrellas"
      />

      {/*
        ══════════════════════════════════════════════════════════════════
        ⚠️ ACÁ VIVÍAN «DOWNLOAD ICAL» Y «ADD TO GOOGLE CALENDAR», y se fueron
        el 2026-09-17. Camila: «¿esto lo tenía la página vieja? si no, sacalo,
        me parece rarísimo».

        No lo tenía: la auditoría del sitio vigente lo dice con todas las
        letras —«no hay `Event` en JSON-LD, no hay iCal»
        (`current-site-inventory.md` §9)— y el barrido de enlaces externos
        encontró exactamente TRES en las nueve páginas: Toast, Instagram y
        Facebook. Suscribirse al calendario de un bar no es un gesto que este
        público haga, y dos botones arriba de todo pedían justamente eso.

        ⚠️ LO QUE SÍ SE QUEDA ES EL JSON-LD `Event` de más arriba, que es la
        otra mitad del arreglo y la que de verdad importa: es lo que hace que
        Google vea los eventos, y es lo que el calendario de Wix no da porque
        es un iframe de un tercero.

        Con los botones se fue también la ruta `/whats-on/calendar.ics` y
        `buildICal()`: sin quién los linkee eran 130 líneas sirviendo a nadie.
        ══════════════════════════════════════════════════════════════════
      */}

      {/*
        ══════════════════════════════════════════════════════════════════
        ⚠️ ACÁ VIVÍA LA CARD GIGANTE DEL DESTACADO —`FeaturedEvent`, la banda
        oscura con media card de texto y media de precios— y se fue el
        2026-09-21. Camila: «me gustaría no necesitar de esta card gigante (sí
        en bar); acá en What's On quisiera que esté directo el What is coming
        up, y dentro de esa sección de 3 columnas poder destacar algunas cards:
        las destacadas podrían ocupar dos lugares».

        ⚠️ EL DESTACADO NO SE PERDIÓ, CAMBIÓ DE FORMA. Sigue saliendo del tag
        `featured` de la base —lo elige el cliente en el dashboard— y sigue
        publicando sus precios; lo que cambia es que ahora es una tarjeta ANCHA
        dentro de la grilla de «lo que viene», ocupando dos de las tres
        columnas, en vez de una banda propia antes del calendario.

        ⚠️ Y LA CARD GIGANTE SIGUE VIVA EN `/sunset-bar`, que es donde Camila
        la dejó expresamente. `FeaturedEventCard` no se borra: es de esa página
        ahora, y `sections/FeaturedEvent` —la banda que lo envolvía acá— queda
        sin usar a propósito, para el día que otra página quiera abrir con un
        destacado en grande.
        ══════════════════════════════════════════════════════════════════
      */}

      {/*
        ══════════════════════════════════════════════════════════════════════
        ⚠️ ACÁ ARRIBA VIVÍA UN ENCABEZADO DE SECCIÓN —rótulo «Month by month»,
        titular «What is coming up» y una bajada de dos renglones— Y SE FUE EL
        2026-09-21. Camila, con una cruz sobre las tres líneas: «no debería
        tener título, bajada y eso, ir directo al contenido post hero».

        Tiene razón y el argumento es que el hero YA hizo ese trabajo: abre con
        la pregunta, con el H1 y con una bajada que nombra la música, el bingo y
        el día de los perros. Debajo venía un segundo titular igual de grande
        diciendo lo mismo con otras palabras, y entre el hero y el primer evento
        había una pantalla entera de texto de relleno.

        ⚠️ LO ÚNICO QUE ESA BAJADA DECÍA Y NO SE DICE EN OTRO LADO ERA QUE HAY
        DOS VISTAS. No hizo falta reponerlo: el conmutador está a la vista, con
        sus dos nombres escritos, en la barra que ahora abre la sección.

        ⚠️ Y CON EL TITULAR SE FUE EL ÚLTIMO `h2` FIJO DE LA PÁGINA, así que el
        `<h2>` pasa a ser el mes, dentro de la barra. La sección cuelga de él por
        `aria-labelledby`. Ver la nota en `MonthBar`.

        ⚠️ ACÁ TAMBIÉN VIVÍAN LOS FILTROS, CENTRADOS, y se mudaron adentro de la
        barra el mismo día: «en la barra fija como segunda línea». Siguen siendo
        LINKS y siguen dibujándose sólo si hay más de uno, que lo calcula
        `activeFilters()` sobre la programación real: un filtro que al apretarlo
        da cero resultados es una promesa incumplida.
        ══════════════════════════════════════════════════════════════════════
      */}

      {/*
        ══════════════════════════════════════════════════════════════════════
        ⚠️ ESTE `<div>` NO ES UN ENVOLTORIO DE ESTILO: ES LO QUE DEFINE HASTA
        DÓNDE SE PEGA LA BARRA. Un elemento `sticky` se pega DENTRO DE SU PADRE,
        y acá hacen falta las dos cosas a la vez:

          · un padre ALTO, o la barra no tiene recorrido y scrollea como si el
            `sticky` no existiera. Pasó: estuvo envuelta en un `<div>` que la
            contenía sólo a ella y no se pegaba nunca;
          · un padre que TERMINE con el calendario, o la barra se quedaría
            pegada sobre el newsletter y el footer.

        Es el par barra + sección, y por eso van juntos acá adentro.

        ⚠️ LA BARRA VA FUERA DE LA `Section` Y NO ADENTRO, y es lo que le permite
        llegar al borde de la pantalla: la `Section` pagina con `gutter` y
        encierra todo en una `caja` con ancho máximo. La barra se pagina sola.
        Ver su nota.
        ══════════════════════════════════════════════════════════════════════
      */}
      <div>
        <MonthBar
          label={label}
          labelShort={monthLabelShort(year, month)}
          titleId="cal-title"
          prev={{ href: href(prev), label: `Previous month, ${monthLabel(prev.year, prev.month)}` }}
          next={{ href: href(next), label: `Next month, ${monthLabel(next.year, next.month)}` }}
          view={view}
          viewHref={(v) => href({ year, month }, type, v)}
          filters={[{ id: null as string | null, label: 'Everything' }, ...filtros].map((f) => ({
            id: f.id ?? null,
            label: f.label,
            href: href({ year, month }, f.id ?? null),
            current: (f.id ?? null) === type,
          }))}
        />

        {/*
          ⚠️ `bandTop="sm"` Y NO EL `md` DE ANTES. La sección ya no abre con un
          encabezado sino con la barra apoyada encima, y el colchón de una banda
          entera dejaba el contenido flotando lejos de su control. Abajo se
          conserva el aire de siempre, que es lo que la separa del newsletter.
        */}
        <Section band="md" bandTop="sm" labelledBy="cal-title">

        {/*
          ══════════════════════════════════════════════════════════════════
          ⚠️ LOS DOS VACÍOS SON EL MISMO BLOQUE Y ANTES ERAN DOS, uno por bloque
          de la página. Con las dos vistas mostrando el MISMO mes, el motivo por
          el que no hay nada es siempre uno de tres, y la salida cambia con cada
          uno:

            · el mes ya pasó y estamos en grid, que sólo publica lo que viene;
            · el filtro no tiene resultados este mes;
            · el mes no tiene nada cargado todavía.

          Un «no hay eventos» a secas deja a la persona sin salida, que es
          justamente lo que este bloque evita desde que existe.
          ══════════════════════════════════════════════════════════════════
        */}
        {vacio ? (
          <div className="mt-bloque max-w-[58ch]">
            <Heading level={3} role="card">
              {mesPasado
                ? `${label} has already been and gone`
                : type
                  ? 'Nothing of that kind this month'
                  : `Nothing on the books for ${label} yet`}
            </Heading>
            <p className="mt-[10px] text-[16px] leading-[1.7] text-body/80">
              {mesPasado
                ? 'The grid only shows what is still to come. Switch to the calendar to look back at the month, or jump forward with the arrows.'
                : type
                  ? `Clear the filter to see everything on in ${label}.`
                  : 'The calendar for the coming month usually lands around the 10th.'}
            </p>
            <div className="mt-[20px] flex flex-wrap gap-[12px]">
              {/*
                ⚠️ `scroll={false}` ACÁ TAMBIÉN, por la misma razón que en la
                barra: son los mismos tres parámetros y quien los toca está
                mirando este bloque, no el hero. Ver la nota de `MonthBar`.
              */}
              {type ? (
                <ButtonLink href={href({ year, month }, null)} variant="primary" scroll={false}>
                  See everything
                </ButtonLink>
              ) : null}
              <ButtonLink href={href(next)} variant="secondary" scroll={false}>
                Try {monthLabel(next.year, next.month)}
              </ButtonLink>
            </div>
          </div>
        ) : view === 'grid' ? (
          /*
            ══════════════════════════════════════════════════════════════
            LA VISTA GRID: UNA TARJETA POR FECHA.

            ⚠️ SIN CARD ENVOLVENTE, y la del calendario sí la tiene. No es una
            distracción: acá el contenido YA son tarjetas con filete, así que
            meterlas dentro de otra card es una grilla adentro de una caja que
            no separa nada de nada. La grilla del mes, en cambio, es una tabla
            suelta que necesitaba algo que dijera dónde empieza.

            ⚠️ ACÁ HUBO UN `<h3 class="sr-only">` CON EL MES y se fue el
            2026-09-21. Existía porque el mes en la barra era un `<p>`, así que
            quien navegaba por encabezados llegaba a veinte tarjetas sin saber de
            qué mes eran. Ahora el mes ES el `<h2>` de la sección: repetirlo
            invisible acá abajo sería decirlo dos veces.

            ⚠️ LAS PROMOS DE FÚTBOL VIAJAN ACÁ POR PROP, y es el tercer lugar
            que las recibe —los otros dos son la card grande y `/sunset-bar`—.
            Camila, 2026-09-21: «debe mostrar toda la info». La tarjeta filtra
            sola contra el texto de cada evento, así que esto no le pone precios
            al bingo. ESTA LÍNEA SE BORRA CON LA TEMPORADA, junto con las otras
            dos y `content/game-day.ts`.
            ══════════════════════════════════════════════════════════════
          */
          <UpcomingCards
            items={delGrid}
            today={hoy}
            deals={GAME_DAY_DEALS}
            dealsLabel={GAME_DAY_LABEL}
          />
        ) : (
          /*
            ══════════════════════════════════════════════════════════════
            ⚠️ EL MES VA ADENTRO DE UNA CARD GIGANTE Y ANTES IBA SUELTO SOBRE LA
            PÁGINA. Camila, 2026-09-21: «¿podemos este calendario meterlo en una
            card gigante o separarlo de alguna manera de las cards anteriores?».

            El problema era de lectura, no de estética: una grilla sin nada que
            dijera dónde empieza se lee pegada a lo que tiene arriba.

            ⚠️ LA CARD ES DEL COLOR DE LA PÁGINA Y LA SEPARAN EL FILETE, LA
            SOMBRA Y EL AIRE: NO UN COLOR. La primera versión fue `bone`, el
            escalón de 1.08:1 que el sitio usa para cortar dos bloques, y sobre
            una página `paper` se leía como una plancha amarilla. Camila,
            2026-09-21: «necesito que el color de esta card sea muchísimo más
            sutil, casi como el fondo; no quiero que se vea amarilla». El
            amarillo del brand book es color de píldora, no de superficie
            grande.

            ⚠️ SIN `grano`, Y NO ES UN OLVIDO: `check:grano` lo marca. La regla
            del repo es que el grano va en los FONDOS, no en los objetos, y esto
            es un objeto —una card con filete y sombra— aunque mida 900px. Como
            además es del mismo color que la sección, no hay parche que
            disimular.

            ⚠️ EL `pt` ES MÁS CHICO QUE EL `p`: la barra fija ya apoya encima y
            un colchón parejo dejaría la grilla flotando lejos de su control.
            ══════════════════════════════════════════════════════════════
          */
          <div className="mt-[20px] rounded-frame border border-ink/12 bg-paper p-[18px] pt-[8px] sombra-card lg:mt-[28px] lg:p-[32px] lg:pt-[16px]">
            <MonthCalendar
              grid={grid}
              eventsByDate={eventsByDate}
              label={label}
              today={hoy}
              venueName={venue.name}
            />
          </div>
        )}
        </Section>
      </div>

      {/*
        ══════════════════════════════════════════════════════════════════
        ⚠️ ACÁ VIVÍA «THE STANDING LINEUP», LA PROGRAMACIÓN SEMANAL FIJA, y se
        fue el 2026-09-21. Camila, sobre la captura de esa banda entera: «esta
        parte quítala, no debe ir».

        Era una banda `bone` con el happy hour destacado arriba y una fila por
        noche fija —La Noche, Wooftop Wednesdays, Bingo, Game day at the trucks—
        más el botón general a Eventbrite al pie.

        ⚠️ NO SE PIERDE NINGÚN DATO DE LA PÁGINA: los mismos eventos ya salen
        arriba, en las tarjetas de los próximos 15 días y en la grilla del mes,
        porque los tres bloques leen la MISMA lista de la base. Lo que se
        publicaba dos veces ahora se publica una.

        ⚠️ LO QUE SÍ SE FUE ES EL CTA GENERAL A EVENTBRITE, que vivía sólo acá.
        Los eventos con entrada siguen linkeando a su propia página de
        Eventbrite desde su tarjeta, que es el camino que pidió Camila el
        2026-09-15. Si hace falta la puerta al perfil completo, va en otro lado
        y no en una banda que se sacó.
      */}
    </>
  );
}
