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
import { shortPhrase, entertainmentPhrase } from '@/content/entertainment';
import { happyHourPhrase } from '@/content/happy-hour';
import YardSteps from '@/components/sections/YardSteps';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  route: '/',
});

export default async function HomePage() {
  const events = await getVenueEvents();
  const upcoming = upcomingOccurrences(events, todayInVenue(), 8);
  const shortMusic = await shortPhrase();
  const longMusic = await entertainmentPhrase();
  const happyHour = await happyHourPhrase();

  return (
    <>
      <Hero musicPhrase={shortMusic} happyHourPhrase={happyHour} />
      <WhatsOn upcoming={upcoming} longMusic={longMusic} />
      <ThreeDoors />
      <PhotoDivider />
      <HowThisPlaceWorks />
      <YardSteps musicPhrase={longMusic} />
      <EventsBanner />
      <FindUs />
    </>
  );
}
