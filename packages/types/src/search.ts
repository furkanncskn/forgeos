import { z } from "zod";

import { documentSummarySchema } from "./documents.js";
import { docTypeSchema } from "./frontmatter.js";

/**
 * Shared contracts for the search subsystem (ADR-0003).
 *
 * The API is stable across retrieval upgrades: clients request a `mode`
 * (default `auto`) and the server reports `modeUsed`. The MVP resolves every
 * mode to `keyword`; hybrid/semantic land later without any contract change.
 */

export const SEARCH_MODES = ["auto", "keyword", "semantic", "hybrid"] as const;
export const searchModeSchema = z.enum(SEARCH_MODES);
export type SearchMode = z.infer<typeof searchModeSchema>;

/** Fastify query strings give a string for one value, an array for many. */
const stringList = z
  .union([z.string(), z.array(z.string())])
  .transform((value) => (Array.isArray(value) ? value : [value]));

const docTypeList = stringList.pipe(z.array(docTypeSchema));

/** Query accepted by GET /search. */
export const searchQuerySchema = z.object({
  q: z.string().trim().min(1).max(200),
  type: docTypeList.optional(),
  status: stringList.optional(),
  tag: stringList.optional(),
  mode: searchModeSchema.default("auto"),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0)
});
export type SearchQuery = z.infer<typeof searchQuerySchema>;

/** Snippet fragment: ordered spans, `highlight` marks query matches. Never raw HTML. */
export const snippetSpanSchema = z.object({
  text: z.string(),
  highlight: z.boolean()
});
export type SnippetSpan = z.infer<typeof snippetSpanSchema>;

export const searchResultSchema = z.object({
  document: documentSummarySchema,
  /** Relative relevance within this response — not comparable across queries. */
  score: z.number(),
  snippet: z.array(snippetSpanSchema),
  matchedFields: z.array(z.enum(["id", "title", "headings", "tags", "body"]))
});
export type SearchResult = z.infer<typeof searchResultSchema>;

export const facetCountSchema = z.object({
  value: z.string(),
  count: z.number().int().nonnegative()
});
export type FacetCount = z.infer<typeof facetCountSchema>;

export const searchResponseSchema = z.object({
  results: z.array(searchResultSchema),
  total: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
  offset: z.number().int().nonnegative(),
  /** Counts per dimension, computed with the other filters applied. */
  facets: z.object({
    types: z.array(facetCountSchema),
    statuses: z.array(facetCountSchema),
    tags: z.array(facetCountSchema)
  }),
  query: z.object({
    q: z.string(),
    mode: searchModeSchema,
    /** What actually ran — `keyword` until hybrid ships (ADR-0003 D2). */
    modeUsed: searchModeSchema,
    tookMs: z.number().nonnegative()
  })
});
export type SearchResponse = z.infer<typeof searchResponseSchema>;

// ── Related documents (ADR-0003 D6) ─────────────────────────────────────────

/** Why a document is related; `semantic` is reserved for the vector phase. */
export const RELATED_REASONS = ["link", "backlink", "tag", "folder", "semantic"] as const;
export const relatedReasonSchema = z.enum(RELATED_REASONS);
export type RelatedReason = z.infer<typeof relatedReasonSchema>;

export const relatedQuerySchema = z.object({
  /** Filter by document type, e.g. types=agent,prompt or repeated params. */
  types: z
    .union([z.string(), z.array(z.string())])
    .transform((value) => (Arrayify(value)).flatMap((v) => v.split(",")).filter((v) => v !== ""))
    .pipe(z.array(docTypeSchema))
    .optional(),
  limit: z.coerce.number().int().min(1).max(50).default(10)
});
export type RelatedQuery = z.infer<typeof relatedQuerySchema>;

function Arrayify(value: string | string[]): string[] {
  return Array.isArray(value) ? value : [value];
}

export const relatedDocumentSchema = z.object({
  document: documentSummarySchema,
  score: z.number(),
  /** Every result explains itself (ADR-0003 D6). */
  reasons: z.array(relatedReasonSchema).min(1)
});
export type RelatedDocument = z.infer<typeof relatedDocumentSchema>;

export const relatedResponseSchema = z.object({
  related: z.array(relatedDocumentSchema)
});
export type RelatedResponse = z.infer<typeof relatedResponseSchema>;
