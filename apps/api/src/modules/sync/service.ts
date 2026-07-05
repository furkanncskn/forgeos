import { readFile } from "node:fs/promises";
import { basename, dirname, relative, sep } from "node:path";

import { desc, eq, sql } from "drizzle-orm";

import { safeParseDocument, type ParsedDocument } from "@forgeos/markdown";
import type { SyncFileError, SyncRun } from "@forgeos/types";

import type { Db } from "../../db/client.js";
import {
  documentLinks,
  documentTags,
  documentVersions,
  documents,
  syncRuns,
  tags
} from "../../db/schema.js";
import { findMarkdownFiles } from "./walker.js";

type SyncRunRow = typeof syncRuns.$inferSelect;

/** Converts a DB row to the shared API shape (dates as ISO strings). */
export function serializeSyncRun(row: SyncRunRow): SyncRun {
  return {
    id: row.id,
    startedAt: row.startedAt.toISOString(),
    finishedAt: row.finishedAt ? row.finishedAt.toISOString() : null,
    status: row.status as SyncRun["status"],
    filesSeen: row.filesSeen,
    filesChanged: row.filesChanged,
    filesUnchanged: row.filesUnchanged,
    filesSkipped: row.filesSkipped,
    filesInvalid: row.filesInvalid,
    errors: row.errors
  };
}

/** `/tmp/x/docs/agents/a.md` (docsDir=/tmp/x/docs) → `docs/agents/a.md`. */
function toRepoRelativePath(docsDir: string, absPath: string): string {
  return relative(dirname(docsDir), absPath).split(sep).join("/");
}

/**
 * Runs one full /docs → PostgreSQL sync (Phase 1.5 contract).
 *
 * - Walks `docsDir` for markdown files (only templates/frontmatter/ excluded).
 * - Parses + validates each file against the canonical corpus convention.
 * - README.md files without a frontmatter block are navigation aids —
 *   counted as skipped, never as errors.
 * - Upserts changed documents (checksum-idempotent), snapshots a version,
 *   replaces tags and links. Each file is its own transaction, so one bad
 *   file never poisons the run.
 * - Links store the raw document ID (`related: [STD-003]`); targets resolve
 *   by matching slug = lowercase(id), immediately when possible and in a
 *   final pass for targets synced later in the run.
 */
export async function runDocsSync(db: Db, docsDir: string): Promise<SyncRun> {
  const inserted = await db.insert(syncRuns).values({}).returning();
  const run = inserted[0];
  if (!run) throw new Error("failed to create sync_runs row");

  const errors: SyncFileError[] = [];
  let filesSeen = 0;
  let filesChanged = 0;
  let filesUnchanged = 0;
  let filesSkipped = 0;

  try {
    const files = await findMarkdownFiles(docsDir);
    filesSeen = files.length;

    for (const absPath of files) {
      const relPath = toRepoRelativePath(docsDir, absPath);

      let raw: string;
      try {
        raw = await readFile(absPath, "utf8");
      } catch (err) {
        errors.push({
          path: relPath,
          issues: [{ path: "", message: `unreadable file: ${String(err)}` }]
        });
        continue;
      }

      const parsed = safeParseDocument(relPath, raw);
      if (!parsed.ok) {
        // Frontmatter-less READMEs are navigation aids, not documents.
        if (parsed.code === "no-frontmatter" && basename(absPath) === "README.md") {
          filesSkipped++;
          continue;
        }
        errors.push({ path: relPath, issues: parsed.issues });
        continue;
      }

      try {
        const outcome = await upsertDocument(db, parsed.document);
        if (outcome === "unchanged") filesUnchanged++;
        else filesChanged++;
      } catch (err) {
        errors.push({
          path: relPath,
          issues: [{ path: "", message: err instanceof Error ? err.message : String(err) }]
        });
      }
    }

    await resolveDanglingLinks(db);

    const updated = await db
      .update(syncRuns)
      .set({
        finishedAt: new Date(),
        status: "ok",
        filesSeen,
        filesChanged,
        filesUnchanged,
        filesSkipped,
        filesInvalid: errors.length,
        errors
      })
      .where(eq(syncRuns.id, run.id))
      .returning();
    const finished = updated[0];
    if (!finished) throw new Error("failed to finalize sync_runs row");
    return serializeSyncRun(finished);
  } catch (fatal) {
    await db
      .update(syncRuns)
      .set({
        finishedAt: new Date(),
        status: "failed",
        filesSeen,
        filesChanged,
        filesUnchanged,
        filesSkipped,
        filesInvalid: errors.length,
        errors: [
          ...errors,
          { path: "", issues: [{ path: "", message: `fatal: ${String(fatal)}` }] }
        ]
      })
      .where(eq(syncRuns.id, run.id));
    throw fatal;
  }
}

