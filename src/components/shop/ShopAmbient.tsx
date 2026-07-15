"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export function ShopAmbient() {
  const { scrollY } = useScroll();
  const orbOneY = useTransform(scrollY, [0, 900], [0, 140]);
  const orbTwoY = useTransform(scrollY, [0, 1400], [0, -100]);
  const orbThreeY = useTransform(scrollY, [0, 2000], [0, 80]);
  const heroFade = useTransform(scrollY, [0, 500], [1, 0.45]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden shop-grain">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#F7F4EF_0%,#F3EFE8_38%,#F6F3EE_68%,#F8F5F0_100%)]" />

      <motion.div
        style={{ y: orbOneY, opacity: heroFade }}
        className="absolute -top-[18%] -right-[8%] h-[min(72vw,820px)] w-[min(72vw,820px)] rounded-full bg-[radial-gradient(circle_at_center,rgba(200,154,75,0.11)_0%,rgba(200,154,75,0.03)_42%,transparent_72%)] blur-2xl"
        aria-hidden
      />
      <motion.div
        style={{ y: orbTwoY }}
        className="absolute top-[32%] -left-[12%] h-[min(58vw,640px)] w-[min(58vw,640px)] rounded-full bg-[radial-gradient(circle_at_center,rgba(15,42,36,0.06)_0%,rgba(15,42,36,0.015)_45%,transparent_70%)] blur-2xl"
        aria-hidden
      />
      <motion.div
        style={{ y: orbThreeY }}
        className="absolute bottom-[8%] right-[18%] h-[min(40vw,480px)] w-[min(40vw,480px)] rounded-full bg-[radial-gradient(circle_at_center,rgba(200,154,75,0.06)_0%,transparent_68%)] blur-3xl"
        aria-hidden
      />

      <div
        className="absolute inset-x-0 top-0 h-[520px] bg-[linear-gradient(180deg,rgba(255,255,255,0.55)_0%,transparent_100%)]"
        aria-hidden
      />
    </div>
  );
}
