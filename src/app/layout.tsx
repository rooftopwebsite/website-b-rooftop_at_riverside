import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import BackToTop from '@/components/shared/BackToTop';
import Footer from '@/components/shared/Footer';
import Header from '@/components/shared/Header';
import PageTransition from '@/components/shared/PageTransition';
import Preloader from '@/components/shared/Preloader';
import SkipLink from '@/components/shared/SkipLink';
import SmoothScroll from '@/components/shared/SmoothScroll';
import UtilityBar from '@/components/shared/UtilityBar';
import { BRAND } from '@/lib/brand';
import VenueProvider from '@/components/shared/VenueProvider';
import { getVenue } from '@/lib/venue';
import { getPosts } from '@/lib/blog';
import { SITE_URL, jsonLdScript, venueJsonLd } from '@/lib/seo';
import './globals.css';

const display = localFont({
  src: './fonts/big-shoulders-variable.woff2',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  variable: '--font-display-src',
  fallback: ['Arial Narrow', 'ui-sans-serif', 'sans-serif'],
  adjustFontFallback: 'Arial',
});

const body = localFont({
  src: './fonts/jost-variable.woff2',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  variable: '--font-body-src',
  fallback: ['Century Gothic', 'Avenir Next', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  adjustFontFallback: 'Arial',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND.name} · Rooftop Bar & Food Truck Park in Bonita Springs`,
    template: `%s · ${BRAND.name}`,
  },
  description:
    'A rooftop bar over a curated food truck park in downtown Bonita Springs. Gourmet food trucks, craft cocktails, live music, and a venue for your next party.',
  applicationName: BRAND.name,
  authors: [{ name: BRAND.credit.label, url: BRAND.credit.url }],
  formatDetection: { telephone: true, address: true },
};

export const viewport: Viewport = {
  themeColor: '#014545',
  colorScheme: 'light',
};

export default async function RootLayout({ children }: { readonly children: React.ReactNode }) {
  const [venue, posts] = await Promise.all([getVenue(), getPosts()]);
  const hasBlog = posts.length > 0;

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <VenueProvider venue={venue}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(venueJsonLd(venue)) }}
        />
        <SkipLink />

        <SmoothScroll />
        <Preloader />
        <PageTransition />
        <UtilityBar />
        <Header hasBlog={hasBlog} />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer hasBlog={hasBlog} />
        <BackToTop />
        </VenueProvider>
      </body>
    </html>
  );
}
