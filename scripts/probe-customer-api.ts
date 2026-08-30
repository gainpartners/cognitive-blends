import { loadEnvFiles } from './lib/env-file.mjs';

const { env } = loadEnvFiles(import.meta.url) as {
  env: Record<string, string>;
  loadedAny: boolean;
};

const shopId = env.SHOPIFY_SHOP_ID;
const version = env.CUSTOMER_ACCOUNT_API_VERSION || '2025-10';
const token = process.argv[2];

if (!shopId || !token) {
  console.error('Usage: npm run probe:customer -- <customer_access_token>');
  console.error('Needs SHOPIFY_SHOP_ID in .env.local');
  process.exit(1);
}

const query = `#graphql
  query {
    customer {
      firstName
      emailAddress { emailAddress }
      subscriptionContracts(first: 5) {
        nodes { id status }
      }
    }
  }
`;

const url = `https://shopify.com/${shopId}/account/customer/api/${version}/graphql`;
const response = await fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: token,
  },
  body: JSON.stringify({ query }),
});

console.log('status', response.status);
console.log(await response.text());
