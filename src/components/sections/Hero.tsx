import Image from 'next/image';
import Link from 'next/link';
import { ButtonLink } from '@/components/shared/Button';
import { HeroFadeUp, MaskedLines } from '@/components/shared/Motion';
import { GUTTER } from '@/components/shared/Section';
import { Heading } from '@/components/shared/Type';

/**
 * Hero del home — foto a sangre con losa oscura encima.
 *
 * ⚠️ TERCERA versión, y las dos anteriores fallaron por la misma razón de
 * fondo. Primero fueron dos paneles con la tipografía a la izquierda; después,
 * con visitors.now de referencia, una pila centrada sobre blanco con la foto
 * flotando en una tarjeta. Camila rechazó las dos: «no se asemeja en nada a
 * nuestros proyectos».
 *
 * Fui a medir los sitios de la casa y el diagnóstico fue claro. Baires Grill,
 * The Orient y Showdown Social abren TODOS con una imagen a sangre y el
 * titular encima. Ninguno abre con tipografía sobre blanco. Lo que yo tenía
 * era una landing de software, y encima diseñada contra Impact, porque los
 * WOFF2 de Steelfish todavía no habían llegado.
 *
 * Lo que se toma de Showdown Social, que Camila fijó como referencia máxima:
 *
 *   · imagen a sangre, oscura, con el isotipo chico centrado arriba
 *   · titular enorme en condensada, caja alta, dos líneas, centrado
 *   · **la segunda línea en el color de acento** — es lo que evita que un
 *     titular de dos líneas se lea como un bloque plano
 *   · una fila de micro-datos en caja alta debajo, separados por viñetas
 *   · doble CTA: uno relleno y uno de filo
 *
 * ⚠️ El velo NO es un degradado suave. Es un color sólido de marca a 72% más
 * un degradado sólo abajo. Un velo suave deja zonas de la foto donde el texto
 * cae sobre un fondo claro y el contraste se vuelve imposible de garantizar —
 * y axe no lo puede medir sobre una imagen, así que el fallo pasaría callado.
 * Con `deep` al 72% el fondo efectivo es ≈#123A3A en el peor punto y el texto
 * en `paper` da más de 15:1 en toda la superficie.
 *
 * ⚠️ El texto va sobre la foto sólo porque hay velo sólido. Sin él, la regla
 * anterior seguía valiendo: el titular nunca encima de una imagen sin control.
 */

/** Micro-datos del hero. Son hechos verificados, no promesas de marketing. */
const FACTS = ['Four food trucks', 'Rooftop bar', 'Live music five nights', 'Walk in, no reservations'] as const;

/**
 * El selector de intención. Sobrevive a los tres rediseños porque es la
 * corrección más importante del sitio —el visitante llega asumiendo que es un
 * restaurante y acá ve tres puertas—, pero sale del hero: apretado contra el
 * titular y los CTA competía con la conversión. Ahora es su propia banda.
 */
const INTENTS = [
  { href: '/food-trucks', label: 'Eat and drink', note: 'Four kitchens in the yard' },
  { href: '/whats-on', label: "See what's on", note: 'Music, bingo, DJ sets' },
  { href: '/events', label: 'Rent the place', note: 'Buyouts and private nights' },
] as const;

export default function Hero() {
  return (
    <>
      <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-deep">
        <Image
          src="/images/hero-live-music.jpg"
          alt=""
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover"
        />
        {/* Velo sólido + refuerzo abajo. Ver la nota del encabezado. */}
        <div aria-hidden="true" className="absolute inset-0 bg-deep/72" />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[28%] bg-gradient-to-t from-deep to-transparent"
        />

        <div className={`relative ${GUTTER} pt-[150px] pb-[56px] lg:pt-[176px] lg:pb-[68px]`}>
          <div className="mx-auto flex max-w-[900px] flex-col items-center text-center">
            <HeroFadeUp>
              <Image
                src="/brand/isotype-truck.svg"
                alt=""
                width={552}
                height={390}
                className="w-[64px] lg:w-[76px]"
              />
            </HeroFadeUp>

            <Heading
              level={1}
              role="hero"
              id="hero-title"
              className="mt-[22px] text-paper"
            >
              <MaskedLines lines={['Bonita comes', 'together']} delay={0.08} accentLast />
            </Heading>

            <HeroFadeUp delay={0.26} className="mt-[20px]">
              <p className="max-w-[52ch] text-[17px] leading-[1.55] text-paper/85 lg:text-[19px]">
                A rooftop bar over four food trucks in downtown Bonita Springs. Our bar upstairs,
                four independent kitchens in the yard.
              </p>
            </HeroFadeUp>

            <HeroFadeUp delay={0.34} className="mt-[32px]">
              <div className="flex flex-wrap items-center justify-center gap-[12px]">
                <ButtonLink href="/whats-on" variant="primary" size="lg">
                  What&rsquo;s on tonight
                </ButtonLink>
                <ButtonLink href="/events/inquire" variant="ghostDark" size="lg">
                  Plan an event
                </ButtonLink>
              </div>
            </HeroFadeUp>

            {/* Micro-datos en Bronx, caja alta. La separación es una viñeta
                `aria-hidden`: un lector de pantalla no tiene que oír «punto»
                cuatro veces, y la lista ya se anuncia como lista. */}
            <HeroFadeUp delay={0.42} className="mt-[38px]">
              <ul className="flex flex-wrap items-center justify-center gap-x-[10px] gap-y-[8px]">
                {FACTS.map((fact, i) => (
                  <li key={fact} className="flex items-center gap-[10px]">
                    {i > 0 ? (
                      <span aria-hidden="true" className="h-[3px] w-[3px] rounded-pill bg-sunset" />
                    ) : null}
                    <span className="eyebrow text-paper/75">{fact}</span>
                  </li>
                ))}
              </ul>
            </HeroFadeUp>
          </div>
        </div>
      </section>

      {/* ── Las tres puertas ─────────────────────────────────────────────── */}
      <section aria-labelledby="intents-title" className={`bg-cream ${GUTTER} py-[26px]`}>
        <h2 id="intents-title" className="sr-only">
          What brings you here
        </h2>
        <ul className="caja grid gap-[10px] md:grid-cols-3">
          {INTENTS.map((intent) => (
            <li key={intent.href}>
              <Link
                href={intent.href}
                className="group flex items-center justify-between gap-[14px] rounded-card bg-chalk/70 px-[20px] py-[16px] transition-colors duration-200 hover:bg-chalk"
              >
                <span>
                  <span className="block font-display text-d6 uppercase text-ink">
                    {intent.label}
                  </span>
                  <span className="mt-[2px] block font-body text-[13px] text-body/75">
                    {intent.note}
                  </span>
                </span>
                <svg
                  width="17"
                  height="11"
                  viewBox="0 0 16 10"
                  fill="none"
                  aria-hidden="true"
                  className="shrink-0 text-terra transition-transform duration-200 group-hover:translate-x-[4px]"
                >
                  <path
                    d="M0 5h14M10 1l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
