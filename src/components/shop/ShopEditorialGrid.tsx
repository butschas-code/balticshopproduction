"use client";

import { motion } from "framer-motion";
import { EditorialProductCard } from "@/components/shop/EditorialProductCard";
import type { ShopCatalogProduct } from "@/lib/shop/curation";
import { shopEase, viewportOnce } from "@/lib/shop/motion";

type ShopEditorialGridProps = {
  products: ShopCatalogProduct[];
  locale: "en" | "de";
  typeLabel: (type: string) => string;
};

export function ShopEditorialGrid({ products, locale, typeLabel }: ShopEditorialGridProps) {
  return (
    <div className="space-y-16 md:space-y-24 lg:space-y-28">
      {chunk(products, 5).map((group, groupIndex) => (
        <motion.div
          key={groupIndex}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.7, delay: groupIndex * 0.04, ease: shopEase }}
          className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 lg:gap-16"
        >
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
                    delay={index * 0.06}
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
                delay={index * 0.06}
                label={typeLabel(product.productType)}
              />
            );
          })}
        </motion.div>
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
