/**
 * @forgeos/markdown — shared markdown + frontmatter pipeline.
 *
 * Phase 1.5 (contract alignment): the parser implements the corpus's own
 * enterprise convention — folder-derived types, id-derived slugs, ID-based
 * references. The /docs documentation is canonical; this engine adapts to it.
 */

export { inferDocTypeFromPath } from "./infer-doc-type.js";
export { stripMarkdown } from "./strip-markdown.js";
export {
  DocumentParseError,
  extractHeadings,
  parseDocument,
  safeParseDocument,
  type ParsedDocument,
  type ParseErrorCode,
  type SafeParseDocumentResult
} from "./parse-document.js";
