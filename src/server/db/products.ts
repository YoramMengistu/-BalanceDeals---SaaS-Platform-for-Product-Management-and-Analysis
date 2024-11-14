import {
  CACHE_TAGS,
  dbCache,
  getGlobalTag,
  getIdTag,
  getUserTag,
  revalidateDbCache,
} from "@/lib/cache";
import { removeTrailingSlash } from "@/lib/utils";
import prisma from "@/prisma/prisma";
import { Prisma, Product, ProductCustomization } from "@prisma/client";
// import { Prisma, Product, ProductCustomization } from "@prisma/client";

export async function getProductCountryGroups({
  productId,
  userId,
}: {
  productId: string;
  userId: string;
}) {
  const cacheFn = dbCache(getProductCountryGroupsInternal, {
    tags: [
      getIdTag(productId, CACHE_TAGS.products),
      getGlobalTag(CACHE_TAGS.countries),
      getGlobalTag(CACHE_TAGS.countryGroups),
    ],
  });

  return cacheFn({ productId, userId });
}

export async function getProductCustomization({
  productId,
  userId,
}: {
  productId: string;
  userId: string;
}) {
  const cacheFn = dbCache(getProductCustomizationInternal, {
    tags: [getIdTag(productId, CACHE_TAGS.products)],
  });

  const customizations = await cacheFn({ productId, userId });

  return customizations ? customizations : null;
}

async function getProductCustomizationInternal({
  userId,
  productId,
}: {
  userId: string;
  productId: string;
}) {
  const data = await prisma.product.findFirst({
    where: {
      id: productId,
      clerkUserId: userId,
    },
    include: {
      productCustomization: true,
    },
  });

  return data?.productCustomization;
}

export async function getProducts(
  userId: string,
  { limit }: { limit?: number } = {}
) {
  const cacheFn = dbCache(getProductsInternal, {
    tags: [getUserTag(userId, CACHE_TAGS.products)],
  });

  return cacheFn(userId, { limit });
}

