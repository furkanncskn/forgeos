---
id: ADR-0002
title: Documentation Contract Alignment
version: 1.0.0
status: Approved
owner: Enterprise Architecture Board
classification: Internal
created: 2026-07-05
updated: 2026-07-05

reviewers:
  - Enterprise Architecture Board
  - Executive Governance Council

related:
  - ADR-0001
  - DEC-001
  - DEC-002
  - DEC-010

tags:
  - decision
  - architecture
  - governance
  - documentation
  - ingestion
---

# ADR-0002 — Documentation Contract Alignment

---

# Executive Summary

The ForgeOS repository contains two incompatible frontmatter dialects: the **enterprise dialect** used by all ~214 real content files under `/docs` (keyed by `id`, `version`, `status: Approved`, `related: [STD-001, …]`), and the **code contract** defined in `packages/types/src/frontmatter.ts` plus `docs/templates/frontmatter/*` (keyed by `type`, `slug`, `status: active`, `related: [agent/code-reviewer, …]`). Running the implemented sync pipeline against the real corpus would reject effectively every document.

This ADR resolves the conflict: **the existing enterprise dialect in `/docs` is canonical**. The code contract shall be rewritten to match the corpus (Option A). Documents are never rewritten to satisfy code; code is rewritten to satisfy documents. This upholds CLAUDE.md rule #1 — `/docs` is the source of truth.

---

# Decision Information

| Field | Value |
|--------|-------|
| Decision ID | ADR-0002 |
| Title | Documentation Contract Alignment |
| Category | Architecture |
| Status | Approved |
| Owner | Enterprise Architecture Board |
| Decision Date | 2026-07-05 |
| Effective Date | 2026-07-05 |
| Review Date | 2026-10-05 |

---

# Business Context

- ADR-0001 established ForgeOS as a typed document system: one ingestion pipeline mirrors `/docs` into PostgreSQL, and typed views (Agent Registry, Prompt Library, Workflow Viewer) project from it.
- Phase 0 (scaffold) and Phase 1 (ingestion core) are implemented. The Zod frontmatter contracts and the frontmatter templates were authored before the real corpus existed, and the corpus was subsequently authored to enterprise documentation standards (DEC-001, DEC-002) without reference to those contracts.
- The corpus is large (~214 content files across 18 top-level folders) and internally consistent. The code contract covers only 10 document types and a different metadata vocabulary.
- No further feature work (search, registries, UI) is sound until exactly one contract governs both sides.

---

# Problem Statement

Which frontmatter dialect is authoritative — the enterprise dialect used by every real document in `/docs`, or the code contract implemented in `packages/types` — and how must identity, typing, status and cross-references be defined so that the entire existing corpus is ingestable without modification?

---

# Decision

The **existing `/docs` enterprise frontmatter dialect is canonical**. The code contract will be realigned to it (**Option A**), with the following binding rules:

1. **Identity.** `id` (e.g. `AGENT-011`, `STD-001`, `ADR-0002`) is the primary document identity.
2. **Slug.** `slug` is not authored. It is derived automatically from `id` when present, otherwise from the filename. Authored `slug` fields, if ever encountered, are ignored in favor of derivation.
3. **Document type.** The document type is derived from the folder structure under `/docs` (e.g. `docs/agents/**` → agent, `docs/decisions/**` → decision). A `type` field in frontmatter is **informational metadata only** (e.g. `type: Specialist Agent`) and never participates in type resolution or validation enums.
4. **Status vocabulary.** The supported status values are `Approved`, `Draft`, `Template`, `Deprecated`, `Superseded`. Ingestion maps these to lifecycle states; unrecognized values are reported as warnings, not rejections.
5. **Cross-references.** `related` uses ID-style references (e.g. `STD-001`, `AGENT-011`, `TPL-012`). The `type/slug` reference form defined by the old code contract is retired.
6. **Folder coverage.** All 18 existing `/docs` folders are supported document sources: `agents`, `assets`, `company`, `decisions`, `departments`, `governance`, `integrations`, `knowledge`, `memory`, `operating-system`, `organization`, `playbooks`, `projects`, `prompts`, `standards`, `templates`, `tools`, `workflows`.
7. **READMEs and templates.** `README.md` files and template documents are ingestable when they contain real content. They are typed by their folder and flagged (e.g. via derived metadata) as readme/template rather than excluded.

