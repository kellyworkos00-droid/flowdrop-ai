"use client";

import { CalendarClock, Lightbulb, Link2, MessageSquareText, Paperclip, SquareCheckBig, TriangleAlert } from "lucide-react";
import { StatusPill } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { DropItem, DropType } from "@/types/drop";

interface DropCardProps {
  drop: DropItem;
  className?: string;
  onClick?: () => void;
}

const typeConfig: Record<DropType, { icon: React.ReactNode; border: string }> = {
  task: { icon: <SquareCheckBig className="h-4 w-4" />, border: "border-l-[var(--color-brand-primary)]" },
  idea: { icon: <Lightbulb className="h-4 w-4" />, border: "border-l-[var(--color-warning)]" },
  file: { icon: <Paperclip className="h-4 w-4" />, border: "border-l-[#8B5CF6]" },
  link: { icon: <Link2 className="h-4 w-4" />, border: "border-l-[var(--color-brand-accent)]" },
  blocker: { icon: <TriangleAlert className="h-4 w-4" />, border: "border-l-[var(--color-danger)]" },
  note: { icon: <MessageSquareText className="h-4 w-4" />, border: "border-l-[var(--color-text-tertiary)]" },
};

export function DropCard({ drop, className, onClick }: DropCardProps) {
  const config = typeConfig[drop.type];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flow-card mb-2 w-full rounded-[var(--radius-lg)] border border-white/10 border-l-2 bg-[var(--color-surface-1)] p-[14px] text-left",
        config.border,
        className,
      )}
    >
      <div className="mb-2 flex items-center gap-2">
        {config.icon}
        <p className="line-clamp-1 text-[15px] font-medium">{drop.title}</p>
        <StatusPill status={drop.status} className="ml-auto" />
      </div>
      {drop.description ? <p className="mb-3 text-[13px] text-[var(--color-text-secondary)]">{drop.description}</p> : null}
      <div className="flex items-center gap-2 text-[12px] text-[var(--color-text-secondary)]">
        <Avatar name={drop.assigneeNames[0] ?? "Unassigned"} size="xs" />
        <span>Assigned to {drop.assigneeNames[0] ?? "Unassigned"}</span>
        <span className="ml-auto inline-flex items-center gap-1">
          <CalendarClock className="h-3.5 w-3.5" />
          {drop.timestamp}
        </span>
      </div>
    </button>
  );
}
