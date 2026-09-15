import type { Metadata } from 'next';
import { ButtonLink } from '@/components/shared/Button';
import PageHero from '@/components/shared/PageHero';
import WaveBorder from '@/components/shared/WaveBorder';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading, SectionHead } from '@/components/shared/Type';
import {
  CARTAS_FALLBACK,
  MENU_LEGAL,
  cartasFromGroups,
  formatPrice,
  type MenuItem,
  type MenuSection,
} from '@/content/bar-menu';
import { getMenu } from '@/lib/restoexp';
import { HAPPY_HOUR } from '@/content/happy-hour';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  route: "/sunset-bar",
  image: {
    url: '/images/venue/wall-cocktails-rooftop.jpg',
    width: 540,
    height: 720,
    alt: 'Drinks on a table on the rooftop at Rooftop at Riverside',
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
export default async function SunsetBarPage() {
  /*
   * ⚠️ LA CARTA SALE DE LA BASE. El menú «Sunset Bar» está cargado entero en
   * el dashboard de RestoExp: nueve categorías, 50 ítems con precio y
   * descripción. Descubierto el 2026-09-15; hasta entonces estaba transcrito
   * a mano en `content/bar-menu.ts` porque el sitio viejo lo publica como dos
   * JPG y nadie había mirado la base.
   *
   * ⚠️ `CARTAS_FALLBACK` es el respaldo. Si la base no contesta se sirve la
   * transcripción: una carta desactualizada es mala, una carta vacía es peor.
   */
  const grupos = await getMenu();
  const cartas = grupos ? cartasFromGroups(grupos) : CARTAS_FALLBACK;

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
        image={null}
        imageBrief="La terraza al atardecer, mirando al oeste sobre el río, con la barra y las mesas en cuadro. Horizontal."
        crumbs={[{ name: 'Sunset Bar', path: '/sunset-bar' }]}
      />

      {/* ── Happy hour: la única superficie oscura de la página ────────── */}
      <WaveBorder from="paper" to="deep" />
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
      {/*
        ══════════════════════════════════════════════════════════════════
        LAS CARTAS. Bloque I del kit: nombre en display, descripción en
        cuerpo, precio a la derecha y filete punteado en el medio.

        ⚠️ ALTERNAN `paper` Y `cream`, y ninguna es `deep`. La única
        superficie oscura de la página es la banda de happy hour de arriba:
        cuatro listas de precios sobre verde serían la mitad de la página en
        oscuro, y la regla es 70–75 % claro.

        ⚠️ EL NÚMERO DE CARTAS NO ESTÁ ESCRITO ACÁ. Si el cliente agrega una
        categoría en el dashboard, aparece una columna más. Si desactiva
        todos los ítems de una, la carta no se renderiza vacía.
        ══════════════════════════════════════════════════════════════════
      */}
      {cartas.map((carta, n) => (
        <Section
          key={carta.id}
          tone={n % 2 === 0 ? 'paper' : 'cream'}
          band="lg"
          labelledBy={`carta-${carta.id}`}
        >
          <SectionHead
            eyebrow={carta.eyebrow}
            eyebrowTone={n % 2 === 0 ? 'deep' : 'plum'}
            id={`carta-${carta.id}`}
            title={carta.title}
            {...(carta.lead ? { lead: carta.lead } : {})}
          />

          {carta.columnas.length === 1 ? (
            <div className="mt-[36px] max-w-[760px]">
              {carta.columnas[0].items.map((item) => (
                <MenuRow key={item.name} item={item} detailed />
              ))}
            </div>
          ) : (
            <div className="mt-[36px] grid gap-[40px] md:grid-cols-2 lg:gap-[56px]">
              {carta.columnas.map((col) => (
                <MenuColumn key={col.id} section={col} />
              ))}
            </div>
          )}
        </Section>
      ))}

      {/* ── Pie legal + cierre ─────────────────────────────────────────── */}
      <Section band="md">
        <div className="flex flex-col gap-[24px] border-t border-ink/15 pt-[28px] lg:flex-row lg:items-start lg:justify-between">
          <p className="max-w-[52ch] text-[15px] leading-[1.6] text-body/75">{MENU_LEGAL}</p>
          <div className="flex flex-col gap-[12px] sm:flex-row">
            <ButtonLink href="/food-trucks" variant="secondary">
              See the food trucks
            </ButtonLink>
            <ButtonLink href="/whats-on" variant="primary">
              What&rsquo;s on tonight
            </ButtonLink>
          </div>
        </div>
        {/*
          ⚠️ ACÁ DECÍA «we don't have a kitchen» y se sacó el 2026-09-15: el
          PDF «Events Packages» del propio cliente ofrece «specialty menus
          provided by in house catering». Lo que sí está verificado es que los
          trucks cobran aparte, que es el dato que la gente necesita.
          TODO: confirmar con cliente qué es el catering in house.
        */}
        <p className="mt-[20px] max-w-[60ch] text-[15px] leading-[1.6] text-body/75">
          Food comes from the trucks in the yard, and each one takes its own orders and its own
          payment. This list is the one tab that is ours.
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
        <p className="mt-[4px] max-w-[52ch] text-[16px] leading-[1.55] text-body/75">
          {item.description}
        </p>
      ) : null}
      {/* ⚠️ La cursiva se fue de la nota de abajo. El brand no la usa en
          ninguna parte y ésta era la única ocurrencia del sitio. La nota se
          distingue del cuerpo por tamaño (15px contra 16) y por color
          (`muted` contra `ink`), que es el mismo mecanismo que usa el resto
          del sistema. */}
      {detailed && item.note ? (
        <p className="mt-[2px] max-w-[52ch] text-[15px] leading-[1.5] text-muted">
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
