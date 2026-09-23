'use client';

import { Button } from '@/components/shared/Button';
import {
  createContext,
  useActionState,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
  type FormEvent,
  type ReactNode,
} from 'react';
import { useFormStatus } from 'react-dom';
import { CaretDown } from '@/components/shared/Icon';
import { fieldErrorsFrom, IDLE, type ActionState } from '@/app/actions/types';
import { compressImage } from '@/lib/compress-image';

const INPUT_BASE =
  'h-10.5 w-full rounded-pill border bg-paper px-[22px] font-body text-[16px] transition-colors disabled:cursor-not-allowed disabled:opacity-60';
const BOX_BASE =
  'w-full rounded-shell border bg-paper px-[22px] py-[16px] font-body text-[16px] leading-[1.6] transition-colors disabled:cursor-not-allowed disabled:opacity-60';
const OK = 'border-ink/25 hover:border-ink/45 focus:border-ink';
const BAD = 'border-2 border-tomato';

interface FormCtx {
  readonly uid: string;
  readonly errors: Record<string, string>;
  readonly pending: boolean;
}

const Ctx = createContext<FormCtx>({ uid: 'form', errors: {}, pending: false });

function useField(name: string) {
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

function Label({
  htmlFor,
  children,
  required,
  hint,
}: {
  readonly htmlFor: string;
  readonly children: ReactNode;
  readonly required?: boolean;
  readonly hint?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="flex-1 font-body text-[16px] font-bold">
      {children}
      {required ? (
        <span className="ml-[4px] text-terra" aria-hidden="true">
          *
        </span>
      ) : null}
      {hint ? <span className="ml-[8px] font-normal text-body/75">{hint}</span> : null}
    </label>
  );
}

function ErrorText({ id, children }: { readonly id: string; readonly children: ReactNode }) {
  return (
    <p id={id} className="text-[15px] font-bold text-terra">
      {children}
    </p>
  );
}

function Wrap({ children }: { readonly children: ReactNode }) {
  return <div className="flex h-full flex-col gap-[8px]">{children}</div>;
}

function Control({ children }: { readonly children: ReactNode }) {
  return <span className="relative flex">{children}</span>;
}

export function useRadioGroup(name: string) {
  const { eid, err, aria } = useField(name);
  return { eid, err, aria };
}

function SelectCaret() {
  return (
    <CaretDown
      className="pointer-events-none absolute right-[18px] top-1/2 size-4 -translate-y-1/2 text-body/70"
      aria-hidden="true"
    />
  );
}

const PICKER =
  '[&::-webkit-calendar-picker-indicator]:ml-auto [&::-webkit-calendar-picker-indicator]:mr-[2px] ' +
  '[&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60';

export interface BaseFieldProps {
  readonly name: string;
  readonly label: string;
  readonly required?: boolean;
  readonly hint?: string;
  readonly autoComplete?: string;
}

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

function Contador({ id, largo, max }: { readonly id: string; readonly largo: number; readonly max: number }) {
  if (largo < max * 0.8) return null;
  return (
    <p id={id} className={`text-right text-[14px] tabular-nums ${largo >= max ? 'font-bold text-terra' : 'text-body/70'}`}>
      {largo} / {max}
    </p>
  );
}

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
        aria-describedby={[p.maxLength ? `${fid}-count` : null, err ? eid : null].filter(Boolean).join(' ') || undefined}
        className={[BOX_BASE, err ? BAD : OK].join(' ')}
      />
      {p.maxLength ? <Contador id={`${fid}-count`} largo={largo} max={p.maxLength} /> : null}
      {err ? <ErrorText id={eid}>{err}</ErrorText> : null}
    </Wrap>
  );
}

export interface Option {
  readonly value: string;
  readonly label: string;
}

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

