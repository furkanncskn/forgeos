---
id: ADR-0001
title: ForgeOS MVP Architecture
version: 1.0.0
status: Approved
owner: Architecture Office
classification: Internal
created: 2026-07-04
updated: 2026-07-04
---

# ForgeOS — MVP Architecture Proposal

**Document:** ADR-0001 / MVP Architecture
**Status:** Proposed
**Date:** 2026-07-04
**Author:** Claude (with Furkan)

---

## 0. Analysis of the current repository

The repository today contains `CLAUDE.md` plus an empty-but-deliberate taxonomy under `/docs`. That taxonomy **is** the domain model — it tells us exactly what ForgeOS manages:

| Docs folder | Domain concept | MVP surface |
|---|---|---|
| `agents/` | AI agent definitions | **Agent Registry** |
| `prompts/` | Reusable prompts | **Prompt Library** |
| `workflows/` | Business/agent workflows | **Workflow Viewer** |
| `standards/`, `governance/`, `decisions/`, `playbooks/`, `templates/` | Rules & reusable process assets | **Document Explorer** |
| `knowledge/`, `memory/` | Organizational memory | **Knowledge Search** |
| `company/`, `organization/`, `departments/`, `projects/` | Org structure & context | Document Explorer (org section) |
| `integrations/`, `tools/` | External systems & tooling | Post-MVP (registry stub only) |
| `operating-system/` | ForgeOS meta-docs | Document Explorer |
| `assets/` | Images/files | Static asset serving |

Two architectural conclusions follow directly from this:

