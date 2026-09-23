import { z } from 'zod';
import { CONTACT_REASON_VALUES } from '@/content/contact-reasons';

/**
 * El schema del formulario de contacto.
 *
 * ⚠️ Vive acá y NO adentro de la server action a propósito: el cliente valida
 * con el mismo objeto antes de enviar, así que los mensajes de error son
 * literalmente los mismos texto por texto. Duplicarlos era la forma más fácil
 * de que se desincronizaran.
 *
 * ⚠️ Los mensajes dicen QUÉ hacer, no que algo falló. «Enter a valid email»
 * contra «Invalid email» (se acortó el 2026-09-23: el largo partía la fila). Es la regla de la
 * fase: nunca «algo salió mal».
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name so we know who is writing.').max(100, 'Keep this under 100 characters.'),
  email: z.string().trim().email('Enter a valid email.').max(254, 'That email is too long.'),
  /** Opcional de verdad: vacío pasa, con contenido tiene que parecer un teléfono. */
  phone: z
    .string()
    .trim()
    .max(30, 'That phone number is too long.')
    .refine(
      (v) => v === '' || v.replace(/\D/g, '').length >= 10,
      'Enter a phone number with at least 10 digits, or leave it empty.',
    )
    .optional()
    .default(''),
  reason: z.enum(CONTACT_REASON_VALUES, { message: 'Choose what your message is about.' }),
  message: z
    .string()
    .trim()
    .min(10, 'Tell us a little more, at least a sentence.')
    .max(4000, 'That is longer than we can take. Keep it under 4000 characters.'),
  /**
   * Honeypot. Una persona nunca lo ve ni lo llena; un bot sí. Es la defensa
   * antispam que no le pide nada al usuario, a diferencia de un captcha, que
   * además es una barrera de accesibilidad.
   */
  website: z.string().max(0).optional().default(''),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Del `FormData` al objeto que valida el schema. Lo usan el cliente y la action. */
export function contactFromForm(fd: FormData) {
  return Object.fromEntries(fd);
}
