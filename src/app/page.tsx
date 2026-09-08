import type { Metadata } from 'next';
import Hero from '@/components/sections/Hero';
import TonightAtTheYard from '@/components/sections/TonightAtTheYard';
import {
  FeaturesMarquee,
  FindUs,
  ForEventPlanners,
  HowThisPlaceWorks,
  StoryTeaser,
  ThisWeek,
  ThreeVerticals,
} from '@/components/sections/HomeSections';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Rooftop Bar & Food Truck Park in Bonita Springs',
  description:
    'A rooftop bar over a curated food truck park in downtown Bonita Springs. Four independent kitchens, craft cocktails, live music five nights a week, and a venue you can rent.',
  path: '/',
});

/**
 * Home.
 *
 * El orden de las secciones es el del brief, y cada una tiene una función:
 *
 *  1. Hero + selector de intención  corrige la lectura de «restaurante»
 *  2. Tonight at the Yard           el módulo diferencial
 *  3. Marquee de features           respiro, y lista lo que nadie más tiene
 *  4. How this place works          desarma quién te cobra qué
 *  5. Los tres verticales           separa visualmente las tres unidades
 *  6. For event planners            la vertical que más factura
 *  7. This week                     recurrencia, razón para volver
 *  8. Our story                     la familia Magnus
 *  9. Find us                       conversión física
 * 10. Last call + newsletter        viven en el footer
 *
 * ⚠️ Sin módulo de reviews. `ReviewsMarquee` existe en HomeSections.tsx pero
 * no se importa: los ratings del cliente no están confirmados.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <TonightAtTheYard />
      <FeaturesMarquee />
      <HowThisPlaceWorks />
      <ThreeVerticals />
      <ForEventPlanners />
      <ThisWeek />
      <StoryTeaser />
      <FindUs />
    </>
  );
}
