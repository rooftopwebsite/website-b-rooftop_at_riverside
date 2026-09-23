import { z } from 'zod';

export const MAX_REQUEST_MB = 4;

export const MAX_FILE_MB = 4;

export const MAX_IMAGE_MB = 15;

export const RESUME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;

export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'] as const;

const archivo = (tipos: readonly string[], etiqueta: string, maxMb: number, formatos: string) =>
  z
    .custom<File>((v) => v instanceof File, 'Attach a file.')
    .refine(
      (f) => f.size === 0 || f.size <= maxMb * 1024 * 1024,
      `${etiqueta} has to be under ${maxMb} MB.`,
    )
    .refine((f) => f.size === 0 || tipos.includes(f.type), `${etiqueta} has to be ${formatos}.`)
    .optional();

const nombre = (campo: string) => z.string().trim().min(2, `Enter your ${campo}.`).max(100, 'Keep this under 100 characters.');
const mail = z.string().trim().email('Enter a valid email.').max(254, 'That email is too long.');
const telefono = z
  .string()
  .trim()
  .max(30, 'That phone number is too long.')
  .refine((v) => v.replace(/\D/g, '').length >= 10, 'Enter a phone number with at least 10 digits.');

const trampa = z.string().max(0).optional().default('');

export const EMPLOYMENT_TYPE = [
  { value: 'part-time', label: 'Part-Time' },
  { value: 'full-time', label: 'Full-Time' },
] as const;

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

export const AVAILABILITY_SLOTS: readonly string[] = DAYS.flatMap((d) =>
  SHIFTS.map((s) => `${d.value}-${s.value}`),
);

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

export const EDU_ROWS = 2;
export const HISTORY_ROWS = 3;

export type TableRow = Readonly<Record<string, string>>;

const tabla = (maxFilas: number) =>
  z
    .array(z.record(z.string(), z.string().trim().max(200, 'Keep each box short.')))
    .max(maxFilas)
    .default([]);

export const jobSchema = z.object({
  position: z.string().trim().min(2, 'What kind of work are you after?').max(200, 'Keep this under 200 characters.'),
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
  address: z.string().trim().min(5, 'Enter your street address.').max(200, 'Keep this under 200 characters.'),
  cityState: z.string().trim().min(2, 'Enter your city and state.').max(200, 'Keep this under 200 characters.'),
  zipcode: z
    .string()
    .trim()
    .regex(/^\d{5}(-\d{4})?$/, 'Enter a 5-digit ZIP code.'),

  license: siNo('Do you have a valid driver license or ID card?'),
  eligible: siNo('Are you eligible for employment in the U.S.?'),
  transport: siNo('Do you have reliable transportation?'),

  education: tabla(EDU_ROWS),
  history: tabla(HISTORY_ROWS),

  startDate: z.string().trim().min(1, 'When could you start?').max(200, 'Keep this under 200 characters.'),

  resume: archivo(RESUME_TYPES, 'Your resume', MAX_FILE_MB, 'a PDF or a Word document'),

  website: trampa,
});

const PARECE_LINK = /^(@[\w.]{2,}|(https?:\/\/)?[^\s/]+\.[^\s]{2,})$/i;

const linkOpcional = (campo: string) =>
  z
    .string()
    .trim()
    .max(300, `That ${campo} is too long.`)
    .refine((v) => v === '' || PARECE_LINK.test(v), 'Paste the full link, or an @username.')
    .optional()
    .default('');

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

export function tableRows(
  formData: FormData,
  prefijo: string,
  cols: readonly { readonly key: string }[],
): TableRow[] {
  const columnas = cols.map((c) => formData.getAll(`${prefijo}.${c.key}`).map(String));
  const alto = Math.max(0, ...columnas.map((c) => c.length));

  const out: TableRow[] = [];
  for (let i = 0; i < alto; i++) {
    const fila: Record<string, string> = {};
    let algo = false;
    cols.forEach((c, j) => {
      const v = (columnas[j]?.[i] ?? '').trim();
      fila[c.key] = v;
      if (v) algo = true;
    });
    if (algo) out.push(fila);
  }
  return out;
}

export function jobFromForm(fd: FormData) {
  return {
    ...Object.fromEntries(fd),
    availability: fd.getAll('availability').map(String),
    education: tableRows(fd, 'edu', EDU_COLS),
    history: tableRows(fd, 'job', HISTORY_COLS),
  };
}

export function artistFromForm(fd: FormData) {
  return Object.fromEntries(fd);
}
