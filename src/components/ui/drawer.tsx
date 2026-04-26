"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  className?: string;
  children: React.ReactNode;
}

export function Drawer({ open, onClose, title, className, children }: DrawerProps) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            className="fixed inset-0 z-40 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-label="Close drawer"
          />
          <motion.aside
            className={cn(
              "fixed right-0 top-0 z-50 h-full w-full max-w-[480px] border-l border-white/10 bg-[var(--color-surface-1)] p-5 shadow-[var(--shadow-lg)]",
              className,
            )}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          >
            {title ? <h3 className="mb-4 font-[var(--font-display)] text-[18px] font-semibold">{title}</h3> : null}
            {children}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
