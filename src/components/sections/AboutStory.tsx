import IntroSplit from '@/components/shared/IntroSplit';
import { STORY_LEAD } from '@/content/people';

export default function AboutStory({ id = 'story-title' }: { readonly id?: string }) {
  return (
    <IntroSplit id={id} title="A rooftop built over " accent="a food truck park">
            <p className="m-0 max-w-[52ch] font-body text-intro font-light text-ink">
              {STORY_LEAD}
            </p>

            <p className="m-0 mt-3 max-w-[52ch] font-body text-intro font-light text-ink">
              What went up on that corner is a bar on the roof of a yard with four independent
              kitchens in it, across the street from Riverside Park.
            </p>
    </IntroSplit>
  );
}
