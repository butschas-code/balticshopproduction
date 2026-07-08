"use client";

import { EditorialProductCard } from "@/components/shop/EditorialProductCard";
import type { ShopCatalogProduct } from "@/lib/shop/curation";

type ShopEditorialGridProps = {
  products: ShopCatalogProduct[];
  locale: "en" | "de";
  typeLabel: (type: string) => string;
};

export function ShopEditorialGrid({ products, locale, typeLabel }: ShopEditorialGridProps) {
  return (
    <div className="space-y-16 md:space-y-24 lg:space-y-28">
      {chunk(products, 5).map((group, groupIndex) => (
        <div key={groupIndex} className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 lg:gap-16">
          {group.map((product, index) => {
            const globalIndex = groupIndex * 5 + index;
            const isWide = index === 0 && group.length >= 3;

            if (isWide) {
              return (
                <div key={product.slug} className="md:col-span-2">
                  <EditorialProductCard
                    product={product}
                    locale={locale}
                    variant="wide"
                    index={globalIndex}
                    label={typeLabel(product.productType)}
                    showDescription={globalIndex % 5 === 0}
                  />
                </div>
              );
            }

            return (
              <EditorialProductCard
                key={product.slug}
                product={product}
                locale={locale}
                variant={index % 3 === 1 ? "portrait" : "standard"}
                index={globalIndex}
                label={typeLabel(product.productType)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

function chunk<T>(items: T[], size: number): T[][] {
  const groups: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    groups.push(items.slice(index, index + size));
  }
  return groups;
}
