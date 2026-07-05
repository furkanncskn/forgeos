---
id: ARC-001
title: Architecture Discovery Standard Operating Procedure
version: 1.0.0
status: Approved
owner: Chief Architecture Officer (CAO)
classification: Internal
created: 2026-07-04
updated: 2026-07-04

reviewers:
  - CEO Office
  - Product Office
  - Design Office
  - Engineering Office
  - Security Office

related:
  - DEP-004
  - PRD-002
  - DSN-005
  - GOV-007

tags:
  - architecture
  - discovery
  - solution
---

# Architecture Discovery Standard Operating Procedure (SOP)

## Executive Summary

This Standard Operating Procedure defines how ForgeOS discovers, analyzes, and validates the technical requirements of every new software initiative before any architectural decisions are made.

Architecture Discovery is the first technical activity performed after Product and Design have completed their work.

Its objective is to fully understand the business problem before proposing any technical solution.

Architecture begins with understanding.

Not implementation.

---

# Purpose

Architecture Discovery exists to:

- Understand business objectives
- Discover technical constraints
- Identify architectural risks
- Validate assumptions
- Define quality attributes
- Prepare Solution Architecture

---

# Scope

Applies to:

- Mobile Applications
- SaaS Platforms
- AI Products
- Enterprise Systems
- Internal Platforms
- Greenfield Projects
- Legacy Modernization

---

# Inputs

Architecture Discovery begins after receiving:

- Approved PRD
- Product Roadmap
- UX Specifications
- UI Specifications
- Developer Handoff Package
- Business Rules
- Non-Functional Requirements

---

# Outputs

Architecture Discovery produces:

- Discovery Report
- Technical Requirement Analysis
- Architecture Constraints
- Risk Assessment
- Technology Assessment
- Quality Attribute Matrix
- Initial Solution Options
- Architecture Recommendation

---

# Roles

| Role | Responsibility |
|------|----------------|
| Chief Architecture Officer | Final Approval |
| Solution Architect | Discovery Lead |
| Software Architect | Technical Analysis |
| Product Manager | Business Validation |
| Security Architect | Security Assessment |
| Infrastructure Architect | Platform Assessment |

---

# Workflow

## Phase 1 — Business Understanding

### Objective

Understand why the product exists.

Activities:

- Review PRD
- Review Product Vision
- Understand business goals
- Clarify requirements

Deliverable:

Business Understanding Report

---

## Phase 2 — Technical Requirement Analysis

### Objective

Extract technical requirements.

Analyze:

- Functional Requirements
- Non-Functional Requirements
- Business Rules
- Integrations
- External Dependencies

Deliverable:

Technical Requirement Matrix

---

## Phase 3 — Domain Discovery

### Objective

Understand the business domain.

Identify:

- Core Domains
- Supporting Domains
- Shared Concepts
- Business Entities
- Domain Boundaries

Deliverable:

Initial Domain Model

---

## Phase 4 — Constraint Identification

### Objective

Identify technical limitations.

Evaluate:

- Budget
- Timeline
- Technology
- Infrastructure
- Compliance
- Regulations
- Existing Systems

Deliverable:

Constraint Analysis

---

## Phase 5 — Quality Attribute Definition

### Objective

Define system quality goals.

Evaluate:

- Scalability
- Performance
- Security
- Reliability
- Availability
- Maintainability
- Extensibility
- Observability

Deliverable:

Quality Attribute Matrix

---

## Phase 6 — Technology Assessment

### Objective

Evaluate technology options.

Compare:

- Frameworks
- Languages
- Databases
- Messaging Systems
- Cloud Platforms
- AI Technologies

Deliverable:

Technology Assessment Report

---

## Phase 7 — Risk Analysis

### Objective

Identify architectural risks.

Assess:

- Technical Risks
- Business Risks
- Operational Risks
- Security Risks
- Delivery Risks

Deliverable:

Architecture Risk Register

---

## Phase 8 — Solution Exploration

### Objective

Evaluate multiple solution approaches.

Examples:

- Modular Monolith
- Microservices
- Event Driven
- Serverless
- Hybrid

Deliverable:

Solution Comparison Matrix

---

## Phase 9 — Recommendation

### Objective

Recommend the best architecture.

Document:

- Selected Approach
- Decision Rationale
- Trade-offs
- Risks
- Expected Benefits

Deliverable:

Architecture Recommendation

---

## Phase 10 — Discovery Approval

### Objective

Approve Discovery.

Review:

- Product Alignment
- Technical Feasibility
- Risk Acceptance
- Executive Approval

Deliverable:

Approved Discovery Package

---

# Discovery Checklist

Every Architecture Discovery shall answer:

☐ What business problem are we solving?

☐ Which users are affected?

☐ Which systems are involved?

☐ Which integrations are required?

☐ What are the performance expectations?

☐ What are the security requirements?

☐ What scalability is expected?

☐ Which constraints exist?

☐ Which risks exist?

☐ Which architecture best satisfies all requirements?

---

# Mandatory Questions

Every discovery must answer:

1. Why are we building this?
2. What technical problem exists?
3. Which constraints are non-negotiable?
4. Which quality attributes matter most?
5. Which architecture patterns are viable?
6. Which technologies should be avoided?
7. What are the major risks?
8. What assumptions remain unvalidated?
9. Is the architecture future-proof?
10. Is the organization ready to proceed?

---

# Quality Gates

Before approval verify:

☐ Business understood

☐ Requirements validated

☐ Constraints documented

☐ Risks analyzed

☐ Quality attributes defined

☐ Technology evaluated

☐ Recommendation documented

---

# Success Criteria

Architecture Discovery succeeds when:

- Business goals are fully understood.
- Technical risks are identified early.
- Technology choices are evidence-based.
- Engineering receives a clear architectural direction.
- Solution Architecture can begin confidently.

---

# KPIs

Architecture Discovery performance is measured through:

- Discovery Completion Time
- Requirement Clarity Score
- Risk Identification Rate
- Architecture Rework Rate
- Stakeholder Satisfaction
- Technology Decision Confidence

---

# Exit Criteria

Architecture Discovery is complete when:

- Discovery approved
- Recommendation accepted
- Risks documented
- Solution Architecture authorized

---

# Architect Notes

Architecture Discovery defines the problem space.

Solution Architecture defines the solution space.

Never design a solution before fully understanding the problem.

---

# Implementation Notes

Future AI Architects shall automatically analyze PRDs, Design artifacts, business rules, and technical constraints to generate Discovery Reports and Architecture Recommendations.

Every architectural decision shall remain traceable to Discovery findings.

---

# AI Consumption Notes

AI Professionals shall:

- Analyze before recommending.
- Evaluate multiple architectural options.
- Document trade-offs.
- Prioritize long-term maintainability.
- Justify every technical decision with measurable evidence.

Architecture Discovery is the foundation of every successful ForgeOS system.

---

# References

- DEP-004 Architecture Department
- PRD-002 Product Requirements Document Standard
- DSN-005 Developer Handoff Standard
- GOV-007 Operating Principles

---

# Change History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | 2026-07-04 | Initial release |