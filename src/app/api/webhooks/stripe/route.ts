import { getTierByPriceId, subscriptionTiers } from "@/data/subscritionTiers";
import { updateUserSubscription } from "@/server/db/subscrition";
import { NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
export async function POST(request: NextRequest) {
  const event = await stripe.webhooks.constructEvent(
    await request.text(),
    request.headers.get("stripe-signature") as string,
    process.env.STRIPE_WEBHOOK_SECRET as string
  );
  switch (event.type) {
    case "customer.subscription.deleted": {
      await handleDelete(event.data.object);
      break;
    }
    case "customer.subscription.updated": {
      await handleUpdate(event.data.object);
      break;
    }
    case "customer.subscription.created": {
      await handleCreated(event.data.object);
      break;
    }
  }
  return new Response(null, { status: 200 });
}

async function handleCreated(subscription: Stripe.Subscription) {
  const tier = getTierByPriceId(subscription.items.data[0].price.id);
  const clerkUserId = subscription.metadata.clerkUserId;

  if (clerkUserId == null || tier == null) {
    return new Response(null, { status: 500 });
  }
  const customer = subscription.customer;
  const customerId = typeof customer === "string" ? customer : customer.id;

  return await updateUserSubscription(
    { clerkUserId },
    {
      stripeCustomerId: customerId,
      tier: tier.name,
      stripeSubscriptionId: subscription.id,
      stripeSubscriptionItemId: subscription.items.data[0].id,
    }
  );
}

async function handleUpdate(subscription: Stripe.Subscription) {
  const tier = getTierByPriceId(subscription.items.data[0].price.id);
  const customer = subscription.customer;
  const customerId = typeof customer === "string" ? customer : customer.id;

  if (tier == null) {
    return new Response(null, { status: 500 });
  }

  return await updateUserSubscription(
    { stripeCustomerId: customerId },
    { tier: tier.name }
  );
}

async function handleDelete(subscription: Stripe.Subscription) {
  const customer = subscription.customer;
  const customerId = typeof customer === "string" ? customer : customer.id;

  return await updateUserSubscription(
    { stripeCustomerId: customerId },
    {
      tier: subscriptionTiers.FREE.name,
      stripeSubscriptionId: undefined,
      stripeSubscriptionItemId: undefined,
    }
  );
}
