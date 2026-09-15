import type { Metadata } from 'next';
import Link from 'next/link';
import CompareSlab from '@/components/shared/CompareSlab';
import Marquee from '@/components/shared/Marquee';
import TruckCarousel from '@/components/sections/TruckCarousel';
import PageHero from '@/components/shared/PageHero';
import Section from '@/components/shared/Section';
import { Heading, SectionHead } from '@/components/shared/Type';
import { activeTrucks } from '@/content/trucks';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  route: "/food-trucks",
});

/**
 * /food-trucks
 *
 * ⚠️ La grilla lleva los trucks MÁS UNA QUINTA TARJETA que es el Sunset Bar, al
 * mismo nivel visual. Eso comunica el modelo de negocio sin explicarlo: acá hay
 * cinco lugares donde gastar plata y sólo uno es del venue.
 *
 * ⚠️ Sin precios de los trucks. Los precios son del vendor, no del venue.
 *
 * ⚠️ La rotación NO se muestra acá. Qué truck está hoy vive en el home y en
 * /whats-on.
 */
export default function FoodTrucksPage() {
  const trucks = activeTrucks();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(breadcrumbJsonLd([{ name: 'Food Trucks', path: '/food-trucks' }])),
        }}
      />

      <PageHero
        eyebrow="The yard"
        title="Four kitchens. One yard."
        lead="The trucks rotate. Each one is independently owned, sets its own menu and takes its own payment. We just give them the yard and the crowd."
        crumbs={[{ name: 'Food Trucks', path: '/food-trucks' }]}
      />

      {/*
        BLOQUE G: la marquesina con los nombres del roster.

        ⚠️ LOS NOMBRES NO ESTÁN ESCRITOS ACÁ. Salen de `activeTrucks()`, que es
        el roster vigente. Es el dato que más cambia de todo el sitio: el sitio
        viejo tiene tres fichas de trucks que ya no están y ninguna de los dos
        que sí. Transcribir cuatro nombres a un componente es garantizar que en
        dos meses la marquesina nombre un camión que se fue.

        ⚠️ Es CSS puro y se detiene con `prefers-reduced-motion` y al pasar el
        puntero. Ver `components/shared/Marquee.tsx`.
      */}
      <Marquee
        label={`Tonight in the yard: ${trucks.map((t) => t.name).join(', ')}`}
        className="border-y border-ink/12 bg-bone py-[18px]"
        duracion={38}
      >
        {trucks.map((t) => (
          <span key={t.slug} className="flex shrink-0 items-center gap-[48px]">
            <span className="font-display text-d5 uppercase leading-none whitespace-nowrap lg:text-d4">
              {t.name}
            </span>
            <span aria-hidden="true" className="size-[8px] shrink-0 rounded-pill bg-sunset" />
          </span>
        ))}
      </Marquee>

      <Section band="lg" labelledBy="roster-title">
        <SectionHead
          eyebrow="In the yard now"
          eyebrowTone="terra"
          id="roster-title"
          title="Tonight's roster"
          lead="Which trucks are in on a given night is on the calendar."
        />

        <TruckCarousel trucks={trucks} />
      </Section>

      {/*
        ══════════════════════════════════════════════════════════════════
        BLOQUE E: la losa oscura, y acá es la pieza más importante de la
        página.

        ⚠️ ES *LA* CONFUSIÓN DEL NEGOCIO. La gente llega creyendo que esto es
        un restaurante con varias cocinas, y entonces espera una cuenta, un
        mozo y un menú. Nada de eso existe. Ponerlo en una comparación lado a
        lado es la forma más rápida de que se entienda, y por eso se gana la
        única superficie oscura de la página.

        ⚠️ LA COLUMNA DE LA DERECHA NO DICE QUE UN RESTAURANTE SEA PEOR. Dice
        en qué se diferencia. El argumento se sostiene solo.
        ══════════════════════════════════════════════════════════════════
      */}
      <CompareSlab
        id="how-pay"
        eyebrow="How this works"
        title="One yard, five registers"
        lead="It reads like a restaurant with several kitchens. It is not, and the difference shows up when you go to pay."
        ours={{
          label: 'Here',
          rows: [
            'You order at whichever window you want',
            'Each truck is its own business, with its own register and its own receipt',
            'Four parties at one table can each eat something different',
            'Drinks come from the Sunset Bar upstairs, and that tab is ours',
            'No waiting for a table: find a seat and go up to the window',
          ],
        }}
        theirs={{
          label: 'A restaurant',
          rows: [
            'One kitchen, one menu, one check',
            'A server takes the order and brings it over',
            'Everyone eats from the same list',
            'Food and drinks land on the same bill',
            'A host seats you when a table opens',
          ],
        }}
      />

      {/*
        BLOQUE C: dos columnas de argumento.

        ⚠️ ACÁ ARRIBA HABÍA UN PÁRRAFO QUE DECÍA «No delivery, no takeout, no
        online ordering» y se sacó el 2026-09-15. Ninguna de las tres cosas
        está en ninguna fuente: el brief lista «Delivery» y «Takeout» como
        opciones del modelo de servicio, deja el cuadro de plataformas VACÍO y
        anota al lado «confirmar contra el contrato firmado si este servicio
        realmente aplica».
        TODO: confirmar con cliente si hay delivery y takeout.
      */}
      <Section band="lg" labelledBy="rota-title">
        <SectionHead
          eyebrow="The roster"
          eyebrowTone="plum"
          id="rota-title"
          title="Four kitchens, and they rotate"
        />
        <div className="mt-[36px] grid gap-[32px] lg:grid-cols-2 lg:gap-[64px]">
          <div>
            <Heading level={3} role="card">
              Who is in tonight
            </Heading>
            <p className="mt-[10px] max-w-[46ch] text-[16px] leading-[1.7] text-body/80">
              The roster changes. Four trucks run the yard on a revenue share, each one
              independently owned, and which ones are in on a given night is on the calendar.
            </p>
            <p className="mt-[16px]">
              <Link href="/whats-on" className="link-texto font-bold">
                See the calendar
              </Link>
            </p>
          </div>
          <div>
            <Heading level={3} role="card">
              Where the menus are
            </Heading>
            <p className="mt-[10px] max-w-[46ch] text-[16px] leading-[1.7] text-body/80">
              At the trucks. Menus and prices belong to each owner and change often, so we do not
              publish them. The bar menu is on this site because the bar is ours.
            </p>
            <p className="mt-[16px]">
              <Link href="/sunset-bar" className="link-texto font-bold">
                See the bar menu
              </Link>
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
