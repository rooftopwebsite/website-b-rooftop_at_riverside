import type { Metadata } from 'next';
import { ButtonLink } from '@/components/shared/Button';
import { ArrowSquareOut } from '@/components/shared/Icon';
import Marquee from '@/components/shared/Marquee';
import PageHero from '@/components/shared/PageHero';
import { PendingData, PhotoPending } from '@/components/shared/PendingData';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading, SectionHead } from '@/components/shared/Type';
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
 * ⚠️ RITMO: bone (hero) → paper (qué hay) → bone (precios) → paper (paquetes)
 * → cream (políticas) → deep (cierre). Una sola oscura, la última.
 * ══════════════════════════════════════════════════════════════════════════
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

      <PageHero
        eyebrow="The gaming truck"
        title={"Southwest Florida's first gaming truck"}
        lead="Xbox, PlayStation and Switch on six screens, in air conditioning, with a Game Coach keeping the whole thing moving. Ten dollars gets you half an hour."
        image={null}
        imageBrief="El interior del camión de gaming con las pantallas encendidas y chicos jugando. Horizontal."
        crumbs={[{ name: 'Gaming Truck', path: '/game-truck' }]}
      >
        <div className="flex flex-wrap gap-[12px]">
          <ButtonLink href="#packages" variant="primary">
            Book a party
          </ButtonLink>
          <ButtonLink href="#policies" variant="secondary">
            Read the rules
          </ButtonLink>
        </div>
      </PageHero>

      {/* ══ Qué hay adentro ══════════════════════════════════════════════ */}

      <Section band="lg" labelledBy="inside-title">
        <SectionHead
          eyebrow="What is in there"
          eyebrowTone="plum"
          id="inside-title"
          title="Three consoles, six screens, one coach"
          lead="It is a trailer built for this, parked in the yard, with the air conditioning on. In Florida that last part is the whole pitch."
        />

        <div className="mt-[48px] grid gap-[32px] sm:grid-cols-3">
          {/*
            BLOQUE J: dato duro. El número de pantallas sale del sitio; las
            unidades por consola NO se publican porque el sitio y el brief se
            contradicen, así que ahí va un pendiente visible.
          */}
          <div className="border-t-2 border-ink/15 pt-[18px]">
            <p className="font-display text-d2 uppercase leading-none tabular-nums lg:text-d1">
              {SCREENS}
            </p>
            <p className="mt-[8px] text-[16px] text-body/80">high-definition screens</p>
          </div>
          <div className="border-t-2 border-ink/15 pt-[18px]">
            <p className="font-display text-d2 uppercase leading-none tabular-nums lg:text-d1">
              {GAMES_TOTAL}
            </p>
            <p className="mt-[8px] text-[16px] text-body/80">games, from E-rated to M-rated</p>
          </div>
          <div className="border-t-2 border-ink/15 pt-[18px]">
            <p className="font-display text-d2 uppercase leading-none lg:text-d1">1</p>
            <p className="mt-[8px] text-[16px] text-body/80">
              Game Coach on site, running the whole thing
            </p>
          </div>
        </div>

        <div className="mt-[40px] grid gap-[32px] lg:grid-cols-2 lg:gap-[56px]">
          <div>
            <Heading level={3} role="label">
              The consoles
            </Heading>
            <ul className="mt-[16px] flex list-none flex-wrap gap-[8px]">
              {CONSOLES.map((c) => (
                <li
                  key={c}
                  className="rounded-pill border border-ink/20 px-[16px] py-[6px] font-body text-[15px]"
                >
                  {c}
                </li>
              ))}
            </ul>
            <p className="mt-[16px] max-w-[52ch] text-[15px] leading-[1.6] text-body/75">
              How many of each:{' '}
              <PendingData
                label="TBD"
                detail="El sitio dice 6 pantallas sin contar unidades; el brief dice 4 PS5, 4 Xbox y 2 Switch 2. No coinciden."
              />
            </p>
          </div>

          <div>
            <PhotoPending
              brief="Adentro del camión: las pantallas encendidas, los sillones y gente jugando."
              ratio="aspect-[4/3]"
            />
          </div>
        </div>
      </Section>

      {/*
        BLOQUE G: la marquesina de juegos.

        ⚠️ Son los 23 que el cliente publica, y el sitio dice «30+». No se
        completan los que faltan. Se detiene al pasar el puntero y con
        `prefers-reduced-motion`, que acá importa más que en otras: es una tira
        larga de nombres que alguien va a querer leer.
      */}
      <Marquee
        label={`Games in the truck: ${GAMES.join(', ')}`}
        className="border-y border-ink/12 bg-bone py-[16px]"
        duracion={60}
      >
        {GAMES.map((g) => (
          <span key={g} className="flex shrink-0 items-center gap-[48px]">
            <span className="font-display text-d6 uppercase leading-none whitespace-nowrap lg:text-d5">
              {g}
            </span>
            <span aria-hidden="true" className="size-[6px] shrink-0 rounded-pill bg-river" />
          </span>
        ))}
      </Marquee>

      {/* ══ Jugar sin reservar ═══════════════════════════════════════════ */}

      <Section tone="bone" band="lg" labelledBy="rates-title">
        <SectionHead
          eyebrow="Walk up and play"
          eyebrowTone="deep"
          id="rates-title"
          title="Ten dollars, half an hour"
          lead="No package, no booking, no minimum. Come up to the truck and get on a controller."
        />

        <ul className="mt-[40px] flex list-none flex-col gap-[4px]">
          {RATES.map((r) => (
            <li
              key={r.label}
              className="flex flex-col gap-[4px] border-b border-ink/12 py-[20px] last:border-b-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-[24px]"
            >
              <span className="font-display text-d6 uppercase lg:text-d5">{r.label}</span>
              <span className="shrink-0 font-display text-d5 uppercase tabular-nums text-sunset-deep lg:text-d4">
                ${r.price}
                <span className="ml-[8px] font-body text-[15px] font-normal normal-case tracking-normal text-body/75">
                  {r.unit}
                  {r.note ? `, ${r.note}` : ''}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </Section>

      {/* ══ Los dos paquetes ═════════════════════════════════════════════ */}

      <Section band="lg" labelledBy="packages-title" id="packages" className="scroll-mt-24">
        <SectionHead
          eyebrow="Book the whole truck"
          eyebrowTone="terra"
          id="packages-title"
          title="Two hours, your party"
          lead="The truck is yours for two hours with the coach included. The two packages differ in exactly two things, and they are both below."
        />

        {/*
          ══════════════════════════════════════════════════════════════
          ⚠️ LA COMPARACIÓN MUESTRA LAS DIFERENCIAS REALES, no dos tarjetas
          iguales con distinto precio. Pedido de Camila.

          Y las diferencias son exactamente dos: QUÉ DÍAS y CUÁNTO SALE LA
          HORA EXTRA. Todo lo demás es idéntico, así que va UNA sola vez,
          abajo, en una lista compartida. Repetir los cinco ítems en cada
          tarjeta habría sido justamente el error: parecería que hay dos
          ofertas distintas cuando hay una con dos precios.
          ══════════════════════════════════════════════════════════════
        */}
        <div className="mt-[48px] grid gap-[24px] lg:grid-cols-2 lg:gap-[32px]">
          {PACKAGES.map((pkg) => (
            <article
              key={pkg.slug}
              className="flex flex-col rounded-card border border-ink/15 bg-paper p-[28px] sombra-card lg:p-[36px]"
            >
              <Eyebrow tone="deep">{pkg.days}</Eyebrow>
              <Heading level={3} className="mt-[10px] text-d5 lg:text-d4">
                {pkg.name}
              </Heading>

              <p className="mt-[20px] font-display text-titan uppercase leading-[0.85] tabular-nums">
                ${pkg.price}
              </p>
              <p className="mt-[6px] text-[16px] text-body/80">
                for {pkg.hours} hours, all in
              </p>

              <dl className="mt-[24px] flex flex-col gap-[10px] border-t border-ink/12 pt-[20px]">
                {pkg.diferencias.map((d) => (
                  <div key={d} className="flex items-baseline gap-[10px]">
                    <span aria-hidden="true" className="size-[6px] shrink-0 rounded-pill bg-sunset" />
                    <dd className="m-0 text-[16px] leading-[1.6]">{d}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-auto pt-[28px]">
                <ButtonLink href={`/events#inquire`} variant="primary">
                  Ask about {pkg.days.split(' ')[0].toLowerCase()}s
                </ButtonLink>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-[40px] rounded-card bg-bone p-[28px]">
          <Heading level={3} role="label">
            Both packages include
          </Heading>
          <ul className="mt-[16px] grid list-none gap-[10px] sm:grid-cols-2">
            {PACKAGE_INCLUDES.map((i) => (
              <li key={i} className="flex items-start gap-[10px] text-[16px] leading-[1.6]">
                <span
                  aria-hidden="true"
                  className="mt-[3px] grid size-[20px] shrink-0 place-items-center rounded-pill bg-sunset text-[12px] font-bold text-ink"
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
        </div>
      </Section>

      {/* ══ Las políticas ════════════════════════════════════════════════ */}

      <Section tone="cream" band="lg" labelledBy="policies-title" id="policies" className="scroll-mt-24">
        <SectionHead
          eyebrow="The rules"
          eyebrowTone="deep"
          id="policies-title"
          title="What you are agreeing to"
          lead="The short version of the two waivers you sign. Both are linked in full at the bottom, and they are the ones that count."
        />

        <div className="mt-[40px] grid gap-[28px] lg:grid-cols-2 lg:gap-[40px]">
          {politicas.map((p) => (
            <article key={p.title} className="border-t-2 border-ink/20 pt-[20px]">
              <Heading level={3} role="card">
                {p.title}
              </Heading>
              <p className="mt-[10px] max-w-[52ch] text-[16px] leading-[1.7] text-body/80">
                {p.body}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-[40px] flex flex-col gap-[12px] border-t border-ink/20 pt-[24px] sm:flex-row sm:flex-wrap">
          {WAIVERS.map((w) => (
            <a
              key={w.href}
              href={w.href}
              target="_blank"
              rel="noopener noreferrer"
              className="link-texto inline-flex items-center gap-[6px] font-bold"
            >
              {w.label}
              <ArrowSquareOut className="size-4" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ))}
        </div>
      </Section>

      {/* ══ Cierre ═══════════════════════════════════════════════════════ */}

      <Section tone="deep" band="lg" labelledBy="gt-next">
        <Heading level={2} id="gt-next" className="max-w-[18ch]">
          It is parked in the yard
        </Heading>
        <p className="bajada mt-gap-bajada max-w-[52ch] text-paper/85">
          Same address as everything else. Come up, play half an hour, and go get something to eat
          from whichever truck smells best.
        </p>
        <div className="mt-gap-cta flex flex-wrap gap-[14px]">
          <ButtonLink href="/events#inquire" variant="primary">
            Book a party
          </ButtonLink>
          <ButtonLink href="/food-trucks" variant="ghostDark">
            See the food trucks
          </ButtonLink>
        </div>
        <p className="mt-[28px] text-[16px] text-paper/70">
          {venueAddressLine(venue)} &middot;{' '}
          <a href={venue.phoneHref} className="link-texto text-paper">
            {venue.phone}
          </a>
        </p>
      </Section>
    </>
  );
}
