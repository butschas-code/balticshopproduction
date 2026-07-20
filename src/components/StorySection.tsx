"use client";

import { motion } from "framer-motion";
import { shopEase } from "@/lib/shop/motion";

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
    <section className="relative min-h-[72dvh] flex items-center justify-center overflow-hidden z-10">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 motion-safe:animate-slow-zoom"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,42,36,0.62)_0%,rgba(15,42,36,0.74)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(246,243,238,0.12)_0%,transparent_38%)]" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 38, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, ease: shopEase }}
        className="relative z-10 max-w-[960px] mx-auto px-6 md:px-12 text-center py-24"
      >
        <p className="premium-eyebrow mx-auto border-linen/15 bg-linen/10 text-linen/75">Field note</p>
        <blockquote className="mt-8 font-serif text-3xl md:text-5xl lg:text-6xl text-linen leading-tight tracking-tight">
          &ldquo;{quote}&rdquo;
        </blockquote>
        {subtitle && (
          <p className="mt-8 text-linen/80 text-lg">{subtitle}</p>
        )}
      </motion.div>
    </section>
  );
}
