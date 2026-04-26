"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NudgeBannerProps {
  title?: string;
  description: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
}

export function NudgeBanner({
  title = "FlowDrop recommendation",
  description,
  primaryLabel = "Apply",
  secondaryLabel = "Dismiss",
  onPrimary,
  onSecondary,
}: NudgeBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  const handlePrimary = () => {
    onPrimary?.();
  };

  const handleSecondary = () => {
    if (onSecondary) {
      onSecondary();
      return;
    }

    setDismissed(true);
  };

  return (
    <section className="mt-6 rounded-[var(--radius-lg)] border border-[var(--color-ai-border)] bg-[var(--color-ai-glow)] p-4">
      <p className="mb-1 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-[var(--color-ai-text)]">
        <Sparkles className="h-3.5 w-3.5" />
        {title}
      </p>
      <p className="text-[15px] text-[var(--color-ai-text)]">{description}</p>
      <div className="mt-3 flex gap-2">
        <Button onClick={handlePrimary}>{primaryLabel}</Button>
        <Button variant="ghost" onClick={handleSecondary}>{secondaryLabel}</Button>
      </div>
    </section>
  );
}
