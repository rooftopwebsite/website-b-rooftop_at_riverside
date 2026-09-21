'use client';

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useFormStatus } from 'react-dom';
import { CaretDown } from '@/components/shared/Icon';
import type { ActionState } from '@/app/actions/types';

/*
 * ══════════════════════════════════════════════════════════════════════════
 * LOS CAMPOS COMPARTIDOS DE TODO EL SITIO.
 *
 * Antes cada formulario definía su propio `Field` con su propio mapa de
 * `LABELS`, y eran dos implementaciones del mismo control. Acá hay UNA, y los
 * cinco formularios del sitio la usan.
 *
 * ⚠️ LOS ESTILOS NO SON NUEVOS: salen tal cual de `sections/InquiryForm.tsx`,
 * donde las decisiones ya estaban tomadas y documentadas. Se repiten acá los
 * motivos que más fácil se pierden al mover código:
 *
 *   · LOS CONTROLES DE UNA LÍNEA VAN EN PÍLDORA (`rounded-pill`), no en el
 *     radio de 10px del resto del sitio. Pedido de Camila para toda la web: el
 *     radio completo es la marca de qué se puede TOCAR. Y el padding sube a
 *     22px con el radio, porque con 25px de curva y 14 de padding la primera
 *     letra del texto cae adentro de la curva. Regla: padding ≥ radio · 0.85.
 *
 *   · EL `<textarea>` ES LA ÚNICA EXCEPCIÓN y va en `rounded-shell`. Un radio
 *     de píldora sobre una caja de varios renglones le come las esquinas al
 *     texto y recorta la primera y la última línea.
 *
 *   · EL ALTO ES 42px (`h-10.5`), el mismo del botón. Es el techo que Camila
 *     fijó para los CTA. No baja de ahí: el mínimo táctil recomendado es 44 y
 *     42 ya está en el límite, sostenido por los 22px de padding lateral.
 *
 * ⚠️ ACCESIBILIDAD. Esto es lo que el componente compartido garantiza de una
 * vez para los cinco formularios, en vez de depender de que cada uno se acuerde:
 *   · `<label>` real por campo, asociado con `htmlFor`. Nunca un placeholder
 *     haciendo de etiqueta.
 *   · El error se comunica por TEXTO además del borde, y se resume arriba en
 *     un bloque enfocable con `role="alert"`.
 *   · `aria-invalid` + `aria-describedby` en cada campo con error.
 *   · El estado va en un `aria-live` que existe SIEMPRE en el DOM: un
 *     `aria-live` que aparece junto con su mensaje no se anuncia.
 * ══════════════════════════════════════════════════════════════════════════
 */

const INPUT_BASE =
  'h-10.5 w-full rounded-pill border bg-paper px-[22px] font-body text-[16px] transition-colors';
const BOX_BASE =
  'w-full rounded-shell border bg-paper px-[22px] py-[16px] font-body text-[16px] leading-[1.6] transition-colors';
const OK = 'border-ink/25 focus:border-ink';
const BAD = 'border-2 border-tomato';

/* ── El contexto: ids y errores, para no pasarlos campo por campo ────────── */

interface FormCtx {
  readonly uid: string;
  readonly errors: Record<string, string>;
}

const Ctx = createContext<FormCtx>({ uid: 'form', errors: {} });

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

/* ── Piezas sueltas ─────────────────────────────────────────────────────── */

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
    <label htmlFor={htmlFor} className="font-body text-[16px] font-bold">
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
  return <div className="flex flex-col gap-[8px]">{children}</div>;
}

/* ── Los seis controles ─────────────────────────────────────────────────── */

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
        className={[INPUT_BASE, err ? BAD : OK].join(' ')}
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
        className={[INPUT_BASE, err ? BAD : OK].join(' ')}
      />
      {err ? <ErrorText id={eid}>{err}</ErrorText> : null}
    </Wrap>
  );
}

export function TextAreaField(p: BaseFieldProps & { readonly rows?: number }) {
  const { fid, eid, err, aria } = useField(p.name);
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
        {...aria}
        className={[BOX_BASE, err ? BAD : OK].join(' ')}
      />
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
      {err ? <ErrorText id={eid}>{err}</ErrorText> : null}
    </Wrap>
  );
}

