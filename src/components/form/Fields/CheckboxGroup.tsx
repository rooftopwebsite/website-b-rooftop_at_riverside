'use client';

import { useContext } from 'react';
import { Ctx, useField } from './context';
import { ErrorText } from './Primitives';
import type { Option } from './types';

export function CheckboxGroup({
  name,
  legend,
  options,
  hint,
  defaultChecked,
}: {
  readonly name: string;
  readonly legend: string;
  readonly options: readonly Option[];
  readonly hint?: string;
  readonly defaultChecked?: readonly string[];
}) {
  const { uid } = useContext(Ctx);
  const { eid, err } = useField(name);
  return (
    <fieldset aria-describedby={err ? eid : undefined} className="flex flex-col gap-[8px]">
      <legend className="font-body text-[16px] font-bold">
        {legend}
        {hint ? <span className="ml-[8px] font-normal text-body/75">{hint}</span> : null}
      </legend>
      <div className="mt-[6px] grid gap-[10px] sm:grid-cols-2">
        {options.map((o) => (
          <label
            key={o.value}
            htmlFor={uid + '-' + name + '-' + o.value}
            className="flex cursor-pointer items-center gap-[10px] font-body text-[16px]"
          >
            <input
              id={uid + '-' + name + '-' + o.value}
              type="checkbox"
              name={name}
              value={o.value}
              defaultChecked={defaultChecked?.includes(o.value)}
              className="size-[20px] rounded-[6px] border border-ink/25 accent-sunset"
            />
            {o.label}
          </label>
        ))}
      </div>
      {err ? <ErrorText id={eid}>{err}</ErrorText> : null}
    </fieldset>
  );
}
