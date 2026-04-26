export interface PlaybookTemplate {
  id: string;
  name: string;
  description: string;
  defaults: {
    priority: "normal" | "high" | "urgent";
    dueInDays: number;
  };
  tasks: string[];
}

export const starterPlaybooks: PlaybookTemplate[] = [
  {
    id: "design_review",
    name: "Design Review",
    description: "Collect context, review async, and finalize UX decisions.",
    defaults: { priority: "high", dueInDays: 3 },
    tasks: [
      "Prepare design brief and success criteria",
      "Attach mockups and interaction notes",
      "Run async review with Product and Engineering",
      "Resolve feedback and publish decision record",
    ],
  },
  {
    id: "release_checklist",
    name: "Release Checklist",
    description: "Quality gate from staging validation to launch comms.",
    defaults: { priority: "high", dueInDays: 2 },
    tasks: [
      "Confirm release scope and owner list",
      "Run smoke tests on staging",
      "Verify rollback plan and feature flags",
      "Publish release notes and launch message",
    ],
  },
  {
    id: "incident_response",
    name: "Incident Response",
    description: "Structured response for active production incidents.",
    defaults: { priority: "urgent", dueInDays: 1 },
    tasks: [
      "Create incident channel and assign commander",
      "Capture timeline and impacted systems",
      "Ship mitigation and verify service recovery",
      "Publish postmortem action items",
    ],
  },
];
