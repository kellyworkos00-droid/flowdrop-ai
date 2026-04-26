"use client";

import { ClipboardList, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { starterPlaybooks, type PlaybookTemplate } from "@/lib/templates/playbooks";
import { useDropsStore } from "@/store/useDropsStore";
import { useUserStore } from "@/store/useUserStore";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import type { DropItem } from "@/types/drop";

function toDueDate(days: number): string {
  const dt = new Date();
  dt.setDate(dt.getDate() + days);
  return dt.toISOString().split("T")[0];
}

export function TemplatePlaybooks() {
  const { addDrop } = useDropsStore();
  const { user } = useUserStore();
  const { workspace } = useWorkspaceStore();

  const launchPlaybook = (playbook: PlaybookTemplate) => {
    const defaultAssignee = workspace.members.find((member) => member.id !== user.id) ?? workspace.members[0];

    playbook.tasks.forEach((task, index) => {
      const targetMember = index % 2 === 0 ? user : defaultAssignee;
      const now = new Date().toISOString();
      const drop: DropItem = {
        id: `tpl_${playbook.id}_${Date.now()}_${index}`,
        title: `${playbook.name}: ${task}`,
        description: playbook.description,
        type: "task",
        status: "todo",
        priority: playbook.defaults.priority,
        assignees: targetMember ? [targetMember.id] : [],
        assigneeNames: targetMember ? [targetMember.name] : [],
        watcherIds: [user.id],
        watcherNames: [user.name],
        timestamp: "Just now",
        createdAt: now,
        updatedAt: now,
        dueDate: toDueDate(playbook.defaults.dueInDays),
        activity: [{ id: `a_tpl_${index}`, actor: "System", action: `Launched from ${playbook.name}`, timestamp: "Just now" }],
      };
      addDrop(drop);
    });
  };

  return (
    <article className="rounded-[var(--radius-xl)] border border-white/10 bg-[var(--color-surface-1)] p-4">
      <div className="mb-3 flex items-center gap-2">
        <ClipboardList className="h-4 w-4 text-[var(--color-brand-primary)]" />
        <h3 className="text-[15px] font-semibold">Templates & Playbooks</h3>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {starterPlaybooks.map((playbook) => (
          <div key={playbook.id} className="rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] p-3">
            <p className="text-[14px] font-medium">{playbook.name}</p>
            <p className="mt-1 line-clamp-2 text-[12px] text-[var(--color-text-secondary)]">{playbook.description}</p>
            <p className="mt-2 text-[11px] text-[var(--color-text-tertiary)]">{playbook.tasks.length} tasks · SLA {playbook.defaults.dueInDays}d</p>
            <Button size="sm" className="mt-3 w-full gap-1.5" onClick={() => launchPlaybook(playbook)}>
              <Rocket className="h-3.5 w-3.5" /> Launch template
            </Button>
          </div>
        ))}
      </div>
    </article>
  );
}
