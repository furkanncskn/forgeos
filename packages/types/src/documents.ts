import { z } from "zod";

import { docTypeSchema } from "./frontmatter.js";

/**
 * Shared contracts for the documents module (ADR-0001 §4 — documents;
 * ADR-0002 — id is the primary identity, slug = lowercase(id)).
 *
 * Phase 2 is read-only: list + detail. Write endpoints arrive with editing.
 */

/** Minimal pointer to another document, used for links/backlinks. */
export const documentRefSchema = z.object({
  /** Corpus document id, e.g. 'STD-001'. */
  docId: z.string(),
  slug: z.string(),
  title: z.string(),
  docType: docTypeSchema
});
export type DocumentRef = z.infer<typeof documentRefSchema>;

/** One row in the Explorer list. */
export const documentSummarySchema = z.object({
  /** Database uuid (stable across renames only if the path is stable). */
  id: z.string().uuid(),
  /** Corpus document id (primary identity per ADR-0002), e.g. 'AGENT-011'. */
  docId: z.string(),
  /** URL identifier, derived: lowercase(docId). */
  slug: z.string(),
  docType: docTypeSchema,
  title: z.string(),
  /** Repo-relative source path, e.g. 'docs/standards/STD-001-….md'. */
  path: z.string(),
  /** Raw corpus status vocabulary: Approved | Draft | Template | Deprecated | Superseded. */
  status: z.string(),
  version: z.string().nullable(),
  owner: z.string().nullable(),
  tags: z.array(z.string()),
  updatedAt: z.string()
});
export type DocumentSummary = z.infer<typeof documentSummarySchema>;

/** An outgoing reference from `related`/`supersedes`; target null while dangling. */
export const documentLinkSchema = z.object({
  /** The referenced document id as written by the author, e.g. 'STD-001'. */
  targetRef: z.string(),
  target: documentRefSchema.nullable()
});
export type DocumentLink = z.infer<typeof documentLinkSchema>;

/** Full payload for the document detail page. */
export const documentDetailSchema = documentSummarySchema.extend({
  /** Complete validated frontmatter, informational fields included. */
  frontmatter: z.record(z.string(), z.unknown()),
  /** Raw markdown body (rendered client-side). */
  bodyMd: z.string(),
  /** Author-curated outgoing references. */
  outgoing: z.array(documentLinkSchema),
  /** Documents whose `related`/`supersedes` point here. */
  incoming: z.array(documentRefSchema)
});
export type DocumentDetail = z.infer<typeof documentDetailSchema>;

/** Query accepted by GET /documents. `q` matches title and document id. */
export const documentListQuerySchema = z.object({
  type: docTypeSchema.optional(),
  q: z
    .string()
    .trim()
    .max(200)
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  limit: z.coerce.number().int().min(1).max(200).default(50),
  offset: z.coerce.number().int().min(0).default(0)
});
export type DocumentListQuery = z.infer<typeof documentListQuerySchema>;

export const documentListSchema = z.object({
  documents: z.array(documentSummarySchema),
  /** Total matches for the current filter, ignoring limit/offset. */
  total: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
  offset: z.number().int().nonnegative()
});
export type DocumentList = z.infer<typeof documentListSchema>;