---

# Decision Rationale

- **Docs are the source of truth (CLAUDE.md rule #1).** When code and documents disagree, the code is wrong by definition. Rewriting 214 governed, reviewed documents to satisfy a code artifact would invert the system's core principle.
- **Cost and risk.** Realigning one Zod module and its templates is a bounded change; migrating the corpus means touching every file, re-approving governed documents, and breaking every existing `related:` reference.
- **The enterprise dialect is richer.** `id`, `version`, `classification`, `reviewers` and semantic statuses carry governance information the code dialect lacks; discarding them would lose audit and traceability value the decision registry (DEC-001) mandates.
- **Derivation beats duplication.** Deriving `slug` and document type from `id`/filename/folder removes two authored fields that could drift, shrinking the validation surface rather than growing it.
- **Corpus consistency is evidence.** All 214 files already follow the enterprise dialect; it is a proven, working standard, not a proposal.

---

# Alternatives Considered

## Alternative 1 — Option B: migrate the corpus to the code contract

Description: Rewrite all ~214 documents to use `type`/`slug`/lowercase statuses and `type/slug` references.

Advantages: no code changes; contract already has tests.

Disadvantages: violates docs-as-source-of-truth; mass rewrite of governed, approved documents; breaks all existing `related` references; loses enterprise metadata (`id`, `version`, `classification`, `reviewers`); no git history exists yet to make such a migration safely reviewable.

Reason Rejected: Inverts the system's foundational rule and carries the highest blast radius.

---

## Alternative 2 — Option C: dual-dialect support (accept both)

Description: Ingestion accepts either dialect and normalizes internally.

Advantages: nothing breaks immediately; gradual convergence possible.

Disadvantages: two contracts to maintain forever; ambiguous validation errors; templates and new documents have no single authoritative shape; complexity lands in the most critical component (ingestion).

Reason Rejected: Permanent complexity to avoid a one-time bounded fix; contradicts the "one ingestion pipeline, one storage model" principle of ADR-0001.

---

## Alternative 3 — Option D: introduce a third, new unified dialect

Description: Design a fresh frontmatter standard and migrate both code and corpus to it.

Advantages: opportunity to fix any residual design flaws.

Disadvantages: combines the costs of Options A and B; invents a new standard where an adequate one exists (CLAUDE.md rule #2).

Reason Rejected: Maximum cost, no proportional benefit.

---

# Impact Assessment

- **Architecture:** The typed-document model of ADR-0001 is unchanged; only the contract layer moves. `documents.slug` becomes derived; `documents.doc_type` derivation now covers 18 folders.
- **Engineering:** `packages/types/src/frontmatter.ts`, `docs/templates/frontmatter/*`, the parse pipeline, link extraction (`DOC_REF_SOURCE`) and their test suites must be rewritten against the enterprise dialect.
- **Data:** `document_links` resolution keys on `id` instead of `type/slug`. Existing dev databases can be dropped and re-synced; no production data exists.
- **Governance:** Existing documents require no re-review — this decision explicitly ratifies their current form.
- **AI consumption:** ID-style references (`STD-001`) are stable retrieval keys for RAG and agent traversal, consistent with DEC-001's traceability principles.

---

# Risk Assessment

| Risk | Impact | Mitigation |
|------|---------|------------|
| Corpus contains files that deviate even from the enterprise dialect | Sync marks them invalid | Validation reports warnings with file paths; a reconciliation report is the first output of implementation, before enforcement |
| ID collisions or duplicate IDs across folders | Ambiguous identity and broken links | Uniqueness enforced at ingestion; collisions reported as errors in the sync run |
| `related` references to non-existent IDs | Dangling links | Link resolution records orphans in sync diagnostics (already planned in ADR-0001 admin stats) |
| Folder-derived typing misfits mixed-content folders (e.g. `templates/` holding agent templates) | Wrong projections | Folder is authoritative for type; template/readme flags keep projections clean |
| Status values outside the five supported terms | Ingestion rejects valid docs | Unknown statuses downgrade to warnings and ingest with status preserved verbatim |

---

# Assumptions

- The ~214-file corpus is representative; no hidden dialect variants beyond READMEs and templates.
- No external system currently consumes the old `type/slug` contract.
- Git initialization (repo governance, also in scope for M1) will precede or accompany the code realignment, so contract changes are version-controlled.

---

# Dependencies

| Dependency | Description |
|------------|-------------|
| ADR-0001 | MVP architecture; ingestion pipeline and schema this decision amends |
| DEC-001 / DEC-002 | Decision log standard and record template defining the enterprise dialect this ADR ratifies |
| Git initialization | Required so the contract rewrite is auditable (M1 scope) |

---

# Implementation Plan

| Phase | Owner | Target Date |
|--------|-------|-------------|
| M1-a: Ratify ADR-0002 (this document) | Enterprise Architecture Board | 2026-07-05 |
| M1-b: Corpus audit — validate all `/docs` files against the enterprise dialect; produce reconciliation report | Engineering | 2026-07-06 |
| M1-c: Rewrite `packages/types` contracts, templates and tests to the canonical dialect | Engineering | 2026-07-08 |
| M1-d: Update parse/sync pipeline (type-from-folder for 18 folders, slug derivation, ID link extraction) | Engineering | 2026-07-10 |
| M1-e: Full sync of real `/docs`; zero hard failures | Engineering | 2026-07-11 |

---

# Success Metrics

| KPI | Target |
|------|--------|
| Corpus ingestion success rate | 100% of real-content files ingest without hard errors |
| Contract sources of truth | Exactly 1 (shared Zod package) |
| Unresolved `related` references | Reported; 0 silently dropped |
| Documents modified to satisfy code | 0 (excluding genuine authoring defects found by the audit) |

---

# Validation Criteria

The decision will be considered successful when:

- A full sync run over the real `/docs` tree completes with zero validation failures on real-content documents.
- Every document's identity, type, slug and status in the database match the rules in this ADR.
- `related` references resolve to document IDs, with orphans surfaced in sync diagnostics.
- The old `type/slug` contract no longer exists anywhere in `packages/*` or `docs/templates/frontmatter/*`.

---

# Consequences

## Positive

- The entire existing corpus becomes ingestable without modification.
- One authoritative contract; docs-as-source-of-truth is machine-enforced in the correct direction.
- Authored metadata shrinks (`slug` and effective `type` are derived), reducing drift surface.
- Enterprise governance metadata (`version`, `classification`, `reviewers`) is preserved and queryable.

## Negative

- All existing frontmatter code, templates and tests in `packages/types` and the parse pipeline must be rewritten — sunk work is discarded.
- Folder-derived typing means moving a file changes its type; file moves become a governed operation.
- ID-style references are less self-describing than `type/slug` (readers must know `STD-001` is a standard); mitigated by registry lookups and UI resolution.

## Long-Term

- The ID scheme (`AGENT-011`, `STD-001`) becomes a permanent public identifier namespace; ID assignment discipline (uniqueness, no reuse) must be governed, eventually by tooling.
- New document types are added by adding folders plus a type mapping — a lightweight, governance-visible operation.

---

# Rollback Strategy

This is a documentation-and-contract decision with no production data. Rollback = revert the contract commits and re-sync; the corpus itself is never modified by this decision, so no document rollback is required. If the corpus audit (M1-b) reveals the enterprise dialect is materially less consistent than assessed, this ADR is amended or superseded before M1-c begins.

---

# Approval

| Role | Name | Date |
|------|------|------|
| Decision Owner | Enterprise Architecture Board | 2026-07-05 |
| Enterprise Architect | Claude (with Furkan) | 2026-07-05 |
| Executive Sponsor | Furkan Coşkun | 2026-07-05 |

---

# Related Artifacts

- ADR-0001 — MVP Architecture Proposal (amended by this decision at the contract layer)
- DEC-001 — Decision Log Standard
- DEC-002 — Enterprise Decision Record Template
- DEC-010 — Decision Registry
- `packages/types/src/frontmatter.ts` — contract module to be realigned
- `docs/templates/frontmatter/` — templates to be realigned

---

# Lessons Learned

(To be completed after M1-e: full-corpus sync.)

---

# Change History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | 2026-07-05 | Initial release — enterprise dialect ratified as canonical (Option A) |
