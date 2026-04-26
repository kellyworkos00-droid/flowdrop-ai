import { create } from "zustand";
import { mockUser } from "@/lib/mocks/workspace";
import type { AppUser } from "@/types/workspace";

interface UserState {
  user: AppUser;
  setUser: (user: AppUser) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: mockUser,
  setUser: (user) => set({ user }),
}));
