import type { ReactNode } from 'react';
import { RevealItem, StaggerGroup } from './Motion';
import { Heading } from './Type';

export interface Step {
  readonly n: string;
  readonly title: string;
  readonly body: string;
  readonly tags: readonly string[];
}

const COLUMNS: Record<number, string> = {
  1: 'desk:grid-cols-1',
  2: 'desk:grid-cols-2',
  3: 'desk:grid-cols-3',
  4: 'desk:grid-cols-4',
  5: 'desk:grid-cols-5',
  6: 'desk:grid-cols-6',
};

const MEDIA_HEIGHT: Record<number, string> = {
  1: 'desk:row-span-1',
  2: 'desk:row-span-2',
  3: 'desk:row-span-3',
  4: 'desk:row-span-4',
  5: 'desk:row-span-5',
};

const STAIR_STEP = [
  'desk:col-start-1 desk:row-start-1',
  'desk:col-start-2 desk:row-start-2',
  'desk:col-start-3 desk:row-start-3',
  'desk:col-start-4 desk:row-start-4',
  'desk:col-start-5 desk:row-start-5',
  'desk:col-start-6 desk:row-start-6',
];

export default function StepStair({
  items,
  media,
  className = '',
}: {
  readonly items: readonly Step[];
  readonly media?: ReactNode;
  readonly className?: string;
}) {
  return (
    <StaggerGroup
      as="ol"
      className={[
        'flex flex-col',
        'desk:grid',
        COLUMNS[items.length],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {media ? (
        <li
          className={`hidden desk:col-start-1 desk:row-start-2 desk:block desk:pr-8 desk:pt-9 ${MEDIA_HEIGHT[Math.max(items.length - 1, 1)]}`}
        >
          {media}
        </li>
      ) : null}

      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <RevealItem
            key={item.n}
            as="li"
            className={[
              'border-l border-fog pl-4.5',
              last ? 'pb-0' : 'pb-7.5 desk:border-b desk:border-fog desk:pb-14',
              'desk:pl-5.5',
              STAIR_STEP[i],
            ].join(' ')}
          >
            <div className="grid grid-cols-[30px_minmax(0,1fr)] gap-x-2.5">
              <span
                aria-hidden="true"
                className="pt-1.75 font-body text-data font-medium tabular-nums tracking-label text-muted"
              >
                {item.n}
              </span>

              <div>
                <Heading level={3}>{item.title}</Heading>

                <p className="mt-3 max-w-[38ch] text-base text-ink">
                  {item.body}
                </p>
                <ul className="mt-3.5 flex flex-wrap items-center gap-x-2.25 gap-y-1.25">
                  {item.tags.map((tag, t) => (
                    <li key={tag} className="flex items-center gap-2.25">
                      {t > 0 ? (
                        <span aria-hidden="true" className="h-0.75 w-0.75 rounded-pill bg-sunset" />
                      ) : null}
                      <span className="font-body text-micro font-medium text-muted">
                        {tag}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </RevealItem>
        );
      })}
    </StaggerGroup>
  );
}
