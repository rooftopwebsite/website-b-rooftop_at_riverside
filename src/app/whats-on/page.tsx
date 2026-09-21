import type { Metadata } from 'next';
import Link from 'next/link';
import MonthCalendar from '@/components/sections/MonthCalendar';
import UpcomingCards from '@/components/sections/UpcomingCards';
import { ButtonLink } from '@/components/shared/Button';
import PlateHero from '@/components/shared/PlateHero';
import Section from '@/components/shared/Section';
import { Heading, SectionHead } from '@/components/shared/Type';
import {
  activeFilters,
  featuredEvent,
  getVenueEvents,
  isTicketed,
  matchesFilter,
} from '@/content/events';
import { GAME_DAY_DEALS, GAME_DAY_LABEL } from '@/content/game-day';
import { fraseEntretenimiento } from '@/content/entertainment';
import { getVenue, venueAddressLine } from '@/lib/venue';
import {
  monthGrid,
  monthKey,
  monthLabel,
  nextByEvent,
  occurrencesByDate,
  occurrencesInMonth,
  parseMonth,
  shiftMonth,
  todayInVenue,
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
  searchParams: Promise<{ month?: string; type?: string }>;
}) {
  const sp = await searchParams;
  const { year, month } = parseMonth(sp.month);
  const type = sp.type ?? null;
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
   * QUIÉN VA EN GRANDE. Sale del tag de la base, no de acá: es el evento que
   * el cliente marca como destacado en el dashboard. Lo único que hace la
   * página es pasar su slug a la grilla, que le da el doble de ancho.
   */
  const destacado = await featuredEvent();

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
   * LO QUE VIENE, QUE AHORA ES LO PRIMERO DE LA PÁGINA.
   *
   * ⚠️ EL MISMO FILTRO QUE LA GRILLA. Los filtros son cinco píldoras arriba
   * de todo y gobiernan la pantalla entera: si alguien toca «Sports» y las
   * tarjetas de arriba no se mueven, el filtro parece roto. La única lista
   * que NO se filtra sigue siendo la programación semanal de más abajo, y el
   * motivo está anotado en su bloque.
   *
   * ⚠️ 15 DÍAS Y UN EVENTO UNA SOLA VEZ. El tope de 8 es una red por si un
   * mes de festival carga veinte fechas distintas, no el criterio de corte.
   * Ver `nextByEvent()`.
   * ══════════════════════════════════════════════════════════════════════
   */
  const proximos = nextByEvent(eventos, hoy, 15, 8).filter((o) => matchesFilter(o.event, type));

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
  const href = (m: { year: number; month: number }, t: string | null = type) =>
    `/whats-on?month=${monthKey(m.year, m.month)}${t ? `&type=${t}` : ''}`;

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

      <Section band="md" labelledBy="proximos-title">
        {/*
          ══════════════════════════════════════════════════════════════
          LOS FILTROS. Son LINKS y no botones: cada filtro es una URL que se
          puede compartir, que el servidor resuelve, que funciona con
          JavaScript desactivado y que se puede medir en analítica.

          ⚠️ SÓLO SE DIBUJAN LOS QUE TIENEN EVENTOS. `activeFilters()` los
          calcula sobre la programación real: un filtro que al apretarlo da
          cero resultados es una promesa incumplida.

          ⚠️ `aria-current` marca el activo. El color no alcanza.
          ══════════════════════════════════════════════════════════════
        */}
        {filtros.length > 1 ? (
          /*
            ⚠️ LOS FILTROS VAN CENTRADOS Y CON COLOR DESDE EL 2026-09-21.
            Camila: «esta información la quiero centrada y con color, le falta
            vida y estilo rooftop; centrá el contenido del título y su bajada y
            todo, y los tags también centrados y que no sean con negro».

            Iban pegados a la izquierda con el activo en `ink`, o sea una
            píldora negra: el único negro macizo de una página cuya paleta es
            verde, naranja y crema. Ahora el activo es el naranja de marca con
            tinta oscura encima —que es la regla del token, el blanco sobre
            `sunset` da 2.54:1— y los inactivos son filete y letra en verde.
          */
          <nav aria-label="Filter events by type" className="mb-[28px]">
            <ul className="m-0 flex list-none flex-wrap justify-center gap-[8px] p-0">
              {[{ id: null as string | null, label: 'Everything' }, ...filtros].map((f) => {
                const activo = (f.id ?? null) === type;
                return (
                  <li key={f.id ?? 'all'}>
                    <Link
                      href={href({ year, month }, f.id ?? null)}
                      aria-current={activo ? 'true' : undefined}
                      className={[
                        'inline-block rounded-pill px-[16px] py-[7px] text-caption font-bold uppercase tracking-[0.1em] transition-colors',
                        activo
                          ? 'bg-sunset text-ink shadow-btn'
                          : 'border border-teal600/35 text-deep hover:border-teal600 hover:bg-mint/50',
                      ].join(' ')}
                    >
                      {f.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        ) : null}

        {/*
          ══════════════════════════════════════════════════════════════
          BLOQUE 1: LO QUE VIENE, EN TARJETAS CON AFICHE.

          ⚠️ OCUPA EL LUGAR DE LA VISTA «LIST», que era lo primero que veía
          quien abría el calendario: días apilados, todo texto, sin una sola
          imagen, aunque los eventos traen afiche desde el 2026-09-11.

          ⚠️ LAS CARAS ARRIBA Y EL MAPA ABAJO. Son dos preguntas distintas y
          por eso son dos bloques y no dos pestañas. Ver `UpcomingCards`.
          ══════════════════════════════════════════════════════════════
        */}
        {/*
          ⚠️ CENTRADO Y CON UNA PALABRA EN COLOR. Camila, 2026-09-21: «centrá el
          contenido del título y su bajada y todo», «le falta vida y estilo
          rooftop». El encabezado iba alineado a la izquierda y entero en tinta,
          que es la forma más plana que tiene el kit.

          ⚠️ «COMING UP» EN `sunset-deep` NO ES UN ADORNO: es la misma ley que
          rige los heros del sitio —«recordá siempre al menos una palabra en los
          heros destacar con color»— aplicada al encabezado que abre el
          calendario. Y es `sunset-deep` y no `sunset` porque acá el fondo es
          claro: el naranja de marca como tinta sobre claro da 2.35:1.

          ⚠️ EL RÓTULO VA EN `deep`, QUE ES EL TONO DE LA CASA. Estuvo un rato
          en `magenta` y Camila lo frenó: «cuidado con el The next 15 days, ese
          color no lo usamos nunca creo; que tenga lógica con los demás, debe
          seguir la misma estética». Tenía razón y el número lo dice: de los 26
          rótulos del sitio, 12 van en `deep`, 9 en `plum`, 5 en `terra` y el
          magenta era ÉSTE, o sea el único. Un color que aparece una sola vez no
          es un acento, es un error de tipeo.
        */}
        <SectionHead
          eyebrow="The next 15 days"
          eyebrowTone="deep"
          align="center"
          id="proximos-title"
          title={
            <>
              What is <span className="text-sunset-deep">coming up</span>
            </>
          }
          lead="Everything on the books for the next two weeks. What runs more than once says so on the card."
        />

        {proximos.length > 0 ? (
          /*
            ⚠️ LAS PROMOS DE FÚTBOL TAMBIÉN VIAJAN ACÁ, y es el tercer lugar
            que las recibe por prop —los otros dos son la card grande de esta
            misma página y `/sunset-bar`—. Camila, 2026-09-21: «debe mostrar
            toda la info». La tarjeta filtra sola contra el texto de cada
            evento, así que esto no le pone precios al bingo.

            ⚠️ ESTA LÍNEA SE BORRA CON LA TEMPORADA, junto con las otras dos y
            `content/game-day.ts`.
          */
          <UpcomingCards
            items={proximos}
            deals={GAME_DAY_DEALS}
            dealsLabel={GAME_DAY_LABEL}
            featuredSlug={destacado?.slug ?? null}
          />
        ) : (
          /*
            ⚠️ EL VACÍO DE LAS TARJETAS NO ES EL DEL MES. Acá el motivo es
            siempre el mismo —no hay nada en quince días— o el filtro, y en
            los dos casos la grilla de abajo sigue teniendo qué mostrar, así
            que la salida es mirar el mes, no cambiar de mes.
          */
          <p className="mt-[24px] max-w-[58ch] text-[16px] leading-[1.7] text-body/80">
            {type
              ? 'Nothing of that kind in the next two weeks. Clear the filter above, or look at the month below.'
              : 'Nothing on the books for the next two weeks yet. The calendar for the coming month usually lands around the 10th.'}
          </p>
        )}

        {/*
          ══════════════════════════════════════════════════════════════
          BLOQUE 2: EL MES. Ver `MonthCalendar`.
          ══════════════════════════════════════════════════════════════
        */}
        {/*
          ══════════════════════════════════════════════════════════════
          ⚠️ EL MES VA ADENTRO DE UNA CARD GIGANTE Y ANTES IBA SUELTO SOBRE LA
          PÁGINA. Camila, 2026-09-21: «¿podemos este calendario meterlo en una
          card gigante o separarlo de alguna manera de las cards anteriores?».

          El problema era de lectura, no de estética: arriba hay una grilla de
          tarjetas con borde y abajo empezaba otra grilla —la del mes— sin nada
          que dijera dónde termina una y empieza la otra. Dos grillas pegadas
          se leen como una sola que cambió de forma a mitad de camino.

          ⚠️ LA CARD ES DEL COLOR DE LA PÁGINA Y LA SEPARAN EL FILETE, LA
          SOMBRA Y EL AIRE: NO UN COLOR. La primera versión fue `bone`, que es
          el escalón de 1.08:1 que el sitio usa para cortar dos bloques, y sobre
          una página `paper` se leía como una plancha amarilla. Camila,
          2026-09-21: «necesito que el color de esta card sea muchísimo más
          sutil, casi como el fondo; no quiero que se vea amarilla».

          Y tiene razón de fondo: el amarillo del brand book —`cream`— es color
          de píldora, no de superficie grande, y `bone` tirado a 900px de ancho
          empieza a leerse como su pariente. Con el mismo `paper` de la página,
          lo único que dice dónde empieza la card es su borde, que es
          exactamente lo que hacía falta: separar, no pintar.

          ⚠️ SIN `grano`, Y NO ES UN OLVIDO: `check:grano` lo marca. La regla
          del repo es que el grano va en los FONDOS, no en los objetos, y esto
          es un objeto —una card con filete y sombra— aunque mida 900px. Como
          además es del mismo color que la sección, no hay parche que disimular.
          ══════════════════════════════════════════════════════════════
        */}
        <div className="mt-[56px] rounded-frame border border-ink/12 bg-paper p-[18px] sombra-card lg:mt-[80px] lg:p-[32px]">
        {/* ── Barra de navegación del mes ─────────────────────────────── */}
        <div className="flex flex-col gap-[16px] border-b border-ink/15 pb-[16px] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-[12px]">
            <Link
              href={href(prev)}
              rel="prev"
              className="grid h-[40px] w-[40px] place-items-center rounded-btn border border-ink/20 transition-colors hover:border-ink hover:bg-ink hover:text-paper"
            >
              <span className="sr-only">Previous month, {monthLabel(prev.year, prev.month)}</span>
              <svg width="9" height="14" viewBox="0 0 9 14" fill="none" aria-hidden="true">
                <path d="M8 1L2 7l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Heading level={2} id="cal-title" className="text-d5 lg:text-d4">
              {label}
            </Heading>
            <Link
              href={href(next)}
              rel="next"
              className="grid h-[40px] w-[40px] place-items-center rounded-btn border border-ink/20 transition-colors hover:border-ink hover:bg-ink hover:text-paper"
            >
              <span className="sr-only">Next month, {monthLabel(next.year, next.month)}</span>
              <svg width="9" height="14" viewBox="0 0 9 14" fill="none" aria-hidden="true">
                <path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          {/*
            ⚠️ ACÁ ESTABA EL CONMUTADOR «LIST | MONTH» y se fue el 2026-09-17.
            Obligaba a elegir entre las dos mitades de la respuesta y escondía
            la otra, y su opción por defecto era la lista de texto: o sea que
            el calendario de una página que se llama «the calendar» estaba a
            un clic de distancia y apagado. Ahora las dos cosas están, una
            arriba de la otra, y no hay nada que elegir.
          */}
        </div>

        {occurrences.length === 0 ? (
          /*
            ⚠️ EL VACÍO DICE QUÉ HACER, y distingue los dos motivos: que no
            haya nada cargado ese mes, o que el filtro no tenga resultados. Un
            «no hay eventos» a secas deja a la persona sin salida.
          */
          <div className="mt-bloque max-w-[58ch]">
            <Heading level={3} role="card">
              {type ? 'Nothing of that kind this month' : `Nothing on the books for ${label} yet`}
            </Heading>
            <p className="mt-[10px] text-[16px] leading-[1.7] text-body/80">
              {type
                ? `Clear the filter to see everything on in ${label}. The standing weekly lineup below runs every week regardless.`
                : 'The calendar for the coming month usually lands around the 10th. The standing weekly lineup below runs every week regardless.'}
            </p>
            <div className="mt-[20px] flex flex-wrap gap-[12px]">
              {type ? (
                <ButtonLink href={href({ year, month }, null)} variant="primary">
                  See everything
                </ButtonLink>
              ) : null}
              <ButtonLink href={href(next)} variant="secondary">
                Try {monthLabel(next.year, next.month)}
              </ButtonLink>
            </div>
          </div>
        ) : (
          <MonthCalendar
            grid={grid}
            eventsByDate={eventsByDate}
            label={label}
            today={hoy}
            venueName={venue.name}
          />
        )}
        </div>
      </Section>

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
