"use client";

import { motion } from "framer-motion";

interface TypeCardProps {
  icon: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function TypeCard({ icon, label, selected, onClick }: TypeCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={false}
      animate={{ scale: selected ? [1, 0.96, 1] : 1 }}
      transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
      className={`relative rounded-[12px] border p-[14px] text-left transition-all duration-180 ${
        selected
          ? "border-[#2D6BE4] bg-[rgba(45,107,228,0.1)]"
          : "border-[rgba(255,255,255,0.08)] bg-[#1E2236] hover:border-[rgba(45,107,228,0.35)] hover:bg-[#252A42]"
      }`}
    >
      {selected ? (
        <span className="absolute right-2 top-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#2D6BE4] text-[10px] text-white">✓</span>
      ) : null}
      <div className="mb-2 text-[20px]">{icon}</div>
      <div className="text-[12px] font-medium text-[#F0F2FF]">{label}</div>
    </motion.button>
  );
}
