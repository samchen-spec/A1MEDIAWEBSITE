"use client";

import { motion } from "framer-motion";

type Variant = "up" | "left" | "right" | "scale" | "fade";

const VARIANTS: Record<Variant, { hidden: Record<string, number>; shown: Record<string, number> }> = {
  up:    { hidden: { opacity: 0, y: 34 },              shown: { opacity: 1, y: 0 } },
  left:  { hidden: { opacity: 0, x: -28, y: 12 },      shown: { opacity: 1, x: 0, y: 0 } },
  right: { hidden: { opacity: 0, x: 28, y: 12 },       shown: { opacity: 1, x: 0, y: 0 } },
  scale: { hidden: { opacity: 0, y: 26, scale: 0.97 }, shown: { opacity: 1, y: 0, scale: 1 } },
  fade:  { hidden: { opacity: 0 },                     shown: { opacity: 1 } },
};

/* Reveals re-run every time an element enters the viewport, in both scroll
   directions, so the page keeps moving as you go back up. `once` is deliberately
   false here — see CLAUDE.md. */
export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
  variant = "up",
  amount = 0.15,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: Variant;
  amount?: number;
}) {
  const v = VARIANTS[variant];
  return (
    <motion.div
      initial={v.hidden}
      whileInView={v.shown}
      exit={v.hidden}
      viewport={{ once: false, amount, margin: "-60px 0px -60px 0px" }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
