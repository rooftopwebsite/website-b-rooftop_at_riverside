import Link from 'next/link';
import { BRAND } from '@/lib/brand';
import { Facebook, Google, Instagram } from './Icon';

/**
 * La barra de servicio: la franja verde de 40px arriba de todo.
 *
 * Entra con el rediseño `food-truck-club` y ocupa el lugar que había dejado
 * vacante el `PromoBar` —el banner de los cuatro hechos del lugar que Camila
 * mandó sacar—. No es el mismo elemento y conviene que no se confundan: el
 * PromoBar VENDÍA (cuatro claims sobre el lugar), esta barra sólo DESPEJA.
 *
 * ⚠️ QUÉ HACE ACÁ ARRIBA, que es la única pregunta que importa. Son cuatro
 * destinos que no pueden estar en la nav y tampoco pueden estar sólo en el
 * footer:
 *
 *   · Las tres redes. Un bar con música en vivo cinco noches se sigue por
 *     Instagram, no por el sitio. Enterrarlas en el footer es pedirle a la
 *     mitad del tráfico que scrollee una home de nueve secciones.
 *   · Gift Cards. Es el ÚNICO enlace de comercio del sitio —Toast, ver
 *     `BRAND.giftCards`— y es estacional: en diciembre se busca desde arriba.
 *   · FAQ. Absorbe las tres preguntas que si no llegan por teléfono
 *     (estacionamiento, perros, cómo se ordena).
 *
 * Ninguno de los cuatro merece un lugar en la nav principal, que tiene cinco
 * items y ya está llena.
 *
 * ⚠️ SE VA CON EL SCROLL, y es a propósito. El header quedó en flujo normal
 * (ver la nota de `Header.tsx`), así que esta barra sube y no vuelve. Es
 * correcto: son destinos de INTENCIÓN —alguien que ya sabe que quiere una
 * gift card— y no de navegación. Si estuviera fija, 40px de alto se comerían
 * el 5 % de la pantalla de un teléfono para siempre.
 *
 * ⚠️ El contraste. `muted-dark` (#A8C6C4) sobre `deep` da 5.95:1 — pasa AA
 * para cuerpo, y sobra para los 12px en caja alta con tracking que se usan
 * acá. El hover va a `bone`, que da 10.4:1.
 */

const SOCIAL = [
  { label: 'Instagram', href: BRAND.social.instagram, Icon: Instagram },
  { label: 'Facebook', href: BRAND.social.facebook, Icon: Facebook },
  { label: 'Google', href: BRAND.social.google, Icon: Google },
] as const;

export default function UtilityBar() {
  return (
    <div className="bg-deep text-muted-dark">
      <div className="caja-ancha flex h-10 items-center justify-between gap-4">
        <ul className="flex items-center gap-4.5">
          {SOCIAL.map(({ label, href, Icon }) => (
            <li key={label} className="flex">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex transition-colors duration-200 hover:text-bone"
              >
                <Icon className="size-4.25" />
                <span className="sr-only">{label} (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-5.5 font-body text-caption font-medium uppercase tracking-eyebrow">
          <a
            href={BRAND.giftCards}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200 hover:text-bone"
          >
            Gift Cards
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          {/* El punto separador es DECORATIVO: sin `aria-hidden` un lector de
              pantalla lo lee como «punto medio» entre los dos destinos. */}
          <span aria-hidden="true" className="opacity-40">
            ·
          </span>
          <Link href="/faq" className="transition-colors duration-200 hover:text-bone">
            FAQ
          </Link>
        </div>
      </div>
    </div>
  );
}
