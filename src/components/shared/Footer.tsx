import Image from 'next/image';
import Link from 'next/link';
import { BRAND, HAPPY_HOUR, HOURS, addressLine, mapsUrl } from '@/lib/brand';
import { FOOTER_QUICK_LINKS, NAV_CTA } from '@/lib/nav';
import { ButtonLink, ExternalIcon } from './Button';
import { GUTTER } from './Section';
import { Eyebrow, Heading } from './Type';
import NewsletterForm from './NewsletterForm';

/**
 * Footer, en cuatro columnas.
 *
 *   1. logo + una línea de posicionamiento + redes (IG, FB, Google)
 *   2. contacto — dirección, teléfono, info@, botón de direcciones
 *   3. horarios — LOS DOS SETS, barra y trucks, en filas separadas
 *   4. quick links
 *   franja inferior: legales + badge de Resto Experience
 *
 * ⚠️ `events@eatdrinkparadise.com` NO va acá. Vive sólo en el hub de eventos y
 * en /contact: una consulta de $20.000 no puede caer en el mismo buzón que una
 * pregunta sobre estacionamiento.
 *
 * ⚠️ Va sobre `#014545`, que junto con la sección del Sunset Bar es la única
 * superficie oscura grande del sitio. Todo el texto va en papel (10.83:1) o
 * crema (9.44:1).
 *
 * ⚠️ La columna 3 es donde el footer hace trabajo de POSICIONAMIENTO: mostrar
 * los dos horarios uno al lado del otro dice «bar y trucks son cosas distintas»
 * sin una sola línea de copy explicándolo.
 */
