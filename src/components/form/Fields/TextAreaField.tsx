'use client';

import { useState } from 'react';
import { useField } from './contexto';
import { Label, ErrorText, Wrap, Contador, muestraContador } from './Primitivos';
import { BOX_BASE, OK, BAD } from './constantes';
import type { BaseFieldProps } from './tipos';

export function TextAreaField(
  p: BaseFieldProps & { readonly rows?: number; readonly maxLength?: number },
) {
  const { fid, eid, err, aria } = useField(p.name);
  const [largo, setLargo] = useState(0);
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
        onInput={p.maxLength ? (e) => setLargo(e.currentTarget.value.length) : undefined}
        autoComplete={p.autoComplete}
        {...aria}
        aria-describedby={[muestraContador(largo, p.maxLength) ? `${fid}-count` : null, err ? eid : null].filter(Boolean).join(' ') || undefined}
        className={[BOX_BASE, err ? BAD : OK].join(' ')}
      />
      {p.maxLength ? <Contador id={`${fid}-count`} largo={largo} max={p.maxLength} /> : null}
      {err ? <ErrorText id={eid}>{err}</ErrorText> : null}
    </Wrap>
  );
}
