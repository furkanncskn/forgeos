---
id: ADR-0003
title: Search Architecture
version: 1.0.0
status: Approved
owner: Enterprise Architecture Board
classification: Internal
created: 2026-07-05
updated: 2026-07-05

reviewers:
  - Enterprise Architecture Board
  - AI Engineering Office

related:
  - ADR-0001
  - ADR-0002

tags:
  - architecture
  - search
  - knowledge
  - ai
  - rag
---

# ADR-0003 — Search Architecture

---

# Executive Summary

ForgeOS needs Knowledge Search (ADR-0001 Phase 3) that starts as PostgreSQL
full-text search and grows into semantic and hybrid retrieval without breaking
its API. This ADR proposes a **provider-based retrieval architecture inside
the existing PostgreSQL database**: a stable `/search` contract with a
negotiated `mode` (keyword now; semantic/hybrid later), lexical retrieval via
a weighted `tsvector` generated column, future vectors via **pgvector on
chunk-level embeddings in the same database**, and **Reciprocal Rank Fusion**
when both exist. Related-content (documents, agents, prompts, workflows) is a
graph+facet feature over `document_links` and tags, upgraded — not replaced —
by embeddings later. No second search engine, no API break at any stage.

---

# Decision Information

| Field | Value |
|--------|-------|
| Decision ID | ADR-0003 |
| Title | Search Architecture |
| Category | Architecture |
| Status | Approved |
| Owner | Enterprise Architecture Board |
| Decision Date | 2026-07-05 |

---

# Business Context

- The corpus is 246 governed documents across 18 types, mirrored into
  PostgreSQL by the checksum-idempotent sync pipeline (ADR-0002). `/docs`
  stays the source of truth; search indexes are derived state, always
  rebuildable.
- ADR-0001 already reserved the design slots: a `search_tsv` generated column
  with GIN index, pgvector as a listed extension, a `document_chunks` sketch,
  and pg-boss for background jobs.
- ForgeOS is explicitly AI-native (DEC-001, README principles): search is
  also the future retrieval layer for RAG, agents and copilots — the design
  must serve both a human search bar and a machine `retrieve()` call.

---

# Problem Statement

Design one search subsystem that ships now on PostgreSQL FTS, later adds
semantic and hybrid retrieval and AI answering, and never forces an API
migration, a corpus migration, or a second datastore to get there.

---

# Decision (Proposed)

## D1 — One database, provider abstraction inside the service

Retrieval lives in a `search` module behind a `SearchProvider` interface:

```
SearchService (query planning, fusion, facets, ACL, snippets)
 ├── LexicalProvider   — Postgres FTS (MVP)
 ├── VectorProvider    — pgvector over document_chunks (future)
 └── fusion            — Reciprocal Rank Fusion when both providers run
```

Providers return `(documentId, chunkRef?, score, matchedFields)` candidates;
everything user-facing (ranking fusion, facet counts, snippet extraction,
role checks, hydration to `DocumentSummary`) happens once, in the service.
Adding the vector provider changes zero endpoint contracts.

Elasticsearch/OpenSearch/Meilisearch are rejected (see Alternatives): the
corpus is small, Postgres FTS + pgvector cover the roadmap, and a second
store reintroduces the sync-drift problem ADR-0002 just eliminated.

## D2 — Stable API with mode negotiation

`GET /api/v1/search` accepts `mode = auto | keyword | semantic | hybrid`
(default `auto`). The response always reports `modeUsed`. MVP resolves every
mode to `keyword`; when vectors land, `auto` resolves to `hybrid`. Clients
never change. Related-content is `GET /api/v1/documents/:slug/related` with a
`types` filter — “related agents/prompts/workflows” are the same endpoint
filtered by document type (everything is a typed document, ADR-0001).

## D3 — Lexical index as derived, generated state

`documents.search_tsv` is a `GENERATED ALWAYS AS (…) STORED` weighted
tsvector (title+doc id: A, tags+headings: B, body: C) with a GIN index.
Because it is generated, the existing checksum-idempotent sync IS the
incremental indexer — no new write path, no drift, rebuild = resync.
A `body_headings` column (extracted by the parse pipeline) feeds weight B.

## D4 — Chunk-level embeddings, same database (future)

