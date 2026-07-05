---
id: QA-005
title: Defect Lifecycle Standard
version: 1.0.0
status: Approved
owner: Chief Quality Officer (CQO)
classification: Internal
created: 2026-07-04
updated: 2026-07-04

reviewers:
  - QA Office
  - Engineering Office
  - Product Office
  - DevOps Office

related:
  - DEP-006
  - QA-001
  - QA-004
  - ENG-001
  - ENG-007

tags:
  - defect
  - bug
  - qa
  - quality
---

# Defect Lifecycle Standard

## Executive Summary

This document defines the official Defect Lifecycle Standard used throughout ForgeOS.

Every defect represents organizational learning.

A defect is not merely a bug.

It is evidence that a system, process, requirement or assumption requires improvement.

Defects shall be managed through a standardized lifecycle from discovery to prevention.

---

# Purpose

Defect Lifecycle exists to:

- Standardize defect management
- Improve software quality
- Reduce escaped defects
- Increase release confidence
- Improve engineering feedback loops
- Enable quality analytics
- Build organizational knowledge

---

# Scope

Applies to:

- Functional Defects
- UI Defects
- UX Issues
- API Defects
- Performance Issues
- Security Findings
- Accessibility Issues
- AI Behavior Defects
- Infrastructure Defects

---

# Defect Philosophy

ForgeOS follows these principles.

## Every Defect Matters

Every issue deserves evaluation.

---

## Evidence Before Opinion

Defects require reproducible evidence.

---

## Fix Root Cause

Treat causes.

Not symptoms.

---

## Learn Continuously

Every defect improves future quality.

---

## Prevent Recurrence

A fixed defect should never reappear.

---

# Defect Lifecycle

```
Discovery

↓

Validation

↓

Classification

↓

Prioritization

↓

Assignment

↓

Investigation

↓

Resolution

↓

Verification

↓

Closure

↓

Root Cause Analysis

↓

Knowledge Capture
```

---

# Defect States

Every defect follows one of these states:

New

Validated

Triaged

Assigned

In Progress

Resolved

Ready for Verification

Verified

Closed

Rejected

Duplicate

Deferred

Cannot Reproduce

Won't Fix

Archived

---

# State Definitions

## New

Reported by QA or monitoring.

---

## Validated

Confirmed as a genuine issue.

---

## Triaged

Severity and priority assigned.

---

## Assigned

Ownership transferred.

---

## In Progress

Engineering is implementing a fix.

---

## Resolved

Developer completed implementation.

---

## Ready for Verification

QA validates the resolution.

---

## Verified

Issue no longer reproducible.

---

## Closed

Lifecycle completed.

---

## Rejected

Reported issue is not a defect.

---

## Duplicate

Already reported.

---

## Deferred

Moved to future release.

---

## Cannot Reproduce

Evidence insufficient.

---

## Won't Fix

Business decision.

---

## Archived

Historical reference only.

---

# Severity Model

Critical

Production unavailable.

Data loss.

Security breach.

Revenue loss.

---

High

Major business functionality broken.

---

Medium

Feature partially affected.

Reasonable workaround exists.

---

Low

Minor usability or cosmetic issue.

---

# Priority Model

P0

Immediate

---

P1

Current Release

---

P2

Next Sprint

---

P3

Future Release

---

# Defect Classification

Categories include:

Functional

Business Logic

UI

UX

Accessibility

Performance

Security

Integration

Infrastructure

Configuration

Documentation

AI Behavior

Data Quality

Deployment

Monitoring

---

# Defect Report Structure

Every report contains:

Unique ID

Title

Summary

Description

Environment

Version

Severity

Priority

Category

Business Impact

Expected Result

Actual Result

Reproduction Steps

Evidence

Attachments

Logs

Owner

Reporter

Creation Date

Last Update

Verification Result

Root Cause

Resolution Notes

---

# Reproduction Requirements

Every defect shall include:

Minimum reproducible steps

Environment

Device

Browser

Platform

Configuration

Test Data

Expected behavior

