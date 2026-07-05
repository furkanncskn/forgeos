import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { sql } from "drizzle-orm";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { apiErrorSchema, documentDetailSchema, documentListSchema } from "@forgeos/types";

import { createDb, type Db } from "../src/db/client.js";
import { runMigrations } from "../src/db/migrate.js";
import { runDocsSync } from "../src/modules/sync/service.js";
import { buildServer } from "../src/server.js";
import { authCookie } from "./helpers.js";

/**
 * Integration suite — requires a real PostgreSQL (TEST_DATABASE_URL, see the
 * sync suite). Documents are seeded through the real sync pipeline so the
 * read API is tested against exactly what sync writes.
 */
const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL;

function corpusDoc(id: string, title: string, extra = ""): string {
  return `---
id: ${id}
title: ${title}
version: 1.0.0
status: Approved
owner: Enterprise Architecture Board
classification: Internal
created: 2026-07-04
updated: 2026-07-05
${extra}
tags:
  - governance
---

# ${title}

Body of **${id}**.
`;
}

describe.skipIf(!TEST_DATABASE_URL)("documents read API (integration, Phase 2)", () => {
  let db: Db;
  let close: () => Promise<void>;
  let root: string;
  let docsDir: string;
  let app: Awaited<ReturnType<typeof buildServer>>;
  let cookie: string;

  /** Authenticated GET as the seeded viewer (reads require viewer+). */
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
    root = await mkdtemp(join(tmpdir(), "forgeos-docs-api-"));
    docsDir = join(root, "docs");
    await mkdir(join(docsDir, "standards"), { recursive: true });
    await mkdir(join(docsDir, "agents"), { recursive: true });
    await mkdir(join(docsDir, "decisions"), { recursive: true });

    await writeFile(
      join(docsDir, "standards", "STD-001-Documentation-Standard.md"),
      corpusDoc("STD-001", "Documentation Standard", "related:\n  - AGENT-007\n  - KNOW-404\n")
    );
    await writeFile(
      join(docsDir, "agents", "AGENT-007-Research-Agent.md"),
      corpusDoc("AGENT-007", "Research Agent", "related:\n  - STD-001\n")
    );
    await writeFile(
      join(docsDir, "decisions", "ADR-0002-Documentation-Contract-Alignment.md"),
      corpusDoc("ADR-0002", "Documentation Contract Alignment", "related:\n  - STD-001\n")
    );

    await runDocsSync(db, docsDir);
    app = await buildServer({ db, config: { docsDir } });
    cookie = await authCookie(app, db, "viewer");
  });

  afterEach(async () => {
    await app.close();
    await rm(root, { recursive: true, force: true });
  });

  it("lists all documents sorted by slug, matching the shared contract", async () => {
    const res = await get("/api/v1/documents");
    expect(res.statusCode).toBe(200);

    const body = documentListSchema.parse(res.json());
    expect(body.total).toBe(3);
    expect(body.documents.map((d) => d.docId)).toEqual(["ADR-0002", "AGENT-007", "STD-001"]);

    const std = body.documents.find((d) => d.docId === "STD-001");
    expect(std?.docType).toBe("standard");
    expect(std?.status).toBe("Approved");
    expect(std?.version).toBe("1.0.0");
    expect(std?.owner).toBe("Enterprise Architecture Board");
    expect(std?.tags).toEqual(["governance"]);
  });

  it("filters by document type", async () => {
    const res = await get("/api/v1/documents?type=agent");
    const body = documentListSchema.parse(res.json());
    expect(body.total).toBe(1);
    expect(body.documents[0]?.docId).toBe("AGENT-007");
  });

  it("searches by title and by document id, case-insensitively", async () => {
    const byTitle = documentListSchema.parse(
      (await get("/api/v1/documents?q=research")).json()
    );
    expect(byTitle.documents.map((d) => d.docId)).toEqual(["AGENT-007"]);

    const byId = documentListSchema.parse(
      (await get("/api/v1/documents?q=ADR-00")).json()
    );
    expect(byId.documents.map((d) => d.docId)).toEqual(["ADR-0002"]);

    const none = documentListSchema.parse(
      (await get("/api/v1/documents?q=100%25")).json()
    );
    expect(none.total).toBe(0); // LIKE wildcards are escaped: '100%' matches nothing
  });

  it("combines type filter and search, and paginates with a stable total", async () => {
    const combined = documentListSchema.parse(
      (await get("/api/v1/documents?type=decision&q=alignment")).json()
    );
    expect(combined.documents.map((d) => d.docId)).toEqual(["ADR-0002"]);

    const page = documentListSchema.parse(
      (await get("/api/v1/documents?limit=2&offset=2")).json()
    );
    expect(page.total).toBe(3);
    expect(page.documents.map((d) => d.docId)).toEqual(["STD-001"]);
  });

  it("rejects an invalid query with a 400 error envelope", async () => {
    const res = await get("/api/v1/documents?type=nope");
    expect(res.statusCode).toBe(400);
    expect(apiErrorSchema.parse(res.json()).message).toContain("type");
  });

  it("returns document detail with metadata, body and relationships", async () => {
    const res = await get("/api/v1/documents/std-001");
    expect(res.statusCode).toBe(200);

    const detail = documentDetailSchema.parse(res.json());
    expect(detail.docId).toBe("STD-001");
    expect(detail.bodyMd).toContain("Body of **STD-001**");
    expect(detail.frontmatter.classification).toBe("Internal");

    // Outgoing: AGENT-007 resolves, KNOW-404 stays dangling.
    expect(detail.outgoing).toEqual([
      {
        targetRef: "AGENT-007",
        target: { docId: "AGENT-007", slug: "agent-007", title: "Research Agent", docType: "agent" }
      },
      { targetRef: "KNOW-404", target: null }
    ]);

    // Incoming: both AGENT-007 and ADR-0002 reference STD-001.
    expect(detail.incoming.map((r) => r.docId)).toEqual(["ADR-0002", "AGENT-007"]);
  });

  it("resolves detail lookups by document id too (case-insensitive slug)", async () => {
    const res = await get("/api/v1/documents/STD-001");
    expect(res.statusCode).toBe(200);
    expect(documentDetailSchema.parse(res.json()).slug).toBe("std-001");
  });

  it("404s with the error envelope for unknown slugs", async () => {
    const res = await get("/api/v1/documents/does-not-exist");
    expect(res.statusCode).toBe(404);
    expect(apiErrorSchema.parse(res.json()).error).toBe("Not Found");
  });
});
