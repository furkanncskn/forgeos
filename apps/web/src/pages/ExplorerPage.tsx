import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { DOC_TYPES, type DocType } from "@forgeos/types";

import { fetchDocuments } from "../lib/api.js";
import { DOC_TYPE_LABELS, formatDate, statusClass } from "../lib/format.js";

export interface ExplorerSearch {
  type?: DocType;
  q?: string;
  page?: number;
}

const PAGE_SIZE = 50;

/** Document Explorer list: filter by type, search title/id, paginate. */
export function ExplorerPage() {
  const search = useSearch({ strict: false }) as ExplorerSearch;
  const navigate = useNavigate();
  const page = search.page ?? 1;

  const query = useQuery({
    queryKey: ["documents", search.type ?? null, search.q ?? null, page],
    queryFn: () =>
      fetchDocuments({
        type: search.type,
        q: search.q,
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE
      }),
    placeholderData: keepPreviousData
  });

  // Local input state, pushed to the URL after a short debounce.
  const [qInput, setQInput] = useState(search.q ?? "");
  useEffect(() => {
    setQInput(search.q ?? "");
  }, [search.q]);
  useEffect(() => {
    const handle = setTimeout(() => {
      const next = qInput.trim() === "" ? undefined : qInput.trim();
      if (next !== search.q) {
        void navigate({
          to: "/explorer",
          search: (prev: Record<string, unknown>) => ({ ...prev, q: next, page: undefined })
        });
      }
    }, 250);
    return () => clearTimeout(handle);
  }, [qInput, search.q, navigate]);

  const total = query.data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <div className="page-head">
        <h2>Document Explorer</h2>
        {query.data && (
          <span className="muted">
            {total} document{total === 1 ? "" : "s"}
            {search.type ? ` · ${DOC_TYPE_LABELS[search.type]}` : ""}
          </span>
        )}
      </div>

      <div className="toolbar">
        <input
          type="search"
          className="input"
          placeholder="Search by title or ID (e.g. AGENT-011)…"
          value={qInput}
          onChange={(e) => setQInput(e.target.value)}
          aria-label="Search documents"
        />
        <select
          className="select"
          value={search.type ?? ""}
          aria-label="Filter by document type"
          onChange={(e) => {
            const value = e.target.value as DocType | "";
            void navigate({
              to: "/explorer",
              search: (prev: Record<string, unknown>) => ({
                ...prev,
                type: value === "" ? undefined : value,
                page: undefined
              })
            });
          }}
        >
          <option value="">All types</option>
          {[...DOC_TYPES]
            .sort((a, b) => DOC_TYPE_LABELS[a].localeCompare(DOC_TYPE_LABELS[b]))
            .map((type) => (
              <option key={type} value={type}>
                {DOC_TYPE_LABELS[type]}
              </option>
            ))}
        </select>
      </div>

      {query.isPending && <div className="empty-state">Loading documents…</div>}
      {query.isError && (
        <div className="empty-state error-state">Failed to load documents: {String(query.error)}</div>
      )}

      {query.data && query.data.documents.length === 0 && (
        <div className="empty-state">
          No documents match
          {search.q ? ` “${search.q}”` : ""}
          {search.type ? ` in ${DOC_TYPE_LABELS[search.type]}` : ""}.
        </div>
      )}

      {query.data && query.data.documents.length > 0 && (
        <div className="table-wrap">
          <table className="doc-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Type</th>
                <th>Status</th>
                <th>Version</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {query.data.documents.map((doc) => (
                <tr key={doc.id}>
                  <td className="cell-id">
                    <Link to="/explorer/$slug" params={{ slug: doc.slug }} className="doc-id">
                      {doc.docId}
                    </Link>
                  </td>
                  <td className="cell-title">
                    <Link to="/explorer/$slug" params={{ slug: doc.slug }} className="doc-title">
                      {doc.title}
                    </Link>
                  </td>
                  <td>
                    <span className="chip">{DOC_TYPE_LABELS[doc.docType]}</span>
                  </td>
                  <td>
                    <span className={`chip ${statusClass(doc.status)}`}>{doc.status}</span>
                  </td>
                  <td className="muted">{doc.version ?? "—"}</td>
                  <td className="muted">{formatDate(doc.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {query.data && pageCount > 1 && (
        <div className="pagination">
          <button
            type="button"
            className="button"
            disabled={page <= 1}
            onClick={() =>
              void navigate({
                to: "/explorer",
                search: (prev: Record<string, unknown>) => ({ ...prev, page: page > 2 ? page - 1 : undefined })
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
                to: "/explorer",
                search: (prev: Record<string, unknown>) => ({ ...prev, page: page + 1 })
              })
            }
          >
            Next →
          </button>
        </div>
      )}
    </>
  );
}
