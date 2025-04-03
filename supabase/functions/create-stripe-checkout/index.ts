// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import Stripe from "https://esm.sh/stripe?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@1.35.5";

const stripe = Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: "2025-02-24.acacia",
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);


Deno.serve(async (req) => {

  const { planId, stripe_customer_id } = await req.json();

  const token = req.headers.get("Authorization")!.replace("Bearer ", "");
  const { user } = await supabase.auth.api.getUser(token);

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "apikey, X-Client-Info, Authorization",
      },
    });
  }

  const session = await stripe.checkout.sessions.create({
    customer: stripe_customer_id,
    payment_method_types: ["card"],
    mode: "subscription",
    subscription_data: {
      items: [
        {
          plan: planId,
        },
      ],
    },
    success_url: `http://localhost:3000/success`,
    cancel_url: `http://localhost:3000/cancel`,
  });

  return new Response(JSON.stringify({ id: session.id }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "apikey, X-Client-Info, Authorization",
    },
  });

})

