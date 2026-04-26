"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Brain, BarChart2, ChartColumnIncreasing, Gauge, Lightbulb, Target, TimerReset, TrendingDown, TrendingUp } from "lucide-react";
import { InsightCard } from "@/components/ai/insight-card";
import { NudgeBanner } from "@/components/ai/nudge-banner";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { computeTeamKPIs, formatHours } from "@/lib/kpi/compute";
import { useDropsStore } from "@/store/useDropsStore";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";

type WindowFilter = "7d" | "14d" | "30d";
type SignalFilter = "all" | "risk" | "opportunity";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export default function InsightsPage() {
  const { drops } = useDropsStore();
  const { workspace } = useWorkspaceStore();
  const [windowFilter, setWindowFilter] = useState<WindowFilter>("14d");
  const [signalFilter, setSignalFilter] = useState<SignalFilter>("all");
  const [memberFilter, setMemberFilter] = useState<string>("all");
  const [query, setQuery] = useState("");

  const scopedDrops = useMemo(() => {
    if (memberFilter === "all") {
      return drops;
    }

    const member = workspace.members.find((item) => item.id === memberFilter);
    if (!member) {
      return drops;
    }

    return drops.filter((drop) => drop.assignees.includes(member.id) || drop.assigneeNames.includes(member.name));
  }, [drops, memberFilter, workspace.members]);

  const stats = useMemo(() => {
    const total = scopedDrops.length;
    const done = scopedDrops.filter((drop) => drop.status === "done").length;
    const blocked = scopedDrops.filter((drop) => drop.status === "blocked").length;
    const inProgress = scopedDrops.filter((drop) => drop.status === "in_progress").length;
    const todo = scopedDrops.filter((drop) => drop.status === "todo").length;

    const blockerRate = total ? Math.round((blocked / total) * 100) : 0;
    const completionRate = total ? Math.round((done / total) * 100) : 0;
    const focusScore = clamp(100 - blockerRate - inProgress * 8 + done * 6, 28, 99);
    const confidence = clamp(70 + completionRate - blocked * 6, 42, 98);

    return {
      total,
      done,
      blocked,
      inProgress,
      todo,
      blockerRate,
      completionRate,
      focusScore,
      confidence,
    };
  }, [scopedDrops]);

  const topCloser = useMemo(() => {
    const score = new Map<string, number>();

    scopedDrops.forEach((drop) => {
      if (drop.status !== "done") {
        return;
      }

      drop.assigneeNames.forEach((name) => {
        score.set(name, (score.get(name) ?? 0) + 1);
      });
    });

    const best = [...score.entries()].sort((a, b) => b[1] - a[1])[0];
    return best ? `${best[0]} (${best[1]})` : "No completed work yet";
  }, [scopedDrops]);

  const insights = useMemo(() => {
    const base = [
      {
        id: "throughput",
        type: "opportunity" as const,
        title: "Execution rhythm is stabilizing",
        description: `Completion is ${stats.completionRate}% in this ${windowFilter} window with ${stats.done} completed drops.`,
        value: `${stats.done} completed`,
        trend: stats.completionRate >= 40 ? "Healthy closure trend" : "Room to improve closure pace",
        tone: "positive" as const,
        tag: "Throughput",
        icon: <ChartColumnIncreasing className="h-4 w-4" />,
      },
      {
        id: "risk",
        type: "risk" as const,
        title: "Blocker pressure needs attention",
        description: `${stats.blocked} blocked drop${stats.blocked === 1 ? "" : "s"} are reducing momentum across active work.`,
        value: `${stats.blockerRate}% blocker rate`,
        trend: stats.blockerRate > 25 ? "Escalate blockers this cycle" : "Blockers are under control",
        tone: stats.blocked > 0 ? ("warning" as const) : ("neutral" as const),
        tag: "Risk",
        icon: <AlertTriangle className="h-4 w-4" />,
      },
      {
        id: "focus",
        type: "opportunity" as const,
        title: "Focus bandwidth is measurable",
        description: `${stats.inProgress} item${stats.inProgress === 1 ? "" : "s"} currently in progress with a focus score of ${stats.focusScore}.`,
        value: `${stats.focusScore}/100`,
        trend: stats.focusScore >= 70 ? "Deep work conditions are strong" : "Reduce WIP for stronger focus",
        tone: stats.focusScore >= 70 ? ("positive" as const) : ("neutral" as const),
        tag: "Focus",
        icon: <Gauge className="h-4 w-4" />,
      },
      {
        id: "ownership",
        type: "opportunity" as const,
        title: "Ownership signal is clear",
        description: `Top closer in this view: ${topCloser}.`,
        value: topCloser,
        trend: "Use this pattern to mentor team cadence",
        tone: "neutral" as const,
        tag: "People",
        icon: <Target className="h-4 w-4" />,
      },
    ];

    return base.filter((item) => {
      if (signalFilter !== "all" && item.type !== signalFilter) {
        return false;
      }

      const q = query.trim().toLowerCase();
      if (!q) {
        return true;
      }

      return `${item.title} ${item.description} ${item.tag}`.toLowerCase().includes(q);
    });
  }, [query, signalFilter, stats.blocked, stats.blockerRate, stats.completionRate, stats.done, stats.focusScore, stats.inProgress, topCloser, windowFilter]);

  const blockedList = useMemo(() => scopedDrops.filter((drop) => drop.status === "blocked").slice(0, 5), [scopedDrops]);
  const opportunityList = useMemo(
    () => scopedDrops.filter((drop) => drop.status === "todo" || drop.status === "in_progress").slice(0, 5),
    [scopedDrops],
  );
  const teamKpis = useMemo(() => computeTeamKPIs(scopedDrops, workspace.members), [scopedDrops, workspace.members]);

  return (
    <section className="space-y-4">
      <div className="rounded-[var(--radius-xl)] border border-white/10 bg-[var(--color-surface-1)] p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-[var(--font-display)] text-[22px] font-semibold">AI Insights</h2>
            <p className="mt-1 text-[13px] text-[var(--color-text-secondary)]">
              Live intelligence on flow health, execution risk, and where your team can move faster.
            </p>
          </div>
          <Badge className="border-[var(--color-ai-border)] text-[var(--color-ai-text)]">
            <Brain className="mr-1 h-3.5 w-3.5" /> {stats.confidence}% confidence
          </Badge>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] p-3">
            <p className="text-[11px] text-[var(--color-text-tertiary)]">Focus Score</p>
            <p className="text-[20px] font-semibold">{stats.focusScore}</p>
          </article>
          <article className="rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] p-3">
            <p className="text-[11px] text-[var(--color-text-tertiary)]">Completion Rate</p>
            <p className="text-[20px] font-semibold">{stats.completionRate}%</p>
          </article>
          <article className="rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] p-3">
            <p className="text-[11px] text-[var(--color-text-tertiary)]">Active In Progress</p>
            <p className="text-[20px] font-semibold">{stats.inProgress}</p>
          </article>
          <article className="rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] p-3">
            <p className="text-[11px] text-[var(--color-text-tertiary)]">Blocked Risk</p>
            <p className="text-[20px] font-semibold text-[var(--color-danger)]">{stats.blockerRate}%</p>
          </article>
        </div>

        {/* Weekly KPIs row */}
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[var(--radius-md)] border border-white/8 bg-[var(--color-surface-2)] px-3 py-2.5">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-[11px] text-[var(--color-text-tertiary)]">Avg Cycle Time</p>
              <BarChart2 className="h-3.5 w-3.5 text-[var(--color-brand-accent)]" />
            </div>
            <p className="text-[17px] font-semibold">{teamKpis.avgCycleHours > 0 ? formatHours(teamKpis.avgCycleHours) : "—"}</p>
            <p className="mt-0.5 text-[11px] text-[var(--color-text-tertiary)]">create → done</p>
          </div>
          <div className="rounded-[var(--radius-md)] border border-[rgba(255,77,109,0.2)] bg-[rgba(255,77,109,0.06)] px-3 py-2.5">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-[11px] text-[var(--color-text-tertiary)]">Avg Blocked Time</p>
              <TrendingDown className="h-3.5 w-3.5 text-[var(--color-danger)]" />
            </div>
            <p className="text-[17px] font-semibold text-[var(--color-danger)]">{teamKpis.avgBlockedHours > 0 ? formatHours(teamKpis.avgBlockedHours) : "—"}</p>
            <p className="mt-0.5 text-[11px] text-[var(--color-text-tertiary)]">per blocked item</p>
          </div>
          <div className="rounded-[var(--radius-md)] border border-white/8 bg-[var(--color-surface-2)] px-3 py-2.5">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-[11px] text-[var(--color-text-tertiary)]">WIP Count</p>
              <TrendingUp className="h-3.5 w-3.5 text-[var(--color-warning)]" />
            </div>
            <p className="text-[17px] font-semibold">{teamKpis.wip}</p>
            <p className="mt-0.5 text-[11px] text-[var(--color-text-tertiary)]">in-progress now</p>
          </div>
          <div className="rounded-[var(--radius-md)] border border-white/8 bg-[var(--color-surface-2)] px-3 py-2.5">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-[11px] text-[var(--color-text-tertiary)]">Overdue</p>
              <AlertTriangle className="h-3.5 w-3.5 text-[var(--color-warning)]" />
            </div>
            <p className={`text-[17px] font-semibold ${teamKpis.overdueCount > 0 ? "text-[var(--color-warning)]" : ""}`}>{teamKpis.overdueCount}</p>
            <p className="mt-0.5 text-[11px] text-[var(--color-text-tertiary)]">past due date</p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <Input kind="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search signals, risks, and opportunities" />
          <Select value={windowFilter} onChange={(event) => setWindowFilter(event.target.value as WindowFilter)}>
            <option value="7d">Last 7 days</option>
            <option value="14d">Last 14 days</option>
            <option value="30d">Last 30 days</option>
          </Select>
          <Select value={signalFilter} onChange={(event) => setSignalFilter(event.target.value as SignalFilter)}>
            <option value="all">All Signals</option>
            <option value="risk">Risk Only</option>
            <option value="opportunity">Opportunity Only</option>
          </Select>
          <Select value={memberFilter} onChange={(event) => setMemberFilter(event.target.value)}>
            <option value="all">Whole Team</option>
            {workspace.members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-4">
        {insights.map((insight) => (
          <InsightCard
            key={insight.id}
            title={insight.title}
            description={insight.description}
            value={insight.value}
            trend={insight.trend}
            tone={insight.tone}
            tag={insight.tag}
            icon={insight.icon}
          />
        ))}
      </div>

      {insights.length === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-white/12 bg-[var(--color-surface-1)] p-5 text-[13px] text-[var(--color-text-secondary)]">
          No insight signals matched this filter set.
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-[var(--radius-lg)] border border-white/10 bg-[var(--color-surface-1)] p-4">
          <h3 className="mb-3 inline-flex items-center gap-1.5 text-[15px] font-semibold">
            <AlertTriangle className="h-4 w-4 text-[var(--color-danger)]" />
            Risk Radar
          </h3>
          <div className="space-y-2">
            {blockedList.length === 0 ? (
              <p className="rounded-[var(--radius-md)] border border-dashed border-white/12 bg-[var(--color-surface-2)] p-3 text-[12px] text-[var(--color-text-secondary)]">
                No blocked work in this segment.
              </p>
            ) : (
              blockedList.map((drop) => (
                <div key={drop.id} className="rounded-[var(--radius-md)] border border-[rgba(255,77,109,0.28)] bg-[rgba(255,77,109,0.08)] p-3">
                  <p className="text-[13px] font-medium">{drop.title}</p>
                  <p className="mt-1 text-[11px] text-[var(--color-text-secondary)]">{drop.assigneeNames.join(", ") || "Unassigned"}</p>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="rounded-[var(--radius-lg)] border border-white/10 bg-[var(--color-surface-1)] p-4">
          <h3 className="mb-3 inline-flex items-center gap-1.5 text-[15px] font-semibold">
            <Lightbulb className="h-4 w-4 text-[var(--color-warning)]" />
            Opportunity Queue
          </h3>
          <div className="space-y-2">
            {opportunityList.length === 0 ? (
              <p className="rounded-[var(--radius-md)] border border-dashed border-white/12 bg-[var(--color-surface-2)] p-3 text-[12px] text-[var(--color-text-secondary)]">
                No active opportunities in this segment.
              </p>
            ) : (
              opportunityList.map((drop) => (
                <div key={drop.id} className="rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] p-3">
                  <p className="text-[13px] font-medium">{drop.title}</p>
                  <p className="mt-1 text-[11px] text-[var(--color-text-secondary)]">{drop.type} · {drop.assigneeNames.join(", ") || "Unassigned"}</p>
                </div>
              ))
            )}
          </div>
        </article>
      </div>

      <NudgeBanner
        title="AI workflow nudge"
        description={
          stats.blocked > 0
            ? `Create a dedicated unblock ritual for the ${stats.blocked} blocked item${stats.blocked === 1 ? "" : "s"} to recover cycle speed.`
            : "Your blocker rate is low. Shift attention to clearing remaining To Do items for a stronger completion curve."
        }
        primaryLabel={stats.blocked > 0 ? "Show risk signals" : "Show opportunities"}
        secondaryLabel="Hide nudge"
        onPrimary={() => setSignalFilter(stats.blocked > 0 ? "risk" : "opportunity")}
      />

      <div className="inline-flex items-center gap-1.5 text-[11px] text-[var(--color-text-tertiary)]">
        <TimerReset className="h-3.5 w-3.5" />
        Insights refresh as your drop data changes.
      </div>
    </section>
  );
}
