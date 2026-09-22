import { z } from 'zod';

/**
 * Los DOS formularios de `/join-us`, cada uno con su schema.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LOS DOS SON CALCOS DE LO QUE EL CLIENTE YA TIENE VIVO, y desde el
 * 2026-09-22 eso es literal, campo por campo. Antes eran formularios NUESTROS,
 * armados por lo que nos parecía que había que preguntar.
 *
 * Camila, 2026-09-22: «ten en cuenta que ese es el pdf que está publicado en
 * la web para aplicar a jobs, deberíamos hacer que en el form digital estén
 * tal cual esos items a completar», y acto seguido la captura del formulario
 * de artistas del sitio actual: «estos son los inputs del formulario de
 * artistas».
 *
 *   · TRABAJO   ← `public/docs/rooftop-at-riverside-job-application.pdf`, la
 *                 hoja que el cliente publica para imprimir y entregar en mano.
 *   · ARTISTAS  ← el formulario «Want to perform at Rooftop? Tell us more» que
 *                 vive hoy en el sitio de Wix.
 *
 * ⚠️ POR QUÉ IMPORTA QUE SEAN CALCOS Y NO «MEJORES». La hoja de papel y el
 * formulario web tienen que pedir LO MISMO: alguien que llenó el PDF en la
 * barra y alguien que lo mandó desde el teléfono tienen que llegar al mismo
 * buzón con los mismos datos, o el que recibe termina con dos planillas que no
 * se pueden comparar. Cada campo que agreguemos de nuestra cosecha es una
 * columna que el papel no tiene.
 *
 * ⚠️ LO QUE SE PERDIÓ AL CALCAR, ANOTADO PARA QUE SEA UNA DECISIÓN Y NO UN
 * OLVIDO. El formulario de artistas que teníamos preguntaba duración del set,
 * cuántos son, qué noches les sirven y cuánto cobran. El del cliente no
 * pregunta nada de eso, así que agendar a alguien arranca con un mail de ida y
 * vuelta. Está hablado con Camila el 2026-09-22 y es el precio de que los dos
 * canales pidan lo mismo. Si el cliente suma esos campos a su formulario,
 * vuelven acá.
 *
 * ⚠️ SON DOS SCHEMAS Y NO UNO CON CAMPOS OPCIONALES. Un músico y alguien que
 * busca trabajo no comparten casi nada. Un schema único con la mitad de los
 * campos opcionales no valida nada de verdad, y los mensajes de error terminan
 * hablando de campos que la persona nunca vio.
 *
 * ⚠️ EL ARCHIVO SE VALIDA EN LOS DOS LADOS. En el cliente por `accept` y por
 * el chequeo de tamaño; en el servidor por lo que dice el `File`, que es lo
 * único que manda. Un `accept` en el HTML es una sugerencia al selector de
 * archivos, no una restricción: se puede arrastrar cualquier cosa.
 * ══════════════════════════════════════════════════════════════════════════
 */

/** 5 MB para el currículum, el techo que pidió Camila. */
export const MAX_FILE_MB = 5;

/**
 * 15 MB para el logo y la foto de la banda.
 *
 * ⚠️ NO ES UN NÚMERO NUESTRO: es el que declara el formulario del cliente
 * debajo de sus dos campos de subida, «Upload supported file (Max 15MB)». Si
 * acá pusiéramos 5, alguien que ya subió su foto en el sitio viejo se comería
 * un rechazo por un límite que nadie le avisó que bajó.
 */
export const MAX_IMAGE_MB = 15;

export const RESUME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;

export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'] as const;

/**
 * Un archivo subido, validado.
 *
 * ⚠️ VACÍO PASA. Un `<input type="file">` sin elegir nada llega como un `File`
 * de 0 bytes y nombre vacío, no como `undefined`. Sin este caso, un campo
 * opcional rechazaría todos los envíos que no suben nada.
 */
const archivo = (tipos: readonly string[], etiqueta: string, maxMb: number, formatos: string) =>
  z
    .custom<File>((v) => v instanceof File, 'Attach a file.')
    .refine(
      (f) => f.size === 0 || f.size <= maxMb * 1024 * 1024,
      `${etiqueta} has to be under ${maxMb} MB.`,
    )
    .refine((f) => f.size === 0 || tipos.includes(f.type), `${etiqueta} has to be ${formatos}.`)
    .optional();

/* ── Piezas que comparten los dos ───────────────────────────────────────── */

const nombre = (campo: string) => z.string().trim().min(2, `Enter your ${campo}.`);
const mail = z.string().trim().email('Enter a valid email address, like you@example.com.');
const telefono = z
  .string()
  .trim()
  .refine((v) => v.replace(/\D/g, '').length >= 10, 'Enter a phone number with at least 10 digits.');