export default function Footer() {
  return (
    <footer className="on-dark bg-deep text-paper">
      {/* ── Last call ──────────────────────────────────────────────────── */}
      <div className={`${GUTTER} pt-band-sm pb-[48px] lg:pt-band lg:pb-[64px]`}>
        <div className="caja">
          <div className="flex flex-col gap-[36px] lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[620px]">
              <Eyebrow tone="cream">Last call</Eyebrow>
              <Heading level={2} className="mt-gap-kicker text-d4 lg:text-d2">
                The sun sets at 7. <br className="hidden sm:block" />
                We stay open a lot later.
              </Heading>
            </div>
            <div className="flex flex-wrap gap-[12px]">
              <ButtonLink href={NAV_CTA.primary.href} variant="primary" size="lg">
                Plan an Event
              </ButtonLink>
              <ButtonLink href="/whats-on" variant="onDark" size="lg">
                What&rsquo;s On
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>

      {/* ── Newsletter ─────────────────────────────────────────────────── */}
      <div className={`${GUTTER} border-t border-paper/15 py-[48px]`}>
        <div className="caja">
          <div className="grid gap-[28px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-[64px]">
            <div>
              <Heading level={2} className="text-d5">
                Get on the list
              </Heading>
              <p className="mt-[10px] max-w-[46ch] text-[15px] leading-[1.6] text-paper/75">
                What&rsquo;s playing this weekend, which trucks are in, and the first word when
                season starts back up in December.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* ── Las cuatro columnas ────────────────────────────────────────── */}
      <div className={`${GUTTER} border-t border-paper/15 py-[52px]`}>
        <div className="caja grid gap-[40px] sm:grid-cols-2 desk:grid-cols-4 desk:gap-[40px]">
          {/* 1 — Identidad */}
          <div className="flex flex-col gap-[18px]">
            {/*
              ⚠️ ASSET FALTANTE: no tenemos versión REVERSADA del lockup, y el
              logo a color no se lee sobre #014545 — el wordmark es negro.
              `brightness-0 invert` lo pasa a blanco puro: se lee, pero pierde
              el aro naranja y la onda teal.
              Es una solución de compromiso hasta que llegue el lockup en
              blanco del brand book. NO es recrear el asset con CSS: es un
              filtro sobre el archivo real.
            */}
            <Image
              src="/brand/logo-lockup.png"
              alt=""
              width={200}
              height={212}
              className="h-auto w-[112px] brightness-0 invert"
            />
            <p className="max-w-[30ch] text-[15px] leading-[1.6] text-paper/80">
              A rooftop bar over a curated food truck park, in downtown Bonita Springs.
            </p>
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

          {/* 2 — Contacto */}
          <div>
            <Heading level={3} role="label" className="text-paper">
              Come by
            </Heading>
            <span aria-hidden="true" className="mt-[10px] block h-[2px] w-[28px] bg-sunset" />
            <address className="mt-[16px] flex flex-col gap-[8px] text-[15px] not-italic leading-[1.6]">
              <span className="text-paper/80">
                {BRAND.address.street}
                <br />
                {BRAND.address.locality}, {BRAND.address.region} {BRAND.address.postalCode}
              </span>
              <a href={BRAND.contact.phoneHref} className="link-texto text-paper/80">
                {BRAND.contact.phone}
              </a>
              <a href={`mailto:${BRAND.contact.email}`} className="link-texto break-all text-paper/80">
                {BRAND.contact.email}
              </a>
            </address>
            <div className="mt-[18px]">
              <ButtonLink href={mapsUrl()} variant="onDark" external>
                Get directions
              </ButtonLink>
            </div>
          </div>

          {/* 3 — Horarios, los DOS sets */}
          <div>
            <Heading level={3} role="label" className="text-paper">
              Hours
            </Heading>
            <span aria-hidden="true" className="mt-[10px] block h-[2px] w-[28px] bg-sunset" />

            <table className="mt-[16px] w-full border-collapse text-[13px]">
              <caption className="sr-only">
                Opening hours. The bar and the food trucks keep different hours.
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="pb-[6px] text-left eyebrow text-[10px] text-paper/70">
                    Day
                  </th>
                  <th scope="col" className="pb-[6px] text-left eyebrow text-[10px] text-paper/70">
                    Bar
                  </th>
                  <th scope="col" className="pb-[6px] text-left eyebrow text-[10px] text-paper/70">
                    Trucks
                  </th>
                </tr>
              </thead>
              <tbody>
                {HOURS.map((h) => (
                  <tr key={h.day} className="border-t border-paper/10">
                    <th
                      scope="row"
                      className="py-[6px] pr-[8px] text-left font-bold whitespace-nowrap text-paper/90"
                    >
                      {h.day.slice(0, 3)}
                    </th>
                    <td className="py-[6px] pr-[8px] tabular-nums whitespace-nowrap text-paper/70">
                      {h.bar === 'Closed' ? '—' : h.bar.replace(/:00/g, '').replace(/\s/g, '')}
                    </td>
                    <td className="py-[6px] tabular-nums whitespace-nowrap text-paper/70">
                      {h.trucks === 'Closed' ? '—' : h.trucks.replace(/:00/g, '').replace(/\s/g, '')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="mt-[14px] text-[13px] leading-[1.5] text-paper/70">
              <span className="eyebrow text-[10px] text-cream">Happy hour</span>
              <br />
              {HAPPY_HOUR.days}, {HAPPY_HOUR.time}
              <br />
              {HAPPY_HOUR.deals.join(' · ')}
            </p>
          </div>

          {/* 4 — Quick links */}
          <div>
            <Heading level={3} role="label" className="text-paper">
              Quick links
            </Heading>
            <span aria-hidden="true" className="mt-[10px] block h-[2px] w-[28px] bg-sunset" />
            <nav aria-label="Quick links">
              <ul className="mt-[16px] flex flex-col gap-[8px]">
                {FOOTER_QUICK_LINKS.map((l) => {
                  // `GIFT_CARDS` es un centinela: la URL real vive en `brand.ts`
                  // y no se duplica en la config de navegación.
                  const href = l.href === 'GIFT_CARDS' ? BRAND.giftCards : l.href;
                  return (
                    <li key={l.label}>
                      {l.external ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-texto inline-flex items-center gap-[6px] text-[15px] text-paper/80"
                        >
                          {l.label}
                          <ExternalIcon />
                          <span className="sr-only">(opens in a new tab)</span>
                        </a>
                      ) : (
                        <Link href={href} className="link-texto text-[15px] text-paper/80">
                          {l.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* ── Franja inferior ────────────────────────────────────────────── */}
      <div className="border-t border-paper/15">
        <div className={GUTTER}>
          <div className="caja flex flex-col items-center justify-between gap-[12px] py-[22px] text-[13px] text-paper/60 sm:flex-row">
            <p>
              © {new Date().getFullYear()} {BRAND.name}. {BRAND.group}.
            </p>
            <p>
              Content, marketing &amp; web design by{' '}
              <a
                href={BRAND.credit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-texto"
              >
                {BRAND.credit.label}
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </p>
          </div>
        </div>
      </div>
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
