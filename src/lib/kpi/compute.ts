import type { DropItem } from "@/types/drop";

export interface MemberKPI {
  memberId: string;
  memberName: string;
  wip: number;
  blocked: number;
  done: number;
  completionRate: number;
  avgBlockedHours: number;
  workloadScore: number;
  workloadLabel: "underloaded" | "balanced" | "overloaded";
}

export interface TeamKPI {
  totalDrops: number;
  completionRate: number;
  blockerRate: number;
  avgCycleHours: number;
  avgBlockedHours: number;
  wip: number;
  overdueCount: number;
  urgentCount: number;
  members: MemberKPI[];
}

export function computeTeamKPIs(
  drops: DropItem[],
  members: Array<{ id: string; name: string }>,
): TeamKPI {
  const now = Date.now();

  const done = drops.filter((d) => d.status === "done");
  const blocked = drops.filter((d) => d.status === "blocked");
  const inProgress = drops.filter((d) => d.status === "in_progress");

  const completionRate = drops.length ? Math.round((done.length / drops.length) * 100) : 0;
  const blockerRate = drops.length ? Math.round((blocked.length / drops.length) * 100) : 0;

  const cycleTimes = done
    .filter((d) => d.createdAt && d.updatedAt)
    .map(
      (d) =>
        (new Date(d.updatedAt!).getTime() - new Date(d.createdAt!).getTime()) /
        (1000 * 60 * 60),
    );
  const avgCycleHours = cycleTimes.length
    ? Math.round(cycleTimes.reduce((a, b) => a + b, 0) / cycleTimes.length)
    : 0;

  const blockedTimes = blocked
    .filter((d) => d.blockedSince)
    .map((d) => (now - new Date(d.blockedSince!).getTime()) / (1000 * 60 * 60));
  const avgBlockedHours = blockedTimes.length
    ? Math.round(blockedTimes.reduce((a, b) => a + b, 0) / blockedTimes.length)
    : 0;

  const overdueCount = drops.filter(
    (d) => d.dueDate && new Date(d.dueDate) < new Date() && d.status !== "done",
  ).length;
  const urgentCount = drops.filter(
    (d) => d.priority === "urgent" && d.status !== "done",
  ).length;

  const memberKPIs: MemberKPI[] = members.map((member) => {
    const assigned = drops.filter(
      (d) =>
        d.assignees.includes(member.id) || d.assigneeNames.includes(member.name),
    );
    const wip = assigned.filter((d) => d.status === "in_progress").length;
    const blockedItems = assigned.filter((d) => d.status === "blocked");
    const doneItems = assigned.filter((d) => d.status === "done");

    const memberBlockedTimes = blockedItems
      .filter((d) => d.blockedSince)
      .map((d) => (now - new Date(d.blockedSince!).getTime()) / (1000 * 60 * 60));
    const avgBlockedH = memberBlockedTimes.length
      ? Math.round(memberBlockedTimes.reduce((a, b) => a + b, 0) / memberBlockedTimes.length)
      : 0;

    const completionRateMember = assigned.length
      ? Math.round((doneItems.length / assigned.length) * 100)
      : 0;

    const workloadScore = Math.min(100, wip * 20 + blockedItems.length * 30);
    const workloadLabel: MemberKPI["workloadLabel"] =
      workloadScore >= 60 ? "overloaded" : workloadScore >= 30 ? "balanced" : "underloaded";

    return {
      memberId: member.id,
      memberName: member.name,
      wip,
      blocked: blockedItems.length,
      done: doneItems.length,
      completionRate: completionRateMember,
      avgBlockedHours: avgBlockedH,
      workloadScore,
      workloadLabel,
    };
  });

  return {
    totalDrops: drops.length,
    completionRate,
    blockerRate,
    avgCycleHours,
    avgBlockedHours,
    wip: inProgress.length,
    overdueCount,
    urgentCount,
    members: memberKPIs,
  };
}

/** Returns how many hours elapsed since an ISO string. */
export function hoursAgo(isoString: string): number {
  return (Date.now() - new Date(isoString).getTime()) / (1000 * 60 * 60);
}

/** Format hours into a compact human-readable string. */
export function formatHours(hours: number): string {
  if (hours < 1) {
    return "<1h";
  }
  if (hours < 24) {
    return `${Math.floor(hours)}h`;
  }
  const days = Math.floor(hours / 24);
  const remainder = Math.floor(hours % 24);
  return remainder > 0 ? `${days}d ${remainder}h` : `${days}d`;
}
