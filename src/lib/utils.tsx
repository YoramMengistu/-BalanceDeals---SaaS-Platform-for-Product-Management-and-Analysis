export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function removeTrailingSlash(path: string) {
  return path.replace(/\/$/, "");
}

// export function createURL(
//   href: string,
//   oldParams: Record<string, string>,
//   newParams: Record<string, string | undefined>
// ) {
//   // const params = new URLSearchParams(oldParams);

//   const params = new URLSearchParams(
//     Object.entries(oldParams).reduce((acc, [key, value]) => {
//       acc[key] = String(value); // המרת הערך למחרוזת
//       return acc;
//     }, {} as Record<string, string>)
//   );
//   Object.entries(newParams).forEach(([key, value]) => {
//     if (value == undefined) {
//       params.delete(key);
//     } else {
//       params.set(key, value);
//     }
//   });
//   return `${href}?${params.toString()}`;
// }

export async function createURL(
  path: string,
  searchParams: Record<string, string>,
  newParams: Record<string, any> = {}
): Promise<string> {
  // המתן אם יש צורך ב-`searchParams` אסינכרוני
  const resolvedSearchParams = await searchParams; // או אם זה כבר אובייקט סינכרוני, אפשר פשוט להשאיר אותו

  // המרת פרמטרים ישנים ל-newParams
  const finalParams = { ...resolvedSearchParams, ...newParams };

  // המרת המפתחות לערכים
  const urlParams = new URLSearchParams(
    Object.entries(finalParams).reduce((acc, [key, value]) => {
      acc[key] = String(value); // המרת הערך למחרוזת
      return acc;
    }, {} as Record<string, string>)
  );

  return `${path}?${urlParams.toString()}`;
}