Actual behavior

---

# Root Cause Analysis

Every Critical and High defect requires RCA.

Root Cause categories:

Requirements

Design

Architecture

Implementation

Testing

Deployment

Infrastructure

Third-party Dependency

Human Error

Unknown

---

# Resolution Types

Fixed

Configuration Change

Documentation Update

Environment Issue

Data Correction

Infrastructure Fix

Not Reproducible

Business Decision

---

# Verification

QA validates:

Original Issue

Related Features

Regression

Acceptance Criteria

Business Rules

Monitoring

Evidence is mandatory.

---

# Reopen Policy

A defect shall be reopened when:

Issue persists

Issue partially fixed

Regression occurs

Evidence invalidates closure

Reopened defects retain original identifier.

---

# SLA Targets

| Severity | First Response | Resolution Target |
|----------|---------------:|------------------:|
| Critical | 15 Minutes | 4 Hours |
| High | 1 Hour | 1 Business Day |
| Medium | 4 Hours | 3 Business Days |
| Low | 1 Business Day | Next Planned Release |

---

# Escalation Policy

Automatic escalation occurs when:

Critical SLA exceeded

Repeated reopenings

High customer impact

Security findings

Executive visibility required

---

# Metrics

Measure:

Defect Density

Escaped Defects

Mean Time to Detect

Mean Time to Resolve

Reopen Rate

Duplicate Rate

Defect Aging

Severity Distribution

Resolution Accuracy

Root Cause Distribution

---

# Knowledge Management

Every resolved Critical or High defect generates:

Knowledge Article

Prevention Recommendation

Automation Opportunity

Architecture Feedback

Coding Standard Improvement

Testing Improvement

---

# AI Defect Management

AI-specific defects additionally record:

Prompt Version

Model Version

Temperature

Inference Logs

Safety Evaluation

Hallucination Evidence

Context Window

Fallback Behavior

---

# Mandatory Questions

Every defect shall answer:

1. Can another engineer reproduce it?

2. Is severity justified?

3. Is priority appropriate?

4. What is the customer impact?

5. What caused the issue?

6. Can regression occur?

7. Can automation detect it?

8. Was documentation updated?

9. What organizational learning resulted?

10. How will recurrence be prevented?

---

# Quality Gates

Before closure verify:

☐ Root Cause Identified

☐ Fix Verified

☐ Regression Passed

☐ Documentation Updated

☐ Knowledge Captured

☐ Monitoring Updated

☐ Stakeholders Informed

---

# Success Criteria

Defect Lifecycle succeeds when:

- Defects are resolved rapidly.

- Escaped defects decrease.

- Root causes become visible.

- Organizational learning increases.

- Software quality continuously improves.

---

# Exit Criteria

Defect lifecycle completes when:

- Verification successful

- Root Cause documented

- Knowledge archived

- Metrics updated

- Defect closed

---

# Governance

Only QA Leadership may:

Approve lifecycle changes

Approve severity policy

Approve SLA modifications

Approve closure exceptions

---

# Engineering Notes

Closing a defect is not success.

Preventing the next occurrence is success.

Every resolved defect should make ForgeOS stronger.

---

# Implementation Notes

Future AI QA Professionals shall automatically:

Classify Defects

Determine Severity

Recommend Priority

Generate RCA

Suggest Owners

Recommend Automation

Generate Knowledge Articles

Predict Similar Defects

Detect Duplicates

Analyze Trends

---

# AI Consumption Notes

AI QA Professionals shall:

Prioritize reproducibility.

Recommend evidence-based decisions.

Continuously identify patterns.

Transform defect history into organizational intelligence.

Defect Lifecycle Management is the continuous learning engine of ForgeOS Quality Assurance.

---

# References

- DEP-006 Quality Assurance Department
- QA-001 Quality Assurance Workflow SOP
- QA-004 Test Case Management Standard
- ENG-001 Engineering Workflow SOP
- ENG-007 Code Review Standard

---

# Change History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | 2026-07-04 | Initial release |