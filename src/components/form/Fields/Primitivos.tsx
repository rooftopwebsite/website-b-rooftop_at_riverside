import type { ReactNode } from 'react';
import { CaretDown } from '@/components/shared/Icon';

export function Label({
  htmlFor,
  children,
  required,
  hint,
}: {
  readonly htmlFor: string;
  readonly children: ReactNode;
  readonly required?: boolean;
  readonly hint?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="flex-1 font-body text-[16px] font-bold">
      {children}
      {required ? (
        <span className="ml-[4px] text-terra" aria-hidden="true">
          *
        </span>
      ) : null}
      {hint ? <span className="ml-[8px] font-normal text-body/75">{hint}</span> : null}
    </label>
  );
}

export function ErrorText({ id, children }: { readonly id: string; readonly children: ReactNode }) {
  return (
    <p id={id} className="text-[15px] font-bold text-terra">
      {children}
    </p>
  );
}

export function Wrap({ children }: { readonly children: ReactNode }) {
  return <div className="flex h-full flex-col gap-[8px]">{children}</div>;
}

export function Control({ children }: { readonly children: ReactNode }) {
  return <span className="relative flex">{children}</span>;
}

export function SelectCaret() {
  return (
    <CaretDown
      className="pointer-events-none absolute right-[18px] top-1/2 size-4 -translate-y-1/2 text-body/70"
      aria-hidden="true"
    />
  );
}

export function Contador({ id, largo, max }: { readonly id: string; readonly largo: number; readonly max: number }) {
  if (largo < max * 0.8) return null;
  return (
    <p id={id} className={`text-right text-[14px] tabular-nums ${largo >= max ? 'font-bold text-terra' : 'text-body/70'}`}>
      {largo} / {max}
    </p>
  );
}

export function InlineLabel({
  htmlFor,
  children,
  required,
}: {
  readonly htmlFor: string;
  readonly children: ReactNode;
  readonly required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="shrink-0 basis-full sm:basis-auto">
      {children}
      {required ? (
        <span className="ml-[4px] text-terra" aria-hidden="true">
          *
        </span>
      ) : null}
    </label>
  );
}
