import type { Metadata } from 'next';
import { ButtonLink } from '@/components/shared/Button';
import PageHero from '@/components/shared/PageHero';
import Scallop from '@/components/shared/Scallop';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading, SectionHead } from '@/components/shared/Type';
import {
  BEER_SECTIONS,
  MENU_LEGAL,
  SIGNATURE_COCKTAILS,
  SPECIALS,
  WINE_SECTIONS,
  formatPrice,
  type MenuItem,
  type MenuSection,
} from '@/content/bar-menu';
import { HAPPY_HOUR } from '@/lib/brand';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  route: "/sunset-bar",
  image: {
    url: '/images/venue-rooftop.jpg',
    width: 2000,
    height: 1333,
    alt: 'The Sunset Bar rooftop at Rooftop at Riverside',
  },
});

/**
 * /sunset-bar
 *
 * El único menú del sitio con ítems y precios, porque es lo único que cobra el
 * venue. Va en HTML con jerarquía de headings y texto seleccionable.
 * Prohibido publicarlo como imagen o como PDF — que es exactamente lo que hace
 * hoy `/drink`, con dos JPG dentro de un slider.
 *
 * ⚠️ Es una de las dos únicas páginas donde el brief permite la superficie
 * oscura `deep`. Se usa en la banda de happy hour, no en toda la página: el
 * sitio sigue siendo blanco.
 */
export default function SunsetBarPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(breadcrumbJsonLd([{ name: 'Sunset Bar', path: '/sunset-bar' }])),
        }}
      />

      <PageHero
        eyebrow="The rooftop"
        title={"Bonita's only rooftop"}
        lead="Our bar, and the only thing here we actually cook up ourselves. Cocktails made daily, drafts from down the road, and the best west-facing seat in Bonita Springs."
        image="/images/venue-rooftop.jpg"
        imageAlt="The rooftop bar at Rooftop at Riverside with seating overlooking the river"
        crumbs={[{ name: 'Sunset Bar', path: '/sunset-bar' }]}
      />

      {/* ── Happy hour: la única superficie oscura de la página ────────── */}
      <Scallop from="paper" to="deep" />
      <Section tone="deep" band="md" labelledBy="hh-title">
        <div className="flex flex-col gap-[20px] lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow tone="cream">Happy hour</Eyebrow>
            <Heading level={2} id="hh-title" className="mt-gap-kicker text-d4 lg:text-d3">
              {HAPPY_HOUR.days}, {HAPPY_HOUR.time}
            </Heading>
          </div>
          <ul className="flex flex-wrap gap-x-[28px] gap-y-[8px]">
            {HAPPY_HOUR.deals.map((d) => (
              <li key={d} className="font-display text-d5 uppercase text-cream lg:text-d4">
                {d}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ── Cócteles ───────────────────────────────────────────────────── */}
      <Section band="lg" labelledBy="cocktails-title">
        <SectionHead
          eyebrow="Made daily"
          eyebrowTone="magenta"
          id="cocktails-title"
          title={SIGNATURE_COCKTAILS.title}
          lead="Fresh juice, house syrups, and a margarita we squeeze every morning."
        />
        <div className="mt-[40px] grid gap-x-[56px] gap-y-[4px] lg:grid-cols-2">
          {SIGNATURE_COCKTAILS.items.map((item) => (
            <MenuRow key={item.name} item={item} detailed />
          ))}
        </div>
      </Section>

      {/* ── Specials ───────────────────────────────────────────────────── */}
      <Section tone="cream" band="md" labelledBy="specials-title">
        <SectionHead
          eyebrow="Ask about these"
          eyebrowTone="deep"
          id="specials-title"
          title={SPECIALS.title}
        />
        <div className="mt-[32px] grid gap-x-[56px] gap-y-[4px] lg:grid-cols-2">
          {SPECIALS.items.map((item) => (
            <MenuRow key={item.name} item={item} detailed />
          ))}
        </div>
      </Section>

      {/* ── Cerveza ────────────────────────────────────────────────────── */}
      <Section band="lg" labelledBy="beer-title">
        <SectionHead
          eyebrow="On tap and in the cooler"
          eyebrowTone="terra"
          id="beer-title"
          title="Beer & Seltzers"
          lead="Ankrolab and Riptide are both brewed within twenty minutes of here."
        />
        <div className="mt-[40px] grid gap-[40px] md:grid-cols-3 md:gap-[40px]">
          {BEER_SECTIONS.map((s) => (
            <MenuColumn key={s.id} section={s} />
          ))}
        </div>
      </Section>

      {/* ── Vino ───────────────────────────────────────────────────────── */}
      <Section tone="cream" band="lg" labelledBy="wine-title">
        <SectionHead
          eyebrow="By the glass"
          eyebrowTone="plum"
          id="wine-title"
          title="Wine & Bubbles"
          lead="Anything marked house is what happy hour runs on."
        />
        <div className="mt-[40px] grid gap-[40px] sm:grid-cols-2 lg:grid-cols-4">
          {WINE_SECTIONS.map((s) => (
            <MenuColumn key={s.id} section={s} />
          ))}
        </div>
      </Section>

      {/* ── Pie legal + cierre ─────────────────────────────────────────── */}
      <Section band="md">
        <div className="flex flex-col gap-[24px] border-t border-ink/15 pt-[28px] lg:flex-row lg:items-start lg:justify-between">
          <p className="max-w-[52ch] text-[14px] leading-[1.6] text-body/75">{MENU_LEGAL}</p>
          <div className="flex flex-col gap-[12px] sm:flex-row">
            <ButtonLink href="/food-trucks" variant="secondary">
              See the food trucks
            </ButtonLink>
            <ButtonLink href="/whats-on" variant="primary">
              What&rsquo;s on tonight
            </ButtonLink>
          </div>
        </div>
        <p className="mt-[20px] max-w-[60ch] text-[14px] leading-[1.6] text-body/75">
          Food comes from the trucks in the yard, and each one takes its own orders and its own
          payment. We don&rsquo;t have a kitchen — what we have is the bar.
        </p>
      </Section>
    </>
  );
}

