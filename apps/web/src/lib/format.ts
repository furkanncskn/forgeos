import type { DocType } from "@forgeos/types";

/** Human labels for the folder-derived document types (ADR-0002). */
export const DOC_TYPE_LABELS: Record<DocType, string> = {
  agent: "Agent",
  prompt: "Prompt",
  workflow: "Workflow",
  standard: "Standard",
  decision: "Decision",
  memory: "Memory",
  project: "Project",
  integration: "Integration",
  tool: "Tool",
  asset: "Asset",
  department: "Department",
  governance: "Governance",
  knowledge: "Knowledge",
  "operating-model": "Operating Model",
  playbook: "Playbook",
  template: "Template",
  company: "Company",
  organization: "Organization"
};

/** CSS modifier for a corpus status chip; unknown statuses render neutral. */
export function statusClass(status: string): string {
  switch (status) {
    case "Approved":
      return "chip-status-approved";
    case "Draft":
      return "chip-status-draft";
    case "Template":
      return "chip-status-template";
    case "Deprecated":
    case "Superseded":
      return "chip-status-retired";
    default:
      return "chip-status-neutral";
  }
}

/** '2026-07-05T12:34:56.000Z' → '2026-07-05'. Passes through non-ISO values. */
export function formatDate(value: string): string {
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(value);
  return match?.[1] ?? value;
}
