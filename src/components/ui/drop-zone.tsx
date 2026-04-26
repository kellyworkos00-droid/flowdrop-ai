"use client";

import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropZoneProps {
  label?: string;
  compact?: boolean;
  className?: string;
}

export function DropZone({ label = "Drag anything here, or click to type", compact = false, className }: DropZoneProps) {
  return (
    <button
      type="button"
      className={cn(
        "focus-ring flow-interactive flex w-full items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--color-ai-border)] bg-[rgba(0,229,195,0.03)] text-center text-[13px] italic text-[var(--color-text-secondary)] hover:border-[var(--color-brand-accent)] hover:bg-[rgba(0,229,195,0.06)]",
        compact ? "h-20 px-4" : "min-h-40 p-10",
        className,
      )}
      aria-label="Drop zone"
    >
      <span className="flex items-center gap-2">
        <Upload className="h-4 w-4" aria-hidden />
        {label}
      </span>
    </button>
  );
}
