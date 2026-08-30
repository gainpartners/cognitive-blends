'use server';

import { revalidatePath } from 'next/cache';
import { customerFetch } from '@/lib/shopify/customer-account';

const CANCEL = `#graphql
  mutation CancelSubscription($id: ID!) {
    subscriptionContractCancel(subscriptionContractId: $id) {
      contract { id status }
      userErrors { field message }
    }
  }
`;

export async function cancelSubscriptionAction(formData: FormData) {
  const id = String(formData.get('subscriptionContractId') || '');
  if (!id) throw new Error('Missing subscription');

  const data = await customerFetch<{
    subscriptionContractCancel: {
      userErrors: { message: string }[];
    };
  }>(CANCEL, { id });

  const err = data.subscriptionContractCancel.userErrors[0];
  if (err) throw new Error(err.message);
  revalidatePath('/account');
}
