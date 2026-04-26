"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Droplets, MessageSquareText, Paperclip, SquareCheckBig } from "lucide-react";
import { AICard } from "@/components/ui/ai-card";
import { DropCard } from "@/components/ui/drop-card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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

  return (
    <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
      <section>
        <h2 className="mb-3 text-[16px] font-medium">What needs your attention</h2>
        <AICard title="You have 3 things waiting on you today." description="Two approvals, one blocker, and one high-priority task due this afternoon." />
        {drops.length === 0 ? (
          <div className="mt-5 flex min-h-[70dvh] items-center justify-center">
            <article className="w-full max-w-[540px] rounded-[var(--radius-xl)] border border-white/10 bg-[var(--color-surface-1)] p-6 text-center shadow-[var(--shadow-md)]">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-ai-glow)] text-[var(--color-brand-accent)]" style={{ animation: "drop-pulse 1.8s ease-in-out infinite" }}>
                <Droplets className="h-6 w-6" />
              </div>
              <h3 className="font-[var(--font-display)] text-[24px] font-semibold">Drop anything to start.</h3>
              <p className="mx-auto mt-2 max-w-md text-[15px] text-[var(--color-text-secondary)]">
                Tasks, ideas, files, decisions - just drop them in. FlowDrop figures out the rest.
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
          <div className="mt-4">
            {drops.map((drop) => (
              <DropCard key={drop.id} drop={drop} onClick={() => selectDrop(drop.id)} />
            ))}
          </div>
        )}
      </section>

      <aside className="rounded-[var(--radius-lg)] border border-white/10 bg-[var(--color-surface-1)] p-4">
        <h3 className="mb-3 text-[15px] font-medium">Team Pulse</h3>
        <div className="space-y-3">
          {workspace.members.map((member) => (
            <article key={member.id} className="rounded-[var(--radius-md)] border border-white/8 bg-[var(--color-surface-2)] p-3">
              <div className="flex items-center gap-2">
                <Avatar name={member.name} size="sm" />
                <div>
                  <p className="text-[13px]">{member.name}</p>
                  <p className="text-[12px] text-[var(--color-text-secondary)]">{member.lastDropTitle}</p>
                </div>
                <span className="ml-auto text-[11px] text-[var(--color-text-tertiary)]">{member.lastUpdated}</span>
              </div>
            </article>
          ))}
        </div>
      </aside>
    </div>
  );
}
