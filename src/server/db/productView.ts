// import {
//   CACHE_TAGS,
//   dbCache,
//   getGlobalTag,
//   getIdTag,
//   getUserTag,
//   revalidateDbCache,
// } from "@/lib/cache";
// import { startOfDay, subDays } from "date-fns";
// // import { tz } from "date-fns/tz";
// import prisma from "@/prisma/prisma";
// import { toZonedTime } from "date-fns-tz"; // Import the required function

// export function getProductViewCount(userId: string, startDate: Date) {
//   const cacheFn = dbCache(getProductViewCountInternal, {
//     tags: [getUserTag(userId, CACHE_TAGS.productViews)],
//   });

//   return cacheFn(userId, startDate);
// }

// // export function getViewsByCountryChartData({
// //   timezone,
// //   productId,
// //   userId,
// //   interval,
// // }: {
// //   timezone: string;
// //   productId?: string;
// //   userId: string;
// //   interval: (typeof CHART_INTERVALS)[keyof typeof CHART_INTERVALS];
// // }) {
// //   const cacheFn = dbCache(getViewsByCountryChartDataInternal, {
// //     tags: [
// //       getUserTag(userId, CACHE_TAGS.productViews),
// //       productId == null
// //         ? getUserTag(userId, CACHE_TAGS.products)
// //         : getIdTag(productId, CACHE_TAGS.products),
// //       getGlobalTag(CACHE_TAGS.countries),
// //     ],
// //   });

// //   return cacheFn({
// //     timezone,
// //     productId,
// //     userId,
// //     interval,
// //   });
// // }

// export function getViewsByCountryChartData({
//   timezone,
//   productId,
//   userId,
//   interval,
// }: {
//   timezone: string;
//   productId?: string;
//   userId: string;
//   interval: (typeof CHART_INTERVALS)[keyof typeof CHART_INTERVALS];
// }) {
//   const cacheFn = dbCache(getViewsByCountryChartDataInternal, {
//     tags: [
//       getUserTag(userId, CACHE_TAGS.productViews),
//       productId == null
//         ? getUserTag(userId, CACHE_TAGS.products)
//         : getIdTag(productId, CACHE_TAGS.products),
//       getGlobalTag(CACHE_TAGS.countries),
//     ],
//   });

//   return cacheFn({
//     timezone,
//     productId,
//     userId,
//     interval,
//   });
// }
// type IntervalType = {
//   startDate: Date;
//   endDate: Date;
//   dateFormatter: (date: Date) => string;
//   label: string;
//   sql: string;
//   dateGrouper: (col: any) => string;
// };
// // export function getViewsByPPPChartData({
// //   timezone,
// //   productId,
// //   userId,
// //   interval,
// // }: {
// //   timezone: string;
// //   productId?: string;
// //   userId: string;
// //   interval: IntervalType; // משתמשים בטיפוס הזה
// // }) {
// //   const { startDate, endDate } = interval; // אפשר להוציא את שני השדות בלי בדיקות נוספות

// //   const cacheFn = dbCache(getViewsByPPPChartDataInternal, {
// //     tags: [
// //       getUserTag(userId, CACHE_TAGS.productViews),
// //       productId == null
// //         ? getUserTag(userId, CACHE_TAGS.products)
// //         : getIdTag(productId, CACHE_TAGS.products),
// //       getGlobalTag(CACHE_TAGS.countries),
// //       getGlobalTag(CACHE_TAGS.countryGroups),
// //     ],
// //   });

// //   return cacheFn({
// //     timezone,
// //     productId,
// //     userId,
// //     interval,
// //   });
// // }

// // async function getViewsByPPPChartDataInternal({
// //   timezone,
// //   productId,
// //   userId,
// //   interval,
// // }: {
// //   timezone: string;
// //   productId?: string;
// //   userId: string;
// //   interval: { startDate: Date; endDate: Date }; // Adjust type as needed
// // }) {
// //   const zonedStartDate = toZonedTime(interval.startDate, timezone);
// //   const startDate = startOfDay(zonedStartDate);

// //   // Get product IDs based on userId and optional productId
// //   const products = await prisma.product.findMany({
// //     where: {
// //       clerkUserId: userId,
// //       ...(productId ? { id: productId } : {}),
// //     },
// //     select: { id: true }, // Select only IDs
// //   });

