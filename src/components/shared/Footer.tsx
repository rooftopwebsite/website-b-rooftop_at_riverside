import Image from 'next/image';
import Link from 'next/link';
import { BRAND } from '@/lib/brand';
import AgencyBar from './AgencyBar';
import { ButtonLink } from './Button';
import { GUTTER } from './Section';
import { Heading } from './Type';

/**
 * Footer con la estructura compartida de la casa (the-orient, santa-maria,
 * casa-pirul, pretty-hens): columna de identidad a la izquierda y columnas de
 * links a la derecha, con la barra de la agencia al pie.
 *
 * Camila: «el footer no tiene el tipo de estructura que trabajamos en la
 * agencia y falta el footer de la agencia, modifícalo, debe tener la estructura
 * de nuestros proyectos; los horarios y dirección, teléfonos, etc. no van
 * allí».
 *
 * ⚠️ SIN HORARIOS, SIN DIRECCIÓN Y SIN TELÉFONO. Es un pedido explícito y tiene
 * una consecuencia que Camila aceptó sabiéndola: en las 20 rutas que no son la
 * home, `/visit` ni `/contact`, esos datos ya no están en ninguna parte. Se le
 * ofreció la alternativa —convertir `FindUs` en un pre-footer global, como hace
 * the-orient— y eligió esto.
 *
 * ⚠️ SE FUERON dos bloques que estaban acá:
 *   · «Last call», la franja de cierre. Pedido de Camila.
 *   · El formulario de newsletter. No figura en `docs/current-site-inventory.md`
 *     —o sea que la web actual no tiene nada parecido— y el cliente no lo pidió:
 *     «si el cliente no lo pidió y la web actual no tiene nada similar, no lo
 *     pongamos». Con él se fue `subscribeToNewsletter` de `app/actions.ts`.
 *
 * ⚠️ NO hay links legales en la franja inferior. El sitio todavía no tiene
 * páginas de privacidad, términos ni cookies: poner los links ahora sería
 * mandar a un 404. Cuando existan, van en la franja de abajo, al lado del
 * copyright.
 */

/** Lo que pasa EN el lugar: cómo comés, qué ves, qué alquilás. */
const LINKS_LUGAR = [
  { label: 'Sunset Bar', href: '/sunset-bar' },
  { label: 'Food Trucks', href: '/food-trucks' },
  { label: 'The Yard', href: '/the-yard' },
  { label: "What's On", href: '/whats-on' },
  { label: 'The Market', href: '/market' },
] as const;

/** La vertical que factura, con sus puertas de entrada. */
const LINKS_EVENTOS = [
  { label: 'Private Events', href: '/events' },
  { label: 'Event Spaces', href: '/events/spaces' },
  { label: 'Corporate', href: '/events/corporate' },
  { label: 'Holiday Parties', href: '/events/holiday-parties' },
  { label: 'Request a Proposal', href: '/events/inquire' },
] as const;

/**
 * Conocernos y lo práctico.
 *
 * ⚠️ `/visit` y `/contact` están acá y NO en una columna de datos: los datos
 * salieron del footer, pero las páginas que los tienen siguen a un clic. Es la
 * única compensación honesta que admite el pedido.
 */
const LINKS_CONOCERNOS = [
  { label: 'Our Story', href: '/our-story' },
  { label: 'The Experience', href: '/the-experience' },
  { label: 'Visit Us', href: '/visit' },
  { label: 'Contact', href: '/contact' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Join Us', href: '/join-us' },
] as const;

const COLUMNAS = [
  { titulo: 'The place', links: LINKS_LUGAR },
  { titulo: 'Events', links: LINKS_EVENTOS },
  { titulo: 'Get to know us', links: LINKS_CONOCERNOS },
] as const;

/**
 * ⚠️ En MAYÚSCULAS, como el header, con el interletrado que las mayúsculas
 * necesitan para no apretarse.
 */
const LINK_BASE =
  'block py-[7px] font-body text-[14px] leading-[1.4] tracking-[0.08em] uppercase text-paper/70 transition-colors duration-200 hover:text-paper';

export default function Footer() {
  return (
    <footer className="bg-deep text-paper">
      <div className={GUTTER}>
        <div className="caja grid gap-[48px] py-[64px] desk:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] desk:gap-[64px] desk:py-[80px]">
          {/* ── Identidad ────────────────────────────────────────────── */}
          <div className="flex flex-col items-center gap-[20px] text-center desk:items-start desk:text-left">
            <Link href="/" aria-label={`${BRAND.name} — home`}>
              <Image
                src="/brand/logo-reversed.svg"
                alt=""
                width={303}
                height={322}
                className="h-[76px] w-auto"
              />
              <span className="sr-only">{BRAND.name}</span>
            </Link>

            <p className="max-w-[34ch] text-[15px] leading-[1.6] text-paper/80">
              A rooftop bar over a curated food truck park, in downtown Bonita Springs.
            </p>

            <ButtonLink href="/events/inquire" variant="onDark">
              Plan an event
            </ButtonLink>

            <ul className="flex items-center gap-[10px]">
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
          </div>

          {/* ── Las tres columnas de links ───────────────────────────── */}
          <nav
            aria-label="Footer"
            className="grid gap-[36px] sm:grid-cols-3 sm:gap-[24px]"
          >
            {COLUMNAS.map(({ titulo, links }) => (
              <div
                key={titulo}
                className="flex flex-col items-center text-center sm:items-start sm:text-left"
              >
                <Heading level={2} role="label" className="text-paper">
                  {titulo}
                </Heading>
                {/* El filete corto bajo el rótulo: es el remate de la casa, y en
                    naranja porque es decorativo y no le debe contraste a nadie. */}
                <span aria-hidden="true" className="mt-[10px] block h-[2px] w-[28px] bg-sunset" />
                <ul className="mt-[12px] flex flex-col">
                  {links.map(({ label, href }) => (
                    <li key={href}>
                      <Link href={href} className={LINK_BASE}>
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Franja inferior ──────────────────────────────────────────── */}
      <div className="border-t border-paper/15">
        <div className={GUTTER}>
          <div className="caja flex flex-col items-center justify-between gap-[10px] py-[20px] text-[13px] text-paper/60 sm:flex-row">
            <p>
              © {new Date().getFullYear()} {BRAND.name}. {BRAND.group}.
            </p>
            <p>Bonita Springs, Florida</p>
          </div>
        </div>
      </div>

      {/* La barra de la agencia trae su propio fondo claro: cierra el sitio y
          no pertenece al bloque oscuro de arriba. */}
      <AgencyBar />
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  readonly href: string;
  readonly label: string;
  readonly children: React.ReactNode;
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
