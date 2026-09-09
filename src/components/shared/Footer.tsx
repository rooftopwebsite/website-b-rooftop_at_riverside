import Image from 'next/image';
import Link from 'next/link';
import { BRAND } from '@/lib/brand';
import AgencyBar from './AgencyBar';
import { ButtonLink } from './Button';
import { GUTTER } from './Section';
import { SocialLinks } from './Social';
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
  'block py-[7px] font-body text-[15px] leading-[1.4] tracking-[0.08em] uppercase text-paper/70 transition-colors duration-200 hover:text-paper';

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

            <p className="max-w-[34ch] text-[16px] leading-[1.6] text-paper/80">
              A rooftop bar over a curated food truck park, in downtown Bonita Springs.
            </p>

            <ButtonLink href="/events/inquire" variant="onDark">
              Plan an event
            </ButtonLink>

            <SocialLinks />
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