/**
 * Una fila de carta: nombre, filete de puntos y precio.
 *
 * ⚠️ El precio va dentro de un `<dd>`… no: va en un `<div>` con el nombre en
 * negrita, y no en una tabla, porque una carta es una LISTA de productos, no
 * datos tabulares. El precio se asocia por proximidad y por el orden del DOM.
 * El `aria-label` del contenedor no hace falta: el lector lee «Bomb Pop, 10
 * dollars, tequila, blue curaçao…», que es el orden correcto.
 */
function MenuRow({ item, detailed = false }: { readonly item: MenuItem; readonly detailed?: boolean }) {
  const { whole, cents } = formatPrice(item.price);
  return (
    <div className="flex flex-col border-b border-ink/10 py-[16px] last:border-b-0">
      <div className="flex items-baseline gap-[10px]">
        <h3 className="font-display text-d6 uppercase lg:text-d5">{item.name}</h3>
        {item.house ? (
          <span className="rounded-btn bg-magenta px-[6px] py-[2px] text-[11px] font-bold uppercase tracking-[0.1em] text-paper">
            House
          </span>
        ) : null}
        {/* El filete de puntos ata visualmente el nombre con el precio.
            `aria-hidden` porque no es contenido. */}
        <span aria-hidden="true" className="mb-[4px] flex-1 border-b border-dotted border-ink/25" />
        <p className="shrink-0 font-display text-d6 tabular-nums lg:text-d5">
          <span className="sr-only">Price: </span>
          <span aria-hidden="true">$</span>
          {whole}
          {cents ? <sup className="text-[0.6em]">{cents}</sup> : null}
          <span className="sr-only"> dollars</span>
        </p>
      </div>
      {detailed && item.description ? (
        <p className="mt-[4px] max-w-[52ch] text-[15px] leading-[1.55] text-body/75">
          {item.description}
        </p>
      ) : null}
      {detailed && item.note ? (
        <p className="mt-[2px] max-w-[52ch] text-[14px] leading-[1.5] text-body/75 italic">
          {item.note}
        </p>
      ) : null}
      {!detailed && item.description ? (
        <p className="mt-[2px] text-[13px] leading-[1.45] text-body/75">{item.description}</p>
      ) : null}
    </div>
  );
}

function MenuColumn({ section }: { readonly section: MenuSection }) {
  return (
    <div>
      <Heading level={3} role="label">
        {section.title}
      </Heading>
      <span aria-hidden="true" className="mt-[8px] block h-[2px] w-[28px] bg-river" />
      <div className="mt-[12px]">
        {section.items.map((item) => (
          <MenuRow key={item.name} item={item} />
        ))}
      </div>
    </div>
  );
}
