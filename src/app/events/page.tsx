import type { Metadata } from 'next';
import EventGameTruck from '@/components/sections/EventGameTruck';
import EventSpaces from '@/components/sections/EventSpaces';
import EventTypes from '@/components/sections/EventTypes';
import InquiryForm from '@/components/sections/InquiryForm';
import { ButtonLink } from '@/components/shared/Button';
import { CountUp, RevealItem, StaggerGroup } from '@/components/shared/Motion';
import PageHero from '@/components/shared/PageHero';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading, SectionHead } from '@/components/shared/Type';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowSquareOut } from '@/components/shared/Icon';
import { PhotoPending } from '@/components/shared/PendingData';
import { EVENT_FAMILIES } from '@/content/spaces';
import {
  ENHANCEMENTS,
  ENHANCEMENTS_NOTE,
  FEES,
  EVENTS_PDF,
  FOOD_OPTIONS,
  GALERIA,
  RENTAL,
  RENTAL_DEPOSIT,
  RENTAL_MINIMUM_HOURS,
} from '@/content/events-pricing';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  route: "/events",
  image: {
    url: '/images/events/event-a.jpg',
    width: 1800,
    height: 1200,
    alt: 'Guests at a private event at Rooftop at Riverside',
  },
});

/**
 * Los tres pasos del proceso. VIENEN DE LA HOME: eran `PLANNER_STEPS` en
 * `HomeSections.tsx` y sólo existían allá, así que al reducir el bloque de
 * eventos de la home a un banner se mudaron acá en vez de borrarse.
 */
const PLANNER_STEPS = [
  {
    n: '01',
    href: '#inquire',
    title: 'Request a proposal',
    body: 'One screen, two minutes. Date, headcount, rough budget, and what you are thinking.',
    cta: 'Start the request',
  },
  {
    n: '02',
    href: '#inquire',
    title: 'Read the numbers',
    body: 'Rental rates, the three ways to run the food, and the fees. All of it is on this page.',
    cta: 'See what it costs',
  },
  {
    n: '03',
    href: '#spaces',
    title: 'See the spaces',
    body: 'The rooftop, the yard, the patio, or the whole place with the doors closed.',
    cta: 'View spaces',
  },
] as const;

const WHAT_WE_DO = [
  {
    title: 'We coordinate the trucks',
    body: 'You pick a food tier, we line up the kitchens and the timing. You deal with one person, not four vendors.',
  },
  {
    title: 'The bar is ours',
    body: 'Cocktails, drafts, wine. Open bar, drink tickets or consumption, however you want to run it.',
  },
  {
    title: 'The space is yours',
    body: 'The rooftop, the yard, the patio, or the entire venue with the gates closed.',
  },
] as const;

/**
 * /events — la puerta de la vertical prioritaria.
 *
 * ⚠️ NO AFIRMA QUE NO HAYA COCINA. Esa frase estaba y se sacó el 2026-09-15:
 * el PDF del propio cliente ofrece catering in house. Lo que la página sí dice
 * es cómo se reparte el trabajo entre el venue y los trucks, y cuánto cuesta
 * cada una de las tres formas de comer.
 */
