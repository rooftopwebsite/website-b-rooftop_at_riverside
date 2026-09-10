import type { Metadata } from 'next';
import EventsBanner from '@/components/sections/EventsBanner';
import Hero from '@/components/sections/Hero';
import FindUs from '@/components/sections/FindUs';
import { HowThisPlaceWorks } from '@/components/sections/HomeSections';
import ThreeDoors from '@/components/sections/ThreeDoors';
import HorizonBorder from '@/components/shared/HorizonBorder';
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

      {/* `bone` contra `paper` es un escalón de 1,08:1 — se ve el corte, pero
          NO lleva cenefa. La regla del componente es que la cenefa marca el
          cambio de superficie que salta de verdad, y meterla en un escalón
          sutil la convierte en un patrón de fondo. */}
      <HowThisPlaceWorks />

      <ThreeDoors />

      {/*
        ⚠️ LAS DOS CENEFAS SE MUDARON ACÁ, y no es cosmético: siguen al corte
        oscuro. Estaban alrededor de «How this place works» cuando esa sección
        era la losa verde; ahora la banda oscura es Events banner, así que la
        entrada y la salida del verde están en este par.

        La cenefa de olas es el separador real del brand book —página
        «Elementos» del Figma, tres veces y en tres colores—. Antes acá había un
        festón de arcos que era invento mío mientras no estaba el archivo.

        ⚠️ Son DOS en toda la home y ni una más. Con la home clara hay un solo
        salto fuerte de superficie, así que las dos sirven a la misma sección.
        Es el único riesgo que me preocupa de este recurso: dos apariciones de
        la misma pieza de marca a 50px de alto pueden leerse como manierismo. Si
        se ve así, la de salida se va y el corte se cierra seco.

        ⚠️ El color va en la sección de ABAJO: las olas tienen las crestas hacia
        arriba, así que es la sección que viene la que emerge sobre la que
        termina. Ver la nota del componente.
      */}
      {/*
        ⚠️ ENTRA POR EL HORIZONTE Y SALE POR LA CENEFA. Son dos piezas distintas
        para dos cortes distintos, y eso resuelve el riesgo que había anotado en
        la autocrítica: con la misma cenefa arriba y abajo, dos apariciones de
        la misma pieza de marca a 50px de alto se leían como manierismo.

        El horizonte —la ola con el medallón de sol y palmera, nodo 2012:4491
        del Figma— va en la ENTRADA porque es el único salto de claro a oscuro
        de la home y el dibujo lo dice literalmente: la superficie oscura sube
        como ola y el sol se pone detrás. Encaja con el concepto de la rama, que
        es que la página va del mediodía a la noche.

        La cenefa de olas lisa cierra la salida: volver a la luz no necesita
        ceremonia.
      */}
      <HorizonBorder from="paper" to="deep" />
      <EventsBanner />
      <WaveBorder from="deep" to="paper" />

      <FindUs />
    </>
  );
}
