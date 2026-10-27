import type { NextConfig } from 'next';
import { retiredTruckRedirects, truckBySlug } from './src/content/trucks';

function truckUrl(slug: string): string {
  const truck = truckBySlug(slug);
  return truck?.active ? `/food-trucks/${slug}` : '/food-trucks';
}

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '4.5mb',
    },
  },

  images: {
    formats: ['image/avif', 'image/webp'],

    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  async redirects() {
    return [
      { source: '/this-is-us', destination: '/our-story', statusCode: 301 },
      { source: '/eat', destination: '/food-trucks', statusCode: 301 },
      { source: '/drink', destination: '/sunset-bar', statusCode: 301 },
      { source: '/calendar', destination: '/whats-on', statusCode: 301 },
      { source: '/hostanevent', destination: '/events', statusCode: 301 },
      { source: '/neighborhood-market', destination: '/market', statusCode: 301 },
      { source: '/entertainment', destination: '/join-us', statusCode: 301 },
      { source: '/game-lounge', destination: '/game-truck', statusCode: 301 },
      { source: '/find-us', destination: '/contact#visit', statusCode: 301 },
      { source: '/parking', destination: '/contact#parking', statusCode: 301 },

      { source: '/primecarvery', destination: truckUrl('prime-carvery'), statusCode: 301 },
      { source: '/tropicalfusion', destination: truckUrl('tropical-fusion'), statusCode: 301 },
      { source: '/seameonwheels', destination: truckUrl('sea-me-on-wheels'), statusCode: 301 },
      { source: '/el-chilango', destination: truckUrl('el-chilango'), statusCode: 301 },

      { source: '/ocn', destination: truckUrl('ocn-seafood-co'), statusCode: 301 },

      { source: '/giveback', destination: '/our-story', statusCode: 301 },
      { source: '/tnt-sign-ups', destination: '/whats-on', statusCode: 301 },
      { source: '/blank', destination: '/market', statusCode: 301 },
      { source: '/blank-1', destination: '/', statusCode: 301 },
      { source: '/inquiry-services-page', destination: '/events#inquire', statusCode: 301 },

      { source: '/the-experience', destination: '/our-story', statusCode: 301 },
      { source: '/faq', destination: '/our-story', statusCode: 301 },
      { source: '/visit', destination: '/contact#visit', statusCode: 301 },
      { source: '/nfc-north-hq', destination: '/whats-on', statusCode: 301 },
      { source: '/events/inquire', destination: '/events#inquire', statusCode: 301 },
      { source: '/events/spaces', destination: '/events#spaces', statusCode: 301 },
      { source: '/events/game-truck', destination: '/game-truck', statusCode: 301 },
      { source: '/events/corporate', destination: '/events#corporate', statusCode: 301 },
      { source: '/events/celebrations', destination: '/events#celebrations', statusCode: 301 },
      { source: '/events/fundraisers', destination: '/events#fundraisers', statusCode: 301 },
      {
        source: '/events/holiday-parties',
        destination: '/events#holiday-parties',
        statusCode: 301,
      },

      ...retiredTruckRedirects(),
    ];
  },
};

export default nextConfig;
