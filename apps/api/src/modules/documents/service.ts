import { and, asc, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import type {
  DocumentDetail,
  DocumentLink,
  DocumentList,
  DocumentListQuery,
  DocumentRef,
  DocumentSummary
} from "@forgeos/types";
import { docTypeSchema } from "@forgeos/types";

import type { Db } from "../../db/client.js";
import { documentLinks, documents } from "../../db/schema.js";

/**
 * Read-only document queries for the Explorer (ADR-0001 §4 — documents).
 *
 * Identity follows ADR-0002: the corpus `id` (frontmatter) is primary and the
 * DB `slug` is its lowercase form, so ID search is a case-insensitive slug
 * match and `docId` is read back from the stored frontmatter.
 */

/** Escapes LIKE wildcards so user input matches literally. */
function escapeLike(input: string): string {
  return input.replace(/[\\%_]/g, (ch) => `\\${ch}`);
}

/** SQL for the corpus document id; falls back to the uppercased slug. */
const docIdSql = sql<string>`coalesce(${documents.frontmatter}->>'id', upper(${documents.slug}))`;

/** Shared select set for DocumentSummary rows (also used by search). */
export const summaryColumns = {
  id: documents.id,
  docId: docIdSql,
  slug: documents.slug,
  docType: documents.docType,
  title: documents.title,
  path: documents.path,
  status: documents.status,
  version: sql<string | null>`${documents.frontmatter}->>'version'`,
  owner: sql<string | null>`${documents.frontmatter}->>'owner'`,
  tags: sql<unknown>`coalesce(${documents.frontmatter}->'tags', '[]'::jsonb)`,
  updatedAt: documents.updatedAt
};

export type SummaryRow = {
  id: string;
  docId: string;
  slug: string;
  docType: string;
  title: string;
  path: string;
  status: string;
  version: string | null;
  owner: string | null;
  tags: unknown;
  updatedAt: Date;
};

export function toSummary(row: SummaryRow): DocumentSummary {
  return {
    id: row.id,
    docId: row.docId,
    slug: row.slug,
    docType: docTypeSchema.parse(row.docType),
    title: row.title,
    path: row.path,
    status: row.status,
    version: row.version,
    owner: row.owner,
    tags: Array.isArray(row.tags) ? row.tags.filter((t): t is string => typeof t === "string") : [],
    updatedAt: row.updatedAt.toISOString()
  };
}

function listConditions(query: DocumentListQuery): SQL | undefined {
  const conditions: SQL[] = [];
  if (query.type) {
    conditions.push(eq(documents.docType, query.type));
  }
  if (query.q) {
    const needle = `%${escapeLike(query.q)}%`;
    // Title match OR id match — slug is lowercase(id), so ILIKE on slug is a
    // case-insensitive search over document ids (ADR-0002).
    const qCondition = or(ilike(documents.title, needle), ilike(documents.slug, needle));
    if (qCondition) conditions.push(qCondition);
  }
  return conditions.length > 0 ? and(...conditions) : undefined;
}

/** Lists documents for the Explorer: filter by type, search title/id, paginate. */
export async function listDocuments(db: Db, query: DocumentListQuery): Promise<DocumentList> {
  const where = listConditions(query);

  const [rows, totals] = await Promise.all([
    db
      .select(summaryColumns)
      .from(documents)
      .where(where)
      .orderBy(asc(documents.slug))
      .limit(query.limit)
      .offset(query.offset),
    db.select({ total: sql<number>`count(*)::int` }).from(documents).where(where)
  ]);

  return {
    documents: rows.map(toSummary),
    total: totals[0]?.total ?? 0,
    limit: query.limit,
    offset: query.offset
  };
}

/**
 * Loads one document by slug with its relationships:
 * outgoing author-curated references (resolved target or dangling) and
 * incoming backlinks. Returns undefined when the slug is unknown.
 */
export async function getDocumentBySlug(db: Db, slug: string): Promise<DocumentDetail | undefined> {
  const rows = await db
    .select({
      ...summaryColumns,
      frontmatter: documents.frontmatter,
      bodyMd: documents.bodyMd
    })
    .from(documents)
    .where(eq(documents.slug, slug.toLowerCase()))
    .limit(1);
  const row = rows[0];
  if (!row) return undefined;

  const target = alias(documents, "target");
  const outgoingRows = await db
    .select({
      targetRef: documentLinks.targetRef,
      targetDocId: sql<string | null>`${target.frontmatter}->>'id'`,
      targetSlug: target.slug,
      targetTitle: target.title,
      targetDocType: target.docType
    })
    .from(documentLinks)
    .leftJoin(target, eq(documentLinks.targetId, target.id))
    .where(eq(documentLinks.sourceId, row.id))
    .orderBy(asc(documentLinks.targetRef));

  const source = alias(documents, "source");
  const incomingRows = await db
    .select({
      docId: sql<string>`coalesce(${source.frontmatter}->>'id', upper(${source.slug}))`,
      slug: source.slug,
      title: source.title,
      docType: source.docType
    })
    .from(documentLinks)
    .innerJoin(source, eq(documentLinks.sourceId, source.id))
    .where(eq(documentLinks.targetId, row.id))
    .orderBy(asc(source.slug));

  const outgoing: DocumentLink[] = outgoingRows.map((link) => ({
    targetRef: link.targetRef,
    target:
      link.targetSlug === null || link.targetTitle === null || link.targetDocType === null
        ? null
        : {
            docId: link.targetDocId ?? link.targetRef,
            slug: link.targetSlug,
            title: link.targetTitle,
            docType: docTypeSchema.parse(link.targetDocType)
          }
  }));

  const incoming: DocumentRef[] = incomingRows.map((ref) => ({
    docId: ref.docId,
    slug: ref.slug,
    title: ref.title,
    docType: docTypeSchema.parse(ref.docType)
  }));

  return {
    ...toSummary(row),
    frontmatter: row.frontmatter,
    bodyMd: row.bodyMd,
    outgoing,
    incoming
  };
}
