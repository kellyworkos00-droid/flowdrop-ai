"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowUpRight,
  ChartNoAxesColumn,
  CircleCheckBig,
  Clock3,
  Layers3,
  MessageSquareText,
  Paperclip,
  Sparkles,
  SquareCheckBig,
  Users,
} from "lucide-react";
import { AICard } from "@/components/ui/ai-card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropCard } from "@/components/ui/drop-card";
import { DropZone } from "@/components/ui/drop-zone";
import { getDrops } from "@/lib/drops";
import { useDropsStore } from "@/store/useDropsStore";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";

export default function HomePage() {
  const { drops, selectDrop, setNewDropModalOpen, setDrops } = useDropsStore();
  const { workspace } = useWorkspaceStore();
  const query = useQuery({ queryKey: ["drops"], queryFn: getDrops });

  useEffect(() => {
    if (query.data) {
      setDrops(query.data);
    }
  }, [query.data, setDrops]);

  const totalDrops = drops.length;
  const inProgressDrops = drops.filter((drop) => drop.status === "in_progress").length;
  const doneDrops = drops.filter((drop) => drop.status === "done").length;
  const blockedDrops = drops.filter((drop) => drop.status === "blocked");
  const priorityDrops = drops.filter((drop) => drop.status !== "done").slice(0, 4);
  const recentDrops = drops.slice(0, 6);

  return (
    <div className="grid gap-4 xl:grid-cols-[2.2fr_1fr]">
      <section className="space-y-4">
        <div className="rounded-[var(--radius-xl)] border border-white/10 bg-[var(--color-surface-1)] p-5 shadow-[var(--shadow-md)]">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="font-[var(--font-display)] text-[22px] font-semibold">Today&apos;s Flow</h2>
              <p className="mt-1 text-[13px] text-[var(--color-text-secondary)]">A quick snapshot of what needs attention right now.</p>
            </div>
            <Button size="sm" className="gap-1.5" onClick={() => setNewDropModalOpen(true)}>
              <Sparkles className="h-3.5 w-3.5" /> New Drop
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <article className="rounded-[var(--radius-lg)] border border-white/8 bg-[var(--color-surface-2)] p-4">
              <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-[10px] bg-[rgba(45,107,228,0.18)] text-[var(--color-brand-primary)]">
                <Layers3 className="h-4 w-4" />
              </div>
              <p className="text-[24px] font-semibold text-[var(--color-text-primary)]">{totalDrops}</p>
              <p className="text-[12px] text-[var(--color-text-secondary)]">Total active drops</p>
            </article>

            <article className="rounded-[var(--radius-lg)] border border-white/8 bg-[var(--color-surface-2)] p-4">
              <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-[10px] bg-[rgba(245,166,35,0.18)] text-[var(--color-warning)]">
                <Clock3 className="h-4 w-4" />
              </div>
              <p className="text-[24px] font-semibold text-[var(--color-text-primary)]">{inProgressDrops}</p>
              <p className="text-[12px] text-[var(--color-text-secondary)]">In progress now</p>
            </article>

            <article className="rounded-[var(--radius-lg)] border border-white/8 bg-[var(--color-surface-2)] p-4">
              <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-[10px] bg-[rgba(0,196,140,0.2)] text-[var(--color-success)]">
                <CircleCheckBig className="h-4 w-4" />
              </div>
              <p className="text-[24px] font-semibold text-[var(--color-text-primary)]">{doneDrops}</p>
              <p className="text-[12px] text-[var(--color-text-secondary)]">Completed recently</p>
            </article>
          </div>
        </div>

        <AICard
          title={`You have ${priorityDrops.length} thing${priorityDrops.length === 1 ? "" : "s"} waiting on you today.`}
          description="Top items are prioritized below so you can move quickly without sorting your whole feed."
          className="border-[rgba(0,229,195,0.28)]"
        >
          <div className="mt-3 flex flex-wrap gap-2">
            {priorityDrops.slice(0, 3).map((drop) => (
              <button
                key={drop.id}
                type="button"
                onClick={() => selectDrop(drop.id)}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-ai-border)] px-3 py-1 text-[11px] text-[var(--color-ai-text)] transition-all hover:bg-[rgba(0,229,195,0.14)]"
              >
                {drop.title}
              </button>
            ))}
          </div>
        </AICard>

        {drops.length === 0 ? (
          <div className="flex min-h-[56dvh] items-center justify-center">
            <article className="w-full max-w-[620px] rounded-[var(--radius-xl)] border border-white/10 bg-[var(--color-surface-1)] p-6 text-center shadow-[var(--shadow-md)]">
              <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-[14px] border border-[var(--color-ai-border)] bg-[var(--color-ai-glow)] text-[var(--color-brand-accent)]">
                <ChartNoAxesColumn className="h-6 w-6" />
              </div>
              <h3 className="font-[var(--font-display)] text-[24px] font-semibold">Build momentum with your first drop</h3>
              <p className="mx-auto mt-2 max-w-md text-[15px] text-[var(--color-text-secondary)]">
                Start with one task, one file, or one note. FlowDrop will shape the rest around your team.
              </p>
              <DropZone className="mt-4" />
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => setNewDropModalOpen(true)} className="gap-1.5"><SquareCheckBig className="h-3.5 w-3.5" />Add a task</Button>
                <Button variant="secondary" size="sm" className="gap-1.5"><Paperclip className="h-3.5 w-3.5" />Upload a file</Button>
                <Button variant="secondary" size="sm" className="gap-1.5"><MessageSquareText className="h-3.5 w-3.5" />Write a note</Button>
              </div>
            </article>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            <article className="rounded-[var(--radius-lg)] border border-white/10 bg-[var(--color-surface-1)] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-[15px] font-semibold">Priority Queue</h3>
                <span className="text-[12px] text-[var(--color-text-secondary)]">{priorityDrops.length} items</span>
              </div>
              <div>
                {priorityDrops.map((drop) => (
                  <DropCard key={drop.id} drop={drop} onClick={() => selectDrop(drop.id)} className="mb-2" />
                ))}
              </div>
            </article>

            <article className="rounded-[var(--radius-lg)] border border-white/10 bg-[var(--color-surface-1)] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-[15px] font-semibold">Recent Activity</h3>
                <button type="button" className="inline-flex items-center gap-1 text-[12px] text-[var(--color-brand-primary)] hover:underline">
                  View all <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
              <div>
                {recentDrops.map((drop) => (
                  <DropCard key={drop.id} drop={drop} onClick={() => selectDrop(drop.id)} className="mb-2" />
                ))}
              </div>
            </article>
          </div>
        )}
      </section>

      <aside className="space-y-4">
        <section className="rounded-[var(--radius-lg)] border border-white/10 bg-[var(--color-surface-1)] p-4">
          <div className="mb-3 flex items-center gap-2">
            <Users className="h-4 w-4 text-[var(--color-brand-primary)]" />
            <h3 className="text-[15px] font-medium">Team Pulse</h3>
          </div>
          <div className="space-y-3">
            {workspace.members.map((member) => (
              <article key={member.id} className="rounded-[var(--radius-md)] border border-white/8 bg-[var(--color-surface-2)] p-3">
                <div className="flex items-center gap-2">
                  <Avatar name={member.name} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate text-[13px]">{member.name}</p>
                    <p className="truncate text-[12px] text-[var(--color-text-secondary)]">{member.lastDropTitle}</p>
                  </div>
                  <span className="ml-auto text-[11px] text-[var(--color-text-tertiary)]">{member.lastUpdated}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[var(--radius-lg)] border border-[rgba(255,77,109,0.32)] bg-[rgba(255,77,109,0.08)] p-4">
          <div className="mb-2 flex items-center gap-2 text-[var(--color-danger)]">
            <AlertTriangle className="h-4 w-4" />
            <h3 className="text-[14px] font-semibold">Blocked Watchlist</h3>
          </div>
          {blockedDrops.length === 0 ? (
            <p className="text-[13px] text-[var(--color-text-secondary)]">No blockers right now. Keep the momentum going.</p>
          ) : (
            <div className="space-y-2">
              {blockedDrops.map((drop) => (
                <button
                  key={drop.id}
                  type="button"
                  onClick={() => selectDrop(drop.id)}
                  className="w-full rounded-[10px] border border-[rgba(255,77,109,0.25)] bg-[rgba(255,77,109,0.08)] p-2 text-left text-[12px] text-[var(--color-text-primary)] transition-all hover:bg-[rgba(255,77,109,0.14)]"
                >
                  <p className="line-clamp-1">{drop.title}</p>
                  <p className="text-[11px] text-[var(--color-text-secondary)]">{drop.assigneeNames[0] ?? "Unassigned"}</p>
                </button>
              ))}
            </div>
          )}
        </section>
      </aside>
    </div>
  );
}
