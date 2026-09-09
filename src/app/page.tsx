import type { Metadata } from 'next';
import EventsBanner from '@/components/sections/EventsBanner';
import Hero from '@/components/sections/Hero';
import FindUs from '@/components/sections/FindUs';
import { HowThisPlaceWorks } from '@/components/sections/HomeSections';
import ThreeDoors from '@/components/sections/ThreeDoors';
import WaveBorder from '@/components/shared/WaveBorder';
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
        ⚠️ LA CENEFA DE OLAS, que es el separador real del brand book. Camila
        la dibujó en el boceto como un zigzag entre secciones; el archivo de
        Figma la tiene en la página «Elementos», tres veces y en tres colores.
        Antes acá había un festón de arcos que era invento mío mientras no
        estaba el archivo.

        ⚠️ Va acá y no en cualquier corte: la regla del componente es que sólo
        donde el fondo CAMBIA de verdad. `WhatsOn` es blanco y «How this place
        works» es la losa verde — son los dos únicos cortes de la home donde el
        fondo salta de claro a oscuro, así que son las dos únicas cenefas.

        ⚠️ El color va en la sección de ABAJO: las olas tienen las crestas hacia
        arriba, así que es la sección que viene la que emerge sobre la que
        termina. Ver la nota del componente.
      */}
      <WaveBorder from="paper" to="deep" />
      <HowThisPlaceWorks />
      <WaveBorder from="deep" to="paper" />

      <ThreeDoors />
      <EventsBanner />
      <FindUs />
    </>
  );
}
