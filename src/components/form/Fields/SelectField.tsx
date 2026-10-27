'use client';

import { useField } from './context';
import { Label, ErrorText, Wrap, Control, SelectCaret } from './Primitives';
import { INPUT_BASE, OK, BAD } from './constants';
import type { BaseFieldProps, Option } from './types';

export function SelectField({
  options,
  placeholder,
  defaultValue,
  onValueChange,
  ...p
}: BaseFieldProps & {
  readonly options: readonly Option[];
  readonly placeholder?: string;
  readonly defaultValue?: string;
  readonly onValueChange?: (v: string) => void;
}) {
  const { fid, eid, err, aria } = useField(p.name);
  return (
    <Wrap>
      <Label htmlFor={fid} required={p.required} hint={p.hint}>
        {p.label}
      </Label>
      <Control>
        <select
          id={fid}
          name={p.name}
          required={p.required}
          defaultValue={defaultValue ?? ''}
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
        <SelectCaret />
      </Control>
      {err ? <ErrorText id={eid}>{err}</ErrorText> : null}
    </Wrap>
  );
}