// //   const productIds = products.map((product) => product.id);

// //   // Query to count views by country group
// //   const result = await prisma.countryGroup.findMany({
// //     select: {
// //       name: true,
// //       countries: {
// //         select: {
// //           views: {
// //             where: {
// //               visitedAt: {
// //                 gte: startDate,
// //               },
// //               country: {
// //                 countryGroupId: {
// //                   in: productIds,
// //                 },
// //               },
// //             },
// //           },
// //         },
// //         orderBy: {
// //           name: "asc",
// //         },
// //       },
// //     },
// //   });

// //   const viewCount = result.map((group) => ({
// //     name: group.name,
// //     views: group.countries.reduce(
// //       (sum, country) => sum + (country.views.length || 0),
// //       0
// //     ),
// //   }));
// //   return viewCount;
// // }
// export function getViewsByPPPChartData({
//   timezone,
//   productId,
//   userId,
//   interval,
// }: {
//   timezone: string;
//   productId?: string;
//   userId: string;
//   interval: (typeof CHART_INTERVALS)[keyof typeof CHART_INTERVALS];
// }) {
//   const cacheFn = dbCache(getViewsByPPPChartDataInternal, {
//     tags: [
//       getUserTag(userId, CACHE_TAGS.productViews),
//       productId == null
//         ? getUserTag(userId, CACHE_TAGS.products)
//         : getIdTag(productId, CACHE_TAGS.products),
//       getGlobalTag(CACHE_TAGS.countries),
//       getGlobalTag(CACHE_TAGS.countryGroups),
//     ],
//   });

//   return cacheFn({
//     timezone,
//     productId,
//     userId,
//     interval,
//   });
// }

// // async function getViewsByPPPChartDataInternal({
// //   timezone,
// //   productId,
// //   userId,
// //   interval,
// // }: {
// //   timezone: string;
// //   productId?: string;
// //   userId: string;
// //   interval: (typeof CHART_INTERVALS)[keyof typeof CHART_INTERVALS];
// // }) {
// //   const zonedStartDate = toZonedTime(interval.startDate, timezone);
// //   const startDate = startOfDay(zonedStartDate);

// //   // השגת views על פי הנתונים
// //   const productViews = await prisma.productView.findMany({
// //     where: {
// //       visitedAt: {
// //         gte: startDate,
// //       },
// //       product: {
// //         clerkUserId: userId,
// //       },
// //       ...(productId ? { productId: productId } : {}),
// //     },
// //     select: {
// //       visitedAt: true,
// //       productId: true,
// //       countryId: true,
// //       product: {
// //         select: {
// //           countryDiscounts: true, // לבחור את ה-countryGroupId של המוצר
// //         },
// //       },
// //       country: {
// //         select: {
// //           countryGroupId: true, // לבחור את ה-countryGroupId של המדינה
// //         },
// //       },
// //     },
// //   });

// //   // השגת נתוני קבוצות מדינה
// //   const countryGroupData = await prisma.countryGroup.findMany({
// //     select: {
// //       name: true,
// //       id: true,
// //     },
// //   });

// //   // חישוב כמות views עבור כל group
// //   const result = countryGroupData.map((countryGroup) => {
// //     const views = productViews.filter((view) => {
// //       const isCountryMatch =
// //         view.country && view.country.countryGroupId === countryGroup.id;

// //       // חיפוש ב-`countryDiscounts` כדי למצוא את ה-`countryGroupId`
// //       const isProductMatch = view.product.countryDiscounts.some(
// //         (discount) => discount.countryGroupId === countryGroup.id
// //       );

// //       return isCountryMatch || isProductMatch;
// //     }).length;

// //     return {
// //       pppName: countryGroup.name,
// //       views: views,
// //     };
// //   });

// //   // סידור התוצאות לפי שם ה-ppp
// //   return result.sort((a, b) => a.pppName.localeCompare(b.pppName));
// // }
// async function getViewsByPPPChartDataInternal({
//   timezone,
//   productId,
//   userId,
//   interval,
// }: {
//   timezone: string;
//   productId?: string;
//   userId: string;
//   interval: (typeof CHART_INTERVALS)[keyof typeof CHART_INTERVALS];
// }) {
//   // מחשבים את התאריך ההתחלתי
//   const zonedStartDate = toZonedTime(interval.startDate, timezone);
//   const startDate = startOfDay(zonedStartDate);

