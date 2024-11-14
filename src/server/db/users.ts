import { CACHE_TAGS, revalidateDbCache } from "@/lib/cache";
import prisma from "@/prisma/prisma";


export async function deleteUser(clerkUserId: string) {
  // First, delete user subscriptions
  const userSubscriptions = await prisma.userSubscription.deleteMany({
    where: {
      clerkUserId: clerkUserId,
    },
  });

  // Then, delete products
  const products = await prisma.product.deleteMany({
    where: {
      clerkUserId: clerkUserId,
    },
  });

  // Revalidate cache for user subscriptions
  userSubscriptions.forEach(sub => {
    revalidateDbCache({
      tag: CACHE_TAGS.subscription,
      id: sub.id,
      userId: clerkUserId,
    });
  });

  // Revalidate cache for products
  products.forEach(prod => {
    revalidateDbCache({
      tag: CACHE_TAGS.products,
      id: prod.id,
      userId: clerkUserId,
    });
  });

  return { userSubscriptions, products };
}
