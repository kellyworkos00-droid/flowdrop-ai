"use client";

import { useState } from "react";
import { BellOff, CalendarClock, CheckCircle2, RefreshCw, ShieldCheck } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { useDropsStore } from "@/store/useDropsStore";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import type { DropItem } from "@/types/drop";

interface QuickActionBarProps {
  drop: DropItem;
}

export function QuickActionBar({ drop }: QuickActionBarProps) {
  const { completeDrop, unblockDrop, snoozeDrop, reassignDrop, updateDrop } = useDropsStore();
  const { workspace } = useWorkspaceStore();
  const { pushToast } = useToast();
  const [showReassign, setShowReassign] = useState(false);
  const [showSnooze, setShowSnooze] = useState(false);
  const [showDueDate, setShowDueDate] = useState(false);

  const isBlocked = drop.status === "blocked";
  const isDone = drop.status === "done";

  if (isDone) {
    return (
      <p className="mt-2 text-[11px] text-[var(--color-success)]">Completed</p>
    );
  }

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex flex-wrap gap-1.5">
        {/* Complete */}
        <button
          type="button"
          onClick={() => {
            completeDrop(drop.id);
            pushToast(`Marked \"${drop.title}\" complete`, "success");
          }}
          className="inline-flex items-center gap-1 rounded-full border border-[var(--color-success)]/30 bg-[var(--color-success)]/10 px-2.5 py-1 text-[11px] text-[var(--color-success)] transition-all hover:bg-[var(--color-success)]/20"
        >
          <CheckCircle2 className="h-3 w-3" /> Complete
        </button>

        {/* Unblock */}
        {isBlocked ? (
          <button
            type="button"
            onClick={() => {
              unblockDrop(drop.id);
              pushToast(`Unblocked \"${drop.title}\"`, "success");
            }}
            className="inline-flex items-center gap-1 rounded-full border border-[var(--color-brand-primary)]/30 bg-[var(--color-brand-primary)]/10 px-2.5 py-1 text-[11px] text-[var(--color-brand-primary)] transition-all hover:bg-[var(--color-brand-primary)]/20"
          >
            <ShieldCheck className="h-3 w-3" /> Unblock
          </button>
        ) : null}

        {/* Reassign */}
        <button
          type="button"
          onClick={() => {
            setShowSnooze(false);
            setShowDueDate(false);
            setShowReassign((prev) => !prev);
          }}
          className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] text-[var(--color-text-secondary)] transition-all hover:bg-white/10"
        >
          <RefreshCw className="h-3 w-3" /> Reassign
        </button>

        {/* Snooze */}
        <button
          type="button"
          onClick={() => {
            setShowReassign(false);
            setShowDueDate(false);
            setShowSnooze((prev) => !prev);
          }}
          className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] text-[var(--color-text-secondary)] transition-all hover:bg-white/10"
        >
          <BellOff className="h-3 w-3" /> Snooze
        </button>

        {/* Set due date */}
        <button
          type="button"
          onClick={() => {
            setShowReassign(false);
            setShowSnooze(false);
            setShowDueDate((prev) => !prev);
          }}
          className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] text-[var(--color-text-secondary)] transition-all hover:bg-white/10"
        >
          <CalendarClock className="h-3 w-3" /> Due date
        </button>
      </div>

      {/* Reassign picker */}
      {showReassign ? (
        <div className="rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] p-2">
          <p className="mb-1 text-[10px] uppercase tracking-wide text-[var(--color-text-tertiary)]">Reassign to</p>
          <div className="flex flex-wrap gap-1.5">
            {workspace.members.map((member) => (
              <button
                key={member.id}
                type="button"
                onClick={() => {
                  reassignDrop(drop.id, member.id, member.name);
                  setShowReassign(false);
                  pushToast(`Reassigned to ${member.name}`, "info");
                }}
                className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] text-[var(--color-text-primary)] transition-all hover:bg-white/10"
              >
                {member.name}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* Snooze picker */}
      {showSnooze ? (
        <div className="rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] p-2">
          <p className="mb-1 text-[10px] uppercase tracking-wide text-[var(--color-text-tertiary)]">Snooze until</p>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: "Tomorrow", hours: 24 },
              { label: "2 days", hours: 48 },
              { label: "Next week", hours: 168 },
            ].map((option) => (
              <button
                key={option.hours}
                type="button"
                onClick={() => {
                  const until = new Date(Date.now() + option.hours * 3_600_000).toISOString();
                  snoozeDrop(drop.id, { until, reason: `Snoozed for ${option.label.toLowerCase()}` });
                  setShowSnooze(false);
                  pushToast(`Snoozed until ${option.label.toLowerCase()}`, "info");
                }}
                className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] text-[var(--color-text-primary)] transition-all hover:bg-white/10"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* Due date picker */}
      {showDueDate ? (
        <div className="rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] p-2">
          <p className="mb-1 text-[10px] uppercase tracking-wide text-[var(--color-text-tertiary)]">Set due date</p>
          <input
            type="date"
            defaultValue={drop.dueDate ?? ""}
            min={new Date().toISOString().split("T")[0]}
            onChange={(event) => {
              if (event.target.value) {
                updateDrop(drop.id, { dueDate: event.target.value });
                setShowDueDate(false);
                pushToast(`Due date set to ${event.target.value}`, "success");
              }
            }}
            className="rounded-[var(--radius-sm)] border border-white/10 bg-transparent px-2 py-1 text-[12px] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-brand-primary)]"
          />
        </div>
      ) : null}
    </div>
  );
}
