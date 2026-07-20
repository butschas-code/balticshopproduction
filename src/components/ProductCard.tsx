"use client";

import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { shopEase } from "@/lib/shop/motion";

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
    <motion.article
      initial={{ opacity: 0, y: 34, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.82, ease: shopEase }}
      className="group"
    >
      <Link href={`/shop/${slug}`} className="block">
        <div className="premium-shell transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1">
          <div className="premium-core relative aspect-[3/4] bg-fog">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.055]"
              style={{ backgroundImage: `url(${image})` }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(15,42,36,0.14)_100%)] opacity-0 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100" />
          </div>
        </div>
        <div className="mt-6">
          {artisanName && (
            <p className="text-driftwood text-sm mb-1">{artisanName}</p>
          )}
          <h3 className="font-serif text-xl md:text-2xl text-forest group-hover:text-amber transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
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
    </motion.article>
  );
}
