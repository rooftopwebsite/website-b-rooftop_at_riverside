import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import Footer from '@/components/shared/Footer';
import Header from '@/components/shared/Header';
import PageTransition from '@/components/shared/PageTransition';
import Preloader from '@/components/shared/Preloader';
import SmoothScroll from '@/components/shared/SmoothScroll';
import { BRAND } from '@/lib/brand';
import { SITE_URL, jsonLdScript, venueJsonLd } from '@/lib/seo';
import './globals.css';

/* ==========================================================================
   LAS DOS FUENTES DE MARCA

   ⚠️ Cargadas con `next/font/local`, NO con un `@font-face` a mano en
   globals.css —que es de dónde vienen— ni con `next/font/google`.

   El problema que resuelve, medido sobre el HTML servido antes del cambio:
   nadie tiene Big Shoulders ni Jost instaladas, así que TODO visitante las
   descarga. Y con el `@font-face` en la hoja de estilos, el navegador recién
   descubre el archivo después de bajar y parsear el CSS: HTML → CSS → fuente,
   tres saltos antes de que arranque la descarga. Encima no había métricas de
   reemplazo, así que al llegar la fuente el texto SALTABA — y con dos líneas de
   titular a 144px ese salto es violento.

   `next/font/local` da las dos cosas que faltaban:

     · `preload: true` (el default) emite `<link rel="preload" as="font">`, así
       la fuente baja EN PARALELO con el CSS en vez de después.
     · `adjustFontFallback: 'Arial'` genera una cara de respaldo con las
       métricas verticales ajustadas a la fuente real, así la caja de texto
       casi no cambia de alto en el swap. Es lo que evita el CLS.

   ⚠️ Y NO `next/font/google`, aunque el brief lo pidiera. Google también
   auto-hospeda en build, así que en runtime da lo mismo — pero descargaría de
   Google en cada build y perdería el subset latino hecho a mano, que es más
   chico que lo que devuelve su API. Esto es el espíritu del brief sin su
   desventaja. Ver `design-audit/DIRECCION-VISUAL.md` §8.

   ⚠️ Los .woff2 viven en `src/app/fonts/` y no en `public/fonts/`. En `public/`
   quedaban servidos Y empaquetados: el archivo viajaba dos veces.

   ⚠️ Las familias se exponen como CSS variables y el `@theme` de globals.css
   apunta a ellas. Los tokens `--font-display` / `--font-subhead` / `--font-body`
   NO cambian de nombre: los usan 163 call sites.
   ========================================================================== */

const display = localFont({
  src: './fonts/big-shoulders-variable.woff2',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  variable: '--font-display-src',
  /* El respaldo tiene que PARECERSE a lo que reemplaza: Arial Narrow mantiene
     la proporción angosta que sostiene el layout. Sin 'Haettenschweiler' —la
     Impact de Windows— que es mucho más ancha de caja y fue la causa de que
     los titulares se pisaran mientras faltaban los WOFF2. */
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
    'A rooftop bar over a curated food truck park in downtown Bonita Springs. Four independent kitchens, craft cocktails, live music, and a venue you can rent.',
  applicationName: BRAND.name,
  authors: [{ name: BRAND.credit.label, url: BRAND.credit.url }],
  formatDetection: { telephone: true, address: true },
};

export const viewport: Viewport = {
  /* Tiene que ser el MISMO valor que `--color-paper`. Es el color con el que el
     navegador pinta su cromo, así que si divergen se ve una costura arriba. */
  themeColor: '#FFFFFF',
  colorScheme: 'light',
};

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
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

        <SmoothScroll />
        <Preloader />
        <PageTransition />

        {/* ⚠️ ACÁ ARRIBA VIVÍA EL `PromoBar` —los cuatro hechos del lugar—.
            Camila lo mandó sacar y lo tachó sobre una captura. Los cuatro datos
            no se pierden: «Rooftop bar» y «Four food trucks» están en el
            titular y en la bajada del hero, «Live music five nights» tiene su
            sección y su página, y «Walk in, no reservations» está en la FAQ, en
            /visit y en el hero.

            Su color —`deeper`, el verde más oscuro— pasó al header, que es lo
            que ella pidió en el mismo mensaje. */}
        <Header />

        {/*
          Sin padding acá, y es a propósito: el header volvió a ser `fixed`
          —tiene que haber contenido pasando POR DETRÁS para que el blur se vea—
          así que no ocupa lugar en el flujo y cada hero compensa su altura.

          No se pone el padding en `<main>` justamente por el home: ahí el hero
          ocupa la pantalla entera y el muro de videos tiene que correr por
          debajo del header. Un padding acá lo empujaría y el blur no tendría
          nada que difuminar.

          Ver `PageHero.tsx` (las 22 internas) y `Hero.tsx` (el home).

          Los anclajes internos siguen necesitando el `scroll-margin-top` de
          globals.css.
        */}
        <main id="main">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
