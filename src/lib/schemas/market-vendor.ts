import { z } from 'zod';
import { PRODUCT_CATEGORIES, VENDOR_NEEDS } from '@/content/market';

/**
 * El formulario de vendor del Neighborhood Market.
 *
 * ⚠️ Los desplegables se validan contra LAS MISMAS constantes que renderiza el
 * formulario, así que no se pueden desincronizar: si alguien agrega un rubro
 * en un lado y no en el otro, lo marca TypeScript.
 *
 * ⚠️ `website` acepta una URL o un @handle de Instagram. La mayoría de los
 * makers no tiene sitio, tiene Instagram, y pedirles una URL con `https://`
 * los deja afuera del formulario por una formalidad.
 *
 * ⚠️ `needs` es opcional de verdad: un puesto que no necesita nada del venue
 * es el caso más común y no tiene que tildar nada para poder enviar.
 */
export const marketVendorSchema = z.object({
  business: z.string().trim().min(2, 'Tell us the name of your business.'),
  name: z.string().trim().min(2, 'Enter your name so we know who is writing.'),
  email: z.string().trim().email('Enter a valid email.'),
  phone: z
    .string()
    .trim()
    .refine(
      (v) => v.replace(/\D/g, '').length >= 10,
      'Enter a phone number with at least 10 digits.',
    ),
  website: z
    .string()
    .trim()
    .min(2, 'A website or an Instagram handle, so we can see what you make.'),
  category: z.enum(PRODUCT_CATEGORIES, { message: 'Choose what you sell.' }),
  products: z
    .string()
    .trim()
    .min(20, 'Describe what you sell in a sentence or two, at least.')
    .max(2000, 'Keep it under 2000 characters.'),
  dates: z.string().trim().min(2, 'Tell us which market dates you are after.'),
  /**
   * Casillas múltiples. Un `<input type="checkbox">` repetido llega como
   * varios valores con el mismo nombre, y `Object.fromEntries` se queda con
   * el último: por eso la action lo lee con `getAll` y lo pasa ya unido.
   */
  needs: z
    .array(z.enum(VENDOR_NEEDS.map((n) => n.value) as [string, ...string[]]))
    .optional()
    .default([]),
  insurance: z.enum(['yes', 'no'], { message: 'Let us know if you carry insurance.' }),
  message: z.string().trim().max(2000).optional().default(''),
  website_hp: z.string().max(0).optional().default(''),
});

export type MarketVendorInput = z.infer<typeof marketVendorSchema>;
