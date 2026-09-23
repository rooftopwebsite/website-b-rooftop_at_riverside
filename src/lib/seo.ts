import type { Metadata } from 'next';
import { PAGE_SEO, type SeoRoute } from '@/content/seo-pages';
import type { Venue } from './venue';
import { BRAND, addressLine } from './brand';

export const SITE_URL = 'https://rooftopatriverside.com';

interface OgImage {
  readonly url: string;
  readonly width: number;
  readonly height: number;
  readonly alt: string;
}

const OG_IMAGE: OgImage = {
  url: '/og/og-default.jpg',
  width: 1200,
  height: 630,
  alt: 'Rooftop at Riverside logo in white on orange, with the line Eat. Drink. Paradise.',
};

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
  const socialTitle = fromTable ? title : `${title} · ${BRAND.name}`;

  return {
    title: fromTable ? { absolute: title } : title,
    description,
    ...(args.noIndex ? {} : { alternates: { canonical: url } }),
    ...(args.noIndex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: socialTitle,
      description,
      url,
      siteName: BRAND.name,
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: `${SITE_URL}${img.url}`,
          width: img.width,
          height: img.height,
          alt: img.alt,
          type: img.url.endsWith('.jpg') ? 'image/jpeg' : undefined,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: [{ url: `${SITE_URL}${img.url}`, alt: img.alt }],
    },
  };
}

const postalAddress = (v: Venue) =>
  ({
    '@type': 'PostalAddress',
    streetAddress: v.street,
    addressLocality: v.locality,
    addressRegion: v.region,
    postalCode: v.postalCode,
    addressCountry: BRAND.address.country,
  }) as const;

const schemaHours = (v: Venue): readonly string[] => {
  const ABREV = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const ORDEN = [1, 2, 3, 4, 5, 6, 0];
  const a24 = (t: string) => {
    const m = t.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
    if (!m) return null;
    let h = Number(m[1]) % 12;
    if (/pm/i.test(m[3])) h += 12;
    return `${String(h).padStart(2, '0')}:${m[2] ?? '00'}`;
  };
  return v.hours.flatMap((fila, i) => {
    if (/closed/i.test(fila.bar)) return [];
    const [abre, cierra] = fila.bar.split('–').map((x) => x.trim());
    const a = a24(abre ?? '');
    let b = a24(cierra ?? '');
    if (b === '00:00') b = '24:00';
    if (!a || !b) return [];
    return [`${ABREV[ORDEN[i]]} ${a}-${b}`];
  });
};

const sameAs = [BRAND.social.instagram, BRAND.social.facebook].filter(Boolean);

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
        publicAccess: true,
        areaServed: ['Bonita Springs', 'Naples', 'Estero'],
      },
      {
        '@type': 'EventVenue',
        '@id': `${SITE_URL}/#venue`,
        ...base,
        description:
          'Private and corporate event venue in downtown Bonita Springs: a rooftop bar, a gated yard, and a curated food truck park.',
        maximumAttendeeCapacity: undefined,
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

export function jsonLdScript(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export { addressLine };
