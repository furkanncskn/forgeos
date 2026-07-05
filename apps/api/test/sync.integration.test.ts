import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { sql } from "drizzle-orm";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { syncRunSchema } from "@forgeos/types";

import { createDb, type Db } from "../src/db/client.js";
import { runMigrations } from "../src/db/migrate.js";
import { runDocsSync } from "../src/modules/sync/service.js";
import { buildServer } from "../src/server.js";
import { authCookie } from "./helpers.js";

/**
 * Integration suite — requires a real PostgreSQL. Runs only when
 * TEST_DATABASE_URL is set (see .env.example); point it at a DISPOSABLE
 * database: tables are truncated between tests.
 *
 * Fixtures follow the canonical corpus convention (Phase 1.5).
 */
const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL;

const standardMd = `---
id: STD-001
title: Documentation Standard
version: 1.0.0
status: Approved
owner: Chief Architecture Officer (CAO)
classification: Internal
created: 2026-07-04
updated: 2026-07-04

reviewers:
  - Enterprise Architecture Office

related:
  - KNOW-001
  - AGENT-007

tags:
  - documentation
  - governance
---

# Documentation Standard

All enterprise documents follow this standard.
`;

const agentMd = `---
id: AGENT-007
title: Research Agent
version: 1.0.0
status: Approved
owner: Product & Strategy Office
classification: Internal
created: 2026-07-04
updated: 2026-07-04

type: Specialist Agent
autonomy: Assisted
risk_level: Medium

related:
  - STD-001

tags:
  - governance
---

# Research Agent

Performs market and technology research.
`;

const brokenMd = `---
id: not a valid id
title: Broken Document
---

Bad id format.
`;

const navReadme = `# Standards

Navigation page without frontmatter.
`;

