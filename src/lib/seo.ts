import type { Metadata } from 'next';
import { PAGE_SEO, type SeoRoute } from '@/content/seo-pages';
import type { Venue } from './venue';
import { BRAND, addressLine } from './brand';

/**
 * SEO. Desde el primer commit, no al final.
 *
 * ⚠️ El tipo de schema es **BarOrPub + EventVenue**, NO Restaurant. Es la
 * decisión más importante de este archivo: `Restaurant` le diría a Google que
 * el venue sirve comida, y el venue no tiene cocina. La comida la sirven cuatro
 * negocios independientes que cobran su propia venta.
 */

export const SITE_URL = 'https://rooftopatriverside.com';

interface OgImage {
  readonly url: string;
  readonly width: number;
  readonly height: number;
  readonly alt: string;
}

const OG_IMAGE: OgImage = {
  url: '/images/venue/venue-aerial.jpg',
  width: 2400,
  height: 1600,
  alt: 'A band playing to a crowd at dusk at Rooftop at Riverside in Bonita Springs',
};

/**
 * Metadata de una página.
 *
 * Dos formas de usarlo:
 *
 *   · `pageMeta({ route: '/visit' })` — lee título y descripción de
 *     `content/seo-pages.ts`, que es la tabla del brief. **Es la forma normal.**
 *   · `pageMeta({ title, description, path })` — para las rutas dinámicas
 *     (`/whats-on/[slug]`, `/food-trucks/[slug]`), que no están en la tabla
 *     porque su título sale del dato.
 *
 * ⚠️ Los títulos de la tabla son **absolutos**: ya traen la marca donde va y
 * evitan el `template` del layout. Los dinámicos sí pasan por el template.
 */
export function pageMeta(
  args:
    | { readonly route: SeoRoute; readonly image?: OgImage; readonly noIndex?: boolean }
    | {
        readonly title: string;
        readonly description: string;
        readonly path: string;
        readonly image?: OgImage;
        readonly noIndex?: boolean;
      },
): Metadata {
  const fromTable = 'route' in args;
  const path = fromTable ? args.route : args.path;
  const entry = fromTable ? PAGE_SEO[args.route] : null;
  const title = entry ? entry.title : (args as { title: string }).title;
  const description = entry ? entry.description : (args as { description: string }).description;

  const url = `${SITE_URL}${path === '/' ? '' : path}`;
  const img = args.image ?? OG_IMAGE;
  // El de la tabla no debe recibir el sufijo del template; el dinámico sí.
  const socialTitle = fromTable ? title : `${title} · ${BRAND.name}`;

  return {
    title: fromTable ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    ...(args.noIndex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: socialTitle,
      description,
      url,
      siteName: BRAND.name,
      locale: 'en_US',
      type: 'website',
      images: [{ url: `${SITE_URL}${img.url}`, width: img.width, height: img.height, alt: img.alt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: [`${SITE_URL}${img.url}`],
    },
  };
}

/**
 * ⚠️ LA DIRECCIÓN DEL SCHEMA SALE DEL LOCAL RESUELTO, no de `brand.ts`. Un
 * JSON-LD con un teléfono viejo es peor que no tenerlo: Google lo cruza con el
 * perfil de negocio y la discrepancia perjudica.
 */
const postalAddress = (v: Venue) =>
  ({
    '@type': 'PostalAddress',
    streetAddress: v.street,
    addressLocality: v.locality,
    addressRegion: v.region,
    postalCode: v.postalCode,
    addressCountry: BRAND.address.country,
  }) as const;

/** Los horarios del local en formato ISO 8601, para `openingHours`. */
const schemaHours = (v: Venue): readonly string[] => {
  const ABREV = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const ORDEN = [1, 2, 3, 4, 5, 6, 0];
  const a24 = (t: string) => {
    const m = t.trim().match(/^(d{1,2}):(d{2})s*(AM|PM)$/i);
    if (!m) return null;
    let h = Number(m[1]) % 12;
    if (/pm/i.test(m[3])) h += 12;
    return `${String(h).padStart(2, '0')}:${m[2]}`;
  };
  return v.hours.flatMap((fila, i) => {
    if (/closed/i.test(fila.bar)) return [];
    const [abre, cierra] = fila.bar.split('–').map((x) => x.trim());
    const a = a24(abre ?? '');
    let b = a24(cierra ?? '');
    // Medianoche cierra el día: schema.org la escribe 24:00, no 00:00.
    if (b === '00:00') b = '24:00';
    if (!a || !b) return [];
    return [`${ABREV[ORDEN[i]]} ${a}-${b}`];
  });
};

const sameAs = [BRAND.social.instagram, BRAND.social.facebook].filter(Boolean);

/**
 * El grafo del layout raíz: BarOrPub + EventVenue.
 *
 * ⚠️ El `geo` sale del Google Business Profile —vía el dashboard interno, que
 * lo tiene vinculado por `cid`— y no de una estimación. Una lat/long inventada
 * es peor que ninguna: Google la cruza con el GBP y la discrepancia perjudica.
 *
 * ⚠️ `openingHours` lleva SÓLO el horario de la BARRA. Es el horario del
 * negocio que este schema describe. El de los trucks es de cuatro negocios
 * distintos y no corresponde declararlo acá; vive en el HTML del footer.
 */
export function venueJsonLd(v: Venue) {
  const geo = v.geo
    ? { geo: { '@type': 'GeoCoordinates', latitude: v.geo.lat, longitude: v.geo.lng } }
    : {};

  const base = {
    name: v.name,
    url: SITE_URL,
    telephone: v.phone,
    email: v.email,
    address: postalAddress(v),
    sameAs,
    image: `${SITE_URL}${OG_IMAGE.url}`,
    logo: `${SITE_URL}/brand/logo-lockup.png`,
    ...geo,
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BarOrPub',
        '@id': `${SITE_URL}/#bar`,
        ...base,
        description: `${BRAND.concept}. Craft cocktails, local drafts and live music, with four independent food trucks in the yard below.`,
        openingHours: schemaHours(v),
        servesCuisine: 'Cocktails',
        priceRange: '$$',
        /*
         * ⚠️ `publicAccess` SÍ, `isAccessibleForFree` NO, y la diferencia no
         * es un detalle. El lugar es de acceso público y se entra sin
         * reserva, eso es cierto y se declara. Que la ENTRADA sea gratis dejó
         * de ser cierto el 2026-09-17, cuando se confirmó que dos de las
         * noches fijas llevan ticket. Es el mismo dato que se sacó de la
         * píldora de los eventos y del JSON-LD de `/whats-on`.
         */
        publicAccess: true,
        areaServed: ['Bonita Springs', 'Naples', 'Estero'],
      },
      {
        '@type': 'EventVenue',
        '@id': `${SITE_URL}/#venue`,
        ...base,
        description:
          'Private and corporate event venue in downtown Bonita Springs: a rooftop bar, a gated yard, and a curated food truck park.',
        maximumAttendeeCapacity: undefined, // TBD — pendiente del cliente
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: BRAND.name,
        publisher: { '@id': `${SITE_URL}/#bar` },
        inLanguage: 'en-US',
      },
    ],
  };
}

/** BreadcrumbList. Va en todas las páginas hijas. */
export function breadcrumbJsonLd(trail: readonly { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...trail].map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path === '/' ? '' : item.path}`,
    })),
  };
}

/** Serializa un objeto para meterlo en un `<script type="application/ld+json">`. */
export function jsonLdScript(data: unknown) {
  // `</script>` dentro del JSON rompería el tag. Escaparlo es obligatorio.
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export { addressLine };
