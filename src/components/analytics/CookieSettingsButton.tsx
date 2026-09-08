'use client';

import { Button } from '@/components/ui/Button';

export function CookieSettingsButton({
  children = 'Cookie settings',
}: {
  children?: string;
}) {
  return (
    <Button
      type="button"
      variant="secondary"
      onClick={() => {
        window.openConsentBanner?.();
      }}
    >
      {children}
    </Button>
  );
}