//   // אם אתה צריך לשלב מסד נתונים שקשור למוצרים, הכנס את הקריאה המתאימה כאן
//   const products = await prisma.product.findMany({
//     where: {
//       clerkUserId: userId,
//       id: productId ? productId : undefined, // בודק אם יש productId
//     },
//   });

//   // נשמור את רשימת ה-IDs של המוצרים שנמצאו
//   const productIds = products.map((product) => product.id);

//   // חיפוש נתוני הצפיות
//   const productViews = await prisma.productView.findMany({
//     where: {
//       productId: {
//         in: productIds,
//       },
//       visitedAt: {
//         gte: startDate, // רק צפיות אחרי התאריך ההתחלתי
//       },
//     },
//     select: {
//       visitedAt: true,
//       countryId: true,
//     },
//   });

//   // חיפוש קבוצות המדינות
//   const countryGroups = await prisma.countryGroup.findMany({
//     include: {
//       countries: true, // הנחה שיש קשר בין מדינות לקבוצות
//     },
//   });

//   // קבוצת נתונים שמכילה את הצפיות לפי קבוצת מדינות
//   const viewsByCountryGroup = countryGroups.map((group) => {
//     const viewsCount = productViews.filter((view) =>
//       group.countries.some((country) => country.id === view.countryId)
//     ).length;

//     return {
//       pppName: group.name,
//       views: viewsCount,
//     };
//   });

//   return viewsByCountryGroup;
// }
// export function getViewsByDayChartData({
//   timezone,
//   productId,
//   userId,
//   interval,
// }: {
//   timezone: string;
//   productId?: string;
//   userId: string;
//   interval: (typeof CHART_INTERVALS)[keyof typeof CHART_INTERVALS];
// }) {
//   const cacheFn = dbCache(getViewsByDayChartDataInternal, {
//     tags: [
//       getUserTag(userId, CACHE_TAGS.productViews),
//       productId == null
//         ? getUserTag(userId, CACHE_TAGS.products)
//         : getIdTag(productId, CACHE_TAGS.products),
//     ],
//   });

//   return cacheFn({
//     timezone,
//     productId,
//     userId,
//     interval,
//   });
// }

// export async function createProductView({
//   productId,
//   countryId,
//   userId,
// }: {
//   productId: string;
//   countryId?: string;
//   userId: string;
// }) {
//   const newRow = await prisma.productView.create({
//     data: {
//       productId: productId,
//       visitedAt: new Date(),
//       countryId: countryId,
//     },
//   });

//   if (newRow != null) {
//     revalidateDbCache({ tag: CACHE_TAGS.productViews, userId, id: newRow.id });
//   }
// }

// async function getProductViewCountInternal(userId: string, startDate: Date) {
//   const count = await prisma.productView.count({
//     where: {
//       product: {
//         clerkUserId: userId,
//       },
//       visitedAt: {
//         gte: startDate,
//       },
//     },
//   });

//   return count ?? 0;
// }

// // async function getViewsByCountryChartDataInternal({
// //   timezone,
// //   productId,
// //   userId,
// //   interval,
// // }: {
// //   timezone: string;
// //   productId?: string;
// //   userId: string;
// //   interval: (typeof CHART_INTERVALS)[keyof typeof CHART_INTERVALS];
// // }) {
// //   const startDate = toZonedTime(startOfDay(new Date()), timezone); // שימוש באזור זמן
// //   const products = await getProductSubQuery(userId, productId);
// //   const productIds = products.map((product) => product.id);
// //   const productViews = await prisma.productView.groupBy({
// //     by: ["countryId"],
// //     where: {
// //       productId: {
// //         in: productIds,
// //       },
// //       visitedAt: {
// //         gte: startDate,
// //       },
// //       product: {
// //         clerkUserId: userId,
// //         id: productId,
// //       },
// //     },
// //     _count: {
// //       visitedAt: true,
// //     },
// //     orderBy: {
// //       _count: {
// //         visitedAt: "desc",
// //       },
// //     },
// //   });

