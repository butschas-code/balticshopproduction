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
  imageUrl = "/hero/old-culture-modern-home-premium.png",
  overlay = true,
}: HeroProps) {
  return (
    <section className="relative flex min-h-[100dvh] items-end overflow-hidden bg-rye">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 scale-105 bg-cover bg-center motion-safe:animate-slow-zoom"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        {overlay && (
          <div
            className="absolute inset-0 bg-[linear-gradient(90deg,rgba(24,56,46,0.82)_0%,rgba(24,56,46,0.62)_34%,rgba(24,56,46,0.22)_66%,rgba(74,53,41,0.18)_100%),linear-gradient(180deg,rgba(24,56,46,0.12)_0%,rgba(24,56,46,0.18)_52%,rgba(44,33,24,0.64)_100%)]"
            aria-hidden
          />
        )}
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 pb-10 pt-32 md:px-12 md:pb-14 lg:px-16 lg:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.28em] text-beeswax">Baltic living from Latvia</p>
          <h1 className="font-serif text-5xl font-bold leading-[0.96] tracking-tight text-linen text-balance sm:text-6xl md:text-7xl xl:text-8xl">
            {title}
          </h1>
          <p className="mt-7 max-w-2xl text-base font-semibold leading-relaxed text-linen/95 md:text-lg">
            {subtitle}
          </p>
          <Link
            href={ctaHref}
            className="mt-9 inline-flex items-center justify-center bg-beeswax px-9 py-4 text-sm font-bold text-rye transition-colors duration-300 hover:bg-amber"
          >
            {ctaLabel}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
