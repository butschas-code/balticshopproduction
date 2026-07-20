"use client";

import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { shopEase } from "@/lib/shop/motion";

export interface ArtisanCardProps {
  slug: string;
  name: string;
  location: string;
  craft: string;
  image: string;
}

export function ArtisanCard({ slug, name, location, craft, image }: ArtisanCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 34, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.82, ease: shopEase }}
      className="group"
    >
      <Link href={`/artisans/${slug}`} className="block">
        <div className="premium-shell transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1">
          <div className="premium-core relative aspect-[3/4] bg-fog">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.055]"
              style={{ backgroundImage: `url(${image})` }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,42,36,0.04)_0%,rgba(15,42,36,0.28)_100%)] transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-80" />
          </div>
        </div>
        <div className="mt-6">
          <h3 className="font-serif text-xl md:text-2xl text-forest group-hover:text-amber transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
            {name}
          </h3>
          <p className="text-driftwood text-sm mt-1">{location}</p>
          <p className="text-forest/80 text-sm mt-2">{craft}</p>
        </div>
      </Link>
    </motion.article>
  );
}
