---
id: QA-002
title: Manual Testing Standard
version: 1.0.0
status: Approved
owner: Chief Quality Officer (CQO)
classification: Internal
created: 2026-07-04
updated: 2026-07-04

reviewers:
  - QA Office
  - Product Office
  - Engineering Office
  - UX Office

related:
  - QA-001
  - ENG-008
  - DSN-006
  - DSN-008

tags:
  - qa
  - manual-testing
  - quality
  - validation
---

# Manual Testing Standard

## Executive Summary

This document defines the official Manual Testing Standard used throughout ForgeOS.

Manual Testing validates software from the perspective of real users.

Automation verifies expected behavior.

Manual Testing discovers unexpected behavior.

Both disciplines are equally essential.

---

# Purpose

Manual Testing exists to:

- Validate user experience
- Discover unexpected defects
- Verify business workflows
- Evaluate usability
- Confirm requirements
- Support release readiness
- Increase customer confidence

---

# Scope

Applies to:

- Web Applications
- Mobile Applications
- Desktop Applications
- APIs
- AI Products
- Internal Platforms
- Customer Portals

---

# Manual Testing Philosophy

ForgeOS follows these principles.

## Think Like a Customer

Testing represents real users.

---

## Validate Behavior

Not implementation.

---

## Explore

Unexpected behavior reveals hidden defects.

---

## Evidence Matters

Every finding requires reproducible evidence.

---

## Risk First

Test the highest-risk areas first.

---

# Testing Lifecycle

```
Requirements

↓

Test Planning

↓

Test Case Design

↓

Environment Preparation

↓

Execution

↓

Defect Reporting

↓

Regression

↓

Release Validation
```

---

# Test Design Techniques

Every QA Engineer shall understand:

Boundary Value Analysis

Equivalence Partitioning

Decision Tables

State Transition Testing

Error Guessing

Pairwise Testing

Use Case Testing

Risk-Based Testing

Exploratory Testing

---

# Functional Validation

Verify:

Business Rules

Calculations

Validations

Permissions

Workflows

Navigation

Data Integrity

---

# User Interface Validation

Verify:

Layout

Alignment

Typography

Spacing

Colors

Icons

Responsive Behavior

Design System Compliance

---

# User Experience Validation

Verify:

Clarity

Consistency

Ease of Use

Navigation

Feedback

Loading States

Empty States

Error Messages

---

# Accessibility Validation

Verify:

Keyboard Navigation

Screen Readers

Focus Order

Color Contrast

ARIA Support

Touch Targets

WCAG Compliance

---

# API Assisted Validation

Manual QA shall verify:

Request Payloads

Responses

Error Codes

Headers

Authentication

Authorization

Response Time

Data Consistency

---

# AI Feature Validation

For AI-enabled products verify:

Prompt Quality

Response Accuracy

Hallucination Risk

Safety Filters

Conversation Continuity

Streaming

Fallback Responses

Context Retention

---

# Exploratory Sessions

Each exploratory session documents:

Mission

Scope

Duration

Findings

Risks

Recommendations

Learning

---

# Environment Validation

Before testing verify:

Correct Build

Correct Database

Correct Configuration

External Integrations

Authentication

Test Accounts

Monitoring

---

# Test Evidence

Every finding includes:

Screenshots

Screen Recording

Logs

API Requests

API Responses

Database Evidence

Environment Information

Browser / Device Information

---

# Defect Reporting

Every defect contains:

Title

Description

Severity

Priority

Reproduction Steps

Expected Result

Actual Result

Evidence

Environment

Version

---

# Severity Levels

Critical

System unusable.

---

High

Major functionality broken.

---

Medium

Feature partially affected.

---

Low

Minor issue or cosmetic defect.

---

# Priority Levels

P0

Immediate Fix

P1

Current Release

P2

Upcoming Sprint

P3

Future Improvement

---

# Test Session Checklist

Verify:

☐ Functional Behavior

☐ UI Consistency

☐ UX Quality

☐ Error Handling

☐ Permissions

☐ Accessibility

☐ Performance Perception

☐ Data Integrity

---

# Regression Policy

After every fix verify:

Original Issue

Related Features

Critical Workflows

Previously Failed Tests

Business Rules

---

# Manual Testing Metrics

Measure:

Executed Tests

Pass Rate

Fail Rate

Blocked Tests

Defect Density

Exploratory Findings

Requirement Coverage

Release Readiness

---

# Mandatory Questions

Every Manual Test shall answer:

1. Does the feature satisfy business requirements?

2. Does the interface match the design?

3. Can users understand the workflow?

4. Is accessibility preserved?

5. Are edge cases verified?

6. Are error messages meaningful?

7. Is data integrity maintained?

8. Is evidence complete?

9. Would a customer trust this feature?

10. Is the feature ready for production?

---

# Quality Gates

Before approval verify:

☐ Test Cases Executed

☐ Critical Scenarios Passed

☐ Defects Reported

☐ Regression Completed

☐ Acceptance Criteria Satisfied

☐ Evidence Collected

☐ Release Recommendation Prepared

---

# Success Criteria

Manual Testing succeeds when:

- Critical defects are identified before release.

- Customer workflows remain reliable.

- User experience meets expectations.

- Exploratory testing uncovers hidden risks.

- Release confidence increases.

---

# Exit Criteria

Manual Testing is complete when:

- Planned execution completed

- Defects documented

- Regression completed

- Evidence archived

- QA approval issued

---

# Governance

Only QA Leadership may:

Approve manual testing standards

Approve testing scope reductions

Approve risk acceptance

Approve release recommendations

---

# Engineering Notes

Automation proves software behaves as expected.

Manual Testing proves software behaves well for humans.

Both are required for production-quality software.

---

# Implementation Notes

Future AI QA Professionals shall automatically:

Generate Test Cases

Suggest Edge Cases

Generate Exploratory Charters

Validate UI Consistency

Compare Design Specifications

Generate Test Evidence

Recommend Regression Scope

Generate Quality Reports

---

# AI Consumption Notes

AI QA Professionals shall:

Think like end users.

Prioritize business value.

Generate reproducible evidence.

Support human QA—not replace it.

Manual Testing provides the human judgment that automated testing cannot replace.

---

# References

- DEP-006 Quality Assurance Department
- QA-001 Quality Assurance Workflow SOP
- ENG-008 Test Automation Standard
- DSN-006 Accessibility Standard
- DSN-008 Design QA Standard

---

# Change History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | 2026-07-04 | Initial release |