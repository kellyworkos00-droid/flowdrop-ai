"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, BriefcaseBusiness, CheckCircle2, Clock3, Filter, Layers3, Users } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { computeTeamKPIs, formatHours } from "@/lib/kpi/compute";
import { useDropsStore } from "@/store/useDropsStore";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";

type RoleFilter = "all" | "Product" | "Engineering" | "Design";
type FocusFilter = "all" | "high_load" | "blocked" | "available";

function getLoadTone(activeCount: number): string {
  if (activeCount >= 3) return "text-[var(--color-danger)]";
  if (activeCount === 2) return "text-[var(--color-warning)]";
  return "text-[var(--color-success)]";
}

function WorkloadBar({ score, label }: { score: number; label: "underloaded" | "balanced" | "overloaded" }) {
  const barColor =
    label === "overloaded"
      ? "bg-[var(--color-danger)]"
      : label === "balanced"
        ? "bg-[var(--color-warning)]"
        : "bg-[var(--color-success)]";
  const textColor =
    label === "overloaded"
      ? "text-[var(--color-danger)]"
      : label === "balanced"
        ? "text-[var(--color-warning)]"
        : "text-[var(--color-success)]";
  return (
    <div className="mb-3">
      <div className="mb-1 flex items-center justify-between text-[11px]">
        <span className="text-[var(--color-text-tertiary)]">Workload</span>
        <span className={`${textColor} font-medium capitalize`}>{label}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-3)]">
        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

