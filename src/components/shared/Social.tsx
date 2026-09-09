import type { ReactNode } from 'react';
import { BRAND } from '@/lib/brand';

/**
 * Los enlaces a las redes, en su fila de píldoras.
 *
 * ⚠️ Vivían PRIVADOS dentro de `Footer.tsx`. Salieron acá porque la sección
 * «Find us» los necesita también —Camila lo pidió mirando el bloque de contacto
 * de Luci's, que lleva el grupo FOLLOW— y duplicar cuatro paths de SVG a mano
 * es la forma más segura de que un día el ícono de Facebook del pie y el de la
 * sección dejen de ser el mismo dibujo.
 *
 * ⚠️ TikTok NO está y no se agrega. `BRAND.social.tiktok` es `null` a
 * propósito: el cliente no tiene cuenta, y un ícono que lleva a una búsqueda o
 * a un handle inventado es peor que no tenerlo. Google Business sí, porque la
 * ficha existe y está vinculada por `cid`.
 *
 * ⚠️ Sólo va sobre superficie OSCURA. Los colores están escritos contra `deep`
 * —`border-paper/35`, `text-paper/80`— y sobre claro serían invisibles. Si
 * alguna vez hace falta en claro, va una variante por superficie como en
 * `PinnedList`, no un override desde afuera.
 */
export function SocialLinks({ className = '' }: { readonly className?: string }) {
  return (
    <ul className={['flex items-center gap-[10px]', className].filter(Boolean).join(' ')}>
      <li>
        <SocialLink href={BRAND.social.instagram} label="Instagram">
          <path d="M12 2.2c3.2 0 3.6 0 4.8.07 1.2.05 1.8.25 2.2.42.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.17.4.37 1 .42 2.2.07 1.2.07 1.6.07 4.8s0 3.6-.07 4.8c-.05 1.2-.25 1.8-.42 2.2a3.8 3.8 0 0 1-.9 1.4c-.4.4-.8.7-1.4.9-.4.17-1 .37-2.2.42-1.2.07-1.6.07-4.8.07s-3.6 0-4.8-.07c-1.2-.05-1.8-.25-2.2-.42a3.8 3.8 0 0 1-1.4-.9 3.8 3.8 0 0 1-.9-1.4c-.17-.4-.37-1-.42-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.8c.05-1.2.25-1.8.42-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.17 1-.37 2.2-.42C8.4 2.2 8.8 2.2 12 2.2Zm0 5.3a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm0 7.4a2.9 2.9 0 1 1 0-5.8 2.9 2.9 0 0 1 0 5.8Zm5.7-7.6a1.05 1.05 0 1 1-2.1 0 1.05 1.05 0 0 1 2.1 0Z" />
        </SocialLink>
      </li>
      <li>
        <SocialLink href={BRAND.social.facebook} label="Facebook">
          <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z" />
        </SocialLink>
      </li>
      <li>
        <SocialLink href={BRAND.social.google} label="Google Business Profile">
          <path d="M21.8 12.2c0-.7-.06-1.4-.18-2H12v3.9h5.5a4.7 4.7 0 0 1-2 3.1v2.6h3.2c1.9-1.7 3-4.3 3-7.5Z" />
          <path d="M12 22c2.7 0 5-.9 6.7-2.4l-3.2-2.5a6 6 0 0 1-9-3.2H3.1v2.6A10 10 0 0 0 12 22Z" />
          <path d="M6.5 13.9a6 6 0 0 1 0-3.8V7.5H3.1a10 10 0 0 0 0 9l3.4-2.6Z" />
          <path d="M12 6a5.4 5.4 0 0 1 3.8 1.5l2.9-2.9A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.9 5.5l3.4 2.6A6 6 0 0 1 12 6Z" />
        </SocialLink>
      </li>
    </ul>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  readonly href: string;
  readonly label: string;
  readonly children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="grid h-[44px] w-[44px] place-items-center rounded-pill border border-paper/35 text-paper/80 transition-colors duration-250 hover:border-cream hover:bg-cream hover:text-deep"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        {children}
      </svg>
      <span className="sr-only">{label} (opens in a new tab)</span>
    </a>
  );
}
