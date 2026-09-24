'use client';

import { useField } from './contexto';
import { Label, ErrorText, Wrap } from './Primitivos';
import { INPUT_BASE, PICKER, OK, BAD } from './constantes';
import type { BaseFieldProps } from './tipos';

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
