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
      sellingPlanGroups(first: 10) {
        nodes {
          name
          appName
          sellingPlans(first: 20) {
            nodes {
              id
              name
              billingPolicy {
                ... on SellingPlanRecurringBillingPolicy {
                  interval
                  intervalCount
                }
              }
              priceAdjustments {
                adjustmentValue {
                  ... on SellingPlanPercentagePriceAdjustment {
                    adjustmentPercentage
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

async function main() {
  const response = await fetch(`https://${domain}/api/${version}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query }),
  });

  const json = (await response.json()) as {
    data?: {
      product?: {
        sellingPlanGroups?: {
          nodes: { name: string; appName?: string | null }[];
        };
      };
    };
    errors?: unknown;
  };

  if (json.errors) {
    console.error(JSON.stringify(json.errors, null, 2));
    process.exit(1);
  }

  const groups = json.data?.product?.sellingPlanGroups?.nodes ?? [];
  console.log('appName values:');
  for (const group of groups) {
    console.log(`  ${JSON.stringify(group.appName)}  (${group.name})`);
  }
  console.log('\n' + JSON.stringify(json, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
