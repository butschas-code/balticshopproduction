"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { fadeUpSoft, shopEase, viewportOnce } from "@/lib/shop/motion";

type ScrollRevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  y?: number;
};

export function ScrollReveal({ children, delay = 0, y = 24, className, ...props }: ScrollRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={viewportOnce}
      transition={{ duration: 0.9, delay, ease: shopEase }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function ScrollRevealStagger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScrollRevealItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={fadeUpSoft} className={className}>
      {children}
    </motion.div>
  );
}
