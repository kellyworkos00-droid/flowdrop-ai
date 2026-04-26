import { NextResponse } from "next/server";
import { listAuditEntries, toCsv } from "@/lib/audit/log";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const action = url.searchParams.get("action") ?? undefined;
  const actorId = url.searchParams.get("actorId") ?? undefined;
  const outcomeParam = url.searchParams.get("outcome");
  const outcome = outcomeParam === "allowed" || outcomeParam === "denied" ? outcomeParam : undefined;
  const workspaceId = url.searchParams.get("workspaceId") ?? undefined;
  const exportFormat = url.searchParams.get("export");
  const limitParam = url.searchParams.get("limit");
  const limit = limitParam ? Number.parseInt(limitParam, 10) : 200;

  const items = listAuditEntries({ action, actorId, outcome, workspaceId, limit });

  if (exportFormat === "csv") {
    return new NextResponse(toCsv(items), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="audit-log.csv"',
      },
    });
  }

  return NextResponse.json({ items, total: items.length });
}
