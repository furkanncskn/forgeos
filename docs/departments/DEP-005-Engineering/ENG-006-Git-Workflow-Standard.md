---
id: ENG-006
title: Git Workflow Standard
version: 1.0.0
status: Approved
owner: Chief Engineering Officer (CEnO)
classification: Internal
created: 2026-07-04
updated: 2026-07-04

reviewers:
  - Engineering Office
  - Architecture Office
  - DevOps Office
  - QA Office

related:
  - ENG-001
  - ENG-005
  - GOV-007

tags:
  - git
  - github
  - workflow
  - engineering
---

# Git Workflow Standard

## Executive Summary

This document defines the official Git Workflow used across ForgeOS.

Git is the organization's source of truth.

Every change shall be traceable, reviewable, reproducible and auditable.

Git history represents organizational knowledge.

---

# Purpose

Git Workflow exists to:

- Standardize collaboration
- Improve traceability
- Reduce merge conflicts
- Protect production
- Enable continuous delivery
- Improve release quality
- Preserve repository history

---

# Scope

Applies to:

- Backend Projects
- Frontend Projects
- Mobile Projects
- AI Projects
- Infrastructure
- Documentation
- Internal Tools

---

# Git Philosophy

ForgeOS follows these principles.

## Small Changes

Commit early.

Commit often.

---

## History Matters

Git history is documentation.

Never pollute it.

---

## Review Before Merge

No code reaches production without review.

---

## Protected Branches

Critical branches are immutable.

---

## Automation First

Git validates quality before humans do.

---

# Repository Structure

Every repository contains:

```
README.md

LICENSE

.gitignore

.github/

docs/

src/

tests/

scripts/

assets/
```

---

# Default Branches

Official branches:

```
main

develop
```

Protected.

Direct pushes prohibited.

---

# Branch Types

Feature

```
feature/user-authentication
```

Bug Fix

```
bugfix/payment-timeout
```

Hotfix

```
hotfix/login-crash
```

Release

```
release/v2.4.0
```

Experiment

```
experiment/new-search
```

Spike

```
spike/graphql-evaluation
```

---

# Branch Rules

Feature branches:

Created from:

develop

Merged into:

develop

Release branches:

Created from:

develop

Merged into:

main

develop

Hotfix branches:

Created from:

main

Merged into:

main

develop

---

# Commit Philosophy

Every commit shall:

Compile

Pass tests

Represent one logical change

Be reversible

Remain understandable

---

# Commit Convention

ForgeOS follows Conventional Commits.

Supported prefixes:

```
feat:

fix:

refactor:

perf:

docs:

style:

test:

build:

ci:

chore:

revert:
```

Examples:

```
feat(auth): implement refresh token rotation

fix(api): resolve pagination issue

refactor(payment): simplify retry policy

docs(architecture): update API standard

test(user): add login integration tests
```

---

# Commit Rules

Every commit shall:

Reference one concern.

Avoid unrelated changes.

Avoid generated files unless required.

Never contain secrets.

Never contain temporary debugging code.

---

# Pull Request Workflow

Every Pull Request includes:

Summary

Business Context

Architecture Impact

Testing Evidence

Screenshots (if UI)

Risk Assessment

Rollback Strategy

Linked Issue

Reviewer Assignment

---

# Reviewer Responsibilities

Reviewers validate:

Architecture

Readability

Naming

Security

Performance

Testing

Documentation

Business Logic

No reviewer shall approve code they do not understand.

---

# Merge Strategy

Preferred:

```
Squash Merge
```

Allowed:

```
Merge Commit

Rebase Merge
```

Selection depends on repository policy.

---

# Protected Branch Policy

Protected branches require:

Minimum two approvals

Passing CI

Passing Security Scan

Passing Test Suite

No unresolved conversations

Signed commits (recommended)

---

# Code Owners

Every repository defines:

```
CODEOWNERS
```

Each directory has responsible owners.

