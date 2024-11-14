"use server";

import { PaidTierNames, subscriptionTiers } from "@/data/subscritionTiers";
import { auth, currentUser, User } from "@clerk/nextjs/server";
import { getUserSubscription } from "../db/subscrition";
import { Stripe } from "stripe";
import { redirect } from "next/navigation";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
export async function createCheckoutSession(tier: PaidTierNames) {
  const user = await currentUser();
  if (user == null) {
    return { error: true };
  }

  const subscription = await getUserSubscription(user.id);
  if (subscription == null) return { error: true };

  if (subscription.stripeCustomerId == null) {
    const url = await getCheckOutSession(tier, user);
    if (url == null) return { error: true };
    redirect(url);
  } else {
    const url = await getSubscriptionUpgradeSession(tier, subscription);
    redirect(url);
  }
}

async function getSubscriptionUpgradeSession(
  tier: PaidTierNames,
  subscription: {
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
    stripeSubscriptionItemId: string | null;
  }
) {
  if (
    subscription.stripeCustomerId == null ||
    subscription.stripeSubscriptionId == null ||
    subscription.stripeSubscriptionItemId == null
  ) {
    throw new Error();
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`,
    flow_data: {
      type: "subscription_update_confirm",
      subscription_update_confirm: {
        subscription: subscription.stripeSubscriptionId,
        items: [
          {
            id: subscription.stripeSubscriptionItemId,
            price: subscriptionTiers[tier].stripePriceId ?? undefined,
            quantity: 1,
          },
        ],
      },
    },
  });

  return portalSession.url;
}

async function getCheckOutSession(tier: PaidTierNames, user: User) {
  if (!(tier in subscriptionTiers)) {
    throw new Error(`Tier "${tier}" does not exist in subscription tiers.`);
  }
  const tierData = subscriptionTiers[tier];

  const session = await stripe.checkout.sessions.create({
    customer_email: user.primaryEmailAddress?.emailAddress || undefined,
    subscription_data: {
      metadata: {
        clerkUserId: user.id,
      },
    },
    line_items: [
      {
        price: tierData.stripePriceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`,
  } as Stripe.Checkout.SessionCreateParams);

  return session.url;
}

export async function createCancelSession() {
  const user = await currentUser();
  if (user == null) return { error: true };
  const subscription = await getUserSubscription(user.id);
  if (subscription == null) return { error: true };

  if (
    subscription.stripeCustomerId == null ||
    subscription.stripeSubscriptionId
  ) {
    return new Response(null, { status: 500 });
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`,
    flow_data: {
      type: "subscription_cancel",
      subscription_cancel: {
        subscription: subscription.stripeCustomerId,
      },
    },
  });

  redirect(portalSession.url);
}
export async function createCustomerPortalSession() {
  const { userId } = await auth();
  if (userId == null) return { error: true };

  const subscription = await getUserSubscription(userId);
  if (subscription?.stripeCustomerId == null) return { error: true };

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`,
  });
  redirect(portalSession.url);
}
