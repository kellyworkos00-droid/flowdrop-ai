import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as { teamType?: string; workspaceId?: string };

  if (!body.workspaceId || !body.teamType) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // TODO: replace with real API call
  return NextResponse.json({ success: true });
}
