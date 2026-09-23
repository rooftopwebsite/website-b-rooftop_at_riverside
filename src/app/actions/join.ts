'use server';

import { publicInbox } from '@/lib/inboxes';
import {
  artistFromForm,
  artistSchema,
  EDU_COLS,
  HISTORY_COLS,
  IMAGE_TYPES,
  jobFromForm,
  jobSchema,
  RESUME_TYPES,
  slotLabel,
  type TableRow,
} from '@/lib/schemas/join';
import { fileToAttachment, rateLimited, sendSubmission } from '@/lib/submissions';
import type { MailAttachment } from '@/lib/mail';
import { getVenue } from '@/lib/venue';
import { tipoDetectado } from '@/lib/file-signature';
import { fieldErrorsFrom, type ActionState } from './types';

function tablaTexto(rows: readonly TableRow[], cols: readonly { key: string; label: string }[]) {
  if (rows.length === 0) return '(none given)';
  return rows
    .map(
      (r, i) =>
        `${i + 1}. ` +
        cols
          .filter((c) => r[c.key])
          .map((c) => `${c.label}: ${r[c.key]}`)
          .join(' · '),
    )
    .join('\n');
}

async function adjuntos(
  campos: readonly {
    readonly file: File | undefined;
    readonly prefijo: string;
    readonly contentType?: string;
  }[],
): Promise<MailAttachment[]> {
  const out: MailAttachment[] = [];
  for (const c of campos) {
    const a = await fileToAttachment(c.file, c.contentType);
    if (a) out.push({ ...a, filename: `${c.prefijo} ${a.filename}` });
  }
  return out;
}

async function revisarFirmas(
  campos: readonly {
    readonly name: string;
    readonly file: File | undefined;
    readonly etiqueta: string;
    readonly formato: string;
    readonly tipos: readonly string[];
  }[],
): Promise<{ errores: Record<string, string>; detectados: Record<string, string> }> {
  const errores: Record<string, string> = {};
  const detectados: Record<string, string> = {};
  for (const c of campos) {
    if (!c.file || c.file.size === 0) continue;
    const cabeza = new Uint8Array(await c.file.slice(0, 16).arrayBuffer());
    const tipo = tipoDetectado(cabeza, c.tipos);
    if (!tipo) {
      errores[c.name] = `${c.etiqueta} doesn't look like ${c.formato}.`;
    } else {
      detectados[c.name] = tipo;
    }
  }
  return { errores, detectados };
}

export async function submitJob(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = jobSchema.safeParse(jobFromForm(formData));
  if (!parsed.success) {
    const fieldErrors = fieldErrorsFrom(parsed.error.issues);
    if (fieldErrors.website) return { status: 'ok', message: 'Thanks. Your application is in.' };
    return {
      status: 'error',
      message: 'Some fields need another look before this can go out.',
      fieldErrors,
    };
  }

  const { errores: firmas, detectados } = await revisarFirmas([
    {
      name: 'resume',
      file: parsed.data.resume,
      etiqueta: 'Your resume',
      formato: 'a PDF or a Word document',
      tipos: RESUME_TYPES,
    },
  ]);
  if (Object.keys(firmas).length > 0) {
    return {
      status: 'error',
      message: 'Some fields need another look before this can go out.',
      fieldErrors: firmas,
    };
  }

  const venue = await getVenue();
  if (await rateLimited()) {
    return {
      status: 'error',
      message: `That is a few applications in a short while. Give it ten minutes, or call ${venue.phone}.`,
    };
  }

  const d = parsed.data;
  const archivos = await adjuntos([
    { file: d.resume, prefijo: 'Resume', contentType: detectados.resume },
  ]);

  const result = await sendSubmission({
    form: 'job',
    inbox: 'careers',
    replyTo: d.email,
    subject: `Job application: ${d.position} (${d.firstName} ${d.lastName})`,
    data: {
      Position: d.position,
      'Employment type': d.employmentType === 'part-time' ? 'Part-Time' : 'Full-Time',
      Availability: d.availability.map(slotLabel).join(', '),
      Name: `${d.firstName} ${d.lastName}`,
      Phone: d.phone,
      Email: d.email,
      Address: d.address,
      'City / State': d.cityState,
      Zipcode: d.zipcode,
      'Valid driver license or ID': d.license === 'yes' ? 'Yes' : 'No',
      'Eligible to work in the U.S.': d.eligible === 'yes' ? 'Yes' : 'No',
      'Reliable transportation': d.transport === 'yes' ? 'Yes' : 'No',
      'Educational background': tablaTexto(d.education, EDU_COLS),
      'Employment history': tablaTexto(d.history, HISTORY_COLS),
      'Expected start date': d.startDate,
      Resume: archivos.length > 0 ? 'Attached' : '(none attached)',
    },
    attachments: archivos,
  });

  const buzon = publicInbox('careers');
  if (!result.ok) {
    return {
      status: 'error',
      message: `We could not send that. Email us at ${buzon} and it gets to the same place.`,
    };
  }

  return {
    status: 'ok',
    message:
      `It went to ${buzon}, and a person reads it.` +
      (archivos.length > 0 ? ' Your resume went along with it.' : ''),
  };
}

export async function submitArtist(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = artistSchema.safeParse(artistFromForm(formData));
  if (!parsed.success) {
    const fieldErrors = fieldErrorsFrom(parsed.error.issues);
    if (fieldErrors.website) return { status: 'ok', message: 'Thanks. Your material is in.' };
    return {
      status: 'error',
      message: 'Some fields need another look before this can go out.',
      fieldErrors,
    };
  }

  const { errores: firmas, detectados } = await revisarFirmas([
    { name: 'logo', file: parsed.data.logo, etiqueta: 'Your logo', formato: 'an image', tipos: IMAGE_TYPES },
    { name: 'photo', file: parsed.data.photo, etiqueta: 'Your photo', formato: 'an image', tipos: IMAGE_TYPES },
  ]);
  if (Object.keys(firmas).length > 0) {
    return {
      status: 'error',
      message: 'Some fields need another look before this can go out.',
      fieldErrors: firmas,
    };
  }

  const venue = await getVenue();
  if (await rateLimited()) {
    return {
      status: 'error',
      message: `That is a few submissions in a short while. Give it ten minutes, or call ${venue.phone}.`,
    };
  }

  const d = parsed.data;
  const acto = d.band || `${d.firstName} ${d.lastName}`;
  const archivos = await adjuntos([
    { file: d.logo, prefijo: 'Logo', contentType: detectados.logo },
    { file: d.photo, prefijo: 'Photo', contentType: detectados.photo },
  ]);

  const result = await sendSubmission({
    form: 'musician',
    inbox: 'booking',
    replyTo: d.email,
    subject: `Booking request: ${acto}`,
    data: {
      Name: `${d.firstName} ${d.lastName}`,
      Email: d.email,
      Phone: d.phone,
      'Band name': d.band || '(not given)',
      'Social media': d.social || '(not given)',
      Genre: d.genre || '(not given)',
      Video: d.video || '(not given)',
    },
    attachments: archivos,
  });

  if (!result.ok) {
    return {
      status: 'error',
      message: `We could not send that. Email us at ${publicInbox('booking')} and it gets to the same place.`,
    };
  }

  return {
    status: 'ok',
    message:
      'We book the stage in the yard most weeks, so we go through these in batches. If it is a fit you will hear from us.',
  };
}