// //   // סנן ערכים null לפני השימוש ב-in
// //   const countryIds = productViews
// //     .map((view) => view.countryId)
// //     .filter((id): id is string => id !== null);

// //   const countryData = await prisma.country.findMany({
// //     where: {
// //       id: {
// //         in: countryIds,
// //       },
// //     },
// //   });

// //   return productViews.map((view) => ({
// //     views: view._count.visitedAt,
// //     countryName: countryData.find((country) => country.id === view.countryId)
// //       ?.name,
// //     countryCode: countryData.find((country) => country.id === view.countryId)
// //       ?.code,
// //   }));
// // }
// async function getViewsByCountryChartDataInternal({
//   timezone,
//   productId,
//   userId,
//   interval,
// }: {
//   timezone: string;
//   productId?: string;
//   userId: string;
//   interval: (typeof CHART_INTERVALS)[keyof typeof CHART_INTERVALS];
// }) {
//   const zonedStartDate = toZonedTime(interval.startDate, timezone);
//   const startDate = startOfDay(zonedStartDate);
//   console.log(productId);
//   // מבנה השאילתה ב-Prisma
//   // return await prisma.productView.findMany({
//   //   select: {
//   //     visitedAt: true, // יתן לנו את השדה visitedAt לשימוש בהשוואה
//   //     country: {
//   //       select: {
//   //         name: true,
//   //         code: true,
//   //       },
//   //     },
//   //   },
//   //   where: {
//   //     product: {
//   //       clerkUserId: userId, // חיבור למודל Product כדי לסנן לפי userId
//   //       id: productId ? productId : undefined, // אם יש productId, מסנן גם אותו
//   //     },
//   //     visitedAt: {
//   //       gte: startDate, // מסנן את ה-visitedAt לפי תאריך התחלה
//   //     },
//   //   },
//   //   orderBy: {
//   //     visitedAt: "desc", // מסדר לפי תאריך הצפייה
//   //   },
//   //   take: 25, // מגביל את מספר התוצאות ל-25
//   // });
//   return await prisma.productView.findMany({
//     select: {
//       visitedAt: true, // יתן לנו את השדה visitedAt לשימוש בהשוואה
//       country: {
//         select: {
//           name: true,
//           code: true,
//         },
//       },
//     },
//     where: {
//       product: {
//         clerkUserId: userId, // חיבור למודל Product כדי לסנן לפי userId
//         id: productId || undefined, // אם יש productId, מסנן גם אותו (אם לא, בודק לפי userId בלבד)
//       },
//       visitedAt: {
//         gte: startDate, // מסנן את ה-visitedAt לפי תאריך התחלה
//       },
//     },
//     orderBy: {
//       visitedAt: "desc", // מסדר לפי תאריך הצפייה
//     },
//     take: 25, // מגביל את מספר התוצאות ל-25
//   });
// }

// async function getViewsByDayChartDataInternal({
//   timezone,
//   productId,
//   userId,
//   interval,
// }: {
//   timezone: string;
//   productId?: string;
//   userId: string;
//   interval: (typeof CHART_INTERVALS)[keyof typeof CHART_INTERVALS];
// }) {
//   // מוצאים את רשומות המוצר המתאימות על פי userId ו-productId
//   const products = await prisma.product.findMany({
//     where: {
//       clerkUserId: userId,
//       id: productId || undefined, // אם אין productId, אנחנו לא מגבילים אותו
//     },
//     select: {
//       id: true,
//     },
//   });

//   // אם אין מוצרים, נחזיר מערך ריק
//   if (products.length === 0) {
//     return [];
//   }

//   const productIds = products.map((product) => product.id);

//   // מחשבים את startDate כדי לעצב את טווח הזמן
//   const startDate = new Date(interval.startDate); // ודא שהערך מגיע בצורה נכונה

//   // יוצרים את השאילתה עם Prisma
//   const productViews = await prisma.productView.groupBy({
//     by: ["visitedAt"],
//     where: {
//       visitedAt: {
//         gte: startDate,
//       },
//       productId: {
//         in: productIds,
//       },
//     },
//     _count: {
//       visitedAt: true,
//     },
//   });

