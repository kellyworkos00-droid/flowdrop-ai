import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as { name?: string; role?: string; company?: string };

  if (!body.name || !body.role || !body.company) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // TODO: replace with real API call
  return NextResponse.json({
    userId: crypto.randomUUID(),
    workspaceId: crypto.randomUUID(),
  });
}
