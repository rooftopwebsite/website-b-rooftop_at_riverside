import type { Metadata } from 'next';
import Image from 'next/image';
import SpecSlab from '@/components/sections/SpecSlab';
import { ButtonLink } from '@/components/shared/Button';
import DiscHero from '@/components/shared/DiscHero';
import { ArrowSquareOut } from '@/components/shared/Icon';
import { PendingData, PhotoPending } from '@/components/shared/PendingData';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading, SectionHead } from '@/components/shared/Type';
import { RevealItem, StaggerGroup } from '@/components/shared/Motion';
import {
  CONSOLES,
  GAMES,
  GAMES_TOTAL,
  PACKAGES,
  PACKAGE_INCLUDES,
  RATES,
  SCREENS,
  WAIVERS,
  publishedPolicies,
} from '@/content/game-truck';
import { getVenue, venueAddressLine } from '@/lib/venue';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({ route: '/game-truck' });

/**
 * `/game-truck` — la segunda página con precios del sitio.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ES EL CALCO DE LA FICHA DE defoodtruckclub.nl/foodtrucks/pizza-foodtruck,
 * pedido así. Camila, 2026-09-16: «editemos la landing de game truck usando la
 * estructura que habías hecho antes para cada food truck, tomando la
 * referencia y copiando estructura de esta pero adaptando los colores y font y
 * poniendo nuestro contenido».
 *
 * O sea que el template que se guardó al unificar los cuatro trucks en una
 * sola página —el commit lo dejó escrito: «se reutiliza en /game-truck»— se
 * usa acá. `TruckHero` pasó a ser `DiscHero` y `TruckFacts` a ser `SpecSlab`.
 *
 * LA ESTRUCTURA DE ALLÁ, sección por sección, y en qué se convierte acá:
 *
 *   1. hero con el nombre gigante y la foto            → el mismo, con el disco
 *   2. relato + fila de fotos chicas                   → «what is in there»
 *   3. ficha técnica en oscuro con los datos duros     → las specs del camión
 *   4. «het menu», el listado de producto              → los juegos
 *   5. precios (allá no los hay)                       → walk up y los paquetes
 *   6. comparativa de dos columnas                     → los dos paquetes
 *   7. cierre con contacto y teléfono                  → el mismo
 *
 * ⚠️ LO QUE NO SE COPIA: los testimonios (no tenemos ninguno), la grilla de
 * logos de clientes (tampoco) y el carrusel de otros trucks (el gaming truck
 * es uno solo). Inventar cualquiera de las tres era el riesgo obvio de un
 * calco y las tres se dejaron afuera.
 *
 * ⚠️ LA COMPARATIVA DE DOS COLUMNAS NO USA `CompareSlab`. Ese componente
 * enfrenta lo nuestro contra otra cosa con ✓ y ✗, y acá las dos columnas son
 * los DOS PAQUETES: ninguno es el malo. Lo que sí se importa de esa pieza es
 * su tratamiento visual, que también sale de la referencia: tarjeta clara,
 * filete punteado por dentro y el rótulo como sticker pisando el borde.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ ES UN CAMIÓN Y NO UNA SALA, y por eso la ruta no es `/game-room`. El
 * copy del propio cliente dice «right in our specially designed truck» y
 * titula «SWFL's First Gaming Truck Has Arrived».
 *
 * ⚠️ TODOS LOS NÚMEROS SALEN DEL SITIO VIGENTE. Ver `content/game-truck.ts`.
 * Lo único que NO se publica son las cantidades por consola, porque el sitio
 * y el brief se contradicen.
 *
 * ⚠️ LAS POLÍTICAS SON LO QUE DICEN LOS DOS WAIVERS que el cliente ya publica,
 * resumido y con link al texto completo. Las tres que un visitante pregunta y
 * los waivers no contestan —edad mínima, comida adentro, si hay que reservar—
 * NO se inventan: no se renderizan.
 *
 * ⚠️ EL `id="policies"` ES DESTINO DE DOS 301, los de `/game-zone-waiver` y
 * `/bar-games-waiver`. No se renombra sin tocar `next.config.ts`.
 *
 * ⚠️ RITMO: paper (hero y relato) → deep (specs) → paper (juegos) → bone
 * (precios) → paper (políticas) → cream (cierre). Una sola oscura y una sola
 * crema, y ninguna banda de color pegada a otra: es lo que audita
 * `npm run check:surfaces`, que con el hero de foto anterior daba rojo.
 */
