import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AICardProps {
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export function AICard({ title, description, className, children }: AICardProps) {
  return (
    <article
      className={cn(
        "flow-card rounded-[var(--radius-lg)] border border-[var(--color-ai-border)] bg-[var(--color-ai-glow)] p-4",
        className,
      )}
    >
      <div className="mb-2 flex items-center gap-2 text-[var(--color-ai-text)]">
        <Sparkles className="h-4 w-4" aria-hidden />
        <h3 className="font-medium">{title}</h3>
      </div>
      {description ? <p className="text-[13px] text-[var(--color-text-secondary)]">{description}</p> : null}
      {children}
    </article>
  );
}
