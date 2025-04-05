'use server';

import { createClient } from '@/utils/supabase/server';
import Stripe from 'stripe';

export interface UserStats {
  totalBooks: number;
  totalImages: number;
  totalOutlines: number;
}

export interface DailyImageStats {
  date: string;
  images: number;
}

export interface DailyOutlinesStats {
  date: string;
  outlines: number;
}

export async function getUserStats(): Promise<UserStats> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth?.getUser();
  try {
    // Get books count
    const { count: booksCount, error: booksError } = await supabase
      .from('books')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user?.id);

    if (booksError) throw booksError;

    // Get Outlines count
    const { count: outlinesCount, error: outlinesError } = await supabase
      .from('outlines')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user?.id);

    if (outlinesError) throw outlinesError;

    // Get images count from storage by listing all book folders and their contents
    const { data: userImages, error: userImagesError } = await supabase.storage
      .from('users-generated-images')
      .list(`${user?.id}`, {
        limit: 100000,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      });

    if (userImagesError) throw userImagesError;

    return {
      totalBooks: booksCount || 0,
      totalImages: userImages.length || 0,
      totalOutlines: outlinesCount || 0,
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
}

export async function getDailyImageStats(): Promise<DailyImageStats[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth?.getUser();
  try {
    const { data: userImages, error: userImagesError } = await supabase.storage
      .from('users-generated-images')
      .list(`${user?.id}`, {
        limit: 100000,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      });

    if (userImagesError) throw userImagesError;

    // Store image counts by date
    const imagesByDate = new Map<string, number>();

    if (userImages) {
      // Group images by date
      userImages?.forEach((image) => {
        const date = new Date(image.created_at).toISOString().split('T')[0];
        imagesByDate.set(date, (imagesByDate.get(date) || 0) + 1);
      });
    }

    // Convert map to array and sort by date
    const stats = Array.from(imagesByDate.entries())
      .map(([date, images]) => ({ date, images }))
      .sort((a, b) => a.date.localeCompare(b.date));
    return stats;
  } catch (error) {
    console.error('Error fetching daily image stats:', error);
    throw error;
  }
}

export async function getDailyOutlineStats(): Promise<DailyOutlinesStats[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth?.getUser();
  try {
    const { data: outlines, error } = await supabase
      .from('outlines')
      .select('created_at')
      .eq('user_id', user?.id);

    if (error) throw error;

    // Store outline counts by date
    const outlinesByDate = new Map<string, number>();

    // Group outlines by date
    outlines?.forEach((outline) => {
      const date = new Date(outline.created_at).toISOString().split('T')[0];
      outlinesByDate.set(date, (outlinesByDate.get(date) || 0) + 1);
    });

    // Convert map to array and sort by date
    const stats = Array.from(outlinesByDate.entries())
      .map(([date, outlines]) => ({ date, outlines }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return stats;
  } catch (error) {
    console.error('Error fetching daily outline stats:', error);
    throw error;
  }
}

type TUserSubscriptions = {
  created_at: string;
  credits: number;
  credits_usage: number;
  id: string;
  plan: string;
  stripe_customer_id: string;
  plans: {
    id: string;
    name: string;
    price: number;
    currency: string;
    features: {
      id: string;
      credits_available: string;
      included: string;
      online: string;
      plus: string;
      resolution: string;
      support: string;
    };
  }[];
};

export async function getUserSubscriptionsData(): Promise<TUserSubscriptions> {
  const supabase = await createClient();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    httpClient: Stripe.createFetchHttpClient(),
  });

  const {
    data: { user },
  } = await supabase.auth?.getUser();
  try {
    const { data: user_subscriptions, error: userDataError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('id', user?.id)
      .single();

    if (userDataError) throw userDataError;

    const { data: prices } = await stripe.prices.list();
    const unsortedPlans = await Promise.all(
      prices.map(async (price) => {
        const product = await stripe.products.retrieve(String(price.product));

        if (price?.unit_amount === undefined || price?.unit_amount === null) {
          throw new Error(`Price ${price.id} has no unit amount`);
        }

        return {
          id: price.id,
          name: product.name,
          price: price?.unit_amount / 100,
          currency: price.currency,
          features: {
            ...product.metadata,
          },
        };
      })
    );

    const plans = unsortedPlans.sort((a, b) => a.price - b.price);
    return {
      ...user_subscriptions,
      plans,
    };
  } catch (error) {
    console.error('Error fetching daily outline stats:', error);
    throw error;
  }
}

type THandleStripeCheckout = {
  planId: string;
};

export async function handleStripeCheckout({
  planId,
}: THandleStripeCheckout): Promise<{ url: string; id: string }> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.functions.invoke(
      'create-stripe-checkout',
      {
        body: { planId },
      }
    );

    if (error) throw error;
    return { url: data.url, id: data.id };
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    throw error;
  }
}

export async function handleStripeCustomerPortal(): Promise<{ url: string }> {
  const supabase = await createClient();

  const { data, error } = await supabase.functions.invoke(
    'stripe-customer-portal'
  );
  if (error) throw error;
  return { url: data.url };
}
