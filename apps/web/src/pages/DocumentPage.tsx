import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";

import type { DocumentDetail, DocumentRef } from "@forgeos/types";

import { Markdown } from "../components/Markdown.js";
import { ApiRequestError, fetchDocument, fetchRelated } from "../lib/api.js";
import { RoleGate } from "../lib/auth.js";
import { DOC_TYPE_LABELS, formatDate, statusClass } from "../lib/format.js";

/** Document detail: metadata, relationships and the rendered markdown body. */
export function DocumentPage() {
  const { slug } = useParams({ strict: false }) as { slug: string };
  const query = useQuery({
    queryKey: ["document", slug],
    queryFn: () => fetchDocument(slug),
    retry: (failureCount, error) =>
      !(error instanceof ApiRequestError && error.status === 404) && failureCount < 2
  });

  if (query.isPending) {
    return <div className="empty-state">Loading document…</div>;
  }
  if (query.isError) {
    const notFound = query.error instanceof ApiRequestError && query.error.status === 404;
    return (
      <div className="empty-state error-state">
        <h2>{notFound ? "Document not found" : "Failed to load document"}</h2>
        <p className="muted">{String(query.error.message)}</p>
        <Link to="/explorer">← Back to the Explorer</Link>
      </div>
    );
  }

  const doc = query.data;
  return (
    <>
      <div className="doc-breadcrumb">
        <Link to="/explorer">← Explorer</Link>
        <Link to="/explorer" search={{ type: doc.docType }}>
          {DOC_TYPE_LABELS[doc.docType]}
        </Link>
        <span className="muted">{doc.docId}</span>
      </div>

      <header className="doc-header">
        <div className="doc-title-row">
          <h2 className="doc-heading">{doc.title}</h2>
          {/* Editor+ only; editing itself ships in a later phase. */}
          <RoleGate minRole="editor">
            <button
              type="button"
              className="button button-small"
              disabled
              title="Document editing arrives in a later phase"
            >
              Edit
            </button>
          </RoleGate>
        </div>
        <div className="doc-chips">
          <span className="chip doc-id-chip">{doc.docId}</span>
          <span className="chip">{DOC_TYPE_LABELS[doc.docType]}</span>
          <span className={`chip ${statusClass(doc.status)}`}>{doc.status}</span>
          {doc.version && <span className="chip">v{doc.version}</span>}
        </div>
        <div className="doc-path muted">{doc.path}</div>
      </header>

      <div className="doc-layout">
        <article className="doc-body">
          <Markdown>{doc.bodyMd}</Markdown>
        </article>

        <aside className="doc-side">
          <MetadataPanel doc={doc} />
          <RelationshipsPanel doc={doc} />
          <RelatedPanel slug={doc.slug} />
        </aside>
      </div>
    </>
  );
}

function MetadataPanel({ doc }: { doc: DocumentDetail }) {
  const fm = doc.frontmatter;
  const classification = typeof fm.classification === "string" ? fm.classification : null;
  const created = typeof fm.created === "string" ? fm.created : null;
  const updated = typeof fm.updated === "string" ? fm.updated : null;
  const reviewers = Array.isArray(fm.reviewers)
    ? fm.reviewers.filter((r): r is string => typeof r === "string")
    : [];
  const infoType = typeof fm.type === "string" ? fm.type : null;

  return (
    <section className="panel">
      <h3>Metadata</h3>
      <dl className="meta-list">
        {doc.owner && <MetaRow label="Owner" value={doc.owner} />}
        {infoType && <MetaRow label="Kind" value={infoType} />}
        {classification && <MetaRow label="Classification" value={classification} />}
        {created && <MetaRow label="Created" value={formatDate(created)} />}
        {updated && <MetaRow label="Updated" value={formatDate(updated)} />}
        <MetaRow label="Synced" value={formatDate(doc.updatedAt)} />
      </dl>
      {reviewers.length > 0 && (
        <>
          <h4>Reviewers</h4>
          <ul className="plain-list">
            {reviewers.map((reviewer) => (
              <li key={reviewer}>{reviewer}</li>
            ))}
          </ul>
        </>
      )}
      {doc.tags.length > 0 && (
        <div className="tag-row">
          {doc.tags.map((tag) => (
            <span className="chip chip-tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="meta-row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function RelationshipsPanel({ doc }: { doc: DocumentDetail }) {
  if (doc.outgoing.length === 0 && doc.incoming.length === 0) {
    return (
      <section className="panel">
        <h3>Relationships</h3>
        <p className="muted">No references.</p>
      </section>
    );
  }
  return (
    <section className="panel">
      <h3>Relationships</h3>
      {doc.outgoing.length > 0 && (
        <>
          <h4>References</h4>
          <ul className="plain-list">
            {doc.outgoing.map((link) =>
              link.target ? (
                <li key={link.targetRef}>
                  <RefLink target={link.target} />
                </li>
              ) : (
                <li key={link.targetRef}>
                  <span className="doc-id muted" title="Referenced document does not exist yet">
                    {link.targetRef}
                  </span>{" "}
                  <span className="chip chip-dangling">dangling</span>
                </li>
              )
            )}
          </ul>
        </>
      )}
      {doc.incoming.length > 0 && (
        <>
          <h4>Referenced by</h4>
          <ul className="plain-list">
            {doc.incoming.map((ref) => (
              <li key={ref.slug}>
                <RefLink target={ref} />
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

/** Blended related-content suggestions (links + tags + folder, ADR-0003 D6). */
function RelatedPanel({ slug }: { slug: string }) {
  const related = useQuery({
    queryKey: ["related", slug],
    queryFn: () => fetchRelated(slug, 8)
  });

  if (related.isPending || related.isError || related.data.related.length === 0) return null;
  return (
    <section className="panel">
      <h3>Related</h3>
      <ul className="plain-list">
        {related.data.related.map((entry) => (
          <li key={entry.document.slug} className="related-item">
            <RefLink target={entry.document} />
            <span className="related-reasons muted">{entry.reasons.join(" · ")}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function RefLink({ target }: { target: DocumentRef }) {
  return (
    <Link to="/explorer/$slug" params={{ slug: target.slug }} className="ref-link">
      <span className="doc-id">{target.docId}</span> {target.title}
    </Link>
  );
}