//   // מעצבים את התוצאה
//   const formattedData = productViews.map((view) => ({
//     date: view.visitedAt,
//     views: view._count.visitedAt,
//   }));

//   // מחזירים את הנתונים
//   return formattedData;
// }

// function getProductSubQuery(userId: string, productId: string | undefined) {
//   return prisma.product.findMany({
//     where: {
//       clerkUserId: userId,
//       id: productId ? productId : undefined,
//     },
//   });
// }

// export const CHART_INTERVALS = {
//   last7Days: {
//     dateFormatter: (date: Date) => dateFormatter.format(date),
//     startDate: subDays(new Date(), 7),
//     endDate: new Date(),
//     label: "Last 7 Days",
//     sql: "GENERATE_SERIES(current_date - 7, current_date, '1 day'::interval) as series",
//     dateGrouper: (col: any) => `DATE(${col})`,
//   },
//   last30Days: {
//     dateFormatter: (date: Date) => dateFormatter.format(date),
//     startDate: subDays(new Date(), 30),
//     endDate: new Date(),
//     label: "Last 30 Days",
//     sql: "GENERATE_SERIES(current_date - 30, current_date, '1 day'::interval) as series",
//     dateGrouper: (col: any) => `DATE(${col})`,
//   },
//   last365Days: {
//     dateFormatter: (date: Date) => monthFormatter.format(date),

//     startDate: subDays(new Date(), 365),
//     endDate: new Date(),
//     label: "Last 365 Days",
//     sql: "GENERATE_SERIES(DATE_TRUNC('month', current_date - 365), DATE_TRUNC('month', current_date), '1 month'::interval) as series",
//     dateGrouper: (col: any) => `DATE_TRUNC('month', ${col})`,
//   },
// };

// const dateFormatter = new Intl.DateTimeFormat(undefined, {
//   dateStyle: "short",
//   timeZone: "UTC",
// });

// const monthFormatter = new Intl.DateTimeFormat(undefined, {
//   year: "2-digit",
//   month: "short",
//   timeZone: "UTC",
// });

// const zonedStartDate = toZonedTime(interval.startDate, timezone);
//   const startDate = startOfDay(zonedStartDate);
//   console.log(productId);

import {
  CACHE_TAGS,
  dbCache,
  getGlobalTag,
  getIdTag,
  getUserTag,
  revalidateDbCache,
} from "@/lib/cache";
import prisma from "@/prisma/prisma";
import { startOfDay, subDays } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export const CHART_INTERVALS = {
  last7Days: {
    dateFormatter: (date: Date) => dateFormatter.format(date),
    startDate: subDays(new Date(), 7),
    label: "Last 7 Days",
    // במידה ונדרש לשלוף את הסדרה בעזרת פריזמה (למשל, פעולות על טבלה)
    sql: async () => {
      return prisma.$queryRaw`
        SELECT generate_series(current_date - interval '7 days', current_date, interval '1 day') AS series;
      `;
    },
    dateGrouper: (col: any) => prisma.$queryRaw`DATE(${col})`,
  },
  last30Days: {
    dateFormatter: (date: Date) => dateFormatter.format(date),
    startDate: subDays(new Date(), 30),
    label: "Last 30 Days",
    sql: async () => {
      return prisma.$queryRaw`
        SELECT generate_series(current_date - interval '30 days', current_date, interval '1 day') AS series;
      `;
    },
    dateGrouper: (col: any) => prisma.$queryRaw`DATE(${col})`,
  },
  last365Days: {
    dateFormatter: (date: Date) => monthFormatter.format(date),
    startDate: subDays(new Date(), 365),
    label: "Last 365 Days",
    sql: async () => {
      return prisma.$queryRaw`
        SELECT generate_series(DATE_TRUNC('month', current_date - interval '365 days'), DATE_TRUNC('month', current_date), interval '1 month') AS series;
      `;
    },
    dateGrouper: (col: any) => prisma.$queryRaw`DATE_TRUNC('month', ${col})`,
  },
};
export function getProductViewCount(userId: string, startDate: Date) {
  const cacheFn = dbCache(getProductViewCountInternal, {
    tags: [getUserTag(userId, CACHE_TAGS.productViews)],
  });

  return cacheFn(userId, startDate);
}

