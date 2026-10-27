import Image from 'next/image';
import { ArrowUpRight } from '@/components/shared/Icon';
import { PhotoPending } from '@/components/shared/PendingData';
import Section from '@/components/shared/Section';
import { SectionHead } from '@/components/shared/Type';
import { truckMenus } from '@/content/menus';
import { displayName } from '@/content/trucks';
import { getVenue } from '@/lib/venue';
import type { Hours } from '@/types/content';

const AWNING = {
  stripes: 10,
  canvasHeight: 48,
  tip: 12,
  entry: 18,
  overhang: 8,
  peek: 26,
} as const;

const AWNING_STRIPES = ['var(--color-terra)', 'var(--color-magenta)'] as const;

const stripePath = (i: number) => {
  const { canvasHeight, tip } = AWNING;
  const x = i;
  return `M${x} 0H${x + 1}V${canvasHeight}A0.5 ${tip} 0 0 1 ${x} ${canvasHeight}Z`;
};

function AwningEdge() {
  const { stripes, canvasHeight, tip } = AWNING;
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -inset-x-2 -top-[26px] z-10 block [clip-path:polygon(18px_0,calc(100%-18px)_0,100%_100%,0_100%)]"
    >
      <svg
        role="presentation"
        width="100%"
        height={canvasHeight + tip}
        viewBox={`0 0 ${stripes} ${canvasHeight + tip}`}
        preserveAspectRatio="none"
        className="block"
      >
        {Array.from({ length: stripes }, (_, i) => (
          <path key={i} d={stripePath(i)} fill={AWNING_STRIPES[i % AWNING_STRIPES.length]} />
        ))}
      </svg>
    </span>
  );
}

function truckSegments(hours: readonly Hours[]) {
  const out: { label: string; schedule: string; first: string }[] = [];
  hours.filter((h) => !/closed/i.test(h.trucks)).forEach((row) => {
    const last = out[out.length - 1];
    if (last && last.schedule === row.trucks) {
      last.label = `${last.first} to ${row.day}`;
      return;
    }
    out.push({ label: row.day, schedule: row.trucks, first: row.day });
  });
  return out;
}

export default async function TruckCards({
  id = 'roster-title',
  tone = 'paper',
  head = true,
}: {
  readonly id?: string;
  readonly tone?: 'paper' | 'bone' | 'mint';
  readonly head?: boolean;
}) {
  const menus = await truckMenus();
  const segments = truckSegments((await getVenue()).hours);

  return (
    <Section tone={tone} band="lg" bandTop={head ? undefined : 'none'} labelledBy={id}>
      {head ? (
        <SectionHead
          eyebrow="In the yard"
          eyebrowTone="plum"
          id={id}
          title="Meet the chefs"
          lead="Every truck brings its own chef and its own specialties. Walk up, see what is cooking and pick your favorite."
        />
      ) : (
        <h2 id={id} className="sr-only">
          Meet the chefs
        </h2>
      )}

      <ul
        className={`grid list-none grid-cols-1 gap-x-6 gap-y-12 p-0 sm:grid-cols-2 lg:grid-cols-4 ${head ? 'mt-block' : ''}`}
      >
        {menus.map((menu) => {
          const t = menu.truck;
          return (
          <li key={menu.name} className="relative h-full">
            <AwningEdge />
            <article className="flex h-full flex-col overflow-hidden rounded-shell bg-paper card-shadow">
              <div className={`relative aspect-[3/2] ${t?.photo ? 'bg-fog' : ''}`}>
                {t?.photo ? (
                  <>
                    <Image
                      src={t.photo}
                      alt={t.photoAlt ?? menu.name}
                      fill
                      sizes="(min-width: 1024px) 280px, (min-width: 640px) 46vw, 92vw"
                      className="object-cover"
                    />
                  </>
                ) : (
                  <PhotoPending
                    brief={t?.photoBrief ?? `The ${menu.name} truck and a plated dish.`}
                    ratio="aspect-[3/2]"
                    className="h-full"
                  />
                )}
              </div>

              <div className="flex flex-1 flex-col p-5">
                {t ? (
                  <p className="m-0 font-body text-micro font-bold uppercase tracking-cta text-muted">
                    {t.cuisine}
                  </p>
                ) : null}

                <h3
                  className={`m-0 font-display text-d5 font-bold uppercase leading-none text-ink ${t ? 'mt-1.5' : ''}`}
                >
                  {t ? displayName(t) : menu.name}
                </h3>
                {menu.description ? (
                  <p className="m-0 mt-3 font-body text-data font-light leading-[1.5] text-body">
                    {menu.description}
                  </p>
                ) : null}

                <div className="mt-auto pt-5">
                  {menu.pdfUrl ? (
                    <a
                      href={menu.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-pill bg-sunset px-4.5 py-2 font-body text-data font-semibold uppercase tracking-cta text-ink transition-colors duration-200 hover:bg-sunset-hover"
                    >
                      See the menu
                      <ArrowUpRight className="size-3.5 shrink-0" />
                      <span className="sr-only">
                        for {t ? displayName(t) : menu.name} (opens in a new tab)
                      </span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="inline-flex w-full items-center justify-center gap-2 rounded-pill bg-sunset px-4.5 py-2 font-body text-data font-semibold uppercase tracking-cta text-ink opacity-50"
                    >
                      See the menu
                      <ArrowUpRight className="size-3.5 shrink-0" />
                    </button>
                  )}
                </div>
              </div>
            </article>
          </li>
          );
        })}
      </ul>
      <div className="mx-auto mt-block overflow-hidden rounded-shell bg-deep grain card-shadow lg:max-w-[58rem]">
        <div className="grid gap-8 p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,auto)] lg:items-center lg:gap-14 lg:p-11">
          <div>
            <h3 className="m-0 font-display text-d4 font-bold uppercase leading-none text-paper lg:text-d3">
              When the trucks
              <br className="hidden lg:block" /> are open
            </h3>
            <p className="m-0 mt-3.5 max-w-[34ch] font-body text-data font-light text-muted-dark">
              The bar upstairs opens an hour earlier every day.
            </p>
          </div>

          <dl className="m-0 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 sm:gap-y-6 lg:gap-x-14 lg:gap-y-7">
            {segments.map((t) => (
              <div key={t.label} className="border-t border-paper/20 pt-4">
                <dt className="font-body text-micro font-bold uppercase tracking-cta text-cream">
                  {t.label}
                </dt>
                <dd className="m-0 mt-2 font-display text-d6 font-bold tabular-nums leading-none text-paper">
                  {t.schedule}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
