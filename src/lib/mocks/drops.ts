import type { DropItem } from "@/types/drop";

// TODO: replace with real API call
export const mockDrops: DropItem[] = [
  {
    id: "d_1",
    title: "Ship onboarding copy refresh",
    description: "Align final copy with updated product positioning.",
    type: "task",
    status: "in_progress",
    assignees: ["m_1"],
    assigneeNames: ["Sarah Kim"],
    timestamp: "9:42 AM",
    dueDate: "2026-04-29",
    subtasks: [
      { id: "s_1", label: "Review with marketing", done: true },
      { id: "s_2", label: "Finalize variants", done: false },
    ],
    activity: [
      { id: "a_1", actor: "Sarah", action: "Changed status to In Progress", timestamp: "2h ago" },
      { id: "a_2", actor: "Alex", action: "Assigned to Sarah", timestamp: "3h ago" },
    ],
  },
  {
    id: "d_2",
    title: "Competitor teardown notes",
    type: "note",
    status: "todo",
    assignees: ["m_2"],
    assigneeNames: ["Noah Patel"],
    timestamp: "Yesterday",
  },
  {
    id: "d_3",
    title: "Figma design review file",
    type: "file",
    status: "blocked",
    assignees: ["m_3"],
    assigneeNames: ["Mina Lopez"],
    timestamp: "Yesterday",
  },
];
