import { Banner } from "@/components/ui/Banner";
import { getProductForBanner } from "@/server/db/products";
import { createProductView } from "@/server/db/productView";
import { canRemoveBranding, canShowDiscountBanner } from "@/server/permissions";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { NextRequest } from "next/server";
import { createElement } from "react";

export async function GET(
  request: NextRequest,
  { params: productId }: { params: string }
) {
  const headerMap = headers();
  const requestUrl =
    (await headerMap).get("referer") || (await headerMap).get("origin");

  if (requestUrl == null) return notFound();

  const countryCode = getCountryCode(request);
  if (countryCode == null) return notFound();

  const { product, discount, country } = await getProductForBanner({
    id: productId,
    countryCode,
    url: requestUrl,
  });

  if (product == null) return notFound();

  const canShowBanner = await canShowDiscountBanner(product.clerkUserId);

  await createProductView({
    productId: product.id,
    countryId: country?.id,
    userId: product.clerkUserId,
  });

  if (!canShowBanner) return notFound();

  if (country == null || discount == null) return notFound();

  if (product.customization == null) return notFound();

  return new Response(
    await getJavaScript(
      {
        customization: product.customization || {
          locationMessage: "",
          bannerContainer: "",
          backgroundColor: "",
          textColor: "",
          fontSize: "",
          isSticky: false,
        },
      },

      country,
      discount,
      await canRemoveBranding(product.clerkUserId)
    ),
    { headers: { "content-type": "text/javascript" } }
  );
}

async function getJavaScript(
  product: {
    customization: {
      locationMessage: string;
      bannerContainer: string;
      backgroundColor: string;
      textColor: string;
      fontSize: string;
      isSticky: boolean;
      classPrefix?: string | null;
    };
  },
  country: { name: string },
  discount: { coupon: string; percentage: number },
  canRemoveBranding: boolean
) {
  const { renderToStaticMarkup } = await import("react-dom/server");
  return `
      const banner = document.createElement("div");
      banner.innerHTML = '${renderToStaticMarkup(
        createElement(Banner, {
          message: product.customization.locationMessage,
          mappings: {
            country: country.name,
            coupon: discount.coupon,
            discount: (discount.percentage * 100).toString(),
          },
          customization: product.customization,
          canRemoveBranding,
        })
      )}';
      document.querySelector("${
        product.customization.bannerContainer
      }").prepend(...banner.children);
    `.replace(/(\r\n|\n|\r)/g, "");
}

interface GeoInfo {
  country?: string;
}
function getCountryCode(request: NextRequest) {
  const geo = (request as any).geo as GeoInfo | undefined; // המרה ל-any עבור geo

  if (geo?.country != null) {
    return geo.country;
  }
  if (process.env.NODE_ENV === "development") {
    return process.env.TEST_COUNTRY_CODE;
  }

  // ערך ברירת מחדל במקרה שאין מידע גיאוגרפי זמין
  return null;
}
