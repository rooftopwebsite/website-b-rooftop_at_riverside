'use client';

import { useContext } from 'react';
import { Ctx, useField } from './context';
import { ErrorText } from './Primitives';
import type { Option } from './types';

export function CheckboxMatrix({
  name,
  legend,
  hint,
  rows,
  cols,
}: {
  readonly name: string;
  readonly legend: string;
  readonly hint?: string;
  readonly rows: readonly { readonly value: string; readonly label: string; readonly short: string }[];
  readonly cols: readonly Option[];
}) {
  const { uid } = useContext(Ctx);
  const { eid, err } = useField(name);
  return (
    <fieldset aria-describedby={err ? eid : undefined} id={uid + '-' + name} className="flex flex-col gap-[8px]">
      <legend className="font-body text-[16px] font-bold">
        {legend}
        {hint ? <span className="ml-[8px] font-normal text-body/75">{hint}</span> : null}
      </legend>
      <div className="mt-[6px] grid gap-x-[24px] gap-y-[10px] sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.value} className="flex items-center gap-[12px]">
            <span className="w-[38px] shrink-0 font-body text-[16px] sm:w-[96px]">
              <span className="sm:hidden" aria-hidden="true">
                {r.short}
              </span>
              <span className="hidden sm:inline" aria-hidden="true">
                {r.label}
              </span>
            </span>
            <span className="flex shrink-0 items-center gap-[14px]">
              {cols.map((c) => {
                const value = `${r.value}-${c.value}`;
                return (
                  <label
                    key={c.value}
                    htmlFor={uid + '-' + name + '-' + value}
                    className="flex cursor-pointer items-center gap-[6px] font-body text-[15px] text-body/80"
                  >
                    <input
                      id={uid + '-' + name + '-' + value}
                      type="checkbox"
                      name={name}
                      value={value}
                      aria-label={`${r.label} ${c.label}`}
                      className="size-[20px] rounded-[6px] border border-ink/25 accent-sunset"
                    />
                    <span aria-hidden="true">{c.label}</span>
                  </label>
                );
              })}
            </span>
          </div>
        ))}
      </div>

      {err ? <ErrorText id={eid}>{err}</ErrorText> : null}
    </fieldset>
  );
}
