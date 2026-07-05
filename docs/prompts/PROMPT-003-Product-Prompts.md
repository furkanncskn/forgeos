---
id: PROMPT-003
title: Product Prompts
version: 1.0.0
status: Approved
owner: Product Office
classification: Internal

category: Prompt Library
prompt_type: Product Management

created: 2026-07-04
updated: 2026-07-04

reviewers:
  - Product Office
  - AI Engineering Office
  - AI Governance Office
  - Enterprise Architecture Office

related:
  - PROMPT-001
  - AGENT-008
  - TPL-001
  - TPL-005
  - TPL-006

tags:
  - prompt
  - product
  - roadmap
  - backlog
  - requirements
---

# Product Prompt Library

---

# Purpose

This document contains standardized prompts for product discovery, planning, prioritization and documentation.

The prompts are designed to produce structured, implementation-ready product artifacts that align with ForgeOS product governance standards.

---

# Product Discovery Prompt

## Purpose

Transform an initial idea into a validated product opportunity.

## Prompt

```text
You are a Senior Product Manager.

Business Idea

{{IDEA}}

Business Context

{{BUSINESS_CONTEXT}}

Target Users

{{TARGET_USERS}}

Generate:

- Problem Statement
- Target Audience
- Jobs to Be Done
- Pain Points
- Value Proposition
- Success Metrics
- Risks
- Assumptions
- Open Questions

Separate validated facts from assumptions.
```

---

# Product Requirements Document Prompt

## Purpose

Generate a complete Product Requirements Document.

## Prompt

```text
Act as a Senior Product Manager.

Using the following information:

{{PRODUCT_INFORMATION}}

Generate a complete Product Requirements Document including:

- Executive Summary
- Business Goals
- User Personas
- Functional Requirements
- Non-Functional Requirements
- Success Metrics
- User Stories
- Acceptance Criteria
- Risks
- Dependencies
- Out of Scope
```

---

# Roadmap Planning Prompt

## Purpose

Create a strategic product roadmap.

## Prompt

```text
Create a product roadmap for:

{{PRODUCT}}

Business Goals:

{{GOALS}}

Planning Horizon:

{{TIMEFRAME}}

Include:

- Strategic Objectives
- Major Initiatives
- Releases
- Milestones
- Dependencies
- Risks
- KPIs
- Success Criteria

Prioritize initiatives by business value.
```

---

# Backlog Generation Prompt

## Purpose

Convert requirements into an actionable backlog.

## Prompt

```text
Convert the following requirements:

{{REQUIREMENTS}}

Generate:

- Epics
- Features
- User Stories
- Tasks
- Acceptance Criteria
- Story Points (estimated)
- Priority
- Dependencies

Return the backlog in implementation order.
```

---

# User Story Prompt

## Purpose

Generate high-quality user stories.

## Prompt

```text
Generate user stories using the following feature:

{{FEATURE}}

Each story shall include:

- Title
- User Story
- Business Value
- Acceptance Criteria
- Edge Cases
- Priority
- Dependencies

Follow INVEST principles.
```

---

# Prioritization Prompt

## Purpose

Prioritize product initiatives.

## Prompt

```text
Evaluate the following initiatives:

{{FEATURES}}

Apply the following prioritization model:

{{MODEL}}

Generate:

- Score
- Ranking
- Business Value
- Effort
- Risks
- Dependencies
- Recommended Order

Explain the prioritization rationale.
```

---

# Release Planning Prompt

## Purpose

Prepare a release plan.

## Prompt

```text
Create a release plan for:

{{PRODUCT}}

Include:

- Release Scope
- Included Features
- Deferred Features
- Dependencies
- Risks
- QA Readiness
- Deployment Considerations
- Success Metrics

Highlight blockers requiring management attention.
```

---

# Product KPI Prompt

## Purpose

Define measurable product success metrics.

## Prompt

```text
Define KPIs for:

{{PRODUCT}}

Generate:

- North Star Metric
- Business KPIs
- User KPIs
- Technical KPIs
- Leading Indicators
- Lagging Indicators
- Target Values
- Measurement Methods
```

---

# Executive Product Summary Prompt

## Purpose

Summarize product status for executives.

## Prompt

```text
Summarize the following product information:

{{PRODUCT_STATUS}}

Generate:

- Executive Summary
- Current Progress
- Key Achievements
- Risks
- Decisions Required
- Timeline Status
- KPI Overview
- Next Steps

Limit the summary to executive-level information.
```

---

# Prompt Usage Guidelines

Product prompts shall:

- Be customer-centric
- Focus on measurable outcomes
- Align with business strategy
- Produce structured artifacts
- Preserve traceability
- Highlight assumptions and risks

---

# Quality Checklist

Before finalizing a product artifact:

- Business goals defined
- User needs addressed
- Requirements complete
- Acceptance criteria testable
- Dependencies identified
- KPIs measurable
- Risks documented
- Prioritization justified

---

# AI Integration

Product prompts support:

- Product Agent
- Research Agent
- Design Agent
- Architecture Agent
- Engineering Agent
- Executive Agent

Outputs should integrate with enterprise documentation, backlog management and roadmap systems.

---

# Governance

Product prompts are governed by the Product Office.

Updates shall:

- Follow Prompt Governance Standards
- Maintain reusable structures
- Preserve compatibility with product templates
- Support downstream engineering workflows
- Align with enterprise product governance

---

# References

- PROMPT-001 Prompt Governance Standard
- AGENT-008 Product Agent
- TPL-001 PRD Template
- TPL-005 Product Roadmap Template
- TPL-006 Backlog Template

---

# Change History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | 2026-07-04 | Initial release |