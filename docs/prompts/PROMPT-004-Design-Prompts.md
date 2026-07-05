---
id: PROMPT-004
title: Design Prompts
version: 1.0.0
status: Approved
owner: Design Office
classification: Internal

category: Prompt Library
prompt_type: UX / UI Design

created: 2026-07-04
updated: 2026-07-04

reviewers:
  - Design Office
  - Product Office
  - AI Engineering Office
  - AI Governance Office

related:
  - PROMPT-001
  - AGENT-009
  - TPL-007
  - TPL-008
  - TPL-009

tags:
  - prompt
  - design
  - ux
  - ui
  - accessibility
---

# Design Prompt Library

---

# Purpose

This document provides standardized prompts for UX research, interaction design, UI specification, accessibility analysis and design handoff.

The prompts are intended to generate consistent, user-centered and implementation-ready design artifacts aligned with ForgeOS design standards.

---

# UX Research Prompt

## Purpose

Transform research findings into actionable UX insights.

## Prompt

```text
You are a Senior UX Researcher.

Analyze the following research data:

{{RESEARCH_DATA}}

Generate:

- Executive Summary
- Personas
- User Goals
- Pain Points
- Behavioral Insights
- Journey Observations
- UX Opportunities
- Design Recommendations

Clearly distinguish observations from assumptions.
```

---

# Information Architecture Prompt

## Purpose

Design an intuitive information architecture.

## Prompt

```text
Design the information architecture for:

{{PRODUCT}}

Business Goals:

{{BUSINESS_GOALS}}

Target Users:

{{USERS}}

Generate:

- Site Map
- Navigation Structure
- Content Hierarchy
- Screen Relationships
- Navigation Principles
- IA Risks
```

---

# User Flow Prompt

## Purpose

Create complete user flows.

## Prompt

```text
Create user flows for:

{{FEATURE}}

Generate:

- Entry Points
- User Actions
- Decisions
- Alternate Paths
- Error States
- Exit Conditions

Describe every step sequentially.
```

---

# Wireframe Prompt

## Purpose

Generate wireframe specifications.

## Prompt

```text
Create wireframe specifications for:

{{SCREEN}}

Include:

- Layout Structure
- Major Components
- Navigation
- Primary Actions
- Secondary Actions
- Validation Messages
- Responsive Behavior
```

---

# UI Specification Prompt

## Purpose

Produce detailed UI implementation guidance.

## Prompt

```text
Generate UI specifications for:

{{FEATURE}}

Include:

- Components
- Layout
- Typography
- Colors
- Spacing
- Icons
- States
- Responsive Rules
- Accessibility Requirements
```

---

# Design System Prompt

## Purpose

Map designs to reusable components.

## Prompt

```text
Map the following UI to the enterprise design system:

{{UI_DESCRIPTION}}

Generate:

- Existing Components
- Required New Components
- Design Tokens
- Interaction Patterns
- Reusability Opportunities
```

---

# Accessibility Review Prompt

## Purpose

Evaluate accessibility compliance.

## Prompt

```text
Review the following interface:

{{UI}}

Evaluate:

- WCAG Compliance
- Color Contrast
- Keyboard Navigation
- Focus Order
- Screen Reader Support
- Touch Targets
- Error Handling

Provide prioritized remediation recommendations.
```

---

# Design Handoff Prompt

## Purpose

Prepare engineering-ready design documentation.

## Prompt

```text
Generate a design handoff for:

{{DESIGN}}

Include:

- Screen Inventory
- Components
- Responsive Behavior
- Assets
- Design Tokens
- Interaction Details
- Accessibility Notes
- Implementation Considerations
```

---

# Design Review Prompt

## Purpose

Review design quality.

## Prompt

```text
Review the following design:

{{DESIGN}}

Evaluate:

- Usability
- Consistency
- Accessibility
- Simplicity
- Learnability
- Design System Compliance

Summarize strengths, issues and recommended improvements.
```

---

# Prompt Usage Guidelines

Design prompts shall:

- Prioritize user needs
- Promote accessibility
- Encourage component reuse
- Align with the enterprise design system
- Produce structured outputs
- Support engineering implementation

---

# Quality Checklist

Before finalizing design artifacts:

- User goals addressed
- Navigation validated
- Components reusable
- Accessibility reviewed
- Responsive behavior defined
- States documented
- Handoff complete
- Risks identified

---

# AI Integration

Design prompts support:

- Design Agent
- Product Agent
- Research Agent
- Architecture Agent
- Engineering Agent
- QA Agent

Outputs should integrate with design systems, documentation repositories and engineering handoff workflows.

---

# Governance

Design prompts are governed by the Design Office.

Updates shall:

- Follow Prompt Governance Standards
- Maintain compatibility with design templates
- Preserve accessibility guidance
- Encourage reusable design patterns
- Support downstream implementation

---

# References

- PROMPT-001 Prompt Governance Standard
- AGENT-009 Design Agent
- TPL-007 UX Research Template
- TPL-008 UX Flow Template
- TPL-009 Design Handoff Template

---

# Change History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | 2026-07-04 | Initial release |