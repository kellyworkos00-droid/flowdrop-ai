"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { DropZone } from "@/components/ui/drop-zone";
import { useDropsStore } from "@/store/useDropsStore";
import type { DropItem, DropType } from "@/types/drop";

const schema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const types: { key: DropType; label: string; icon: string }[] = [
  { key: "task", label: "Task", icon: "📋" },
  { key: "idea", label: "Idea", icon: "💡" },
  { key: "file", label: "File", icon: "📎" },
  { key: "link", label: "Link", icon: "🔗" },
  { key: "blocker", label: "Blocker", icon: "⚠️" },
  { key: "note", label: "Note", icon: "💬" },
];

export function NewDropModal() {
  const { isNewDropModalOpen, setNewDropModalOpen, addDrop } = useDropsStore();
  const [type, setType] = React.useState<DropType>("task");

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", description: "" },
  });

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "n") {
        setNewDropModalOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setNewDropModalOpen]);

  const onSubmit = (values: FormValues) => {
    const drop: DropItem = {
      id: crypto.randomUUID(),
      title: values.title,
      description: values.description,
      type,
      status: "todo",
      assignees: [],
      assigneeNames: ["Unassigned"],
      timestamp: "Just now",
    };
    addDrop(drop);
    setNewDropModalOpen(false);
    form.reset();
  };

  return (
    <Modal open={isNewDropModalOpen} onClose={() => setNewDropModalOpen(false)} title="Drop something in">
      <div className="mb-4 flex flex-wrap gap-2 border-b border-white/8 pb-4">
        {types.map((entry) => (
          <button
            key={entry.key}
            type="button"
            onClick={() => setType(entry.key)}
            className={`focus-ring rounded-[var(--radius-md)] px-3 py-2 text-[13px] ${
              type === entry.key ? "border-b-2 border-[var(--color-brand-primary)] text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)]"
            }`}
          >
            {entry.icon} {entry.label}
          </button>
        ))}
      </div>
      <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
        <Input {...form.register("title")} placeholder="What's on your mind?" className="h-12 text-[20px]" />
        <Textarea {...form.register("description")} placeholder="Add details..." className="min-h-24" />
        <DropZone compact />
        <div className="flex items-center justify-between text-[12px] text-[var(--color-text-tertiary)]">
          <span>Ctrl + Enter to save</span>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={() => setNewDropModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Drop it</Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