export default function TeamPage() {
  const { workspace } = useWorkspaceStore();
  const { drops } = useDropsStore();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [focusFilter, setFocusFilter] = useState<FocusFilter>("all");
  const [selectedMemberId, setSelectedMemberId] = useState<string | "all">("all");

  const kpis = useMemo(() => computeTeamKPIs(drops, workspace.members), [drops, workspace.members]);

  const memberCards = useMemo(() => {
    return workspace.members.map((member) => {
      const assigned = drops.filter((drop) => drop.assignees.includes(member.id) || drop.assigneeNames.includes(member.name));
      const inProgress = assigned.filter((drop) => drop.status === "in_progress").length;
      const blocked = assigned.filter((drop) => drop.status === "blocked").length;
      const done = assigned.filter((drop) => drop.status === "done").length;
      const todo = assigned.filter((drop) => drop.status === "todo").length;
      const completionRate = assigned.length ? Math.round((done / assigned.length) * 100) : 0;
      const focusDrop = assigned.find((drop) => drop.status === "in_progress") ?? assigned[0];
      const memberKpi = kpis.members.find((k) => k.memberId === member.id || k.memberName === member.name);

      return {
        member,
        assigned,
        inProgress,
        blocked,
        done,
        todo,
        completionRate,
        focusDrop,
        workloadScore: memberKpi?.workloadScore ?? 0,
        workloadLabel: memberKpi?.workloadLabel ?? ("underloaded" as const),
      };
    });
  }, [drops, kpis.members, workspace.members]);

  const filteredMembers = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return memberCards.filter((entry) => {
      if (roleFilter !== "all" && entry.member.role !== roleFilter) {
        return false;
      }

      if (focusFilter === "high_load" && entry.inProgress < 2) {
        return false;
      }

      if (focusFilter === "blocked" && entry.blocked === 0) {
        return false;
      }

      if (focusFilter === "available" && entry.inProgress > 1) {
        return false;
      }

      if (!searchTerm) {
        return true;
      }

      const bag = `${entry.member.name} ${entry.member.role} ${entry.focusDrop?.title ?? ""}`.toLowerCase();
      return bag.includes(searchTerm);
    });
  }, [focusFilter, memberCards, roleFilter, search]);

  const teamStats = useMemo(() => {
    const totalMembers = workspace.members.length;
    const onlineMembers = workspace.members.filter((member) => member.online).length;
    const inFlight = drops.filter((drop) => drop.status === "in_progress").length;
    const blocked = drops.filter((drop) => drop.status === "blocked").length;
    const completed = drops.filter((drop) => drop.status === "done").length;
    return {
      totalMembers,
      onlineMembers,
      inFlight,
      blocked,
      completed,
    };
  }, [drops, workspace.members]);

  const highlightedDrops = useMemo(() => {
    const byMember = selectedMemberId === "all" ? drops : drops.filter((drop) => drop.assignees.includes(selectedMemberId));
    return byMember.slice(0, 5);
  }, [drops, selectedMemberId]);

  const needsAttention = useMemo(() => {
    return kpis.members
      .filter((m) => m.workloadLabel === "overloaded" || m.blocked > 0)
      .sort((a, b) => b.workloadScore + b.blocked * 30 - (a.workloadScore + a.blocked * 30))
      .slice(0, 5);
  }, [kpis.members]);

  return (
    <section className="space-y-4">
      <div className="rounded-[var(--radius-xl)] border border-white/10 bg-[var(--color-surface-1)] p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-[var(--font-display)] text-[22px] font-semibold">Team Flow</h2>
            <p className="mt-1 text-[13px] text-[var(--color-text-secondary)]">
              Keep team momentum visible with workload clarity, blocker attention, and focus context.
            </p>
          </div>
          <Button variant="secondary" className="gap-1.5">
            <Layers3 className="h-4 w-4" />
            Team Pulse
          </Button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <article className="rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] p-3">
            <p className="mb-1 flex items-center gap-1 text-[11px] text-[var(--color-text-tertiary)]"><Users className="h-3.5 w-3.5" /> Members</p>
            <p className="text-[18px] font-semibold">{teamStats.totalMembers}</p>
          </article>
          <article className="rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] p-3">
            <p className="mb-1 flex items-center gap-1 text-[11px] text-[var(--color-text-tertiary)]"><Clock3 className="h-3.5 w-3.5" /> Online</p>
            <p className="text-[18px] font-semibold">{teamStats.onlineMembers}</p>
          </article>
          <article className="rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] p-3">
            <p className="mb-1 flex items-center gap-1 text-[11px] text-[var(--color-text-tertiary)]"><BriefcaseBusiness className="h-3.5 w-3.5" /> In Flight</p>
            <p className="text-[18px] font-semibold">{teamStats.inFlight}</p>
          </article>
          <article className="rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] p-3">
            <p className="mb-1 flex items-center gap-1 text-[11px] text-[var(--color-text-tertiary)]"><AlertTriangle className="h-3.5 w-3.5" /> Blocked</p>
            <p className="text-[18px] font-semibold text-[var(--color-danger)]">{teamStats.blocked}</p>
          </article>
          <article className="rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] p-3">
            <p className="mb-1 flex items-center gap-1 text-[11px] text-[var(--color-text-tertiary)]"><CheckCircle2 className="h-3.5 w-3.5" /> Completed</p>
            <p className="text-[18px] font-semibold text-[var(--color-success)]">{teamStats.completed}</p>
          </article>
        </div>

        {/* SLA KPI row */}
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[var(--radius-md)] border border-white/8 bg-[var(--color-surface-2)] px-3 py-2.5">
            <p className="text-[11px] text-[var(--color-text-tertiary)]">Avg Cycle Time</p>
            <p className="mt-0.5 text-[16px] font-semibold">{kpis.avgCycleHours > 0 ? formatHours(kpis.avgCycleHours) : "—"}</p>
            <p className="text-[11px] text-[var(--color-text-tertiary)]">create → done</p>
          </div>
          <div className="rounded-[var(--radius-md)] border border-[rgba(255,77,109,0.2)] bg-[rgba(255,77,109,0.06)] px-3 py-2.5">
            <p className="text-[11px] text-[var(--color-text-tertiary)]">Avg Blocked Time</p>
            <p className="mt-0.5 text-[16px] font-semibold text-[var(--color-danger)]">{kpis.avgBlockedHours > 0 ? formatHours(kpis.avgBlockedHours) : "—"}</p>
            <p className="text-[11px] text-[var(--color-text-tertiary)]">across blocked items</p>
          </div>
          <div className="rounded-[var(--radius-md)] border border-white/8 bg-[var(--color-surface-2)] px-3 py-2.5">
            <p className="text-[11px] text-[var(--color-text-tertiary)]">Overdue</p>
            <p className={`mt-0.5 text-[16px] font-semibold ${kpis.overdueCount > 0 ? "text-[var(--color-warning)]" : ""}`}>{kpis.overdueCount}</p>
            <p className="text-[11px] text-[var(--color-text-tertiary)]">past due date</p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[1.5fr_1fr_1fr]">
          <Input kind="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search member, role, or current focus" />
          <label className="flex h-11 items-center gap-2 rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] px-3">
            <Filter className="h-4 w-4 text-[var(--color-text-tertiary)]" />
            <Select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value as RoleFilter)}
              className="h-full border-0 bg-transparent px-0"
            >
              <option value="all">All Roles</option>
              <option value="Product">Product</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
            </Select>
          </label>
          <Select value={focusFilter} onChange={(event) => setFocusFilter(event.target.value as FocusFilter)}>
            <option value="all">All Focus</option>
            <option value="high_load">High Load</option>
            <option value="blocked">Has Blockers</option>
            <option value="available">Available Capacity</option>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
        <div className="grid gap-3 lg:grid-cols-2">
          {filteredMembers.map((entry) => (
            <article key={entry.member.id} className="rounded-[var(--radius-lg)] border border-white/10 bg-[var(--color-surface-1)] p-4">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Avatar name={entry.member.name} size="md" />
                  <div>
                    <p className="text-[15px] font-medium">{entry.member.name}</p>
                    <p className="text-[12px] text-[var(--color-text-secondary)]">{entry.member.role}</p>
                  </div>
                </div>
                <Badge className={entry.member.online ? "border-[var(--color-success)]/35 text-[var(--color-success)]" : ""}>
                  {entry.member.online ? "Online" : "Offline"}
                </Badge>
              </div>

              <WorkloadBar score={entry.workloadScore} label={entry.workloadLabel} />

              <div className="mb-3 grid grid-cols-4 gap-2 text-center text-[11px]">
                <div className="rounded-[var(--radius-sm)] bg-[var(--color-surface-2)] p-2"><p className="text-[var(--color-text-tertiary)]">To Do</p><p>{entry.todo}</p></div>
                <div className="rounded-[var(--radius-sm)] bg-[var(--color-surface-2)] p-2"><p className="text-[var(--color-text-tertiary)]">In Progress</p><p className={getLoadTone(entry.inProgress)}>{entry.inProgress}</p></div>
                <div className="rounded-[var(--radius-sm)] bg-[var(--color-surface-2)] p-2"><p className="text-[var(--color-text-tertiary)]">Blocked</p><p className="text-[var(--color-danger)]">{entry.blocked}</p></div>
                <div className="rounded-[var(--radius-sm)] bg-[var(--color-surface-2)] p-2"><p className="text-[var(--color-text-tertiary)]">Done</p><p className="text-[var(--color-success)]">{entry.done}</p></div>
              </div>

              <div className="rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] p-3">
                <p className="text-[11px] uppercase tracking-wide text-[var(--color-text-tertiary)]">Current Focus</p>
                <p className="mt-1 text-[13px]">{entry.focusDrop?.title ?? entry.member.lastDropTitle ?? "No active drop assigned"}</p>
                <p className="mt-1 text-[11px] text-[var(--color-text-secondary)]">
                  Completion rate: {entry.completionRate}%{entry.member.lastUpdated ? ` · updated ${entry.member.lastUpdated}` : ""}
                </p>
              </div>
            </article>
          ))}

          {filteredMembers.length === 0 ? (
            <div className="col-span-full rounded-[var(--radius-lg)] border border-dashed border-white/12 bg-[var(--color-surface-1)] p-6 text-center text-[13px] text-[var(--color-text-secondary)]">
              No team members match this filter. Try widening your search.
            </div>
          ) : null}
        </div>

        <aside className="space-y-3">
          <article className="rounded-[var(--radius-lg)] border border-white/10 bg-[var(--color-surface-1)] p-4">
            <h3 className="mb-3 text-[14px] font-semibold">Team Queue</h3>
            <Select value={selectedMemberId} onChange={(event) => setSelectedMemberId(event.target.value)}>
              <option value="all">All Members</option>
              {workspace.members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </Select>

            <div className="mt-3 space-y-2">
              {highlightedDrops.length === 0 ? (
                <p className="rounded-[var(--radius-md)] border border-dashed border-white/12 bg-[var(--color-surface-2)] p-3 text-[12px] text-[var(--color-text-secondary)]">
                  No drops in this view.
                </p>
              ) : (
                highlightedDrops.map((drop) => {
                  const isBlocked = drop.status === "blocked";
                  const blockedH =
                    isBlocked && drop.blockedSince
                      ? (new Date().getTime() - new Date(drop.blockedSince).getTime()) / (1000 * 60 * 60)
                      : 0;
                  return (
                    <div
                      key={drop.id}
                      className={`rounded-[var(--radius-md)] border p-2.5 ${
                        isBlocked
                          ? "border-[rgba(255,77,109,0.28)] bg-[rgba(255,77,109,0.08)]"
                          : "border-white/10 bg-[var(--color-surface-2)]"
                      }`}
                    >
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <p className="line-clamp-1 text-[12px] font-medium">{drop.title}</p>
                        <Badge>{drop.status.replace("_", " ")}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-[var(--color-text-secondary)]">
                        <span>{drop.assigneeNames.join(", ") || "Unassigned"}</span>
                        {isBlocked && blockedH > 0 && (
                          <span className="font-medium text-[var(--color-danger)]">🔒 {formatHours(blockedH)}</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </article>

          <article className="rounded-[var(--radius-lg)] border border-white/10 bg-[var(--color-surface-1)] p-4">
            <h3 className="mb-3 flex items-center gap-1.5 text-[14px] font-semibold">
              <AlertTriangle className="h-4 w-4 text-[var(--color-warning)]" />
              Needs Attention
            </h3>
            {needsAttention.length === 0 ? (
              <p className="text-[12px] text-[var(--color-text-secondary)]">
                Team flow is healthy — no overloaded or blocked members right now.
              </p>
            ) : (
              <div className="space-y-2">
                {needsAttention.map((m) => (
                  <div key={m.memberId} className="rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] p-3">
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <p className="text-[13px] font-medium">{m.memberName}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${
                          m.workloadLabel === "overloaded"
                            ? "bg-[rgba(255,77,109,0.15)] text-[var(--color-danger)]"
                            : "bg-[rgba(245,166,35,0.15)] text-[var(--color-warning)]"
                        }`}
                      >
                        {m.workloadLabel}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-[11px] text-[var(--color-text-secondary)]">
                      <span>{m.wip} in progress</span>
                      {m.blocked > 0 && <span className="text-[var(--color-danger)]">{m.blocked} blocked</span>}
                      {m.avgBlockedHours > 0 && <span>avg {formatHours(m.avgBlockedHours)} stuck</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>
        </aside>
      </div>
    </section>
  );
}
