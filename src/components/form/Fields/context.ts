'use client';

import { createContext, useContext } from 'react';

interface FormCtx {
  readonly uid: string;
  readonly errors: Record<string, string>;
  readonly pending: boolean;
}

export const Ctx = createContext<FormCtx>({ uid: 'form', errors: {}, pending: false });

export function useField(name: string) {
  const { uid, errors } = useContext(Ctx);
  const err = errors[name];
  const eid = uid + '-' + name + '-error';
  return {
    fid: uid + '-' + name,
    eid,
    err,
    aria: {
      'aria-invalid': Boolean(err),
      'aria-describedby': err ? eid : undefined,
    },
  };
}

export function useRadioGroup(name: string) {
  const { eid, err, aria } = useField(name);
  return { eid, err, aria };
}
