"use client";

import { motion } from "framer-motion";

interface OnboardingCardProps {
  children: React.ReactNode;
}

export function OnboardingCard({ children }: OnboardingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
      style={{
        background: "#141726",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20,
        padding: "36px 32px",
        width: "100%",
        maxWidth: 460,
      }}
      className="relative z-10"
    >
      {children}
    </motion.div>
  );
}
