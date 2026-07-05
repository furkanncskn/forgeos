import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders a document body (GitHub-flavored markdown: tables, task lists,
 * strikethrough). Raw HTML in documents is NOT rendered — react-markdown
 * skips it by default, which doubles as XSS protection.
 */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
