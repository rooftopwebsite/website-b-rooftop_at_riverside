import Image from 'next/image';
import Link from 'next/link';
import { BRAND, HAPPY_HOUR, HOURS, addressLine, mapsUrl } from '@/lib/brand';
import { FOOTER_NAV, NAV_CTA } from '@/lib/nav';
import { ButtonLink } from './Button';
import OpenStatus from './OpenStatus';
import { GUTTER } from './Section';
import TilePattern from './TilePattern';
import { Eyebrow, Heading } from './Type';
import NewsletterForm from './NewsletterForm';

/**
 * Footer.
 *
 * Estructura de Showdown Social (docs/house-tokens.md §6), que es la que ya
 * integra el Last Call y la captura de email — exactamente lo que el brief pide
 * para el cierre del home.
 *
 * Orden: cierre doble → newsletter → identidad y contacto → 3 columnas →
 * horarios → legal → barra de agencia.
 *
 * ⚠️ Va en `deep` #014545, que es uno de los dos únicos lugares donde el brief
 * permite la superficie oscura (el otro es la sección del Sunset Bar).
 * Todo el texto de acá va en papel (10.83:1) o crema (9.44:1).
 *
 * ⚠️ Los DOS sets de horarios van completos en el footer. Es el dato que más se
 * consulta y la diferencia entre barra y trucks es la fuente de confusión número
 * uno del negocio.
 */
export default function Footer() {
  return (
    <footer className="on-dark bg-deep text-paper">
      {/* ── Last call: el cierre doble ─────────────────────────────────── */}
      <div className={`${GUTTER} pt-band-sm pb-[56px] lg:pt-band lg:pb-[72px]`}>
        <div className="caja">
          <div className="flex flex-col gap-[40px] lg:flex-row lg:items-end lg:justify-between">
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

      <TilePattern tone="river" height="h-[24px]" />

      {/* ── Newsletter ─────────────────────────────────────────────────── */}
      <div className={`${GUTTER} py-[56px]`}>
        <div className="caja">
          <div className="grid gap-[32px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-[64px]">
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

      <div className={GUTTER}>
        <div className="caja">
          <div className="h-px w-full bg-paper/15" />
        </div>
      </div>

      {/* ── Identidad + columnas ───────────────────────────────────────── */}
      <div className={`${GUTTER} py-[56px]`}>
        <div className="caja flex flex-col gap-[48px] desk:flex-row desk:justify-between desk:gap-[64px]">
          {/* Identidad y contacto */}
          <div className="flex max-w-[320px] flex-col gap-[20px]">
            <Image
              src="/brand/logo-lockup.png"
              alt=""
              width={200}
              height={212}
              className="h-auto w-[130px]"
            />
            <p className="text-[15px] leading-[1.6] text-paper/75">
              A rooftop bar over a curated food truck park, in downtown Bonita Springs.
            </p>
            <address className="flex flex-col gap-[6px] text-[15px] not-italic leading-[1.6]">
              <a href={mapsUrl()} target="_blank" rel="noopener noreferrer" className="link-texto">
                {addressLine()}
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <a href={BRAND.contact.phoneHref} className="link-texto">
                {BRAND.contact.phone}
              </a>
              <a href={`mailto:${BRAND.contact.email}`} className="link-texto">
                {BRAND.contact.email}
              </a>
            </address>
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
            </ul>
          </div>

          {/* Tres columnas */}
          <div className="grid grid-cols-1 gap-[32px] sm:grid-cols-3 desk:gap-[56px]">
            {FOOTER_NAV.map((col) => (
              <div key={col.title}>
                <Heading level={3} role="label" className="text-paper">
                  {col.title}
                </Heading>
                <span aria-hidden="true" className="mt-[10px] block h-[2px] w-[28px] bg-sunset" />
                <nav aria-label={col.title}>
                  <ul className="mt-[14px] flex flex-col gap-[8px]">
                    {col.links.map((l) => (
                      <li key={l.href}>
                        <Link href={l.href} className="text-[15px] text-paper/75 link-texto">
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Los dos sets de horarios ───────────────────────────────────── */}
      <div className={GUTTER}>
        <div className="caja">
          <div className="h-px w-full bg-paper/15" />
        </div>
      </div>

      <div className={`${GUTTER} py-[48px]`}>
        <div className="caja">
          <div className="flex flex-col gap-[8px] sm:flex-row sm:items-baseline sm:justify-between">
            <Heading level={2} role="label" className="text-paper">
              Hours
            </Heading>
            <OpenStatus which="bar" className="text-paper/80" />
          </div>

          {/* Tabla real: son dos columnas de datos por fila y una lista no lo
              comunica. El scroll horizontal vive en su propio contenedor. */}
          <div className="mt-[20px] overflow-x-auto" tabIndex={0} role="region" aria-label="Opening hours, scrollable">
            <table className="w-full min-w-[440px] border-collapse text-[15px]">
              <caption className="sr-only">
                Opening hours for the bar and the food trucks
              </caption>
              <thead>
                <tr className="border-b border-paper/20">
                  <th scope="col" className="py-[8px] pr-[16px] text-left eyebrow text-paper/60">
                    Day
                  </th>
                  <th scope="col" className="py-[8px] pr-[16px] text-left eyebrow text-paper/60">
                    Sunset Bar
                  </th>
                  <th scope="col" className="py-[8px] text-left eyebrow text-paper/60">
                    Food Trucks
                  </th>
                </tr>
              </thead>
              <tbody>
                {HOURS.map((h) => (
                  <tr key={h.day} className="border-b border-paper/10 last:border-0">
                    <th scope="row" className="py-[9px] pr-[16px] text-left font-bold">
                      {h.day}
                    </th>
                    <td className="py-[9px] pr-[16px] text-paper/80">{h.bar}</td>
                    <td className="py-[9px] text-paper/80">{h.trucks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-[18px] text-[15px] text-paper/80">
            <span className="eyebrow text-cream">Happy hour</span>{' '}
            <span className="ml-[6px]">
              {HAPPY_HOUR.days}, {HAPPY_HOUR.time} — {HAPPY_HOUR.deals.join(' · ')}
            </span>
          </p>
        </div>
      </div>

      {/* ── Legal + agencia ────────────────────────────────────────────── */}
      <div className="border-t border-paper/15">
        <div className={GUTTER}>
          <div className="caja flex flex-col items-center justify-between gap-[12px] py-[24px] text-[13px] text-paper/60 sm:flex-row">
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
      <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        {children}
      </svg>
      <span className="sr-only">{label} (opens in a new tab)</span>
    </a>
  );
}
