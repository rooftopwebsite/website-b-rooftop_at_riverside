import 'server-only';
import { headers } from 'next/headers';
import { BRAND } from './brand';
import { inboxFor, type Inbox } from './inboxes';
import { sendMail, type MailAttachment } from './mail';
import { asuntoSeguro, nombreSeguro, podar } from './saneo';

/**
 * El punto único por donde sale TODO envío de formulario del sitio.
 *
 * ⚠️ DESDE EL 2026-09-23 MANDA DE VERDAD, por Resend. Hasta ese día sólo
 * dejaba un registro en el log y contestaba ok: los cinco formularios le
 * decían «recibido» a la persona y no le llegaba nada a nadie.
 *
 * Por qué una función y no `sendMail` directo en cada action: `lib/mail.ts`
 * manda un mail y nada más. Un envío de formulario es otra cosa —elige buzón,
 * arma el cuerpo, adjunta archivos—, y si cada action llama a `sendMail` a
 * mano, cambiar cualquiera de esas tres cosas significa tocar cinco archivos.
 *
 * ⚠️ A QUIÉN LE LLEGA NO SE DECIDE ACÁ: lo decide `lib/inboxes.ts`. La action
 * dice qué buzón (`events`, `careers`…) y ese archivo lo traduce a direcciones.
 */

export interface Submission {
  /** Qué formulario. Va en el log y en la primera línea del mail. */
  readonly form: 'contact' | 'event-inquiry' | 'market-vendor' | 'musician' | 'job';
  /** A qué buzón. Ver `lib/inboxes.ts`. */
  readonly inbox: Inbox;
  /**
   * Los campos ya validados, con el RÓTULO LEGIBLE como clave y en el orden en
   * que se tienen que leer. Nunca el FormData crudo.
   */
  readonly data: Readonly<Record<string, string>>;
  /** Para poder responder apretando «responder». */
  readonly replyTo?: string;
  readonly subject: string;
  readonly attachments?: readonly MailAttachment[];
}

export interface SubmissionResult {
  readonly ok: boolean;
  /** Mensaje para la persona. Nunca detalles del proveedor. */
  readonly message: string;
}

/**
 * Rate limit básico, en memoria.
 *
 * ⚠️ ES POR INSTANCIA, no global. En Fluid Compute las instancias se reusan
 * entre requests, así que en la práctica frena el caso real —alguien apretando
 * enviar veinte veces— pero no un ataque distribuido. Para eso va el WAF, no
 * esto.
 */
const HITS = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const MAX_CLAVES = 1000;

async function clientKey(): Promise<string> {
  const h = await headers();
  // `x-forwarded-for` en Vercel trae la IP real primero.
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

/**
 * Un `File` del formulario, listo para adjuntar. `null` si no se eligió nada.
 *
 * ⚠️ UN INPUT DE ARCHIVO VACÍO LLEGA COMO UN `File` DE 0 BYTES, no como
 * `undefined`. Sin el chequeo de tamaño, cada envío sin archivo mandaría un
 * adjunto vacío sin nombre.
 *
 * ⚠️ `contentType` PISA AL `f.type` DEL NAVEGADOR CUANDO SE PASA. El `type`
 * del navegador sale de la extensión del archivo, no de su contenido, así que
 * quien llama y ya revisó los bytes (ver `revisarFirmas` en `join.ts`) manda
 * acá el tipo de verdad para que el cliente de mail del destinatario abra el
 * adjunto con el visor correcto.
 */
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

/**
 * El cuerpo del mail, en texto plano.
 *
 * ⚠️ RÓTULO Y VALOR EN LA MISMA LÍNEA, salvo los valores de varios renglones,
 * que van debajo de su rótulo. Quien recibe esto lo lee en el teléfono: una
 * grilla alineada con espacios se descuadra al primer renglón largo.
 */
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

  /*
   * ⚠️ EL REGISTRO QUEDA AUNQUE EL MAIL HAYA SALIDO, y sin los datos: qué
   * formulario, a qué buzón, si salió. Es lo que permite contestar «me dijeron
   * que mandé la consulta y no les llegó» mirando el log de Vercel.
   */
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
