'use client';

import { useField } from './context';
import { Label, ErrorText, Wrap } from './Primitives';
import { INPUT_BASE, PICKER, OK, BAD } from './constants';
import type { BaseFieldProps } from './types';

export function TextField({
  type = 'text',
  ...p
}: BaseFieldProps & { readonly type?: 'text' | 'email' | 'tel' | 'url' | 'time' }) {
  const { fid, eid, err, aria } = useField(p.name);
  return (
    <Wrap>
      <Label htmlFor={fid} required={p.required} hint={p.hint}>
        {p.label}
      </Label>
      <input
        id={fid}
        name={p.name}
        type={type}
        required={p.required}
        autoComplete={p.autoComplete}
        {...aria}
        className={[INPUT_BASE, PICKER, err ? BAD : OK].join(' ')}
      />
      {err ? <ErrorText id={eid}>{err}</ErrorText> : null}
    </Wrap>
  );
}

export function DateField(p: BaseFieldProps & { readonly min?: string }) {
  const { fid, eid, err, aria } = useField(p.name);
  return (
    <Wrap>
      <Label htmlFor={fid} required={p.required} hint={p.hint}>
        {p.label}
      </Label>
      <input
        id={fid}
        name={p.name}
        type="date"
        min={p.min}
        required={p.required}
        {...aria}
        className={[INPUT_BASE, PICKER, err ? BAD : OK].join(' ')}
      />
      {err ? <ErrorText id={eid}>{err}</ErrorText> : null}
    </Wrap>
  );
}
