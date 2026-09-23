import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ButtonLink } from '@/components/shared/Button';
import { HeroFadeUp } from '@/components/shared/Motion';
import Section from '@/components/shared/Section';
import { Accent, Eyebrow } from '@/components/shared/Type';

/**
 * La 404 del sitio.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ES `not-found.tsx` Y NO `global-not-found.tsx`. La raíz tiene UN solo
 * layout, así que este archivo alcanza para las dos entradas: las URLs que no
 * matchean ninguna ruta y cualquier `notFound()` que se llame desde una
 * página. `global-not-found` es experimental, pide un flag en `next.config.ts`
 * y se saltea el layout, o sea que habría que rearmar a mano header, footer,
 * fuentes y proveedor del venue. No gana nada acá.
 *
 * Hereda header y footer del layout raíz: la navegación NO se repite adentro.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ LAS FUENTES REALES DE 404, al 2026-09-23. Ninguna tiene redirect:
 *
 *   · `/whats-on/[slug]`, las fichas de evento que se borraron el 2026-09-15.
 *     Estuvieron en el sitemap, así que pueden estar compartidas o indexadas.
 *   · `/the-yard`, borrada el mismo día.
 *   · Cualquier `/events/<algo>` que no sea una de las siete fusionadas.
 *
 * ⚠️ POR ESO EL PRIMARIO ES «WHAT'S ON» Y NO «HOME». Lo más probable es que
 * quien cae acá venga de un link a un evento viejo, y lo que busca es qué hay
 * esta semana. El secundario es el hub de eventos privados, que es la otra
 * mitad de los links muertos y la vertical que más factura. Es el mismo par, y
 * en el mismo orden, que el hero de la home.
 *
 * ⚠️ LA ETIQUETA VA ANTES QUE EL NÚMERO Y QUE EL TITULAR EN EL DOM. El
 * titular es un chiste de estacionamiento, y un lector de pantalla tiene que
 * escuchar «Error: page not found» antes que el chiste. El número es
 * decoración tipográfica y va `aria-hidden`: dice lo mismo que la etiqueta.
 */

/*
  ⚠️ `metadata` en `not-found.tsx` funciona en esta versión: se midió el
  `<title>` servido, y pasa por el `template` del layout.

  ⚠️ SIN `robots` ACÁ, y es a propósito. Next ya inyecta
  `<meta name="robots" content="noindex">` en toda respuesta 404; declararlo
  además emitía DOS etiquetas robots en el mismo `<head>`, medido.
*/
export const metadata: Metadata = {
  title: 'Page not found',
};

/*
  Tres como máximo, y ninguno repite los dos CTA. Importan sobre todo en
  mobile, donde la nav está detrás del botón del menú.
*/
const RESCATE = [
  { label: 'Food trucks', href: '/food-trucks' },
  { label: 'Sunset Bar', href: '/sunset-bar' },
  /* `#find` y no `#visit`: es el `id` que `FindUs` recibe en /contact. */
  { label: 'Hours and map', href: '/contact#find' },
] as const;

export default function NotFound() {
  return (
    <Section
      tone="bone"
      band="lg"
      labelledBy="not-found-title"
      className="flex min-h-[34rem] items-center"
      innerClassName="text-center"
    >
      <HeroFadeUp>
        <Eyebrow tone="terra" as="p" className="justify-center">
          Error: page not found
        </Eyebrow>

        {/*
          El cero es el sello de la palmera, el mismo troquel redondo de la
          ola de /sunset-bar, con la sombra de sticker y el flote lento. El
          flote va en el nodo de adentro porque la inclinación también es
          `transform`: juntos, los keyframes le pisan la rotación.
        */}
        {/*
          ⚠️ NO ES `text-titan` A SECAS: es su misma recta con el piso más
          alto. El piso de titan es 56px, y a 360 el número quedaba MÁS CHICO
          que el titular de abajo, que cae en dos renglones de 45. El número
          es el elemento gráfico de la página y tiene que ganarle. Desde
          1067px la recta es la de titan y el tope es el mismo, 144px.
        */}
        <div
          aria-hidden="true"
          className="mt-gap-kicker flex items-center justify-center font-display text-[clamp(6rem,9vw,9rem)] leading-[0.85] font-extrabold uppercase text-deep"
        >
          <span>4</span>
          <span className="mx-[0.04em] inline-block w-[0.72em] rotate-6">
            <span className="sticker rt-flotar block">
              <Image
                src="/brand/sun-palm.svg"
                alt=""
                width={260}
                height={260}
                className="block h-auto w-full"
              />
            </span>
          </span>
          <span>4</span>
        </div>

        <h1
          id="not-found-title"
          className="m-0 mx-auto mt-gap-kicker max-w-[22ch] text-balance font-display text-banda font-extrabold uppercase leading-[0.9] text-ink"
        >
          Nothing&rsquo;s parked <Accent on="light">here</Accent>
        </h1>

        <p className="mx-auto mt-gap-bajada max-w-[52ch] font-body text-lead font-light leading-[1.55] text-body">
          The link may be from our old site, or the address has a typo. The bar,
          the trucks and the calendar are all still here.
        </p>

        <div className="mt-gap-cta flex flex-wrap justify-center gap-3">
          <ButtonLink href="/whats-on" variant="primary" size="lg">
            See What&rsquo;s On
          </ButtonLink>
          <ButtonLink href="/events" variant="outline" size="lg">
            Plan an Event
          </ButtonLink>
        </div>

        <nav aria-label="Other places to go" className="mt-gap-cta">
          <ul className="m-0 flex list-none flex-wrap justify-center gap-x-7 gap-y-2 p-0 font-body text-dato text-muted">
            {RESCATE.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="toque link-texto">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </HeroFadeUp>
    </Section>
  );
}
