'use server';

import { artistSchema, jobSchema } from '@/lib/schemas/join';
import { rateLimited, sendSubmission } from '@/lib/submissions';
import { getVenue } from '@/lib/venue';
import { fieldErrorsFrom, type ActionState } from './types';

/**
 * Las dos server actions de `/join-us`.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LOS CAMPOS MÚLTIPLES SE LEEN CON `getAll`. `Object.fromEntries` se queda
 * con el último valor de cada nombre, así que alguien que tilda tres turnos o
 * pega tres links habría enviado uno solo. Es el error clásico de las casillas
 * y de los campos repetibles.
 *
 * ⚠️ EL ARCHIVO SE VALIDA PERO TODAVÍA NO SE GUARDA EN NINGUNA PARTE. No hay
 * destino de envío definido (ver `lib/submissions.ts`), así que del archivo se
 * registra el nombre, el peso y el tipo, y se le dice a la persona que lo
 * vamos a pedir por mail. **Mentirle diciendo «recibido» cuando el archivo se
 * descarta en el servidor sería peor que pedirlo dos veces.**
 * TODO: confirmar con cliente a dónde van los adjuntos y guardarlos ahí.
 * ══════════════════════════════════════════════════════════════════════════
 */

/** Del `File` sale sólo metadata legible, nunca el contenido. */
function ficha(f: unknown): string {
  if (!(f instanceof File) || f.size === 0) return '(none attached)';
  const mb = (f.size / (1024 * 1024)).toFixed(2);
  return `${f.name} (${mb} MB, ${f.type})`;
}

export async function submitJob(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const crudo = {
    ...Object.fromEntries(formData),
    availability: formData.getAll('availability').map(String),
  };

  const parsed = jobSchema.safeParse(crudo);
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Some fields need another look before this can go out.',
      fieldErrors: fieldErrorsFrom(parsed.error.issues),
    };
  }
  if (parsed.data.website_hp) return { status: 'ok', message: 'Thanks. Your application is in.' };

  const venue = await getVenue();
  if (await rateLimited()) {
    return {
      status: 'error',
      message: `That is a few applications in a short while. Give it ten minutes, or call ${venue.phone}.`,
    };
  }

  const result = await sendSubmission({
    form: 'job',
    to: venue.emailHiring,
    replyTo: parsed.data.email,
    subject: `Job application: ${parsed.data.position}`,
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      position: parsed.data.position,
      availability: parsed.data.availability.join(', '),
      experience: parsed.data.experience,
      resume: ficha(formData.get('resume')),
      heard: parsed.data.heard,
      message: parsed.data.message || '(none)',
    },
  });

  if (!result.ok) {
    return {
      status: 'error',
      message: `We could not send that. Email us at ${venue.emailHiring} and it gets to the same place.`,
    };
  }

  return {
    status: 'ok',
    message: `It went to ${venue.emailHiring}, and a person reads it. If your resume did not go through, reply to our email with it attached.`,
  };
}

export async function submitArtist(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const crudo = {
    ...Object.fromEntries(formData),
    // Los campos repetibles vacíos se descartan antes de validar: es normal
    // que alguien llene uno de los tres.
    links: formData
      .getAll('links')
      .map(String)
      .map((l) => l.trim())
      .filter(Boolean),
  };

  const parsed = artistSchema.safeParse(crudo);
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Some fields need another look before this can go out.',
      fieldErrors: fieldErrorsFrom(parsed.error.issues),
    };
  }
  if (parsed.data.website_hp) return { status: 'ok', message: 'Thanks. Your material is in.' };

  const venue = await getVenue();
  if (await rateLimited()) {
    return {
      status: 'error',
      message: `That is a few submissions in a short while. Give it ten minutes, or call ${venue.phone}.`,
    };
  }

  const result = await sendSubmission({
    form: 'musician',
    to: venue.email,
    replyTo: parsed.data.email,
    subject: `Booking request: ${parsed.data.act} (${parsed.data.discipline})`,
    data: {
      act: parsed.data.act,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      discipline: parsed.data.discipline,
      genre: parsed.data.genre,
      links: parsed.data.links.join('  |  '),
      setLength: parsed.data.setLength,
      lineup: parsed.data.lineup,
      availability: parsed.data.availability,
      fee: parsed.data.fee || '(not given)',
      presskit: ficha(formData.get('presskit')),
      message: parsed.data.message || '(none)',
    },
  });

  if (!result.ok) {
    return {
      status: 'error',
      message: `We could not send that. Email us at ${venue.email} and it gets to the same place.`,
    };
  }

  return {
    status: 'ok',
    message:
      'We book the stage in the yard most weeks, so we go through these in batches. If it is a fit you will hear from us.',
  };
}
