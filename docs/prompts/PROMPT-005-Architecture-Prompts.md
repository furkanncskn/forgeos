---
id: PROMPT-005
title: Architecture Prompts
version: 1.0.0
status: Approved
owner: Enterprise Architecture Office
classification: Internal

category: Prompt Library
prompt_type: Architecture

created: 2026-07-04
updated: 2026-07-04

reviewers:
  - Enterprise Architecture Office
  - AI Engineering Office
  - Platform Engineering Office
  - Security Office
  - AI Governance Office

related:
  - PROMPT-001
  - AGENT-010
  - TPL-010
  - TPL-011
  - DEC-002

tags:
  - prompt
  - architecture
  - adr
  - solution-design
  - software-architecture
---

# Architecture Prompt Library

---

# Purpose

This document provides standardized prompts for architecture analysis, solution design, technology evaluation and architecture governance.

The prompts are designed to produce structured, scalable and enterprise-compliant architecture artifacts that support engineering delivery.

---

# Solution Architecture Prompt

## Purpose

Create a complete solution architecture.

## Prompt

```text
You are a Senior Enterprise Architect.

Design a solution architecture for:

{{PROJECT}}

Business Context:

{{BUSINESS_CONTEXT}}

Technical Constraints:

{{CONSTRAINTS}}

Generate:

- Executive Summary
- Functional Overview
- High-Level Architecture
- Major Components
- Data Flow
- Integration Points
- Non-Functional Requirements
- Risks
- Assumptions
- Recommendations

Prioritize scalability, maintainability and security.
```

---

# Architecture Review Prompt

## Purpose

Evaluate an existing architecture.

## Prompt

```text
Review the following architecture:

{{ARCHITECTURE}}

Evaluate:

- Scalability
- Maintainability
- Security
- Performance
- Reliability
- Observability
- Cost
- Technical Debt

Provide prioritized recommendations and architectural risks.
```

---

# ADR Prompt

## Purpose

Generate an Architecture Decision Record.

## Prompt

```text
Create an Architecture Decision Record.

Decision:

{{DECISION}}

Context:

{{CONTEXT}}

Include:

- Problem Statement
- Decision Drivers
- Alternatives Considered
- Decision
- Consequences
- Trade-offs
- Risks
- References

Follow enterprise ADR standards.
```

---

# Technology Evaluation Prompt

## Purpose

Compare competing technologies.

## Prompt

```text
Evaluate the following technologies:

{{TECHNOLOGIES}}

Compare:

- Architecture
- Performance
- Scalability
- Security
- Ecosystem
- Cost
- Operational Complexity
- Vendor Risk
- Community Support

Recommend the most suitable option and explain trade-offs.
```

---

# API Architecture Prompt

## Purpose

Design API architecture.

## Prompt

```text
Design an API architecture for:

{{SYSTEM}}

Include:

- API Style
- Resource Model
- Authentication
- Authorization
- Versioning
- Error Handling
- Rate Limiting
- Observability
- Security Controls

Generate recommendations aligned with enterprise API standards.
```

---

# Event-Driven Architecture Prompt

## Purpose

Design event-driven systems.

## Prompt

```text
Design an event-driven architecture for:

{{BUSINESS_PROCESS}}

Generate:

- Events
- Producers
- Consumers
- Topics or Queues
- Event Contracts
- Retry Strategy
- Dead Letter Handling
- Monitoring
- Failure Recovery

Highlight consistency and resiliency considerations.
```

---

# Microservice Decomposition Prompt

## Purpose

Define service boundaries.

## Prompt

```text
Decompose the following system:

{{SYSTEM}}

Generate:

- Service Boundaries
- Responsibilities
- APIs
- Data Ownership
- Communication Patterns
- Dependencies
- Shared Services
- Risks

Explain decomposition rationale.
```

---

# Infrastructure Architecture Prompt

## Purpose

Design cloud infrastructure.

## Prompt

```text
Design infrastructure for:

{{APPLICATION}}

Include:

- Compute
- Networking
- Storage
- Security
- Monitoring
- Disaster Recovery
- Scalability
- High Availability
- Deployment Strategy
```

---

# Executive Architecture Summary Prompt

## Purpose

Summarize architecture decisions.

## Prompt

```text
Summarize the following architecture:

{{ARCHITECTURE}}

Generate:

- Executive Summary
- Key Decisions
- Business Benefits
- Risks
- Technical Challenges
- Cost Considerations
- Next Steps

Limit technical detail to executive-level content.
```

---

# Prompt Usage Guidelines

Architecture prompts shall:

- Align with enterprise standards
- Promote reusable architectures
- Prioritize security by design
- Address non-functional requirements
- Document assumptions
- Produce structured outputs

---

# Quality Checklist

Before finalizing architecture artifacts:

- Business goals addressed
- NFRs documented
- Security considered
- Risks identified
- Trade-offs explained
- ADRs referenced
- Architecture traceable
- Recommendations actionable

---

# AI Integration

Architecture prompts support:

- Architecture Agent
- Product Agent
- Engineering Agent
- Security Agent
- DevOps Agent
- Executive Agent

Outputs should integrate with ADR repositories, architecture documentation and engineering planning workflows.

---

# Governance

Architecture prompts are governed by the Enterprise Architecture Office.

Updates shall:

- Follow Prompt Governance Standards
- Align with architecture templates
- Preserve enterprise design principles
- Encourage reusable patterns
- Support downstream engineering implementation

---

# References

- PROMPT-001 Prompt Governance Standard
- AGENT-010 Architecture Agent
- TPL-010 Architecture Decision Record Template
- TPL-011 Solution Architecture Template
- DEC-002 Decision Record Template

---

# Change History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | 2026-07-04 | Initial release |