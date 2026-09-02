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
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [48, 64, 72, 88, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      { source: '/pages/thriveone', destination: '/what-is-thriveone', permanent: false },
      { source: '/pages/about-us', destination: '/our-story', permanent: false },
      { source: '/pages/contact', destination: '/contact', permanent: false },
    ];
  },
};

export default nextConfig;
