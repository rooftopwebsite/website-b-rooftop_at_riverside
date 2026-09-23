import type { Metadata } from 'next';
import EventsBanner from '@/components/sections/EventsBanner';
import FindUs from '@/components/sections/FindUs';
import Hero from '@/components/sections/Hero';
import { HowThisPlaceWorks } from '@/components/sections/HomeSections';
import PhotoDivider from '@/components/sections/PhotoDivider';
import ThreeDoors from '@/components/sections/ThreeDoors';
import WhatsOn from '@/components/sections/WhatsOn';
import { getVenueEvents } from '@/content/events';
import { todayInVenue, upcomingOccurrences } from '@/lib/calendar';
import { fraseCorta, fraseEntretenimiento } from '@/content/entertainment';
import { fraseHappyHour } from '@/content/happy-hour';
import YardSteps from '@/components/sections/YardSteps';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  route: '/',
});

export default async function HomePage() {
  const eventos = await getVenueEvents();
  const proximos = upcomingOccurrences(eventos, todayInVenue(), 8);
  const musicaCorta = await fraseCorta();
  const musicaLarga = await fraseEntretenimiento();
  const happyHour = await fraseHappyHour();

  return (
    <>
      <Hero fraseMusica={musicaCorta} fraseHappyHour={happyHour} />
      <WhatsOn proximos={proximos} musicaLarga={musicaLarga} />
      <HowThisPlaceWorks />
      <YardSteps fraseMusica={musicaLarga} />
      <PhotoDivider />
      <ThreeDoors />
      <EventsBanner />
      <FindUs />
    </>
  );
}
