'use server';

import { publicInbox } from '@/lib/inboxes';
import {
  artistFromForm,
  artistSchema,
  EDU_COLS,
  HISTORY_COLS,
  jobFromForm,
  jobSchema,
  slotLabel,
  type TableRow,
} from '@/lib/schemas/join';
import { fileToAttachment, rateLimited, sendSubmission } from '@/lib/submissions';
import type { MailAttachment } from '@/lib/mail';
import { getVenue } from '@/lib/venue';
import { fieldErrorsFrom, type ActionState } from './types';

/**
 * Las dos server actions de `/join-us`.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LOS CAMPOS MÚLTIPLES SE LEEN CON `getAll`, y eso lo hacen `jobFromForm`
 * y `artistFromForm` en `lib/schemas/join.ts`, que son los mismos que usa el
 * navegador para validar antes de enviar.
 *
 * ⚠️ DESDE EL 2026-09-23 LOS ARCHIVOS VIAJAN ADJUNTOS EN EL MAIL. Hasta ese
 * día se validaban y se tiraban, y el mensaje de éxito le pedía a la persona
 * que mandara el CV de nuevo respondiendo el mail. El techo de tamaño lo pone
 * Vercel y está explicado en `MAX_REQUEST_MB`.
 * ══════════════════════════════════════════════════════════════════════════
 */

/**
 * Una tabla, en texto, para el cuerpo del mail.
 *
 * ⚠️ VA CON LOS RÓTULOS DE LA COLUMNA ADELANTE Y NO COMO UNA GRILLA ALINEADA.
 * Quien recibe esto lo lee en un cliente de mail, muchas veces en el teléfono,
 * y una grilla de cuatro columnas con espacios se descuadra al primer renglón
 * largo. Con el rótulo delante de cada dato, cada fila se lee sola.
 */
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

/** Los adjuntos que sí vinieron, con un nombre que se entienda en la bandeja. */
async function adjuntos(
  formData: FormData,
  campos: readonly { readonly name: string; readonly prefijo: string }[],
): Promise<MailAttachment[]> {
  const out: MailAttachment[] = [];
  for (const c of campos) {
    const a = await fileToAttachment(formData.get(c.name));
    if (a) out.push({ ...a, filename: `${c.prefijo} ${a.filename}` });
  }
  return out;
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

  const venue = await getVenue();
  if (await rateLimited()) {
    return {
      status: 'error',
      message: `That is a few applications in a short while. Give it ten minutes, or call ${venue.phone}.`,
    };
  }

  const d = parsed.data;
  const archivos = await adjuntos(formData, [{ name: 'resume', prefijo: 'Resume' }]);

  const result = await sendSubmission({
    form: 'job',
    inbox: 'careers',
    replyTo: d.email,
    subject: `Job application: ${d.position} (${d.firstName} ${d.lastName})`,
    /*
     * ⚠️ LAS CLAVES SIGUEN EL ORDEN DE LA HOJA IMPRESA. Quien recibe los dos
     * canales —el PDF en mano y esto— lee lo mismo en el mismo orden, que es
     * la razón entera por la que el formulario se calcó.
     */
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

  const venue = await getVenue();
  if (await rateLimited()) {
    return {
      status: 'error',
      message: `That is a few submissions in a short while. Give it ten minutes, or call ${venue.phone}.`,
    };
  }

  const d = parsed.data;
  /*
   * ⚠️ EL ASUNTO USA EL NOMBRE DE LA BANDA Y CAE EN EL DE LA PERSONA SI NO
   * HAY. En el formulario del cliente «Band Name» es opcional, así que un
   * solista que no se puso nombre artístico llegaría como «Booking request: »
   * con el asunto cortado a la mitad.
   */
  const acto = d.band || `${d.firstName} ${d.lastName}`;
  const archivos = await adjuntos(formData, [
    { name: 'logo', prefijo: 'Logo' },
    { name: 'photo', prefijo: 'Photo' },
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