export async function getProduct({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  const cacheFn = dbCache(getProductInternal, {
    tags: [getIdTag(id, CACHE_TAGS.products)],
  });

  return cacheFn({ id, userId });
}

export async function getProductCount(userId: string) {
  const cacheFn = dbCache(getProductCountInternal, {
    tags: [getUserTag(userId, CACHE_TAGS.products)],
  });

  return cacheFn(userId);
}

export async function getProductForBanner({
  id,
  countryCode,
  url,
}: {
  id: string;
  countryCode: string;
  url: string;
}) {
  const cacheFn = dbCache(getProductForBannerInternal, {
    tags: [
      getIdTag(id, CACHE_TAGS.products),
      getGlobalTag(CACHE_TAGS.countries),
      getGlobalTag(CACHE_TAGS.countryGroups),
    ],
  });

  return cacheFn({ id, countryCode, url });
}

export async function createProduct(
  data: Omit<Product, "id" | "createAt" | "updateAt">
) {
  const newProduct = await prisma.product.create({
    data: {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      description: data.description ?? null,
    },
  });
  try {
    await prisma.productCustomization.create({
      data: {
        productId: newProduct.id,
      },
    });
  } catch (e) {
    await prisma.product.delete({
      where: {
        id: newProduct.id,
      },
    });
  }
  revalidateDbCache({
    tag: CACHE_TAGS.products,
    userId: newProduct.clerkUserId,
    id: newProduct.id,
  });
  return newProduct;
}

export async function updateProduct(
  data: Partial<Product>,
  {
    id,
    userId,
  }: {
    id: string;
    userId: string;
  }
) {
  try {
    // Update the product if it exists and belongs to the specified user
    const updatedProduct = await prisma.product.update({
      where: {
        clerkUserId: userId,
        id: id,
      },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    // Revalidate the cache after a successful update
    revalidateDbCache({
      tag: CACHE_TAGS.products,
      userId,
      id,
    });

    return updatedProduct; // Return the updated product
  } catch (error) {
    // Handle error (e.g., product not found or unauthorized)
    throw new Error("Product update failed"); // Or handle the error as needed
  }
}

export async function deleteProduct({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  try {
    // Delete the product if it exists and belongs to the specified user
    await prisma.product.delete({
      where: {
        id,
        clerkUserId: userId,
      },
    });

    // If deletion is successful, revalidate the cache
    revalidateDbCache({
      tag: CACHE_TAGS.products,
      userId,
      id,
    });

    return true;
  } catch (error) {
    return false;
  }
}

export async function updateCountryDiscounts(
  deleteGroup: { countryGroupId: string }[],
  insertGroup: Prisma.CountryGroupDiscountCreateManyInput[],
  { productId, userId }: { productId: string; userId: string }
) {
  const product = await getProduct({ id: productId, userId });
  if (product == null) return false;

  await prisma.$transaction(async (tx) => {
    // מחיקת קבוצות לפי productId ו-countryGroupId
    if (deleteGroup.length > 0) {
      await tx.countryGroupDiscount.deleteMany({
        where: {
          productId,
          countryGroupId: {
            in: deleteGroup.map((group) => group.countryGroupId),
          },
        },
      });
    }

    // הוספת קבוצות חדשות, תוך טיפול בקונפליקטים על פי productId ו-countryGroupId
    if (insertGroup.length > 0) {
      await tx.countryGroupDiscount.createMany({
        data: insertGroup,
        skipDuplicates: true, // מונע הכנסת ערכים כפולים
      });
    }
  });

  // ריענון הקאש
  revalidateDbCache({
    tag: CACHE_TAGS.products,
    userId,
    id: productId,
  });

  return true;
}

export async function updateProductCustomization(
  data: Partial<ProductCustomization>,
  { productId, userId }: { productId: string; userId: string }
) {
  const product = await getProduct({ id: productId, userId });
  if (product == null) return;

  await prisma.productCustomization.update({
    where: {
      productId: productId,
    },
    data,
  });

  revalidateDbCache({
    tag: CACHE_TAGS.products,
    userId,
    id: productId,
  });
}

async function getProductCountryGroupsInternal({
  userId,
  productId,
}: {
  userId: string;
  productId: string;
}) {
  const product = await getProduct({ id: productId, userId });
  if (product == null) return [];

  const data = await prisma.countryGroup.findMany({
    include: {
      countries: {
        select: {
          name: true,
          code: true,
        },
      },
      countryGroupDiscounts: {
        where: {
          productId,
        },
        select: {
          coupon: true,
          discountPercentage: true,
        },
      },
    },
  });

  return data.map((group) => ({
    id: group.id,
    name: group.name,
    recommendedDiscountPercentage: group.recommendedDiscountPercentage,
    countries: group.countries,
    discount: group.countryGroupDiscounts[0],
  }));
}

// async function getProductCustomizationInternal({
//   userId,
//   productId,
// }: {
//   userId: string;
//   productId: string;
// }) {
//   const data = await prisma.product.findFirst({
//     where: {
//       id: productId,
//       clerkUserId: userId,
//     },
//     include: {
//       productCustomization: true,
//     },
//   });

//   return data?.productCustomization;
// }

async function getProductsInternal(
  userId: string,
  { limit }: { limit?: number }
) {
  return prisma.product.findMany({
    where: {
      clerkUserId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });
}

async function getProductInternal({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  return prisma.product.findFirst({
    where: {
      clerkUserId: userId,
      id,
    },
  });
}

async function getProductCountInternal(userId: string) {
  const counts = await prisma.product.count({
    where: { clerkUserId: userId },
  });

  return counts;
}

async function getProductForBannerInternal({
  id,
  countryCode,
  url,
}: {
  id: string;
  countryCode: string;
  url: string;
}) {
  const data = await prisma.product.findFirst({
    where: {
      id: id,
      url: removeTrailingSlash(url),
    },
    select: {
      id: true,
      clerkUserId: true,
      productCustomization: true,
      countryDiscounts: {
        select: {
          coupon: true,
          discountPercentage: true,
          countryGroup: {
            select: {
              countries: {
                where: {
                  code: countryCode,
                },
                select: {
                  id: true,
                  name: true,
                },
                take: 1, // מגביל לתוצאה אחת
              },
            },
          },
        },
      },
    },
  });

  const discount = data?.countryDiscounts.find(
    (discount) => discount.countryGroup.countries.length > 0
  );
  const country = discount?.countryGroup.countries[0];
  const product =
    data == null || data.productCustomization == null
      ? undefined
      : {
          id: data.id,
          clerkUserId: data.clerkUserId,
          customization: data.productCustomization,
        };

  return {
    product,
    country,
    discount:
      discount == null
        ? undefined
        : {
            coupon: discount.coupon,
            percentage: discount.discountPercentage,
          },
  };
}
