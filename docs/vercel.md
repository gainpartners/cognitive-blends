# Deploy on Vercel

The app is a standard Next.js App Router project. Vercel is the host. Shopify stays the backend.

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

Do **not** set `CUSTOMER_ACCOUNT_API_CLIENT_ID`, `CUSTOMER_ACCOUNT_API_VERSION`, or `NEXT_PUBLIC_APP_URL`. This app does not call the Customer Account API. If those are already on the project, you can delete them.

### Shopify Storefront

| Name | Example | Notes |
| --- | --- | --- |
| `SHOPIFY_STORE_DOMAIN` | `zzqvvg-ma.myshopify.com` | No `https://` |
| `SHOPIFY_STOREFRONT_API_TOKEN` | Headless **public** storefront token | **Not** Admin `shpat_`. Hex string from Headless → Storefront API → Manage |
| `SHOPIFY_STOREFRONT_API_VERSION` | `2025-10` | Pin a stable version |

### Account link

| Name | Example | Notes |
| --- | --- | --- |
| `SHOPIFY_SHOP_ID` | numeric id | From `https://shopify.com/authentication/{id}/…`. Builds `https://shopify.com/{id}/account` |

### Reviews and Appstle plans

| Name | Example | Notes |
| --- | --- | --- |
| `JUDGEME_API_TOKEN` | Judge.me private token | Server only |
| `JUDGEME_SHOP_DOMAIN` | `zzqvvg-ma.myshopify.com` | |
| `APPSTLE_SUBSCRIPTIONS_APP_NAME` | `appstle` | Default is `appstle`. New subscribers only |

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

## 4. Deploy

**Deployments → Deploy**, or push to `main`.

Open `https://cognitive-blends.vercel.app`. Sign in with `ACCESS_PASSWORD`.

If the shop says the Storefront token is an Admin `shpat_`, the Vercel env still has the wrong token. Edit it, then Redeploy.

---

## 5. After deploy

```bash
# Local, against the same Headless token you put on Vercel
npm run probe:plans
```

`APPSTLE_SUBSCRIPTIONS_APP_NAME` defaults to `appstle` if unset.

Check:

- Home lists products
- `/products/thriveone` offers one-time, Appstle monthly 15%, Appstle quarterly 20%
- Add to cart → Checkout opens Shopify
- **Account** opens Shopify’s hosted sign-in (`shopify.com/…/account`)
- `/brand` still asks for the preview password

---

## Going public later

1. Add the production domain in Vercel.
2. Set `SITE_ACCESS=public` and Redeploy.
3. `/brand` remains password-gated.
