'use client';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from '@/components/shared/Icon';
import { RevealItem, StaggerGroup } from '@/components/shared/Motion';
import { type Step } from '@/components/shared/StepStair';
import { TAG } from '@/lib/tag';

const ANCHO = 'w-[calc(100%-20px)] md:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)]';

const VISIBLES = [
  { mq: '(min-width: 1024px)', n: 3 },
  { mq: '(min-width: 768px)', n: 2 },
] as const;

const GAP = 24;

interface TicketStep extends Step {
  readonly kicker: string;
  readonly cta?: { readonly label: string; readonly href: string };
}

const steps = (fraseMusica: string): readonly TicketStep[] => [
  {
    n: '01',
    kicker: 'Sunset Bar',
    title: 'Quench your thirst. Ignite your night.',
    body: 'Start at the bar. Our bartenders mix cocktails fresh every day and pour drafts from the breweries down the road. Ask them about tonight’s specials and what’s on stage.',
    tags: ['Cocktails made daily', 'Local drafts', 'Ask about the specials'],
  },
  {
    n: '02',
    kicker: 'The yard',
    title: 'Travel across 4 distinct menus in a single order',
    body: 'Wander through the storylines of our four gourmet food trucks and order the culinary adventure that suits your taste, right at the window. Come back anytime: a new foodie quest awaits with every visit.',
    tags: ['Gourmet food trucks', 'Self service at the window'],
  },
  {
    n: '03',
    kicker: 'What’s on',
    title: 'Your favorite local artists',
    body: `${fraseMusica}, Bingo on Wednesdays and DJ sets late on Saturdays. Stay for the music, the friends and the fun.`,
    tags: [fraseMusica, 'Bingo Wednesdays', 'DJ sets Saturdays'],
    cta: { label: 'What’s on tonight', href: '/whats-on' },
  },
];

