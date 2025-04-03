import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { createClient } from "https://esm.sh/@supabase/supabase-js@1.35.5";
import Stripe from "https://esm.sh/stripe?target=deno";

const stripe = Stripe(Deno.env.get("STRIPE_SECRET_KEY"), {
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: "2025-03-31.basil",
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);


// This is needed in order to use the Web Crypto API in Deno.
const cryptoProvider = Stripe.createSubtleCryptoProvider();

console.log(`Function "stripe-webhooks" up and running!`);

Deno.serve(async (request) => {
  const signature = request.headers.get("Stripe-Signature");

  // First step is to verify the event. The .text() method must be used as the
  // verification relies on the raw request body rather than the parsed JSON.
  const body = await request.text();
  let receivedEvent;
  try {
    receivedEvent = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get("STRIPE_SIGNING_SECRET"),
      undefined,
      cryptoProvider
    );
  } catch (err) {
    return new Response(err.message, { status: 400 });
  }
  console.log(`🔔 Event received: ${receivedEvent.id}`);

  // Secondly, we use this event to query the Stripe API in order to avoid
  // handling any forged event. If available, we use the idempotency key.
  const requestOptions =
    receivedEvent.request && receivedEvent.request.idempotency_key
      ? {
        idempotencyKey: receivedEvent.request.idempotency_key,
      }
      : {};

  let retrievedEvent;
  try {
    retrievedEvent = await stripe.events.retrieve(
      receivedEvent.id,
      requestOptions
    );
  } catch (err) {
    return new Response(err.message, { status: 400 });
  }

  const subscription = retrievedEvent.data.object;

  const handleCreditsUpdate = (plan: string) => {
    switch (plan) {
      case "PRO":
        return 500;
      case "PREMIUM":
        return 2000;
      default:
        return 0;
    }
  };
  switch (retrievedEvent.type) {
    case "customer.subscription.deleted":
      await supabase
        .from("user_subscriptions")
        .update({
          plan: "FREE",
        })
        .match({ stripe_customer_id: subscription.customer });
      // Then define and call a function to handle the retrievedEvent customer.subscription.deleted
      break;
    case "customer.subscription.updated":
      const product = await stripe.products.retrieve(subscription.plan.product);
      await supabase
        .from("user_subscriptions")
        .update({
          plan: product.name.toUpperCase(),
          credits: handleCreditsUpdate(product.name.toUpperCase()),
        })
        .match({ stripe_customer_id: subscription.customer });
      // Then define and call a function to handle the retrievedEvent customer.subscription.updated
      break;
    // ... handle other retrievedEvent types
    default:
      console.log(`Unhandled retrievedEvent type ${retrievedEvent.type}`);
  }

  return new Response(JSON.stringify({ id: retrievedEvent.id, status: "ok" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});



