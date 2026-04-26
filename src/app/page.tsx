import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock3,
  Command,
  Layers3,
  Shield,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

const highlights = [
  {
    title: "Today Command Center",
    description: "Start work in under a minute with top tasks, blockers, overdue items, and handoffs in one screen.",
    icon: Layers3,
  },
  {
    title: "One-Click Actions",
    description: "Complete, reassign, unblock, snooze, and set due dates without modal friction.",
    icon: Zap,
  },
  {
    title: "AI + Automation",
    description: "Run async insight refreshes, detect risk early, and keep flow moving automatically.",
    icon: Bot,
  },
  {
    title: "Audit + Permissions",
    description: "Enterprise-ready role controls and append-only audit trails for every key mutation.",
    icon: Shield,
  },
];

const stats = [
  { label: "Teams onboarded", value: "120+" },
  { label: "Avg setup time", value: "9 min" },
  { label: "Weekly actions", value: "48k" },
  { label: "Command usage", value: "73%" },
];

const steps = [
  {
    title: "Capture",
    detail: "Drop tasks, blockers, files, and notes instantly.",
  },
  {
    title: "Prioritize",
    detail: "FlowDrop ranks what matters now using urgency + dependency signals.",
  },
  {
    title: "Execute",
    detail: "Move work with keyboard actions, drag lanes, and quick action bars.",
  },
  {
    title: "Learn",
    detail: "Track telemetry, audit logs, and AI snapshots to improve every week.",
  },
];

const screenshots = [
  {
    title: "Today Command Center",
    description:
      "See top tasks, blockers, overdue risks, and handoffs in one screen so your team starts with clarity every day.",
    src: "/screenshots/command-center.svg",
    alt: "FlowDrop command center screenshot showing top tasks and blockers",
  },
  {
    title: "Team Accountability View",
    description:
      "Track workload balance, SLA pressure, and manager attention queues to prevent silent bottlenecks.",
    src: "/screenshots/team-flow.svg",
    alt: "FlowDrop team flow screenshot with workload and blocker panels",
  },
  {
    title: "Complete Settings Center",
    description:
      "Control profile, notifications, automation, permissions, telemetry, and exports from one operational hub.",
    src: "/screenshots/settings-center.svg",
    alt: "FlowDrop settings center screenshot with controls and audit options",
  },
];

const comparison = [
  {
    point: "Work execution",
    flowdrop: "Command-center workflow with quick actions, keyboard controls, and drag status moves.",
    others: "Scattered updates across multiple pages with heavy modal friction.",
  },
  {
    point: "Risk visibility",
    flowdrop: "Built-in blocker SLA alerts, overdue detection, and async AI insight jobs.",
    others: "Mostly passive boards with delayed risk discovery.",
  },
  {
    point: "Operational trust",
    flowdrop: "Role-based permissions, append-only audit logs, telemetry, and export-ready history.",
    others: "Limited governance and fragmented observability.",
  },
];

