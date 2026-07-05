import { createHash } from "node:crypto";

import { parse as parseYaml } from "yaml";

import {
  isDocIdRef,
  slugFromId,
  validateFrontmatter,
  type DocId,
  type DocType,
  type Frontmatter,
  type FrontmatterIssue
} from "@forgeos/types";

import { inferDocTypeFromPath } from "./infer-doc-type.js";
import { stripMarkdown } from "./strip-markdown.js";

/** Result of parsing one markdown file from `/docs`. */
export interface ParsedDocument {
  /** Path the file was read from, as given by the caller. */
  path: string;
  /** Folder-derived document type (frontmatter `type:` is informational only). */
  docType: DocType;
  /** Corpus document id, e.g. 'STD-001'. */
  docId: DocId;
  title: string;
  /** Derived from the id: 'AGENT-007' → 'agent-007'. */
  slug: string;
  /** Validated, normalized frontmatter (unknown fields preserved). */
  frontmatter: Frontmatter;
  /** Markdown body (everything after the frontmatter block). */
  bodyMd: string;
  /** Plaintext body for full-text search. */
  bodyText: string;
  /** Heading text only (newline-joined) — ranks above body prose (ADR-0003). */
  bodyHeadings: string;
  /** SHA-256 hex digest of the raw file content — used for change detection during sync. */
  checksum: string;
  /**
   * Outgoing ID references, taken from the frontmatter `related` and
   * `supersedes` fields (author-curated), deduped and sorted; self excluded.
   * Body text is deliberately NOT scanned: bare-ID patterns like 'ISO-27001'
   * would produce false positives.
   */
  references: DocId[];
}

/** Machine-readable failure classes for {@link DocumentParseError}. */
export type ParseErrorCode = "no-frontmatter" | "invalid";

/** Thrown by {@link parseDocument} with per-field issues for the sync report. */
export class DocumentParseError extends Error {
  constructor(
    public readonly path: string,
    public readonly issues: FrontmatterIssue[],
    public readonly code: ParseErrorCode = "invalid"
  ) {
    super(
      `Failed to parse ${path}: ${issues
        .map((i) => (i.path ? `${i.path}: ${i.message}` : i.message))
        .join("; ")}`
    );
    this.name = "DocumentParseError";
  }
}

function fail(path: string, message: string, fieldPath = "", code: ParseErrorCode = "invalid"): never {
  throw new DocumentParseError(path, [{ path: fieldPath, message }], code);
}

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

/**
 * Parses and validates one markdown document against the canonical corpus
 * convention: split the YAML frontmatter block → parse the YAML → derive the
 * type from the /docs folder → validate → derive the slug from `id` →
 * extract plaintext, checksum and ID references.
 *
 * Throws {@link DocumentParseError} on any failure — with code
 * "no-frontmatter" when the file has no leading `---` block (navigation
 * READMEs), so callers can treat that case as a skip rather than an error.
 * Use {@link safeParseDocument} for a non-throwing variant.
 */
export function parseDocument(path: string, raw: string): ParsedDocument {
  // Tolerate a UTF-8 BOM.
  const content = raw.replace(/^﻿/, "");

  // 1–2. Split and parse the YAML frontmatter.
  const match = FRONTMATTER_RE.exec(content);
  if (!match) {
    fail(
      path,
      "document has no leading '---' YAML frontmatter block",
      "",
      "no-frontmatter"
    );
  }
  let fmRaw: unknown;
  try {
    fmRaw = parseYaml(match[1] ?? "");
  } catch (err) {
    fail(path, `invalid YAML frontmatter: ${err instanceof Error ? err.message : String(err)}`);
  }
  if (typeof fmRaw !== "object" || fmRaw === null || Array.isArray(fmRaw)) {
    fail(path, "frontmatter must be a YAML mapping (key: value pairs)");
  }

  // 3. Type comes from the folder — always. Frontmatter `type:` is metadata.
  const docType = inferDocTypeFromPath(path);
  if (!docType) {
    fail(
      path,
      "cannot determine document type: the file is not inside a mapped /docs category folder",
      "type"
    );
  }

  // 4. Validate against the canonical contract (per-type registry lookup).
  const validated = validateFrontmatter(docType, fmRaw);
  if (!validated.ok) {
    throw new DocumentParseError(path, validated.issues);
  }
  const frontmatter = validated.data;

  // 5. Identity: slug derives from the document id.
  const docId = frontmatter.id;
  const slug = slugFromId(docId);

  // 6. Plaintext body for search; headings separately for weighted ranking.
  const bodyMd = content.slice(match[0].length).replace(/^\r?\n/, "");
  const bodyText = stripMarkdown(bodyMd);
  const bodyHeadings = extractHeadings(bodyMd);

  // 7. Checksum of the raw file for sync change detection.
  const checksum = createHash("sha256").update(raw, "utf8").digest("hex");

  // 8. ID references from author-curated frontmatter fields.
  const references = extractReferences(frontmatter, docId);

  return {
    path,
    docType,
    docId,
    title: frontmatter.title,
    slug,
    frontmatter,
    bodyMd,
    bodyText,
    bodyHeadings,
    checksum,
    references
  };
}

/**
 * Extracts ATX heading text (`#` … `######`), skipping fenced code blocks so
 * `# comments` inside ``` fences never rank as headings. Marker and trailing
 * closing hashes are stripped; inline emphasis/code markers are removed.
 */
export function extractHeadings(bodyMd: string): string {
  const headings: string[] = [];
  let inFence = false;
  for (const line of bodyMd.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const match = /^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/.exec(line);
    if (match?.[2]) {
      headings.push(match[2].replace(/[*_`]/g, "").trim());
    }
  }
  return headings.filter((h) => h !== "").join("\n");
}

export type SafeParseDocumentResult =
  | { ok: true; document: ParsedDocument }
  | { ok: false; path: string; code: ParseErrorCode; issues: FrontmatterIssue[] };

/** Non-throwing variant of {@link parseDocument} for batch sync runs. */
export function safeParseDocument(path: string, raw: string): SafeParseDocumentResult {
  try {
    return { ok: true, document: parseDocument(path, raw) };
  } catch (err) {
    if (err instanceof DocumentParseError) {
      return { ok: false, path, code: err.code, issues: err.issues };
    }
    throw err;
  }
}

function extractReferences(frontmatter: Frontmatter, self: DocId): DocId[] {
  const found = new Set<string>();
  // Only ID-shaped entries participate in the link graph; path-style entries
  // (e.g. 'departments/README.md') point at navigation pages, not documents.
  for (const ref of frontmatter.related ?? []) {
    if (isDocIdRef(ref)) found.add(ref);
  }
  if (frontmatter.supersedes) found.add(frontmatter.supersedes);
  found.delete(self);
  return ([...found] as DocId[]).sort();
}
