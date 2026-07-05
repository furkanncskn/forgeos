# ForgeOS

Enterprise Operating System platform powered by AI agents, workflows, prompts, standards and organizational memory.

- Canonical content lives in [`/docs`](./docs) — the source of truth (see [`CLAUDE.md`](./CLAUDE.md)).
- Architecture: [`docs/decisions/ADR-0001-mvp-architecture.md`](./docs/decisions/ADR-0001-mvp-architecture.md).
- Current state: **Phase 0** — monorepo scaffold, no business features yet.

## Repository layout

```
apps/
  api/          Fastify + TypeScript API  (http://localhost:3001)
  web/          React + Vite web UI       (http://localhost:5173)
packages/
  types/        Shared TypeScript types & Zod schemas (API ⇄ UI contract)
  markdown/     Shared markdown + frontmatter pipeline (implemented in Phase 1)
  config/       Shared tsconfig presets
infra/
  docker-compose.yml   PostgreSQL 16
docs/           ForgeOS canonical documentation (agents, prompts, workflows, …)
```

## Prerequisites

- **Node.js ≥ 20**
- **pnpm ≥ 9** — `corepack enable` (or `npm i -g pnpm`)
- **Docker** (for PostgreSQL)

## Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Build shared packages
pnpm build

# 3. Start PostgreSQL
docker compose -f infra/docker-compose.yml up -d

# 4. Apply database migrations
pnpm --filter @forgeos/api db:migrate

# 5. Ingest /docs into PostgreSQL (also runs migrations first)
pnpm --filter @forgeos/api sync

# 6. Start API + Web in dev mode (in parallel, via Turborepo)
pnpm dev
```

Then open:

- Web UI: <http://localhost:5173> — dashboard showing module placeholders and live API status
- API health: <http://localhost:3001/api/v1/health>

In dev, the web app proxies `/api/*` to the API (see `apps/web/vite.config.ts`), so no CORS or base-URL configuration is needed.

## Common commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Run API (watch mode) and Web (Vite dev server) together |
| `pnpm build` | Build all packages and apps in dependency order |
| `pnpm typecheck` | Strict TypeScript checks across the monorepo |
| `pnpm test` | Run all tests (API health tests in Phase 0) |
| `pnpm format` | Prettier over the repo |
| `pnpm --filter @forgeos/api dev` | Run only the API |
| `pnpm --filter @forgeos/web dev` | Run only the web app |
| `pnpm --filter @forgeos/api db:migrate` | Apply SQL migrations from `apps/api/drizzle/` |
| `pnpm --filter @forgeos/api db:generate` | Diff `src/db/schema.ts` into a new migration (drizzle-kit) |
| `pnpm --filter @forgeos/api sync` | CLI /docs → PostgreSQL sync with a printed report |

## Database & sync

The `/docs` folder stays the source of truth; sync mirrors it into PostgreSQL
(`documents`, `document_versions`, `tags`, `document_tags`, `document_links`,
`sync_runs`). The ingestion engine implements the corpus's own enterprise
convention (Phase 1.5): document identity is the frontmatter `id` (slug =
lowercased id), the document type derives from the `/docs` folder (frontmatter
`type:` is informational), and cross-references use IDs (`related: [STD-003]`).
Runs are idempotent — unchanged files (SHA-256 checksum) are skipped, changed
files get a new `document_versions` snapshot. Invalid files never abort a run;
they are reported per-field in `sync_runs.errors`. README files without
frontmatter are navigation aids (counted as skipped); only
`docs/templates/frontmatter/` (deprecated scaffolding) is excluded from walks.

Trigger a sync via CLI (`pnpm --filter @forgeos/api sync`) or API
(`POST /api/v1/sync/run`; history at `GET /api/v1/sync/runs`).

Integration tests need a disposable database: set `TEST_DATABASE_URL`
(see `apps/api/.env.example`), e.g. create `forgeos_test` alongside the main DB:

```bash
docker exec forgeos-postgres createdb -U forgeos forgeos_test
TEST_DATABASE_URL=postgresql://forgeos:forgeos@localhost:5432/forgeos_test pnpm --filter @forgeos/api test
```

## Environment

Copy `apps/api/.env.example` to `apps/api/.env`. Defaults match `infra/docker-compose.yml`:

```
DATABASE_URL=postgresql://forgeos:forgeos@localhost:5432/forgeos
```

The database is provisioned now so the environment is complete, but the API does not connect to it until Phase 1 (ingestion core).

## Roadmap

| Phase | Scope | Status |
| --- | --- | --- |
| 0 | Monorepo scaffold, health endpoint, dashboard shell, Postgres | ✅ this commit |
| 1 | Ingestion core: `/docs` → PostgreSQL sync, markdown pipeline | ⏳ |
| 2 | Document Explorer + auth (RBAC) | ⏳ |
| 3 | Knowledge Search (Postgres FTS) | ⏳ |
| 4 | Agent Registry, Prompt Library, Workflow Viewer | ⏳ |
| 5 | Admin Panel + hardening | ⏳ |

Full plan, schema and risks: [`docs/decisions/ADR-0001-mvp-architecture.md`](./docs/decisions/ADR-0001-mvp-architecture.md).
