import { create } from "zustand";

interface CommandPaletteState {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
  toggle: () => void;
}

export const useCommandPaletteStore = create<CommandPaletteState>((set) => ({
  isOpen: false,
  setOpen: (value) => set({ isOpen: value }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
