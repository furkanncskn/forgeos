import { and, eq, inArray, ne, sql } from "drizzle-orm";

import type { RelatedDocument, RelatedQuery, RelatedReason, RelatedResponse } from "@forgeos/types";

import type { Db } from "../../db/client.js";
import { documentLinks, documentTags, documents, tags } from "../../db/schema.js";
import { summaryColumns, toSummary, type SummaryRow } from "../documents/service.js";

/**
 * Related content (ADR-0003 D6): transparent graph+facet blend. Every result
 * carries its reasons. The vector phase adds a `semantic` source into the
 * same blend — additive, not breaking.
 */
const WEIGHTS = {
  link: 3.0, // this document references the candidate
  backlink: 2.5, // the candidate references this document
  tag: 1.0, // per shared tag …
  tagCap: 3.0, // … capped
  folder: 0.5 // same nested folder (e.g. one department's documents)
} as const;

interface Candidate {
  score: number;
  reasons: Set<RelatedReason>;
}

export async function getRelatedDocuments(
  db: Db,
  slug: string,
  query: RelatedQuery
): Promise<RelatedResponse | undefined> {
  const selfRows = await db
    .select({ id: documents.id, path: documents.path })
    .from(documents)
    .where(eq(documents.slug, slug.toLowerCase()))
    .limit(1);
  const self = selfRows[0];
  if (!self) return undefined;

  const candidates = new Map<string, Candidate>();
  const add = (documentId: string, points: number, reason: RelatedReason) => {
    const existing = candidates.get(documentId) ?? { score: 0, reasons: new Set<RelatedReason>() };
    existing.score += points;
    existing.reasons.add(reason);
    candidates.set(documentId, existing);
  };

  // Outgoing links (resolved targets only) and incoming backlinks.
  const [outgoing, incoming] = await Promise.all([
    db
      .select({ id: documentLinks.targetId })
      .from(documentLinks)
      .where(and(eq(documentLinks.sourceId, self.id), sql`${documentLinks.targetId} IS NOT NULL`)),
    db
      .select({ id: documentLinks.sourceId })
      .from(documentLinks)
      .where(eq(documentLinks.targetId, self.id))
  ]);
  for (const row of outgoing) if (row.id) add(row.id, WEIGHTS.link, "link");
  for (const row of incoming) add(row.id, WEIGHTS.backlink, "backlink");

  // Shared tags: +1 per shared tag, capped.
  const sharedTagRows = await db
    .select({ id: documentTags.documentId, shared: sql<number>`count(*)::int` })
    .from(documentTags)
    .where(
      and(
        ne(documentTags.documentId, self.id),
        inArray(
          documentTags.tagId,
          db.select({ tagId: documentTags.tagId }).from(documentTags).where(eq(documentTags.documentId, self.id))
        )
      )
    )
    .groupBy(documentTags.documentId);
  for (const row of sharedTagRows) {
    add(row.id, Math.min(row.shared * WEIGHTS.tag, WEIGHTS.tagCap), "tag");
  }

  // Same nested folder — only for depth ≥ 4 paths (docs/<category>/<sub>/file),
  // i.e. department-style groupings; flat category folders would be noise.
  const dirname = self.path.slice(0, self.path.lastIndexOf("/"));
  if (dirname.split("/").length >= 3) {
    const folderRows = await db
      .select({ id: documents.id })
      .from(documents)
      .where(and(ne(documents.id, self.id), sql`${documents.path} LIKE ${`${dirname}/%`}`));
    for (const row of folderRows) add(row.id, WEIGHTS.folder, "folder");
  }

  candidates.delete(self.id);
  if (candidates.size === 0) return { related: [] };

  // Hydrate, filter by requested types, rank by blended score.
  const rows = await db
    .select(summaryColumns)
    .from(documents)
    .where(inArray(documents.id, [...candidates.keys()]));

  const related: RelatedDocument[] = rows
    .map((row) => {
      const candidate = candidates.get(row.id);
      if (!candidate) throw new Error("unreachable: hydrated a non-candidate row");
      return {
        document: toSummary(row as SummaryRow),
        score: Number(candidate.score.toFixed(3)),
        reasons: [...candidate.reasons].sort()
      };
    })
    .filter((entry) => !query.types || query.types.includes(entry.document.docType))
    .sort(
      (a, b) =>
        b.score - a.score || a.document.slug.localeCompare(b.document.slug)
    )
    .slice(0, query.limit);

  return { related };
}
