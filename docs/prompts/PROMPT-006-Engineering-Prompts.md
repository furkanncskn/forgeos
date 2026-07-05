---
id: PROMPT-006
title: Engineering Prompts
version: 1.0.0
status: Approved
owner: Engineering Office
classification: Internal

category: Prompt Library
prompt_type: Software Engineering

created: 2026-07-04
updated: 2026-07-04

reviewers:
  - Engineering Office
  - AI Engineering Office
  - Enterprise Architecture Office
  - Quality Engineering Office
  - AI Governance Office

related:
  - PROMPT-001
  - AGENT-011
  - TPL-012
  - TPL-013
  - TOOL-002

tags:
  - prompt
  - engineering
  - software
  - coding
  - implementation
---

# Engineering Prompt Library

---

# Purpose

This document contains standardized prompts for software engineering activities including implementation, refactoring, debugging, API development, testing and code review.

The prompts are designed to produce maintainable, secure and production-ready engineering artifacts aligned with ForgeOS engineering standards.

---

# Feature Implementation Prompt

## Purpose

Implement a software feature from requirements.

## Prompt

```text
You are a Senior Software Engineer.

Implement the following feature.

Feature:

{{FEATURE}}

Business Context:

{{BUSINESS_CONTEXT}}

Technical Constraints:

{{CONSTRAINTS}}

Generate:

- Implementation Plan
- Architecture Considerations
- Source Code
- Error Handling
- Validation
- Logging
- Unit Tests
- Documentation

Follow enterprise engineering standards.
```

---

# Code Review Prompt

## Purpose

Review existing source code.

## Prompt

```text
Review the following code:

{{CODE}}

Evaluate:

- Correctness
- Readability
- Maintainability
- Security
- Performance
- Error Handling
- SOLID Principles
- Clean Code

Provide prioritized recommendations.
```

---

# Refactoring Prompt

## Purpose

Improve existing implementation.

## Prompt

```text
Refactor the following implementation:

{{CODE}}

Goals:

{{OBJECTIVES}}

Maintain existing functionality while improving:

- Readability
- Performance
- Maintainability
- Testability
- Modularity

Explain every significant change.
```

---

# API Implementation Prompt

## Purpose

Generate production-ready APIs.

## Prompt

```text
Implement the following API:

{{API_SPECIFICATION}}

Generate:

- Endpoints
- Request Models
- Response Models
- Validation
- Authentication
- Authorization
- Error Handling
- Logging
- Unit Tests
- API Documentation

Follow enterprise API standards.
```

---

# Database Design Prompt

## Purpose

Create database structures.

## Prompt

```text
Design the database for:

{{FEATURE}}

Generate:

- Tables
- Relationships
- Indexes
- Constraints
- Migration Scripts
- Data Validation
- Performance Considerations
- Risks

Explain design decisions.
```

---

# Debugging Prompt

## Purpose

Investigate software defects.

## Prompt

```text
Investigate the following issue:

{{ISSUE}}

Context:

{{CONTEXT}}

Generate:

- Root Cause Analysis
- Reproduction Steps
- Potential Causes
- Diagnostic Plan
- Recommended Fix
- Regression Risks
- Verification Strategy
```

---

# Unit Test Prompt

## Purpose

Generate comprehensive unit tests.

## Prompt

```text
Generate unit tests for:

{{CODE}}

Include:

- Positive Cases
- Negative Cases
- Boundary Cases
- Exception Handling
- Mocking Strategy
- Coverage Considerations

Follow enterprise testing standards.
```

---

# Technical Documentation Prompt

## Purpose

Create engineering documentation.

## Prompt

```text
Document the following implementation:

{{IMPLEMENTATION}}

Generate:

- Overview
- Architecture
- Dependencies
- Configuration
- API Reference
- Examples
- Error Handling
- Operational Notes
```

---

# Pull Request Review Prompt

## Purpose

Review implementation readiness.

## Prompt

```text
Review the following pull request:

{{PULL_REQUEST}}

Evaluate:

- Correctness
- Security
- Tests
- Documentation
- Breaking Changes
- Performance
- Maintainability

Provide:

- Blocking Issues
- Suggestions
- Approval Recommendation
```

---

# Prompt Usage Guidelines

Engineering prompts shall:

- Produce production-ready solutions
- Follow enterprise coding standards
- Include validation and testing
- Promote maintainability
- Document assumptions
- Explain important implementation decisions

---

# Quality Checklist

Before finalizing engineering artifacts:

- Requirements implemented
- Code secure
- Error handling included
- Tests provided
- Documentation complete
- Performance considered
- Standards followed
- Risks identified

---

# AI Integration

Engineering prompts support:

- Engineering Agent
- Architecture Agent
- QA Agent
- DevOps Agent
- Security Agent

Outputs should integrate with source control, CI/CD pipelines, testing frameworks and engineering documentation.

---

# Governance

Engineering prompts are governed by the Engineering Office.

Updates shall:

- Follow Prompt Governance Standards
- Align with engineering templates
- Promote secure software development
- Preserve implementation consistency
- Support continuous engineering improvement

---

# References

- PROMPT-001 Prompt Governance Standard
- AGENT-011 Engineering Agent
- TPL-012 API Specification Template
- TPL-013 Test Plan Template
- TOOL-002 Developer Tools Standard

---

# Change History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | 2026-07-04 | Initial release |