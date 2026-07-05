import { and, asc, desc, eq, inArray, sql, type SQL } from "drizzle-orm";

import type {
  FacetCount,
  SearchQuery,
  SearchResponse,
  SearchResult,
  SnippetSpan
} from "@forgeos/types";

import type { Db } from "../../db/client.js";
import { documentTags, documents, tags } from "../../db/schema.js";
import { summaryColumns, toSummary, type SummaryRow } from "../documents/service.js";

/**
 * Lexical search provider — PostgreSQL FTS over the generated `search_tsv`
 * column (ADR-0003 D3/D5). This module is the MVP `LexicalProvider`; when the
 * vector provider lands, fusion happens here and the route contract holds.
 */

/** Highlight delimiters for ts_headline — chosen to never occur in prose. */
const HL_START = "⟪"; // ⟪
const HL_STOP = "⟫"; // ⟫
const HEADLINE_OPTIONS =
  `StartSel=${HL_START}, StopSel=${HL_STOP}, MaxFragments=2, MaxWords=18, MinWords=8, FragmentDelimiter= … `;

/** Documents ids look like STD-001 / ADR-0002 — exact matches pin to top. */
const ID_SHAPE = /^[A-Za-z][A-Za-z0-9]{1,11}-[A-Za-z0-9][A-Za-z0-9-]*$/;

/** Sentinel that can never equal a slug (slugs are non-empty, no NUL). */
const NO_PIN = " ";

function tsQuery(q: string): SQL {
  return sql`websearch_to_tsquery('english', ${q})`;
}

/**
 * Filter conditions for a search, optionally excluding one facet dimension —
 * facet counts are computed with every filter EXCEPT their own applied.
 */
function conditions(query: SearchQuery, exclude?: "type" | "status" | "tag"): SQL {
  const parts: SQL[] = [sql`documents.search_tsv @@ ${tsQuery(query.q)}`];

  if (query.type && query.type.length > 0 && exclude !== "type") {
    parts.push(inArray(documents.docType, query.type));
  }
  if (query.status && query.status.length > 0 && exclude !== "status") {
    parts.push(inArray(documents.status, query.status));
  }
  if (query.tag && query.tag.length > 0 && exclude !== "tag") {
    const tagParams = sql.join(query.tag.map((t) => sql`${t}`), sql`, `);
    parts.push(sql`EXISTS (
      SELECT 1 FROM document_tags dt
      JOIN tags t ON t.id = dt.tag_id
      WHERE dt.document_id = ${documents.id} AND t.name IN (${tagParams})
    )`);
  }
  const combined = and(...parts);
  if (!combined) throw new Error("unreachable: search always has conditions");
  return combined;
}

/**
 * Relevance (ADR-0003 D5): weighted ts_rank_cd × governance-status boost,
 * plus a pin bonus for exact document-id queries.
 */
function scoreExpr(query: SearchQuery): SQL {
  const pinSlug = ID_SHAPE.test(query.q.trim()) ? query.q.trim().toLowerCase() : NO_PIN;
  return sql`(
    ts_rank_cd(documents.search_tsv, ${tsQuery(query.q)}) *
    CASE ${documents.status}
      WHEN 'Approved' THEN 1.0
      WHEN 'Draft' THEN 0.85
      WHEN 'Deprecated' THEN 0.6
      WHEN 'Superseded' THEN 0.6
      ELSE 0.9
    END
    + CASE WHEN ${documents.slug} = ${pinSlug} THEN 100.0 ELSE 0.0 END
  )`;
}

/** Parses ts_headline output (⟪match⟫ markers) into XSS-safe spans. */
export function parseSnippet(headline: string): SnippetSpan[] {
  const spans: SnippetSpan[] = [];
  for (const chunk of headline.split(HL_START)) {
    const stopIndex = chunk.indexOf(HL_STOP);
    if (stopIndex === -1) {
      if (chunk !== "") spans.push({ text: chunk, highlight: false });
    } else {
      const highlighted = chunk.slice(0, stopIndex);
      const rest = chunk.slice(stopIndex + HL_STOP.length);
      if (highlighted !== "") spans.push({ text: highlighted, highlight: true });
      if (rest !== "") spans.push({ text: rest, highlight: false });
    }
  }
  return spans;
}

