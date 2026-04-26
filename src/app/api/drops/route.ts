import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as { content?: string; type?: string; workspaceId?: string };

  if (!body.workspaceId || !body.content || !body.type) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // TODO: replace with real API call
  return NextResponse.json({
    dropId: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  });
}
