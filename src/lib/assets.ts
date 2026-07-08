const publicBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.trim().replace(/\/$/, "");

export function resolveAssetUrl(pathOrUrl: string | null | undefined): string {
  if (!pathOrUrl) return "";
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  if (publicBase && pathOrUrl.startsWith("/partners/")) {
    return `${publicBase}${pathOrUrl}`;
  }
  return pathOrUrl;
}

export function resolveAssetUrls(paths: string[] | null | undefined): string[] {
  if (!Array.isArray(paths)) return [];
  return paths.map((path) => resolveAssetUrl(path)).filter(Boolean);
}
