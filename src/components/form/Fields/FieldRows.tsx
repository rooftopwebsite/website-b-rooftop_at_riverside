'use client';

import { useContext } from 'react';
import { Ctx, useField } from './contexto';
import { ErrorText } from './Primitivos';
import { INPUT_BASE, OK } from './constantes';

export function FieldRows({
  name,
  prefix,
  legend,
  hint,
  cols,
  rows,
}: {
  readonly name: string;
  readonly prefix: string;
  readonly legend: string;
  readonly hint?: string;
  readonly cols: readonly { readonly key: string; readonly label: string }[];
  readonly rows: number;
}) {
  const { uid } = useContext(Ctx);
  const { eid, err } = useField(name);
  const grid = 'grid gap-[12px] sm:grid-cols-2 lg:grid-cols-4';
  const LABEL_CELDA = 'font-body text-[16px] font-bold text-ink';

  return (
    <fieldset aria-describedby={err ? eid : undefined} id={uid + '-' + name} className="flex flex-col gap-[8px]">
      <legend className="font-body text-[16px] font-bold">
        {legend}
        {hint ? <span className="ml-[8px] font-normal text-body/75">{hint}</span> : null}
      </legend>
      <div className="mt-[6px] hidden gap-[12px] lg:flex" aria-hidden="true">
        <span className="w-[16px] shrink-0" />
        <div className={`flex-1 ${grid}`}>
          {cols.map((c) => (
            <span key={c.key} className={`${LABEL_CELDA} text-center`}>
              {c.label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-[16px] lg:gap-[12px]">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="flex gap-[12px]">
            <span
              aria-hidden="true"
              className="mt-[10px] w-[16px] shrink-0 font-body text-[16px] font-bold tabular-nums text-body/70"
            >
              {i + 1}.
            </span>
            <div className={`flex-1 ${grid}`}>
              {cols.map((c) => {
                const campo = `${prefix}.${c.key}`;
                const fid = `${uid}-${campo}-${i}`;
                return (
                  <div key={c.key} className="flex flex-col gap-[6px]">
                    <label htmlFor={fid} className={`${LABEL_CELDA} lg:sr-only`}>
                      {c.label}
                      <span className="sr-only">, row {i + 1}</span>
                    </label>
                    <input
                      id={fid}
                      name={campo}
                      type="text"
                      className={[INPUT_BASE, OK].join(' ')}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {err ? <ErrorText id={eid}>{err}</ErrorText> : null}
    </fieldset>
  );
}
