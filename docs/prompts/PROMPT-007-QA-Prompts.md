---
id: PROMPT-007
title: QA Prompts
version: 1.0.0
status: Approved
owner: Quality Engineering Office
classification: Internal

category: Prompt Library
prompt_type: Quality Assurance

created: 2026-07-04
updated: 2026-07-04

reviewers:
  - Quality Engineering Office
  - Engineering Office
  - AI Engineering Office
  - AI Governance Office

related:
  - PROMPT-001
  - AGENT-012
  - TPL-013
  - TPL-014
  - TPL-015
  - TPL-016

tags:
  - prompt
  - qa
  - testing
  - quality
  - automation
---

# QA Prompt Library

---

# Purpose

This document contains standardized prompts for software quality assurance, test planning, validation, defect management and release readiness.

The prompts are designed to produce structured, repeatable and enterprise-compliant testing artifacts that improve software quality and delivery confidence.

---

# Test Plan Prompt

## Purpose

Generate a comprehensive test plan.

## Prompt

```text
You are a Senior QA Engineer.

Create a Test Plan for:

{{FEATURE}}

Business Context:

{{BUSINESS_CONTEXT}}

Generate:

- Scope
- Objectives
- Test Strategy
- Test Levels
- Test Types
- Test Environment
- Entry Criteria
- Exit Criteria
- Risks
- Deliverables
- Timeline

Follow enterprise QA standards.
```

---

# Test Case Generation Prompt

## Purpose

Generate detailed test cases.

## Prompt

```text
Generate test cases for:

{{FEATURE}}

Each test case shall include:

- Test ID
- Title
- Preconditions
- Test Steps
- Expected Results
- Priority
- Test Data
- Postconditions
- Automation Candidate

Cover positive, negative and edge cases.
```

---

# API Testing Prompt

## Purpose

Create API validation scenarios.

## Prompt

```text
Design API test scenarios for:

{{API}}

Generate:

- Functional Tests
- Validation Tests
- Authentication Tests
- Authorization Tests
- Boundary Tests
- Error Handling Tests
- Performance Considerations

Include expected HTTP responses.
```

---

# Regression Testing Prompt

## Purpose

Prepare regression testing.

## Prompt

```text
Create a regression suite for:

{{RELEASE}}

Include:

- Critical Business Flows
- High Risk Areas
- Previously Fixed Defects
- Integration Scenarios
- Smoke Tests
- Automation Candidates

Prioritize by business impact.
```

---

# Defect Analysis Prompt

## Purpose

Analyze software defects.

## Prompt

```text
Analyze the following defect:

{{DEFECT}}

Generate:

- Root Cause Analysis
- Impact Assessment
- Reproduction Steps
- Severity
- Priority
- Suggested Fix
- Regression Risks
- Validation Plan
```

---

# Release Validation Prompt

## Purpose

Assess release readiness.

## Prompt

```text
Evaluate the following release:

{{RELEASE}}

Generate:

- Testing Summary
- Remaining Risks
- Open Defects
- Regression Status
- Performance Status
- Security Status
- Release Recommendation

Provide a Go / Conditional Go / No Go recommendation.
```

---

# Test Automation Prompt

## Purpose

Design automation strategy.

## Prompt

```text
Create an automation plan for:

{{APPLICATION}}

Include:

- Automation Scope
- Test Pyramid
- Framework Recommendation
- Test Prioritization
- CI/CD Integration
- Reporting
- Maintenance Strategy
```

---

# Quality Assessment Prompt

## Purpose

Evaluate software quality.

## Prompt

```text
Assess the overall quality of:

{{SYSTEM}}

Evaluate:

- Functional Quality
- Reliability
- Maintainability
- Security
- Performance
- Usability
- Test Coverage

Provide an overall quality score and recommendations.
```

---

# Executive QA Summary Prompt

## Purpose

Summarize QA results for stakeholders.

## Prompt

```text
Summarize the following QA results:

{{TEST_RESULTS}}

Generate:

- Executive Summary
- Test Coverage
- Critical Findings
- Release Risks
- Recommendation
- Next Steps

Focus on business impact and release readiness.
```

---

# Prompt Usage Guidelines

QA prompts shall:

- Follow risk-based testing principles
- Promote automation where appropriate
- Ensure traceability to requirements
- Produce structured outputs
- Highlight business risks
- Support repeatable testing

---

# Quality Checklist

Before finalizing QA artifacts:

- Scope defined
- Requirements covered
- Risks documented
- Test data identified
- Expected results defined
- Automation opportunities captured
- Defects classified
- Release recommendation justified

---

# AI Integration

QA prompts support:

- QA Agent
- Engineering Agent
- DevOps Agent
- Security Agent
- Product Agent

Outputs should integrate with test management systems, CI/CD pipelines, defect trackers and release governance processes.

---

# Governance

QA prompts are governed by the Quality Engineering Office.

Updates shall:

- Follow Prompt Governance Standards
- Align with enterprise testing templates
- Promote repeatable testing
- Support continuous quality improvement
- Maintain compatibility with QA workflows

---

# References

- PROMPT-001 Prompt Governance Standard
- AGENT-012 QA Agent
- TPL-013 Test Plan Template
- TPL-014 Test Case Template
- TPL-015 Defect Report Template
- TPL-016 Release Validation Template

---

# Change History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | 2026-07-04 | Initial release |