export default function EventsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(breadcrumbJsonLd([{ name: 'Events', path: '/events' }])),
        }}
      />

      <PageHero
        eyebrow="Private events"
        title="Your event, two stories up"
        lead="A rooftop bar, a gated yard and four independent kitchens in downtown Bonita Springs, across from Riverside Park."
        image="/images/events/event-a.jpg"
        imageAlt="Guests at a private event on the rooftop at Rooftop at Riverside"
        crumbs={[{ name: 'Events', path: '/events' }]}
      >
        <div className="flex flex-wrap gap-[12px]">
          <ButtonLink href="#inquire" variant="primary" size="lg">
            Request a proposal
          </ButtonLink>
          <ButtonLink href="#spaces" variant="secondary" size="lg">
            See the spaces
          </ButtonLink>
        </div>
      </PageHero>

      {/* ── Qué hacemos realmente ──────────────────────────────────────── */}
      <Section tone="cream" band="lg" labelledBy="what-title">
        <SectionHead
          eyebrow="How it works"
          eyebrowTone="deep"
          id="what-title"
          title="What we actually do"
          lead="We're a venue with a bar, not a caterer. Here's the honest split."
        />
        <StaggerGroup as="ul" className="mt-bloque grid gap-[28px] md:grid-cols-3">
          {WHAT_WE_DO.map((w) => (
            <RevealItem as="li" key={w.title} className="border-t-2 border-ink pt-[18px]">
              <Heading level={3}>{w.title}</Heading>
              <p className="mt-[10px] text-[16px] leading-[1.65] text-body/75">{w.body}</p>
            </RevealItem>
          ))}
        </StaggerGroup>
        {/*
          ⚠️ ACÁ DECÍA «we don't have a kitchen of our own, and we don't pretend
          to» y se sacó el 2026-09-15. El PDF «Events Packages» del propio
          cliente ofrece «UPSCALE CATERING · Minimum $1,500 spend · specialty
          menus provided by in house catering», así que la frase contradecía su
          material. Lo que sí está verificado son las tres formas de comer, y
          están listadas con su precio más abajo.
          TODO: confirmar con cliente qué es exactamente el catering in house.
        */}
        <p className="mt-[32px] max-w-[62ch] text-[16px] leading-[1.65] text-body/75">
          Four different menus in one yard is a better problem to hand a room of two hundred people
          than one set entrée. There are three ways to run the food, and all three are priced
          further down.
        </p>
      </Section>

      {/*
        ⚠️ Estos tres pasos VENÍAN DE LA HOME. Camila mandó el bloque de eventos
        de la home a ser sólo un banner: «que toda esa info esté en la página
        que le corresponda». Esta es esa página.

        No duplica a «What we actually do», que está justo arriba: ese dice QUÉ
        hacemos —el reparto entre el venue y los trucks— y esto dice CÓMO
        EMPIEZA. Son las dos preguntas que hace alguien que está evaluando el
        lugar, en ese orden.

        Va numerado, y acá la numeración sí informa: es una secuencia real. Se
        pide, se leen los números, se ven los espacios.
      */}
      <Section band="lg" labelledBy="process-title">
        <SectionHead
          eyebrow="Getting started"
          eyebrowTone="terra"
          id="process-title"
          title="Three steps, and the first one takes two minutes"
        />
        <StaggerGroup as="ol" className="mt-bloque grid gap-[28px] md:grid-cols-3">
          {PLANNER_STEPS.map((s) => (
            <RevealItem as="li" key={s.n} className="flex flex-col border-t border-ink/20 pt-[18px]">
              <span aria-hidden="true" className="eyebrow text-terra">
                Step {s.n}
              </span>
              <Heading level={3} className="mt-[10px]">
                {s.title}
              </Heading>
              <p className="mt-[10px] flex-1 text-[16px] leading-[1.65] text-body/75">{s.body}</p>
              <div className="mt-[18px]">
                <ButtonLink href={s.href} variant="outline">
                  {s.cta}
                </ButtonLink>
              </div>
            </RevealItem>
          ))}
        </StaggerGroup>
      </Section>

      {/*
        Slot 8 del vocabulario de motion, y el ÚNICO contador del sitio.
        Un número que sube es un gesto caro: usado dos veces se vuelve un tic.
        Acá se gana el lugar porque es la prueba dura de que el venue mueve
        gente, y es el dato que decide una venta corporativa.
      */}
      <Section band="md" labelledBy="proof-title">
        <div className="grid gap-[28px] border-y border-ink/15 py-[40px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-center lg:gap-[64px]">
          <div>
            <Eyebrow tone="terra">Fourth of July</Eyebrow>
            <p className="mt-[10px] font-display text-hero leading-[0.9] text-ink">
              <CountUp to={25000} />
              <span aria-hidden="true">–</span>
              <CountUp to={30000} />
            </p>
            <p className="sr-only">Between 25,000 and 30,000 people.</p>
          </div>
          <div>
            <Heading level={2} id="proof-title" className="text-d5 lg:text-d4">
              People downtown for one night
            </Heading>
            <p className="mt-[12px] max-w-[52ch] text-[16px] leading-[1.65] text-body/75">
              That&rsquo;s what the Fourth of July pulled into downtown Bonita Springs. The yard sits
              in the middle of it, on Old 41, across from Riverside Park. For a brand activation or
              a fundraiser, that footfall is the room.
            </p>
          </div>
        </div>
      </Section>

      {/* ── Verticales ─────────────────────────────────────────────────── */}
      {/*
        ══════════════════════════════════════════════════════════════════
        ⚠️ ACÁ HABÍA CUATRO TARJETAS-LINK Y DOS BOTONES, Y AHORA ESTÁ EL
        CONTENIDO. La sección mostraba seis atajos —las cuatro verticales, los
        espacios y el camión de juegos— que llevaban a seis páginas distintas.

        Camila, revisando la arquitectura del sitio: «eventos privados con sus
        servicios ahí, no cada pág de servicios», y sobre esta página en
        particular: «quiero que esté la info de qué se alquila y cierra para
        eventos privados, y el formulario o info para reservar».

        Las seis páginas se mudaron acá adentro y las seis rutas redirigen con
        301 a su ancla. Quien está evaluando cerrar el lugar ve el argumento
        entero sin volver atrás seis veces.
        ══════════════════════════════════════════════════════════════════
      */}
      {/*
        ══════════════════════════════════════════════════════════════════
        LAS TRES FAMILIAS DE EVENTO.

        ⚠️ REEMPLAZAN UNA LISTA PLANA DE OCHO TIPOS. Ocho opciones sin agrupar
        obligan a leerlas todas para encontrar la propia; tres familias con
        ejemplos debajo se reconocen de un vistazo. Pedido de Camila el
        2026-09-15.

        ⚠️ CADA FAMILIA LINKEA AL FORMULARIO, no a una subpágina. El desplegable
        del formulario tiene los mismos subtipos, así que quien llega desde acá
        encuentra su caso escrito igual que lo leyó arriba.

        ⚠️ `EventTypes` sigue abajo y NO es lo mismo: esto es la taxonomía —qué
        clase de evento es el tuyo— y eso de abajo son los argumentos, con las
        fotos y los datos duros de cada caso.
        ══════════════════════════════════════════════════════════════════
      */}
      <Section tone="bone" band="lg" labelledBy="families-title">
        <SectionHead
          eyebrow="What people book it for"
          eyebrowTone="deep"
          id="families-title"
          title="Three kinds of night"
          lead="The rooftop, the patio, the stage and the yard, in whatever combination your thing needs."
        />

        <div className="mt-[48px] flex flex-col gap-[48px] lg:gap-[64px]">
          {EVENT_FAMILIES.map((f, i) => (
            <article
              key={f.id}
              className="grid gap-[20px] border-t-2 border-ink/15 pt-[28px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-[56px]"
            >
              <div>
                <p
                  aria-hidden="true"
                  className="font-display text-d5 uppercase leading-none tabular-nums text-sunset lg:text-d4"
                >
                  {String(i + 1).padStart(2, '0')}
                </p>
                <Heading level={3} className="mt-[10px] text-d5 lg:text-d4">
                  {f.label}
                </Heading>
              </div>
              <div>
                <p className="font-display text-d6 uppercase leading-[1.1] lg:text-d5">{f.title}</p>
                <p className="mt-[12px] max-w-[54ch] text-[16px] leading-[1.7] text-body/80">
                  {f.lead}
                </p>
                <ul className="mt-[18px] flex list-none flex-wrap gap-[8px]">
                  {f.subtypes.map((s) => (
                    <li
                      key={s}
                      className="rounded-pill border border-ink/20 px-[14px] py-[5px] font-body text-[15px]"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
                <p className="mt-[20px]">
                  <Link href="#inquire" className="link-texto font-bold">
                    Ask about a {f.label.toLowerCase()} event
                  </Link>
                </p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <EventTypes />
      <EventSpaces />
      <EventGameTruck />

      {/*
        ══════════════════════════════════════════════════════════════════
        LO QUE CUESTA. Bloques J (dato duro) e I (fila de precio) del kit.

        ⚠️ ESTA SECCIÓN ES NUEVA Y SUS NÚMEROS TAMBIÉN. Salen del PDF «Events
        Packages» que el cliente publica hoy en un botón visible a mitad de
        `/hostanevent`, y que no estaba volcado en ningún documento nuestro.
        Hasta el 2026-09-15 el sitio nuevo mostraba TBD donde el cliente ya
        tenía el precio publicado.

        ⚠️ El PDF no tiene fecha. Ver el aviso de `content/events-pricing.ts`.

        ⚠️ Las tarifas van en display y los fees en cuerpo chico, pero los
        fees NO se esconden: 22 % de gratuity sobre un alquiler de $1.250 la
        hora son $275 por hora, y enterarse después es la peor manera.
        ══════════════════════════════════════════════════════════════════
      */}
      <Section tone="bone" band="lg" labelledBy="cost-title">
        <SectionHead
          eyebrow="What it costs"
          eyebrowTone="deep"
          id="cost-title"
          title="The numbers, up front"
          lead="Renting the second floor, the three ways to feed everyone, and the fees that ride along. No quote needed to read this."
        />

        {/* ── Bloque J: las dos tarifas ────────────────────────────────── */}
        <div className="mt-[48px] grid gap-[24px] sm:grid-cols-2">
          {RENTAL.map((r) => (
            <div key={r.days} className="border-t-2 border-ink/15 pt-[20px]">
              <p className="font-display text-d2 uppercase leading-none tabular-nums lg:text-d1">
                ${r.perHour.toLocaleString('en-US')}
              </p>
              <p className="mt-[10px] font-body text-[16px] text-body/80">
                per hour, {r.days}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-[24px] max-w-[54ch] text-[16px] leading-[1.7] text-body/80">
          {RENTAL_MINIMUM_HOURS} hour minimum
          {RENTAL_DEPOSIT ? ', and a deposit holds the date' : ''}. That is the second floor: the
          rooftop bar, the patio, or both.
        </p>

        {/* ── Bloque I: cómo come la gente ─────────────────────────────── */}
        <div className="mt-[56px]">
          <Heading level={3} role="label">
            Three ways to feed everyone
          </Heading>
          <ul className="mt-[20px] flex list-none flex-col">
            {FOOD_OPTIONS.map((f) => (
              <li
                key={f.slug}
                className="flex flex-col gap-[6px] border-b border-ink/12 py-[20px] sm:flex-row sm:items-baseline sm:gap-[24px]"
              >
                <div className="sm:flex-1">
                  <p className="font-display text-d6 uppercase leading-none lg:text-d5">{f.name}</p>
                  <p className="mt-[8px] max-w-[58ch] text-[16px] leading-[1.7] text-body/80">
                    {f.body}
                  </p>
                </div>
                <p className="shrink-0 font-display text-d6 uppercase leading-none tabular-nums text-sunset-deep lg:text-d5">
                  {f.price ?? 'Ask'}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Los fees, en cuerpo chico pero a la vista ────────────────── */}
        <div className="mt-[40px] grid gap-[24px] lg:grid-cols-[1fr_1.2fr] lg:gap-[48px]">
          <div>
            <Heading level={3} role="label">
              On top of that
            </Heading>
            <ul className="mt-[16px] flex list-none flex-col gap-[8px]">
              {FEES.map((f) => (
                <li key={f.label} className="flex justify-between gap-[16px] text-[16px]">
                  <span className="text-body/80">{f.label}</span>
                  <span className="font-bold tabular-nums">{f.amount}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Heading level={3} role="label">
              Add-ons
            </Heading>
            <ul className="mt-[16px] flex list-none flex-wrap gap-x-[8px] gap-y-[10px]">
              {ENHANCEMENTS.map((e) => (
                <li
                  key={e.name}
                  className="rounded-pill border border-ink/20 px-[16px] py-[6px] font-body text-[15px]"
                >
                  {e.name}
                </li>
              ))}
            </ul>
            <p className="mt-[16px] max-w-[52ch] text-[15px] leading-[1.6] text-body/75">
              {ENHANCEMENTS_NOTE}
            </p>
          </div>
        </div>
      </Section>

      {/*
        ══════════════════════════════════════════════════════════════════
        LA GALERÍA Y EL PDF.

        ⚠️ LAS FOTOS SON LAS REALES del cliente, de `public/images/venue/`, y
        cuando no hay una del caso que se quiere mostrar va el hueco gris con
        el pedido escrito. Lo que NO se hace es rellenar una galería de
        «eventos anteriores» con fotos de stock: sería mostrarle a alguien que
        va a alquilar el lugar una fiesta que no pasó acá.

        ⚠️ EL BOTÓN DEL PDF DICE NOMBRE, PESO Y FORMATO, pedido de Camila. Y el
        peso importa: son 13 MB, que en un celular con datos es una descarga
        que conviene decidir antes de empezar.

        ⚠️ EL ARCHIVO NO ESTÁ EN `public/` Y ESO ES A PROPÓSITO. 13 MB
        versionados viajan en cada deploy para siempre. Mientras el cliente no
        pase una versión liviana, el link apunta al que él ya sirve.
        TODO: pedir al cliente una versión comprimida del PDF para hospedarla.
        ══════════════════════════════════════════════════════════════════
      */}
      <Section band="lg" labelledBy="proof-gallery">
        <SectionHead
          eyebrow="What it looks like"
          eyebrowTone="plum"
          id="proof-gallery"
          title="Nights that already happened"
          lead="The same yard, the same rooftop, with other people's parties in them."
        />

        <ul className="mt-[40px] grid list-none gap-[16px] sm:grid-cols-2 lg:grid-cols-3">
          {GALERIA.map((g) =>
            g.src ? (
              <li key={g.alt} className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={g.src}
                  alt={g.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </li>
            ) : (
              <li key={g.brief}>
                <PhotoPending brief={g.brief} ratio="aspect-[4/3]" />
              </li>
            ),
          )}
        </ul>

        <div className="mt-[40px] rounded-card border border-ink/15 bg-bone p-[24px] lg:p-[32px]">
          <div className="flex flex-col gap-[16px] lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Heading level={3} role="card">
                The events packet
              </Heading>
              <p className="mt-[8px] max-w-[52ch] text-[16px] leading-[1.7] text-body/80">
                Spaces, food options, enhancements and the small print, in one file you can forward
                to whoever signs off on it.
              </p>
            </div>
            <a
              href={EVENTS_PDF.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10.5 shrink-0 items-center gap-[8px] rounded-pill bg-ink px-[24px] font-body text-cta font-bold tracking-cta text-paper transition-colors hover:bg-ink/85"
            >
              {EVENTS_PDF.label}
              <span className="font-normal opacity-80">
                {EVENTS_PDF.format}, {EVENTS_PDF.size}
              </span>
              <ArrowSquareOut className="size-4" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>
      </Section>

      {/* ── Cierre ─────────────────────────────────────────────────────── */}
      <Section band="md">
        <div className="rounded-card bg-sunset sombra-card px-[24px] py-[40px] text-ink lg:px-[56px]">
          <div className="flex flex-col gap-[20px] lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[560px]">
              <Eyebrow tone="ink">Next step</Eyebrow>
              <Heading level={2} className="mt-gap-kicker text-d4 lg:text-d3">
                One screen, two minutes
              </Heading>
              <p className="mt-gap-bajada text-lead">
                Tell us the date and the headcount. We answer within one business day, with numbers.
              </p>
            </div>
            <ButtonLink href="#inquire" variant="dark" size="lg">
              Request a proposal
            </ButtonLink>
          </div>
        </div>
      </Section>

      {/*
        ══════════════════════════════════════════════════════════════════
        ⚠️ EL FORMULARIO CIERRA LA PÁGINA Y YA NO ES UNA RUTA APARTE. Era
        `/events/inquire`. Camila: «quiero que esté […] el formulario o info
        para reservar» en la misma página.

        ⚠️ TODOS LOS CTA DEL SITIO SIGUEN APUNTANDO A `/events/inquire`, que
        ahora redirige con 301 a `/events#inquire`. No hubo que tocar los
        sesenta call sites, y un link viejo compartido por el cliente sigue
        cayendo donde tiene que caer.

        ⚠️ `width="prose"` ES EL MISMO ANCHO QUE TENÍA. Un formulario de ocho
        campos a 1168px de ancho deja los campos tan largos que dejan de
        leerse como campos.
        ══════════════════════════════════════════════════════════════════
      */}
      <Section id="inquire" tone="bone" band="lg" width="prose" className="scroll-mt-24">
        <InquiryForm />
      </Section>
    </>
  );
}
