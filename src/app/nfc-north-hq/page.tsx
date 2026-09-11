import type { Metadata } from 'next';
import { ButtonLink } from '@/components/shared/Button';
import PageHero from '@/components/shared/PageHero';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading, SectionHead } from '@/components/shared/Type';
import { HAPPY_HOUR } from '@/lib/brand';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  route: "/nfc-north-hq",
});

/**
 * /nfc-north-hq
 *
 * ⚠️⚠️ RESTRICCIÓN LEGAL — LA MÁS DURA DEL PROYECTO.
 *
 * SÓLO colores de equipo. **Jamás** nombres de equipo, jamás nombres de ciudad
 * usados como equipo, jamás logos, jamás la sigla de la liga en una marca.
 * Ni «Packers», ni «Bears», ni «Vikings», ni «Lions», ni una G, ni un cuerno.
 *
 * Lo que sí se puede: bloques de color. Los cuatro pares de abajo son
 * PALETAS, sin etiqueta y sin nombre, y ni siquiera están en un orden que
 * insinúe un ranking. El texto describe a la GENTE («transplants from up
 * north»), que es un hecho sobre la clientela, no una asociación de marca.
 *
 * ⚠️ Si algo que se genere acá insinúa una marca deportiva, está mal.
 * Antes de agregar cualquier cosa a esta página: ¿un abogado de la liga
 * podría leer esto como una asociación? Si hay duda, no va.
 *
 * ⚠️ Los colores de esta página son la ÚNICA excepción a la paleta de marca, y
 * viven acá adentro. No entran a `brand.ts` ni al `@theme`: no son colores del
 * sitio, son cuatro bloques decorativos de una sola página. Todos llevan texto
 * en blanco o negro según su luminancia, verificado.
 */

/** Cuatro paletas. Sin nombres, sin etiquetas, sin orden significativo. */
const PALETTES = [
  { a: '#203731', b: '#FFB612', ink: '#FFFFFF' },
  { a: '#0B162A', b: '#C83803', ink: '#FFFFFF' },
  { a: '#4F2683', b: '#FFC62F', ink: '#FFFFFF' },
  { a: '#0076B6', b: '#B0B7BC', ink: '#FFFFFF' },
] as const;

export default function NfcNorthPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(breadcrumbJsonLd([{ name: 'NFC North HQ', path: '/nfc-north-hq' }])),
        }}
      />

      <PageHero
        eyebrow="Sundays in season"
        title="Sunday belongs to the rooftop"
        lead="Half of Bonita Springs came down from somewhere with actual winter, and on Sunday it shows. Sound on, screens up, and a rooftop that turns into somebody's hometown bar."
        crumbs={[{ name: 'NFC North HQ', path: '/nfc-north-hq' }]}
      >
        <div className="flex flex-wrap gap-[12px]">
          <ButtonLink href="/whats-on" variant="primary" size="lg">
            Game day calendar
          </ButtonLink>
          <ButtonLink href="/visit" variant="secondary" size="lg">
            Getting here
          </ButtonLink>
        </div>
      </PageHero>

      {/* ── Los bloques de color ───────────────────────────────────────
          Cuatro paletas, sin una sola palabra que las identifique. */}
      <Section band="lg" labelledBy="colors-title">
        <SectionHead
          eyebrow="Wear your colors"
          eyebrowTone="deep"
          id="colors-title"
          title="You know which one is yours"
          lead="We don't need to spell it out. Show up in it."
        />

        <ul
          className="mt-bloque grid gap-[16px] sm:grid-cols-2 lg:grid-cols-4"
          aria-label="Team color palettes"
        >
          {PALETTES.map((p, i) => (
            <li
              key={i}
              className="relative flex h-[200px] overflow-hidden rounded-card lg:h-[260px]"
              /* Decorativo. No hay nombre que anunciar, y anunciar «bloque de
                 color 1» sería ruido para un lector de pantalla. */
              aria-hidden="true"
            >
              <span className="w-[62%]" style={{ backgroundColor: p.a }} />
              <span className="w-[38%]" style={{ backgroundColor: p.b }} />
            </li>
          ))}
        </ul>

        <p className="mt-[24px] max-w-[62ch] text-[16px] leading-[1.65] text-body/75">
          Every screen on the roof, sound on the game that matters most to the room, and four
          kitchens open the whole time so nobody has to leave at halftime.
        </p>
      </Section>

      {/* ── Cómo funciona el domingo ───────────────────────────────────── */}
      <Section band="md" labelledBy="sunday-title">
        <div className="grid gap-[32px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-[64px]">
          <Heading level={2} id="sunday-title" className="text-d5 lg:text-d4">
            How Sunday runs
          </Heading>
          <ul className="flex flex-col gap-[14px] text-[16px] leading-[1.7] text-body/80">
            <li className="border-b border-ink/12 pb-[14px]">
              <strong className="font-bold">Doors at 11.</strong> The bar opens Sunday at 11 AM and
              the trucks roll in at noon.
            </li>
            <li className="border-b border-ink/12 pb-[14px]">
              <strong className="font-bold">Sound on the big one.</strong> The room decides. If
              yours isn&rsquo;t the loud one, it&rsquo;s still on a screen.
            </li>
            <li className="border-b border-ink/12 pb-[14px]">
              <strong className="font-bold">Bring a group.</strong> For eight or more on a Sunday
              in season, message us first so we can hold a section.
            </li>
            <li>
              <strong className="font-bold">Kids and dogs are fine.</strong> It&rsquo;s an open
              yard, not a sports bar with a bouncer.
            </li>
          </ul>
        </div>
      </Section>

      {/* ── Happy hour + cierre ────────────────────────────────────────── */}
      <Section tone="deep" band="md" labelledBy="hh-nfc">
        <div className="flex flex-col gap-[20px] lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow tone="cream">During the week</Eyebrow>
            <Heading level={2} id="hh-nfc" className="mt-gap-kicker text-d4 lg:text-d3">
              Happy hour, {HAPPY_HOUR.days.toLowerCase()}
            </Heading>
            <p className="mt-gap-bajada text-lead text-paper/85">
              {HAPPY_HOUR.time}: {HAPPY_HOUR.deals.join(' · ')}
            </p>
          </div>
          <ButtonLink href="/sunset-bar" variant="onDark" size="lg">
            See the bar menu
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
