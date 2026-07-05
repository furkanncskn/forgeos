import { z } from "zod";

/**
 * Canonical frontmatter contract for ForgeOS documents (Phase 1.5).
 *
 * The /docs corpus is the source of truth (CLAUDE.md rule #1) and this module
 * codifies ITS convention — the ingestion engine adapts to the documentation,
 * not the other way around:
 *
 *   id: STD-001                 ← identity; slug is derived from it
 *   title: Documentation Standard
 *   version: 1.0.0
 *   status: Approved            ← corpus vocabulary (Approved/Template/…)
 *   owner: Chief Architecture Officer (CAO)
 *   classification: Internal
 *   created: 2026-07-04
 *   updated: 2026-07-04
 *   reviewers: [...]
 *   related: [KNOW-001, STD-003]  ← ID-based cross-references
 *
 * Document TYPE is derived from the /docs folder, never from frontmatter —
 * a frontmatter `type:` field (e.g. "Specialist Agent") is informational
 * metadata and is preserved untouched via passthrough.
 */

// ── Document types (one per /docs category, folder-derived) ─────────────────

export const DOC_TYPES = [
  "agent",
  "prompt",
  "workflow",
  "standard",
  "decision",
  "memory",
  "project",
  "integration",
  "tool",
  "asset",
  "department",
  "governance",
  "knowledge",
  "operating-model",
  "playbook",
  "template",
  "company",
  "organization"
] as const;

export const docTypeSchema = z.enum(DOC_TYPES);
export type DocType = z.infer<typeof docTypeSchema>;

// ── Field primitives ────────────────────────────────────────────────────────

/**
 * Corpus document ID, e.g. STD-001, AGENT-007, ADR-0001, CMP-README.
 * Uppercase prefix, hyphen, then a number or word segment(s).
 */
export const DOC_ID_SOURCE = "[A-Z][A-Z0-9]{1,11}-[A-Za-z0-9][A-Za-z0-9-]*";
export const docIdSchema = z
  .string()
  .regex(new RegExp(`^${DOC_ID_SOURCE}$`), "expected a document id like STD-001 or AGENT-007");
export type DocId = z.infer<typeof docIdSchema>;

/** Derives the URL/DB slug from a document id: 'AGENT-007' → 'agent-007'. */
export function slugFromId(id: string): string {
  return id.toLowerCase();
}

/**
 * Relative document path reference — the corpus also writes entries like
 * `departments/README.md` or `company/README` in `related`.
 */
export const docPathRefSchema = z
  .string()
  .regex(/^[A-Za-z0-9._][A-Za-z0-9._/-]*$/, "expected a document id or a relative doc path");

/** A `related` entry: either a document ID (STD-001) or a relative path. */
export const relatedRefSchema = z.union([docIdSchema, docPathRefSchema]);

/** True when a related entry is an ID reference (usable for link resolution). */
export function isDocIdRef(ref: string): boolean {
  return new RegExp(`^${DOC_ID_SOURCE}$`).test(ref);
}

/**
 * Dates in the corpus are usually ISO (YYYY-MM-DD) but templates legitimately
 * carry placeholders like 'YYYY-MM-DD'. Accept Date objects (YAML 1.1
 * parsers) and any non-empty string; normalize Dates to ISO strings.
 */
export const flexibleDateSchema = z
  .union([z.string().min(1), z.date()])
  .transform((value) => (value instanceof Date ? value.toISOString().slice(0, 10) : value));

// ── Canonical schema ────────────────────────────────────────────────────────
// Required: only `id` and `title` — everything else in the corpus convention
// is validated when present but never demanded, so the engine keeps accepting
// documents as the convention evolves. Unknown fields pass through untouched
// (they land in the documents.frontmatter JSONB column).

export const canonicalFrontmatterSchema = z
  .object({
    id: docIdSchema,
    title: z.string().min(1),
    version: z.string().min(1).optional(),
    status: z.string().min(1).optional(),
    owner: z.string().min(1).optional(),
    classification: z.string().min(1).optional(),
    created: flexibleDateSchema.optional(),
    updated: flexibleDateSchema.optional(),
    reviewers: z.array(z.string().min(1)).optional(),
    related: z.array(relatedRefSchema).optional(),
    supersedes: docIdSchema.nullable().optional(),
    tags: z.array(z.string().min(1)).optional()
    // NOTE: `type:` (e.g. "Specialist Agent") and any other extra fields are
    // informational and preserved via .passthrough() below.
  })
  .passthrough();

export type CanonicalFrontmatter = z.infer<typeof canonicalFrontmatterSchema>;

/** Alias kept for API stability with earlier phases. */
export type Frontmatter = CanonicalFrontmatter;

// ── Per-type registry (extension point) ─────────────────────────────────────
// All types currently share the canonical schema. When a category needs
// stricter fields later (e.g. real agent definitions), specialize its entry
// here — validateFrontmatter callers are unaffected.

export const frontmatterSchemas = {
  agent: canonicalFrontmatterSchema,
  prompt: canonicalFrontmatterSchema,
  workflow: canonicalFrontmatterSchema,
  standard: canonicalFrontmatterSchema,
  decision: canonicalFrontmatterSchema,
  memory: canonicalFrontmatterSchema,
  project: canonicalFrontmatterSchema,
  integration: canonicalFrontmatterSchema,
  tool: canonicalFrontmatterSchema,
  asset: canonicalFrontmatterSchema,
  department: canonicalFrontmatterSchema,
  governance: canonicalFrontmatterSchema,
  knowledge: canonicalFrontmatterSchema,
  "operating-model": canonicalFrontmatterSchema,
  playbook: canonicalFrontmatterSchema,
  template: canonicalFrontmatterSchema,
  company: canonicalFrontmatterSchema,
  organization: canonicalFrontmatterSchema
} as const satisfies Record<DocType, z.ZodTypeAny>;

// ── Validation helper (API unchanged since Phase 1 Step 2) ──────────────────

export interface FrontmatterIssue {
  /** Dotted path to the offending field, empty string for document-level issues. */
  path: string;
  message: string;
}

export type ValidateFrontmatterResult =
  | { ok: true; data: Frontmatter }
  | { ok: false; issues: FrontmatterIssue[] };

/**
 * Validates a raw frontmatter object against the schema for `type`.
 * Never throws — invalid input returns `{ ok: false, issues }` so the sync
 * pipeline can report per-file, per-field errors without aborting a run.
 */
export function validateFrontmatter(type: DocType, frontmatter: unknown): ValidateFrontmatterResult {
  const schema = frontmatterSchemas[type];
  const result = schema.safeParse(frontmatter);
  if (result.success) {
    return { ok: true, data: result.data as Frontmatter };
  }
  return {
    ok: false,
    issues: result.error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message
    }))
  };
}
