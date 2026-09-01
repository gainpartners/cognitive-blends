# Cognitive Blends

Headless Next.js storefront for [cognitiveblends.com](https://cognitiveblends.com). Shopify owns catalog, cart, and checkout. This app is the shopper experience.

Private until `SITE_ACCESS=public`. Default is `preview` (password gate). `/brand` stays gated after launch.

**Shopify credentials:** [docs/shopify-setup.md](docs/shopify-setup.md).

## Stack

Next.js 16 (App Router, TypeScript) on Vercel. Storefront API + Judge.me. New subscribers use Appstle selling plans. Account is Shopify’s hosted customer accounts (a link, not Customer Account API). No Hydrogen, no Admin API at runtime.

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
```

Subscribe options are Appstle only (`APPSTLE_SUBSCRIPTIONS_APP_NAME`, default `appstle`): monthly 15% and quarterly 20% on ThriveOne. **Account** goes to `https://shopify.com/{SHOPIFY_SHOP_ID}/account`. Native plans stay in Shopify unused; Appstle subscribers still manage via Appstle’s email link.

`SHOPIFY_STOREFRONT_API_TOKEN` must be the Headless **Storefront** public token, not an Admin `shpat_` token (that returns HTTP 401).

## Deploy (Vercel)

Full steps and env table: [docs/vercel.md](docs/vercel.md).

1. Import the GitHub repo in Vercel (Next.js, root `.`).
2. Add the env vars in that doc (Production + Preview).
3. Deploy. Sign in with `ACCESS_PASSWORD`. Keep `SITE_ACCESS=preview` until launch.

## Brand

Living guidelines: `/brand`. Tokens in `src/app/globals.css`. Shop pages compose `src/components/ui`. See [docs/brand.md](docs/brand.md).
