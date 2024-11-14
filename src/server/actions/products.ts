"use server";

import {
  productCountryDiscountsSchema,
  productDetailsSchema,
} from "@/schemas/products";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { createProduct as createProductDb } from "@/server/db/products";
import { updateProduct as updateProductDb } from "@/server/db/products";
import { deleteProduct as deleteProductDb } from "@/server/db/products";
import { updateCountryDiscounts as updateCountryDiscountsDb } from "@/server/db/products";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "@/prisma/prisma";
import { canCreateProduct } from "../permissions";

export async function updateProduct(
  id: string,
  unsafeData: z.infer<typeof productDetailsSchema>
): Promise<{ error: boolean; message: string } | undefined> {
  const { userId } = await auth();
  const { success, data } = productDetailsSchema.safeParse(unsafeData);

  const errorMessage = "There was an error updating your product";

  if (!success || userId == null) {
    return { error: true, message: errorMessage };
  }

  const isSuccess = await updateProductDb(data, { id, userId });
}
export async function createProduct(
  unsafeData: z.infer<typeof productDetailsSchema>
): Promise<{ error: boolean; message: string } | undefined> {
  const { userId } = await auth();
  const { success, data } = productDetailsSchema.safeParse(unsafeData);

  const canCreate = await canCreateProduct(userId);
  if (!success || userId == null || !canCreate) {
    return { error: true, message: "there was an Error creating your product" };
  }

  const productData = {
    ...data,
    clerkUserId: userId,
    createdAt: new Date(),
    updatedAt: new Date(),
    description: data.description ?? null,
  };

  const { id } = await createProductDb(productData);

  redirect(`/dashboard/product/${id}/edit?tab=countries`);
}

export async function deleteProduct(id: string) {
  const { userId } = await auth();

  const errorMessage = "There was an error deleting your product";
  if (userId == null) {
    return { error: true, message: errorMessage };
  }
  const isSuccess = await deleteProductDb({ id, userId });

  revalidatePath("/dashboard");
  return {
    error: !isSuccess,
    message: isSuccess ? "Successfully deleted your product" : errorMessage,
  };
}

export async function updateCountryDiscounts(
  id: string,
  unSafeData: z.infer<typeof productCountryDiscountsSchema>
) {
  const { userId } = await auth(); // קבלת userId ישירות
  const { success, data } = productCountryDiscountsSchema.safeParse(unSafeData);

  if (!success || userId == null) {
    return {
      error: true,
      message: "There was an error saving your country discounts",
    };
  }

  const insert: {
    countryGroupId: string;
    productId: string;
    coupon: string;
    discountPercentage: number;
  }[] = [];
  const deleteIds: { countryGroupId: string }[] = [];

  data?.groups.forEach((group) => {
    if (
      group.coupon != null &&
      group.coupon.length > 0 &&
      group.discountPercentage != null &&
      group.discountPercentage > 0
    ) {
      insert.push({
        countryGroupId: group.countryGroupId,
        coupon: group.coupon,
        discountPercentage: group.discountPercentage / 100,
        productId: id,
      });
    } else {
      deleteIds.push({ countryGroupId: group.countryGroupId });
    }
  });

  if (deleteIds.length > 0) {
    await prisma.countryGroupDiscount.deleteMany({
      where: {
        countryGroupId: {
          in: deleteIds.map(({ countryGroupId }) => countryGroupId),
        },
        productId: id,
      },
    });
  }

  if (insert.length > 0) {
    await prisma.countryGroupDiscount.createMany({
      data: insert.map(
        ({ countryGroupId, coupon, discountPercentage, productId }) => ({
          countryGroupId,
          coupon,
          discountPercentage,
          productId,
        })
      ),
    });
  }

  await updateCountryDiscountsDb(deleteIds, insert, { productId: id, userId });
  return { error: false, message: "Country discounts saved" };
}
