// import { getProduct, getProducts } from "@/server/db/products";
// import { NoProducts } from "./_component/NoProducts";
// import { auth } from "@clerk/nextjs/server";
// import Link from "next/link";
// import { ArrowRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { PlusIcon } from "@radix-ui/react-icons";
// import ProductGrid from "./_component/ProductGrid";

// export default async function DashboardPage() {
//   const { userId } = await auth();
//   if (userId == null) return;

//   const products = await getProducts(userId, { limit: 6 });

//   if (products.length === 0) return <NoProducts />;
//   return (
//     <>
//       <h2 className="mb-6 text-3xl font-semibold flex justify-between">
//         <Link
//           href="/dashboard/products"
//           className="group flex gap-2 items-center hover:underline"
//         >
//           Products
//           <ArrowRight className="group-hover:translate-x-1 transition-transform" />
//         </Link>

//         <Button asChild>
//           <Link href="/dashboard/products/new">
//             <PlusIcon />
//             New Product
//           </Link>
//         </Button>
//       </h2>

//       <ProductGrid products={products} />
//     </>
//   );
// }

import { getProducts } from "@/server/db/products";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { ArrowRightIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HasPermission } from "@/components/HasPermission";
import { canAccessAnalytics } from "@/server/permissions";
import {
  CHART_INTERVALS,
  getViewsByDayChartData,
} from "@/server/db/productView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NoProducts } from "./_component/NoProducts";
import ProductGrid from "./_component/ProductGrid";
import { ViewsByDayChart } from "./_component/charts/ViewsByDayChart";

export default async function DashboardPage() {
  const { userId, redirectToSignIn } = await auth();
  if (userId == null) return redirectToSignIn();

  const products = await getProducts(userId, { limit: 6 });

  if (products.length === 0) return <NoProducts />;

  return (
    <>
      <h2 className="mb-6 text-3xl font-semibold flex justify-between">
        <Link
          className="group flex gap-2 items-center hover:underline"
          href="/dashboard/products"
        >
          Products
          <ArrowRightIcon className="group-hover:translate-x-1 transition-transform" />
        </Link>
        <Button asChild>
          <Link href="/dashboard/products/new">
            <PlusIcon className="size-4 mr-2" />
            New Product
          </Link>
        </Button>
      </h2>
      <ProductGrid products={products} />
      <h2 className="mb-6 text-3xl font-semibold flex justify-between mt-12">
        <Link
          href="/dashboard/analytics"
          className="flex gap-2 items-center hover:underline group"
        >
          Analytics
          <ArrowRightIcon className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </h2>
      <HasPermission permission={canAccessAnalytics} renderFallBack>
        <AnalyticsChart userId={userId} />
      </HasPermission>
    </>
  );
}

async function AnalyticsChart({ userId }: { userId: string }) {
  const chartData = await getViewsByDayChartData({
    userId,
    interval: CHART_INTERVALS.last30Days,
    timezone: "UTC",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Views by Day</CardTitle>
      </CardHeader>
      <CardContent>
        <ViewsByDayChart chartData={chartData} />
      </CardContent>
    </Card>
  );
}
