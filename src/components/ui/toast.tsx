"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

type ToastKind = "info" | "success" | "error";

interface ToastItem {
  id: string;
  message: string;
  kind: ToastKind;
}

interface ToastContextValue {
  pushToast: (message: string, kind?: ToastKind) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

const kindClasses: Record<ToastKind, string> = {
  info: "border-[var(--color-brand-primary)]/35",
  success: "border-[var(--color-success)]/35",
  error: "border-[var(--color-danger)]/35",
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [items, setItems] = React.useState<ToastItem[]>([]);

  const pushToast = React.useCallback((message: string, kind: ToastKind = "info") => {
    const id = crypto.randomUUID();
    setItems((prev) => [
      ...prev.slice(0, 2),
      {
        id,
        message,
        kind,
      },
    ]);

    window.setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }, 2800);
  }, []);

  return (
    <ToastContext.Provider value={{ pushToast }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[70] flex w-[300px] flex-col gap-2">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              className={`rounded-[var(--radius-md)] border bg-[var(--color-surface-2)] px-3 py-2 text-[13px] text-[var(--color-text-primary)] shadow-[var(--shadow-md)] ${kindClasses[item.kind]}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
            >
              {item.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
