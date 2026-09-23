import FeaturedEventCard, { type FeaturedDeal } from '@/components/shared/FeaturedEventCard';
import { Reveal } from '@/components/shared/Motion';
import Section from '@/components/shared/Section';
import { featuredEvent } from '@/content/events';

export default async function FeaturedEvent({
  deals,
  dealsLabel,
}: {
  readonly deals?: readonly FeaturedDeal[];
  readonly dealsLabel?: string;
} = {}) {
  const event = await featuredEvent();
  if (!event) return null;

  return (
    <Section tone="deep" band="md" labelledBy="featured-title">
      <Reveal>
        <FeaturedEventCard
          event={event}
          deals={deals}
          dealsLabel={dealsLabel}
          headingLevel={2}
          headingId="featured-title"
        />
      </Reveal>
    </Section>
  );
}
