import type { Metadata } from 'next';
import { CatalogSection } from '@/components/shop/CatalogSection';
import { onlineStore } from '@/content/pages/store';

export const metadata: Metadata = {
  title: onlineStore.title,
};

export default async function OnlineStorePage() {
  return (
    <CatalogSection
      className="section store-page"
      heading={onlineStore.heading}
      titleAs="h1"
    />
  );
}
