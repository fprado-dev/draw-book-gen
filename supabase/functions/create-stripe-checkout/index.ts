// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import { createClient } from 'https://esm.sh/@supabase/supabase-js@1.35.5';
import Stripe from 'https://esm.sh/stripe?target=deno';

const stripe = Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: '2025-03-31.basil',
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

Deno.serve(async (req) => {
  const { planId } = await req.json();

  const token = req.headers.get('Authorization')!.replace('Bearer ', '');
  const { user } = await supabase.auth.api.getUser(token);

  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'apikey, X-Client-Info, Authorization',
      },
    });
  }
  const {
    data: { stripe_customer_id },
  } = await supabase
    .from('user_subscriptions')
    .select('stripe_customer_id')
    .match({ id: user.id })
    .single();

  const session = await stripe.checkout.sessions.create({
    customer: stripe_customer_id,
    payment_method_types: ['card'],
    mode: 'subscription',
    subscription_data: {
      items: [
        {
          plan: planId,
        },
      ],
    },
    success_url: `http://localhost:3000/dashboard?status=success`,
    cancel_url: `http://localhost:3000/dashboard?status=cancelled`,
  });

  return new Response(JSON.stringify({ id: session.id }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'apikey, X-Client-Info, Authorization',
    },
  });
});
