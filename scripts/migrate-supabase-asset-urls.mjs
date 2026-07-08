#!/usr/bin/env node
import { createClient } from "@supabase/supabase-js";
import { getR2Config, partnerPathToPublicUrl } from "./lib/r2-env.mjs";

function required(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

function rewritePath(value, publicBase) {
  if (!value || typeof value !== "string") return value;
  if (!value.startsWith("/partners/")) return value;
  return partnerPathToPublicUrl(publicBase, value);
}

function rewriteWorkshopImages(value, publicBase) {
  if (!Array.isArray(value)) return value;
  return value.map((item) => rewritePath(item, publicBase));
}

async function main() {
  const { publicUrl } = getR2Config();
  if (!publicUrl) throw new Error("Missing NEXT_PUBLIC_R2_PUBLIC_URL");

  const supabase = createClient(required("NEXT_PUBLIC_SUPABASE_URL"), required("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: products, error: productsError } = await supabase.from("products").select("id, slug, image_url");
  if (productsError) throw productsError;

  let productUpdates = 0;
  for (const product of products || []) {
    const nextUrl = rewritePath(product.image_url, publicUrl);
    if (nextUrl === product.image_url) continue;
    const { error } = await supabase.from("products").update({ image_url: nextUrl }).eq("id", product.id);
    if (error) throw error;
    productUpdates += 1;
  }

  const { data: images, error: imagesError } = await supabase.from("product_images").select("id, image_url");
  if (imagesError) throw imagesError;

  let imageUpdates = 0;
  for (const image of images || []) {
    const nextUrl = rewritePath(image.image_url, publicUrl);
    if (nextUrl === image.image_url) continue;
    const { error } = await supabase.from("product_images").update({ image_url: nextUrl }).eq("id", image.id);
    if (error) throw error;
    imageUpdates += 1;
  }

  for (const table of ["partners", "artisans"]) {
    const { data: rows, error } = await supabase.from(table).select("id, portrait_url, workshop_images");
    if (error) throw error;

    for (const row of rows || []) {
      const portrait = rewritePath(row.portrait_url, publicUrl);
      const workshop = rewriteWorkshopImages(row.workshop_images, publicUrl);
      if (portrait === row.portrait_url && JSON.stringify(workshop) === JSON.stringify(row.workshop_images)) continue;
      const { error: updateError } = await supabase
        .from(table)
        .update({ portrait_url: portrait, workshop_images: workshop })
        .eq("id", row.id);
      if (updateError) throw updateError;
    }
  }

  console.log(
    JSON.stringify(
      {
        publicUrl,
        productUpdates,
        imageUpdates,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
