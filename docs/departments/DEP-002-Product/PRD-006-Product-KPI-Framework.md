---
id: PRD-006
title: Product KPI Framework
version: 1.0.0
status: Approved
owner: Chief Product Officer (CPO)
classification: Internal
created: 2026-07-04
updated: 2026-07-04

reviewers:
  - CEO Office
  - Product Office
  - Growth Office
  - Data Office

related:
  - PRD-001
  - PRD-002
  - PRD-003
  - PRD-004
  - PRD-005
  - GOV-007
  - GOV-008

tags:
  - product
  - kpi
  - analytics
  - metrics
---

# Product KPI Framework

## Executive Summary

This document establishes the official Product KPI Framework used across ForgeOS.

Every product, feature, experiment, and release shall define measurable outcomes before implementation begins.

ForgeOS measures outcomes—not activity.

Features shipped are not success.

Customer value delivered is success.

---

# Purpose

The Product KPI Framework exists to:

- Measure business impact.
- Evaluate customer value.
- Monitor product health.
- Support strategic decisions.
- Detect problems early.
- Enable continuous optimization.

---

# Scope

This framework applies to:

- Products
- Mobile Applications
- SaaS Platforms
- AI Products
- Internal Systems
- Experiments
- Product Releases

---

# KPI Philosophy

ForgeOS classifies KPIs into four levels.

```
Company KPIs

↓

Product KPIs

↓

Feature KPIs

↓

Operational KPIs
```

Every KPI must support the level above.

---

# KPI Principles

Every KPI shall be:

- Measurable
- Actionable
- Comparable
- Time-bound
- Objective
- Repeatable
- Business-Oriented

Vanity metrics are prohibited.

---

# KPI Categories

## Business KPIs

Measure business performance.

Examples:

- Monthly Recurring Revenue (MRR)
- Annual Recurring Revenue (ARR)
- Customer Lifetime Value (LTV)
- Customer Acquisition Cost (CAC)
- Profit Margin
- Revenue Growth
- Gross Margin

---

## Customer KPIs

Measure customer success.

Examples:

- Customer Satisfaction (CSAT)
- Net Promoter Score (NPS)
- Customer Effort Score (CES)
- Retention Rate
- Churn Rate
- Customer Health Score

---

## Product KPIs

Measure product usage.

Examples:

- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- Monthly Active Users (MAU)
- Stickiness Ratio
- Activation Rate
- Feature Adoption
- Session Duration

---

## Growth KPIs

Measure expansion.

Examples:

- Conversion Rate
- Referral Rate
- Organic Growth
- Paid Growth
- Viral Coefficient
- Expansion Revenue

---

## Technical KPIs

Measure system quality.

Examples:

- Uptime
- Response Time
- Crash Rate
- Error Rate
- Availability
- API Success Rate

---

## Delivery KPIs

Measure execution quality.

Examples:

- Lead Time
- Cycle Time
- Deployment Frequency
- Change Failure Rate
- Sprint Predictability
- Release Success Rate

---

# KPI Lifecycle

```
Business Goal

↓

Success Metric

↓

Baseline

↓

Target

↓

Measurement

↓

Analysis

↓

Decision

↓

Optimization
```

---

# KPI Definition Standard

Every KPI shall define:

- KPI Name
- Description
- Business Objective
- Formula
- Unit
- Target
- Baseline
- Measurement Frequency
- Data Source
- Owner
- Alert Threshold
- Dashboard

---

# KPI Ownership

| KPI Type | Owner |
|----------|-------|
| Business KPIs | CEO Office |
| Product KPIs | Product Department |
| Customer KPIs | Customer Success |
| Technical KPIs | Engineering |
| Growth KPIs | Growth Department |
| Delivery KPIs | Engineering Management |

Ownership cannot be shared.

---

# KPI Review Cadence

| Frequency | Activity |
|-----------|----------|
| Daily | Operational Monitoring |
| Weekly | Team Review |
| Monthly | Product Review |
| Quarterly | Executive Review |
| Annually | Strategic Review |

---

# Product Health Score

Every product shall maintain an overall Product Health Score.

Health Score is calculated using weighted KPI categories.

Example:

Business Performance — 25%

Customer Satisfaction — 25%

Product Usage — 20%

Technical Quality — 15%

Growth Performance — 10%

Delivery Performance — 5%

Weights may vary by product.

---

# KPI Dashboard Requirements

Every product dashboard shall display:

- KPI Status
- Trend
- Target
- Baseline
- Historical Comparison
- Owner
- Last Updated
- Current Health Score

Dashboards shall update automatically whenever possible.

---

# Alert Thresholds

Every KPI shall define:

Green

Within target.

Yellow

Requires monitoring.

Red

Immediate investigation required.

Critical

Executive escalation required.

---

# Mandatory Questions

Every KPI Framework shall answer:

1. What business goal does this measure?
2. Why is this KPI important?
3. How is it calculated?
4. Which team owns it?
5. What is the target?
6. What is the current value?
7. How often is it measured?
8. What action is taken if it declines?
9. Which dashboard displays it?
10. Who receives alerts?

---

# Quality Gates

Before approval verify:

☐ Formula defined

☐ Target documented

☐ Baseline recorded

☐ Owner assigned

☐ Dashboard identified

☐ Alert thresholds configured

☐ Business objective linked

---

# Success Criteria

The KPI Framework succeeds when:

- Every strategic objective is measurable.
- Decisions rely on data.
- Teams understand product health.
- Risks are identified early.
- Continuous improvement becomes measurable.

---

# KPIs for the KPI Framework

Framework effectiveness is measured by:

- KPI Coverage
- Dashboard Adoption
- Data Accuracy
- Decision Confidence
- Alert Response Time
- Executive Satisfaction

---

# Exit Criteria

Framework implementation is complete when:

- KPIs documented
- Dashboards operational
- Owners assigned
- Alerts configured
- Executive approval received

---

# Architect Notes

KPIs exist to improve decisions—not to create reports.

Every metric must influence an action.

Metrics without decisions create organizational waste.

---

# Implementation Notes

Every ForgeOS product shall implement this framework before General Availability (GA).

Future AI Analysts shall automatically calculate, monitor, and explain KPI changes using organizational dashboards.

---

# AI Consumption Notes

AI Professionals shall continuously monitor KPI trends, identify anomalies, explain deviations, recommend corrective actions, and forecast future performance.

Recommendations shall always prioritize long-term customer value over short-term metric optimization.

---

# References

- DEP-002 Product Department
- PRD-001 Product Discovery SOP
- PRD-002 Product Requirements Document Standard
- PRD-003 Product Roadmap SOP
- PRD-004 Backlog Management SOP
- PRD-005 Release Planning SOP
- GOV-007 Operating Principles
- GOV-008 Decision Policy

---

# Change History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | 2026-07-04 | Initial release |