/** Lists the most recent sync runs, newest first. */
export async function listSyncRuns(db: Db, limit = 20): Promise<SyncRun[]> {
  const rows = await db.select().from(syncRuns).orderBy(desc(syncRuns.startedAt)).limit(limit);
  return rows.map(serializeSyncRun);
}

type UpsertOutcome = "inserted" | "updated" | "unchanged";

async function upsertDocument(db: Db, doc: ParsedDocument): Promise<UpsertOutcome> {
  return db.transaction(async (tx) => {
    const existingRows = await tx
      .select({ id: documents.id, checksum: documents.checksum })
      .from(documents)
      .where(eq(documents.path, doc.path))
      .limit(1);
    const existing = existingRows[0];

    // Idempotency: identical raw content → nothing to do.
    if (existing && existing.checksum === doc.checksum) return "unchanged";

    const frontmatter = doc.frontmatter as unknown as Record<string, unknown>;
    const values = {
      path: doc.path,
      docType: doc.docType,
      title: doc.title,
      slug: doc.slug,
      frontmatter,
      bodyMd: doc.bodyMd,
      bodyText: doc.bodyText,
      bodyHeadings: doc.bodyHeadings,
      checksum: doc.checksum,
      // Raw corpus status vocabulary (Approved/Template/…); column default otherwise.
      status: doc.frontmatter.status ?? "active",
      updatedAt: new Date()
    };

    let documentId: string;
    let outcome: UpsertOutcome;
    if (existing) {
      await tx.update(documents).set(values).where(eq(documents.id, existing.id));
      documentId = existing.id;
      outcome = "updated";
    } else {
      const insertedRows = await tx.insert(documents).values(values).returning({ id: documents.id });
      const insertedRow = insertedRows[0];
      if (!insertedRow) throw new Error(`insert returned no row for ${doc.path}`);
      documentId = insertedRow.id;
      outcome = "inserted";
    }

    // Version snapshot on every content change.
    const versionRows = await tx
      .select({ next: sql<number>`coalesce(max(${documentVersions.version}), 0) + 1` })
      .from(documentVersions)
      .where(eq(documentVersions.documentId, documentId));
    await tx.insert(documentVersions).values({
      documentId,
      version: versionRows[0]?.next ?? 1,
      frontmatter,
      bodyMd: doc.bodyMd,
      checksum: doc.checksum,
      changeNote: outcome === "inserted" ? "initial sync" : "updated by sync"
    });

    // Replace tags.
    await tx.delete(documentTags).where(eq(documentTags.documentId, documentId));
    const tagNames = doc.frontmatter.tags ?? [];
    for (const name of tagNames) {
      await tx.insert(tags).values({ name }).onConflictDoNothing({ target: tags.name });
      const tagRows = await tx.select({ id: tags.id }).from(tags).where(eq(tags.name, name)).limit(1);
      const tagRow = tagRows[0];
      if (!tagRow) throw new Error(`tag lookup failed for '${name}'`);
      await tx
        .insert(documentTags)
        .values({ documentId, tagId: tagRow.id })
        .onConflictDoNothing();
    }

    // Replace outgoing links; targets resolve by slug = lowercase(id).
    await tx.delete(documentLinks).where(eq(documentLinks.sourceId, documentId));
    for (const ref of doc.references) {
      const targetRows = await tx
        .select({ id: documents.id })
        .from(documents)
        .where(eq(documents.slug, ref.toLowerCase()))
        .limit(1);
      await tx
        .insert(documentLinks)
        .values({ sourceId: documentId, targetRef: ref, targetId: targetRows[0]?.id ?? null })
        .onConflictDoNothing();
    }

    return outcome;
  });
}

/**
 * Fills in target_id for links whose target document was synced after the
 * referencing document (or created in a later run).
 */
async function resolveDanglingLinks(db: Db): Promise<void> {
  await db.execute(sql`
    UPDATE document_links l
    SET target_id = d.id
    FROM documents d
    WHERE l.target_id IS NULL
      AND d.slug = lower(l.target_ref)
  `);
}
