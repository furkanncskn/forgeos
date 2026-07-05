# Frontmatter templates (canonical ForgeOS dialect)

Authoring aids for new documents. Copy the template for your category into its
target `/docs` folder, replace the placeholders, and delete the instruction
comment at the top. This folder itself is **excluded from ingestion** — these
files are scaffolding, not documentation.

The dialect below is ratified by **ADR-0002 (Documentation Contract
Alignment)**: the `/docs` corpus convention is canonical, and the ingestion
engine (`@forgeos/types` + `@forgeos/markdown`) adapts to it.

## Canonical fields

| Field | Rule |
| --- | --- |
| `id` | **Primary identity.** Uppercase prefix + `-` + number/word, e.g. `STD-001`, `AGENT-011`, `ADR-0002`. Globally unique across all of `/docs`; never reused. Required. |
| `title` | Human-readable document title. Required. |
| `version` | Semantic version of the document, e.g. `1.0.0`. |
| `status` | `Approved` \| `Draft` \| `Template` \| `Deprecated` \| `Superseded`. |
| `owner` | Accountable role or office, e.g. `Enterprise Architecture Board`. |
| `classification` | e.g. `Internal`. |
| `created` / `updated` | ISO dates (`YYYY-MM-DD`). |
| `reviewers` | List of reviewing offices/roles. |
| `related` | List of **ID references** to other documents, e.g. `[STD-001, AGENT-011, TPL-012]`. |
| `supersedes` | ID of the document this one replaces, if any. |
| `tags` | Lowercase keywords. |

Only `id` and `title` are mandatory; everything else is validated when present.
Unknown extra fields are preserved as informational metadata.

## Derived — never authored

| Value | Derivation |
| --- | --- |
| Document **type** | The folder directly under `docs/` (e.g. `docs/standards/…` → `standard`). A frontmatter `type:` field (e.g. `type: Specialist Agent`) is informational metadata only. |
| **Slug** | Lowercased `id` (`AGENT-011` → `agent-011`). Never written by authors. |

## Cross-references

Reference other documents **by ID** in `related` (e.g. `STD-001`). The sync
pipeline resolves IDs into `document_links` rows; references to documents that
do not exist yet are kept as dangling links and reported in sync diagnostics.

## Templates in this folder

| Template | ID prefix | Target folder |
| --- | --- | --- |
| `agent.md` | `AGENT` | `docs/agents/` |
| `prompt.md` | `PROMPT` | `docs/prompts/` |
| `workflow.md` | `WF` | `docs/workflows/` |
| `standard.md` | `STD` | `docs/standards/` |
| `decision.md` | `ADR` / `DEC` | `docs/decisions/` |
| `memory.md` | `MEM` | `docs/memory/` |
| `project.md` | `PROJ` | `docs/projects/` |
| `integration.md` | `INT` | `docs/integrations/` |
| `tool.md` | `TOOL` | `docs/tools/` |
| `asset.md` | `AST` | `docs/assets/` |
| `department.md` | `DEP` (+ dept codes) | `docs/departments/<DEP-XXX-Name>/` |
| `governance.md` | `GOV` | `docs/governance/` |
| `knowledge.md` | `KNOW` | `docs/knowledge/` |
| `operating-model.md` | `OS` | `docs/operating-system/` |
| `playbook.md` | `PB` | `docs/playbooks/` |
| `template.md` | `TPL` | `docs/templates/` |
| `company.md` | `CMP` | `docs/company/` |
| `organization.md` | `ORG` | `docs/organization/` |

`README.md` files inside category folders are ingested when they carry a
frontmatter block with real content; frontmatter-less READMEs are treated as
navigation aids and skipped (never errors).
