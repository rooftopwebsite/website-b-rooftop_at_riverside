import type { Metadata, Viewport } from 'next';
import Footer from '@/components/shared/Footer';
import Header from '@/components/shared/Header';
import Preloader from '@/components/shared/Preloader';
import { BRAND } from '@/lib/brand';
import { SITE_URL, jsonLdScript, venueJsonLd } from '@/lib/seo';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND.name} · Rooftop Bar & Food Truck Park in Bonita Springs`,
    template: `%s · ${BRAND.name}`,
  },
  description:
    'A rooftop bar over a curated food truck park in downtown Bonita Springs. Four independent kitchens, craft cocktails, live music, and a venue you can rent.',
  applicationName: BRAND.name,
  authors: [{ name: BRAND.credit.label, url: BRAND.credit.url }],
  formatDetection: { telephone: true, address: true },
};

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
  colorScheme: 'light',
};

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/*
          JSON-LD del venue: BarOrPub + EventVenue. Nunca Restaurant.
          Va en el layout raíz para que esté en todas las páginas.
        */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(venueJsonLd()) }}
        />

        {/*
          Skip link. Primero en el orden de tabulación y sólo visible al enfocarlo.
          WCAG 2.4.1: sin esto, alguien navegando con teclado tiene que pasar por
          los 13 destinos del header en cada página.
        */}
        <a
          href="#main"
          className="sr-only rounded-btn focus:not-sr-only focus:fixed focus:top-[12px] focus:left-[12px] focus:z-[200] focus:bg-ink focus:px-[18px] focus:py-[12px] focus:font-body focus:text-caption focus:font-bold focus:uppercase focus:tracking-[0.14em] focus:text-paper"
        >
          Skip to content
        </a>

        <Preloader />
        <Header />

        {/* El padding compensa el header fijo. Es el alto exacto del header. */}
        <main id="main" className="pt-header-sm desk:pt-header">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
