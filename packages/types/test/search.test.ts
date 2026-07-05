import { describe, expect, it } from "vitest";

import {
  relatedQuerySchema,
  searchQuerySchema,
  searchResponseSchema
} from "../src/index.js";

describe("search query contract", () => {
  it("requires q and applies defaults", () => {
    expect(searchQuerySchema.safeParse({}).success).toBe(false);
    const parsed = searchQuerySchema.parse({ q: "governance" });
    expect(parsed).toEqual({ q: "governance", mode: "auto", limit: 20, offset: 0 });
  });

  it("normalizes single and repeated list params (Fastify querystring)", () => {
    expect(searchQuerySchema.parse({ q: "x", type: "agent" }).type).toEqual(["agent"]);
    expect(searchQuerySchema.parse({ q: "x", type: ["agent", "standard"] }).type).toEqual([
      "agent",
      "standard"
    ]);
    expect(searchQuerySchema.parse({ q: "x", tag: "governance" }).tag).toEqual(["governance"]);
  });

  it("rejects invalid types, modes and paging", () => {
    expect(searchQuerySchema.safeParse({ q: "x", type: "Specialist Agent" }).success).toBe(false);
    expect(searchQuerySchema.safeParse({ q: "x", mode: "vector" }).success).toBe(false);
    expect(searchQuerySchema.safeParse({ q: "x", limit: 101 }).success).toBe(false);
  });

  it("accepts all four negotiation modes (stable contract, ADR-0003 D2)", () => {
    for (const mode of ["auto", "keyword", "semantic", "hybrid"]) {
      expect(searchQuerySchema.safeParse({ q: "x", mode }).success).toBe(true);
    }
  });
});

describe("related query contract", () => {
  it("splits comma lists and validates types", () => {
    expect(relatedQuerySchema.parse({ types: "agent,prompt" }).types).toEqual(["agent", "prompt"]);
    expect(relatedQuerySchema.parse({ types: ["workflow"] }).types).toEqual(["workflow"]);
    expect(relatedQuerySchema.safeParse({ types: "nope" }).success).toBe(false);
    expect(relatedQuerySchema.parse({}).limit).toBe(10);
  });
});

describe("search response contract", () => {
  it("accepts a full response with spans, facets and mode metadata", () => {
    const response = {
      results: [
        {
          document: {
            id: "6f1e0d9a-3f75-4a6c-9d0e-1c2b3a4d5e6f",
            docId: "ADR-0002",
            slug: "adr-0002",
            docType: "decision",
            title: "Documentation Contract Alignment",
            path: "docs/decisions/ADR-0002.md",
            status: "Approved",
            version: "1.0.0",
            owner: "EAB",
            tags: ["decision"],
            updatedAt: "2026-07-05T00:00:00.000Z"
          },
          score: 1.23,
          snippet: [
            { text: "the ", highlight: false },
            { text: "frontmatter", highlight: true },
            { text: " dialect", highlight: false }
          ],
          matchedFields: ["title", "body"]
        }
      ],
      total: 1,
      limit: 20,
      offset: 0,
      facets: {
        types: [{ value: "decision", count: 1 }],
        statuses: [{ value: "Approved", count: 1 }],
        tags: []
      },
      query: { q: "frontmatter", mode: "auto", modeUsed: "keyword", tookMs: 12 }
    };
    expect(searchResponseSchema.safeParse(response).success).toBe(true);
  });
});
