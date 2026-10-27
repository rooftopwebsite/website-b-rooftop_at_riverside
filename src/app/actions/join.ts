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
import { detectedType } from '@/lib/file-signature';
import { fieldErrorsFrom, type ActionState } from './types';

function tableText(rows: readonly TableRow[], cols: readonly { key: string; label: string }[]) {
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

async function attachments(
  fields: readonly {
    readonly file: File | undefined;
    readonly prefix: string;
    readonly contentType?: string;
  }[],
): Promise<MailAttachment[]> {
  const out: MailAttachment[] = [];
  for (const c of fields) {
    const a = await fileToAttachment(c.file, c.contentType);
    if (a) out.push({ ...a, filename: `${c.prefix} ${a.filename}` });
  }
  return out;
}

async function checkSignatures(
  fields: readonly {
    readonly name: string;
    readonly file: File | undefined;
    readonly tag: string;
    readonly format: string;
    readonly types: readonly string[];
  }[],
): Promise<{ errors: Record<string, string>; detected: Record<string, string> }> {
  const errors: Record<string, string> = {};
  const detected: Record<string, string> = {};
  for (const c of fields) {
    if (!c.file || c.file.size === 0) continue;
    const head = new Uint8Array(await c.file.slice(0, 16).arrayBuffer());
    const type = detectedType(head, c.types);
    if (!type) {
      errors[c.name] = `${c.tag} doesn't look like ${c.format}.`;
    } else {
      detected[c.name] = type;
    }
  }
  return { errors, detected };
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

  const { errors: signatures, detected } = await checkSignatures([
    {
      name: 'resume',
      file: parsed.data.resume,
      tag: 'Your resume',
      format: 'a PDF or a Word document',
      types: RESUME_TYPES,
    },
  ]);
  if (Object.keys(signatures).length > 0) {
    return {
      status: 'error',
      message: 'Some fields need another look before this can go out.',
      fieldErrors: signatures,
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
  const files = await attachments([
    { file: d.resume, prefix: 'Resume', contentType: detected.resume },
  ]);

  const result = await sendSubmission({
    form: 'job',
    inbox: 'careers',
    replyTo: d.email,
    firstName: d.firstName,
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
      'Educational background': tableText(d.education, EDU_COLS),
      'Employment history': tableText(d.history, HISTORY_COLS),
      'Expected start date': d.startDate,
      Resume: files.length > 0 ? 'Attached' : '(none attached)',
    },
    attachments: files,
  });

  const inbox = publicInbox('careers');
  if (!result.ok) {
    return {
      status: 'error',
      message: `We could not send that. Email us at ${inbox} and it gets to the same place.`,
    };
  }

  return {
    status: 'ok',
    message:
      `It went to ${inbox}, and a person reads it.` +
      (files.length > 0 ? ' Your resume went along with it.' : ''),
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

  const { errors: signatures, detected } = await checkSignatures([
    { name: 'logo', file: parsed.data.logo, tag: 'Your logo', format: 'an image', types: IMAGE_TYPES },
    { name: 'photo', file: parsed.data.photo, tag: 'Your photo', format: 'an image', types: IMAGE_TYPES },
  ]);
  if (Object.keys(signatures).length > 0) {
    return {
      status: 'error',
      message: 'Some fields need another look before this can go out.',
      fieldErrors: signatures,
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
  const act = d.band || `${d.firstName} ${d.lastName}`;
  const files = await attachments([
    { file: d.logo, prefix: 'Logo', contentType: detected.logo },
    { file: d.photo, prefix: 'Photo', contentType: detected.photo },
  ]);

  const result = await sendSubmission({
    form: 'musician',
    inbox: 'booking',
    replyTo: d.email,
    firstName: d.firstName,
    subject: `Booking request: ${act}`,
    data: {
      Name: `${d.firstName} ${d.lastName}`,
      Email: d.email,
      Phone: d.phone,
      'Band name': d.band || '(not given)',
      'Social media': d.social || '(not given)',
      Genre: d.genre || '(not given)',
      Video: d.video || '(not given)',
    },
    attachments: files,
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
