"use client";

interface StorySectionProps {
  imageUrl: string;
  quote: string;
  subtitle?: string;
}

export function StorySection({
  imageUrl,
  quote,
  subtitle,
}: StorySectionProps) {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden z-10">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div className="absolute inset-0 bg-forest/50" />
      </div>
      <div className="relative z-10 max-w-[900px] mx-auto px-6 md:px-12 text-center py-24">
        <blockquote className="font-serif text-3xl md:text-4xl lg:text-5xl text-linen leading-tight tracking-tight">
          &ldquo;{quote}&rdquo;
        </blockquote>
        {subtitle && (
          <p className="mt-8 text-linen/80 text-lg">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
