import { Archive } from "lucide-react";

export default function ArchivePage() {
  return (
    <section className="rounded-[var(--radius-lg)] border border-white/10 bg-[var(--color-surface-1)] p-8 text-center">
      <Archive className="mx-auto mb-3 h-10 w-10 text-[var(--color-text-tertiary)]" />
      <h2 className="font-[var(--font-display)] text-[22px] font-semibold">Archive is empty</h2>
      <p className="mt-2 text-[14px] text-[var(--color-text-secondary)]">
        Completed and inactive drops will appear here for long-term reference.
      </p>
    </section>
  );
}