export function FileField(
  p: BaseFieldProps & { readonly accept?: string; readonly maxMb?: number },
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
        {...aria}
        className={[
          BOX_BASE,
          'file:mr-[16px] file:rounded-pill file:border-0 file:bg-ink file:px-[18px] file:py-[8px]',
          'file:font-body file:text-[14px] file:font-bold file:text-paper hover:file:bg-ink/85',
          err ? BAD : OK,
        ].join(' ')}
      />
      {p.maxMb ? <p className="text-[14px] text-body/75">Up to {p.maxMb} MB.</p> : null}
      {err ? <ErrorText id={eid}>{err}</ErrorText> : null}
    </Wrap>
  );
}

/**
 * ⚠️ Es un `<fieldset>` con `<legend>`, no un div con un título encima. Es lo
 * que hace que un lector de pantalla anuncie de qué grupo es cada casilla.
 */
export function CheckboxGroup({
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
  const { eid, err } = useField(name);
  return (
    <fieldset className="flex flex-col gap-[8px]">
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

/**
 * Un campo que se repite: varios links, por ejemplo.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ TODAS LAS FILAS COMPARTEN EL MISMO `name`, y eso es lo que hace que el
 * servidor las reciba todas con `formData.getAll(name)`. Ojo: con
 * `Object.fromEntries` llegaría UNA sola, la última, que es el error clásico
 * de este control.
 *
 * ⚠️ ARRANCA CON `minimo` FILAS Y SUMA DE A UNA. No se pre-dibujan cinco
 * campos vacíos: un formulario con cinco huecos parece exigir cinco links.
 *
 * ⚠️ CADA FILA TIENE SU `<label>`, numerado. Un lector de pantalla en tres
 * campos con la misma etiqueta no puede decir en cuál está.
 *
 * ⚠️ AL AGREGAR UNA FILA, EL FOCO VA A ELLA. Sin eso, quien navega por teclado
 * aprieta «add another» y el foco se queda en el botón mientras aparece un
 * campo en otro lado de la página.
 * ══════════════════════════════════════════════════════════════════════════
 */
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
  /** Sugerencia por fila, para que se entienda qué se espera en cada una. */
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

/* ── El botón, que conoce el estado de envío ────────────────────────────── */

export function SubmitButton({ idle, busy }: { readonly idle: string; readonly busy: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-10.5 items-center justify-center whitespace-nowrap rounded-pill bg-sunset px-[28px] font-body text-cta font-bold tracking-cta text-ink transition-colors hover:bg-sunset-hover disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? busy : idle}
    </button>
  );
}

/* ── La cáscara: resumen de errores, honeypot y aria-live ───────────────── */

export function FormShell({
  state,
  action,
  children,
  labels,
}: {
  readonly state: ActionState;
  readonly action: (fd: FormData) => void;
  readonly children: ReactNode;
  /** Etiqueta legible por campo, para el resumen de errores de arriba. */
  readonly labels: Readonly<Record<string, string>>;
}) {
  const uid = useId();
  const summaryRef = useRef<HTMLDivElement | null>(null);
  const errors = state.fieldErrors ?? {};
  const keys = Object.keys(errors);

  // Al volver con errores el foco va al resumen: quien navega con teclado o
  // lector de pantalla tiene que enterarse sin salir a buscar qué pasó.
  useEffect(() => {
    if (state.status === 'error') summaryRef.current?.focus();
  }, [state]);

  return (
    <Ctx.Provider value={{ uid, errors }}>
      {/* Existe siempre, con o sin mensaje. Ver la nota de accesibilidad. */}
      <p aria-live="polite" className="sr-only">
        {state.status === 'error' ? state.message : ''}
      </p>

      <form action={action} noValidate className="flex flex-col gap-[28px]">
        {state.status === 'error' ? (
          <div
            ref={summaryRef}
            tabIndex={-1}
            role="alert"
            className="rounded-card border-2 border-tomato bg-tomato/5 p-[20px]"
          >
            <p className="font-body text-[16px] font-bold text-terra">{state.message}</p>
            {keys.length > 0 ? (
              <ul className="mt-[10px] flex flex-col gap-[4px]">
                {keys.map((k) => (
                  <li key={k}>
                    <a href={'#' + uid + '-' + k} className="link-texto text-[16px] text-terra">
                      {labels[k] ? labels[k] + ': ' + errors[k] : errors[k]}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        {children}

        {/* Honeypot. `sr-only` no alcanza: un lector de pantalla igual lo lee. */}
        <div aria-hidden="true" className="hidden">
          <label htmlFor={uid + '-website'}>Leave this empty</label>
          <input id={uid + '-website'} name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
      </form>
    </Ctx.Provider>
  );
}

/* ── Los campos EN FRASE, que hoy usa sólo `/contact` ────────────────────── */

/*
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ POR QUÉ HAY UNA SEGUNDA FORMA DE DIBUJAR UN CAMPO.
 *
 * El formulario de `/contact` está calcado del de `defoodtruckclub.nl/contact`,
 * donde los campos NO llevan etiqueta encima: están metidos dentro de una
 * frase. Allá se lee «Mijn naam is [       ] van [       ]», o sea que la
 * etiqueta es el texto que viene antes del campo y la línea entera se lee como
 * una oración que la persona completa.
 *
 * ⚠️ NO ES UN PLACEHOLDER HACIENDO DE ETIQUETA, que es la regla que rige el
 * resto del archivo. Cada campo sigue teniendo su `<label>` real, asociado con
 * `htmlFor`: lo único que cambia es que la etiqueta se pinta EN LÍNEA con el
 * campo en vez de arriba. Un lector de pantalla anuncia «My name is, edit
 * text» igual que antes. Y por eso mismo estos campos van SIN placeholder: con
 * la frase delante, un placeholder repetiría la etiqueta.
 *
 * ⚠️ LOS ESTILOS DEL CONTROL SON LOS MISMOS: `INPUT_BASE`, `OK` y `BAD` salen
 * de arriba de este archivo. No hay una segunda píldora ni un segundo alto.
 * Lo único propio es que el input CRECE para llenar el renglón, que es lo que
 * hace que la frase se lea como una frase y no como una lista de controles.
 *
 * ⚠️ EL ERROR VA EN SU PROPIO RENGLÓN (`basis-full`). Metido entre medio,
 * partiría la oración en dos y empujaría los campos siguientes a otra línea
 * cada vez que aparece.
 * ══════════════════════════════════════════════════════════════════════════
 */

/** El cuerpo de la frase: liviano y con interlínea grande, para que respire. */
const FRASE = 'font-body text-lead font-light leading-[2] text-body';

/** El renglón de la frase. Envuelve texto y campos en la misma línea de base. */
export function SentenceRow({ children }: { readonly children: ReactNode }) {
  return <div className={['flex flex-wrap items-center gap-x-3 gap-y-3', FRASE].join(' ')}>{children}</div>;
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
    <label htmlFor={htmlFor} className="shrink-0">
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
  /** `crece` llena lo que queda del renglón; `corto` se queda en 16 caracteres. */
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

/**
 * ⚠️ ESTE SELECT SÍ DIBUJA SU CARET y el de arriba no.
 *
 * `SelectField` lleva `appearance-none` y reserva 44px a la derecha, pero no
 * pinta nada ahí: se ve igual que un campo de texto. Adentro de una frase eso
 * es peor todavía, porque nada indica que esa píldora despliega opciones. Acá
 * el caret va en un `<span aria-hidden>` encima del control.
 * TODO: llevar el caret a `SelectField` y revisar los otros cuatro formularios.
 */
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

/**
 * El mensaje: la etiqueta sigue siendo parte de la frase, pero la caja va
 * abajo y a todo el ancho. Un `<textarea>` no entra en un renglón de texto.
 */
export function SentenceArea(p: BaseFieldProps & { readonly rows?: number }) {
  const { fid, eid, err, aria } = useField(p.name);
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
        {...aria}
        className={[BOX_BASE, err ? BAD : OK].join(' ')}
      />
      {err ? <ErrorText id={eid}>{err}</ErrorText> : null}
    </div>
  );
}
