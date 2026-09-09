import type { Metadata } from 'next';
import EventsBanner from '@/components/sections/EventsBanner';
import Hero from '@/components/sections/Hero';
import FindUs from '@/components/sections/FindUs';
import { HowThisPlaceWorks } from '@/components/sections/HomeSections';
import ThreeDoors from '@/components/sections/ThreeDoors';
import Scallop from '@/components/shared/Scallop';
import WhatsOn from '@/components/sections/WhatsOn';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  route: '/',
});

/**
 * Home.
 *
 * Seis secciones, cada una con una función y ninguna repitiendo a otra:
 *
 *  1. Hero + muro de videos    corrige la lectura de «restaurante» y muestra
 *                              el lugar en movimiento
 *  2. What's on                qué hay HOY primero, y la semana detrás. Es la
 *                              razón por la que alguien vuelve a entrar
 *  3. How this place works     desarma quién te cobra qué
 *  4. Three doors              las tres unidades, una sola vez
 *  5. Events banner            la vertical que más factura, en un banner
 *  6. Find us                  conversión física
 *
 * ⚠️ QUÉ SE FUE, y por qué, para que no vuelva por inercia:
 *
 *   · `TonightAtTheYard` + `ThisWeek` → fusionados en `WhatsOn`. Leían la
 *     misma lista de recurrentes y la mostraban dos veces en la misma página.
 *   · Las mini cards del hero + `ThreeVerticals` → fusionadas en `ThreeDoors`.
 *     Enumeraban las mismas tres unidades con distinta ropa.
 *   · `ForEventPlanners` → `EventsBanner`. Sus tres pasos del proceso NO se
 *     borraron: viven en `/events`, que es la página que les corresponde.
 *   · `FeaturesMarquee` → decía lo mismo que el `PromoBar` nuevo, en la misma
 *     pantalla.
 *   · `StoryTeaser` → «Nuestra historia» vive en `/our-story` y punto.
 *   · `BrandTrail` → el elemento de marca que acompañaba el scroll. Salió por
 *     pedido de Camila; de ronnsquare.fr queda sólo `PageTransition`.
 *
 * ⚠️ Sin módulo de reviews. `ReviewsMarquee` existe en HomeSections.tsx pero
 * no se importa: los ratings del cliente no están confirmados.
 */
export default function HomePage() {
  return (
    <>
      <Hero />

      <WhatsOn />

      {/*
        ⚠️ EL FESTÓN VUELVE, y vuelve acá y no en cualquier corte. Camila lo
        dibujó en el boceto —el zigzag entre secciones— y la regla del propio
        componente es que va sólo donde el fondo CAMBIA de verdad. Estuvo dado
        de baja un tiempo justamente por eso: quedó entre hueso y hueso cuando
        `WhatsOn` dejó de ser crema, y ahí no separaba nada.

        Ahora sí hay qué marcar: `WhatsOn` es blanco y «How this place works»
        es la losa verde. Son los dos únicos cortes de la home donde el fondo
        salta de claro a oscuro, así que son los dos únicos festones.

        ⚠️ El trazo sigue siendo PLACEHOLDER —un arco repetido— hasta que
        llegue el SVG del brand book. Cuando llegue se cambia el `<path>` de
        `Scallop.tsx` y estos dos usos no se tocan.
      */}
      <Scallop from="paper" to="deep" />
      <HowThisPlaceWorks />
      <Scallop from="deep" to="paper" />

      <ThreeDoors />
      <EventsBanner />
      <FindUs />
    </>
  );
}