export function getViewsByCountryChartData({
  timezone,
  productId,
  userId,
  interval,
}: {
  timezone: string;
  productId?: string;
  userId: string;
  interval: (typeof CHART_INTERVALS)[keyof typeof CHART_INTERVALS];
}) {
  const cacheFn = dbCache(getViewsByCountryChartDataInternal, {
    tags: [
      getUserTag(userId, CACHE_TAGS.productViews),
      productId == null
        ? getUserTag(userId, CACHE_TAGS.products)
        : getIdTag(productId, CACHE_TAGS.products),
      getGlobalTag(CACHE_TAGS.countries),
    ],
  });

  return cacheFn({
    timezone,
    productId,
    userId,
    interval,
  });
}

export function getViewsByPPPChartData({
  timezone,
  productId,
  userId,
  interval,
}: {
  timezone: string;
  productId?: string;
  userId: string;
  interval: (typeof CHART_INTERVALS)[keyof typeof CHART_INTERVALS];
}) {
  const cacheFn = dbCache(getViewsByPPPChartDataInternal, {
    tags: [
      getUserTag(userId, CACHE_TAGS.productViews),
      productId == null
        ? getUserTag(userId, CACHE_TAGS.products)
        : getIdTag(productId, CACHE_TAGS.products),
      getGlobalTag(CACHE_TAGS.countries),
      getGlobalTag(CACHE_TAGS.countryGroups),
    ],
  });

  return cacheFn({
    timezone,
    productId,
    userId,
    interval,
  });
}

export function getViewsByDayChartData({
  timezone,
  productId,
  userId,
  interval,
}: {
  timezone: string;
  productId?: string;
  userId: string;
  interval: (typeof CHART_INTERVALS)[keyof typeof CHART_INTERVALS];
}) {
  const cacheFn = dbCache(getViewsByDayChartDataInternal, {
    tags: [
      getUserTag(userId, CACHE_TAGS.productViews),
      productId == null
        ? getUserTag(userId, CACHE_TAGS.products)
        : getIdTag(productId, CACHE_TAGS.products),
    ],
  });

  return cacheFn({
    timezone,
    productId,
    userId,
    interval,
  });
}

export async function createProductView({
  productId,
  countryId,
  userId,
}: {
  productId: string;
  countryId?: string;
  userId: string;
}) {
  const newRow = await prisma.productView.create({
    data: {
      productId: productId,
      visitedAt: new Date(),
      countryId: countryId,
    },
  });

  if (newRow != null) {
    revalidateDbCache({ tag: CACHE_TAGS.productViews, userId, id: newRow.id });
  }
}

async function getProductViewCountInternal(userId: string, startDate: Date) {
  const counts = await prisma.productView.count({
    where: {
      product: {
        clerkUserId: userId,
      },
      visitedAt: {
        gte: startDate,
      },
    },
  });

  return counts ?? 0;
}

// async function getViewsByCountryChartDataInternal({
//   timezone,
//   productId,
//   userId,
//   interval,
// }: {
//   timezone: string;
//   productId?: string;
//   userId: string;
//   interval: (typeof CHART_INTERVALS)[keyof typeof CHART_INTERVALS];
// }) {
//   const zonedStartDate = toZonedTime(interval.startDate, timezone);
//   const startDate = startOfDay(zonedStartDate);
//   const productsSq = await getProductSubQuery(userId, productId);

//   const productViews = await prisma.productView.groupBy({
//     by: ["countryId"],
//     where: {
//       productId: {
//         in: productsSq.map((product) => product.id),
//       },
//       visitedAt: {
//         gte: new Date(),
//       },
//     },
//     _count: {
//       visitedAt: true,
//     },
//     orderBy: {
//       _count: {
//         visitedAt: "desc",
//       },
//     },
//     take: 25,
//   });

//   // כעת תוכל לבצע שאילתה נוספת על `country` בהתבסס על ה-`countryId`
//   const countries = await prisma.country.findMany({
//     where: {
//       id: {
//         in: productViews
//           .map((view) => view.countryId)
//           .filter((countryId): countryId is string => countryId !== null), // פילטר שמסנן null
//       },
//     },
//   });

