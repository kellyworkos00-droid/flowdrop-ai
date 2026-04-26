import type { AppUser, Workspace } from "@/types/workspace";

// TODO: replace with real API call
export const mockUser: AppUser = {
  id: "u_1",
  name: "Alex Rivera",
  email: "alex@flowdrop.ai",
};

// TODO: replace with real API call
export const mockWorkspace: Workspace = {
  id: "w_1",
  name: "FlowDrop Studio",
  members: [
    {
      id: "m_1",
      name: "Sarah Kim",
      role: "Product",
      online: true,
      lastDropTitle: "Design review prep",
      lastUpdated: "5m ago",
    },
    {
      id: "m_2",
      name: "Noah Patel",
      role: "Engineering",
      online: true,
      lastDropTitle: "API deploy checklist",
      lastUpdated: "11m ago",
    },
    {
      id: "m_3",
      name: "Mina Lopez",
      role: "Design",
      online: false,
      lastDropTitle: "Icon export batch",
      lastUpdated: "44m ago",
    },
  ],
};
