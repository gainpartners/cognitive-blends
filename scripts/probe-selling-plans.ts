import { loadEnvFiles } from './lib/env-file.mjs';

const { env } = loadEnvFiles(import.meta.url) as {
  env: Record<string, string>;
  loadedAny: boolean;
};

const domain = env.SHOPIFY_STORE_DOMAIN;
const token = env.SHOPIFY_STOREFRONT_API_TOKEN;
const version = env.SHOPIFY_STOREFRONT_API_VERSION || '2025-10';

if (!domain || !token) {
  console.error('Need SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_API_TOKEN');
  process.exit(1);
}

const query = `#graphql
  query {
    product(handle: "thriveone") {
      id
      title
      rating: metafield(namespace: "reviews", key: "rating") { value type }
      ratingCount: metafield(namespace: "reviews", key: "rating_count") { value }
      sellingPlanGroups(first: 10) {
        nodes {
          name
          appName
          sellingPlans(first: 20) {
            nodes { id name }
          }
        }
      }
    }
  }
`;

const response = await fetch(`https://${domain}/api/${version}/graphql.json`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': token,
  },
  body: JSON.stringify({ query }),
});

const json = await response.json();
console.log(JSON.stringify(json, null, 2));
