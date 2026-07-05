import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import type { DocType, FacetCount } from "@forgeos/types";

import { Snippet } from "../components/Snippet.js";
import { fetchSearch } from "../lib/api.js";
import { DOC_TYPE_LABELS, formatDate, statusClass } from "../lib/format.js";

export interface SearchPageSearch {
  q?: string;
  type?: DocType[];
  status?: string[];
  tag?: string[];
  page?: number;
}

const PAGE_SIZE = 20;

/** Knowledge Search: full-text results with facet filtering (ADR-0003). */
export function SearchPage() {
  const search = useSearch({ strict: false }) as SearchPageSearch;
  const navigate = useNavigate();
  const page = search.page ?? 1;
  const q = search.q ?? "";

  const query = useQuery({
    queryKey: ["search", q, search.type ?? null, search.status ?? null, search.tag ?? null, page],
    queryFn: () =>
      fetchSearch({
        q,
        type: search.type,
        status: search.status,
        tag: search.tag,
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE
      }),
    enabled: q.trim() !== "",
    placeholderData: keepPreviousData
  });

  const [qInput, setQInput] = useState(q);
  useEffect(() => {
    setQInput(q);
  }, [q]);
  useEffect(() => {
    const handle = setTimeout(() => {
      const next = qInput.trim() === "" ? undefined : qInput.trim();
      if (next !== search.q) {
        void navigate({
          to: "/search",
          search: (prev: Record<string, unknown>) => ({ ...prev, q: next, page: undefined })
        });
      }
    }, 300);
    return () => clearTimeout(handle);
  }, [qInput, search.q, navigate]);

  const toggle = (dimension: "type" | "status" | "tag", value: string) => {
    void navigate({
      to: "/search",
      search: (prev: Record<string, unknown>) => {
        const current = (prev[dimension] ?? []) as string[];
        const next = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
        return { ...prev, [dimension]: next.length > 0 ? next : undefined, page: undefined };
      }
    });
  };

  const total = query.data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <div className="page-head">
        <h2>Knowledge Search</h2>
        {query.data && (
          <span className="muted">
            {total} result{total === 1 ? "" : "s"} · {query.data.query.tookMs} ms
          </span>
        )}
      </div>

      <div className="toolbar">
        <input
          type="search"
          className="input"
          placeholder='Search all documents… (supports "quoted phrases" and -exclusions)'
          value={qInput}
          onChange={(e) => setQInput(e.target.value)}
          aria-label="Search documents"
          autoFocus
        />
      </div>

      {q.trim() === "" && (
        <div className="empty-state">
          Type to search all {""}documentation — titles, headings, tags and content.
        </div>
      )}

      {query.isError && (
        <div className="empty-state error-state">Search failed: {String(query.error)}</div>
      )}

      {query.data && (
        <div className="search-layout">
          <aside className="facets">
            <FacetGroup
              label="Type"
              facets={query.data.facets.types}
              selected={search.type ?? []}
              format={(v) => DOC_TYPE_LABELS[v as DocType] ?? v}
              onToggle={(v) => toggle("type", v)}
            />
            <FacetGroup
              label="Status"
              facets={query.data.facets.statuses}
              selected={search.status ?? []}
              onToggle={(v) => toggle("status", v)}
            />
            <FacetGroup
              label="Tags"
              facets={query.data.facets.tags}
              selected={search.tag ?? []}
              onToggle={(v) => toggle("tag", v)}
            />
          </aside>

          <div className="search-results">
            {query.data.results.length === 0 && (
              <div className="empty-state">No documents match “{q}” with the current filters.</div>
            )}
            {query.data.results.map((result) => (
              <article className="search-hit" key={result.document.id}>
                <div className="search-hit-head">
                  <Link
                    to="/explorer/$slug"
                    params={{ slug: result.document.slug }}
                    className="doc-id"
                  >
                    {result.document.docId}
                  </Link>
                  <Link
                    to="/explorer/$slug"
                    params={{ slug: result.document.slug }}
                    className="search-hit-title"
                  >
                    {result.document.title}
                  </Link>
                </div>
                <div className="search-hit-meta">
                  <span className="chip">{DOC_TYPE_LABELS[result.document.docType]}</span>
                  <span className={`chip ${statusClass(result.document.status)}`}>
                    {result.document.status}
                  </span>
                  <span className="muted">{formatDate(result.document.updatedAt)}</span>
                </div>
                <Snippet spans={result.snippet} />
              </article>
            ))}

            {pageCount > 1 && (
              <div className="pagination">
                <button
                  type="button"
                  className="button"
                  disabled={page <= 1}
                  onClick={() =>
                    void navigate({
                      to: "/search",
                      search: (prev: Record<string, unknown>) => ({
                        ...prev,
                        page: page > 2 ? page - 1 : undefined
                      })
                    })
                  }
                >
                  ← Previous
                </button>
                <span className="muted">
                  Page {page} of {pageCount}
                </span>
                <button
                  type="button"
                  className="button"
                  disabled={page >= pageCount}
                  onClick={() =>
                    void navigate({
                      to: "/search",
                      search: (prev: Record<string, unknown>) => ({ ...prev, page: page + 1 })
                    })
                  }
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function FacetGroup({
  label,
  facets,
  selected,
  onToggle,
  format
}: {
  label: string;
  facets: FacetCount[];
  selected: string[];
  onToggle: (value: string) => void;
  format?: (value: string) => string;
}) {
  if (facets.length === 0 && selected.length === 0) return null;
  return (
    <section className="facet-group">
      <h3>{label}</h3>
      <ul className="plain-list">
        {facets.map((facet) => (
          <li key={facet.value}>
            <label className="facet-item">
              <input
                type="checkbox"
                checked={selected.includes(facet.value)}
                onChange={() => onToggle(facet.value)}
              />
              <span className="facet-label">{format ? format(facet.value) : facet.value}</span>
              <span className="facet-count">{facet.count}</span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}
