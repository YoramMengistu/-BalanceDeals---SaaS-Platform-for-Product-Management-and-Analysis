import { subscriptionTiers } from "@/data/subscritionTiers";
import {
  CACHE_TAGS,
  dbCache,
  getUserTag,
  revalidateDbCache,
} from "@/lib/cache";
import prisma from "@/prisma/prisma";
import { Tier } from "@prisma/client";

// Create a user subscription
export async function createUserSubscription(
  data: { clerkUserId: string; tier: Tier } // השתמש ב-enum
) {
  const newSubscription = await prisma.userSubscription.create({
    data,
  });

  if (newSubscription) {
    revalidateDbCache({
      tag: CACHE_TAGS.subscription,
      id: newSubscription.id,
      userId: newSubscription.clerkUserId,
    });
  }

  return newSubscription;
}

// Get user subscription
export async function getUserSubscription(userId: string) {
  const cacheFn = dbCache(getUserSubscriptionInternal, {
    tags: [getUserTag(userId, CACHE_TAGS.subscription)],
  });

  return cacheFn(userId);
}

export async function updateUserSubscription(
  where: { clerkUserId?: string; stripeCustomerId?: string },
  data: {
    stripeCustomerId?: string;
    tier?: Tier;
    stripeSubscriptionId?: string;
    stripeSubscriptionItemId?: string;
  }
) {
  // איתור הרשומה המתאימה לעדכון
  const subscription = await prisma.userSubscription.findFirst({
    where,
  });

  if (!subscription) {
    throw new Error("Subscription not found");
  }

  // עדכון הרשומה שנמצאה
  const updatedSubscription = await prisma.userSubscription.update({
    where: { id: subscription.id },
    data,
  });

  // אם בוצע עדכון, מבצעים ריענון קאש
  if (updatedSubscription != null) {
    revalidateDbCache({
      tag: CACHE_TAGS.subscription,
      userId: updatedSubscription.clerkUserId,
      id: updatedSubscription.id,
    });
  }

  return updatedSubscription;
}

// Get user subscription tier
export async function getUserSubscriptionTier(userId: string) {
  const subscription = await getUserSubscription(userId);

  if (!subscription) throw new Error("User has no subscription");

  return subscriptionTiers[subscription.tier];
}

// Internal function to get user subscription
async function getUserSubscriptionInternal(userId: string) {
  return await prisma.userSubscription.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
}
