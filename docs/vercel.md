# Deploy on Vercel

The app is a standard Next.js App Router project. Vercel is the host. Shopify stays the backend.

A Vercel HTTPS URL also solves Customer Account OAuth (Shopify rejects `localhost`). You can skip ngrok once a Preview or Production URL exists.

---

## 1. Push the repo

GitHub org: `gainpartners` (same as aercon / shannon-drift). Do not commit `.env.local`.

```bash
git remote add origin git@github.com:gainpartners/cognitive-blends.git
git push -u origin main
```

---

## 2. Create the Vercel project

1. [vercel.com](https://vercel.com) → **Add New → Project**.
2. Import `gainpartners/cognitive-blends`.
3. Framework: **Next.js** (auto-detected).
4. Root directory: `.` (repo root).
5. **Do not deploy yet** — add env vars first. If the first deploy already ran, add env vars and **Redeploy**.

---

## 3. Environment variables

Vercel → Project → **Settings → Environment Variables**.

Add each of these. Apply to **Production**, **Preview**, and **Development** unless noted.

`NEXT_PUBLIC_*` is baked in at **build** time. After you change it, you must **Redeploy**.

### Shopify Storefront

| Name | Example | Notes |
| --- | --- | --- |
| `SHOPIFY_STORE_DOMAIN` | `zzqvvg-ma.myshopify.com` | No `https://` |
| `SHOPIFY_STOREFRONT_API_TOKEN` | Headless **public** storefront token | **Not** Admin `shpat_`. Hex string from Headless → Storefront API → Manage |
| `SHOPIFY_STOREFRONT_API_VERSION` | `2025-10` | Pin a stable version |

### Customer Account OAuth

| Name | Example | Notes |
| --- | --- | --- |
| `SHOPIFY_SHOP_ID` | numeric id from Headless Customer Account endpoints | From `https://shopify.com/authentication/{id}/…` |
| `CUSTOMER_ACCOUNT_API_CLIENT_ID` | Headless Customer Account **Client ID** | Public client, no secret |
| `CUSTOMER_ACCOUNT_API_VERSION` | `2025-10` | |
| `NEXT_PUBLIC_APP_URL` | `https://cognitive-blends.vercel.app` | No trailing slash. Use the real Vercel URL (or custom domain later) |

### Reviews and native plans

| Name | Example | Notes |
| --- | --- | --- |
| `JUDGEME_API_TOKEN` | Judge.me private token | Server only |
| `JUDGEME_SHOP_DOMAIN` | `zzqvvg-ma.myshopify.com` | |
| `NATIVE_SUBSCRIPTIONS_APP_NAME` | from `npm run probe:plans` | Shopify native `appName` only. Empty = one-time purchase only |

### Preview gate

| Name | Example | Notes |
| --- | --- | --- |
| `SITE_ACCESS` | `preview` | Keep `preview` until you are ready to go public. `/brand` stays gated either way |
| `ACCESS_PASSWORD` | a strong password | Not the Shopify token. This is the site password |
| `ACCESS_SESSION_SECRET` | `openssl rand -base64 32` | Different from local. Forging this cookie bypasses preview |

Generate a production secret:

```bash
openssl rand -base64 32
```

---

## 4. Shopify callback for the Vercel URL

Headless → **Customer Account API → Manage** → Callback URL(s). Add:

```
https://YOUR-PROJECT.vercel.app/auth/callback
```

Logout URL:

```
https://YOUR-PROJECT.vercel.app/
```

You can keep a second callback for ngrok while developing locally. Each URL must be listed exactly.

If you use Vercel Preview URLs (`…-git-….vercel.app`), either:

- add each preview host as a callback (impractical), or
- only test login on **Production**, or
- use a fixed Preview alias.

---

## 5. Deploy

**Deployments → Deploy**, or push to `main`.

Open `https://YOUR-PROJECT.vercel.app`. Sign in with `ACCESS_PASSWORD`.

If the shop says the Storefront token is an Admin `shpat_`, the Vercel env still has the wrong token. Edit it, then Redeploy.

---

## 6. After deploy

```bash
# Local, against the same Headless token you put on Vercel
npm run probe:plans
```

Set `NATIVE_SUBSCRIPTIONS_APP_NAME` on Vercel from that output, then Redeploy.

Check:

- Home lists products
- `/products/thriveone` loads
- Add to cart → Checkout opens Shopify
- `/login` (on the Vercel HTTPS URL) completes Shopify customer login
- `/brand` still asks for the preview password

---

## Going public later

1. Add the production domain in Vercel.
2. Set `NEXT_PUBLIC_APP_URL=https://that-domain` and Redeploy.
3. Add that origin’s `/auth/callback` in Headless Customer Account.
4. Set `SITE_ACCESS=public` and Redeploy.
5. `/brand` remains password-gated.
