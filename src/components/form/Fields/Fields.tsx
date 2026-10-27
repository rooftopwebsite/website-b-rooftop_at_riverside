'use client';

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { fieldErrorsFrom } from '@/app/actions/types';
import { compressImage } from '@/lib/compress-image';
import { Ctx } from './context';
import type { Submission } from './Submission';

interface Schema {
  safeParse(v: unknown):
    | { readonly success: true }
    | {
        readonly success: false;
        readonly error: { readonly issues: readonly { path: PropertyKey[]; message: string }[] };
      };
}

const REVIEW_NOTICE = 'Some fields need another look before this can go out.';

const byDefault = (fd: FormData): unknown => Object.fromEntries(fd);

export function FormShell({
  submission,
  schema,
  fromForm = byDefault,
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
  const [notice, setNotice] = useState('');
  const attempted = useRef(false);
  const [focus, setFocus] = useState(0);

  useEffect(() => {
    if (state.status !== 'error') return;
    setErrors(state.fieldErrors ?? {});
    setNotice(state.message);
    setFocus((n) => n + 1);
  }, [state]);

  useEffect(() => {
    if (focus === 0) return;
    const first = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
    if (first) {
      first.focus({ preventScroll: true });
      first.scrollIntoView({ block: 'center' });
    } else summaryRef.current?.focus();
  }, [focus]);

  function validate(fd: FormData): Record<string, string> {
    if (!schema) return {};
    const raw = fromForm(fd) as Record<string, unknown>;
    const r = schema.safeParse({ ...raw, website: '' });
    return r.success ? {} : fieldErrorsFrom(r.error.issues);
  }

  function update(name: string, show: boolean) {
    if (!name || name === 'website' || name.includes('.') || !formRef.current) return;
    const all = validate(new FormData(formRef.current));
    setErrors((prev) => {
      const next = { ...prev };
      const err = all[name];
      if (!err) delete next[name];
      else if (prev[name] || show) next[name] = err;
      return next;
    });
  }

  function onBlur(e: FormEvent<HTMLFormElement>) {
    const t = e.target as HTMLInputElement;
    if (t.type === 'checkbox' || t.type === 'radio' || t.type === 'file') return;
    update(t.name, attempted.current || t.value.trim() !== '');
  }

  function onChange(e: FormEvent<HTMLFormElement>) {
    const t = e.target as HTMLInputElement;
    const immediate =
      t.type === 'checkbox' || t.type === 'radio' || t.type === 'file' || t.tagName === 'SELECT';
    if (immediate) update(t.name, true);
    else if (errors[t.name]) update(t.name, true);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    attempted.current = true;
    const form = e.currentTarget;
    const fd = new FormData(form);

    const found = validate(fd);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      setNotice(REVIEW_NOTICE);
      setFocus((n) => n + 1);
      return;
    }

    for (const input of form.querySelectorAll<HTMLInputElement>('input[type="file"][data-compress]')) {
      const f = fd.get(input.name);
      if (f instanceof File && f.size > 0) fd.set(input.name, await compressImage(f));
    }

    if (maxUploadMb) {
      const files = [...fd.entries()].filter(
        (x): x is [string, File] => x[1] instanceof File && x[1].size > 0,
      );
      const total = files.reduce((s, [, f]) => s + f.size, 0);
      if (total > maxUploadMb * 1024 * 1024) {
        const largest = [...files].sort((a, b) => b[1].size - a[1].size)[0]![0];
        setErrors({
          [largest]: `Your files add up to ${(total / 1024 / 1024).toFixed(1)} MB and the limit is ${maxUploadMb} MB. Try a smaller file here.`,
        });
        setNotice(REVIEW_NOTICE);
        setFocus((n) => n + 1);
        return;
      }
    }

    setErrors({});
    setNotice('');
    submit(fd);
  }

  const general =
    state.status === 'error' && Object.keys(state.fieldErrors ?? {}).length === 0 && !pending;

  return (
    <Ctx.Provider value={{ uid, errors, pending }}>
      <p aria-live="polite" className="sr-only">
        {pending ? 'Sending.' : notice}
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
