import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as { emails?: string[]; workspaceId?: string };

  if (!body.workspaceId || !Array.isArray(body.emails)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // TODO: replace with real API call
  return NextResponse.json({ sent: body.emails.length });
}
