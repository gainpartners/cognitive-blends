<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Cognitive Blends

Headless storefront. Shopify is the system of record. This app is a thin Next.js BFF.

## Rules

- New subscribers: Appstle selling plans only. Do not offer native Shopify Subscriptions plans. Never show app names. Re-check plan IDs on add-to-cart.
- Account is Shopify’s hosted customer accounts (`https://shopify.com/{shop_id}/account`). Do not call Customer Account API. Do not build pause/cancel UI. Appstle subscribers keep Appstle’s email portal.
- No Admin API. No Customer Account API. No Hydrogen. No Bootstrap. No Tailwind. No tracking.
- Nothing outside `src/lib/config/` reads `process.env` except `NODE_ENV`.
- Shop UI composes `src/components/ui`. Do not add a one-off button style on a page.
- Tokens only in `src/app/globals.css` `:root`. Fonts only from `layout.tsx`.
- `/brand` is the living style guide and must render those same components.
- Catalog may revalidate. Cart and customer fetches are `cache: 'no-store'`.
- Checkout is `cart.checkoutUrl`. Never rebuild checkout.
