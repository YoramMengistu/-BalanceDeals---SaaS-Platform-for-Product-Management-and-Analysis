// import { HasPermission } from "@/components/HasPermission";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   CHART_INTERVALS,
//   getViewsByCountryChartData,
//   getViewsByDayChartData,
//   getViewsByPPPChartData,
// } from "@/server/db/productView";
// import { canAccessAnalytics } from "@/server/permissions";
// import { auth } from "@clerk/nextjs/server";
// import { ChevronDownIcon } from "lucide-react";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
//   DropdownMenuItem,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { getProduct, getProducts } from "@/server/db/products";
// import { createURL } from "@/lib/utils";
// import { TimezoneDropdownMenuItem } from "../_component/TimezoneDropdownMenuItem";

// import { ViewsByDayChart } from "../_component/charts/ViewsByDayChart";
// import { ViewsByCountryChart } from "../_component/charts/ViewsByCountryChart";
// import { ViewsByPPPChart } from "../_component/charts/ViewsByPPPChart";

// export default async function AnalyticsPage({
//   searchParams,
// }: {
//   searchParams: {
//     interval?: string;
//     timezone?: string;
//     productId?: string;
//   };
// }) {
//   const { userId, redirectToSignIn } = await auth();
//   if (userId == null) return redirectToSignIn();

//   const resolvedSearchParams = await searchParams;

//   const interval =
//     CHART_INTERVALS[
//       resolvedSearchParams?.interval as keyof typeof CHART_INTERVALS
//     ] ?? CHART_INTERVALS.last7Days;

//   const timezone = resolvedSearchParams?.timezone || "UTC";
//   const productId = resolvedSearchParams?.productId;

//   const analyticsUrl = await createURL("/dashboard/analytics", searchParams, {
//     interval: "last7Days",
//   });

//   const timezoneUrl = await createURL("/dashboard/analytics", searchParams, {
//     timezone: "UTC",
//   });
//   return (
//     <>
//       <div className="mb-6 flex justify-between items-baseline">
//         <h1 className="text-3xl font-semibold">Analytics</h1>
//         <HasPermission permission={canAccessAnalytics}>
//           <div className="flex gap-2">
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline">
//                   {interval.label}
//                   <ChevronDownIcon className="size-4 ml-2" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent>
//                 {Object.entries(CHART_INTERVALS).map(([key, value]) => (
//                   <DropdownMenuItem asChild key={key}>
//                     <Link href={analyticsUrl}>{value.label}</Link>
//                   </DropdownMenuItem>
//                 ))}
//               </DropdownMenuContent>
//             </DropdownMenu>
//             <ProductDropdown
//               userId={userId}
//               selectedProductId={productId}
//               searchParams={searchParams}
//             />
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline">
//                   {timezone}
//                   <ChevronDownIcon className="size-4 ml-2" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent>
//                 <DropdownMenuItem asChild>
//                   <Link href={timezoneUrl}>UTC</Link>
//                 </DropdownMenuItem>
//                 <TimezoneDropdownMenuItem searchParams={searchParams} />
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </HasPermission>
//       </div>
//       <HasPermission permission={canAccessAnalytics} renderFallBack>
//         <div className="flex flex-col gap-8">
//           <ViewsByDayCard
//             interval={interval}
//             timezone={timezone}
//             userId={userId}
//             productId={productId}
//           />
//           <ViewsByPPPCard
//             interval={interval}
//             timezone={timezone}
//             userId={userId}
//             productId={productId}
//           />
//           <ViewsByCountryCard
//             interval={interval}
//             timezone={timezone}
//             userId={userId}
//             productId={productId}
//           />
//         </div>
//       </HasPermission>
//     </>
//   );
// }

// async function ProductDropdown({
//   userId,
//   selectedProductId,
//   searchParams,
// }: {
//   userId: string;
//   selectedProductId?: string;
//   searchParams: Record<string, string>;
// }) {
//   const products = await getProducts(userId);

//   // שמירה של ה-URL מראש עבור כל מוצר בעזרת Promise.all
//   const productUrls = await Promise.all(
//     products.map((product) =>
//       createURL("/dashboard/analytics", searchParams, {
//         productId: product.id,
//       })
//     )
//   );

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="outline">
//           {products.find((p) => p.id === selectedProductId)?.name ??
//             "All Products"}
//           <ChevronDownIcon className="size-4 ml-2" />
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent>
//         <DropdownMenuItem asChild>
//           <Link href={productUrls[0]}>All Products</Link>
//         </DropdownMenuItem>
//         {products.map((product, index) => (
//           <DropdownMenuItem asChild key={product.id}>
//             <Link href={productUrls[index]}>{product.name}</Link>
//           </DropdownMenuItem>
//         ))}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }

// async function ViewsByDayCard(
//   props: Parameters<typeof getViewsByDayChartData>[0]
// ) {
//   const chartData = await getViewsByDayChartData(props);

//   const formattedChartData = chartData.map((data) => ({
//     date: data.date ? data.date.toISOString() : "Invalid Date",
//     views: data.views ?? 0,
//   }));
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Visitors Per Day</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <ViewsByDayChart chartData={formattedChartData} />
//       </CardContent>
//     </Card>
//   );
// }

// async function ViewsByPPPCard(
//   props: Parameters<typeof getViewsByPPPChartData>[0]
// ) {
//   const chartData = await getViewsByPPPChartData(props);

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Visitors Per Balance Group</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <ViewsByPPPChart chartData={chartData} />
//       </CardContent>
//     </Card>
//   );
// }

