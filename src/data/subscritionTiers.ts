export type TierNames = keyof typeof subscriptionTiers;
export type PaidTierNames = Exclude<TierNames, "Free">;

export const subscriptionTiers = {
  FREE: {
    name: "FREE",
    priceInCents: 0,
    maxNumberOfProducts: 1,
    maxNumberOfVisits: 5000,
    canAccessAnalytics: false,
    canCustomizeBanner: false,
    canRemoveBranding: false,
    stripePriceId: null,
  },
  BASIC: {
    name: "BASIC",
    priceInCents: 1900,
    maxNumberOfProducts: 5,
    maxNumberOfVisits: 10000,
    canAccessAnalytics: true,
    canCustomizeBanner: false,
    canRemoveBranding: true,
    stripePriceId: process.env.STRIPE_BASIC_PLAN_PRICE_ID as string,
  },
  STANDARD: {
    name: "STANDARD",
    priceInCents: 4900,
    maxNumberOfProducts: 30,
    maxNumberOfVisits: 100000,
    canAccessAnalytics: true,
    canCustomizeBanner: true,
    canRemoveBranding: true,
    stripePriceId: process.env.STRIPE_STANDARD_PLAN_PRICE_ID as string,
  },
  PREMIUM: {
    name: "PREMIUM",
    priceInCents: 9900,
    maxNumberOfProducts: 50,
    maxNumberOfVisits: 1000000,
    canAccessAnalytics: true,
    canCustomizeBanner: true,
    canRemoveBranding: true,
    stripePriceId: process.env.STRIPE_PREMIUM_PLAN_PRICE_ID as string,
  },
} as const;

export const subscriptionTiersInOrder = [
  subscriptionTiers.FREE,
  subscriptionTiers.BASIC,
  subscriptionTiers.STANDARD,
  subscriptionTiers.PREMIUM,
] as const;

export function getTierByPriceId(stripePriceId: string) {
  return Object.values(subscriptionTiers).find(
    (tier) => tier.stripePriceId === stripePriceId
  );
}
