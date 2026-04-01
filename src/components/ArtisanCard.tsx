"use client";

import { Link } from "@/i18n/navigation";

export interface ArtisanCardProps {
  slug: string;
  name: string;
  location: string;
  craft: string;
  image: string;
}

export function ArtisanCard({ slug, name, location, craft, image }: ArtisanCardProps) {
  return (
    <article className="group">
      <Link href={`/artisans/${slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-fog">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
            style={{ backgroundImage: `url(${image})` }}
          />
          <div className="absolute inset-0 bg-forest/20 group-hover:bg-forest/10 transition-colors duration-500" />
        </div>
        <div className="mt-6">
          <h3 className="font-serif text-xl md:text-2xl text-forest group-hover:text-amber transition-colors">
            {name}
          </h3>
          <p className="text-driftwood text-sm mt-1">{location}</p>
          <p className="text-forest/80 text-sm mt-2">{craft}</p>
        </div>
      </Link>
    </article>
  );
}
