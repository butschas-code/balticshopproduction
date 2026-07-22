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
    <section className="premium-section relative overflow-hidden bg-forest py-24 md:py-32 lg:py-40 z-10">
      <motion.div
        initial={{ opacity: 0, y: 38, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, ease: shopEase }}
        className="relative mx-auto w-full max-w-[1600px] px-6 md:px-12 lg:px-16"
      >
        <div className="premium-shell">
          <div className="premium-core grid grid-cols-1 bg-forest/95 lg:grid-cols-12">
            <div className="p-8 md:p-12 lg:col-span-6 lg:p-16">
              <div className="border-l border-amber pl-6 md:pl-10">
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-beeswax">Field note</p>
                <blockquote className="mt-8 font-serif text-4xl leading-[1.02] tracking-tight text-linen md:text-6xl">
                  &ldquo;{quote}&rdquo;
                </blockquote>
                {subtitle && (
                  <p className="mt-8 text-lg font-medium text-linen/80">{subtitle}</p>
                )}
              </div>
            </div>
            <div className="min-h-[360px] bg-fog lg:col-span-6">
              <div
                className="h-full min-h-[360px] bg-cover bg-center"
                style={{ backgroundImage: `url(${imageUrl})` }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
