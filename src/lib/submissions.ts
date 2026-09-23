import 'server-only';
import { headers } from 'next/headers';
import { BRAND } from './brand';
import { inboxFor, type Inbox } from './inboxes';
import { sendMail, type MailAttachment } from './mail';
import { asuntoSeguro, nombreSeguro, podar } from './saneo';

export interface Submission {
  readonly form: 'contact' | 'event-inquiry' | 'market-vendor' | 'musician' | 'job';
  readonly inbox: Inbox;
  readonly data: Readonly<Record<string, string>>;
  readonly replyTo?: string;
  readonly subject: string;
  readonly attachments?: readonly MailAttachment[];
}

export interface SubmissionResult {
  readonly ok: boolean;
  readonly message: string;
}

const HITS = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const MAX_CLAVES = 1000;

async function clientKey(): Promise<string> {
  const h = await headers();
  const fwd = h.get('x-forwarded-for');
  return (fwd ? fwd.split(',')[0]!.trim() : null) ?? h.get('x-real-ip') ?? 'unknown';
}

export async function rateLimited(): Promise<boolean> {
  const key = await clientKey();
  const now = Date.now();
  podar(HITS, now, WINDOW_MS, MAX_CLAVES);
  const recent = (HITS.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    HITS.set(key, recent);
    return true;
  }
  recent.push(now);
  HITS.set(key, recent);
  return false;
}

export async function fileToAttachment(
  f: unknown,
  contentType?: string,
): Promise<MailAttachment | null> {
  if (!(f instanceof File) || f.size === 0) return null;
  return {
    filename: nombreSeguro(f.name),
    content: Buffer.from(await f.arrayBuffer()),
    contentType: contentType ?? (f.type || undefined),
  };
}

const TITULO: Record<Submission['form'], string> = {
  contact: 'Contact form',
  'event-inquiry': 'Private event inquiry',
  'market-vendor': 'Neighborhood Market vendor request',
  musician: 'Booking request (music and entertainment)',
  job: 'Job application',
};

function cuerpo(s: Submission): string {
  const lineas = [`${TITULO[s.form]} · ${BRAND.name} website`, ''];
  for (const [rotulo, valor] of Object.entries(s.data)) {
    if (valor.includes('\n')) lineas.push('', `${rotulo}:`, valor, '');
    else lineas.push(`${rotulo}: ${valor}`);
  }
  if (s.attachments && s.attachments.length > 0) {
    lineas.push('', `Attached: ${s.attachments.map((a) => a.filename).join(', ')}`);
  }
  if (s.replyTo) lineas.push('', `Reply to this email to answer ${s.replyTo} directly.`);
  return lineas.join('\n');
}

export async function sendSubmission(s: Submission): Promise<SubmissionResult> {
  const to = inboxFor(s.inbox);
  const res = await sendMail({
    to,
    subject: asuntoSeguro(s.subject),
    text: cuerpo(s),
    replyTo: s.replyTo,
    attachments: s.attachments,
  });

  console.info(
    JSON.stringify({
      at: new Date().toISOString(),
      event: 'form.submission',
      form: s.form,
      to,
      ok: res.ok,
      attachments: s.attachments?.length ?? 0,
    }),
  );

  return res.ok
    ? { ok: true, message: 'Thanks. Your message is in.' }
    : { ok: false, message: res.message };
}
