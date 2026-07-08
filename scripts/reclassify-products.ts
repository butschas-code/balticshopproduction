import { createClient } from "@supabase/supabase-js";

import { classifyProductType } from "../src/lib/shop/classify-product";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

const db = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

async function main() {
  const { data: products, error } = await db
    .from("products")
    .select("id, slug, product_type, artisans(slug), product_translations!inner(name, description, craft, locale)")
    .eq("product_translations.locale", "en");

  if (error) throw error;

  const updates: Array<{ id: string; slug: string; from: string; to: string }> = [];

  for (const product of products || []) {
    const translation = product.product_translations[0];
    const artisanSlug = product.artisans?.slug || "";
    const nextType = classifyProductType({
      slug: product.slug,
      name: translation?.name,
      description: translation?.description,
      craft: translation?.craft,
      artisanSlug,
    });

    if (nextType !== product.product_type) {
      updates.push({
        id: product.id,
        slug: product.slug,
        from: product.product_type,
        to: nextType,
      });
    }
  }

  console.log(`Reclassifying ${updates.length} products...`);

  for (const batch of chunk(updates, 50)) {
    for (const item of batch) {
      const { error: updateError } = await db.from("products").update({ product_type: item.to }).eq("id", item.id);
      if (updateError) throw updateError;
    }
  }

  const plateLeaks = (products || []).filter((product) => {
    const translation = product.product_translations[0];
    const type = classifyProductType({
      slug: product.slug,
      name: translation?.name,
      description: translation?.description,
      craft: translation?.craft,
      artisanSlug: product.artisans?.slug || "",
    });
    if (type !== "plate") return false;
    const name = (translation?.name || "").toLowerCase();
    return /cup|mug|krūz|kruze|glass|espresso set|bowl|schale|tasse|becher|komplekt|set ·/.test(name);
  });

  console.log(`Done. Plate filter suspicious names remaining: ${plateLeaks.length}`);
  if (plateLeaks.length > 0) {
    for (const product of plateLeaks) {
      console.log(product.slug, product.product_translations[0]?.name);
    }
    process.exitCode = 1;
  }
}

function chunk<T>(items: T[], size: number): T[][] {
  const batches: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    batches.push(items.slice(index, index + size));
  }
  return batches;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