export function RepeatableField({
  name,
  label,
  placeholders = [],
  minimo = 1,
  maximo = 5,
  hint,
}: {
  readonly name: string;
  readonly label: string;
  readonly placeholders?: readonly string[];
  readonly minimo?: number;
  readonly maximo?: number;
  readonly hint?: string;
}) {
  const { uid } = useContext(Ctx);
  const { eid, err } = useField(name);
  const [filas, setFilas] = useState(minimo);
  const ultimaRef = useRef<HTMLInputElement | null>(null);
  const [foco, setFoco] = useState(false);

  useEffect(() => {
    if (foco) {
      ultimaRef.current?.focus();
      setFoco(false);
    }
  }, [foco]);

  return (
    <fieldset className="flex flex-col gap-[8px]">
      <legend className="font-body text-[16px] font-bold">
        {label}
        {hint ? <span className="ml-[8px] font-normal text-body/75">{hint}</span> : null}
      </legend>

      <div className="mt-[6px] flex flex-col gap-[10px]">
        {Array.from({ length: filas }, (_, i) => (
          <div key={i}>
            <label htmlFor={`${uid}-${name}-${i}`} className="sr-only">
              {label}, number {i + 1}
            </label>
            <input
              id={`${uid}-${name}-${i}`}
              ref={i === filas - 1 ? ultimaRef : undefined}
              name={name}
              type="text"
              inputMode="url"
              placeholder={placeholders[i] ?? placeholders[placeholders.length - 1]}
              aria-invalid={i === 0 ? Boolean(err) : undefined}
              aria-describedby={i === 0 && err ? eid : undefined}
              className={[INPUT_BASE, i === 0 && err ? BAD : OK].join(' ')}
            />
          </div>
        ))}
      </div>

      {filas < maximo ? (
        <button
          type="button"
          onClick={() => {
            setFilas((n) => n + 1);
            setFoco(true);
          }}
          className="mt-[4px] self-start font-body text-[15px] font-bold text-deep underline decoration-from-font underline-offset-4 hover:text-ink"
        >
          Add another
          <span className="sr-only"> {label.toLowerCase()}</span>
        </button>
      ) : null}

      {err ? <ErrorText id={eid}>{err}</ErrorText> : null}
    </fieldset>
  );
}

export function RadioGroup({
  name,
  legend,
  options,
  hint,
}: {
  readonly name: string;
  readonly legend: string;
  readonly options: readonly Option[];
  readonly hint?: string;
}) {
  const { uid } = useContext(Ctx);
  const { eid, err, aria } = useField(name);
  return (
    <fieldset aria-describedby={err ? eid : undefined} id={uid + '-' + name} className="flex flex-col gap-[8px]">
      <legend className="font-body text-[16px] font-bold">
        {legend}
        {hint ? <span className="ml-[8px] font-normal text-body/75">{hint}</span> : null}
      </legend>
      <div className="mt-[6px] flex flex-wrap items-center gap-x-[28px] gap-y-[8px]">
        {options.map((o) => (
          <label
            key={o.value}
            htmlFor={uid + '-' + name + '-' + o.value}
            className="flex cursor-pointer items-center gap-[10px] font-body text-[16px]"
          >
            <input
              id={uid + '-' + name + '-' + o.value}
              type="radio"
              name={name}
              value={o.value}
              {...aria}
              className="size-[20px] border border-ink/25 accent-sunset"
            />
            {o.label}
          </label>
        ))}
      </div>
      {err ? <ErrorText id={eid}>{err}</ErrorText> : null}
    </fieldset>
  );
}

export function CheckboxMatrix({
  name,
  legend,
  hint,
  rows,
  cols,
}: {
  readonly name: string;
  readonly legend: string;
  readonly hint?: string;
  readonly rows: readonly { readonly value: string; readonly label: string; readonly short: string }[];
  readonly cols: readonly Option[];
}) {
  const { uid } = useContext(Ctx);
  const { eid, err } = useField(name);
  return (
    <fieldset aria-describedby={err ? eid : undefined} id={uid + '-' + name} className="flex flex-col gap-[8px]">
      <legend className="font-body text-[16px] font-bold">
        {legend}
        {hint ? <span className="ml-[8px] font-normal text-body/75">{hint}</span> : null}
      </legend>
      <div className="mt-[6px] grid gap-x-[24px] gap-y-[10px] sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.value} className="flex items-center gap-[12px]">
            <span className="w-[38px] shrink-0 font-body text-[16px] sm:w-[96px]">
              <span className="sm:hidden" aria-hidden="true">
                {r.short}
              </span>
              <span className="hidden sm:inline" aria-hidden="true">
                {r.label}
              </span>
            </span>
            <span className="flex shrink-0 items-center gap-[14px]">
              {cols.map((c) => {
                const valor = `${r.value}-${c.value}`;
                return (
                  <label
                    key={c.value}
                    htmlFor={uid + '-' + name + '-' + valor}
                    className="flex cursor-pointer items-center gap-[6px] font-body text-[15px] text-body/80"
                  >
                    <input
                      id={uid + '-' + name + '-' + valor}
                      type="checkbox"
                      name={name}
                      value={valor}
                      aria-label={`${r.label} ${c.label}`}
                      className="size-[20px] rounded-[6px] border border-ink/25 accent-sunset"
                    />
                    <span aria-hidden="true">{c.label}</span>
                  </label>
                );
              })}
            </span>
          </div>
        ))}
      </div>

      {err ? <ErrorText id={eid}>{err}</ErrorText> : null}
    </fieldset>
  );
}

