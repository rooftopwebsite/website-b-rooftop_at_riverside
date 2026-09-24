'use client';

import { useState, type ReactNode } from 'react';
import { CaretDown } from '@/components/shared/Icon';
import { useField } from './contexto';
import { InlineLabel, ErrorText, Contador } from './Primitivos';
import { INPUT_BASE, BOX_BASE, OK, BAD, FRASE } from './constantes';
import type { BaseFieldProps, Option } from './tipos';

export function SentenceRow({ children }: { readonly children: ReactNode }) {
  return <div className={['flex flex-wrap items-center gap-x-3 gap-y-1 sm:gap-y-3', FRASE].join(' ')}>{children}</div>;
}

export function InlineField({
  type = 'text',
  ancho = 'crece',
  ...p
}: BaseFieldProps & {
  readonly type?: 'text' | 'email' | 'tel';
  readonly ancho?: 'crece' | 'corto';
}) {
  const { fid, eid, err, aria } = useField(p.name);
  return (
    <>
      <InlineLabel htmlFor={fid} required={p.required}>
        {p.label}
      </InlineLabel>
      <input
        id={fid}
        name={p.name}
        type={type}
        required={p.required}
        autoComplete={p.autoComplete}
        {...aria}
        className={[
          INPUT_BASE,
          ancho === 'crece' ? 'min-w-[16ch] flex-1' : 'w-[16ch] shrink-0',
          err ? BAD : OK,
        ].join(' ')}
      />
      {p.hint ? <span className="shrink-0 text-[15px] text-body/70">{p.hint}</span> : null}
      {err ? (
        <div className="basis-full">
          <ErrorText id={eid}>{err}</ErrorText>
        </div>
      ) : null}
    </>
  );
}

export function InlineSelect({
  options,
  placeholder,
  onValueChange,
  ...p
}: BaseFieldProps & {
  readonly options: readonly Option[];
  readonly placeholder?: string;
  readonly onValueChange?: (v: string) => void;
}) {
  const { fid, eid, err, aria } = useField(p.name);
  return (
    <>
      <InlineLabel htmlFor={fid} required={p.required}>
        {p.label}
      </InlineLabel>
      <span className="relative inline-flex min-w-[22ch] flex-1">
        <select
          id={fid}
          name={p.name}
          required={p.required}
          defaultValue=""
          onChange={onValueChange ? (e) => onValueChange(e.target.value) : undefined}
          {...aria}
          className={[INPUT_BASE, 'appearance-none pr-[44px]', err ? BAD : OK].join(' ')}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <CaretDown
          className="pointer-events-none absolute right-[18px] top-1/2 size-4 -translate-y-1/2"
          aria-hidden="true"
        />
      </span>
      {err ? (
        <div className="basis-full">
          <ErrorText id={eid}>{err}</ErrorText>
        </div>
      ) : null}
    </>
  );
}

export function SentenceArea(
  p: BaseFieldProps & { readonly rows?: number; readonly maxLength?: number },
) {
  const { fid, eid, err, aria } = useField(p.name);
  const [largo, setLargo] = useState(0);
  return (
    <div className="flex flex-col gap-[12px]">
      <span className={FRASE}>
        <InlineLabel htmlFor={fid} required={p.required}>
          {p.label}
        </InlineLabel>
      </span>
      <textarea
        id={fid}
        name={p.name}
        rows={p.rows ?? 6}
        required={p.required}
        maxLength={p.maxLength}
        onInput={p.maxLength ? (e) => setLargo(e.currentTarget.value.length) : undefined}
        {...aria}
        aria-describedby={[p.maxLength ? `${fid}-count` : null, err ? eid : null].filter(Boolean).join(' ') || undefined}
        className={[BOX_BASE, err ? BAD : OK].join(' ')}
      />
      {p.maxLength ? <Contador id={`${fid}-count`} largo={largo} max={p.maxLength} /> : null}
      {err ? <ErrorText id={eid}>{err}</ErrorText> : null}
    </div>
  );
}
