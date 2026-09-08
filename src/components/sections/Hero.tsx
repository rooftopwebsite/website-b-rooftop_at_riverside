import Image from 'next/image';
import Link from 'next/link';
import { AnnouncementChip, ButtonLink } from '@/components/shared/Button';
import { HeroFadeUp, MaskedLines } from '@/components/shared/Motion';
import { GUTTER } from '@/components/shared/Section';
import { Heading } from '@/components/shared/Type';

/**
 * Hero del home — pila CENTRADA.
 *
 * ⚠️ REVIERTE el hero anterior (dos paneles, tipografía a la izquierda y foto a
 * la derecha). Dirección nueva de Camila con la referencia de visitors.now:
 * chip → titular grande → bajada → doble CTA → intención, todo centrado sobre
 * blanco, y recién después la foto flotando en una tarjeta sobre un campo suave.
 *
 * ⚠️ Lo que se MANTIENE de la decisión anterior, y no es casual: el texto nunca
 * va encima de la foto. Centrado o partido, el h1 es negro sobre blanco —21:1—,
 * sin velo y sin tener que medir un color compuesto. La foto entra después, en
 * su propia tarjeta, que es exactamente lo que la referencia hace con su
 * captura de producto.
 *
 * ⚠️ El campo de abajo va en CREMA, no en un degradado saturado. La referencia
 * usa un azul-lavanda fuerte; acá eso rompería la ley del color, que sólo
 * autoriza crema como superficie de color grande y teal profundo como la
 * oscura. Crema cumple la misma función atmosférica y está dentro de la ley.
 *
 * ⚠️ Este crema CUENTA para el tope de dos por página. Por eso «Tonight at the
 * Yard» pasó a blanco: si no, la home tendría tres.
 */

const INTENTS = [
  { href: '/food-trucks', label: 'Eat and drink' },
  { href: '/whats-on', label: "See what's on" },
  { href: '/events', label: 'Rent the place' },
] as const;

export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative">
      {/* ── Pila centrada sobre blanco ──────────────────────────────────── */}
      <div className={`${GUTTER} pt-[132px] pb-[56px] lg:pt-[164px] lg:pb-[72px]`}>
        <div className="mx-auto flex max-w-[820px] flex-col items-center text-center">
          <HeroFadeUp>
            <AnnouncementChip tag="Tonight" href="/whats-on">
              Live music five nights a week
            </AnnouncementChip>
          </HeroFadeUp>

          <Heading
            level={1}
            role="hero"
            id="hero-title"
            className="mt-[26px] tracking-display text-ink"
          >
            <MaskedLines lines={['Bonita comes', 'together']} delay={0.08} />
          </Heading>

          <HeroFadeUp delay={0.26} className="mt-[22px]">
            <p className="max-w-[54ch] text-[17px] leading-[1.55] text-body/70 lg:text-[19px]">
              A rooftop bar over four food trucks in downtown Bonita Springs. Our bar upstairs,
              four independent kitchens in the yard, and a calendar that runs five nights a week.
            </p>
          </HeroFadeUp>

          {/* Doble CTA, como la referencia: uno lleno y uno fantasma. */}
          <HeroFadeUp delay={0.34} className="mt-[30px]">
            <div className="flex flex-wrap items-center justify-center gap-[12px]">
              <ButtonLink href="/whats-on" variant="primary" size="lg">
                What&rsquo;s on tonight
              </ButtonLink>
              <ButtonLink href="/events/inquire" variant="secondary" size="lg">
                Plan an event
              </ButtonLink>
            </div>
          </HeroFadeUp>

          {/*
            El selector de intención sobrevive al rediseño, pero pasa a ser una
            fila de píldoras. Sigue siendo la corrección más importante del
            sitio —el visitante llega asumiendo restaurante y acá ve tres
            puertas distintas— y ahora cuesta una línea en vez de un bloque.
          */}
          <HeroFadeUp delay={0.42} className="mt-[36px] w-full">
            <nav aria-label="What brings you here">
              <ul className="flex flex-wrap items-center justify-center gap-[8px]">
                {INTENTS.map((intent) => (
                  <li key={intent.href}>
                    <Link
                      href={intent.href}
                      className="inline-flex items-center gap-[7px] rounded-pill bg-ink/[0.04] px-[16px] py-[9px] font-body text-[14px] font-medium text-body/75 transition-colors duration-200 hover:bg-ink/[0.08] hover:text-ink"
                    >
                      {intent.label}
                      <svg width="13" height="9" viewBox="0 0 16 10" fill="none" aria-hidden="true">
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
            </nav>
          </HeroFadeUp>
        </div>
      </div>

      {/* ── Campo suave con la foto flotando ────────────────────────────── */}
      <div className="relative">
        {/* El campo arranca a media altura de la tarjeta, así la foto queda
            montada entre el blanco y el color — el gesto de la referencia. */}
        <div aria-hidden="true" className="absolute inset-x-0 top-[86px] bottom-0 bg-cream" />

        <div className={`relative ${GUTTER} pb-[72px] lg:pb-[96px]`}>
          <div className="caja">
            <div className="rounded-panel bg-paper p-[8px] shadow-float lg:p-[10px]">
              <div className="relative aspect-[16/9] overflow-hidden rounded-card bg-cream">
                <Image
                  src="/images/hero-live-music.jpg"
                  alt="A drummer playing to a full crowd under string lights at Rooftop at Riverside"
                  fill
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 1343px) 100vw, 1280px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
