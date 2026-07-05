import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";

import type { DocType } from "@forgeos/types";

import { fetchSearch } from "../lib/api.js";
import { DOC_TYPE_LABELS } from "../lib/format.js";

/**
 * Global ⌘K / Ctrl+K palette: quick search over the whole corpus, arrow-key
 * navigation, Enter opens the document, Esc closes.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [debounced, setDebounced] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Global shortcut.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      } else if (event.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Reset + focus when opening.
  useEffect(() => {
    if (open) {
      setInput("");
      setDebounced("");
      setActiveIndex(0);
      const handle = setTimeout(() => inputRef.current?.focus(), 0);
      return () => clearTimeout(handle);
    }
    return undefined;
  }, [open]);

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(input.trim()), 200);
    return () => clearTimeout(handle);
  }, [input]);

  const results = useQuery({
    queryKey: ["palette", debounced],
    queryFn: () => fetchSearch({ q: debounced, limit: 8 }),
    enabled: open && debounced !== ""
  });

  const hits = results.data?.results ?? [];

  const openDocument = useCallback(
    (slug: string) => {
      setOpen(false);
      void navigate({ to: "/explorer/$slug", params: { slug } });
    },
    [navigate]
  );

  const onInputKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, hits.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const hit = hits[activeIndex];
      if (hit) openDocument(hit.document.slug);
    }
  };

  if (!open) return null;

  return (
    <div className="palette-backdrop" onClick={() => setOpen(false)} role="presentation">
      <div
        className="palette"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Search documents"
      >
        <input
          ref={inputRef}
          className="palette-input"
          placeholder="Search documents…"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={onInputKeyDown}
          aria-label="Search documents"
        />
        <ul className="palette-results">
          {debounced !== "" && !results.isPending && hits.length === 0 && (
            <li className="palette-empty muted">No matches for “{debounced}”.</li>
          )}
          {hits.map((hit, index) => (
            <li key={hit.document.id}>
              <button
                type="button"
                className={`palette-item${index === activeIndex ? " palette-item-active" : ""}`}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => openDocument(hit.document.slug)}
              >
                <span className="doc-id">{hit.document.docId}</span>
                <span className="palette-title">{hit.document.title}</span>
                <span className="chip">{DOC_TYPE_LABELS[hit.document.docType as DocType]}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="palette-hint muted">↑↓ navigate · ↵ open · esc close</div>
      </div>
    </div>
  );
}
