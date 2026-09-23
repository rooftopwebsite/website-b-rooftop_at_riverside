import Image from 'next/image';
import { ArrowUpRight } from '@/components/shared/Icon';
import { PhotoPending } from '@/components/shared/PendingData';
import Section from '@/components/shared/Section';
import { SectionHead } from '@/components/shared/Type';
import { cartasDeTrucks } from '@/content/menus';
import { nombreVisible } from '@/content/trucks';
import { HOURS } from '@/content/hours';

const TOLDO = {
  rayas: 10,
  lona: 48,
  punta: 12,
  entrada: 18,
  vuelo: 8,
  asomo: 26,
} as const;

const TOLDO_RAYAS = ['var(--color-terra)', 'var(--color-magenta)'] as const;

const rayaD = (i: number) => {
  const { lona, punta } = TOLDO;
  const x = i;
  return `M${x} 0H${x + 1}V${lona}A0.5 ${punta} 0 0 1 ${x} ${lona}Z`;
};

function ToldoEdge() {
  const { rayas, lona, punta } = TOLDO;
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -inset-x-2 -top-[26px] z-10 block [clip-path:polygon(18px_0,calc(100%-18px)_0,100%_100%,0_100%)]"
    >
      <svg
        role="presentation"
        width="100%"
        height={lona + punta}
        viewBox={`0 0 ${rayas} ${lona + punta}`}
        preserveAspectRatio="none"
        className="block"
      >
        {Array.from({ length: rayas }, (_, i) => (
          <path key={i} d={rayaD(i)} fill={TOLDO_RAYAS[i % TOLDO_RAYAS.length]} />
        ))}
      </svg>
    </span>
  );
}

function tramosDeTrucks() {
  const out: { label: string; horario: string; primero: string }[] = [];
  HOURS.filter((h) => !/closed/i.test(h.trucks)).forEach((row) => {
    const ultimo = out[out.length - 1];
    if (ultimo && ultimo.horario === row.trucks) {
      ultimo.label = `${ultimo.primero} to ${row.day}`;
      return;
    }
    out.push({ label: row.day, horario: row.trucks, primero: row.day });
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
  const cartas = await cartasDeTrucks();
  const tramos = tramosDeTrucks();

  return (
    <Section tone={tone} band="lg" bandTop={head ? undefined : 'none'} labelledBy={id}>
      {head ? (
        <SectionHead
          eyebrow="In the yard"
          eyebrowTone="plum"
          id={id}
          title="The four kitchens"
          lead="Each one is its own business. You order at the window and you pay that truck: separate line, separate card, separate receipt."
        />
      ) : (
        <h2 id={id} className="sr-only">
          The four kitchens
        </h2>
      )}

      <ul
        className={`grid list-none grid-cols-1 gap-x-6 gap-y-12 p-0 sm:grid-cols-2 lg:grid-cols-4 ${head ? 'mt-bloque' : ''}`}
      >
        {cartas.map((carta) => {
          const t = carta.truck;
          return (
          <li key={carta.name} className="relative h-full">
            <ToldoEdge />
            <article className="flex h-full flex-col overflow-hidden rounded-shell bg-paper sombra-card">
              <div className={`relative aspect-[3/2] ${t?.photo ? 'bg-fog' : ''}`}>
                {t?.photo ? (
                  <>
                    <Image
                      src={t.photo}
                      alt={t.photoAlt ?? carta.name}
                      fill
                      sizes="(min-width: 1024px) 280px, (min-width: 640px) 46vw, 92vw"
                      className="object-cover"
                    />
                  </>
                ) : (
                  <PhotoPending
                    brief={t?.photoBrief ?? `El truck de ${carta.name} y un plato servido.`}
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
                  {t ? nombreVisible(t) : carta.name}
                </h3>
                {carta.description ? (
                  <p className="m-0 mt-3 font-body text-dato font-light leading-[1.5] text-body">
                    {carta.description}
                  </p>
                ) : null}

                <div className="mt-auto pt-5">
                  {carta.pdfUrl ? (
                    <a
                      href={carta.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-pill bg-sunset px-4.5 py-2 font-body text-dato font-semibold uppercase tracking-cta text-ink transition-colors duration-200 hover:bg-sunset-hover"
                    >
                      See the menu
                      <ArrowUpRight className="size-3.5 shrink-0" />
                      <span className="sr-only">
                        for {t ? nombreVisible(t) : carta.name} (opens in a new tab)
                      </span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="inline-flex w-full items-center justify-center gap-2 rounded-pill bg-sunset px-4.5 py-2 font-body text-dato font-semibold uppercase tracking-cta text-ink opacity-50"
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
      <div className="mx-auto mt-bloque overflow-hidden rounded-shell bg-deep grano sombra-card lg:max-w-[58rem]">
        <div className="grid gap-8 p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,auto)] lg:items-center lg:gap-14 lg:p-11">
          <div>
            <h3 className="m-0 font-display text-d4 font-bold uppercase leading-none text-paper lg:text-d3">
              When the trucks
              <br className="hidden lg:block" /> are open
            </h3>
            <p className="m-0 mt-3.5 max-w-[34ch] font-body text-dato font-light text-muted-dark">
              The bar upstairs opens an hour earlier every day.
            </p>
          </div>

          <dl className="m-0 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 sm:gap-y-6 lg:gap-x-14 lg:gap-y-7">
            {tramos.map((t) => (
              <div key={t.label} className="border-t border-paper/20 pt-4">
                <dt className="font-body text-micro font-bold uppercase tracking-cta text-cream">
                  {t.label}
                </dt>
                <dd className="m-0 mt-2 font-display text-d6 font-bold tabular-nums leading-none text-paper">
                  {t.horario}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
