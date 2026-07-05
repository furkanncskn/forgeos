import { describe, expect, it } from "vitest";

import {
  DOC_TYPES,
  canonicalFrontmatterSchema,
  docIdSchema,
  frontmatterSchemas,
  slugFromId,
  validateFrontmatter
} from "../src/index.js";

/** A frontmatter block exactly as the real corpus writes it. */
const corpusDoc = {
  id: "STD-001",
  title: "Documentation Standard",
  version: "1.0.0",
  status: "Approved",
  owner: "Chief Architecture Officer (CAO)",
  classification: "Internal",
  created: "2026-07-04",
  updated: "2026-07-04",
  reviewers: ["Enterprise Architecture Office", "Security Office"],
  related: ["KNOW-001", "KNOW-003"]
};

describe("DOC_TYPES (Phase 1.5)", () => {
  it("covers every /docs category", () => {
    expect([...DOC_TYPES].sort()).toEqual(
      [
        "agent", "asset", "company", "decision", "department", "governance",
        "integration", "knowledge", "memory", "operating-model", "organization",
        "playbook", "project", "prompt", "standard", "template", "tool", "workflow"
      ].sort()
    );
  });

  it("has a schema registered for every type", () => {
    for (const type of DOC_TYPES) {
      expect(frontmatterSchemas[type]).toBeDefined();
    }
  });
});

describe("canonical frontmatter schema", () => {
  it("accepts a real corpus document as-is", () => {
    const result = validateFrontmatter("standard", corpusDoc);
    expect(result.ok).toBe(true);
  });

  it("requires only id and title", () => {
    expect(validateFrontmatter("standard", { id: "STD-099", title: "X" }).ok).toBe(true);
  });

  it("treats frontmatter `type:` as informational (any value passes)", () => {
    const result = validateFrontmatter("agent", {
      id: "AGENT-007",
      title: "Research Agent",
      type: "Specialist Agent",
      autonomy: "Assisted",
      risk_level: "Medium"
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const data = result.data as Record<string, unknown>;
      expect(data.type).toBe("Specialist Agent");
      expect(data.autonomy).toBe("Assisted");
    }
  });

  it("accepts the corpus status vocabulary and any future value", () => {
    for (const status of ["Approved", "Template", "Draft", "In Review"]) {
      expect(validateFrontmatter("template", { id: "TPL-001", title: "T", status }).ok).toBe(true);
    }
  });

  it("accepts placeholder dates used by templates (YYYY-MM-DD literal)", () => {
    const result = validateFrontmatter("template", {
      id: "TPL-001",
      title: "PRD Template",
      created: "YYYY-MM-DD",
      updated: "YYYY-MM-DD"
    });
    expect(result.ok).toBe(true);
  });

  it("normalizes Date objects (YAML 1.1 parsers) to ISO strings", () => {
    const result = validateFrontmatter("standard", {
      ...corpusDoc,
      created: new Date("2026-07-04T00:00:00Z")
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.created).toBe("2026-07-04");
  });

  it("validates related as document IDs", () => {
    expect(
      validateFrontmatter("standard", { ...corpusDoc, related: ["not a valid id!"] }).ok
    ).toBe(false);
    const ok = validateFrontmatter("standard", { ...corpusDoc, related: ["AGENT-007", "ADR-0001"] });
    expect(ok.ok).toBe(true);
  });

  it("reports missing required fields with their path", () => {
    const result = validateFrontmatter("standard", { title: "No id" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues.map((i) => i.path)).toContain("id");
    }
  });

  it("preserves unknown extra fields (passthrough)", () => {
    const parsed = canonicalFrontmatterSchema.parse({ ...corpusDoc, custom_field: 42 });
    expect((parsed as Record<string, unknown>).custom_field).toBe(42);
  });
});

describe("docIdSchema + slugFromId", () => {
  it("accepts real corpus id shapes", () => {
    for (const id of ["STD-001", "AGENT-007", "ADR-0001", "CMP-README", "AI-001", "QA-010", "OS-003"]) {
      expect(docIdSchema.safeParse(id).success, id).toBe(true);
    }
  });

  it("rejects malformed ids", () => {
    for (const id of ["std-001", "STD 001", "STD", "-001", "S-", ""]) {
      expect(docIdSchema.safeParse(id).success, id).toBe(false);
    }
  });

  it("derives slugs by lowercasing", () => {
    expect(slugFromId("AGENT-007")).toBe("agent-007");
    expect(slugFromId("ADR-0001")).toBe("adr-0001");
  });
});
