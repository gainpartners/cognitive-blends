import { NextResponse } from 'next/server';
import { isStorefrontConfigured } from '@/lib/config/server';
import { errorFields, logger } from '@/lib/log';
import { predictiveSearch } from '@/lib/shopify/search';

const log = logger('search');

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get('q')?.trim() ?? '';
  if (query.length < 2) {
    return NextResponse.json({ products: [], queries: [], pages: [] });
  }
  if (!isStorefrontConfigured()) {
    return NextResponse.json({ products: [], queries: [], pages: [] });
  }
  try {
    const result = await predictiveSearch(query);
    return NextResponse.json(result);
  } catch (error) {
    log.warn('predictive search failed', errorFields(error));
    return NextResponse.json({ products: [], queries: [], pages: [] }, { status: 502 });
  }
}
