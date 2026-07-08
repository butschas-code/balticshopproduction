function required(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

export function getR2Config() {
  return {
    accountId: required("R2_ACCOUNT_ID"),
    bucket: process.env.R2_BUCKET?.trim() || "balticsproducts-media",
    endpoint: required("R2_ENDPOINT"),
    accessKeyId: required("R2_ACCESS_KEY_ID"),
    secretAccessKey: required("R2_SECRET_ACCESS_KEY"),
    publicUrl: process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.trim().replace(/\/$/, "") || "",
    apiToken: process.env.CLOUDFLARE_API_TOKEN?.trim() || "",
  };
}

export function partnerPathToKey(relativePath) {
  return relativePath.replace(/^\/+/, "");
}

export function partnerPathToPublicUrl(publicBase, relativePath) {
  const base = publicBase.replace(/\/$/, "");
  const key = partnerPathToKey(relativePath);
  return `${base}/${key}`;
}
