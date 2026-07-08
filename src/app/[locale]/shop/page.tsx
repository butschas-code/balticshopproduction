import { Suspense } from "react";
import { getCatalogProducts } from "@/lib/catalog-supabase";
import { ShopExperience } from "@/components/shop/ShopExperience";

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const activeLocale = locale === "de" ? "de" : "en";
  const products = await getCatalogProducts(activeLocale);

  return (
    <Suspense fallback={<ShopPageFallback />}>
      <ShopExperience products={products} locale={activeLocale} />
    </Suspense>
  );
}

function ShopPageFallback() {
  return (
    <div className="pb-30">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 pt-32 md:pt-40 pb-16">
        <div className="h-3 w-32 bg-fog/80 animate-pulse" />
        <div className="mt-8 h-16 md:h-20 w-2/3 max-w-xl bg-fog/80 animate-pulse" />
        <div className="mt-6 h-5 w-1/2 max-w-md bg-fog/60 animate-pulse" />
      </div>
      <div className="border-y border-fog/60 py-7">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 flex gap-6">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="h-6 w-24 bg-fog/60 animate-pulse" />
          ))}
        </div>
      </div>
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 pt-16">
        <div className="aspect-[2/1] bg-[#EBE8E2] animate-pulse" />
      </div>
    </div>
  );
}
