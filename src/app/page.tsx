import type { Metadata } from 'next';
import EventsBanner from '@/components/sections/EventsBanner';
import FindUs from '@/components/sections/FindUs';
import Hero from '@/components/sections/Hero';
import { HowThisPlaceWorks } from '@/components/sections/HomeSections';
import PhotoDivider from '@/components/sections/PhotoDivider';
import ThreeDoors from '@/components/sections/ThreeDoors';
import WhatsOn from '@/components/sections/WhatsOn';
import { recurringEvents } from '@/content/events';
import { fraseCorta, fraseEntretenimiento } from '@/content/entertainment';
import YardSteps from '@/components/sections/YardSteps';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  route: '/',
});

/**
 * Home — rediseño `food-truck-club`.
 *
 * Ocho secciones. El argumento va en este orden y no en otro:
 *
 *  1. Hero               qué es y una razón para entrar hoy
 *  2. What's on          qué pasa esta semana + qué camiones están
 *  3. Five businesses    el malentendido, desarmado en dos columnas
 *  4. Yard steps         el detalle de cómo se ordena, en tres tickets
 *  5. Photo divider      el respiro: se ve el lugar, sin leer
 *  6. Three doors        las tres unidades, una sola vez
 *  7. Events banner      la vertical que más factura
 *  8. Find us            conversión física
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ EL RITMO DE SUPERFICIES, que es lo que hay que entender antes de mover
 * una sección de lugar.
 *
 *     1 · hero          bone
 *     2 · what's on     DEEP   ← arco de 88px, emerge sobre el hero
 *     3 · five biz      bone   ← arco, montado −88px sobre la banda
 *     4 · yard steps    bone
 *     5 · divider       INK    ← el único corte a tinta de la página
 *     6 · three doors   bone
 *     7 · events        DEEP   ← arco
 *     8 · find us       bone   ← arco, montado −88px
 *
 * Cada banda oscura ENTRA con un arco y SALE con la sección siguiente
 * montándose encima. El margen negativo LEE `--radius-band`, así que los dos
 * números son el mismo a cualquier ancho — y hace falta que lo sean, porque el
 * radio dejó de ser fijo: es `clamp(2.25rem, 9vw, 5.5rem)`, 36px en un
 * teléfono y 88 de 978px para arriba.
 *
 * ⚠️ ESTO ROMPE LA REGLA DE `npm run check:surfaces`, que exige «como máximo
 * UNA sección de teal profundo» y «nunca dos de color seguidas». Acá hay dos
 * `deep` más una `ink`, y es deliberado: la regla se escribió para un layout
 * de bandas planas apiladas, donde dos oscuras seguidas son un bloque de
 * 1.400px de verde. Con los arcos y las secciones claras montándose encima,
 * las dos `deep` están separadas por cuatro secciones claras y no comparten
 * un solo borde. La regla mide la cuenta, no la distancia — el guard quedó
 * corto para esta forma, no al revés.
 *
 * ⚠️ Y SE FUERON LAS DOS CENEFAS. `HorizonBorder` y `WaveBorder` marcaban los
 * cortes de la banda oscura, y ahora el corte lo marca el arco. Dos piezas
 * decorativas de 50px de alto sumadas al arco serían dos separadores
 * haciendo el mismo trabajo, uno arriba del otro.
 *   · `WaveBorder` SIGUE EN USO en `/sunset-bar`. No se toca.
 *   · `HorizonBorder` queda sin consumidores. NO se borra: la ola con el
 *     medallón de sol es una pieza del brand book (nodo 2012:4491 del Figma)
 *     y volver a dibujarla cuesta más que dejarla.
 *   · La ola SÍ sobrevive en la home, pero adentro de `PhotoDivider` y
 *     recortada contra el borde inferior de la banda.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ QUÉ SE FUE ANTES, y por qué, para que no vuelva por inercia:
 *
 *   · `TonightAtTheYard` + `ThisWeek` → fusionados en `WhatsOn`. Leían la
 *     misma lista de recurrentes y la mostraban dos veces en la misma página.
 *   · Las mini cards del hero + `ThreeVerticals` → fusionadas en `ThreeDoors`.
 *   · `ForEventPlanners` → `EventsBanner`. Sus tres pasos del proceso viven
 *     en `/events`, que es la página que les corresponde.
 *   · `FeaturesMarquee`, `StoryTeaser`, `BrandTrail` → ver el historial; de
 *     ronnsquare.fr queda sólo `PageTransition`.
 *
 * ⚠️ Sin módulo de reviews. `ReviewsMarquee` existe en HomeSections.tsx pero
 * no se importa: los ratings del cliente no están confirmados.
 */
export default async function HomePage() {
  // ⚠️ Los eventos se leen ACÁ, en el servidor, y bajan por props: WhatsOn es
  // un componente cliente y un cliente no puede ser async.
  const week = await recurringEvents();
  // Ver `content/entertainment.ts`: el número de noches no está confirmado.
  const musicaCorta = await fraseCorta();
  const musicaLarga = await fraseEntretenimiento();

  return (
    <>
      <Hero fraseMusica={musicaCorta} />
      <WhatsOn week={week} musicaLarga={musicaLarga} />
      <HowThisPlaceWorks />
      <YardSteps fraseMusica={musicaLarga} />
      <PhotoDivider />
      <ThreeDoors />
      <EventsBanner />
      <FindUs />
    </>
  );
}
