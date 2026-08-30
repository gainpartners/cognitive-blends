# Cognitive Blends

Headless Next.js storefront for [cognitiveblends.com](https://cognitiveblends.com). Shopify owns catalog, cart, checkout, and native subscriptions. This app is the shopper experience.

Private until `SITE_ACCESS=public`. Default is `preview` (password gate). `/brand` stays gated after launch.

**Shopify credentials and ngrok:** [docs/shopify-setup.md](docs/shopify-setup.md).

## Stack

Next.js 16 (App Router, TypeScript) on Vercel. Storefront API + Customer Account API (PKCE) + Judge.me. No Hydrogen, no Admin API at runtime, no Appstle.

## Develop

```bash
npm install
cp .env.local.example .env.local
# Fill tokens — see docs/shopify-setup.md
# openssl rand -base64 32  → ACCESS_SESSION_SECRET
npm run config:check
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Password is `ACCESS_PASSWORD`.

```bash
npm run probe:plans                    # dump ThriveOne sellingPlanGroups.appName
npm run probe:customer -- <access_token>
```

Set `NATIVE_SUBSCRIPTIONS_APP_NAME` from `probe:plans` to the **Shopify native** group only.

`SHOPIFY_STOREFRONT_API_TOKEN` must be the Headless **Storefront** public token, not an Admin `shpat_` token (that returns HTTP 401).

Login / account / cancel need HTTPS. With `npm run dev` already running:

```bash
ngrok http 3000
```

Put the `https://…` URL in `NEXT_PUBLIC_APP_URL` and in Headless → Customer Account API → callback `…/auth/callback`. Full steps: [docs/shopify-setup.md](docs/shopify-setup.md#5-https-tunnel-ngrok).

## Brand

Living guidelines: `/brand`. Tokens in `src/app/globals.css`. Shop pages compose `src/components/ui`. See [docs/brand.md](docs/brand.md).
