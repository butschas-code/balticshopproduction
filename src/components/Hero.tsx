"use client";

import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";

interface HeroProps {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageUrl?: string;
  videoUrl?: string;
  overlay?: boolean;
}

export function Hero({
  title = "Crafted by Baltic Hands",
  subtitle = "Objects shaped by forests, sea and tradition.",
  ctaLabel = "Explore the collection",
  ctaHref = "/shop",
  imageUrl = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80",
  overlay = true,
}: HeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 motion-safe:animate-slow-zoom"
          style={{
            backgroundImage: `url(${imageUrl})`,
          }}
        />
        {overlay && (
          <div
            className="absolute inset-0 bg-gradient-to-b from-forest/40 via-forest/30 to-forest/70"
            aria-hidden
          />
        )}
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 py-32 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-linen tracking-tight max-w-4xl mx-auto leading-[1.1]"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 text-lg md:text-xl text-linen/90 max-w-xl mx-auto font-light tracking-wide"
        >
          {subtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12"
        >
          <Link
            href={ctaHref}
            className="inline-block px-10 py-4 bg-amber text-forest font-medium tracking-wide hover:bg-amber/90 transition-colors duration-300"
          >
            {ctaLabel}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
