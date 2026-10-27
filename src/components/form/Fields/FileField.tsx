'use client';

import { useField } from './context';
import { Label, ErrorText, Wrap } from './Primitives';
import { BOX_BASE, OK, BAD } from './constants';
import type { BaseFieldProps } from './types';

export function FileField(
  p: BaseFieldProps & {
    readonly accept?: string;
    readonly maxMb?: number;
    readonly compress?: boolean;
  },
) {
  const { fid, eid, err, aria } = useField(p.name);
  return (
    <Wrap>
      <Label htmlFor={fid} required={p.required} hint={p.hint}>
        {p.label}
      </Label>
      <input
        id={fid}
        name={p.name}
        type="file"
        accept={p.accept}
        required={p.required}
        data-compress={p.compress ? '' : undefined}
        {...aria}
        className={[
          BOX_BASE,
          'file:mr-[16px] file:rounded-pill file:border-0 file:bg-ink file:px-[18px] file:py-[8px]',
          'file:font-body file:text-[14px] file:font-bold file:text-paper hover:file:bg-ink/85',
          err ? BAD : OK,
        ].join(' ')}
      />
      {p.maxMb ? <p className="text-[16px] text-body/75">Up to {p.maxMb} MB.</p> : null}
      {err ? <ErrorText id={eid}>{err}</ErrorText> : null}
    </Wrap>
  );
}
