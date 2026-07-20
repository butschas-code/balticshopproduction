"use client";

import { useState } from "react";

type ProductGalleryProps = {
  images: string[];
  productName: string;
};

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const galleryImages = images.filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = galleryImages[activeIndex] || galleryImages[0];

  if (!activeImage) {
    return (
      <div className="premium-shell">
        <div className="premium-core aspect-[4/5]" />
      </div>
    );
  }

  return (
    <div className="lg:sticky lg:top-28">
      <div className="grid grid-cols-1 lg:grid-cols-[88px_minmax(0,1fr)] gap-4 lg:gap-6">
        {galleryImages.length > 1 ? (
          <div className="order-2 lg:order-1 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
            {galleryImages.map((image, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  aria-label={`${productName} ${index + 1}`}
                  aria-pressed={isActive}
                  onClick={() => setActiveIndex(index)}
                  className={`relative shrink-0 w-[72px] h-[72px] lg:w-full lg:aspect-square overflow-hidden rounded-[0.85rem] bg-fog border transition-all duration-500 ${
                    isActive ? "border-forest opacity-100 shadow-[0_14px_34px_-28px_rgba(15,42,36,0.55)]" : "border-forest/8 opacity-55 hover:opacity-90 hover:border-forest/18"
                  }`}
                >
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
                </button>
              );
            })}
          </div>
        ) : null}

        <div className={`order-1 lg:order-2 ${galleryImages.length > 1 ? "" : "lg:col-span-2"}`}>
          <div className="premium-shell">
            <div className="premium-core relative aspect-[4/5] lg:aspect-[3/4]">
              <div
                key={activeImage}
                className="absolute inset-0 bg-cover bg-center animate-[galleryFadeIn_0.45s_ease-out]"
                style={{ backgroundImage: `url(${activeImage})` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
