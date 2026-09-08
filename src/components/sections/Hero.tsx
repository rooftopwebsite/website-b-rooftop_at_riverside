import Image from 'next/image';
import Link from 'next/link';
import { HeroFadeUp, MaskedLines } from '@/components/shared/Motion';
import { GUTTER } from '@/components/shared/Section';
import { TileMark } from '@/components/shared/TilePattern';
import { Eyebrow, Heading } from '@/components/shared/Type';

/**
 * Hero del home.
 *
 * ⚠️ Decisión de diseño: el hero está PARTIDO en dos paneles —tipografía sobre
 * blanco a la izquierda, la foto real a la derecha— en vez de texto encima de
 * una foto a sangre.
 *
 * Por dos razones, y las dos son del brief:
 *
 *   1. «El sitio es blanco.» Una foto a sangre de 100vh en el primer viewport
 *      convierte el hero en una superficie de color, que es justo lo que la ley
 *      del color prohíbe. Partido, el blanco sigue mandando.
 *   2. Texto sobre foto obliga a un velo y a medir el contraste sobre el color
 *      COMPUESTO, no sobre el declarado. Es el error que ningún checker
 *      automático detecta. Acá el h1 es negro sobre blanco: 21:1, sin discusión.
 *
 * ⚠️ La foto NO es de atardecer. El brief pide «imagen real del venue al
 * atardecer» y en el sitio actual no hay ninguna: la mejor disponible es esta,
 * música en vivo de noche con el público. Está marcado en el informe.
 *
 * ⚠️ En lugar del widget de reserva del patrón de la casa —acá no hay reservas,
 * es walk-in— va el selector de intención de tres vías. Es la corrección más
 * importante del sitio: el visitante llega asumiendo restaurante, y las tres
 * puertas le dicen en el primer viewport que esto son tres negocios.
 */

const INTENTS = [
  {
    href: '/food-trucks',
    label: 'Eat and drink',
    hint: 'Four kitchens and a rooftop bar',
  },
  {
    href: '/whats-on',
    label: "See what's on this weekend",
    hint: 'Live music, bingo, the whole calendar',
  },
  {
    href: '/events',
    label: 'Rent the place',
    hint: 'Private and corporate events',
  },
] as const;

export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="desk:grid desk:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] desk:items-stretch">
        {/* ── Panel de tipografía ─────────────────────────────────────── */}
        <div className={`${GUTTER} flex flex-col justify-center pt-[48px] pb-[40px] lg:pt-[80px] lg:pb-[72px]`}>
          <div className="mx-auto w-full max-w-[640px] desk:mr-[64px] desk:ml-auto">
            <Eyebrow tone="deep" className="flex items-center gap-[12px]">
              <TileMark />
              Downtown Bonita Springs
            </Eyebrow>

            {/* Slot 2 del vocabulario de motion: el H1 sube por líneas, cada
                una con su máscara y un stagger corto. El corte está escrito a
                mano y no medido en runtime — ver `MaskedLines`. */}
            <Heading level={1} role="hero" id="hero-title" className="mt-gap-kicker text-ink">
              <MaskedLines lines={['Bonita comes', 'together']} delay={0.08} />
            </Heading>

            <HeroFadeUp delay={0.26} className="mt-gap-bajada">
            <p className="max-w-[46ch] text-lead text-body/80">
              A rooftop bar over a curated food truck park. Four independent kitchens in the yard,
              our own bar upstairs, and a calendar that runs five nights a week.
            </p>
            </HeroFadeUp>

            {/* ── Selector de intención ────────────────────────────────
                Tres puertas, no tres botones decorativos: cada una rutea a
                una de las tres verticales del negocio. */}
            <HeroFadeUp delay={0.34}>
            <nav aria-label="What brings you here" className="mt-[32px]">
              <ul className="flex flex-col border-t border-ink/15">
                {INTENTS.map((intent) => (
                  <li key={intent.href}>
                    <Link
                      href={intent.href}
                      className="group flex items-center justify-between gap-[16px] border-b border-ink/15 py-[18px] transition-colors duration-250 hover:bg-cream"
                    >
                      <span className="flex flex-col gap-[2px]">
                        <span className="font-display text-d6 uppercase lg:text-d5">
                          {intent.label}
                        </span>
                        <span className="text-[14px] text-body/60">{intent.hint}</span>
                      </span>
                      <span
                        aria-hidden="true"
                        className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-pill border border-ink/20 transition-all duration-250 group-hover:border-ink group-hover:bg-ink group-hover:text-paper"
                      >
                        <svg width="15" height="10" viewBox="0 0 16 10" fill="none">
                          <path
                            d="M0 5h14M10 1l4 4-4 4"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            </HeroFadeUp>

            {/* ⚠️ Acá NO van los horarios de hoy. Los cubre la barra de estado
                que va pegada al header y se ve en todas las páginas; repetirlos
                a 400px de distancia es ruido, no refuerzo. */}
          </div>
        </div>

        {/* ── Panel de foto ───────────────────────────────────────────── */}
        <div className="relative min-h-[320px] desk:min-h-[calc(100vh-var(--spacing-header))]">
          <Image
            src="/images/hero-live-music.jpg"
            alt="A drummer playing to a full crowd under string lights at Rooftop at Riverside"
            fill
            priority
            fetchPriority="high"
            sizes="(max-width: 1343px) 100vw, 48vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
