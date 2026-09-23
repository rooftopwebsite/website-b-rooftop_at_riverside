'use client';

import { Button } from '@/components/shared/Button';
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
  /**
   * ══════════════════════════════════════════════════════════════════════
   * ⚠️ EL `hint` NO SE USA PARA DECIR «OPTIONAL». Camila, 2026-09-22, sobre
   * la captura del formulario de artistas: «del form quita el (opcional): si
   * no tiene el asterisco, es obvio que es opcional».
   *
   * Tenía razón y el sistema ya lo decía: los obligatorios llevan el
   * asterisco rojo que dibuja este mismo componente, más el `required` real
   * en el campo. Un «Optional» al lado de los que NO lo llevan es la misma
   * información escrita dos veces y al revés — y los doce que había hacían
   * que la etiqueta de la mitad de los campos midiera el doble.
   *
   * Los doce se sacaron el 2026-09-22 de los cuatro formularios del sitio.
   * Para lo que sí sirve el `hint` es para lo que el nombre del campo no
   * alcanza a decir: «Both in one file is fine», «One or two sentences is
   * plenty», «A link or an @username».
   * ══════════════════════════════════════════════════════════════════════
   */
  readonly hint?: string;
}) {
  return (
    /*
     * ══════════════════════════════════════════════════════════════════════
     * ⚠️ EL `flex-1` ES LO QUE ALINEA LOS CAMPOS DE UN MISMO RENGLÓN, y es un
     * arreglo, no un detalle.
     *
     * Camila lo marcó con un círculo sobre el formulario de `/events`, el
     * 2026-09-21: «A second date that works» ocupa DOS renglones de etiqueta y
     * sus vecinas uno, así que su campo arrancaba 24px más abajo que los
     * otros dos de la fila. Tres píldoras a tres alturas distintas.
     *
     * La causa: en una grilla, cada celda se estira al alto de la fila —eso ya
     * pasaba— pero adentro de la celda el `<input>` iba pegado a su etiqueta y
     * el aire sobrante quedaba ABAJO. Con la etiqueta creciendo, el aire pasa
     * a estar entre la etiqueta y el campo, o sea que las etiquetas se alinean
     * arriba y los campos abajo. Que es como se lee un formulario.
     *
     * ⚠️ NO HACE NADA FUERA DE UNA GRILLA. En una columna de campos sueltos el
     * envoltorio mide lo que mide su contenido, así que no hay a dónde crecer
     * y el espaciado queda idéntico al de antes.
     *
     * ⚠️ ARREGLA LOS CINCO FORMULARIOS DE UNA VEZ, que es el motivo por el que
     * este archivo existe. El mismo defecto estaba en `/join-us`: «What you
     * usually charge» contra «How many of you» en la misma fila de tres.
     * ══════════════════════════════════════════════════════════════════════
     */
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
  /*
   * ⚠️ `h-full` ACOMPAÑA AL `flex-1` DE `Label`. En una grilla la celda ya se
   * estira sola, pero cuando estos campos van adentro de un `flex` —que es lo
   * que hace `RepeatableField`— no hay estiramiento y la etiqueta no tiene a
   * dónde crecer. Con el alto declarado, la alineación funciona en los dos.
   */
  return <div className="flex h-full flex-col gap-[8px]">{children}</div>;
}

/**
 * El envoltorio del control cuando lleva un ícono encima: la flecha de un
 * desplegable, por ejemplo. Es el que da el `relative` contra el que se
 * posiciona el ícono.
 *
 * ⚠️ TIENE QUE SER `flex` Y NO `block`, para que el `<select>` de adentro
 * siga midiendo el ancho completo de la celda.
 */
function Control({ children }: { readonly children: ReactNode }) {
  return <span className="relative flex">{children}</span>;
}

/**
 * El estado de error de un grupo de radios o casillas dibujado a mano.
 *
 * ⚠️ EXISTE PARA NO EXPONER `useField` ENTERO. Los controles de este archivo lo
 * usan para armarse solos; lo único que un grupo dibujado afuera necesita es el
 * id del mensaje, el texto del error y el par de `aria-*` que va en cada input.
 * Hoy lo usa una sola pieza: las tarjetas de tier de comida de
 * `sections/InquiryForm.tsx`, que son el único control del sitio sin hermano.
 */
export function useRadioGroup(name: string) {
  const { eid, err, aria } = useField(name);
  return { eid, err, aria };
}

/**
 * La flecha del desplegable.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ FALTABA, Y ESE ERA EL BUG. `SelectField` ya traía `appearance-none` —o
 * sea, apagaba la flecha que dibuja el navegador— pero nunca pintaba la
 * propia. Resultado: los desplegables de `/join-us` («What you do», «How you
 * heard about us») se veían EXACTAMENTE IGUAL que un campo de texto, sin nada
 * que dijera que se despliegan. El `pr-[44px]` que sí estaba reservaba el
 * hueco de un ícono que no existía.
 *
 * ⚠️ LA POSICIÓN SALE DE `InlineSelect`, que es el hermano de este archivo y
 * lo tenía bien desde el principio: 18px desde el borde. No es un número
 * suelto — la píldora tiene 25px de radio, así que un ícono a menos de eso se
 * mete en la curva. Es el mismo motivo por el que el padding lateral es 22.
 *
 * ⚠️ `pointer-events-none` NO SE SACA: sin eso, el clic sobre la flecha lo
 * come el `<svg>` y no abre el desplegable, que es lo único que alguien
 * intenta hacer con una flecha.
 * ══════════════════════════════════════════════════════════════════════════
 */
function SelectCaret() {
  return (
    <CaretDown
      className="pointer-events-none absolute right-[18px] top-1/2 size-4 -translate-y-1/2 text-body/70"
      aria-hidden="true"
    />
  );
}

/**
 * Los íconos NATIVOS de `date` y `time` —el calendario y el reloj— puestos en
 * su lugar.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ TAMBIÉN LO MARCÓ CAMILA sobre `/events`: «que los iconos ocupen bien su
 * lugar». El navegador dibuja ese botón al final del contenido del campo, o
 * sea pegado al borde derecho del área de texto, y con una píldora de 25px de
 * radio eso lo deja montado sobre la curva.
 *
 * No se puede reposicionar con `absolute` —es un pseudo-elemento del UA y no
 * acepta salir del flujo de forma confiable— pero sí se le puede dar margen.
 * Con `mr` propio queda a la misma distancia del borde que la flecha del
 * desplegable, que es lo que hace que los tres controles se lean como una
 * familia y no como tres cosas que hizo cada navegador a su manera.
 *
 * ⚠️ LA OPACIDAD LO IGUALA AL RESTO. El ícono del navegador viene en negro
 * pleno y al lado de una flecha en `body/70` se veía más oscuro que el propio
 * texto del campo.
 * ══════════════════════════════════════════════════════════════════════════
 */
const PICKER =
  '[&::-webkit-calendar-picker-indicator]:ml-auto [&::-webkit-calendar-picker-indicator]:mr-[2px] ' +
  '[&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60';

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
        /* `PICKER` sólo tiene efecto en `time`, que es el único tipo de acá
           que dibuja un botón propio. En los demás no matchea nada. */
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
        /* ⚠️ ESTABA DECLARADO EN `BaseFieldProps` Y NO LLEGABA AL CONTROL: se
           podía pasar `autoComplete` a un `TextAreaField`, TypeScript lo
           aceptaba y el navegador no autocompletaba nada. Lo destapó la
           dirección del formulario de trabajo, que es un `<textarea>` porque
           en el papel es una caja alta y quiere `street-address`. */
        autoComplete={p.autoComplete}
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
      {p.maxMb ? <p className="text-[16px] text-body/75">Up to {p.maxMb} MB.</p> : null}
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
  defaultChecked,
}: {
  readonly name: string;
  readonly legend: string;
  readonly options: readonly Option[];
  readonly hint?: string;
  /**
   * Los valores que vienen marcados de entrada.
   *
   * ⚠️ EXISTE PARA QUE UN LINK PUEDA LLEGAR CON UNA CASILLA YA PUESTA, y el
   * primer caso es `/game-truck`: sus dos CTA mandaban a `/events#inquire`, o
   * sea al formulario de eventos privados, con quince campos y ninguna
   * referencia al camión. Ahora llegan a `/events?area=game-truck#inquire` y
   * la casilla «The gaming truck» ya está tildada.
   *
   * ⚠️ VA EN EL `defaultChecked` DEL INPUT Y NO EN `checked`: el formulario es
   * NO CONTROLADO —se lee por `FormData` en una server action— y un `checked`
   * sin `onChange` deja la casilla congelada y React avisa por consola.
   */
  readonly defaultChecked?: readonly string[];
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

/**
 * Un grupo de radios: elegir UNA de dos o tres.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ NO EXISTÍA, Y HACÍA FALTA CUATRO VECES EN LA MISMA PANTALLA. El
 * formulario de trabajo de `/join-us` se calcó del PDF del cliente el
 * 2026-09-22, y ese papel tiene cuatro elecciones excluyentes: Part-Time o
 * Full-Time, y las tres preguntas de sí o no (licencia o ID, elegibilidad en
 * EE.UU., transporte propio). Hasta ese día el archivo sólo exportaba el
 * *hook* `useRadioGroup`, para que `InquiryForm` dibujara sus tarjetas de
 * tier a mano: eso está bien para un control único e irrepetible, y es
 * exactamente lo que no son estos cuatro.
 *
 * ⚠️ POR QUÉ RADIOS Y NO UN DESPLEGABLE DE DOS OPCIONES. Con dos respuestas,
 * un `<select>` esconde la mitad de la pregunta detrás de un clic y cuesta dos
 * gestos en vez de uno. Y en el papel están las dos a la vista, que es lo que
 * se está calcando.
 *
 * ⚠️ LA PREGUNTA VA ARRIBA Y LAS OPCIONES DEBAJO, aunque en el papel estén en
 * la misma línea. El `<legend>` TIENE que ser el primer hijo del `<fieldset>`:
 * es la única posición en la que el navegador lo toma como nombre accesible
 * del grupo. Metido adentro de un `flex` junto a los radios para que quede en
 * línea, se convierte en un texto suelto y el grupo se queda sin etiqueta.
 * Es la misma disposición que ya tiene `CheckboxGroup` en este archivo.
 *
 * ⚠️ NINGUNA VIENE MARCADA DE ENTRADA. Una respuesta por omisión en «are you
 * eligible for employment in the U.S.» es un dato que la persona no dio y que
 * igual viaja en el mail. El schema exige la elección y el error lo dice.
 * ══════════════════════════════════════════════════════════════════════════
 */
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
    <fieldset id={uid + '-' + name} className="flex flex-col gap-[8px]">
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

/**
 * La grilla de disponibilidad: una fila por día, una casilla por turno.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ES EL RENGLÓN «AVAILABILITY» DEL PAPEL, que lista los siete días y debajo
 * de cada uno «AM / PM». Reemplaza a los cinco tipos de turno que teníamos
 * —«Weekdays», «Night shifts», «Anything you have»—, que los habíamos
 * inventado nosotros y son más gruesos: con «weekends» tildado no se sabe si
 * la persona puede el sábado al mediodía.
 *
 * ⚠️ CADA CASILLA LLEVA SU PROPIO `aria-label` CON EL DÍA ADENTRO: «Monday
 * AM». Sin eso, un lector de pantalla recorriendo el formulario anuncia
 * catorce casillas que dicen «AM», «PM», «AM», «PM» y ninguna dice de qué día.
 * El nombre del día, visualmente, está en la primera columna de la fila, y esa
 * relación espacial no viaja al audio.
 *
 * ⚠️ NO ES UNA `<table>` AUNQUE SE PAREZCA A UNA. Una tabla anuncia
 * encabezados de fila y de columna al navegar celda por celda, y acá no hay
 * datos que comparar: hay catorce casillas. El `<fieldset>` con su `<legend>`
 * dice lo único que importa, que es de qué pregunta son todas.
 *
 * ⚠️ EL DÍA SE ABREVIA POR DEBAJO DE `sm`. Siete filas con «Wednesday» entero
 * más dos casillas no entran en 360px sin partir la etiqueta en dos renglones.
 * El papel mismo escribe «Wed.», así que la abreviatura no es una licencia.
 * ══════════════════════════════════════════════════════════════════════════
 */
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
  /** Las filas: los días. `short` es lo que se ve en el teléfono. */
  readonly rows: readonly { readonly value: string; readonly label: string; readonly short: string }[];
  /** Las columnas: los turnos. */
  readonly cols: readonly Option[];
}) {
  const { uid } = useContext(Ctx);
  const { eid, err } = useField(name);
  return (
    <fieldset id={uid + '-' + name} className="flex flex-col gap-[8px]">
      <legend className="font-body text-[16px] font-bold">
        {legend}
        {hint ? <span className="ml-[8px] font-normal text-body/75">{hint}</span> : null}
      </legend>

      {/*
        Dos columnas de días desde `sm`: siete filas de una sola línea dejan la
        mitad derecha del panel vacía, y el formulario ya es largo.
      */}
      <div className="mt-[6px] grid gap-x-[24px] gap-y-[10px] sm:grid-cols-2">
        {rows.map((r) => (
          /*
            ⚠️ EL DÍA VA EN UNA COLUMNA DE ANCHO FIJO Y NO CON
            `justify-between`. Con el reparto automático, «Mon» quedaba pegado
            al borde izquierdo y sus casillas contra el derecho: doscientos
            píxeles de nada entre una etiqueta y el control que nombra, que es
            justo la distancia que hace dudar de cuál casilla es de qué día.
            Con el ancho fijo, las siete filas arrancan sus casillas en la
            misma vertical y el recorrido del ojo es corto.
          */
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

/**
 * Una TABLA del papel: N filas fijas de las mismas columnas.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ SON LAS DOS TABLAS NARANJAS DEL PDF —«Educational background», dos
 * renglones, y «Employment history», tres— y por eso las filas son FIJAS y no
 * se agregan con un botón como en `RepeatableField`. El papel ofrece dos y
 * tres renglones; ofrecer diez sería otro formulario.
 *
 * ⚠️ EN EL TELÉFONO NO ES UNA TABLA, ES UNA PILA DE BLOQUES NUMERADOS. Cuatro
 * columnas en 360px no entran de ninguna manera: o se parte cada palabra o se
 * mete scroll horizontal, que en esta web está prohibido —la página entera se
 * arregló para no arrastrarse de costado—. Apiladas, cada fila se lee como una
 * ficha corta con su número, que es lo que es.
 *
 * ⚠️ CADA CELDA TIENE SU `<label>` REAL, CON EL NÚMERO DE FILA ADENTRO, y en
 * desktop va en `sr-only` porque el rótulo de la columna ya está arriba. Sin
 * eso, ocho campos comparten cuatro etiquetas y un lector de pantalla no puede
 * decir en qué renglón está parado.
 *
 * ⚠️ LOS RÓTULOS DE COLUMNA SE DIBUJAN UNA SOLA VEZ Y SÓLO EN `lg`, con
 * `aria-hidden`: son decoración que repite lo que ya dicen los `<label>`.
 * Anunciados, cada campo se leería dos veces.
 *
 * ⚠️ NINGUNA CELDA ES OBLIGATORIA, y es fiel al papel: el PDF no marca un solo
 * campo de estas dos tablas. Las filas que quedan del todo vacías se descartan
 * en la server action antes de validar.
 * ══════════════════════════════════════════════════════════════════════════
 */
export function FieldRows({
  name,
  prefix,
  legend,
  hint,
  cols,
  rows,
}: {
  /**
   * La clave del SCHEMA, que es de donde sale el error y a dónde apunta el
   * link del resumen de arriba: `education`, `history`.
   *
   * ⚠️ NO ES LO MISMO QUE `prefix`, y separarlos no es un capricho. Los inputs
   * viajan como una columna por `name` repetido (`edu.degree` dos veces),
   * mientras que zod valida la TABLA ENTERA bajo una sola clave. Si fueran el
   * mismo string, el resumen de errores linkearía a `#…-edu`, que no existe.
   */
  readonly name: string;
  /** Lo que va delante de cada columna: `edu` → `edu.degree`. */
  readonly prefix: string;
  readonly legend: string;
  readonly hint?: string;
  readonly cols: readonly { readonly key: string; readonly label: string }[];
  /** Cuántos renglones dibuja. Es el número que tiene la hoja impresa. */
  readonly rows: number;
}) {
  const { uid } = useContext(Ctx);
  const { eid, err } = useField(name);
  const grid = 'grid gap-[12px] sm:grid-cols-2 lg:grid-cols-4';
  /** El rótulo de cada celda: el mismo de los campos sueltos del formulario. */
  const LABEL_CELDA = 'font-body text-[16px] font-bold text-ink';

  return (
    <fieldset id={uid + '-' + name} className="flex flex-col gap-[8px]">
      <legend className="font-body text-[16px] font-bold">
        {legend}
        {hint ? <span className="ml-[8px] font-normal text-body/75">{hint}</span> : null}
      </legend>

      {/*
        ⚠️ LOS RÓTULOS DE COLUMNA VAN EN EL ESTILO DE RÓTULO DE CAMPO DEL SITIO
        (16px, negrita, caja baja) Y CENTRADOS SOBRE SU COLUMNA, desde el
        2026-09-23. Camila: «los títulos de cada columna deben estar centrados,
        y en desk usás un estilo de font y en tablet y mobile otro». Eran
        caption en caja alta en desktop y 15px regular en las fichas de mobile:
        el mismo rótulo con dos dibujos. Ahora es `LABEL_CELDA` en los dos.

        ⚠️ LA FILA LLEVA EL MISMO HUECO DEL NÚMERO (16px + 12 de gap) que los
        renglones de abajo. Sin él cada rótulo quedaba 28px corrido a la
        izquierda de su columna, que es el desfasaje de la captura.
      */}
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
            {/*
              El número del renglón, como en el papel. En `lg` ocupa su lugar
              en la grilla de arriba; abajo de eso es lo que separa una ficha
              de la siguiente.
            */}
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

/* ── El botón, que conoce el estado de envío ────────────────────────────── */

/*
 * ⚠️ VA AL ANCHO DE LA TARJETA (`w-full`), desde el 2026-09-23. Camila: «los
 * CTA de los forms al ancho total de la card, con los márgenes que le
 * correspondan». El margen lo pone el padding de la tarjeta que envuelve el
 * formulario, así que el botón no suma nada propio: llena la caja y ya.
 */

/*
 * ⚠️ ES EL `Button` DEL SISTEMA Y NO UN `<button>` ESCRITO A MANO, desde el
 * 2026-09-23. Camila, sobre «Apply for a booth»: «este CTA es diferente al
 * resto, la font y su animación». Tenía sus propias clases —negrita 700,
 * caja baja, sin el `Rodillo` del hover—, así que los cinco botones de envío
 * eran los únicos CTA del sitio que no rodaban ni iban en caja alta.
 */
export function SubmitButton({ idle, busy }: { readonly idle: string; readonly busy: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" size="lg" disabled={pending} className="w-full">
      {pending ? busy : idle}
    </Button>
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
  const formRef = useRef<HTMLFormElement | null>(null);
  const errors = state.fieldErrors ?? {};
  const keys = Object.keys(errors);

  /*
    ══════════════════════════════════════════════════════════════════════════
    ⚠️ YA NO HAY RESUMEN CON LA LISTA DE ERRORES, desde el 2026-09-23. Camila:
    «cuando pasa esto en los forms no quiero que salga ese cartel con la lista,
    sólo se indica en cada input». El cartel repetía, arriba, lo que cada campo
    ya dice debajo en rojo, y empujaba el formulario entero hacia abajo.

    ⚠️ LO QUE HACÍA EL RESUMEN POR LA ACCESIBILIDAD SE CONSERVA DE OTRA FORMA:
    el foco va al PRIMER CAMPO CON ERROR (en el orden del formulario), que
    anuncia su etiqueta y su mensaje por `aria-describedby`; y el aviso general
    («Please check the highlighted fields») sigue en la región `aria-live` de
    arriba. Quien navega con teclado cae donde tiene que corregir.

    ⚠️ SI EL ERROR NO ES DE UN CAMPO —el servidor no contestó, el envío falló—
    no hay campo al que llevar el foco, y ahí sí se muestra una línea de aviso.
    ══════════════════════════════════════════════════════════════════════════
  */
  useEffect(() => {
    if (state.status !== 'error') return;
    const primero = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
    if (primero) primero.focus();
    else summaryRef.current?.focus();
  }, [state]);

  return (
    <Ctx.Provider value={{ uid, errors }}>
      {/* Existe siempre, con o sin mensaje. Ver la nota de accesibilidad. */}
      <p aria-live="polite" className="sr-only">
        {state.status === 'error' ? state.message : ''}
      </p>

      <form ref={formRef} action={action} noValidate className="flex flex-col gap-[28px]">
        {state.status === 'error' && keys.length === 0 ? (
          <div
            ref={summaryRef}
            tabIndex={-1}
            role="alert"
            className="rounded-card border-2 border-tomato bg-tomato/5 p-[20px]"
          >
            <p className="font-body text-[16px] font-bold text-terra">{state.message}</p>
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
  return <div className={['flex flex-wrap items-center gap-x-3 gap-y-1 sm:gap-y-3', FRASE].join(' ')}>{children}</div>;
}

/*
 * ⚠️ EN MOBILE LA ETIQUETA OCUPA SU RENGLÓN (`basis-full`) Y EL CAMPO VA ABAJO,
 * desde el 2026-09-23. A 390, «You can reach me at» se comía la mitad de la
 * línea y el email quedaba en una píldora de 150px, donde una dirección normal
 * no se lee entera. La frase sigue leyéndose de corrido; desde `sm` vuelve a
 * ir en línea con el campo.
 */
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