export default function HomePage() {
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "FlowDrop",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: "https://flowdrop-ai.vercel.app",
    description:
      "FlowDrop is an AI workflow operating system for teams with command-center execution, automation, accountability, and audit-ready controls.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <main className="relative min-h-dvh overflow-hidden px-4 pb-16 pt-6 md:px-8 lg:px-12">
      <Script id="flowdrop-software-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(appSchema)}
      </Script>

      <div
        className="pointer-events-none absolute -left-16 top-10 h-52 w-52 rounded-full bg-[rgba(45,107,228,0.22)] blur-3xl"
        style={{ animation: "orb-drift 14s ease-in-out infinite" }}
      />
      <div
        className="pointer-events-none absolute -right-20 top-24 h-64 w-64 rounded-full bg-[rgba(0,229,195,0.2)] blur-3xl"
        style={{ animation: "orb-drift 16s ease-in-out infinite reverse" }}
      />

      <div className="relative mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between rounded-[var(--radius-xl)] border border-white/10 bg-[rgba(20,23,38,0.75)] px-4 py-3 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="font-[var(--font-display)] text-[20px] font-semibold">FlowDrop</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand-accent)]" />
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/auth/login"
              className="rounded-[var(--radius-md)] border border-white/15 px-3 py-2 text-[13px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            >
              Sign in
            </Link>
            <Link
              href="/home"
              className="inline-flex items-center gap-1 rounded-[var(--radius-md)] bg-[var(--color-brand-primary)] px-3 py-2 text-[13px] font-medium text-white hover:opacity-90"
            >
              Open app <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="flow-glass rounded-[var(--radius-xl)] p-6 md:p-8">
            <p className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[var(--color-ai-border)] bg-[var(--color-ai-glow)] px-3 py-1 text-[12px] text-[var(--color-ai-text)]">
              <Sparkles className="h-3.5 w-3.5" /> Productivity OS for modern teams
            </p>
            <h1 className="max-w-2xl font-[var(--font-display)] text-[34px] font-semibold leading-tight md:text-[46px]">
              Work faster with less noise and more momentum.
            </h1>
            <p className="mt-3 max-w-xl text-[15px] text-[var(--color-text-secondary)] md:text-[17px]">
              FlowDrop combines command-center execution, AI workflow intelligence, one-click actions, and accountability signals so teams finish more work every week.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] bg-[var(--color-brand-primary)] px-4 py-2.5 text-[14px] font-medium text-white hover:opacity-90"
              >
                Start Free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/home"
                className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] border border-white/15 bg-[var(--color-surface-2)] px-4 py-2.5 text-[14px] text-[var(--color-text-primary)] hover:border-white/30"
              >
                Live Preview
              </Link>
            </div>

            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              <p className="inline-flex items-center gap-1.5 text-[12px] text-[var(--color-text-secondary)]">
                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--color-success)]" />
                Keyboard-first command palette
              </p>
              <p className="inline-flex items-center gap-1.5 text-[12px] text-[var(--color-text-secondary)]">
                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--color-success)]" />
                Team SLA and workload balancing
              </p>
              <p className="inline-flex items-center gap-1.5 text-[12px] text-[var(--color-text-secondary)]">
                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--color-success)]" />
                Async AI insights + risk radar
              </p>
              <p className="inline-flex items-center gap-1.5 text-[12px] text-[var(--color-text-secondary)]">
                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--color-success)]" />
                Permissions and full audit trail
              </p>
            </div>
          </article>

          <article className="rounded-[var(--radius-xl)] border border-white/10 bg-[var(--color-surface-1)] p-5 shadow-[var(--shadow-md)]">
            <h2 className="mb-3 text-[15px] font-semibold">Live Signal Snapshot</h2>
            <div className="space-y-2">
              <div className="rounded-[var(--radius-md)] border border-[rgba(255,77,109,0.25)] bg-[rgba(255,77,109,0.08)] p-3">
                <p className="text-[11px] text-[var(--color-text-tertiary)]">Active blockers</p>
                <p className="text-[22px] font-semibold text-[var(--color-danger)]">6</p>
              </div>
              <div className="rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] p-3">
                <p className="text-[11px] text-[var(--color-text-tertiary)]">Today completions</p>
                <p className="text-[22px] font-semibold">34</p>
              </div>
              <div className="rounded-[var(--radius-md)] border border-[rgba(0,196,140,0.25)] bg-[rgba(0,196,140,0.1)] p-3">
                <p className="text-[11px] text-[var(--color-text-tertiary)]">Flow confidence</p>
                <p className="text-[22px] font-semibold text-[var(--color-success)]">89%</p>
              </div>
            </div>

            <div className="mt-3 rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] p-3 text-[12px] text-[var(--color-text-secondary)]">
              <p className="mb-1 inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" /> Updated 12 seconds ago</p>
              <p>Telemetry and AI signals refresh in the background so your team always acts on current context.</p>
            </div>
          </article>
        </section>

        <section className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <article key={item.label} className="rounded-[var(--radius-lg)] border border-white/10 bg-[var(--color-surface-1)] p-4 text-center">
              <p className="text-[24px] font-semibold">{item.value}</p>
              <p className="mt-1 text-[12px] text-[var(--color-text-secondary)]">{item.label}</p>
            </article>
          ))}
        </section>

        <section className="mt-4 rounded-[var(--radius-xl)] border border-white/10 bg-[var(--color-surface-1)] p-5">
          <h2 className="mb-3 text-[18px] font-semibold">Real screenshots: how teams actually run on FlowDrop</h2>
          <div className="grid gap-4 lg:grid-cols-3">
            {screenshots.map((shot) => (
              <article key={shot.title} className="rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] p-3">
                <div className="overflow-hidden rounded-[var(--radius-sm)] border border-white/10">
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    width={1400}
                    height={900}
                    className="h-auto w-full"
                    priority={shot.title === "Today Command Center"}
                  />
                </div>
                <p className="mt-2 text-[14px] font-medium">{shot.title}</p>
                <p className="mt-1 text-[12px] text-[var(--color-text-secondary)]">{shot.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-[var(--radius-xl)] border border-white/10 bg-[var(--color-surface-1)] p-5">
          <h2 className="mb-3 text-[18px] font-semibold">Why teams choose FlowDrop over other apps</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-[12px]">
              <thead>
                <tr className="border-b border-white/10 text-[var(--color-text-tertiary)]">
                  <th className="px-2 py-2">Category</th>
                  <th className="px-2 py-2">FlowDrop</th>
                  <th className="px-2 py-2">Typical alternatives</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.point} className="border-b border-white/6 last:border-b-0">
                    <td className="px-2 py-2 font-medium">{row.point}</td>
                    <td className="px-2 py-2 text-[var(--color-success)]">{row.flowdrop}</td>
                    <td className="px-2 py-2 text-[var(--color-text-secondary)]">{row.others}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-4 rounded-[var(--radius-xl)] border border-white/10 bg-[var(--color-surface-1)] p-5">
          <h2 className="mb-3 text-[18px] font-semibold">Everything your team needs in one platform</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] p-4">
                  <p className="mb-1 inline-flex items-center gap-1.5 text-[14px] font-medium">
                    <Icon className="h-4 w-4 text-[var(--color-brand-primary)]" />
                    {item.title}
                  </p>
                  <p className="text-[12px] text-[var(--color-text-secondary)]">{item.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-4 rounded-[var(--radius-xl)] border border-white/10 bg-[var(--color-surface-1)] p-5">
          <h2 className="mb-3 text-[18px] font-semibold">How teams run on FlowDrop</h2>
          <div className="grid gap-3 md:grid-cols-4">
            {steps.map((step, idx) => (
              <article key={step.title} className="rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] p-3">
                <p className="mb-1 inline-flex items-center gap-1.5 text-[13px] font-medium">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-brand-primary)]/20 text-[11px] text-[var(--color-brand-primary)]">
                    {idx + 1}
                  </span>
                  {step.title}
                </p>
                <p className="text-[12px] text-[var(--color-text-secondary)]">{step.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-[var(--radius-xl)] border border-white/10 bg-[linear-gradient(140deg,rgba(45,107,228,0.2),rgba(0,229,195,0.15))] p-6 text-center">
          <p className="mb-2 inline-flex items-center gap-1.5 text-[13px] text-[var(--color-text-primary)]">
            <Command className="h-4 w-4" /> Built for teams that want speed and accountability
          </p>
          <h2 className="text-[28px] font-semibold">Start your first flow in minutes</h2>
          <p className="mx-auto mt-2 max-w-2xl text-[14px] text-[var(--color-text-secondary)]">
            Replace scattered updates and status meetings with one workflow system your team actually enjoys using.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-1 rounded-[var(--radius-md)] bg-white px-4 py-2 text-[14px] font-medium text-[var(--color-surface-0)] hover:opacity-90"
            >
              Get Started
            </Link>
            <Link
              href="/team"
              className="inline-flex items-center gap-1 rounded-[var(--radius-md)] border border-white/35 px-4 py-2 text-[14px] hover:bg-white/10"
            >
              See Team Flow <Users className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
