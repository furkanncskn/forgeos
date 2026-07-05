/**
 * Converts markdown to searchable plaintext, dependency-free.
 *
 * Deliberately simple for Phase 1: markdown syntax markers are removed while
 * all human-readable text (including code-fence contents) is preserved for
 * full-text search. A remark-based pipeline can replace this later without
 * changing the call site.
 */
export function stripMarkdown(md: string): string {
  let text = md;

  text = text.replace(/<!--[\s\S]*?-->/g, " "); // HTML comments
  text = text.replace(/^```[^\n]*$/gm, " "); // code-fence markers (contents kept)
  text = text.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1"); // images → alt text
  text = text.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1"); // links → link text
  text = text.replace(/^#{1,6}\s+/gm, ""); // heading markers
  text = text.replace(/^>\s?/gm, ""); // blockquote markers
  text = text.replace(/^\s*[-*+]\s+/gm, ""); // bullet list markers
  text = text.replace(/^\s*\d+\.\s+/gm, ""); // ordered list markers
  text = text.replace(/`([^`]*)`/g, "$1"); // inline code backticks
  text = text.replace(/(\*\*|__)(.*?)\1/g, "$2"); // bold
  text = text.replace(/([*_])([^*_\n]+)\1/g, "$2"); // italics
  text = text.replace(/<[^>\n]+>/g, " "); // stray inline HTML tags
  text = text.replace(/^[\s|:-]+$/gm, " "); // table rules & horizontal rules
  text = text.replace(/\|/g, " "); // table cell separators

  return text
    .replace(/[ \t]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .trim();
}
