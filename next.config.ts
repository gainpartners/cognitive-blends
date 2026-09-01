import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.shopify.com' },
      { protocol: 'https', hostname: 'cognitiveblends.com' },
    ],
  },
  async redirects() {
    return [
      { source: '/pages/thriveone', destination: '/what-is-thriveone', permanent: false },
      { source: '/pages/about-us', destination: '/our-story', permanent: false },
      { source: '/pages/contact', destination: '/contact', permanent: false },
      { source: '/collections/frontpage', destination: '/', permanent: false },
    ];
  },
};

export default nextConfig;