//   // חיבור המידע ממודלים שונים
//   const result = productViews.map((view) => {
//     const country = countries.find((c) => c.id === view.countryId);
//     return {
//       ...view,
//       country,
//     };
//   });

//   console.log(result);
// }

async function getViewsByCountryChartDataInternal({
  timezone,
  productId,
  userId,
  interval,
}: {
  timezone: string;
  productId?: string;
  userId: string;
  interval: (typeof CHART_INTERVALS)[keyof typeof CHART_INTERVALS];
}) {
  const zonedStartDate = toZonedTime(interval.startDate, timezone);
  const startDate = startOfDay(zonedStartDate);

  // שליפת המידע על המוצרים מה-User
  const products = await getProductSubQuery(userId, productId); // הפונקציה שלך להחזרת רשימת המוצרים

  const productIds = products.map((product) => product.id);

  // בשאילתא זו אני מבצע את המה שעשית ב-Drizzle עם Prisma
  // const chartData = await prisma.productView.groupBy({
  //   by: ['countryId'],  // קיבוץ לפי countryId
  //   where: {
  //     productId: {
  //       in: productIds,  // סינון לפי המוצרים שהחזירה הפונקציה שלך
  //     },
  //     visitedAt: {
  //       gte: startDate,  // מבצע השוואה לפי תאריך התחלה
  //     },
  //   },
  //   _count: {
  //     visitedAt: true,  // סופר את כמות הצפיות
  //   },
  //   include: {
  //     country: {  // הצגת המידע על המדינה
  //       select: {
  //         name: true,  // שם המדינה
  //         code: true,  // קוד המדינה
  //       },
  //     },
  //   },
  //   orderBy: {
  //     _count: {
  //       visitedAt: 'desc',  // סדר לפי כמות הצפיות, מהגדול לקטן
  //     },
  //   },
  //   take: 25,  // הגבלה ל-25 רשומות
  // });

  const chartData = await prisma.productView.groupBy({
    by: ["countryId"], // קיבוץ לפי countryId
    where: {
      productId: {
        in: productIds, // מערך מזהי מוצרים
      },
      visitedAt: {
        gte: startDate, // סינון לפי תאריך התחלה
      },
    },
    _count: {
      visitedAt: true, // ספירת הצפיות
    },
    orderBy: {
      _count: {
        visitedAt: "desc", // סדר לפי צפיות
      },
    },
    take: 25, // הגבלה למקסימום 25 תוצאות
  });

  const countryData = await prisma.country.findMany({
    where: {
      id: {
        in: chartData
          .map((view) => view.countryId)
          .filter((countryId) => countryId !== null),
      },
    },
    select: {
      id: true,
      name: true,
      code: true,
    },
  });

  const result = chartData.map((view) => {
    const country = countryData.find(
      (country) => country.id === view.countryId
    );
    return {
      countryCode: country?.code ?? "Unknown", // ערך ברירת מחדל
      countryName: country?.name ?? "Unknown", // ערך ברירת מחדל
      views: view._count.visitedAt,
    };
  });

  return result;

  // החזרת נתוני הגרף בצורה הרצויה
  // return chartData.map((data) => ({
  //   countryCode: data.country.code,
  //   countryName: data.country.name,
  //   views: data._count.visitedAt,
  // }));
}

