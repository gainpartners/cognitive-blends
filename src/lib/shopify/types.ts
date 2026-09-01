export type Money = {
  amount: string;
  currencyCode: string;
};

export type ShopifyImage = {
  url: string;
  altText?: string | null;
  width?: number;
  height?: number;
};

export type SellingPlan = {
  id: string;
  name: string;
  description?: string | null;
  recurringDeliveries?: boolean;
  options: { name: string; value: string }[];
  billingPolicy?: { interval: string; intervalCount: number } | null;
  priceAdjustments?: { adjustmentValue?: { adjustmentPercentage?: number } }[];
};

export type SellingPlanGroup = {
  name: string;
  appName?: string | null;
  sellingPlans: { nodes: SellingPlan[] };
};

export type SellingPlanAllocation = {
  sellingPlan: { id: string };
  priceAdjustments: {
    price: Money;
    compareAtPrice?: Money | null;
    perDeliveryPrice?: Money | null;
  }[];
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  sellingPlanAllocations: { nodes: SellingPlanAllocation[] };
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  descriptionHtml: string;
  images: { nodes: ShopifyImage[] };
  featuredImage?: ShopifyImage | null;
  priceRange?: { minVariantPrice: Money };
  rating?: { value: string; type: string } | null;
  ratingCount?: { value: string } | null;
  variants: { nodes: ProductVariant[] };
  sellingPlanGroups: { nodes: SellingPlanGroup[] };
};

export type ProductListItem = {
  id: string;
  handle: string;
  title: string;
  featuredImage?: ShopifyImage | null;
  priceRange: { minVariantPrice: Money };
  rating?: { value: string } | null;
  ratingCount?: { value: string } | null;
};

export type CartLine = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: { title: string; handle: string };
    image?: ShopifyImage | null;
    price: Money;
  };
  sellingPlanAllocation?: {
    sellingPlan: { id: string; name: string };
  } | null;
  cost: { totalAmount: Money };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { totalAmount: Money };
  lines: { nodes: CartLine[] };
};
