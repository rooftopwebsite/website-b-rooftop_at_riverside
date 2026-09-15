import { z } from 'zod';

/**
 * Los DOS formularios de `/join-us`, cada uno con su schema.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ SON DOS SCHEMAS Y NO UNO CON CAMPOS OPCIONALES. Un músico y alguien que
 * busca trabajo no comparten casi nada: uno manda links y duración de set, el
 * otro disponibilidad y currículum. Un schema único con la mitad de los campos
 * opcionales no valida nada de verdad, y los mensajes de error terminan
 * hablando de campos que la persona nunca vio.
 *
 * ⚠️ EL ARCHIVO SE VALIDA EN LOS DOS LADOS. En el cliente por `accept` y por
 * el chequeo de tamaño; en el servidor por lo que dice el `File`, que es lo
 * único que manda. Un `accept` en el HTML es una sugerencia al selector de
 * archivos, no una restricción: se puede arrastrar cualquier cosa.
 * ══════════════════════════════════════════════════════════════════════════
 */

/** 5 MB, el techo que pidió Camila para el currículum. */
export const MAX_FILE_MB = 5;
const MAX_BYTES = MAX_FILE_MB * 1024 * 1024;

export const RESUME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;

/**
 * Un archivo subido, validado.
 *
 * ⚠️ VACÍO PASA. Un `<input type="file">` sin elegir nada llega como un `File`
 * de 0 bytes y nombre vacío, no como `undefined`. Sin este caso, un campo
 * opcional rechazaría todos los envíos que no suben nada.
 */
const archivo = (tipos: readonly string[], etiqueta: string) =>
  z
    .custom<File>((v) => v instanceof File, 'Attach a file.')
    .refine((f) => f.size === 0 || f.size <= MAX_BYTES, `${etiqueta} has to be under ${MAX_FILE_MB} MB.`)
    .refine(
      (f) => f.size === 0 || tipos.includes(f.type),
      `${etiqueta} has to be a PDF or a Word document.`,
    )
    .optional();

/* ── 1. Trabajo ─────────────────────────────────────────────────────────── */

export const HEARD_FROM = [
  'Someone who works here',
  'Instagram or Facebook',
  'I was at the bar',
  'A job board',
  'Walked past',
  'Something else',
] as const;

export const AVAILABILITY = [
  { value: 'weekdays', label: 'Weekdays' },
  { value: 'weekends', label: 'Weekends' },
  { value: 'days', label: 'Day shifts' },
  { value: 'nights', label: 'Night shifts' },
  { value: 'anything', label: 'Anything you have' },
] as const;

export const jobSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name.'),
  email: z.string().trim().email('Enter a valid email address, like you@example.com.'),
  phone: z
    .string()
    .trim()
    .refine((v) => v.replace(/\D/g, '').length >= 10, 'Enter a phone number with at least 10 digits.'),
  /**
   * ⚠️ ES TEXTO LIBRE Y NO UN DESPLEGABLE DE PUESTOS. Hoy el dashboard no
   * tiene ninguna búsqueda cargada, así que un select estaría vacío. Con texto
   * libre alguien puede escribir «anything behind the bar», que es lo que
   * realmente escribe la gente.
   */
  position: z.string().trim().min(2, 'What kind of work are you after?'),
  availability: z
    .array(z.enum(AVAILABILITY.map((a) => a.value) as [string, ...string[]]))
    .min(1, 'Pick at least one kind of shift.'),
  experience: z
    .string()
    .trim()
    .min(20, 'A couple of sentences about what you have done before.')
    .max(3000, 'Keep it under 3000 characters.'),
  resume: archivo(RESUME_TYPES, 'Your resume'),
  heard: z.enum(HEARD_FROM, { message: 'How did you hear about us?' }),
  message: z.string().trim().max(2000).optional().default(''),
  website_hp: z.string().max(0).optional().default(''),
});

/* ── 2. Artistas ────────────────────────────────────────────────────────── */

export const DISCIPLINES = [
  'Live music',
  'DJ',
  'Visual art',
  'Performance',
  'Something else',
] as const;

export const artistSchema = z.object({
  act: z.string().trim().min(2, 'Enter your artist or band name.'),
  name: z.string().trim().min(2, 'Enter your name.'),
  email: z.string().trim().email('Enter a valid email address, like you@example.com.'),
  phone: z
    .string()
    .trim()
    .refine((v) => v.replace(/\D/g, '').length >= 10, 'Enter a phone number with at least 10 digits.'),
  discipline: z.enum(DISCIPLINES, { message: 'What do you do?' }),
  genre: z.string().trim().min(2, 'Give us a genre, even a rough one.'),
  /**
   * ⚠️ AL MENOS UN LINK, Y ES EL CAMPO QUE MÁS IMPORTA. Sin algo que escuchar
   * o mirar, la solicitud no se puede evaluar: el formulario que el cliente
   * tiene hoy en `/entertainment` ya pide link de redes y link de video.
   *
   * Los campos repetibles llegan como varios valores con el mismo nombre, así
   * que la action los lee con `getAll` y los filtra vacíos antes de validar.
   */
  links: z
    .array(z.string().trim().min(4))
    .min(1, 'Add at least one link: Instagram, Spotify, YouTube or a portfolio.'),
  setLength: z.string().trim().min(1, 'Roughly how long is a set?'),
  lineup: z.string().trim().min(1, 'How many people are in the act?'),
  availability: z.string().trim().min(2, 'Which nights generally work for you?'),
  fee: z.string().trim().max(200).optional().default(''),
  message: z.string().trim().max(2000).optional().default(''),
  presskit: archivo(RESUME_TYPES, 'Your press kit'),
  website_hp: z.string().max(0).optional().default(''),
});

export type JobInput = z.infer<typeof jobSchema>;
export type ArtistInput = z.infer<typeof artistSchema>;
