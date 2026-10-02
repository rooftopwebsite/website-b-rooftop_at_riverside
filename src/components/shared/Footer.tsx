import Image from 'next/image';
import Link from 'next/link';
import { SITE_LEGAL_DOCS } from '@/content/legal-docs';
import { BRAND } from '@/lib/brand';
import { CAJA_ALTA_CLS } from '@/lib/flags';
import { sinBlog } from '@/lib/nav';
import AgencyBar from './AgencyBar';
import { ButtonLink } from './Button';
import NewsletterSignup from './NewsletterSignup';
import { GUTTER } from './Section';
import { SocialLinks } from './Social';
import { Heading } from './Type';

type FooterLink = { label: string; href: string; external?: boolean };

const LINKS_LUGAR: readonly FooterLink[] = [
  { label: 'Sunset Bar', href: '/sunset-bar' },
  { label: 'Food Trucks', href: '/food-trucks' },
  { label: "What's On", href: '/whats-on' },
  { label: 'The Market', href: '/market' },
];

const LINKS_EVENTOS: readonly FooterLink[] = [
  { label: 'Private Events', href: '/events' },
  { label: 'Request a Proposal', href: '/events#inquire' },
] as const;

const LINKS_CONOCERNOS: readonly FooterLink[] = [
  { label: 'About', href: '/our-story' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
  { label: 'Join Us', href: '/join-us' },
  { label: 'Gift Cards', href: BRAND.giftCards, external: true },
] as const;

const LEGALES = SITE_LEGAL_DOCS;

const COLUMNAS = [
  { titulo: 'The place', links: LINKS_LUGAR },
  { titulo: 'Events', links: LINKS_EVENTOS },
  { titulo: 'Get to know us', links: LINKS_CONOCERNOS },
] as const;

const LINK_BASE =
  `block py-1.75 font-body text-base font-bold leading-[1.4] text-paper/70 transition-colors duration-200 hover:text-paper ${CAJA_ALTA_CLS}`;

export default function Footer({ hasBlog }: { readonly hasBlog: boolean }) {
  const columnas = hasBlog ? COLUMNAS : COLUMNAS.map((c) => ({ ...c, links: sinBlog(c.links) }));

  return (
    <footer className="relative z-[4] banda-arco bg-deep grano text-paper on-dark">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-t-band"
      >
        <div className="absolute inset-0 bg-[url('/brand/clouds.webp')] bg-cover bg-center opacity-22 mix-blend-multiply" />
        <div className="absolute -right-16 bottom-0 aspect-[1100/1024] w-[34rem] bg-deeper opacity-55 [mask-image:url('/brand/palms.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] sm:w-[44rem] lg:-right-20 lg:w-[56rem]" />
      </div>
      <div className="relative z-[1]">
        <div id="stay-in-touch" className="caja-ancha scroll-mt-24 pt-14 desk:pt-20">
          <NewsletterSignup />
        </div>

        <div className="caja-ancha grid gap-12 py-16 desk:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] desk:gap-16 desk:py-20">
          <div className="flex flex-col items-center gap-5 text-center desk:items-start desk:text-left">
            <Link href="/" aria-label={`${BRAND.name} home`}>
              <Image
                src="/brand/logo-reversed.svg"
                alt=""
                width={303}
                height={322}
                className="h-19 w-auto"
              />
              <span className="sr-only">{BRAND.name}</span>
            </Link>

            <p className="max-w-[34ch] text-base text-paper/80">
              A rooftop bar over a curated food truck park, in downtown Bonita Springs.
            </p>

            <ButtonLink href="/events#inquire" variant="onDark">
              Plan an event
            </ButtonLink>

            <SocialLinks />
          </div>
          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 sm:gap-6"
          >
            {columnas.map(({ titulo, links }, i) => (
              <div
                key={titulo}
                className={[
                  'flex flex-col items-center text-center sm:items-start sm:text-left',
                  i === columnas.length - 1 && columnas.length % 2 === 1 ? 'col-span-2 sm:col-span-1' : '',
                ].join(' ')}
              >
                <Heading level={2} role="label" className="text-paper">
                  {titulo}
                </Heading>
                <span aria-hidden="true" className="mt-2.5 block h-0.5 w-7 bg-sunset" />
                <ul className="mt-3 flex flex-col">
                  {links.map(({ label, href, external }) => (
                    <li key={href}>
                      {external ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={LINK_BASE}
                        >
                          {label}
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      ) : (
                        <Link href={href} className={LINK_BASE}>
                          {label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </div>
      <div data-pie-cierre className="relative z-[1] border-t border-paper/15">
        <div>
          <div className="caja-ancha flex flex-col items-center justify-between gap-4 py-5 text-micro text-paper/60 lg:flex-row">
            <p className="order-2 text-center lg:order-1 lg:text-left">
              © {new Date().getFullYear()} {BRAND.name}. {BRAND.group}. Bonita Springs, Florida.
            </p>
            <nav
              aria-label="Legal"
              className="order-1 flex flex-wrap items-center justify-center gap-x-1 gap-y-2 lg:order-2 lg:shrink-0 lg:justify-end"
            >
              {LEGALES.map((doc, i) => (
                <span key={doc.href} className="inline-flex items-center">
                  {i > 0 ? (
                    <span aria-hidden="true" className="mr-1 hidden text-paper/30 min-[430px]:inline">
                      |
                    </span>
                  ) : null}
                  <Link
                    href={doc.href}
                    className="px-1 py-1.5 text-paper/70 transition-colors hover:text-paper hover:underline focus-visible:text-paper"
                  >
                    {doc.label}
                  </Link>
                </span>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <AgencyBar />
    </footer>
  );
}

