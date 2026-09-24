'use client';

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { fieldErrorsFrom } from '@/app/actions/types';
import { compressImage } from '@/lib/compress-image';
import { Ctx } from './contexto';
import type { Submission } from './Submission';

interface Schema {
  safeParse(v: unknown):
    | { readonly success: true }
    | {
        readonly success: false;
        readonly error: { readonly issues: readonly { path: PropertyKey[]; message: string }[] };
      };
}

const REVISAR = 'Some fields need another look before this can go out.';

const porDefecto = (fd: FormData): unknown => Object.fromEntries(fd);

export function FormShell({
  submission,
  schema,
  fromForm = porDefecto,
  maxUploadMb,
  children,
}: {
  readonly submission: Submission;
  readonly schema?: Schema;
  readonly fromForm?: (fd: FormData) => unknown;
  readonly maxUploadMb?: number;
  readonly children: ReactNode;
}) {
  const { state, formAction, pending, submit } = submission;
  const uid = useId();
  const summaryRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [aviso, setAviso] = useState('');
  const intentado = useRef(false);
  const [foco, setFoco] = useState(0);

  useEffect(() => {
    if (state.status !== 'error') return;
    setErrors(state.fieldErrors ?? {});
    setAviso(state.message);
    setFoco((n) => n + 1);
  }, [state]);

  useEffect(() => {
    if (foco === 0) return;
    const primero = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
    if (primero) {
      primero.focus({ preventScroll: true });
      primero.scrollIntoView({ block: 'center' });
    } else summaryRef.current?.focus();
  }, [foco]);

  function validar(fd: FormData): Record<string, string> {
    if (!schema) return {};
    const crudo = fromForm(fd) as Record<string, unknown>;
    const r = schema.safeParse({ ...crudo, website: '' });
    return r.success ? {} : fieldErrorsFrom(r.error.issues);
  }

  function actualizar(nombre: string, mostrar: boolean) {
    if (!nombre || nombre === 'website' || nombre.includes('.') || !formRef.current) return;
    const todos = validar(new FormData(formRef.current));
    setErrors((prev) => {
      const siguiente = { ...prev };
      const err = todos[nombre];
      if (!err) delete siguiente[nombre];
      else if (prev[nombre] || mostrar) siguiente[nombre] = err;
      return siguiente;
    });
  }

  function onBlur(e: FormEvent<HTMLFormElement>) {
    const t = e.target as HTMLInputElement;
    if (t.type === 'checkbox' || t.type === 'radio' || t.type === 'file') return;
    actualizar(t.name, intentado.current || t.value.trim() !== '');
  }

  function onChange(e: FormEvent<HTMLFormElement>) {
    const t = e.target as HTMLInputElement;
    const inmediato =
      t.type === 'checkbox' || t.type === 'radio' || t.type === 'file' || t.tagName === 'SELECT';
    if (inmediato) actualizar(t.name, true);
    else if (errors[t.name]) actualizar(t.name, true);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    intentado.current = true;
    const form = e.currentTarget;
    const fd = new FormData(form);

    const encontrados = validar(fd);
    if (Object.keys(encontrados).length > 0) {
      setErrors(encontrados);
      setAviso(REVISAR);
      setFoco((n) => n + 1);
      return;
    }

    for (const input of form.querySelectorAll<HTMLInputElement>('input[type="file"][data-compress]')) {
      const f = fd.get(input.name);
      if (f instanceof File && f.size > 0) fd.set(input.name, await compressImage(f));
    }

    if (maxUploadMb) {
      const archivos = [...fd.entries()].filter(
        (x): x is [string, File] => x[1] instanceof File && x[1].size > 0,
      );
      const total = archivos.reduce((s, [, f]) => s + f.size, 0);
      if (total > maxUploadMb * 1024 * 1024) {
        const mayor = [...archivos].sort((a, b) => b[1].size - a[1].size)[0]![0];
        setErrors({
          [mayor]: `Your files add up to ${(total / 1024 / 1024).toFixed(1)} MB and the limit is ${maxUploadMb} MB. Try a smaller file here.`,
        });
        setAviso(REVISAR);
        setFoco((n) => n + 1);
        return;
      }
    }

    setErrors({});
    setAviso('');
    submit(fd);
  }

  const general =
    state.status === 'error' && Object.keys(state.fieldErrors ?? {}).length === 0 && !pending;

  return (
    <Ctx.Provider value={{ uid, errors, pending }}>
      <p aria-live="polite" className="sr-only">
        {pending ? 'Sending.' : aviso}
      </p>

      <form
        ref={formRef}
        action={formAction}
        onSubmit={onSubmit}
        onBlur={onBlur}
        onChange={onChange}
        noValidate
        aria-busy={pending}
        className="flex flex-col gap-[28px]"
      >
        {general ? (
          <div
            ref={summaryRef}
            tabIndex={-1}
            role="alert"
            className="rounded-card border-2 border-tomato bg-tomato/5 p-[20px] outline-none"
          >
            <p className="font-body text-[16px] font-bold text-terra">{state.message}</p>
          </div>
        ) : null}

        <fieldset disabled={pending} className="contents">
          {children}
        </fieldset>
        <div aria-hidden="true" className="hidden">
          <label htmlFor={uid + '-website'}>Leave this empty</label>
          <input id={uid + '-website'} name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
      </form>
    </Ctx.Provider>
  );
}
