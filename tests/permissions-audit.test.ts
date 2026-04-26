import { describe, expect, it } from "vitest";
import { POST as createDrop } from "@/app/api/drops/route";
import { listAuditEntries } from "@/lib/audit/log";

describe("drop mutation permissions", () => {
  it("denies viewer role and logs denied audit entry", async () => {
    const request = new Request("http://localhost/api/drops", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-role": "viewer",
        "x-actor-id": "viewer-1",
        "x-actor-name": "Read Only",
        "x-workspace-id": "ws-1",
      },
      body: JSON.stringify({ content: "x", type: "task", workspaceId: "ws-1" }),
    });

    const response = await createDrop(request);
    expect(response.status).toBe(403);

    const audit = listAuditEntries({ action: "drop:create", actorId: "viewer-1", outcome: "denied" });
    expect(audit.length).toBeGreaterThan(0);
  });

  it("allows manager role and logs allowed audit entry", async () => {
    const request = new Request("http://localhost/api/drops", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-role": "manager",
        "x-actor-id": "manager-1",
        "x-actor-name": "Manager",
        "x-workspace-id": "ws-2",
      },
      body: JSON.stringify({ content: "Ship feature", type: "task", workspaceId: "ws-2" }),
    });

    const response = await createDrop(request);
    expect(response.status).toBe(200);

    const audit = listAuditEntries({ action: "drop:create", actorId: "manager-1", outcome: "allowed" });
    expect(audit.length).toBeGreaterThan(0);
    expect(audit[0]?.workspaceId).toBe("ws-2");
  });
});