type SearchRow = SummaryRow & {
  score: number;
  headline: string;
  matchedId: boolean;
  matchedTitle: boolean;
  matchedHeadings: boolean;
  matchedTags: boolean;
  matchedBody: boolean;
};

function toResult(row: SearchRow): SearchResult {
  const matchedFields: SearchResult["matchedFields"] = [];
  if (row.matchedId) matchedFields.push("id");
  if (row.matchedTitle) matchedFields.push("title");
  if (row.matchedHeadings) matchedFields.push("headings");
  if (row.matchedTags) matchedFields.push("tags");
  if (row.matchedBody) matchedFields.push("body");
  return {
    document: toSummary(row),
    score: Number(row.score),
    snippet: parseSnippet(row.headline),
    matchedFields
  };
}

export async function searchDocuments(db: Db, query: SearchQuery): Promise<SearchResponse> {
  const started = Date.now();
  const where = conditions(query);
  const tsq = tsQuery(query.q);

  const [rows, totals, typeFacets, statusFacets, tagFacets] = await Promise.all([
    db
      .select({
        ...summaryColumns,
        score: scoreExpr(query).as("score"),
        headline: sql<string>`ts_headline('english', ${documents.bodyText}, ${tsq}, ${HEADLINE_OPTIONS})`,
        matchedId: sql<boolean>`to_tsvector('simple', ${documents.slug}) @@ ${tsq}`,
        matchedTitle: sql<boolean>`to_tsvector('english', ${documents.title}) @@ ${tsq}`,
        matchedHeadings: sql<boolean>`to_tsvector('english', ${documents.bodyHeadings}) @@ ${tsq}`,
        matchedTags: sql<boolean>`to_tsvector('english', coalesce(${documents.frontmatter}->>'tags', '')) @@ ${tsq}`,
        matchedBody: sql<boolean>`to_tsvector('english', ${documents.bodyText}) @@ ${tsq}`
      })
      .from(documents)
      .where(where)
      .orderBy(desc(sql`score`), desc(documents.updatedAt), asc(documents.slug))
      .limit(query.limit)
      .offset(query.offset),
    db.select({ total: sql<number>`count(*)::int` }).from(documents).where(where),
    db
      .select({ value: documents.docType, count: sql<number>`count(*)::int` })
      .from(documents)
      .where(conditions(query, "type"))
      .groupBy(documents.docType)
      .orderBy(desc(sql`count(*)`), asc(documents.docType)),
    db
      .select({ value: documents.status, count: sql<number>`count(*)::int` })
      .from(documents)
      .where(conditions(query, "status"))
      .groupBy(documents.status)
      .orderBy(desc(sql`count(*)`), asc(documents.status)),
    db
      .select({ value: tags.name, count: sql<number>`count(DISTINCT ${documents.id})::int` })
      .from(documents)
      .innerJoin(documentTags, eq(documentTags.documentId, documents.id))
      .innerJoin(tags, eq(tags.id, documentTags.tagId))
      .where(conditions(query, "tag"))
      .groupBy(tags.name)
      .orderBy(desc(sql`count(DISTINCT ${documents.id})`), asc(tags.name))
      .limit(25)
  ]);

  const facet = (rows_: { value: string; count: number }[]): FacetCount[] =>
    rows_.map((r) => ({ value: r.value, count: r.count }));

  return {
    results: rows.map((row) => toResult(row as SearchRow)),
    total: totals[0]?.total ?? 0,
    limit: query.limit,
    offset: query.offset,
    facets: {
      types: facet(typeFacets),
      statuses: facet(statusFacets),
      tags: facet(tagFacets)
    },
    query: {
      q: query.q,
      mode: query.mode,
      // MVP: every mode resolves to keyword (ADR-0003 D2). When the vector
      // provider ships, `auto`/`hybrid`/`semantic` resolve differently here
      // and ONLY here — the contract does not change.
      modeUsed: "keyword",
      tookMs: Date.now() - started
    }
  };
}
