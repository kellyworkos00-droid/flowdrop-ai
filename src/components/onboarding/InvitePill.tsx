"use client";

import { motion } from "framer-motion";

interface InvitePillProps {
  email: string;
  onRemove: () => void;
}

function getInitials(email: string): string {
  const prefix = email.split("@")[0] ?? "";
  return prefix.slice(0, 2).toUpperCase();
}

export function InvitePill({ email, onRemove }: InvitePillProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="inline-flex items-center gap-2 rounded-full border border-[rgba(0,229,195,0.2)] bg-[#1E2236] px-[10px] py-1 text-[11px] text-[#8B90B8]"
    >
      <span className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-full border border-[rgba(0,229,195,0.25)] bg-[rgba(0,229,195,0.12)] text-[9px] font-medium text-[#00E5C3]">
        {getInitials(email)}
      </span>
      <span>{email}</span>
      <button type="button" onClick={onRemove} className="text-[#8B90B8] transition-colors hover:text-[#F0F2FF]" aria-label={`Remove ${email}`}>
        ×
      </button>
    </motion.div>
  );
}