1. **Docs-as-source-of-truth (CLAUDE.md rule #1).** The filesystem `/docs` tree remains canonical. The MVP should *ingest and index* markdown documents into a database rather than replace them. A sync pipeline (git/folder → DB) is a first-class component, not an afterthought. Editing in the UI writes back to markdown files, keeping git as the audit trail.
2. **Everything is a typed document.** Agents, prompts, workflows and standards are all markdown files with structured frontmatter. The platform is a *typed document system* with specialized views per type — which dramatically simplifies the MVP: one ingestion pipeline, one storage model, N renderers.

---

## 1. Recommended tech stack

Per CLAUDE.md rule #6 (TypeScript, Node.js, React, PostgreSQL) — no reason to deviate.

| Layer | Choice | Why |
|---|---|---|
| Language | **TypeScript** (strict, end-to-end) | One language across API, UI, shared types |
| Monorepo | **pnpm workspaces + Turborepo** | Shared packages (`types`, `schemas`) between apps with fast builds |
| Web UI | **React 18 + Vite + TanStack Router/Query** | SPA is sufficient for an internal tool; Vite keeps DX simple; TanStack Query handles all server state |
| UI kit | **Tailwind CSS + shadcn/ui** | Enterprise-grade look fast, fully ownable components |
| API | **Node.js + Fastify** | Fast, TypeScript-first, schema-driven (JSON Schema per route → free OpenAPI docs) |
| Contract | **Zod schemas in a shared package** + OpenAPI generation | Single source of validation for API and UI forms |
| Database | **PostgreSQL 16** | Relational core + `JSONB` for frontmatter + built-in **full-text search** (`tsvector`) + **pgvector** extension for semantic search later — one database covers everything in the MVP |
| ORM / migrations | **Drizzle ORM + drizzle-kit** | Type-safe SQL, plain-SQL escape hatch, simple migrations |
| Markdown processing | **unified/remark + gray-matter** | Parse markdown + YAML frontmatter during ingestion |
| Workflow rendering | **Mermaid** (embedded in markdown) + **React Flow** for structured workflow definitions | Viewer only in MVP — no execution engine |
| Auth | **Email + password w/ Lucia-style sessions**, RBAC roles (`admin`, `editor`, `viewer`) | Self-contained for MVP; swap to SSO/OIDC post-MVP |
| Background jobs | **pg-boss** (Postgres-backed queue) | Doc sync & indexing jobs without adding Redis |
| Testing | **Vitest** (unit) + **Playwright** (e2e) + **Supertest** (API) | CLAUDE.md rule #7: every feature ships with tests |
| Deployment | **Docker Compose** (api, web, postgres) | Single-command self-host; cloud-agnostic |

**Deliberately excluded from MVP:** microservices, Redis, Elasticsearch, an agent execution runtime, LLM orchestration. The MVP is the *system of record*; execution comes in phase 2 on top of clean data.

---

## 2. Folder structure

```
forgeos/
├── CLAUDE.md
├── docs/                        # ← canonical content (unchanged, source of truth)
│   ├── agents/ ... workflows/   #    existing taxonomy
├── apps/
│   ├── api/                     # Fastify API
│   │   ├── src/
│   │   │   ├── modules/         # one folder per API module (see §4)
│   │   │   │   ├── auth/
│   │   │   │   ├── documents/
│   │   │   │   ├── agents/
│   │   │   │   ├── prompts/
│   │   │   │   ├── workflows/
│   │   │   │   ├── search/
│   │   │   │   ├── sync/
│   │   │   │   └── admin/
│   │   │   ├── db/              # drizzle schema, migrations, seed
│   │   │   ├── jobs/            # pg-boss workers (sync, indexing)
│   │   │   ├── lib/             # markdown pipeline, frontmatter parsing
│   │   │   ├── plugins/         # fastify plugins (auth, error, openapi)
│   │   │   └── server.ts
│   │   └── test/
│   └── web/                     # React SPA
│       ├── src/
│       │   ├── routes/          # TanStack Router file routes (see §5)
│       │   ├── features/        # explorer/, agents/, prompts/, workflows/,
│       │   │                    # search/, admin/, auth/
│       │   ├── components/      # shared UI (shadcn-based)
│       │   ├── lib/             # api client (generated from OpenAPI), utils
│       │   └── main.tsx
│       └── test/
├── packages/
│   ├── types/                   # shared TS types & Zod schemas (doc types,
│   │                            # frontmatter contracts, API DTOs)
│   ├── markdown/                # shared remark pipeline + frontmatter specs
│   └── config/                  # eslint, tsconfig, prettier presets
├── infra/
│   ├── docker-compose.yml
│   └── Dockerfile.api / Dockerfile.web
├── turbo.json
└── pnpm-workspace.yaml
```

Key idea: `packages/types` defines the **frontmatter contract for each document type** (agent, prompt, workflow, standard, decision…). Both the ingestion pipeline and the UI forms validate against the same Zod schemas — CLAUDE.md rule #4 becomes machine-enforced.

---

## 3. Database schema (PostgreSQL)

The core pattern: a generic `documents` table mirroring `/docs`, plus **typed projection tables** for the entities that need structured querying (agents, prompts, workflows).

```sql
-- ── Identity & access ────────────────────────────────────────────
users (
  id            uuid PK DEFAULT gen_random_uuid(),
  email         text UNIQUE NOT NULL,
  name          text NOT NULL,
  password_hash text NOT NULL,
  role          text NOT NULL CHECK (role IN ('admin','editor','viewer')),
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
)

sessions (
  id uuid PK, user_id uuid FK→users, expires_at timestamptz
)

-- ── Canonical document mirror of /docs ───────────────────────────
documents (
  id           uuid PK,
  path         text UNIQUE NOT NULL,          -- 'docs/agents/reviewer.md'
  doc_type     text NOT NULL,                 -- 'agent'|'prompt'|'workflow'|'standard'|
                                              -- 'decision'|'playbook'|'template'|'knowledge'|...
                                              -- (derived from folder, overridable in frontmatter)
  title        text NOT NULL,
  slug         text NOT NULL,
  frontmatter  jsonb NOT NULL DEFAULT '{}',
  body_md      text NOT NULL,                 -- raw markdown body
  body_text    text NOT NULL,                 -- stripped plaintext for search
  search_tsv   tsvector GENERATED ALWAYS AS
                 (setweight(to_tsvector('simple', title),'A') ||
                  setweight(to_tsvector('simple', body_text),'B')) STORED,
  status       text NOT NULL DEFAULT 'active', -- 'active'|'draft'|'archived'
  checksum     text NOT NULL,                  -- change detection during sync
  created_by   uuid FK→users NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (doc_type, slug)
)
CREATE INDEX documents_search_idx ON documents USING gin(search_tsv);
CREATE INDEX documents_type_idx   ON documents(doc_type);

document_versions (
  id uuid PK, document_id uuid FK→documents,
  version int NOT NULL, frontmatter jsonb, body_md text,
  changed_by uuid FK→users NULL, changed_at timestamptz DEFAULT now(),
  change_note text,
  UNIQUE (document_id, version)
)

tags (
  id uuid PK, name text UNIQUE NOT NULL
)
document_tags (
  document_id uuid FK→documents, tag_id uuid FK→tags,
  PRIMARY KEY (document_id, tag_id)
)

-- Cross-references between docs (agent → workflow, workflow → standard…)
document_links (
  source_id uuid FK→documents, target_id uuid FK→documents,
  link_type text NOT NULL DEFAULT 'references',
  PRIMARY KEY (source_id, target_id, link_type)
)

-- ── Typed projections (populated from frontmatter at sync time) ──
agents (
  id            uuid PK,
  document_id   uuid UNIQUE FK→documents,
  name          text NOT NULL,
  purpose       text,
  department    text,                          -- links to docs/departments
  model         text,                          -- suggested model
  capabilities  jsonb DEFAULT '[]',            -- ["code-review", ...]
  input_schema  jsonb, output_schema jsonb,
  status        text NOT NULL DEFAULT 'active' -- 'active'|'deprecated'|'draft'
)

prompts (
  id            uuid PK,
  document_id   uuid UNIQUE FK→documents,
  name          text NOT NULL,
  use_case      text,
  variables     jsonb DEFAULT '[]',            -- [{name,description,required}]
  agent_id      uuid FK→agents NULL,           -- optional owning agent
  version_label text DEFAULT 'v1'
)

workflows (
  id            uuid PK,
  document_id   uuid UNIQUE FK→documents,
  name          text NOT NULL,
  trigger       text,                          -- what starts it
  definition    jsonb,                         -- {steps:[{id,name,type,agent_id?,next[]}]}
  diagram_md    text                           -- optional mermaid source
)

workflow_steps (                               -- flattened for querying "which
  id uuid PK, workflow_id uuid FK→workflows,   --  workflows use agent X?"
  step_order int, name text, step_type text,   -- 'agent'|'human'|'decision'|'tool'
  agent_id uuid FK→agents NULL,
  prompt_id uuid FK→prompts NULL,
  config jsonb DEFAULT '{}'
)

-- ── Ops ──────────────────────────────────────────────────────────
sync_runs (
  id uuid PK, started_at timestamptz, finished_at timestamptz,
  status text,                                 -- 'running'|'ok'|'failed'
  files_seen int, files_changed int, errors jsonb DEFAULT '[]'
)

audit_log (
  id uuid PK, user_id uuid FK→users NULL, action text NOT NULL,
  entity_type text, entity_id uuid, detail jsonb, at timestamptz DEFAULT now()
)

-- Post-MVP ready: add pgvector
-- document_chunks (id, document_id, chunk_text, embedding vector(1536))
```

Why this shape works: the Document Explorer, Knowledge Search and version history all run off `documents` alone; the Agent Registry, Prompt Library and Workflow Viewer get real relational queries (e.g. *"all workflows using agent X"*, *"prompts owned by the finance department's agents"*) via the projection tables; and nothing is lost if a doc type gains fields later — they live in `frontmatter jsonb` until they earn a column.

---

## 4. API modules (Fastify, `/api/v1`)

| Module | Endpoints | Notes |
|---|---|---|
| **auth** | `POST /auth/login`, `POST /auth/logout`, `GET /auth/me` | Session cookie; RBAC middleware exported to all modules |
| **documents** | `GET /documents` (filter: type/tag/status/path-prefix, paginate) · `GET /documents/:id` · `GET /documents/:id/versions` · `PUT /documents/:id` (editor+) · `POST /documents` (editor+) · `GET /documents/tree` (folder tree for Explorer) | Writes update DB **and** write markdown back to `/docs` (docs stay canonical) |
| **agents** | `GET /agents` (filter: department/status/capability) · `GET /agents/:id` (incl. linked prompts & workflows) · `POST/PUT` (editor+) | Registry views over projection table |
| **prompts** | `GET /prompts` (filter: agent/use-case/tag) · `GET /prompts/:id` · `POST /prompts/:id/render` (fill variables → final prompt text, copy-ready) · `POST/PUT` (editor+) | `render` is the MVP's most-used endpoint in practice |
| **workflows** | `GET /workflows` · `GET /workflows/:id` (definition + steps + resolved agents/prompts) · `GET /workflows/:id/graph` (nodes/edges JSON for React Flow) | Viewer-only in MVP |
| **search** | `GET /search?q=&type=&tag=` — Postgres FTS with weighted ranking, snippet highlighting (`ts_headline`), grouped-by-type results | One endpoint powers global search bar + Knowledge Search page |
| **sync** | `POST /sync/run` (admin) · `GET /sync/runs` · `GET /sync/runs/:id` | Walks `/docs`, parses frontmatter, upserts by checksum, rebuilds projections & links; also runs on schedule via pg-boss |
| **admin** | `GET/POST/PUT /admin/users` · `GET /admin/audit-log` · `GET /admin/stats` (doc counts by type, last sync, orphan links) | Admin role only |
| *(cross-cutting)* | `GET /health`, `GET /openapi.json` | Docker healthcheck + generated client for the web app |

All request/response bodies validated by shared Zod schemas; OpenAPI spec generated from routes; the web app's API client is generated from that spec — the contract can't drift.

---

## 5. UI pages (React SPA)

```
/login                         Sign in

/                              Dashboard: doc counts by type, recent changes,
                               last sync status, quick search

/explorer                      DOCUMENT EXPLORER — /docs tree in left sidebar,
/explorer/*path                rendered markdown (with mermaid) on the right,
                               frontmatter panel, version history drawer,
                               edit mode for editors (writes back to file)

/agents                        AGENT REGISTRY — card/table grid, filter by
                               department, capability, status
/agents/:slug                  Agent detail: purpose, capabilities, I/O schema,
                               linked prompts, "used in workflows" list

/prompts                       PROMPT LIBRARY — searchable list, filter by
                               agent / use case / tag
/prompts/:slug                 Prompt detail: variables table, live variable
                               fill-in form → rendered prompt with copy button,
                               version history

/workflows                     WORKFLOW VIEWER — list with trigger + step count
/workflows/:slug               Interactive graph (React Flow) or mermaid render;
                               click a step → side panel with its agent/prompt;
                               linked standards & decisions

/search?q=                     KNOWLEDGE SEARCH — global results grouped by
                               type, highlighted snippets, facet filters
                               (also reachable via ⌘K command palette anywhere)

/admin                         ADMIN PANEL
/admin/users                   User & role management
/admin/sync                    Sync status, run-now, per-run error report
/admin/audit                   Audit log
```

Shared chrome: left nav (Explorer / Agents / Prompts / Workflows / Search / Admin), global ⌘K search palette, role-aware rendering (viewers never see edit buttons).

---

## 6. First implementation plan

Six phases, each independently shippable, each ending with tests + docs (CLAUDE.md rule #7).

**Phase 0 — Foundation (repo & infra)**
Scaffold pnpm/Turborepo monorepo, `packages/types` + `packages/config`, Fastify skeleton with health route + OpenAPI, Vite React skeleton with router + layout, docker-compose with Postgres, CI (lint, typecheck, test). *Exit: `docker compose up` serves a hello-world UI talking to the API.*

**Phase 1 — Ingestion core (the heart of the system)**
Drizzle schema + migrations for `documents`, `document_versions`, `tags`, `document_links`, `sync_runs`. Markdown pipeline (`packages/markdown`): frontmatter parsing, doc-type inference from folder, checksum, plaintext extraction, link extraction. Sync module + pg-boss job. Seed `/docs` with 2–3 real example files per type to develop against. *Exit: `POST /sync/run` faithfully mirrors `/docs` into Postgres, idempotently.*

**Phase 2 — Document Explorer + Auth**
Auth module (login, sessions, RBAC), documents module (tree, get, versions), Explorer UI (tree, markdown + mermaid rendering, frontmatter panel), read-only first, then editing with write-back-to-file and version snapshots. *Exit: a viewer can browse all of `/docs` in the browser; an editor can edit a doc and see the change on disk.*

**Phase 3 — Knowledge Search**
FTS indexing (already generated column from Phase 1), search module with ranking + `ts_headline` snippets, Search page + global ⌘K palette. *Exit: any doc findable in <1s by title or content, filtered by type.*

**Phase 4 — Typed registries**
Frontmatter contracts (Zod) for agent/prompt/workflow; projection builders in sync; agents, prompts (incl. `render`), workflows (incl. `graph`) modules; Agent Registry, Prompt Library, Workflow Viewer pages with cross-linking. *Exit: from a workflow step you can click through to its agent and copy its rendered prompt.*

**Phase 5 — Admin Panel + hardening**
User management UI, sync dashboard, audit log (wired into all writes), stats endpoint + dashboard page, Playwright e2e for the 5 core journeys, deployment docs. *Exit: MVP demo-ready.*

**Risks & mitigations**

| Risk | Mitigation |
|---|---|
| Frontmatter schemas ossify too early | Keep projections rebuildable from `frontmatter jsonb`; only promote fields to columns when queried |
| Two-way sync conflicts (UI edit vs. file edit) | Checksums + last-write-wins with version snapshots in MVP; git-backed merge post-MVP |
| Empty `/docs` makes everything abstract | Phase 1 includes authoring real seed documents — this doubles as validating the templates |
| Scope creep toward agent *execution* | Explicit non-goal for MVP; the schema (`agents`, `workflow_steps`) is designed so an execution engine bolts on without remodeling |

**Immediate next steps:** approve stack & schema → write the frontmatter template for each doc type into `docs/templates/` → Phase 0 scaffold.
