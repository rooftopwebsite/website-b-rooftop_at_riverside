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
  /* ⚠️ Es el color con el que el navegador pinta su cromo, así que tiene que
     ser el de lo que está PEGADO ARRIBA DE TODO o se ve una costura.

     Era `--color-paper` cuando lo primero era el header blanco. Ahora lo
     primero es la barra de servicio, que es `--color-deep`. */
  themeColor: '#014545',
  colorScheme: 'light',
};

/**
 * ⚠️ ES ASYNC PORQUE LEE LA BASE. `getVenue()` resuelve el local UNA vez por
 * render y lo baja a todo el árbol: los componentes de servidor lo vuelven a
 * pedir (y `fetch` dedupea), y los de cliente lo leen del proveedor.
 *
 * También pregunta si el blog tiene notas: sin ninguna, el Header y el Footer
 * no muestran el link. Ver `sinBlog` en `nav.ts`.
 */
export default async function RootLayout({ children }: { readonly children: React.ReactNode }) {
  const [venue, posts] = await Promise.all([getVenue(), getPosts()]);
  const hasBlog = posts.length > 0;

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <VenueProvider venue={venue}>
        {/*
          JSON-LD del venue: BarOrPub + EventVenue. Nunca Restaurant.
          Va en el layout raíz para que esté en todas las páginas.
        */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(venueJsonLd(venue)) }}
        />

        {/* El skip link. Ver en su archivo por qué mueve el foco a mano. */}
        <SkipLink />

        <SmoothScroll />
        <Preloader />
        <PageTransition />

        {/* ⚠️ ACÁ ARRIBA VIVÍA EL `PromoBar` —los cuatro hechos del lugar—.
            Camila lo mandó sacar y lo tachó sobre una captura. Los cuatro datos
            no se pierden: «Rooftop bar» y «Four food trucks» están en el
            titular y en la bajada del hero, «Live music five nights» tiene su
            sección y su página, y «Walk in, no reservations» está en la FAQ, en
            /visit y en el hero.

            ⚠️ Lo que hay ahora en su lugar NO es el PromoBar de vuelta.
            `UtilityBar` no vende nada: son las tres redes, Gift Cards y FAQ.
            El razonamiento está en el encabezado de ese archivo. */}
        <UtilityBar />
        <Header hasBlog={hasBlog} />

        {/*
          Sin padding acá, y ahora por el motivo CONTRARIO al de antes.

          Decía: «el header es `fixed`, no ocupa lugar en el flujo y cada hero
          compensa su altura». Con el rediseño el header volvió al flujo
          normal —ver la nota grande de `Header.tsx`—, así que ya ocupa su
          lugar y no hay nada que compensar. El padding sigue sin ir acá
          porque cada sección trae el suyo.

          ⚠️ Y por eso mismo se sacó el `pt` con los 77px sumados a mano que
          tenían `Hero.tsx` y `PageHero.tsx`. Si el header vuelve a flotar,
          vuelve también ahí.

          Los anclajes internos siguen necesitando el `scroll-margin-top` de
          globals.css.
        */}
        {/* `tabIndex={-1}`: lo enfoca el skip link. No entra al orden del Tab. */}
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>

        {/*
          ⚠️ ACÁ NO VA `<NewsletterSignup />`. Estuvo, como banda clara entre el
          `main` y el footer, y el 2026-09-11 se mudó ADENTRO del `<Footer />`,
          que ahora lo renderiza como tarjeta oscura. Si vuelve a montarse acá,
          el formulario aparece dos veces en las 23 páginas. Ver la nota del
          encabezado de `NewsletterSignup.tsx`.

          Lo que no cambió es que sigue FUERA de `<main>`: es cierre de sitio y
          no contenido de la página, igual que el footer.
        */}
        <Footer hasBlog={hasBlog} />

        {/*
          ⚠️ VA ÚLTIMO Y FUERA DE `<main>`. Es `fixed`, así que su lugar en el
          DOM no cambia dónde se dibuja — pero sí cambia dos cosas: es lo último
          del orden de tabulación, que es donde corresponde un atajo de
          navegación, y queda después del `<footer>` en el DOM, que es lo que
          lo deja por encima sin tener que subirle el z-index.

          ⚠️ No lleva envoltorio ni margen: se posiciona solo contra el
          viewport y frena solo contra el cierre del footer. Ver su archivo.
        */}
        <BackToTop />
        </VenueProvider>
      </body>
    </html>
  );
}
