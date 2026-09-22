'use server';

import {
  artistSchema,
  EDU_COLS,
  HISTORY_COLS,
  jobSchema,
  slotLabel,
  type TableRow,
} from '@/lib/schemas/join';
import { rateLimited, sendSubmission } from '@/lib/submissions';
import { getVenue } from '@/lib/venue';
import { fieldErrorsFrom, type ActionState } from './types';

/**
 * Las dos server actions de `/join-us`.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LOS CAMPOS MÚLTIPLES SE LEEN CON `getAll`. `Object.fromEntries` se queda
 * con el último valor de cada nombre, así que alguien que tilda seis turnos o
 * llena las tres filas del historial laboral habría enviado uno solo. Es el
 * error clásico de las casillas y de las tablas.
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

/**
 * Las tablas del papel, de columnas paralelas a filas.
 *
 * ⚠️ CADA COLUMNA LLEGA COMO UN `name` REPETIDO —`eduDegree` dos veces,
 * `jobCompany` tres— y acá se cruzan por índice: la fila 0 es la primera celda
 * de cada columna. Ver la nota de `schemas/join.ts`.
 *
 * ⚠️ LAS FILAS VACÍAS SE DESCARTAN, y eso incluye las medio vacías al revés:
 * si alguien escribió sólo la empresa, la fila entra con los otros tres campos
 * en blanco. Lo que se tira es la fila donde no se escribió NADA, que es lo
 * normal cuando el papel ofrece tres renglones y la persona tuvo dos trabajos.
 */
function filas(
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

export async function submitJob(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const crudo = {
    ...Object.fromEntries(formData),
    availability: formData.getAll('availability').map(String),
    education: filas(formData, 'edu', EDU_COLS),
    history: filas(formData, 'job', HISTORY_COLS),
  };

  const parsed = jobSchema.safeParse(crudo);
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Some fields need another look before this can go out.',
      fieldErrors: fieldErrorsFrom(parsed.error.issues),
    };
  }
  if (parsed.data.website) return { status: 'ok', message: 'Thanks. Your application is in.' };

  const venue = await getVenue();
  if (await rateLimited()) {
    return {
      status: 'error',
      message: `That is a few applications in a short while. Give it ten minutes, or call ${venue.phone}.`,
    };
  }

  const d = parsed.data;
  const result = await sendSubmission({
    form: 'job',
    to: venue.emailHiring,
    replyTo: d.email,
    subject: `Job application: ${d.position} (${d.firstName} ${d.lastName})`,
    /*
     * ⚠️ LAS CLAVES SIGUEN EL ORDEN DE LA HOJA IMPRESA. Quien recibe los dos
     * canales —el PDF en mano y esto— lee lo mismo en el mismo orden, que es
     * la razón entera por la que el formulario se calcó.
     */
    data: {
      position: d.position,
      employmentType: d.employmentType === 'part-time' ? 'Part-Time' : 'Full-Time',
      availability: d.availability.map(slotLabel).join(', '),
      name: `${d.firstName} ${d.lastName}`,
      phone: d.phone,
      email: d.email,
      address: d.address,
      cityState: d.cityState,
      zipcode: d.zipcode,
      license: d.license === 'yes' ? 'Yes' : 'No',
      eligible: d.eligible === 'yes' ? 'Yes' : 'No',
      transport: d.transport === 'yes' ? 'Yes' : 'No',
      education: tablaTexto(d.education, EDU_COLS),
      history: tablaTexto(d.history, HISTORY_COLS),
      startDate: d.startDate,
      resume: ficha(formData.get('resume')),
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
  const parsed = artistSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Some fields need another look before this can go out.',
      fieldErrors: fieldErrorsFrom(parsed.error.issues),
    };
  }
  if (parsed.data.website) return { status: 'ok', message: 'Thanks. Your material is in.' };

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
  const result = await sendSubmission({
    form: 'musician',
    to: venue.email,
    replyTo: d.email,
    subject: `Booking request: ${acto}`,
    data: {
      name: `${d.firstName} ${d.lastName}`,
      email: d.email,
      phone: d.phone,
      band: d.band || '(not given)',
      social: d.social || '(not given)',
      genre: d.genre || '(not given)',
      video: d.video || '(not given)',
      logo: ficha(formData.get('logo')),
      photo: ficha(formData.get('photo')),
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
