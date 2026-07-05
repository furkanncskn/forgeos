import type { SnippetSpan } from "@forgeos/types";

/** Renders snippet spans; matches use <mark>. Never injects HTML. */
export function Snippet({ spans }: { spans: SnippetSpan[] }) {
  if (spans.length === 0) return null;
  return (
    <p className="snippet">
      {spans.map((span, index) =>
        span.highlight ? (
          // eslint-disable-next-line react/no-array-index-key
          <mark key={index}>{span.text}</mark>
        ) : (
          // eslint-disable-next-line react/no-array-index-key
          <span key={index}>{span.text}</span>
        )
      )}
    </p>
  );
}
