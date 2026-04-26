import { create } from "zustand";
import { mockDrops } from "@/lib/mocks/drops";
import type { DropItem, DropPriority, DropStatus, SnoozedUntil } from "@/types/drop";

interface DropsState {
  drops: DropItem[];
  selectedDropId: string | null;
  isNewDropModalOpen: boolean;
  // reads
  setDrops: (drops: DropItem[]) => void;
  selectDrop: (dropId: string | null) => void;
  setNewDropModalOpen: (isOpen: boolean) => void;
  addDrop: (drop: DropItem) => void;
  // mutations
  updateDrop: (id: string, patch: Partial<DropItem>) => void;
  updateStatus: (id: string, status: DropStatus) => void;
  updatePriority: (id: string, priority: DropPriority) => void;
  reassignDrop: (id: string, assigneeId: string, assigneeName: string) => void;
  snoozeDrop: (id: string, snoozed: SnoozedUntil) => void;
  completeDrop: (id: string) => void;
  unblockDrop: (id: string) => void;
}

export const useDropsStore = create<DropsState>((set) => ({
  drops: mockDrops,
  selectedDropId: null,
  isNewDropModalOpen: false,

  setDrops: (drops) => set({ drops }),
  selectDrop: (dropId) => set({ selectedDropId: dropId }),
  setNewDropModalOpen: (isOpen) => set({ isNewDropModalOpen: isOpen }),
  addDrop: (drop) => set((state) => ({ drops: [drop, ...state.drops] })),

  updateDrop: (id, patch) =>
    set((state) => ({
      drops: state.drops.map((d) =>
        d.id === id ? { ...d, ...patch, updatedAt: new Date().toISOString() } : d,
      ),
    })),

  updateStatus: (id, status) =>
    set((state) => ({
      drops: state.drops.map((d) =>
        d.id === id
          ? {
              ...d,
              status,
              blockedSince: status === "blocked" ? new Date().toISOString() : undefined,
              updatedAt: new Date().toISOString(),
              activity: [
                { id: `a_${Date.now()}`, actor: "You", action: `Changed status to ${status.replace("_", " ")}`, timestamp: "Just now" },
                ...(d.activity ?? []),
              ],
            }
          : d,
      ),
    })),

  updatePriority: (id, priority) =>
    set((state) => ({
      drops: state.drops.map((d) =>
        d.id === id ? { ...d, priority, updatedAt: new Date().toISOString() } : d,
      ),
    })),

  reassignDrop: (id, assigneeId, assigneeName) =>
    set((state) => ({
      drops: state.drops.map((d) =>
        d.id === id
          ? {
              ...d,
              assignees: [assigneeId],
              assigneeNames: [assigneeName],
              updatedAt: new Date().toISOString(),
              activity: [
                { id: `a_${Date.now()}`, actor: "You", action: `Reassigned to ${assigneeName}`, timestamp: "Just now" },
                ...(d.activity ?? []),
              ],
            }
          : d,
      ),
    })),

  snoozeDrop: (id, snoozed) =>
    set((state) => ({
      drops: state.drops.map((d) =>
        d.id === id
          ? {
              ...d,
              snoozedUntil: snoozed,
              updatedAt: new Date().toISOString(),
              activity: [
                { id: `a_${Date.now()}`, actor: "You", action: `Snoozed until ${snoozed.until}`, timestamp: "Just now" },
                ...(d.activity ?? []),
              ],
            }
          : d,
      ),
    })),

  completeDrop: (id) =>
    set((state) => ({
      drops: state.drops.map((d) =>
        d.id === id
          ? {
              ...d,
              status: "done",
              snoozedUntil: undefined,
              updatedAt: new Date().toISOString(),
              activity: [
                { id: `a_${Date.now()}`, actor: "You", action: "Marked as done", timestamp: "Just now" },
                ...(d.activity ?? []),
              ],
            }
          : d,
      ),
    })),

  unblockDrop: (id) =>
    set((state) => ({
      drops: state.drops.map((d) =>
        d.id === id
          ? {
              ...d,
              status: "in_progress",
              blockedSince: undefined,
              updatedAt: new Date().toISOString(),
              activity: [
                { id: `a_${Date.now()}`, actor: "You", action: "Unblocked and moved to In Progress", timestamp: "Just now" },
                ...(d.activity ?? []),
              ],
            }
          : d,
      ),
    })),
}));
