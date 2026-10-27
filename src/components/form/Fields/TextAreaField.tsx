'use client';

import { useState } from 'react';
import { useField } from './context';
import { Label, ErrorText, Wrap, Counter, showsCounter } from './Primitives';
import { BOX_BASE, OK, BAD } from './constants';
import type { BaseFieldProps } from './types';

export function TextAreaField(
  p: BaseFieldProps & { readonly rows?: number; readonly maxLength?: number },
) {
  const { fid, eid, err, aria } = useField(p.name);
  const [length, setLength] = useState(0);
  return (
    <Wrap>
      <Label htmlFor={fid} required={p.required} hint={p.hint}>
        {p.label}
      </Label>
      <textarea
        id={fid}
        name={p.name}
        rows={p.rows ?? 5}
        required={p.required}
        maxLength={p.maxLength}
        onInput={p.maxLength ? (e) => setLength(e.currentTarget.value.length) : undefined}
        autoComplete={p.autoComplete}
        {...aria}
        aria-describedby={[showsCounter(length, p.maxLength) ? `${fid}-count` : null, err ? eid : null].filter(Boolean).join(' ') || undefined}
        className={[BOX_BASE, err ? BAD : OK].join(' ')}
      />
      {p.maxLength ? <Counter id={`${fid}-count`} length={length} max={p.maxLength} /> : null}
      {err ? <ErrorText id={eid}>{err}</ErrorText> : null}
    </Wrap>
  );
}