Ownership is explicit.

---

# Semantic Versioning

ForgeOS follows:

```
MAJOR.MINOR.PATCH
```

Example:

```
3.7.2
```

Major

Breaking changes.

Minor

Backward-compatible features.

Patch

Bug fixes.

---

# Release Tags

Every release shall create:

```
v1.0.0

v2.3.1

v5.0.0
```

Annotated tags preferred.

---

# Release Branch Workflow

```
develop

↓

release/vX.Y.Z

↓

QA

↓

Production

↓

main

↓

develop
```

---

# Hotfix Workflow

```
main

↓

hotfix/

↓

QA

↓

main

↓

develop
```

Hotfixes shall remain minimal.

---

# Repository Security

Repositories shall enable:

Branch Protection

Secret Scanning

Dependabot

Code Scanning

Signed Commits (recommended)

Required Reviews

---

# Git Hooks

Recommended hooks:

Pre-commit

Formatting

Linting

Unit Tests

Secret Scan

Commit Message Validation

---

# CI Integration

Every push triggers:

Restore

Build

Lint

Tests

Security Scan

Package

Artifact Generation

---

# Monorepo Standards

Monorepos shall define:

Applications

Libraries

Packages

Shared Components

Ownership

Independent Versioning Strategy

---

# Repository Documentation

Every repository includes:

README

Architecture Overview

Contribution Guide

Development Setup

Branch Strategy

Release Process

Troubleshooting

---

# AI Development

AI-generated Pull Requests shall include:

Prompt Reference

AI Version

Generated Files

Human Review

Validation Report

AI-generated commits require human approval.

---

# Mandatory Questions

Every Pull Request shall answer:

1. Why was this change made?

2. Does it follow architecture?

3. Does CI pass?

4. Are tests sufficient?

5. Does documentation change?

6. Can it be rolled back?

7. Is security preserved?

8. Does it introduce technical debt?

9. Can another engineer review it easily?

10. Is this the smallest correct change?

---

# Quality Gates

Before merge verify:

☐ CI Passed

☐ Tests Passed

☐ Security Passed

☐ Documentation Updated

☐ Review Approved

☐ Architecture Preserved

☐ No Secrets

☐ Version Updated (if required)

---

# Success Criteria

Git Workflow succeeds when:

- History remains understandable.

- Releases become predictable.

- Merge conflicts decrease.

- Rollbacks become easy.

- Collaboration scales efficiently.

---

# KPIs

Measure:

Commit Frequency

PR Review Time

Merge Success Rate

Rollback Frequency

Branch Lifetime

Deployment Frequency

Review Coverage

CI Success Rate

---

# Exit Criteria

Git Workflow is complete when:

- Pull Request merged

- Branch deleted

- Release tagged

- Documentation updated

- Work Item closed

---

# Governance

Only Engineering Leadership may:

Approve workflow changes

Approve merge policies

Approve branching strategy

Approve release strategy

---

# Engineering Notes

Git is not merely version control.

Git is institutional memory.

Protect repository history with the same discipline used to protect production systems.

---

# Implementation Notes

Future AI Engineering Agents shall automatically:

Create branches

Generate commits

Generate Pull Requests

Write release notes

Resolve simple merge conflicts

Validate CI

Generate changelogs

Recommend reviewers

Every Git operation shall remain fully traceable.

---

# AI Consumption Notes

AI Professionals shall:

Generate atomic commits.

Follow Conventional Commits.

Keep Pull Requests small.

Prefer squash merges.

Generate complete PR documentation automatically.

Git Workflow enables ForgeOS to scale engineering across thousands of human and AI contributors.

---

# References

- DEP-005 Engineering Department
- ENG-001 Engineering Workflow SOP
- ENG-005 Coding Standards
- GOV-007 Operating Principles
- Conventional Commits
- Semantic Versioning 2.0

---

# Change History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | 2026-07-04 | Initial release |