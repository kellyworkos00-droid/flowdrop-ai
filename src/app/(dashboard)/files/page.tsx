import { FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FilesPage() {
  return (
    <section className="rounded-[var(--radius-lg)] border border-white/10 bg-[var(--color-surface-1)] p-8 text-center">
      <FolderOpen className="mx-auto mb-3 h-10 w-10 text-[var(--color-brand-accent)]" />
      <h2 className="font-[var(--font-display)] text-[22px] font-semibold">No files yet</h2>
      <p className="mx-auto mt-2 max-w-md text-[14px] text-[var(--color-text-secondary)]">
        Start by dropping a brief, deck, or screenshot and FlowDrop will auto-group files by project context.
      </p>
      <Button className="mx-auto mt-4">Upload your first file</Button>
    </section>
  );
}
