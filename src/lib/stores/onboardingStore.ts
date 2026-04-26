import { create } from "zustand";

interface OnboardingStore {
  name: string;
  role: string;
  company: string;
  invites: string[];
  teamType: string | null;
  step: number;
  workspaceId: string | null;
  setProfile: (data: { name: string; role: string; company: string }) => void;
  addInvite: (email: string) => void;
  removeInvite: (email: string) => void;
  setTeamType: (type: string) => void;
  setWorkspaceId: (workspaceId: string) => void;
  nextStep: () => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  name: "",
  role: "Founder",
  company: "",
  invites: [],
  teamType: null,
  step: 0,
  workspaceId: null,
  setProfile: (data) => set(data),
  addInvite: (email) => set((s) => ({ invites: [...s.invites, email] })),
  removeInvite: (email) => set((s) => ({ invites: s.invites.filter((e) => e !== email) })),
  setTeamType: (type) => set({ teamType: type }),
  setWorkspaceId: (workspaceId) => set({ workspaceId }),
  nextStep: () => set((s) => ({ step: s.step + 1 })),
  reset: () =>
    set({
      name: "",
      role: "Founder",
      company: "",
      invites: [],
      teamType: null,
      step: 0,
      workspaceId: null,
    }),
}));
