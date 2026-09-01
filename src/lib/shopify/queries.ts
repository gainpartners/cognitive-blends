const PRODUCT_CARD_FIELDS = `#graphql
  fragment ProductCardFields on Product {
    id
    handle
    title
    featuredImage { url altText width height }
    priceRange { minVariantPrice { amount currencyCode } }
    rating: metafield(namespace: "reviews", key: "rating") { value }
    ratingCount: metafield(namespace: "reviews", key: "rating_count") { value }
    variants(first: 1) {
      nodes {
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
        sellingPlanAllocations(first: 10) {
          nodes {
            sellingPlan { id name }
            priceAdjustments {
              price { amount currencyCode }
              compareAtPrice { amount currencyCode }
            }
          }
        }
      }
    }
  }
`;

export const PRODUCTS_QUERY = `#graphql
  query Products {
    products(first: 20) {
      nodes { ...ProductCardFields }
    }
  }
  ${PRODUCT_CARD_FIELDS}
`;

export const FRONTPAGE_QUERY = `#graphql
  query Frontpage {
    collection(handle: "frontpage") {
      products(first: 12) {
        nodes { ...ProductCardFields }
      }
    }
  }
  ${PRODUCT_CARD_FIELDS}
`;

export const PRODUCT_QUERY = `#graphql
  query Product($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      descriptionHtml
      images(first: 6) { nodes { url altText width height } }
      rating: metafield(namespace: "reviews", key: "rating") { value type }
      ratingCount: metafield(namespace: "reviews", key: "rating_count") { value }
      variants(first: 10) {
        nodes {
          id
          title
          availableForSale
          price { amount currencyCode }
          sellingPlanAllocations(first: 20) {
            nodes {
              sellingPlan { id }
              priceAdjustments {
                price { amount currencyCode }
                compareAtPrice { amount currencyCode }
                perDeliveryPrice { amount currencyCode }
              }
            }
          }
        }
      }
      sellingPlanGroups(first: 10) {
        nodes {
          name
          appName
          sellingPlans(first: 20) {
            nodes {
              id
              name
              description
              recurringDeliveries
              options { name value }
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

export const CART_FRAGMENT = `#graphql
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost { totalAmount { amount currencyCode } }
    lines(first: 50) {
      nodes {
        id
        quantity
        cost { totalAmount { amount currencyCode } }
        sellingPlanAllocation { sellingPlan { id name } }
        merchandise {
          ... on ProductVariant {
            id
            title
            price { amount currencyCode }
            image { url altText width height }
            product { title handle }
          }
        }
      }
    }
  }
`;

export const CART_QUERY = `#graphql
  query Cart($id: ID!) {
    cart(id: $id) { ...CartFields }
  }
  ${CART_FRAGMENT}
`;

export const CART_CREATE = `#graphql
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
  ${CART_FRAGMENT}
`;

export const CART_LINES_ADD = `#graphql
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
  ${CART_FRAGMENT}
`;

export const CART_LINES_REMOVE = `#graphql
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
  ${CART_FRAGMENT}
`;
