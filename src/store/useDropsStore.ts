import { create } from "zustand";
import { mockDrops } from "@/lib/mocks/drops";
import type { DropItem } from "@/types/drop";

interface DropsState {
  drops: DropItem[];
  selectedDropId: string | null;
  isNewDropModalOpen: boolean;
  setDrops: (drops: DropItem[]) => void;
  selectDrop: (dropId: string | null) => void;
  setNewDropModalOpen: (isOpen: boolean) => void;
  addDrop: (drop: DropItem) => void;
}

export const useDropsStore = create<DropsState>((set) => ({
  // TODO: replace with real API call
  drops: mockDrops,
  selectedDropId: null,
  isNewDropModalOpen: false,
  setDrops: (drops) => set({ drops }),
  selectDrop: (dropId) => set({ selectedDropId: dropId }),
  setNewDropModalOpen: (isOpen) => set({ isNewDropModalOpen: isOpen }),
  addDrop: (drop) =>
    set((state) => ({
      drops: [drop, ...state.drops],
    })),
}));
