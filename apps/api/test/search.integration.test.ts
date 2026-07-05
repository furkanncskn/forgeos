import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { sql } from "drizzle-orm";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { relatedResponseSchema, searchResponseSchema } from "@forgeos/types";

import { createDb, type Db } from "../src/db/client.js";
import { runMigrations } from "../src/db/migrate.js";
import { runDocsSync } from "../src/modules/sync/service.js";
import { buildServer } from "../src/server.js";
import { authCookie } from "./helpers.js";

/** Integration suite — requires TEST_DATABASE_URL (see the sync suite). */
const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL;

function doc(id: string, title: string, status: string, body: string, extra = ""): string {
  return `---
id: ${id}
title: ${title}
version: 1.0.0
status: ${status}
owner: Enterprise Architecture Board
${extra}
---

${body}
`;
}

describe.skipIf(!TEST_DATABASE_URL)("search & related API (integration, Phase 3)", () => {
  let db: Db;
  let close: () => Promise<void>;
  let root: string;
  let docsDir: string;
  let app: Awaited<ReturnType<typeof buildServer>>;
  let cookie: string;

  function get(url: string) {
    return app.inject({ method: "GET", url, headers: { cookie } });
  }

  beforeAll(async () => {
    await runMigrations(TEST_DATABASE_URL as string);
    ({ db, close } = createDb(TEST_DATABASE_URL as string));
  });

  afterAll(async () => {
    await close();
  });

  beforeEach(async () => {
    await db.execute(
      sql`TRUNCATE documents, document_versions, tags, document_tags, document_links, sync_runs, users, sessions CASCADE`
    );
    root = await mkdtemp(join(tmpdir(), "forgeos-search-"));
    docsDir = join(root, "docs");
    await mkdir(join(docsDir, "standards"), { recursive: true });
    await mkdir(join(docsDir, "agents"), { recursive: true });
    await mkdir(join(docsDir, "departments", "DEP-005-Engineering"), { recursive: true });

    await writeFile(
      join(docsDir, "standards", "STD-001-Zebra-Standard.md"),
      doc(
        "STD-001",
        "Zebra Naming Standard",
        "Approved",
        "# Purpose\n\nZebra conventions for services.\n\n## Zebra rules\n\nAll zebra services follow this.",
        "tags:\n  - zebra\n  - naming\nrelated:\n  - AGENT-001\n"
      )
    );
    await writeFile(
      join(docsDir, "standards", "STD-002-Zebra-Deprecated.md"),
      doc(
        "STD-002",
        "Old Zebra Guideline",
        "Deprecated",
        "Zebra zebra zebra zebra zebra everywhere in this old body."
      )
    );
    await writeFile(
      join(docsDir, "agents", "AGENT-001-Review-Agent.md"),
      doc(
        "AGENT-001",
        "Review Agent",
        "Approved",
        "# Role\n\nReviews zebra services.",
        "tags:\n  - zebra\n  - review\n"
      )
    );
    await writeFile(
      join(docsDir, "departments", "DEP-005-Engineering", "ENG-001-Engineering-SOP.md"),
      doc("ENG-001", "Engineering SOP", "Approved", "# SOP\n\nHow engineering works.")
    );
    await writeFile(
      join(docsDir, "departments", "DEP-005-Engineering", "ENG-002-Engineering-Oncall.md"),
      doc("ENG-002", "Engineering Oncall", "Draft", "# Oncall\n\nRotation details.")
    );

    await runDocsSync(db, docsDir);
    app = await buildServer({ db, config: { docsDir } });
    cookie = await authCookie(app, db, "viewer");
  });

  afterEach(async () => {
    await app.close();
    await rm(root, { recursive: true, force: true });
  });

  // ── /search ──────────────────────────────────────────────────────

  it("finds documents by body text and returns highlighted snippets", async () => {
    const res = await get("/api/v1/search?q=zebra");
    expect(res.statusCode).toBe(200);
    const body = searchResponseSchema.parse(res.json());

    expect(body.total).toBe(3);
    expect(body.query.modeUsed).toBe("keyword");
    const first = body.results[0];
    expect(first?.snippet.some((s) => s.highlight && /zebra/i.test(s.text))).toBe(true);
  });

  it("ranks Approved above Deprecated for equal-topic matches", async () => {
    const body = searchResponseSchema.parse((await get("/api/v1/search?q=zebra")).json());
    const ids = body.results.map((r) => r.document.docId);
    // STD-002 is stuffed with the term but Deprecated — must not win.
    expect(ids[0]).not.toBe("STD-002");
    expect(ids).toContain("STD-002"); // still findable, just demoted
  });

  it("pins exact document-id queries to the top", async () => {
    const body = searchResponseSchema.parse((await get("/api/v1/search?q=ENG-002")).json());
    expect(body.results[0]?.document.docId).toBe("ENG-002");
  });

  it("reports matched fields (title vs body vs tags)", async () => {
    const body = searchResponseSchema.parse((await get("/api/v1/search?q=naming")).json());
    const std = body.results.find((r) => r.document.docId === "STD-001");
    expect(std?.matchedFields).toContain("title");
    expect(std?.matchedFields).toContain("tags");
  });

  it("filters by facet dimensions and keeps facet counts cross-computed", async () => {
    const filtered = searchResponseSchema.parse(
      (await get("/api/v1/search?q=zebra&type=standard")).json()
    );
    expect(filtered.total).toBe(2);
    expect(filtered.results.every((r) => r.document.docType === "standard")).toBe(true);

    // Type facet ignores its own filter: the agent hit still counts.
    const typeFacet = Object.fromEntries(filtered.facets.types.map((f) => [f.value, f.count]));
    expect(typeFacet.standard).toBe(2);
    expect(typeFacet.agent).toBe(1);

    const byTag = searchResponseSchema.parse(
      (await get("/api/v1/search?q=zebra&tag=review")).json()
    );
    expect(byTag.total).toBe(1);
    expect(byTag.results[0]?.document.docId).toBe("AGENT-001");

    const byStatus = searchResponseSchema.parse(
      (await get("/api/v1/search?q=zebra&status=Deprecated")).json()
    );
    expect(byStatus.results.map((r) => r.document.docId)).toEqual(["STD-002"]);
  });

  it("supports websearch operators (phrases, exclusion)", async () => {
    const excluded = searchResponseSchema.parse(
      (await get("/api/v1/search?q=zebra%20-review")).json()
    );
    expect(excluded.results.map((r) => r.document.docId)).not.toContain("AGENT-001");
  });

  it("negotiates mode: hybrid/semantic requests resolve to keyword (MVP)", async () => {
    for (const mode of ["auto", "keyword", "semantic", "hybrid"]) {
      const body = searchResponseSchema.parse(
        (await get(`/api/v1/search?q=zebra&mode=${mode}`)).json()
      );
      expect(body.query.mode).toBe(mode);
      expect(body.query.modeUsed).toBe("keyword");
    }
  });

  it("paginates with stable totals", async () => {
    const page2 = searchResponseSchema.parse(
      (await get("/api/v1/search?q=zebra&limit=2&offset=2")).json()
    );
    expect(page2.total).toBe(3);
    expect(page2.results.length).toBe(1);
  });

  it("rejects bad queries and requires auth", async () => {
    expect((await get("/api/v1/search")).statusCode).toBe(400);
    expect((await get("/api/v1/search?q=x&mode=vector")).statusCode).toBe(400);
    expect((await app.inject({ method: "GET", url: "/api/v1/search?q=zebra" })).statusCode).toBe(401);
  });

  // ── /documents/:slug/related ─────────────────────────────────────

  it("blends links, backlinks, tags and folder into explained results", async () => {
    const res = await get("/api/v1/documents/std-001/related");
    expect(res.statusCode).toBe(200);
    const body = relatedResponseSchema.parse(res.json());

    // AGENT-001: direct link (3.0) + shared tag zebra (1.0) → top, both reasons.
    const top = body.related[0];
    expect(top?.document.docId).toBe("AGENT-001");
    expect(top?.reasons).toContain("link");
    expect(top?.reasons).toContain("tag");

    // From the agent's side the same edge is a backlink.
    const agentSide = relatedResponseSchema.parse(
      (await get("/api/v1/documents/agent-001/related")).json()
    );
    const std = agentSide.related.find((r) => r.document.docId === "STD-001");
    expect(std?.reasons).toContain("backlink");
  });

  it("relates department documents through their shared folder", async () => {
    const body = relatedResponseSchema.parse(
      (await get("/api/v1/documents/eng-001/related")).json()
    );
    const oncall = body.related.find((r) => r.document.docId === "ENG-002");
    expect(oncall?.reasons).toEqual(["folder"]);
  });

  it("filters related results by type", async () => {
    const body = relatedResponseSchema.parse(
      (await get("/api/v1/documents/std-001/related?types=agent")).json()
    );
    expect(body.related.length).toBeGreaterThan(0);
    expect(body.related.every((r) => r.document.docType === "agent")).toBe(true);
  });

  it("404s for unknown slugs and requires auth", async () => {
    expect((await get("/api/v1/documents/nope-000/related")).statusCode).toBe(404);
    expect(
      (await app.inject({ method: "GET", url: "/api/v1/documents/std-001/related" })).statusCode
    ).toBe(401);
  });
});
