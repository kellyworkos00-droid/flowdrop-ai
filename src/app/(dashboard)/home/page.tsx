"use client";

import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowRight,
  BellOff,
  CircleCheckBig,
  Clock3,
  GitMerge,
  Handshake,
  Layers3,
  MessageSquareText,
  Paperclip,
  Sparkles,
  SquareCheckBig,
  Timer,
  Users,
  Zap,
} from "lucide-react";
import { AutomationAlerts } from "@/components/drops/automation-alerts";
import { QuickActionBar } from "@/components/drops/quick-action-bar";
import { AICard } from "@/components/ui/ai-card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropZone } from "@/components/ui/drop-zone";
import { evaluateRules, rankDropsForToday } from "@/lib/automation/rules";
import { getDrops } from "@/lib/drops";
import { useDropsStore } from "@/store/useDropsStore";
import { useUserStore } from "@/store/useUserStore";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";

export default function HomePage() {
  const { drops, selectDrop, setNewDropModalOpen, setDrops } = useDropsStore();
  const { workspace } = useWorkspaceStore();
  const { user } = useUserStore();
  const query = useQuery({ queryKey: ["drops"], queryFn: getDrops });

  useEffect(() => {
    if (query.data) setDrops(query.data);
  }, [query.data, setDrops]);

  // ── Derived data ────────────────────────────────────────────────────────────
  const topTasks = useMemo(() => rankDropsForToday(drops, user.name, 5), [drops, user.name]);
  const blockers = useMemo(() => drops.filter((d) => d.status === "blocked"), [drops]);
  const overdue = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return drops.filter((d) => d.dueDate && d.dueDate < today && d.status !== "done");
  }, [drops]);
  const waitingOnMe = useMemo(
    () => drops.filter((d) => d.watcherNames?.some((n) => n.toLowerCase() === user.name.toLowerCase()) && d.status !== "done"),
    [drops, user.name],
  );
  const handoffs = useMemo(
    () =>
      drops.filter(
        (d) =>
          d.assigneeNames.some((n) => n.toLowerCase() !== user.name.toLowerCase()) &&
          d.status === "in_progress",
      ).slice(0, 4),
    [drops, user.name],
  );
  const automationSignals = useMemo(() => evaluateRules(drops), [drops]);
  const criticalCount = automationSignals.filter((s) => s.severity === "critical").length;

  const totalDrops = drops.length;
  const inProgressDrops = drops.filter((d) => d.status === "in_progress").length;
  const doneDrops = drops.filter((d) => d.status === "done").length;

  if (drops.length === 0) {
    return (
      <div className="flex min-h-[56dvh] items-center justify-center">
        <article className="w-full max-w-[620px] rounded-[var(--radius-xl)] border border-white/10 bg-[var(--color-surface-1)] p-6 text-center shadow-[var(--shadow-md)]">
          <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-[14px] border border-[var(--color-ai-border)] bg-[var(--color-ai-glow)] text-[var(--color-brand-accent)]">
            <Layers3 className="h-6 w-6" />
          </div>
          <h3 className="font-[var(--font-display)] text-[24px] font-semibold">Build momentum with your first drop</h3>
          <p className="mx-auto mt-2 max-w-md text-[15px] text-[var(--color-text-secondary)]">
            Start with one task, one file, or one note. FlowDrop will shape the rest around your team.
          </p>
          <DropZone className="mt-4" />
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setNewDropModalOpen(true)} className="gap-1.5">
              <SquareCheckBig className="h-3.5 w-3.5" /> Add a task
            </Button>
            <Button variant="secondary" size="sm" className="gap-1.5">
              <Paperclip className="h-3.5 w-3.5" /> Upload a file
            </Button>
            <Button variant="secondary" size="sm" className="gap-1.5">
              <MessageSquareText className="h-3.5 w-3.5" /> Write a note
            </Button>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ── Header bar ──────────────────────────────────────────────────────── */}
      <div className="rounded-[var(--radius-xl)] border border-white/10 bg-[var(--color-surface-1)] p-5 shadow-[var(--shadow-md)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-[var(--font-display)] text-[22px] font-semibold">Today&apos;s Command Center</h2>
            <p className="mt-1 text-[13px] text-[var(--color-text-secondary)]">
              Everything you need to act on, right now — no navigating required.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {criticalCount > 0 ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(255,77,109,0.35)] bg-[rgba(255,77,109,0.1)] px-3 py-1 text-[12px] text-[var(--color-danger)]">
                <AlertTriangle className="h-3.5 w-3.5" />
                {criticalCount} critical
              </span>
            ) : null}
            <Button size="sm" className="gap-1.5" onClick={() => setNewDropModalOpen(true)}>
              <Sparkles className="h-3.5 w-3.5" /> New Drop
            </Button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <article className="rounded-[var(--radius-lg)] border border-white/8 bg-[var(--color-surface-2)] p-4">
            <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-[10px] bg-[rgba(45,107,228,0.18)] text-[var(--color-brand-primary)]">
              <Layers3 className="h-4 w-4" />
            </div>
            <p className="text-[24px] font-semibold">{totalDrops}</p>
            <p className="text-[12px] text-[var(--color-text-secondary)]">Total drops</p>
          </article>
          <article className="rounded-[var(--radius-lg)] border border-white/8 bg-[var(--color-surface-2)] p-4">
            <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-[10px] bg-[rgba(245,166,35,0.18)] text-[var(--color-warning)]">
              <Clock3 className="h-4 w-4" />
            </div>
            <p className="text-[24px] font-semibold">{inProgressDrops}</p>
            <p className="text-[12px] text-[var(--color-text-secondary)]">In progress</p>
          </article>
          <article className="rounded-[var(--radius-lg)] border border-white/8 bg-[var(--color-surface-2)] p-4">
            <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-[10px] bg-[rgba(0,196,140,0.2)] text-[var(--color-success)]">
              <CircleCheckBig className="h-4 w-4" />
            </div>
            <p className="text-[24px] font-semibold">{doneDrops}</p>
            <p className="text-[12px] text-[var(--color-text-secondary)]">Completed</p>
          </article>
        </div>
      </div>

      {/* ── Automation signals ───────────────────────────────────────────────── */}
      {automationSignals.length > 0 ? (
        <div className="rounded-[var(--radius-xl)] border border-white/10 bg-[var(--color-surface-1)] p-4">
          <div className="mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4 text-[var(--color-warning)]" />
            <h3 className="text-[15px] font-semibold">Automation Alerts</h3>
            <span className="ml-auto rounded-full border border-white/12 px-2 py-0.5 text-[11px] text-[var(--color-text-secondary)]">
              {automationSignals.length}
            </span>
          </div>
          <AutomationAlerts signals={automationSignals} onDropClick={selectDrop} />
        </div>
      ) : (
        <AICard
          title="All clear — no automation alerts right now."
          description="FlowDrop is watching for blockers, overdue items, and stalled urgents so you don't have to."
          className="border-[rgba(0,229,195,0.22)]"
        />
      )}

      {/* ── 5 main panels ───────────────────────────────────────────────────── */}
      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr_1fr]">

        {/* Panel 1: Top 5 tasks */}
        <article className="rounded-[var(--radius-xl)] border border-white/10 bg-[var(--color-surface-1)] p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SquareCheckBig className="h-4 w-4 text-[var(--color-brand-primary)]" />
              <h3 className="text-[15px] font-semibold">Top Tasks</h3>
            </div>
            <Badge>Ranked</Badge>
          </div>
          <div className="space-y-2">
            {topTasks.length === 0 ? (
              <p className="rounded-[var(--radius-md)] border border-dashed border-white/12 bg-[var(--color-surface-2)] p-3 text-center text-[12px] text-[var(--color-text-secondary)]">
                No open tasks right now.
              </p>
            ) : (
              topTasks.map((drop) => (
                <div key={drop.id} className="rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] p-3">
                  <div className="flex items-start justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => selectDrop(drop.id)}
                      className="line-clamp-2 text-left text-[13px] font-medium hover:text-[var(--color-brand-primary)]"
                    >
                      {drop.title}
                    </button>
                    <PriorityBadge priority={drop.priority} />
                  </div>
                  {drop.dueDate ? (
                    <DueDateLabel dueDate={drop.dueDate} />
                  ) : null}
                  <QuickActionBar drop={drop} />
                </div>
              ))
            )}
          </div>
        </article>

        <div className="space-y-4">
          {/* Panel 2: Blockers */}
          <article className="rounded-[var(--radius-xl)] border border-[rgba(255,77,109,0.3)] bg-[rgba(255,77,109,0.05)] p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-[var(--color-danger)]" />
                <h3 className="text-[15px] font-semibold">Blockers</h3>
              </div>
              <span className="text-[12px] text-[var(--color-danger)]">{blockers.length}</span>
            </div>
            <div className="space-y-2">
              {blockers.length === 0 ? (
                <p className="text-[12px] text-[var(--color-text-secondary)]">No blockers. Flow is healthy.</p>
              ) : (
                blockers.map((drop) => (
                  <div key={drop.id} className="rounded-[var(--radius-md)] border border-[rgba(255,77,109,0.2)] bg-[rgba(255,77,109,0.07)] p-2.5">
                    <button
                      type="button"
                      onClick={() => selectDrop(drop.id)}
                      className="line-clamp-1 text-left text-[12px] font-medium hover:text-[var(--color-danger)]"
                    >
                      {drop.title}
                    </button>
                    {drop.blockedSince ? (
                      <p className="mt-0.5 text-[11px] text-[var(--color-text-tertiary)]">
                        <Timer className="mr-0.5 inline h-3 w-3" />
                        <BlockedTimer since={drop.blockedSince} />
                      </p>
                    ) : null}
                    <QuickActionBar drop={drop} />
                  </div>
                ))
              )}
            </div>
          </article>

          {/* Panel 3: Overdue */}
          <article className="rounded-[var(--radius-xl)] border border-[rgba(245,166,35,0.3)] bg-[rgba(245,166,35,0.05)] p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-[var(--color-warning)]" />
                <h3 className="text-[15px] font-semibold">Overdue</h3>
              </div>
              <span className="text-[12px] text-[var(--color-warning)]">{overdue.length}</span>
            </div>
            <div className="space-y-2">
              {overdue.length === 0 ? (
                <p className="text-[12px] text-[var(--color-text-secondary)]">Nothing overdue. Great shape.</p>
              ) : (
                overdue.map((drop) => (
                  <div key={drop.id} className="rounded-[var(--radius-md)] border border-[rgba(245,166,35,0.2)] bg-[rgba(245,166,35,0.07)] p-2.5">
                    <button
                      type="button"
                      onClick={() => selectDrop(drop.id)}
                      className="line-clamp-1 text-left text-[12px] font-medium hover:text-[var(--color-warning)]"
                    >
                      {drop.title}
                    </button>
                    {drop.dueDate ? <DueDateLabel dueDate={drop.dueDate} /> : null}
                    <QuickActionBar drop={drop} />
                  </div>
                ))
              )}
            </div>
          </article>
        </div>

        <div className="space-y-4">
          {/* Panel 4: Waiting on me */}
          <article className="rounded-[var(--radius-xl)] border border-white/10 bg-[var(--color-surface-1)] p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BellOff className="h-4 w-4 text-[var(--color-brand-accent)]" />
                <h3 className="text-[15px] font-semibold">Waiting on Me</h3>
              </div>
              <span className="text-[12px] text-[var(--color-text-secondary)]">{waitingOnMe.length}</span>
            </div>
            <div className="space-y-2">
              {waitingOnMe.length === 0 ? (
                <p className="text-[12px] text-[var(--color-text-secondary)]">Nothing pending your attention.</p>
              ) : (
                waitingOnMe.map((drop) => (
                  <div key={drop.id} className="rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] p-2.5">
                    <button
                      type="button"
                      onClick={() => selectDrop(drop.id)}
                      className="line-clamp-1 text-left text-[12px] font-medium hover:text-[var(--color-brand-primary)]"
                    >
                      {drop.title}
                    </button>
                    <p className="mt-0.5 text-[11px] text-[var(--color-text-tertiary)]">
                      {drop.assigneeNames[0] ?? "Unassigned"}
                    </p>
                    <QuickActionBar drop={drop} />
                  </div>
                ))
              )}
            </div>
          </article>

          {/* Panel 5: Team handoffs */}
          <article className="rounded-[var(--radius-xl)] border border-white/10 bg-[var(--color-surface-1)] p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Handshake className="h-4 w-4 text-[var(--color-brand-primary)]" />
                <h3 className="text-[15px] font-semibold">Team Handoffs</h3>
              </div>
              <span className="text-[12px] text-[var(--color-text-secondary)]">{handoffs.length}</span>
            </div>
            <div className="space-y-2">
              {handoffs.length === 0 ? (
                <p className="text-[12px] text-[var(--color-text-secondary)]">No active handoffs in progress.</p>
              ) : (
                handoffs.map((drop) => (
                  <div key={drop.id} className="rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] p-2.5">
                    <button
                      type="button"
                      onClick={() => selectDrop(drop.id)}
                      className="line-clamp-1 text-left text-[12px] font-medium hover:text-[var(--color-brand-primary)]"
                    >
                      {drop.title}
                    </button>
                    <p className="mt-0.5 text-[11px] text-[var(--color-text-tertiary)]">
                      {drop.assigneeNames[0]} · {drop.type}
                    </p>
                  </div>
                ))
              )}
            </div>
          </article>
        </div>
      </div>

      {/* ── Team pulse ──────────────────────────────────────────────────────── */}
      <article className="rounded-[var(--radius-xl)] border border-white/10 bg-[var(--color-surface-1)] p-4">
        <div className="mb-3 flex items-center gap-2">
          <Users className="h-4 w-4 text-[var(--color-brand-primary)]" />
          <h3 className="text-[15px] font-semibold">Team Pulse</h3>
          <button
            type="button"
            className="ml-auto inline-flex items-center gap-1 text-[12px] text-[var(--color-brand-primary)] hover:underline"
          >
            Full team view <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {workspace.members.map((member) => {
            const memberDrops = drops.filter(
              (d) => d.assigneeNames.includes(member.name) && d.status !== "done",
            );
            const memberBlocked = memberDrops.filter((d) => d.status === "blocked").length;
            return (
              <div key={member.id} className="flex items-start gap-2 rounded-[var(--radius-md)] border border-white/8 bg-[var(--color-surface-2)] p-3">
                <Avatar name={member.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-[13px] font-medium">{member.name}</p>
                    <span className={`h-1.5 w-1.5 rounded-full ${member.online ? "bg-[var(--color-success)]" : "bg-white/20"}`} />
                  </div>
                  <p className="truncate text-[11px] text-[var(--color-text-secondary)]">{member.lastDropTitle}</p>
                  {memberBlocked > 0 ? (
                    <p className="mt-0.5 text-[11px] text-[var(--color-danger)]">
                      <AlertTriangle className="mr-0.5 inline h-3 w-3" />
                      {memberBlocked} blocked
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </article>
    </div>
  );
}

// ─── Small helpers ───────────────────────────────────────────────────────────

function PriorityBadge({ priority }: { priority: string }) {
  const map: Record<string, string> = {
    urgent: "border-[rgba(255,77,109,0.4)] text-[var(--color-danger)]",
    high: "border-[rgba(245,166,35,0.4)] text-[var(--color-warning)]",
    normal: "border-white/15 text-[var(--color-text-secondary)]",
    low: "border-white/10 text-[var(--color-text-tertiary)]",
  };
  return (
    <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] ${map[priority] ?? map.normal}`}>
      {priority}
    </span>
  );
}

function DueDateLabel({ dueDate }: { dueDate: string }) {
  const today = new Date().toISOString().split("T")[0];
  const isOverdue = dueDate < today;
  const isToday = dueDate === today;
  return (
    <p
      className={`mt-0.5 text-[11px] ${
        isOverdue
          ? "text-[var(--color-danger)]"
          : isToday
            ? "text-[var(--color-warning)]"
            : "text-[var(--color-text-tertiary)]"
      }`}
    >
      <GitMerge className="mr-0.5 inline h-3 w-3" />
      {isOverdue ? "Overdue" : isToday ? "Due today" : `Due ${dueDate}`}
    </p>
  );
}

function BlockedTimer({ since }: { since: string }) {
  const sinceMs = new Date(since).getTime();
  const nowMs = new Date().getTime();
  const hours = Math.round((nowMs - sinceMs) / 3_600_000);
  return <>{hours}h blocked</>;
}
