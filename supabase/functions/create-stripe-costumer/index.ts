import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { createClient } from "https://esm.sh/@supabase/supabase-js@1.35.5";
import Stripe from "https://esm.sh/stripe?target=deno";

const stripe = Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: "2025-03-31.basil",
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (req) => {
  const { record } = await req.json();

  const customer = await stripe.customers.create({
    email: record.email,
    metadata: {
      supabase_id: record.id,
    },
  });

  // Create a FREE subscription for the new customer
  await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ price: Deno.env.get("STRIPE_FREE_PRICE_ID")! }],
  });

  const { error } = await supabase
    .from("user_subscriptions")
    .insert({
      id: record.id,
      stripe_customer_id: customer.id,
    })
    .select();
  if (error) {
    console.error({ error });
  }


  return new Response(JSON.stringify({ stripe_customer_id: customer.id }), {
    headers: { "Content-Type": "application/json" },
  });
});

