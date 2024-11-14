import { Button } from "@/components/ui/button";
import { MoveLeftIcon } from "lucide-react";
import Link from "next/link";
import React, { ReactNode } from "react";

export default function PageWithBackButton({
  pageTitle,
  children,
  backButtonHref,
}: {
  pageTitle: string;
  children: ReactNode;
  backButtonHref: string;
}) {
  return (
    <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-8 transition-all duration-300">
      <Button
        className="rounded-full hover:bg-gray-400"
        variant="outline"
        size="icon"
        asChild
      >
        <Link href={backButtonHref}>
          <div className="sr-only ">back</div>
          <MoveLeftIcon />
        </Link>
      </Button>
      <h1 className="text-2xl font-semibold font-serif self-center">
        {pageTitle}
      </h1>
      <div className="col-start-2">{children}</div>
    </div>
  );
}
