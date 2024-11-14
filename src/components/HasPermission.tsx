import { auth } from "@clerk/nextjs/server";
import { AwaitedReactNode } from "react";
import { NoPermissionCard } from "./NoPermissionCard";

export async function HasPermission({
  permission,
  renderFallBack = false,
  fallbackText,
  children,
}: {
  permission: (userId: string | null) => Promise<Boolean>;
  renderFallBack?: Boolean;
  fallbackText?: string;
  children: AwaitedReactNode;
}) {
  const { userId } = await auth();
  const hasPermission = await permission(userId);
  if (hasPermission) return children;
  if (renderFallBack)
    return <NoPermissionCard>{fallbackText}</NoPermissionCard>;
  return null;
}
