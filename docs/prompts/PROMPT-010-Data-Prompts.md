---
id: PROMPT-010
title: Data Prompts
version: 1.0.0
status: Approved
owner: Data & Analytics Office
classification: Internal

category: Prompt Library
prompt_type: Data & Analytics

created: 2026-07-04
updated: 2026-07-04

reviewers:
  - Data & Analytics Office
  - AI Engineering Office
  - Enterprise Architecture Office
  - AI Governance Office
  - Security Office

related:
  - PROMPT-001
  - AGENT-015
  - DATA-001
  - DATA-003
  - INT-007
  - MEM-003

tags:
  - prompt
  - data
  - analytics
  - sql
  - reporting
---

# Data Prompt Library

---

# Purpose

This document provides standardized prompts for data analysis, SQL generation, reporting, business intelligence, data governance and analytics.

The prompts are designed to generate structured, traceable and business-oriented analytical outputs that align with ForgeOS data governance standards.

---

# SQL Generation Prompt

## Purpose

Generate optimized SQL queries.

## Prompt

```text
You are a Senior Data Engineer.

Create an SQL query for:

{{BUSINESS_REQUIREMENT}}

Database Platform:

{{DATABASE}}

Schema Information:

{{SCHEMA}}

Requirements:

- Performance optimized
- Readable
- Maintainable
- Safe
- Standards compliant

Explain optimization decisions.
```

---

# Data Analysis Prompt

## Purpose

Perform structured business analysis.

## Prompt

```text
Analyze the following dataset:

{{DATA}}

Business Context:

{{CONTEXT}}

Generate:

- Executive Summary
- Key Findings
- Trends
- Anomalies
- Risks
- Opportunities
- Recommendations

Support conclusions using available evidence.
```

---

# Dashboard Design Prompt

## Purpose

Design executive dashboards.

## Prompt

```text
Design a dashboard for:

{{BUSINESS_AREA}}

Generate:

- KPI List
- Charts
- Filters
- Drilldowns
- Data Sources
- Refresh Frequency
- Executive Insights

Prioritize business decision support.
```

---

# KPI Definition Prompt

## Purpose

Define measurable KPIs.

## Prompt

```text
Define KPIs for:

{{BUSINESS_DOMAIN}}

Generate:

- KPI Name
- Description
- Formula
- Business Goal
- Data Source
- Refresh Frequency
- Owner
- Target Value
```

---

# Data Quality Prompt

## Purpose

Assess data quality.

## Prompt

```text
Evaluate the following dataset:

{{DATASET}}

Assess:

- Completeness
- Accuracy
- Consistency
- Timeliness
- Validity
- Uniqueness

Generate remediation recommendations.
```

---

# Data Lineage Prompt

## Purpose

Document data lineage.

## Prompt

```text
Generate lineage documentation for:

{{DATA_FLOW}}

Include:

- Data Sources
- Transformations
- Destinations
- Dependencies
- Ownership
- Risks
- Metadata
```

---

# ETL Design Prompt

## Purpose

Design ETL processes.

## Prompt

```text
Design an ETL workflow for:

{{DATA_PIPELINE}}

Generate:

- Source Systems
- Extraction
- Transformations
- Validation
- Loading
- Error Handling
- Monitoring
- Scheduling
```

---

# Business Intelligence Prompt

## Purpose

Generate business insights.

## Prompt

```text
Review the following business metrics:

{{METRICS}}

Generate:

- Executive Summary
- Performance Analysis
- Key Trends
- Risks
- Opportunities
- Recommendations
- Suggested Actions
```

---

# Executive Analytics Summary Prompt

## Purpose

Summarize analytics for executives.

## Prompt

```text
Summarize the following analytics:

{{REPORT}}

Generate:

- Executive Summary
- KPI Highlights
- Business Impact
- Major Risks
- Opportunities
- Recommended Decisions

Limit the report to executive-level information.
```

---

# Prompt Usage Guidelines

Data prompts shall:

- Promote evidence-based analysis
- Preserve data traceability
- Follow enterprise data governance
- Produce structured outputs
- Distinguish facts from assumptions
- Document data limitations

---

# Quality Checklist

Before finalizing analytical outputs:

- Data sources identified
- KPIs defined
- Assumptions documented
- Trends validated
- Recommendations actionable
- Risks identified
- Metadata complete
- Governance requirements satisfied

---

# AI Integration

Data prompts support:

- Data Agent
- Research Agent
- Product Agent
- Executive Agent
- Architecture Agent

Outputs should integrate with enterprise reporting platforms, BI systems, data catalogs and organizational memory.

---

# Governance

Data prompts are governed by the Data & Analytics Office.

Updates shall:

- Follow Prompt Governance Standards
- Align with enterprise data standards
- Preserve analytical consistency
- Support governed decision making
- Encourage reusable analytical patterns

---

# References

- PROMPT-001 Prompt Governance Standard
- AGENT-015 Data Agent
- DATA-001 Data Management Standard
- DATA-003 Data Governance Standard
- INT-007 Analytics Integration Standard
- MEM-003 Project Memory Standard

---

# Change History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | 2026-07-04 | Initial release |