// דוגמת קריאה לפונקציה
getViewsByCountryChartDataInternal({
  timezone: "UTC",
  userId: "12345",
  productId: "abc123",
  interval: CHART_INTERVALS.last7Days,
}).then((data) => {
  console.log(data); // הדפסת הנתונים
});
async function getViewsByPPPChartDataInternal({
  timezone,
  productId,
  userId,
  interval,
}: {
  timezone: string;
  productId?: string;
  userId: string;
  interval: (typeof CHART_INTERVALS)[keyof typeof CHART_INTERVALS];
}) {
  const zonedStartDate = toZonedTime(interval.startDate, timezone);
  const startDate = startOfDay(zonedStartDate);
  const productsSq = await getProductSubQuery(userId, productId);

  const productViewSq = await prisma.productView.findMany({
    where: {
      productId: {
        in: productsSq.map((product) => product.id),
      },
      visitedAt: {
        gte: startDate,
      },
    },
    include: {
      country: {
        include: {
          countryGroup: true, // כולל את countryGroup
        },
      },
    },
  });

  // מיפוי הצפיות לפי countryGroup ו-count של הצפיות
  const chartData = productViewSq.reduce((acc, item) => {
    const countryGroupName = item.country?.countryGroup?.name || "Unknown";

    // חפש אם כבר יש אובייקט עבור ה-pppName
    const existingCountryData = acc.find(
      (data) => data.pppName === countryGroupName
    );

    if (existingCountryData) {
      // אם כבר יש, הוסף לצפיות
      existingCountryData.views += 1;
    } else {
      // אחרת, צור אובייקט חדש עם צפיות 1
      acc.push({ pppName: countryGroupName, views: 1 });
    }

    return acc;
  }, [] as { pppName: string; views: number }[]);

  return chartData;

  // const productViewSq = await prisma.productView.findMany({
  //   where: {
  //     productId: {
  //       in: productsSq.map((product) => product.id),
  //     },
  //     visitedAt: {
  //       gte: startDate,
  //     },
  //   },
  //   include: {
  //     country: {
  //       include: {
  //         countryGroup: true,
  //       },
  //     },
  //   },
  // });

  // return productViewSq;
}

// async function getViewsByDayChartDataInternal({
//   timezone,
//   productId,
//   userId,
//   interval,
// }: {
//   timezone: string;
//   productId?: string;
//   userId: string;
//   interval: (typeof CHART_INTERVALS)[keyof typeof CHART_INTERVALS];
// }) {
//   const productsSq = await getProductSubQuery(userId, productId);

// }

async function getViewsByDayChartDataInternal({
  timezone,
  productId,
  userId,
  interval,
}: {
  timezone: string;
  productId?: string;
  userId: string;
  interval: (typeof CHART_INTERVALS)[keyof typeof CHART_INTERVALS];
}) {
  // שמירה על תאריך התחלה בהתבסס על אזור הזמן
  const zonedStartDate = toZonedTime(interval.startDate, timezone);
  const startDate = startOfDay(zonedStartDate);

  // שליפת המוצרים על פי ה-userId וה-productId
  const products = await getProductSubQuery(userId, productId);

  // שליפת הצפיות במוצרים
  const productViewSq = await prisma.productView.findMany({
    where: {
      productId: {
        in: products.map((product) => product.id),
      },
      visitedAt: {
        gte: startDate, // הצפיות לאחר התאריך המוגדר
      },
    },
    include: {
      country: {
        include: {
          countryGroup: true,
        },
      },
    },
  });

  // סינון ושאילתא על התוצאה כדי לחלץ את הנתונים הרצויים
  const chartData = productViewSq.reduce((acc, item) => {
    const visitedDate = item.visitedAt.toISOString().split("T")[0]; // המרת ה-visitedAt לפורמט "YYYY-MM-DD"

    // חיפוש אם כבר יש אובייקט עם אותו תאריך
    const existingData = acc.find((data) => data.date === visitedDate);

    if (existingData) {
      existingData.views += 1; // אם יש, הוסף צפייה אחת
    } else {
      acc.push({ date: visitedDate, views: 1 }); // אם אין, הוסף אובייקט חדש עם צפייה אחת
    }

    return acc;
  }, [] as { date: string; views: number }[]);

  return chartData; // מחזירים את הנתונים במבנה המתאים
}
function getProductSubQuery(userId: string, productId: string | undefined) {
  return prisma.product.findMany({
    where: {
      clerkUserId: userId,
      ...(productId ? { id: productId } : {}),
    },
    select: {
      id: true,
    },
  });
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "short",
  timeZone: "UTC",
});

const monthFormatter = new Intl.DateTimeFormat(undefined, {
  year: "2-digit",
  month: "short",
  timeZone: "UTC",
});

// דוגמה איך להשתמש בשאילתות עם Prisma
async function getChartData(interval: keyof typeof CHART_INTERVALS) {
  const { sql } = CHART_INTERVALS[interval];

  // מחזיר את הסדרה לפי ההתאמה המוגדרת בשאילתה
  const series = await sql();

  // כאן תוכל להוסיף פעולות נוספות עם הנתונים שהחזרת
  console.log(series);
}
