import { readFileSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  DocumentParseError,
  inferDocTypeFromPath,
  parseDocument,
  safeParseDocument
} from "../src/index.js";

const CRLF_DOC = [
  "---",
  "id: ENG-001",
  "title: Engineering Workflow SOP",
  "version: 1.0.0",
  "status: Approved",
  "owner: Engineering Office",
  "classification: Internal",
  "created: 2026-07-04",
  "updated: 2026-07-04",
  "",
  "related:",
  "  - STD-001",
  "  - ENG-002",
  "---",
  "",
  "# Engineering Workflow",
  "",
  "See STD-001 for documentation rules."
].join("\r\n");

describe("parseDocument (canonical corpus convention)", () => {
  it("parses a CRLF corpus document, deriving type from folder and slug from id", () => {
    const doc = parseDocument("docs/departments/DEP-005-Engineering/ENG-001-Engineering-Workflow-SOP.md", CRLF_DOC);
    expect(doc.docType).toBe("department"); // folder-derived
    expect(doc.docId).toBe("ENG-001");
    expect(doc.slug).toBe("eng-001");
    expect(doc.title).toBe("Engineering Workflow SOP");
    expect(doc.frontmatter.status).toBe("Approved");
    expect(doc.checksum).toMatch(/^[0-9a-f]{64}$/);
    expect(doc.bodyText).toContain("Engineering Workflow");
    expect(doc.bodyText).not.toMatch(/^#{1,6}\s/m);
  });

  it("takes references from `related` only — body ID mentions are ignored", () => {
    const doc = parseDocument("docs/departments/DEP-005-Engineering/ENG-001.md", CRLF_DOC);
    // STD-001 appears in both related and body; ENG-002 only in related.
    // The body also mentions STD-001 — no duplicates, and nothing body-only.
    expect(doc.references).toEqual(["ENG-002", "STD-001"]);
  });

  it("excludes self-references and includes supersedes", () => {
    const raw = [
      "---",
      "id: STD-003",
      "title: Versioning Standard",
      "supersedes: STD-002",
      "related:",
      "  - STD-003", // self — must be dropped
      "  - KNOW-004",
      "---",
      "Body."
    ].join("\n");
    const doc = parseDocument("docs/standards/STD-003.md", raw);
    expect(doc.references).toEqual(["KNOW-004", "STD-002"]);
  });

  it("ignores the informational frontmatter `type:` field entirely", () => {
    const raw = [
      "---",
      "id: AGENT-007",
      "title: Research Agent",
      "type: Specialist Agent",
      "autonomy: Assisted",
      "---",
      "Body."
    ].join("\n");
    const doc = parseDocument("docs/agents/AGENT-007-Research-Agent.md", raw);
    expect(doc.docType).toBe("agent"); // from folder, not from 'Specialist Agent'
    expect((doc.frontmatter as Record<string, unknown>).type).toBe("Specialist Agent");
  });

  it("classifies files without frontmatter with code 'no-frontmatter'", () => {
    const result = safeParseDocument("docs/decisions/README.md", "# Just a nav page\n");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("no-frontmatter");
  });

  it("fails for files outside mapped category folders", () => {
    expect(() => parseDocument("notes/x.md", CRLF_DOC)).toThrow(/not inside a mapped/);
  });

  it("reports invalid ids with the field path", () => {
    const result = safeParseDocument("docs/standards/x.md", "---\nid: lower-case\ntitle: X\n---\nB.");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("invalid");
      expect(result.issues.map((i) => i.path)).toContain("id");
    }
  });

  it("throws DocumentParseError with issues for broken YAML", () => {
    expect(() => parseDocument("docs/standards/x.md", "---\n[broken\n---\nB.")).toThrow(
      DocumentParseError
    );
  });
});

describe("inferDocTypeFromPath (all categories mapped)", () => {
  const cases: Array<[string, string]> = [
    ["docs/agents/AGENT-001.md", "agent"],
    ["docs/prompts/PROMPT-001.md", "prompt"],
    ["docs/workflows/WF-001.md", "workflow"],
    ["docs/standards/STD-001.md", "standard"],
    ["docs/decisions/DEC-001.md", "decision"],
    ["docs/memory/MEM-001.md", "memory"],
    ["docs/projects/PROJ-001.md", "project"],
    ["docs/integrations/INT-001.md", "integration"],
    ["docs/tools/TOOL-001.md", "tool"],
    ["docs/assets/AST-001.md", "asset"],
    ["docs/departments/DEP-005-Engineering/ENG-001.md", "department"],
    ["docs/governance/GOV-001.md", "governance"],
    ["docs/knowledge/KNOW-001.md", "knowledge"],
    ["docs/operating-system/OS-001.md", "operating-model"],
    ["docs/playbooks/PB-001.md", "playbook"],
    ["docs/templates/TPL-001.md", "template"],
    ["docs/company/README.md", "company"],
    ["docs/organization/README.md", "organization"]
  ];
  it.each(cases)("%s → %s", (path, expected) => {
    expect(inferDocTypeFromPath(path)).toBe(expected);
  });

  it("handles Windows separators and returns undefined at the docs root", () => {
    expect(inferDocTypeFromPath("C:\\repo\\docs\\standards\\STD-001.md")).toBe("standard");
    expect(inferDocTypeFromPath("docs/README.md")).toBeUndefined();
  });
});

/**
 * Corpus contract test: every real file under /docs must either parse
 * cleanly or be a frontmatter-less README (navigation aid). This is the
 * executable guarantee that the engine fits the documentation.
 */
describe("real /docs corpus", () => {
  const here = dirname(fileURLToPath(import.meta.url));
  const docsDir = join(here, "..", "..", "..", "docs");

  function walk(dir: string): string[] {
    const out: string[] = [];
    for (const name of readdirSync(dir).sort()) {
      if (name.startsWith(".") || name === "frontmatter") continue;
      const full = join(dir, name);
      if (statSync(full).isDirectory()) out.push(...walk(full));
      else if (name.endsWith(".md")) out.push(full);
    }
    return out;
  }

  it("parses every document; only READMEs may lack frontmatter", () => {
    const files = walk(docsDir);
    expect(files.length).toBeGreaterThan(200);

    const invalid: string[] = [];
    let parsed = 0;
    let navReadmes = 0;
    for (const file of files) {
      const rel = `docs${file.slice(docsDir.length).split("\\").join("/")}`;
      const result = safeParseDocument(rel, readFileSync(file, "utf8"));
      if (result.ok) parsed++;
      else if (result.code === "no-frontmatter" && basename(file) === "README.md") navReadmes++;
      else invalid.push(`${rel}: ${result.issues.map((i) => `${i.path} ${i.message}`).join("; ")}`);
    }

    expect(invalid, invalid.join("\n")).toEqual([]);
    expect(parsed).toBeGreaterThan(200);
    expect(navReadmes).toBeGreaterThanOrEqual(0);
  });

  it("has globally unique document ids (required for ID-based link resolution)", () => {
    const seen = new Map<string, string>();
    const duplicates: string[] = [];
    for (const file of walk(docsDir)) {
      const rel = `docs${file.slice(docsDir.length).split("\\").join("/")}`;
      const result = safeParseDocument(rel, readFileSync(file, "utf8"));
      if (!result.ok) continue;
      const id = result.document.docId;
      const prior = seen.get(id);
      if (prior) duplicates.push(`${id}: ${prior} and ${rel}`);
      seen.set(id, rel);
    }
    expect(duplicates, duplicates.join("\n")).toEqual([]);
  });
});
