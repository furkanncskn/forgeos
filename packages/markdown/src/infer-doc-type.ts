import type { DocType } from "@forgeos/types";

/**
 * Maps every /docs category folder to its document type (Phase 1.5).
 * The folder is AUTHORITATIVE — frontmatter `type:` is informational only.
 */
const FOLDER_TO_TYPE: Readonly<Record<string, DocType>> = {
  agents: "agent",
  prompts: "prompt",
  workflows: "workflow",
  standards: "standard",
  decisions: "decision",
  memory: "memory",
  projects: "project",
  integrations: "integration",
  tools: "tool",
  assets: "asset",
  departments: "department",
  governance: "governance",
  knowledge: "knowledge",
  "operating-system": "operating-model",
  playbooks: "playbook",
  templates: "template",
  company: "company",
  organization: "organization"
};

/**
 * Infers the document type from a file path, e.g.
 * `docs/standards/STD-001-....md` → `"standard"`,
 * `docs/departments/DEP-005-Engineering/ENG-001-....md` → `"department"`.
 *
 * The folder DIRECTLY under `docs/` decides; nesting below it does not.
 * Returns `undefined` for files outside a mapped category (e.g. the /docs
 * root README). Windows and POSIX separators both work.
 */
export function inferDocTypeFromPath(path: string): DocType | undefined {
  const segments = path.replace(/\\/g, "/").split("/").filter(Boolean);
  const docsIndex = segments.lastIndexOf("docs");
  // Prefer the folder directly under `docs/` (there must be a file after it);
  // otherwise fall back to the file's immediate parent folder.
  const folder =
    docsIndex >= 0 && docsIndex + 2 < segments.length
      ? segments[docsIndex + 1]
      : segments[segments.length - 2];
  return folder === undefined ? undefined : FOLDER_TO_TYPE[folder];
}