describe.skipIf(!TEST_DATABASE_URL)("/docs → PostgreSQL sync (integration, Phase 1.5)", () => {
  let db: Db;
  let close: () => Promise<void>;
  let root: string;
  let docsDir: string;

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
    root = await mkdtemp(join(tmpdir(), "forgeos-sync-"));
    docsDir = join(root, "docs");
    await mkdir(join(docsDir, "standards"), { recursive: true });
    await mkdir(join(docsDir, "agents"), { recursive: true });
    await writeFile(join(docsDir, "standards", "STD-001-Documentation-Standard.md"), standardMd);
    await writeFile(join(docsDir, "standards", "README.md"), navReadme);
    await writeFile(join(docsDir, "agents", "AGENT-007-Research-Agent.md"), agentMd);
    await writeFile(join(docsDir, "agents", "AGENT-099-Broken.md"), brokenMd);
  });

  afterEach(async () => {
    await rm(root, { recursive: true, force: true });
  });

  it("syncs corpus-convention documents with folder-derived type and id-derived slug", async () => {
    const summary = await runDocsSync(db, docsDir);

    expect(summary.status).toBe("ok");
    expect(summary.filesSeen).toBe(4);
    expect(summary.filesChanged).toBe(2);
    expect(summary.filesSkipped).toBe(1); // the nav README
    expect(summary.filesInvalid).toBe(1); // the broken id

    const rows = await db.execute(
      sql`SELECT path, doc_type, title, slug, status, frontmatter FROM documents ORDER BY slug`
    );
    expect(rows.length).toBe(2);

    const agent = rows[0] as Record<string, unknown>;
    expect(agent.slug).toBe("agent-007");
    expect(agent.doc_type).toBe("agent"); // folder-derived, not 'Specialist Agent'
    expect(agent.status).toBe("Approved"); // raw corpus vocabulary preserved
    const fm = agent.frontmatter as Record<string, unknown>;
    expect(fm.type).toBe("Specialist Agent"); // informational field preserved
    expect(fm.autonomy).toBe("Assisted");
  });

  it("records invalid files with per-field issues; READMEs are skips, not errors", async () => {
    const summary = await runDocsSync(db, docsDir);

    expect(summary.errors.length).toBe(1);
    expect(summary.errors[0]?.path).toBe("docs/agents/AGENT-099-Broken.md");
    expect(summary.errors[0]?.issues.map((i) => i.path)).toContain("id");
    expect(summary.errors.some((e) => e.path.endsWith("README.md"))).toBe(false);
  });

  it("stores ID-based links, resolving targets that exist and keeping dangling refs", async () => {
    await runDocsSync(db, docsDir);

    const links = await db.execute(
      sql`SELECT s.slug AS source, l.target_ref, l.target_id
          FROM document_links l JOIN documents s ON s.id = l.source_id
          ORDER BY l.target_ref`
    );
    const byRef = new Map<string, unknown>();
    for (const row of links) {
      const r = row as Record<string, unknown>;
      byRef.set(String(r.target_ref), r.target_id);
    }

    // STD-001 ↔ AGENT-007 reference each other: both resolve.
    expect(byRef.get("STD-001")).not.toBeNull();
    expect(byRef.get("AGENT-007")).not.toBeNull();
    // KNOW-001 does not exist: kept as a dangling link.
    expect(byRef.has("KNOW-001")).toBe(true);
    expect(byRef.get("KNOW-001")).toBeNull();
  });

  it("is idempotent: unchanged re-sync writes nothing", async () => {
    await runDocsSync(db, docsDir);
    const second = await runDocsSync(db, docsDir);

    expect(second.filesChanged).toBe(0);
    expect(second.filesUnchanged).toBe(2);
    expect(second.filesSkipped).toBe(1);

    const versions = await db.execute(sql`SELECT count(*)::int AS n FROM document_versions`);
    expect((versions[0] as Record<string, unknown>).n).toBe(2);
  });

  it("creates a new version snapshot when a file changes", async () => {
    await runDocsSync(db, docsDir);
    await writeFile(
      join(docsDir, "standards", "STD-001-Documentation-Standard.md"),
      standardMd.replace("version: 1.0.0", "version: 1.1.0")
    );
    const summary = await runDocsSync(db, docsDir);

    expect(summary.filesChanged).toBe(1);
    expect(summary.filesUnchanged).toBe(1);

    const versions = await db.execute(
      sql`SELECT v.version FROM document_versions v
          JOIN documents d ON d.id = v.document_id
          WHERE d.slug = 'std-001' ORDER BY v.version`
    );
    expect(versions.map((r) => (r as Record<string, unknown>).version)).toEqual([1, 2]);
  });

  it("resolves dangling links when the target appears in a later run", async () => {
    await runDocsSync(db, docsDir);

    await mkdir(join(docsDir, "knowledge"), { recursive: true });
    await writeFile(
      join(docsDir, "knowledge", "KNOW-001-Knowledge-Management-Standard.md"),
      `---
id: KNOW-001
title: Knowledge Management Standard
status: Approved
---

Body.
`
    );
    await runDocsSync(db, docsDir);

    const links = await db.execute(
      sql`SELECT target_id FROM document_links WHERE target_ref = 'KNOW-001'`
    );
    expect((links[0] as Record<string, unknown>).target_id).not.toBeNull();
  });

  it("inserts tags and document_tags", async () => {
    await runDocsSync(db, docsDir);

    const tagRows = await db.execute(sql`SELECT name FROM tags ORDER BY name`);
    expect(tagRows.map((r) => (r as Record<string, unknown>).name)).toEqual([
      "documentation",
      "governance"
    ]);

    const docTags = await db.execute(sql`SELECT count(*)::int AS n FROM document_tags`);
    expect((docTags[0] as Record<string, unknown>).n).toBe(3); // STD: 2, AGENT: 1
  });

  it("exposes POST /api/v1/sync/run and GET /api/v1/sync/runs (admin-only)", async () => {
    const app = await buildServer({ db, config: { docsDir } });
    const cookie = await authCookie(app, db, "admin");

    const post = await app.inject({ method: "POST", url: "/api/v1/sync/run", headers: { cookie } });
    expect(post.statusCode).toBe(201);
    const summary = syncRunSchema.parse(post.json());
    expect(summary.status).toBe("ok");
    expect(summary.filesSeen).toBe(4);

    const get = await app.inject({ method: "GET", url: "/api/v1/sync/runs", headers: { cookie } });
    expect(get.statusCode).toBe(200);
    const body = get.json() as { runs: unknown[] };
    expect(body.runs.length).toBe(1);
    expect(syncRunSchema.parse(body.runs[0]).id).toBe(summary.id);

    await app.close();
  });
});