/**
 * El campo trampa.
 *
 * ⚠️ SE LLAMA `website` Y ANTES SE LLAMABA `website_hp`, QUE ERA UN BUG MUDO.
 * El input lo dibuja `FormShell` con `name="website"`, así que el schema
 * buscaba una clave que no llegaba nunca: caía en el `.default('')`, el
 * `if (parsed.data.website_hp)` daba falso siempre y la trampa no atrapaba a
 * nadie. Un filtro anti spam que nunca se dispara no se nota hasta que llega
 * el spam.
 *
 * ⚠️ EL MISMO BUG SIGUE VIVO EN `lib/schemas/market-vendor.ts`, que es el
 * tercer formulario con trampa. No se tocó acá porque es otra página; queda
 * anotado para arreglarlo en su propio commit.
 */
const trampa = z.string().max(0).optional().default('');

/* ── 1. Trabajo ─────────────────────────────────────────────────────────── */

/*
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ TODO LO QUE SIGUE SALE DE LA HOJA, EN EL ORDEN DE LA HOJA. Lo que el
 * papel pide arriba se pregunta arriba. Es la única forma de que alguien que
 * tiene el PDF abierto al lado pueda seguir los dos.
 *
 * ⚠️ EL «DATE» DEL ENCABEZADO NO SE PREGUNTA, y es la única línea del papel
 * que no está acá. En una hoja impresa hay que escribir la fecha porque el
 * papel no la sabe; un envío web llega con la suya. Preguntarla sería pedir un
 * dato que ya tenemos y que además puede venir mal escrito.
 *
 * ⚠️ LAS DOS TABLAS SON OPCIONALES ENTERAS, tal cual el papel: el PDF no marca
 * un solo campo como obligatorio en «Educational background» ni en
 * «Employment history». El costo asumido, hablado con Camila el 2026-09-22, es
 * que un envío puede llegar sin una línea de experiencia. Lo que sostiene el
 * envío igual son los obligatorios de arriba —puesto, nombre, teléfono, mail y
 * las tres preguntas de sí o no—, que es con lo que se llama a alguien.
 * ══════════════════════════════════════════════════════════════════════════
 */

export const EMPLOYMENT_TYPE = [
  { value: 'part-time', label: 'Part-Time' },
  { value: 'full-time', label: 'Full-Time' },
] as const;

/**
 * Los siete días, cada uno con AM y PM.
 *
 * ⚠️ ES LA GRILLA DEL PAPEL Y NO LOS CINCO TIPOS DE TURNO QUE TENÍAMOS
 * («Weekdays», «Night shifts», «Anything you have»). Esos los inventamos
 * nosotros. El papel pide día por día y mañana o tarde, que para armar una
 * semana de turnos es un dato mucho más fino: con «weekends» no se sabe si
 * puede el sábado al mediodía.
 *
 * ⚠️ `short` EXISTE PARA EL TELÉFONO. Siete filas con «Wednesday» entero más
 * dos casillas no entran en 360px sin que la etiqueta se parta en dos
 * renglones. El papel mismo abrevia «Wed.», así que no es una licencia nuestra.
 */
export const DAYS = [
  { value: 'mon', label: 'Monday', short: 'Mon' },
  { value: 'tue', label: 'Tuesday', short: 'Tue' },
  { value: 'wed', label: 'Wednesday', short: 'Wed' },
  { value: 'thu', label: 'Thursday', short: 'Thu' },
  { value: 'fri', label: 'Friday', short: 'Fri' },
  { value: 'sat', label: 'Saturday', short: 'Sat' },
  { value: 'sun', label: 'Sunday', short: 'Sun' },
] as const;

export const SHIFTS = [
  { value: 'am', label: 'AM' },
  { value: 'pm', label: 'PM' },
] as const;

/** `mon-am`, `mon-pm`, `tue-am`… Los catorce que puede mandar el formulario. */
export const AVAILABILITY_SLOTS: readonly string[] = DAYS.flatMap((d) =>
  SHIFTS.map((s) => `${d.value}-${s.value}`),
);

/** Cómo se lee un slot en el mail: `mon-am` → `Monday AM`. */
export function slotLabel(slot: string): string {
  const [dia, turno] = slot.split('-');
  const d = DAYS.find((x) => x.value === dia);
  const s = SHIFTS.find((x) => x.value === turno);
  return d && s ? `${d.label} ${s.label}` : slot;
}

export const YES_NO = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
] as const;

const siNo = (pregunta: string) => z.enum(['yes', 'no'], { message: pregunta });

/**
 * Las dos tablas del papel, como columnas.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LAS FILAS VIAJAN COMO COLUMNAS PARALELAS Y SE ARMAN EN LA ACTION. Cada
 * celda es un input con el `name` de su columna repetido por fila
 * —`eduDegree` dos veces, `jobCompany` tres—, y la action las lee con
 * `getAll` y las cruza. Es el mismo mecanismo que ya usa `RepeatableField`
 * para los links, y el motivo es el mismo: `Object.fromEntries` se queda con
 * el último valor de cada nombre, así que sin `getAll` de una tabla de tres
 * filas llegaría una sola.
 *
 * ⚠️ LAS FILAS VACÍAS SE DESCARTAN ANTES DE VALIDAR. El papel tiene dos
 * renglones de estudios y tres de empleos porque es papel y hay que imprimir
 * algo; nadie está obligado a llenar los cinco.
 * ══════════════════════════════════════════════════════════════════════════
 */
