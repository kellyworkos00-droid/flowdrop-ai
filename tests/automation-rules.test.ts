import { describe, expect, it } from "vitest";
import { evaluateRules, rankDropsForToday } from "@/lib/automation/rules";
import type { DropItem } from "@/types/drop";

function makeDrop(partial: Partial<DropItem> & Pick<DropItem, "id" | "title" | "status" | "type" | "priority" | "assignees" | "assigneeNames" | "timestamp">): DropItem {
  return {
    ...partial,
    description: partial.description ?? "",
    watcherIds: partial.watcherIds ?? [],
    watcherNames: partial.watcherNames ?? [],
  } as DropItem;
}

describe("evaluateRules", () => {
  it("emits critical signal for blocked over 24 hours", () => {
    const drop = makeDrop({
      id: "1",
      title: "Blocked drop",
      type: "task",
      status: "blocked",
      priority: "high",
      assignees: ["u1"],
      assigneeNames: ["Alex"],
      timestamp: "now",
      blockedSince: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    });

    const signals = evaluateRules([drop]);
    expect(signals.some((s) => s.rule === "blocked_24h" && s.severity === "critical")).toBe(true);
  });
});

describe("rankDropsForToday", () => {
  it("ranks overdue urgent personal work above low-priority work", () => {
    const high = makeDrop({
      id: "urgent",
      title: "Urgent overdue",
      type: "task",
      status: "in_progress",
      priority: "urgent",
      assignees: ["u1"],
      assigneeNames: ["Alex"],
      timestamp: "now",
      dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    });

    const low = makeDrop({
      id: "low",
      title: "Low backlog",
      type: "task",
      status: "todo",
      priority: "low",
      assignees: ["u2"],
      assigneeNames: ["Taylor"],
      timestamp: "now",
    });

    const ranked = rankDropsForToday([low, high], "Alex", 2);
    expect(ranked[0]?.id).toBe("urgent");
  });
});
