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
    <section className="relative min-h-[92dvh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 motion-safe:animate-slow-zoom"
          style={{
            backgroundImage: `url(${imageUrl})`,
          }}
        />
        {overlay && (
          <>
            <div
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,42,36,0.28)_0%,rgba(15,42,36,0.36)_42%,rgba(15,42,36,0.78)_100%)]"
              aria-hidden
            />
            <div
              className="absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,rgba(246,243,238,0.18)_0%,transparent_34%),radial-gradient(circle_at_80%_12%,rgba(200,154,75,0.15)_0%,transparent_28%)]"
              aria-hidden
            />
          </>
        )}
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 py-32 text-center">
        <motion.p
          initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="premium-eyebrow mx-auto border-linen/20 bg-linen/12 text-linen/80"
        >
          Baltic craft edit
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 38, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.05, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-linen tracking-tight max-w-5xl mx-auto leading-[0.98]"
        >
          {title}
        </motion.h1>
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="origin-center h-px w-24 bg-linen/35 mx-auto mt-8"
          aria-hidden
        />
        <motion.p
          initial={{ opacity: 0, y: 28, filter: "blur(7px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.95, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 text-lg md:text-xl text-linen/88 max-w-xl mx-auto font-light tracking-wide leading-relaxed"
        >
          {subtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.85, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12"
        >
          <Link
            href={ctaHref}
            className="premium-cta group"
          >
            {ctaLabel}
            <span className="premium-cta-icon" aria-hidden>
              →
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
