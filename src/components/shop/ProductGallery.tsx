"use client";

import { useState } from "react";

type ProductGalleryProps = {
  images: string[];
  productName: string;
  label?: string;
};

export function ProductGallery({ images, productName, label }: ProductGalleryProps) {
  const galleryImages = images.length > 0 ? images : [""];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = galleryImages[activeIndex] || galleryImages[0];

  return (
    <div className="lg:sticky lg:top-28 space-y-4 md:space-y-5">
      <div className="relative aspect-[4/5] bg-fog overflow-hidden">
        {activeImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
            style={{ backgroundImage: `url(${activeImage})` }}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-forest/20 via-transparent to-transparent pointer-events-none" />
        {label ? (
          <span className="absolute top-4 left-4 md:top-6 md:left-6 px-3 py-1 text-[11px] uppercase tracking-[0.22em] bg-linen/90 text-forest">
            {label}
          </span>
        ) : null}
      </div>

      {galleryImages.length > 1 ? (
        <div className="grid grid-cols-4 gap-3 md:gap-4">
          {galleryImages.map((image, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={`${image}-${index}`}
                type="button"
                aria-label={`${productName} ${index + 1}`}
                aria-pressed={isActive}
                onClick={() => setActiveIndex(index)}
                className={`relative aspect-square overflow-hidden bg-fog border transition-colors ${
                  isActive ? "border-forest" : "border-transparent hover:border-driftwood/40"
                }`}
              >
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
