import { describe, expect, it } from "vitest";

import {
  documentDetailSchema,
  documentListQuerySchema,
  documentSummarySchema
} from "../src/index.js";

const summary = {
  id: "6f1e0d9a-3f75-4a6c-9d0e-1c2b3a4d5e6f",
  docId: "STD-001",
  slug: "std-001",
  docType: "standard",
  title: "Documentation Standard",
  path: "docs/standards/STD-001-Documentation-Standard.md",
  status: "Approved",
  version: "1.0.0",
  owner: "Chief Architecture Officer (CAO)",
  tags: ["documentation", "governance"],
  updatedAt: "2026-07-05T00:00:00.000Z"
};

describe("document list query contract", () => {
  it("applies defaults and coerces numeric strings (querystring input)", () => {
    const parsed = documentListQuerySchema.parse({ limit: "25", offset: "50" });
    expect(parsed).toEqual({ limit: 25, offset: 50, q: undefined, type: undefined });
  });

  it("normalizes a blank q to undefined", () => {
    expect(documentListQuerySchema.parse({ q: "   " }).q).toBeUndefined();
    expect(documentListQuerySchema.parse({ q: " agent " }).q).toBe("agent");
  });

  it("rejects unknown types and out-of-range paging", () => {
    expect(documentListQuerySchema.safeParse({ type: "Specialist Agent" }).success).toBe(false);
    expect(documentListQuerySchema.safeParse({ limit: 0 }).success).toBe(false);
    expect(documentListQuerySchema.safeParse({ limit: 201 }).success).toBe(false);
    expect(documentListQuerySchema.safeParse({ offset: -1 }).success).toBe(false);
  });
});

describe("document payload contracts", () => {
  it("accepts a summary row", () => {
    expect(documentSummarySchema.safeParse(summary).success).toBe(true);
  });

  it("accepts a detail payload with dangling and resolved links", () => {
    const detail = {
      ...summary,
      frontmatter: { id: "STD-001", title: "Documentation Standard", reviewers: ["EA Office"] },
      bodyMd: "# Documentation Standard\n",
      outgoing: [
        { targetRef: "KNOW-001", target: null },
        {
          targetRef: "AGENT-011",
          target: { docId: "AGENT-011", slug: "agent-011", title: "X", docType: "agent" }
        }
      ],
      incoming: [{ docId: "ADR-0002", slug: "adr-0002", title: "Y", docType: "decision" }]
    };
    expect(documentDetailSchema.safeParse(detail).success).toBe(true);
  });
});
