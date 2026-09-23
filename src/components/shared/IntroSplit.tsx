import type { ReactNode } from 'react';
import { Reveal } from '@/components/shared/Motion';
import Section from '@/components/shared/Section';
import { Heading } from '@/components/shared/Type';

export default function IntroSplit({
  id,
  title,
  accent,
  children,
}: {
  readonly id: string;
  readonly title: ReactNode;
  readonly accent: ReactNode;
  readonly children: ReactNode;
}) {
  return (
    <Section tone="bone" band="lg" bandTop="sm" labelledBy={id}>
      <Reveal>
        <div className="grid items-start gap-y-7 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-x-12">
          <Heading level={2} id={id} className="text-balance text-d4 md:text-d3 lg:max-w-[20ch] lg:text-d2">
            {title}
            <span className="text-sunset-deep">{accent}</span>
          </Heading>
          <div>{children}</div>
        </div>
      </Reveal>
    </Section>
  );
}
