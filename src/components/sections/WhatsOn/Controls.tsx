'use client';

import { ArrowLeft, ArrowRight } from '@/components/shared/Icon';

export function Controls({
  maxIndex,
  slides,
  index,
  canPrev,
  canNext,
  onPrev,
  onNext,
  onDot,
}: {
  readonly maxIndex: number;
  readonly slides: readonly string[];
  readonly index: number;
  readonly canPrev: boolean;
  readonly canNext: boolean;
  readonly onPrev: () => void;
  readonly onNext: () => void;
  readonly onDot: (i: number) => void;
}) {
  if (maxIndex <= 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 pt-6.5 sm:gap-5">
      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        className="hidden size-13 shrink-0 place-items-center rounded-pill bg-cream md:grid text-deep transition-all duration-300 ease-brand hover:bg-paper active:scale-95 disabled:pointer-events-none disabled:bg-transparent disabled:text-muted-dark disabled:ring-1 disabled:ring-muted-dark/50"
      >
        <span className="sr-only">Previous events</span>
        <ArrowLeft />
      </button>
      <div className="flex gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide}
            type="button"
            onClick={() => onDot(i)}
            aria-current={i === index ? 'true' : undefined}
            className="group -mx-1 grid size-9 place-items-center rounded-pill sm:size-11"
          >
            <span className="sr-only">{slide}</span>
            <span
              className={[
                'block size-2.25 rounded-pill transition-all duration-300 ease-brand',
                'group-hover:scale-140',
                i === index ? 'bg-sunset' : 'bg-muted-dark/40 group-hover:bg-muted-dark',
              ].join(' ')}
            />
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        className="hidden size-13 shrink-0 place-items-center rounded-pill bg-cream md:grid text-deep transition-all duration-300 ease-brand hover:bg-paper active:scale-95 disabled:pointer-events-none disabled:bg-transparent disabled:text-muted-dark disabled:ring-1 disabled:ring-muted-dark/50"
      >
        <span className="sr-only">Next events</span>
        <ArrowRight />
      </button>
    </div>
  );
}