export default function YardSteps({ fraseMusica }: { readonly fraseMusica: string }) {
  const STEPS = steps(fraseMusica);
  const cajaRef = useRef<HTMLDivElement | null>(null);
  const track = () => (cajaRef.current?.firstElementChild as HTMLElement | null) ?? null;

  const [visibles, setVisibles] = useState(1);
  const [index, setIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    const mqs = VISIBLES.map((v) => ({ ...v, m: window.matchMedia(v.mq) }));
    const aplicar = () => setVisibles(mqs.find((v) => v.m.matches)?.n ?? 1);
    aplicar();
    mqs.forEach((v) => v.m.addEventListener('change', aplicar));
    return () => mqs.forEach((v) => v.m.removeEventListener('change', aplicar));
  }, []);

  const maxIndex = Math.max(0, STEPS.length - visibles);
  const maxIndexRef = useRef(0);
  maxIndexRef.current = maxIndex;

  const paso = () => {
    const t = track();
    const card = t?.firstElementChild;
    const gap = t ? parseFloat(getComputedStyle(t).columnGap) || GAP : GAP;
    return card ? card.getBoundingClientRect().width + gap : 320;
  };

  const medir = useCallback(() => {
    const t = track();
    if (!t) return;
    setIndex(Math.min(maxIndexRef.current, Math.round(t.scrollLeft / paso())));
    setCanPrev(t.scrollLeft > 1);
    setCanNext(t.scrollLeft < t.scrollWidth - t.clientWidth - 1);
  }, []);

  useEffect(() => {
    const t = track();
    if (!t) return;
    medir();
    t.addEventListener('scroll', medir, { passive: true });
    window.addEventListener('resize', medir, { passive: true });
    return () => {
      t.removeEventListener('scroll', medir);
      window.removeEventListener('resize', medir);
    };
  }, [medir]);

  useEffect(() => medir(), [visibles, medir]);

  const irA = (i: number) => {
    const t = track();
    if (!t) return;
    t.scrollTo({ left: Math.max(0, Math.min(maxIndex, i)) * paso(), behavior: 'smooth' });
  };

  const correr = (dir: 1 | -1) => {
    const t = track();
    if (!t) return;
    t.scrollBy({ left: dir * paso(), behavior: 'smooth' });
  };

  return (
    <section
      id="yard"
      aria-label="How ordering works"
      className="relative bg-bone grano pt-bloque pb-cierre"
    >
      <div ref={cajaRef}>
        <StaggerGroup
          as="ol"
          tabIndex={0}
          aria-label="How ordering works, step by step"
          className="caja-ancha scroll-px-borde flex snap-x snap-mandatory list-none gap-4 overflow-x-auto md:gap-6 pt-2 pb-7 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
        {STEPS.map((step) => (
          <RevealItem
            key={step.n}
            as="li"
            className={`relative flex shrink-0 snap-start pt-12.5 [filter:drop-shadow(0_1px_2px_rgba(10,31,30,0.10))_drop-shadow(0_8px_16px_rgba(10,31,30,0.16))] ${ANCHO}`}
          >
            <span className="sticker absolute top-0 left-1/2 z-30 grid size-20 -translate-x-1/2 place-items-center rounded-pill bg-paper p-1">
              <span className="grid size-full place-items-center rounded-pill bg-sunset p-1.25">
                <span className="grid size-full place-items-center content-center rounded-pill bg-cream">
                  <span className="font-body text-[14px] font-bold uppercase tracking-[0.14em] text-deep">
                    Step
                  </span>
                  <span className="font-display text-d5 font-extrabold leading-none text-deep">
                    {step.n}
                  </span>
                </span>
              </span>
            </span>
            <div className="troquel relative flex flex-1 flex-col items-center gap-3.5 rounded-ticket bg-paper px-5.5 pt-12 pb-13 text-center transition-transform duration-300 ease-brand hover:-translate-y-1.5 lg:px-8 lg:pt-15 lg:pb-16">
              <span className="font-body text-caption font-medium uppercase tracking-[0.18em] text-muted">
                {step.kicker}
              </span>
              <h3 className="m-0 max-w-[16ch] font-display text-d4 font-bold uppercase leading-[0.98] text-ink lg:text-h3">
                {step.title}
              </h3>
              <p className="m-0 max-w-[34ch] font-body text-base font-light text-ink">{step.body}</p>
              {step.cta ? (
                <Link
                  href={step.cta.href}
                  className="group inline-flex items-center gap-2 border-b-2 border-sunset pb-0.5 font-body text-base font-semibold text-ink transition-colors duration-200 hover:border-ink"
                >
                  {step.cta.label}
                  <ArrowRight className="size-3.75 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              ) : null}

              <ul className="mt-auto flex list-none flex-wrap justify-center gap-1.5 p-0 pt-5">
                {step.tags.map((tag) => (
                  <li
                    key={tag}
                    className={`inline-flex items-center gap-1.75 rounded-btn bg-bone ${TAG} text-muted`}
                  >
                    <span aria-hidden="true" className="size-1 shrink-0 rounded-pill bg-river" />
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </RevealItem>
        ))}
        </StaggerGroup>
      </div>
      {maxIndex > 0 ? (
        <div className="caja-ancha flex items-center justify-center gap-5 pt-2">
          <button
            type="button"
            onClick={() => correr(-1)}
            disabled={!canPrev}
            className="hidden size-13 place-items-center rounded-pill bg-deep md:grid text-cream ring-1 ring-deep transition-all duration-300 ease-brand hover:bg-sunset hover:text-ink active:scale-95 disabled:pointer-events-none disabled:opacity-30"
          >
            <span className="sr-only">Previous step</span>
            <ArrowLeft />
          </button>

          <div className="flex gap-2">
            {STEPS.slice(0, maxIndex + 1).map((step, i) => (
              <button
                key={step.n}
                type="button"
                onClick={() => irA(i)}
                aria-current={i === index ? 'true' : undefined}
                className="group -mx-1 grid size-11 place-items-center rounded-pill"
              >
                <span className="sr-only">{step.title}</span>
                <span
                  className={[
                    'block size-2.25 rounded-pill transition-all duration-300 ease-brand',
                    'group-hover:scale-140',
                    i === index ? 'bg-sunset' : 'bg-ink/45 group-hover:bg-ink/75',
                  ].join(' ')}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => correr(1)}
            disabled={!canNext}
            className="hidden size-13 place-items-center rounded-pill bg-deep md:grid text-cream ring-1 ring-deep transition-all duration-300 ease-brand hover:bg-sunset hover:text-ink active:scale-95 disabled:pointer-events-none disabled:opacity-30"
          >
            <span className="sr-only">Next step</span>
            <ArrowRight />
          </button>
        </div>
      ) : null}
    </section>
  );
}