Semantic search embeds **chunks, not whole documents**: a `document_chunks`
table (heading-aware splits, per-chunk checksum, `embedding vector(D)`,
model id + dimensions recorded per row). Chunks re-embed only when their
checksum changes; embedding jobs run in pg-boss with the existing sync-run
style reporting. HNSW index; cosine distance. The embedding provider is an
interface (Voyage/OpenAI/local — Anthropic's docs recommend Voyage), and the
recorded model id makes re-embedding a migration, not a redesign.

## D5 — Ranking: weighted FTS now, RRF fusion later

MVP: `websearch_to_tsquery` + `ts_rank_cd` on the weighted tsv, with three
deterministic boosts — exact document-ID match pins to top; `status:
Approved` gets a small multiplier over Draft/Deprecated; `updated` recency
breaks ties. Hybrid: fuse lexical top-K and vector top-K with **Reciprocal
Rank Fusion** (k=60) — scale-free, no score normalization across engines,
industry-standard. An optional cross-encoder re-rank slot sits after fusion.

## D6 — Related content: graph first, vectors later

`related(slug)` ranks candidates by a transparent weighted blend:
outgoing/incoming `document_links` (strongest), shared tags, same department
folder. Each result carries its `reason` (link | tag | folder | semantic).
Embeddings later add a semantic candidate source into the same blend —
additive, not breaking.

---

# Alternatives Considered

## Alternative 1 — Dedicated search engine (Elasticsearch / OpenSearch / Meilisearch / Typesense)

Advantages: best-in-class relevance tooling, typo tolerance, mature facets.

Disadvantages: second datastore to deploy/secure/back up; a second indexing
pipeline that can drift from Postgres (the exact failure class ADR-0002
removed); overkill for a few hundred to a few thousand governed documents.

Reason rejected: ADR-0001 explicitly excluded Elasticsearch from the MVP;
nothing in the roadmap needs it before the corpus grows orders of magnitude.

## Alternative 2 — Dedicated vector database (Pinecone/Qdrant/Weaviate) for semantic phase

Advantages: managed ANN performance, ecosystem tooling.

Disadvantages: same second-store drift problem, network egress of corpus
content, separate ACL model to mirror.

Reason rejected: pgvector with HNSW comfortably serves this corpus size in
the same transaction/ACL boundary. The `VectorProvider` interface keeps this
revisitable if scale demands it — that is the migration path, not a rewrite.

## Alternative 3 — Embeddings-first (skip FTS)

Advantages: one retrieval paradigm; semantically strongest.

Disadvantages: external cost/latency dependency on day one; poor exact-match
behavior for IDs (`STD-001`) which are the corpus's primary handles; loses
`websearch` operators; FTS is nearly free given `body_text` already exists.

Reason rejected: enterprise document search is dominated by known-item
lookups; lexical must exist anyway. Hybrid is the destination, FTS the base.

---

# Risk Assessment

| Risk | Impact | Mitigation |
|------|---------|------------|
| FTS relevance disappoints on vague queries | Users can't find concepts | Weighted fields + facets now; hybrid mode is the designed answer, gated on real query logs |
| Generated tsv column bloats writes | Slower sync upserts | Corpus is small; STORED generation costs pennies at 246 docs; revisit at 10k+ |
| Embedding vendor lock-in | Re-embedding cost | Model id + dims per chunk row; provider interface; chunks re-embeddable in background |
| Facet counts expensive on large filters | Slow search page | Single-pass CTE with grouped counts; cache per (q, filter) briefly if needed |
| Snippet highlighting introduces XSS | Injected HTML in UI | Snippets returned as `{text, highlight}` spans, never raw HTML (matches Markdown-renderer policy) |
| Search exposes documents beyond role | Data leak | Search runs behind viewer+ guard like all reads; future per-classification filtering hooks into the service layer once, not per provider |

---

# Consequences

Positive: no new infrastructure through the entire roadmap; indexing
correctness inherits from the proven sync pipeline; API stable from MVP to
RAG; related-content ships without any ML dependency.

Negative: Postgres FTS has no typo tolerance (mitigable later with pg_trgm
similarity fallback); hybrid quality ceiling below dedicated engines at very
large scale; RRF requires tuning K per corpus.

Long-term: `document_chunks` becomes shared infrastructure for search, RAG
and agent retrieval — one chunking policy to govern; the `retrieve()`
internal API becomes the single entry point every AI feature must use.

---

# Phase 3 Scope (on approval)

In: migration 0003 (`search_tsv`, `body_headings`, GIN), search contracts in
`@forgeos/types`, search module (service + routes + facets + snippets),
related endpoint (links+tags+folder), web Search page + ⌘K palette, tests at
all layers against the real corpus.

Out (explicitly deferred): pg-boss, document_chunks, pgvector, embeddings,
answer synthesis, query analytics.

---

# Change History

| Version | Date | Description |
|----------|------|-------------|
| 0.1.0 | 2026-07-05 | Initial proposal for review |
| 1.0.0 | 2026-07-05 | Approved by decision owner; Phase 3 implementation authorized |