export const EDU_COLS = [
  { key: 'degree', label: 'Degree / Certificate' },
  { key: 'school', label: 'University / Institute' },
  { key: 'year', label: 'Graduation Year' },
  { key: 'city', label: 'City / State' },
] as const;

export const HISTORY_COLS = [
  { key: 'company', label: 'Company' },
  { key: 'position', label: 'Position' },
  { key: 'reason', label: 'Reason for Leaving' },
  { key: 'years', label: 'Year(s)' },
] as const;

/** Dos renglones de estudios y tres de empleos, como la hoja impresa. */
export const EDU_ROWS = 2;
export const HISTORY_ROWS = 3;

/** Una fila ya armada: la columna y lo que se escribió en ella. */
export type TableRow = Readonly<Record<string, string>>;

const tabla = (maxFilas: number) =>
  z
    .array(z.record(z.string(), z.string().trim().max(200, 'Keep each box short.')))
    .max(maxFilas)
    .default([]);

export const jobSchema = z.object({
  /**
   * ⚠️ ES TEXTO LIBRE Y NO UN DESPLEGABLE DE PUESTOS, igual que en el papel,
   * donde «Position» es una línea en blanco. Hoy el dashboard no tiene
   * ninguna búsqueda cargada, así que un select estaría vacío; y con texto
   * libre alguien puede escribir «anything behind the bar», que es lo que
   * realmente escribe la gente.
   */
  position: z.string().trim().min(2, 'What kind of work are you after?'),
  employmentType: z.enum(['part-time', 'full-time'], {
    message: 'Part-time or full-time?',
  }),
  availability: z
    .array(z.enum(AVAILABILITY_SLOTS as [string, ...string[]]))
    .min(1, 'Tick at least one morning or afternoon you can work.'),

  firstName: nombre('first name'),
  lastName: nombre('last name'),
  phone: telefono,
  email: mail,
  address: z.string().trim().min(5, 'Enter your street address.'),
  cityState: z.string().trim().min(2, 'Enter your city and state.'),
  zipcode: z.string().trim().min(5, 'Enter your ZIP code.'),

  license: siNo('Do you have a valid driver license or ID card?'),
  eligible: siNo('Are you eligible for employment in the U.S.?'),
  transport: siNo('Do you have reliable transportation?'),

  education: tabla(EDU_ROWS),
  history: tabla(HISTORY_ROWS),

  startDate: z.string().trim().min(1, 'When could you start?'),

  /**
   * ⚠️ UN SOLO CAMPO PARA LAS DOS COSAS. El pie del papel dice «attach your
   * resume and portfolio to this job application form», o sea los dos, pero no
   * da dos renglones: da un sobre. Dos campos separados en la web obligarían a
   * quien tiene todo en un PDF a subirlo dos veces o a elegir cuál miente.
   */
  resume: archivo(RESUME_TYPES, 'Your resume', MAX_FILE_MB, 'a PDF or a Word document'),

  website: trampa,
});

/* ── 2. Artistas ────────────────────────────────────────────────────────── */

/*
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ DIEZ CAMPOS, LOS DIEZ DEL FORMULARIO DEL CLIENTE, EN SU ORDEN: nombre,
 * apellido, mail, teléfono, band name, social media link, género, video link,
 * logo y foto.
 *
 * ⚠️ SÓLO LOS CUATRO PRIMEROS SON OBLIGATORIOS, que son los cuatro que el
 * formulario del cliente marca con asterisco. Los demás quedan opcionales
 * aunque uno de ellos sea el que más importa: sin un link de video o de redes
 * no hay nada para escuchar y la solicitud no se puede evaluar. Se respeta el
 * original igual —es un calco, no una corrección— y el peso se pone donde sí
 * corresponde: en el `hint` del campo y en la columna de la izquierda de la
 * página, que dice qué necesitamos para poder contestar.
 * ══════════════════════════════════════════════════════════════════════════
 */

const linkOpcional = (campo: string) =>
  z.string().trim().max(300, `That ${campo} is too long.`).optional().default('');

export const artistSchema = z.object({
  firstName: nombre('first name'),
  lastName: nombre('last name'),
  email: mail,
  phone: telefono,

  band: z.string().trim().max(120).optional().default(''),
  social: linkOpcional('link'),
  genre: z.string().trim().max(120).optional().default(''),
  video: linkOpcional('link'),

  logo: archivo(IMAGE_TYPES, 'Your logo', MAX_IMAGE_MB, 'an image'),
  photo: archivo(IMAGE_TYPES, 'Your photo', MAX_IMAGE_MB, 'an image'),

  website: trampa,
});

export type JobInput = z.infer<typeof jobSchema>;
export type ArtistInput = z.infer<typeof artistSchema>;
