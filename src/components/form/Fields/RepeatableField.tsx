'use client';

import { useContext, useEffect, useRef, useState } from 'react';
import { Ctx, useField } from './context';
import { ErrorText } from './Primitives';
import { INPUT_BASE, OK, BAD } from './constants';

export function RepeatableField({
  name,
  label,
  placeholders = [],
  minimum = 1,
  maxValue = 5,
  hint,
}: {
  readonly name: string;
  readonly label: string;
  readonly placeholders?: readonly string[];
  readonly minimum?: number;
  readonly maxValue?: number;
  readonly hint?: string;
}) {
  const { uid } = useContext(Ctx);
  const { eid, err } = useField(name);
  const [rows, setRows] = useState(minimum);
  const lastRef = useRef<HTMLInputElement | null>(null);
  const [focus, setFocus] = useState(false);

  useEffect(() => {
    if (focus) {
      lastRef.current?.focus();
      setFocus(false);
    }
  }, [focus]);

  return (
    <fieldset className="flex flex-col gap-[8px]">
      <legend className="font-body text-[16px] font-bold">
        {label}
        {hint ? <span className="ml-[8px] font-normal text-body/75">{hint}</span> : null}
      </legend>

      <div className="mt-[6px] flex flex-col gap-[10px]">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i}>
            <label htmlFor={`${uid}-${name}-${i}`} className="sr-only">
              {label}, number {i + 1}
            </label>
            <input
              id={`${uid}-${name}-${i}`}
              ref={i === rows - 1 ? lastRef : undefined}
              name={name}
              type="text"
              inputMode="url"
              placeholder={placeholders[i] ?? placeholders[placeholders.length - 1]}
              aria-invalid={i === 0 ? Boolean(err) : undefined}
              aria-describedby={i === 0 && err ? eid : undefined}
              className={[INPUT_BASE, i === 0 && err ? BAD : OK].join(' ')}
            />
          </div>
        ))}
      </div>

      {rows < maxValue ? (
        <button
          type="button"
          onClick={() => {
            setRows((n) => n + 1);
            setFocus(true);
          }}
          className="mt-[4px] self-start font-body text-[15px] font-bold text-deep underline decoration-from-font underline-offset-4 hover:text-ink"
        >
          Add another
          <span className="sr-only"> {label.toLowerCase()}</span>
        </button>
      ) : null}

      {err ? <ErrorText id={eid}>{err}</ErrorText> : null}
    </fieldset>
  );
}