export default async function GameTruckPage() {
  const venue = await getVenue();
  const politicas = publishedPolicies();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(breadcrumbJsonLd([{ name: 'Gaming Truck', path: '/game-truck' }])),
        }}
      />

      {/*
        ══════════════════════════════════════════════════════════════════
        EL HERO DEL DISCO.

        ⚠️ EL H1 VA EN DOS CUERPOS Y ES UN SOLO TÍTULO. La referencia pone el
        nombre del producto gigante y la promesa chica; nuestro h1 declarado en
        `seo-pages.ts` es la frase entera, «Southwest Florida's first gaming
        truck», que a 112px son cuatro renglones de titular.

        Partirlo en dos cuerpos resuelve las dos cosas a la vez: se lee como la
        referencia y el texto del h1 sigue siendo el mismo string que audita
        `npm run check:seo`. El `{' '}` entre los dos spans NO es decorativo,
        es lo que hace que el texto concatenado tenga el espacio: JSX se come
        el salto de línea entre elementos.
        ══════════════════════════════════════════════════════════════════
      */}
      <DiscHero
        eyebrow="Parked in the yard"
        title={
          <>
            {/* ⚠️ APÓSTROFO RECTO Y NO `&rsquo;`. Es el que tiene el h1 declarado
                en `seo-pages.ts`, y `npm run check:seo` los compara carácter por
                carácter. Es además la convención de los otros titulares del
                sitio: ver `{"Bonita's only rooftop"}` en `/sunset-bar`.

                ⚠️ EL ESPACIO VA ADENTRO DEL PRIMER SPAN y no suelto entre los
                dos. Entre dos elementos `block`, un nodo de texto suelto arma
                una caja anónima con su propio renglón; adentro del span se
                colapsa al pintar y sigue estando en el texto del h1, que es lo
                que audita el check. */}
            <span className="block text-d5 font-bold lg:text-d4">{"Southwest Florida's first "}</span>
            <span className="block text-banda leading-[0.88]">gaming truck</span>
          </>
        }
        lead="Air conditioning, six screens and ten dollars to get on."
        photo={null}
        photoAlt={null}
        photoBrief="El camión de gaming abierto, de frente, con las pantallas encendidas y gente jugando adentro. Horizontal, de día o de noche."
        crumbs={[{ name: 'Gaming Truck', path: '/game-truck' }]}
      >
        <ButtonLink href="#packages" variant="primary">
          Book a party
        </ButtonLink>
        <ButtonLink href="#games" variant="secondary">
          See the games
        </ButtonLink>
      </DiscHero>

      {/* ══ 2. El relato y la fila de fotos ══════════════════════════════ */}

      <Section band="lg" bandTop="md" labelledBy="inside-title">
        <SectionHead
          eyebrow="What is in there"
          eyebrowTone="plum"
          id="inside-title"
          title="Three consoles, six screens, one coach"
          lead="It is a trailer built for this, parked in the yard, with the air conditioning on. In Florida that last part is the whole pitch."
        />

        <div className="mt-bloque grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <Heading level={3} role="label">
              The consoles
            </Heading>
            <ul className="m-0 mt-4 flex list-none flex-wrap gap-2 p-0">
              {CONSOLES.map((c) => (
                <li
                  key={c}
                  className="rounded-pill border border-ink/20 px-4 py-1.5 font-body text-base"
                >
                  {c}
                </li>
              ))}
            </ul>
            {/* ⚠️ EL PENDIENTE DE «CUÁNTAS DE CADA UNA» NO VA ACÁ, va en la ficha
                técnica de la banda oscura, que es el bloque de datos duros. Acá
                estaba repetido y el mismo marcador dos veces en una página se
                lee como un error, no como un pendiente. */}
          </div>

          <div>
            <Heading level={3} role="label">
              How it runs
            </Heading>
            <p className="mt-4 max-w-[52ch] font-body text-base leading-[1.65] text-body/80">
              A Game Coach is on board the whole time: sets up the screens, changes the game when
              the room gets bored of it and keeps the controllers in circulation. You do not book a
              console, you book the truck.
            </p>
          </div>
        </div>

        {/*
          ══════════════════════════════════════════════════════════════════
          LA FILA DE FOTOS CHICAS, que es lo que la referencia pone al pie de
          cada bloque de relato: cuatro tomas en una tira horizontal, todas del
          mismo alto, sin pie ni título.

          ⚠️ TRES DE LAS CUATRO SON HUECOS Y ASÍ SE PUBLICA. Del gaming truck
          tenemos una sola imagen usable y es de stock —el joystick que ya
          aparece en `/our-story`—; la otra que hay en el repo,
          `/images/game-truck.jpg`, es el flyer de Instagram con el logo y el
          texto quemado, que no es una foto del camión y no entra en una tira
          de fotos.

          Los briefs describen las cuatro tomas concretas que hay que pedirle
          al cliente. Es la regla del proyecto: el hueco marcado es lo que hace
          que la foto se pida.
          ══════════════════════════════════════════════════════════════════
        */}
        <StaggerGroup as="ul" className="mt-bloque grid list-none grid-cols-2 gap-4 p-0 lg:grid-cols-4 lg:gap-5">
          <RevealItem as="li">
            <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-fog">
              <Image
                src="/images/game-controller.jpg"
                alt="Hands on a PlayStation controller in front of a screen"
                fill
                sizes="(min-width: 1024px) 280px, 45vw"
                className="object-cover"
              />
            </div>
          </RevealItem>
          {[
            'El interior del camión a lo largo: las seis pantallas encendidas en fila y los asientos. Vertical.',
            'Un chico con el joystick, de perfil, concentrado en la pantalla. Vertical.',
            'El Game Coach explicándole el juego a dos chicos adentro del camión. Vertical.',
          ].map((brief) => (
            <RevealItem as="li" key={brief}>
              <PhotoPending brief={brief} ratio="aspect-[4/5]" />
            </RevealItem>
          ))}
        </StaggerGroup>
      </Section>

      {/* ══ 3. La ficha técnica, en la única banda oscura ════════════════ */}

      <Section tone="deep" band="lg" labelledBy="specs-title">
        <SpecSlab
          id="specs-title"
          title="The truck, on paper"
          photo={null}
          photoAlt={null}
          photoBrief="El camión de gaming cerrado, desde afuera, con el patio alrededor. Se tiene que ver que es un trailer y no una sala."
          numbers={[
            { value: String(SCREENS), label: 'high definition screens' },
            {
              value: GAMES_TOTAL,
              label: 'games on board',
              note: `${GAMES.length} of them are published. E rated through M rated.`,
            },
            { value: '1', label: 'Game Coach, on site, the whole session' },
          ]}
          facts={[
            ['Consoles', CONSOLES.join(', ')],
            [
              'Units of each',
              <PendingData
                key="units"
                tone="dark"
                label="TBD"
                detail="El sitio dice 6 pantallas sin contar unidades; el brief dice 4 PS5, 4 Xbox y 2 Switch 2. No coinciden."
              />,
            ],
            ['Climate', 'Air conditioned, which in Florida is not a detail'],
            ['Where', 'The yard, under the rooftop'],
          ]}
        >
          <p className="m-0 max-w-[62ch] font-body text-lead font-light leading-[1.65] text-paper/92">
            It is a trailer the venue built for this, and it stays parked in the yard. You can get
            on a controller for half an hour without booking anything, or take the whole truck for
            two hours and bring your own crowd.
          </p>
        </SpecSlab>
      </Section>

      {/* ══ 4. El menú: los juegos ═══════════════════════════════════════ */}

      <Section band="lg" labelledBy="games-title" id="games" className="scroll-mt-24">
        {/*
          ⚠️ EL ISOTIPO ARRIBA DEL TÍTULO SALE DE LA REFERENCIA: su «Het menu»
          abre con el logo de la marca del truck centrado y el listado debajo.
          Acá va el isotipo del camión, que es la pieza de marca que el sitio
          usa para hablar de los trucks.
        */}
        <div className="flex justify-center">
          <Image
            src="/brand/isotype-truck.svg"
            alt=""
            aria-hidden="true"
            width={552}
            height={390}
            className="w-20 lg:w-24"
          />
        </div>

        <SectionHead
          align="center"
          eyebrow="The library"
          eyebrowTone="deep"
          id="games-title"
          title="What is on the shelf"
          lead="Sports, shooters, racing and everything Nintendo. The coach can put any of these up, and the rating is on you."
          className="mt-8"
        />

        {/*
          ══════════════════════════════════════════════════════════════════
          ⚠️ ACÁ HABÍA UNA MARQUESINA CON LOS 23 NOMBRES Y SE FUE. La tira
          pasaba los títulos en 22px, en loop, y era lo único que la página
          decía de los juegos.

          En la referencia el listado de producto es una LISTA: se lee de
          arriba abajo, se busca el que uno quiere y ahí termina. Es lo que un
          padre que está eligiendo dónde hacer el cumpleaños necesita hacer con
          esta sección, y una tira en movimiento es exactamente lo contrario.

          Y las dos cosas juntas no van: serían los mismos 23 nombres dichos
          dos veces en la misma página, con cuatro renglones de distancia.
          ══════════════════════════════════════════════════════════════════
        */}
        <ul className="m-0 mt-bloque grid list-none grid-cols-1 gap-x-12 gap-y-0 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {GAMES.map((g) => (
            <li
              key={g}
              className="flex items-baseline gap-3 border-b border-ink/12 py-3.5"
            >
              <span aria-hidden="true" className="size-1.5 shrink-0 rounded-pill bg-river" />
              <span className="font-display text-d6 font-semibold uppercase leading-[1.2] text-ink">
                {g}
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-8 max-w-[62ch] font-body text-base leading-[1.65] text-body/80">
          The truck carries {GAMES_TOTAL} titles and these {GAMES.length} are the ones on the
          published list. The rest:{' '}
          <PendingData
            label="TBD"
            detail="El sitio dice «30+ games» pero sólo publica 23 títulos. Falta que el cliente pase la lista completa."
          />
        </p>
      </Section>

      {/* ══ 5 y 6. Los precios: sin reservar, y los dos paquetes ═════════ */}

      <Section tone="bone" band="lg" labelledBy="rates-title" id="packages" className="scroll-mt-24">
        <SectionHead
          align="center"
          eyebrow="What it costs"
          eyebrowTone="deep"
          id="rates-title"
          title="Ten dollars, half an hour"
          lead="No package, no booking, no minimum. Come up to the truck and get on a controller."
        />

        <ul className="mx-auto mt-bloque flex max-w-[46rem] list-none flex-col gap-1 p-0">
          {RATES.map((r) => (
            <li
              key={r.label}
              className="flex flex-col gap-1 border-b border-ink/15 py-5 last:border-b-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
            >
              <span className="font-display text-d6 font-semibold uppercase text-ink lg:text-d5">
                {r.label}
              </span>
              <span className="shrink-0 font-display text-d5 font-semibold uppercase tabular-nums text-sunset-deep lg:text-d4">
                ${r.price}
                <span className="ml-2 font-body text-dato font-normal normal-case tracking-normal text-body/75">
                  {r.unit}
                  {r.note ? `, ${r.note}` : ''}
                </span>
              </span>
            </li>
          ))}
        </ul>

        {/*
          ══════════════════════════════════════════════════════════════════
          LOS DOS PAQUETES, EN EL TRATAMIENTO DE LA COMPARATIVA DE LA
          REFERENCIA: dos tarjetas claras, filete punteado por dentro y el
          rótulo montado como sticker sobre el borde de arriba.

          ⚠️ EL STICKER LLEVA LOS DÍAS Y NO EL NOMBRE DEL PAQUETE, porque los
          días SON la diferencia. Los dos paquetes se llaman «weeknight» y
          «weekend», que es decir lo mismo dos veces: puesto el rango arriba,
          el nombre del paquete queda libre para el titular y la tarjeta se
          entiende de un vistazo.

          ⚠️ LA ÚNICA OTRA DIFERENCIA ES LA HORA EXTRA, y va sola en su
          renglón. Todo lo demás es idéntico en los dos, así que va UNA vez
          abajo, en la lista compartida. Repetir los cinco ítems en cada
          tarjeta era justamente el error: parecería que hay dos ofertas
          distintas cuando hay una con dos precios.

          ⚠️ LAS TARJETAS VAN EN `paper` SOBRE `bone`. En `CompareSlab` son
          `bone` sobre la losa oscura; acá la sección ya es `bone`, así que la
          tarjeta tiene que ser el tono de más arriba o no se despega: bone
          sobre bone es 1:1.
          ══════════════════════════════════════════════════════════════════
        */}
        <div className="mt-bloque grid items-stretch gap-8 lg:grid-cols-2 lg:gap-10">
          {PACKAGES.map((pkg) => (
            <article
              key={pkg.slug}
              className="relative flex flex-col rounded-frame bg-paper px-6 pt-14 pb-10 text-center sombra-card sm:px-10 sm:pt-16"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-3.5 rounded-shell border border-dashed border-teal600/45"
              />

              {/*
                El sticker, con la misma construcción que los de `CompareSlab`
                y los pasos de la home: `absolute` sobre el borde, partido
                exactamente en el filo por `-translate-y-1/2`, y la plancha de
                color propia detrás para que la sombra siga el contorno de la
                pieza y no el de las letras.
              */}
              <span
                aria-hidden="true"
                className="sticker absolute -top-px left-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
              >
                <span className="block rounded-pill bg-cream px-5 py-2.5">
                  <span className="block font-display text-d6 font-bold uppercase leading-none whitespace-nowrap text-deep">
                    {pkg.days}
                  </span>
                </span>
              </span>

              <div className="relative flex flex-1 flex-col">
                <Heading level={3} className="mt-6 text-d5 lg:text-d4">
                  {pkg.name}
                </Heading>

                <p className="m-0 mt-6 font-display text-titan font-semibold uppercase leading-[0.85] tabular-nums text-ink">
                  ${pkg.price}
                </p>
                <p className="m-0 mt-2 font-body text-lead font-light text-body/80">
                  for {pkg.hours} hours, all in
                </p>

                {/*
                  ⚠️ EL MONTO DE LA HORA EXTRA VA EN `ink` Y NO EN
                  `sunset-deep`, y lo decidió `npm run a11y`. El naranja oscuro
                  da 3.54:1 sobre blanco: alcanza para TEXTO GRANDE, que es lo
                  que son los $10 y los $5 de la tira de arriba a 28px, pero
                  acá el monto va en 22px y a ese cuerpo la barra es 4.5:1. Axe
                  lo marcó `serious` en las dos anchuras.

                  Está dicho en la nota de `Accent`, en `Type.tsx`: este color
                  existe para una palabra dentro de un titular de display y no
                  para acentuar cuerpo.
                */}
                <p className="m-0 mt-auto pt-8 font-body text-base text-body/80">
                  Each extra hour{' '}
                  <span className="font-display text-d6 font-semibold uppercase tabular-nums text-ink">
                    ${pkg.extraHour}
                  </span>
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-frame border border-ink/12 bg-paper px-7 py-8 sm:px-10">
          <Heading level={3} role="label">
            Both packages include
          </Heading>
          <ul className="m-0 mt-5 grid list-none gap-3 p-0 sm:grid-cols-2">
            {PACKAGE_INCLUDES.map((i) => (
              <li key={i} className="flex items-start gap-2.5 font-body text-base leading-[1.6]">
                <span
                  aria-hidden="true"
                  className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-pill bg-teal600 text-[12px] font-bold text-paper"
                >
                  ✓
                </span>
                <span>
                  <span className="sr-only">Included: </span>
                  {i}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <ButtonLink href="/events#inquire" variant="primary">
              Ask about a party
            </ButtonLink>
          </div>
        </div>
      </Section>

      {/* ══ Las políticas ════════════════════════════════════════════════ */}

      <Section band="lg" labelledBy="policies-title" id="policies" className="scroll-mt-24">
        <SectionHead
          eyebrow="The rules"
          eyebrowTone="terra"
          id="policies-title"
          title="What you are agreeing to"
          lead="The short version of the two waivers you sign. Both are linked in full at the bottom, and they are the ones that count."
        />

        <div className="mt-bloque grid gap-8 lg:grid-cols-2 lg:gap-10">
          {politicas.map((p) => (
            <article key={p.title} className="border-t-2 border-ink/20 pt-5">
              <Heading level={3} role="card">
                {p.title}
              </Heading>
              <p className="mt-2.5 max-w-[52ch] font-body text-base leading-[1.7] text-body/80">
                {p.body}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-ink/20 pt-6 sm:flex-row sm:flex-wrap sm:gap-8">
          {WAIVERS.map((w) => (
            <a
              key={w.href}
              href={w.href}
              target="_blank"
              rel="noopener noreferrer"
              className="link-texto inline-flex items-center gap-1.5 font-body text-base font-semibold"
            >
              {w.label}
              <ArrowSquareOut className="size-4" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ))}
        </div>
      </Section>

      {/* ══ 7. El cierre ═════════════════════════════════════════════════ */}

      {/*
        ══════════════════════════════════════════════════════════════════
        ⚠️ ES EL CIERRE DE LA REFERENCIA —«Trek gekregen?» y «Vragen?», el
        llamado y los datos de contacto uno debajo del otro— con la forma que
        `/food-trucks` ya usa para su banner: panel de esquinas muy
        redondeadas, filete punteado por dentro separado del borde, y el
        isotipo apoyado en una esquina.

        ⚠️ ANTES ERA UNA SEGUNDA BANDA `deep` Y POR ESO LA PÁGINA DABA ROJO en
        `npm run check:surfaces`: con la ficha técnica en oscuro serían dos
        oscuras, y el guard admite una sola cada tres secciones. La crema es la
        otra superficie de color del sitio y acá no compite con nada: la
        sección de arriba es blanca.
        ══════════════════════════════════════════════════════════════════
      */}
      <Section tone="cream" band="lg" labelledBy="gt-next">
        <div className="relative px-2 py-2 text-center sm:px-8 sm:py-6">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-shell border border-dashed border-deep/35"
          />

          <Image
            src="/brand/isotype-truck.svg"
            alt=""
            aria-hidden="true"
            width={552}
            height={390}
            className="pointer-events-none absolute right-8 bottom-8 hidden w-24 opacity-30 sm:block lg:right-12 lg:bottom-10 lg:w-32"
          />

          <div className="relative px-4 py-10 sm:py-12">
            <Heading level={2} id="gt-next" className="mx-auto max-w-[18ch] text-d3 lg:text-d2">
              It is parked in the yard
            </Heading>
            <p className="mx-auto mt-5 max-w-[52ch] font-body text-lead font-light leading-[1.5] text-ink">
              Same address as everything else. Come up, play half an hour, and go get something to
              eat from whichever truck smells best.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/events#inquire" variant="dark">
                Book a party
              </ButtonLink>
              <ButtonLink href="/food-trucks" variant="outline">
                See the food trucks
              </ButtonLink>
            </div>
            <p className="mt-8 font-body text-base text-body/80">
              {venueAddressLine(venue)} &middot;{' '}
              <a href={venue.phoneHref} className="link-texto font-semibold">
                {venue.phone}
              </a>
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
