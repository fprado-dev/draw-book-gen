import { loadStripe } from '@stripe/stripe-js';

export const loadStripeService = () => {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
};
