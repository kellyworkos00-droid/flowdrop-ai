"use client";

import { motion } from "framer-motion";

interface StepIndicatorProps {
  total: number;
  current: number;
}

export function StepIndicator({ total, current }: StepIndicatorProps) {
  return (
    <div className="mb-8 flex gap-2" aria-label={`Step ${current + 1} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            width: i === current ? 24 : 6,
            background: i < current ? "#00E5C3" : i === current ? "#2D6BE4" : "#1E2236",
          }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          style={{ height: 6, borderRadius: 9999 }}
        />
      ))}
    </div>
  );
}
