import Link from 'next/link';
import { GUTTER } from '@/components/shared/Section';

export type JoinLane = 'team' | 'artist';

export function parseLane(v: string | string[] | undefined): JoinLane {
  return v === 'artist' ? 'artist' : 'team';
}

const LANES: readonly {
  readonly id: JoinLane;
  readonly label: string;
}[] = [
  { id: 'team', label: 'The team' },
  { id: 'artist', label: 'Artists' },
];

const ACTIVE = 'bg-deep text-paper';

export default function JoinSwitch({ lane }: { readonly lane: JoinLane }) {
  return (
    <div className={`grain bg-paper pt-gap-cta pb-[28px] lg:pb-[36px] ${GUTTER}`}>
      <div className="page-box">
        <nav aria-label="What you are applying for">
          <ul className="m-0 mx-auto flex w-fit list-none gap-[4px] rounded-pill border border-teal600/30 p-[3px]">
            {LANES.map((c) => {
              const active = c.id === lane;
              return (
                <li key={c.id}>
                  <Link
                    href={`/join-us?apply=${c.id}`}
                    scroll={false}
                    aria-current={active ? 'page' : undefined}
                    className={[
                      'flex items-center whitespace-nowrap rounded-pill px-[16px] py-[9px] text-caption font-bold uppercase tracking-[0.1em] transition-colors lg:px-[22px]',
                      active ? ACTIVE : 'text-deep hover:bg-mint/60',
                    ].join(' ')}
                  >
                    {c.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
