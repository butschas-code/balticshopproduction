"use client";

import { Link } from "@/i18n/navigation";

export interface ProductCardProps {
  slug: string;
  name: string;
  description: string;
  price: string;
  image: string;
  artisanName?: string;
  craft?: string;
}

export function ProductCard({
  slug,
  name,
  description,
  price,
  image,
  artisanName,
  craft,
}: ProductCardProps) {
  return (
    <article className="group">
      <Link href={`/shop/${slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-fog">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
            style={{ backgroundImage: `url(${image})` }}
          />
          <div className="absolute inset-0 bg-forest/0 group-hover:bg-forest/10 transition-colors duration-500" />
        </div>
        <div className="mt-6">
          {artisanName && (
            <p className="text-driftwood text-sm mb-1">{artisanName}</p>
          )}
          <h3 className="font-serif text-xl md:text-2xl text-forest group-hover:text-amber transition-colors">
            {name}
          </h3>
          {craft && (
            <p className="text-driftwood text-sm mt-1">{craft}</p>
          )}
          <p className="mt-2 text-forest/80 text-sm leading-relaxed line-clamp-2">
            {description}
          </p>
          <p className="mt-4 text-forest font-medium">{price}</p>
        </div>
      </Link>
    </article>
  );
}
