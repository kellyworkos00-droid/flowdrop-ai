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
        background: "linear-gradient(180deg, rgba(30,34,54,0.95) 0%, rgba(20,23,38,0.95) 100%)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 20,
        padding: "38px 34px",
        width: "100%",
        maxWidth: 460,
        boxShadow: "0 20px 60px rgba(2,6,23,0.55)",
        backdropFilter: "blur(12px)",
      }}
      className="relative z-10"
    >
      {children}
    </motion.div>
  );
}
