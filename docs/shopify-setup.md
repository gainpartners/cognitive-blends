# Shopify setup

This Next.js app talks to the live Cognitive Blends store. Shopify stays the source of record (catalog, cart, hosted checkout). Credentials come from Shopify’s **Headless** sales channel — Shopify’s own product, not a third-party app.

Do **not** run `npm init @shopify/app@latest` in this repo. That scaffolds an embedded admin app. We already have the storefront.

Do **not** use the Dev Dashboard “Create app” path for this project. It mints 24-hour Admin tokens.

---

## 1. Install Headless

1. In the **store admin** (admin.shopify.com for Cognitive Blends), open the [Headless listing](https://apps.shopify.com/headless). Developer must be **Shopify**, price **Free**.
2. Click **Install**.
3. Open **Sales channels → Headless**.
4. **Create storefront** if one is not there. Name: `Cognitive Blends Headless`.

You should see **Manage API access** with Storefront API (and Customer Account API, which this app does not call).

---

## 2. Storefront API

**Manage** on Storefront API.

### Permissions (pencil → save)

Must be on:

- `unauthenticated_read_product_listings`
- `unauthenticated_read_product_inventory`
- `unauthenticated_read_selling_plans` (Appstle plans on the product)
- `unauthenticated_read_checkouts` / `unauthenticated_write_checkouts` (cart)

Leave customer tags off unless you need them.

### Tokens

On **Storefront API → Manage**, copy a **Storefront** token — not an Admin `shpat_` token from Dev Dashboard.

Easiest: **Public access token**. Paste into `.env.local`:

```
SHOPIFY_STORE_DOMAIN=zzqvvg-ma.myshopify.com
SHOPIFY_STOREFRONT_API_TOKEN=...
SHOPIFY_STOREFRONT_API_VERSION=2025-10
```

A `shpat_…` value is Admin API and will 401 on Storefront. The public token is a hex string (no `shpat_` prefix).

Never commit this token. Never paste it into chat.

### Product metafields

In admin, expose to the Storefront API:

- namespace `reviews`, key `rating`
- namespace `reviews`, key `rating_count`

Without this, star ratings on the product page stay empty.

---

## 3. Account link (Shopify-hosted)

Requires **new customer accounts** (Settings → Customer accounts — not classic). That is already how [cognitiveblends.com](https://cognitiveblends.com) works.

This app does **not** use the Customer Account API (no PKCE, no Client ID, no `/auth/callback`). The header **Account** control is a normal link to Shopify’s hosted portal:

```
https://shopify.com/{SHOPIFY_SHOP_ID}/account
```

Copy the numeric shop id from Headless → Customer Account API endpoints (`https://shopify.com/authentication/{id}/…`):

```
SHOPIFY_SHOP_ID=
```

Native (legacy) subscribers manage contracts there. Appstle subscribers use the personal link Appstle emails them.

---

## 4. Judge.me

Judge.me admin → Settings → Integrations:

```
JUDGEME_API_TOKEN=
JUDGEME_SHOP_DOMAIN=zzqvvg-ma.myshopify.com
```

Reviews are keyed by Shopify product id (`gid://shopify/Product/9529568592136` → `9529568592136` for ThriveOne).

---

## 5. Preview password

Default `SITE_ACCESS=preview` gates the whole shop.

```
SITE_ACCESS=preview
ACCESS_PASSWORD=choose-a-password
ACCESS_SESSION_SECRET=   # openssl rand -base64 32
```

Open `http://localhost:3000` and sign in with `ACCESS_PASSWORD`. `/brand` stays password-gated even after the shop goes public.

Account on the live Shopify host does not need ngrok. Browse, cart, and checkout work on localhost.

---

## 6. Subscriptions (match the live site)

This store has Shopify native subscriptions **and** Appstle in the backend. The live theme only **sells** Appstle.

- **Buy:** Appstle selling plans only (ThriveOne: monthly 15%, quarterly 20%). Native plans are not offered.
- **Manage Appstle:** Appstle’s emailed portal. Untouched.
- **Manage native (legacy):** Shopify-hosted customer accounts (step 3).

```
APPSTLE_SUBSCRIPTIONS_APP_NAME=appstle
```

If unset, the app defaults to `appstle`. Add-to-cart rejects a `sellingPlanId` that is not in the Appstle group.

---

## 7. Check

```bash
npm run config:check
npm run dev
```

`config:check` fails until required vars are set. That is expected.
