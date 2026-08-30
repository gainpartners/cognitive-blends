import type { MetadataRoute } from 'next';
import { shouldNoIndex } from '@/lib/access';

export default function robots(): MetadataRoute.Robots {
  if (shouldNoIndex) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  return { rules: { userAgent: '*', allow: '/', disallow: ['/brand', '/account'] } };
}