// async function ViewsByCountryCard(
//   props: Parameters<typeof getViewsByCountryChartData>[0]
// ) {
//   const chartData = await getViewsByCountryChartData(props);
//   console.log(chartData);

//   const formattedChartData = chartData.map((data) => ({
//     countryCode: data.countryCode ?? "Unknown",
//     countryName: data.countryName ?? "Unknown",
//     views: data.views ?? 0,
//   }));

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Visitors Per Country</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <ViewsByCountryChart chartData={formattedChartData} />
//       </CardContent>
//     </Card>
//   );
// }

import { HasPermission } from "@/components/HasPermission";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CHART_INTERVALS,
  getViewsByCountryChartData,
  getViewsByDayChartData,
  getViewsByPPPChartData,
} from "@/server/db/productView";
import { canAccessAnalytics } from "@/server/permissions";
import { auth } from "@clerk/nextjs/server";
import { ChevronDownIcon, SearchCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createURL } from "@/lib/utils";
import { getProduct, getProducts } from "@/server/db/products";
import { TimezoneDropdownMenuItem } from "../_component/TimezoneDropdownMenuItem";
import { ViewsByDayChart } from "../_component/charts/ViewsByDayChart";
import { ViewsByPPPChart } from "../_component/charts/ViewsByPPPChart";
import { ViewsByCountryChart } from "../_component/charts/ViewsByCountryChart";

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: {
    interval?: string;
    timezone?: string;
    productId?: string;
  };
}) {
  const { userId, redirectToSignIn } = await auth();
  if (userId == null) return redirectToSignIn();
  const resolvedSearchParams = await searchParams;
  console.log(resolvedSearchParams);

  const interval =
    CHART_INTERVALS[
      resolvedSearchParams.interval as keyof typeof CHART_INTERVALS
    ] ?? CHART_INTERVALS.last7Days;
  // const timezone = searchParams?.timezone || "UTC";
  // const productId = searchParams?.productId;

  const timezone = resolvedSearchParams?.timezone || "UTC";
  const productId = resolvedSearchParams?.productId;

  const analyticsUrl = await createURL("/dashboard/analytics", searchParams, {
    interval: "last7Days",
  });

  const timezoneUrl = await createURL("/dashboard/analytics", searchParams, {
    timezone: "UTC",
  });
  return (
    <>
      <div className="mb-6 flex justify-between items-baseline">
        <h1 className="text-3xl font-semibold">Analytics</h1>
        <HasPermission permission={canAccessAnalytics}>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {interval.label}
                  <ChevronDownIcon className="size-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {Object.entries(CHART_INTERVALS).map(([key, value]) => (
                  <DropdownMenuItem asChild key={key}>
                    <Link href={analyticsUrl}>{value.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <ProductDropdown
              userId={userId}
              selectedProductId={productId}
              searchParams={searchParams}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {timezone}
                  <ChevronDownIcon className="size-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href={timezoneUrl}>UTC</Link>
                </DropdownMenuItem>
                <TimezoneDropdownMenuItem searchParams={searchParams} />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </HasPermission>
      </div>
      <HasPermission permission={canAccessAnalytics} renderFallBack>
        <div className="flex flex-col gap-8">
          <ViewsByDayCard
            interval={interval}
            timezone={timezone}
            userId={userId}
            productId={productId}
          />
          <ViewsByPPPCard
            interval={interval}
            timezone={timezone}
            userId={userId}
            productId={productId}
          />
          <ViewsByCountryCard
            interval={interval}
            timezone={timezone}
            userId={userId}
            productId={productId}
          />
        </div>
      </HasPermission>
    </>
  );
}

async function ProductDropdown({
  userId,
  selectedProductId,
  searchParams,
}: {
  userId: string;
  selectedProductId?: string;
  searchParams: Record<string, string>;
}) {
  const products = await getProducts(userId);

  const resolvedSearchParams = await searchParams;
  const analyticsUrl = await createURL(
    "/dashboard/analytics",
    resolvedSearchParams,
    {
      interval: "7 Days",
    }
  );

  const timezoneUrl = await createURL(
    "/dashboard/analytics",
    resolvedSearchParams,
    {
      timezone: "UTC",
    }
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {products.find((p) => p.id === selectedProductId)?.name ??
            "All Products"}
          <ChevronDownIcon className="size-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link href={analyticsUrl}>All Products</Link>
        </DropdownMenuItem>
        {products.map((product) => (
          <DropdownMenuItem asChild key={product.id}>
            <Link href={timezoneUrl}>{product.name}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

async function ViewsByDayCard(
  props: Parameters<typeof getViewsByDayChartData>[0]
) {
  const chartData = await getViewsByDayChartData(props);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitors Per Day</CardTitle>
      </CardHeader>
      <CardContent>
        <ViewsByDayChart chartData={chartData} />
      </CardContent>
    </Card>
  );
}

async function ViewsByPPPCard(
  props: Parameters<typeof getViewsByPPPChartData>[0]
) {
  const chartData = await getViewsByPPPChartData(props);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitors Per PPP Group</CardTitle>
      </CardHeader>
      <CardContent>
        <ViewsByPPPChart chartData={chartData} />
      </CardContent>
    </Card>
  );
}

async function ViewsByCountryCard(
  props: Parameters<typeof getViewsByCountryChartData>[0]
) {
  const chartData = await getViewsByCountryChartData(props);

  console.log(chartData);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitors Per Country</CardTitle>
      </CardHeader>
      <CardContent>
        <ViewsByCountryChart chartData={chartData} />
      </CardContent>
    </Card>
  );
}
