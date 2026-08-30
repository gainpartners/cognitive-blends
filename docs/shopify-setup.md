# Shopify + local tunnel setup

This Next.js app talks to the live Cognitive Blends store. Shopify stays the source of record (catalog, cart, hosted checkout, native subscriptions). Credentials come from Shopify’s **Headless** sales channel — Shopify’s own product, not a third-party app.

Do **not** run `npm init @shopify/app@latest` in this repo. That scaffolds an embedded admin app. We already have the storefront.

Do **not** use the Dev Dashboard “Create app” path for this project. It mints 24-hour Admin tokens and does not give Customer Account OAuth (login / orders / cancel).

---

## 1. Install Headless

1. In the **store admin** (admin.shopify.com for Cognitive Blends), open the [Headless listing](https://apps.shopify.com/headless). Developer must be **Shopify**, price **Free**.
2. Click **Install**.
3. Open **Sales channels → Headless**.
4. **Create storefront** if one is not there. Name: `Cognitive Blends Headless`.

You should see **Manage API access** with Storefront API and Customer Account API.

---

## 2. Storefront API

**Manage** on Storefront API.

### Permissions (pencil → save)

Must be on:

- `unauthenticated_read_product_listings`
- `unauthenticated_read_product_inventory`
- `unauthenticated_read_selling_plans` (under Selling plans — required for native subscribe)
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

A `shpat_…` value is Admin API and will 401 on Storefront. The public token is a hex string (no `shpat_` prefix). The Headless **private** token uses a different header and is optional here because all our Shopify calls are server-side with the public token.

Never commit this token. Never paste it into chat.

### Product metafields

In admin, expose to the Storefront API:

- namespace `reviews`, key `rating`
- namespace `reviews`, key `rating_count`

Without this, star ratings on the product page stay empty.

---

## 3. Customer Account API

Requires **new customer accounts** (Settings → Customer accounts — not classic).

**Manage** on Customer Account API.

### Client type

**Public** (PKCE). No client secret in this app.

### Permissions (pencil → save)

Must be on:

- `customer_read_customers`
- `customer_read_orders`
- **Read own subscription contracts** (`customer_read_own_subscription_contracts`)
- **Write own subscription contracts** (`customer_write_own_subscription_contracts`) — cancel will fail without this

Leave `customer_write_orders` and store credit off.

### Credentials

From this screen / application endpoints:

| Copy | Env var |
| --- | --- |
| Client ID | `CUSTOMER_ACCOUNT_API_CLIENT_ID` |
| Numeric shop ID in URLs like `https://shopify.com/authentication/{id}/...` | `SHOPIFY_SHOP_ID` |

```
CUSTOMER_ACCOUNT_API_CLIENT_ID=
SHOPIFY_SHOP_ID=
CUSTOMER_ACCOUNT_API_VERSION=2025-10
```

### Callback URL

Shopify **rejects** `localhost` and `http`. Register an HTTPS URL (see [ngrok](#5-https-tunnel-ngrok)):

```
https://YOUR_TUNNEL/auth/callback
```

Logout URL:

```
https://YOUR_TUNNEL/
```

---

## 4. Judge.me

Judge.me admin → Settings → Integrations:

```
JUDGEME_API_TOKEN=
JUDGEME_SHOP_DOMAIN=zzqvvg-ma.myshopify.com
```

Reviews are keyed by Shopify product id (`gid://shopify/Product/9529568592136` → `9529568592136` for ThriveOne).

---

## 5. HTTPS tunnel (ngrok)

Browse, product, cart work on `http://localhost:3000`. **Login, account, and subscription cancel** need HTTPS.

```bash
brew install ngrok
ngrok config add-authtoken YOUR_NGROK_TOKEN
```

With the Next app running (`npm run dev`):

```bash
ngrok http 3000
```

Copy the `https://….ngrok-free.app` URL.

```
NEXT_PUBLIC_APP_URL=https://YOUR_SUBDOMAIN.ngrok-free.app
```

Restart `npm run dev` after changing it. Put the same host in the Customer Account callback (step 3).

Free ngrok URLs **change every restart**. Update `.env.local` and the Shopify callback when they do. A reserved ngrok domain or Cloudflare Tunnel with a fixed hostname avoids that.

---

## 6. Preview password

Default `SITE_ACCESS=preview` gates the whole shop.

```
SITE_ACCESS=preview
ACCESS_PASSWORD=choose-a-password
ACCESS_SESSION_SECRET=   # openssl rand -base64 32
```

Open the app (localhost or tunnel) and sign in with `ACCESS_PASSWORD`. `/brand` stays password-gated even after the shop goes public.

---

## 7. Native subscriptions only

This store has Shopify native subscriptions **and** Appstle on the same products. The app must use native only.

After Storefront credentials are in `.env.local`:

```bash
npm run probe:plans
```

Find the group whose `appName` is Shopify’s native app (not Appstle). Copy that string:

```
NATIVE_SUBSCRIPTIONS_APP_NAME=
```

If this is empty, product pages show one-time purchase only and do not error.

---

## 8. Check

```bash
npm run config:check
npm run dev
```

`config:check` fails until required vars are set. That is expected.

Customer login: open `NEXT_PUBLIC_APP_URL/login` through the tunnel, not localhost.
