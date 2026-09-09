import type { Metadata } from 'next';
import EventsBanner from '@/components/sections/EventsBanner';
import Hero from '@/components/sections/Hero';
import FindUs from '@/components/sections/FindUs';
import { HowThisPlaceWorks } from '@/components/sections/HomeSections';
import ThreeDoors from '@/components/sections/ThreeDoors';
import WhatsOn from '@/components/sections/WhatsOn';
import Scallop from '@/components/shared/Scallop';
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

      {/*
        Festón sólo donde la superficie CAMBIA de verdad. Uno solo en la home:
        la entrada del hero oscuro a la crema de `WhatsOn`. Puesto en cada corte
        dejaría de ser un gesto de marca y sería un patrón de fondo.

        ⚠️ Antes eran dos porque había dos entradas a crema. Al fusionar
        `ThisWeek` en `WhatsOn` quedó una sola.
      */}
      <Scallop from="paper" to="cream" />
      <WhatsOn />

      <HowThisPlaceWorks />
      <ThreeDoors />
      <EventsBanner />
      <FindUs />
    </>
  );
}
