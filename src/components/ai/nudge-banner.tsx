import { Button } from "@/components/ui/button";

export function NudgeBanner() {
  return (
    <section className="mt-6 rounded-[var(--radius-lg)] border border-[var(--color-ai-border)] bg-[var(--color-ai-glow)] p-4">
      <p className="text-[15px] text-[var(--color-ai-text)]">
        Based on how you work, FlowDrop suggests creating a &apos;Design Review&apos; stage. Want me to set it up?
      </p>
      <div className="mt-3 flex gap-2">
        <Button>Yes, set it up</Button>
        <Button variant="ghost">Not yet</Button>
      </div>
    </section>
  );
}
