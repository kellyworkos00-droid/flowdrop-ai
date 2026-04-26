"use client";

import { X } from "lucide-react";
import { Drawer } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useDropsStore } from "@/store/useDropsStore";

export function DropDetailDrawer() {
  const { selectedDropId, selectDrop, drops } = useDropsStore();
  const drop = drops.find((item) => item.id === selectedDropId);

  return (
    <Drawer open={Boolean(drop)} onClose={() => selectDrop(null)} title={drop?.title ?? "Drop details"}>
      {drop ? (
        <div className="flex h-full flex-col">
          <div className="mb-3 flex items-center gap-2">
            <Select defaultValue={drop.status}>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
              <option value="blocked">Blocked</option>
            </Select>
            <button className="focus-ring rounded-full p-2 hover:bg-white/8" onClick={() => selectDrop(null)} aria-label="Close panel">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3 overflow-y-auto pr-1">
            <Textarea defaultValue={drop.description} placeholder="Description" className="min-h-28" />
            <Input defaultValue={drop.assigneeNames.join(", ")} placeholder="Assignees" />
            <Input type="date" defaultValue={drop.dueDate} />
            <div className="rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] p-3 text-[13px]">
              <p className="mb-2 text-[var(--color-text-secondary)]">Sub-tasks</p>
              {drop.subtasks?.map((task) => (
                <label key={task.id} className="mb-2 flex items-center gap-2 last:mb-0">
                  <input type="checkbox" defaultChecked={task.done} />
                  {task.label}
                </label>
              ))}
              <Button variant="ghost" className="mt-2 px-0">+ Add sub-task</Button>
            </div>
          </div>
          <div className="mt-3 border-t border-white/10 pt-3">
            <Input placeholder="Write a comment..." />
          </div>
        </div>
      ) : null}
    </Drawer>
  );
}