export function FieldRows({
  name,
  prefix,
  legend,
  hint,
  cols,
  rows,
}: {
  readonly name: string;
  readonly prefix: string;
  readonly legend: string;
  readonly hint?: string;
  readonly cols: readonly { readonly key: string; readonly label: string }[];
  readonly rows: number;
}) {
  const { uid } = useContext(Ctx);
  const { eid, err } = useField(name);
  const grid = 'grid gap-[12px] sm:grid-cols-2 lg:grid-cols-4';
  const LABEL_CELDA = 'font-body text-[16px] font-bold text-ink';

  return (
    <fieldset aria-describedby={err ? eid : undefined} id={uid + '-' + name} className="flex flex-col gap-[8px]">
      <legend className="font-body text-[16px] font-bold">
        {legend}
        {hint ? <span className="ml-[8px] font-normal text-body/75">{hint}</span> : null}
      </legend>
      <div className="mt-[6px] hidden gap-[12px] lg:flex" aria-hidden="true">
        <span className="w-[16px] shrink-0" />
        <div className={`flex-1 ${grid}`}>
          {cols.map((c) => (
            <span key={c.key} className={`${LABEL_CELDA} text-center`}>
              {c.label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-[16px] lg:gap-[12px]">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="flex gap-[12px]">
            <span
              aria-hidden="true"
              className="mt-[10px] w-[16px] shrink-0 font-body text-[16px] font-bold tabular-nums text-body/70"
            >
              {i + 1}.
            </span>
            <div className={`flex-1 ${grid}`}>
              {cols.map((c) => {
                const campo = `${prefix}.${c.key}`;
                const fid = `${uid}-${campo}-${i}`;
                return (
                  <div key={c.key} className="flex flex-col gap-[6px]">
                    <label htmlFor={fid} className={`${LABEL_CELDA} lg:sr-only`}>
                      {c.label}
                      <span className="sr-only">, row {i + 1}</span>
                    </label>
                    <input
                      id={fid}
                      name={campo}
                      type="text"
                      className={[INPUT_BASE, OK].join(' ')}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {err ? <ErrorText id={eid}>{err}</ErrorText> : null}
    </fieldset>
  );
}

export type FormAction = (prev: ActionState, fd: FormData) => Promise<ActionState>;

const OFFLINE =
  'You look offline, so nothing was sent. Your answers are still here: try again once you are back online.';
const SIN_RESPUESTA =
  'We could not reach our server, so nothing was sent. Your answers are still here: give it another try in a moment.';

export function useSubmission(action: FormAction) {
  const [ssr, formAction] = useActionState(action, IDLE);
  const [local, setLocal] = useState<ActionState | null>(null);
  const [pending, start] = useTransition();

  function submit(fd: FormData) {
    start(async () => {
      if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        setLocal({ status: 'error', message: OFFLINE });
        return;
      }
      try {
        const res = await action(IDLE, fd);
        setLocal(res);
      } catch (err) {
        console.error('[form] el envío no llegó al servidor:', err);
        setLocal({ status: 'error', message: SIN_RESPUESTA });
      }
    });
  }

  return { state: local ?? ssr, formAction, pending, submit } as const;
}

export type Submission = ReturnType<typeof useSubmission>;

export function SubmitButton({ idle, busy }: { readonly idle: string; readonly busy: string }) {
  const ctx = useContext(Ctx);
  const { pending: nativo } = useFormStatus();
  const pending = ctx.pending || nativo;
  return (
    <Button
      type="submit"
      variant="primary"
      size="lg"
      disabled={pending}
      className={pending ? 'w-full disabled:opacity-85' : 'w-full'}
    >
      {pending ? (
        <>
          <span
            aria-hidden="true"
            className="size-[16px] shrink-0 rounded-full border-2 border-ink/25 border-t-ink motion-safe:animate-spin"
          />
          {busy}
        </>
      ) : (
        idle
      )}
    </Button>
  );
}

export function SentPanel({
  className,
  children,
}: {
  readonly className?: string;
  readonly children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ block: 'center', behavior: quieto ? 'auto' : 'smooth' });
  }, []);
  return (
    <div
      ref={ref}
      role="status"
      tabIndex={-1}
      className={['outline-none', className].filter(Boolean).join(' ')}
    >
      {children}
    </div>
  );
}

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

const FRASE = 'font-body text-lead font-light leading-[2] text-body';

export function SentenceRow({ children }: { readonly children: ReactNode }) {
  return <div className={['flex flex-wrap items-center gap-x-3 gap-y-1 sm:gap-y-3', FRASE].join(' ')}>{children}</div>;
}

function InlineLabel({
  htmlFor,
  children,
  required,
}: {
  readonly htmlFor: string;
  readonly children: ReactNode;
  readonly required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="shrink-0 basis-full sm:basis-auto">
      {children}
      {required ? (
        <span className="ml-[4px] text-terra" aria-hidden="true">
          *
        </span>
      ) : null}
    </label>
  );
}

export function InlineField({
  type = 'text',
  ancho = 'crece',
  ...p
}: BaseFieldProps & {
  readonly type?: 'text' | 'email' | 'tel';
  readonly ancho?: 'crece' | 'corto';
}) {
  const { fid, eid, err, aria } = useField(p.name);
  return (
    <>
      <InlineLabel htmlFor={fid} required={p.required}>
        {p.label}
      </InlineLabel>
      <input
        id={fid}
        name={p.name}
        type={type}
        required={p.required}
        autoComplete={p.autoComplete}
        {...aria}
        className={[
          INPUT_BASE,
          ancho === 'crece' ? 'min-w-[16ch] flex-1' : 'w-[16ch] shrink-0',
          err ? BAD : OK,
        ].join(' ')}
      />
      {p.hint ? <span className="shrink-0 text-[15px] text-body/70">{p.hint}</span> : null}
      {err ? (
        <div className="basis-full">
          <ErrorText id={eid}>{err}</ErrorText>
        </div>
      ) : null}
    </>
  );
}

export function InlineSelect({
  options,
  placeholder,
  onValueChange,
  ...p
}: BaseFieldProps & {
  readonly options: readonly Option[];
  readonly placeholder?: string;
  readonly onValueChange?: (v: string) => void;
}) {
  const { fid, eid, err, aria } = useField(p.name);
  return (
    <>
      <InlineLabel htmlFor={fid} required={p.required}>
        {p.label}
      </InlineLabel>
      <span className="relative inline-flex min-w-[22ch] flex-1">
        <select
          id={fid}
          name={p.name}
          required={p.required}
          defaultValue=""
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
        <CaretDown
          className="pointer-events-none absolute right-[18px] top-1/2 size-4 -translate-y-1/2"
          aria-hidden="true"
        />
      </span>
      {err ? (
        <div className="basis-full">
          <ErrorText id={eid}>{err}</ErrorText>
        </div>
      ) : null}
    </>
  );
}

export function SentenceArea(
  p: BaseFieldProps & { readonly rows?: number; readonly maxLength?: number },
) {
  const { fid, eid, err, aria } = useField(p.name);
  const [largo, setLargo] = useState(0);
  return (
    <div className="flex flex-col gap-[12px]">
      <span className={FRASE}>
        <InlineLabel htmlFor={fid} required={p.required}>
          {p.label}
        </InlineLabel>
      </span>
      <textarea
        id={fid}
        name={p.name}
        rows={p.rows ?? 6}
        required={p.required}
        maxLength={p.maxLength}
        onInput={p.maxLength ? (e) => setLargo(e.currentTarget.value.length) : undefined}
        {...aria}
        aria-describedby={[p.maxLength ? `${fid}-count` : null, err ? eid : null].filter(Boolean).join(' ') || undefined}
        className={[BOX_BASE, err ? BAD : OK].join(' ')}
      />
      {p.maxLength ? <Contador id={`${fid}-count`} largo={largo} max={p.maxLength} /> : null}
      {err ? <ErrorText id={eid}>{err}</ErrorText> : null}
    </div>
  );
}
