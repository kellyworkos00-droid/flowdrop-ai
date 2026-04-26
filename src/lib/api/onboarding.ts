interface ProfilePayload {
  name: string;
  role: string;
  company: string;
}

interface ProfileResponse {
  userId: string;
  workspaceId: string;
}

interface InvitePayload {
  emails: string[];
  workspaceId: string;
}

interface InviteResponse {
  sent: number;
}

interface WorkspacePayload {
  teamType: string;
  workspaceId: string;
}

interface WorkspaceResponse {
  success: boolean;
}

interface DropPayload {
  content: string;
  type: string;
  workspaceId: string;
}

interface DropResponse {
  dropId: string;
  createdAt: string;
}

export async function postOnboardingProfile(payload: ProfilePayload): Promise<ProfileResponse> {
  const response = await fetch("/api/onboarding/profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to save profile");
  }

  return (await response.json()) as ProfileResponse;
}

export async function postOnboardingInvites(payload: InvitePayload): Promise<InviteResponse> {
  const response = await fetch("/api/onboarding/invites", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to send invites");
  }

  return (await response.json()) as InviteResponse;
}

export async function postOnboardingWorkspace(payload: WorkspacePayload): Promise<WorkspaceResponse> {
  const response = await fetch("/api/onboarding/workspace", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to save workspace type");
  }

  return (await response.json()) as WorkspaceResponse;
}

export async function postDrop(payload: DropPayload): Promise<DropResponse> {
  const response = await fetch("/api/drops", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create drop");
  }

  return (await response.json()) as DropResponse;
}
