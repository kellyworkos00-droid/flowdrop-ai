import { InsightCard } from "@/components/ai/insight-card";
import { NudgeBanner } from "@/components/ai/nudge-banner";

export default function InsightsPage() {
  return (
    <section>
      <h2 className="font-[var(--font-display)] text-[22px] font-semibold">What FlowDrop has learned</h2>
      <p className="mt-1 text-[14px] text-[var(--color-text-secondary)]">Based on 2 weeks of your team&apos;s flow.</p>
      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        <InsightCard title="Your team ships fastest on Tuesdays" description="Cycle time drops by 18% for product and engineering tasks." />
        <InsightCard title="Design review is your biggest bottleneck" description="Most blocked items are waiting for visual review and sign-off." />
        <InsightCard title="Sarah closes the most drops per week" description="She averages 16 resolved drops weekly with low reopen rate." />
      </div>
      <NudgeBanner />
    </section>
  );
}
