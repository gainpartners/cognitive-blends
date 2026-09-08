'use client';

export function CookieSettingsLink({ children }: { children: string }) {
  return (
    <a
      href="#cookie-settings"
      onClick={(event) => {
        event.preventDefault();
        window.openConsentBanner?.();
      }}
    >
      {children}
    </a>
  );
}
