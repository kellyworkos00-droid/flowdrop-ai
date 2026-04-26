import { create } from "zustand";
import { mockWorkspace } from "@/lib/mocks/workspace";
import type { Workspace } from "@/types/workspace";

interface WorkspaceState {
  workspace: Workspace;
  setWorkspace: (workspace: Workspace) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  workspace: mockWorkspace,
  setWorkspace: (workspace) => set({ workspace }),
}));
