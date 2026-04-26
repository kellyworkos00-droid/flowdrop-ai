export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  online: boolean;
  lastDropTitle?: string;
  lastUpdated?: string;
}

export interface Workspace {
  id: string;
  name: string;
  members: TeamMember[];
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
