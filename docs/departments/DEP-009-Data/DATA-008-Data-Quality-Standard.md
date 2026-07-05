---
id: DATA-008
title: Data Quality Standard
version: 1.0.0
status: Approved
owner: Chief Data Officer (CDO)
classification: Internal
created: 2026-07-04
updated: 2026-07-04

reviewers:
  - Data Governance Office
  - Data Engineering Office
  - Business Intelligence Office
  - AI Engineering Office
  - Enterprise Architecture Office
  - Security Office

related:
  - DATA-001
  - DATA-002
  - DATA-003
  - DATA-004
  - DATA-007
  - DATA-010
  - SEC-007

tags:
  - data-quality
  - governance
  - validation
  - profiling
  - monitoring
---

# Data Quality Standard

## Executive Summary

High-quality data is fundamental to trusted analytics, business operations and Artificial Intelligence.

This standard establishes the enterprise framework for measuring, validating, improving and continuously monitoring data quality across the ForgeOS ecosystem.

Data quality shall be managed proactively throughout the complete data lifecycle rather than relying solely on downstream cleansing activities.

Every critical dataset shall have measurable quality objectives, automated validation rules and clearly assigned ownership.

---

# Purpose

This standard aims to:

- Standardize enterprise data quality
- Improve trust in business information
- Reduce operational errors
- Enable reliable analytics
- Improve AI model performance
- Support regulatory compliance
- Increase automation
- Establish measurable quality governance

---

# Scope

This standard applies to:

- Operational Databases
- Data Warehouses
- Data Lakes
- ETL / ELT Pipelines
- Machine Learning Datasets
- APIs
- Master Data
- Reference Data
- Reports
- Dashboards
- External Data Sources

---

# Guiding Principles

## Quality by Design

Data quality shall be integrated into system design rather than addressed after production deployment.

---

## Prevention Over Correction

Validation shall occur as early as possible during data ingestion.

Preventing poor-quality data is preferred over downstream cleansing.

---

## Automation First

Data quality checks should be fully automated wherever technically feasible.

---

## Measurable Quality

Quality shall be measured using objective metrics rather than subjective assessments.

---

## Continuous Monitoring

Quality shall be continuously monitored throughout the data lifecycle.

---

# Data Quality Lifecycle

```
Data Creation
       ↓
Validation
       ↓
Profiling
       ↓
Transformation
       ↓
Quality Monitoring
       ↓
Issue Detection
       ↓
Correction
       ↓
Verification
       ↓
Continuous Improvement
```

---

# Data Quality Dimensions

ForgeOS adopts the following enterprise quality dimensions.

## Completeness

Measures whether all required information exists.

Examples:

- Missing Customer Name
- Missing Claim Number
- Missing Policy Identifier

---

## Accuracy

Measures correctness against trusted business sources.

Examples:

- Correct Premium Amount
- Correct Currency
- Correct Customer Information

---

## Consistency

Measures whether identical information remains consistent across systems.

Examples:

- Customer Name
- Product Code
- Organization Identifier

---

## Validity

Measures compliance with business rules.

Examples:

- Date Format
- Country Code
- Currency Code
- Status Values

---

## Timeliness

Measures data freshness.

Examples:

- Daily Refresh
- Near Real-Time
- Streaming Data

---

## Uniqueness

Measures duplicate records.

Duplicate business entities shall be minimized.

---

## Integrity

Measures relationships between datasets.

Examples:

- Foreign Keys
- Referential Integrity
- Parent-Child Relationships

---

# Data Validation

Validation shall include:

- Schema Validation
- Business Rule Validation
- Null Checks
- Duplicate Detection
- Data Type Validation
- Range Validation
- Format Validation
- Reference Validation

Validation failures shall generate alerts.

---

# Data Profiling

Profiling shall identify:

- Missing Values
- Duplicate Values
- Distribution
- Statistical Outliers
- Cardinality
- Pattern Analysis
- Data Volume
- Value Frequency

Profiling shall occur before onboarding new datasets.

---

# Data Quality Rules

Each critical dataset shall define:

- Rule Identifier
- Business Description
- Technical Logic
- Severity
- Threshold
- Owner
- Validation Frequency

Rules shall be version controlled.

---

# Data Quality Scoring

Enterprise quality scores shall combine multiple dimensions.

Example:

| Dimension | Weight |
|-----------|---------|
| Completeness | 20% |
| Accuracy | 20% |
| Consistency | 15% |
| Validity | 15% |
| Timeliness | 15% |
| Uniqueness | 15% |

Organizations may adjust weights according to business priorities.

---

# Data Quality Thresholds

Recommended thresholds:

| Score | Quality |
|--------|----------|
| 98–100% | Excellent |
| 95–97% | Good |
| 90–94% | Acceptable |
| Below 90% | Improvement Required |

Critical datasets shall target a minimum quality score of 95%.

---

# Data Quality Monitoring

Monitoring shall include:

- Quality Score
- Validation Failures
- Duplicate Rate
- Missing Values
- Refresh Delays
- Pipeline Errors
- Drift Detection
- Business Rule Violations

Quality dashboards shall be continuously updated.

---

# Data Issue Management

Quality issues shall follow the lifecycle:

```
Detection
      ↓
Classification
      ↓
Assignment
      ↓
Root Cause Analysis
      ↓
Correction
      ↓
Validation
      ↓
Closure
```

Recurring issues shall trigger process improvement initiatives.

---

# Root Cause Analysis

Every significant quality issue shall identify:

- Source System
- Business Process
- Pipeline Failure
- Transformation Logic
- Human Error
- External Source
- Integration Failure

Corrective actions shall prevent recurrence.

---

# Master Data Validation

Master Data shall receive enhanced validation.

Typical entities include:

- Customer
- Product
- Organization
- Policy
- Claims
- Employee
- Vendor

Master Data quality shall be reviewed regularly.

---

# AI Data Quality

Machine Learning datasets shall additionally validate:

- Feature Completeness
- Label Accuracy
- Feature Drift
- Data Drift
- Class Distribution
- Sampling Bias

Poor-quality training data shall block model deployment.

---

# Security Requirements

Quality monitoring platforms shall implement:

- Authentication
- Authorization
- Audit Logging
- Encryption
- Secure Data Access
- Metadata Protection

Quality metrics shall not expose sensitive business information.

---

# Documentation Requirements

Each quality program shall maintain:

- Quality Rules
- Quality Metrics
- Validation Reports
- Profiling Reports
- Root Cause Analysis
- Issue Register
- Improvement Plans
- Dashboards
- Ownership Matrix
- Change History

---

# Quality Gates

☐ Dataset Registered

☐ Profiling Completed

☐ Validation Rules Defined

☐ Quality Thresholds Approved

☐ Monitoring Enabled

☐ Ownership Assigned

☐ Metadata Published

☐ Security Controls Verified

☐ Business Acceptance Completed

☐ Documentation Updated

---

# Success Criteria

The Data Quality program shall achieve:

- Trusted enterprise data
- Reduced operational errors
- Improved analytics
- Improved AI model quality
- Automated validation
- Faster issue resolution
- Increased business confidence

---

# KPIs

- Data Quality Score
- Validation Success Rate
- Duplicate Rate
- Missing Value Rate
- Business Rule Compliance
- Issue Resolution Time
- Data Freshness
- Profiling Coverage
- Dataset Certification Rate
- Root Cause Closure Rate

---

# Governance

Enterprise Data Quality operates under the authority of the Chief Data Officer.

Changes to enterprise quality rules, validation logic or certification criteria shall require approval from:

- Data Governance Office
- Business Data Owner
- Enterprise Architecture Office

Quality reviews shall be performed periodically.

---

# Implementation Notes

ForgeOS recommends implementing automated quality management using:

- Great Expectations
- Soda
- Microsoft Fabric Data Quality
- Apache Griffin
- dbt Tests
- Azure Data Factory Validation
- Databricks Expectations

Quality validation should execute automatically during pipeline execution.

---

# AI Consumption Notes

AI Data Quality Assistants may support:

- Rule generation
- Data profiling
- Anomaly detection
- Root cause analysis
- Drift detection
- Quality scoring
- Metadata generation
- Quality dashboards
- Trend analysis
- Executive reporting

AI-generated quality recommendations shall be validated by Data Stewards before implementation.

---

# References

- DATA-001 Data Governance Standard
- DATA-002 Data Warehouse Standard
- DATA-003 Data Lake Standard
- DATA-004 ETL / ELT Standard
- DATA-007 Machine Learning Data Pipeline Standard
- DATA-010 Data Security Standard
- SEC-007 Compliance Standard
- DAMA-DMBOK2
- ISO/IEC 25012 Data Quality Model
- ISO 8000 Data Quality
- Great Expectations Documentation
- Soda Documentation

---

# Change History

| Version | Date | Description |
|----------|------------|----------------------------|
| 1.0.0 | 2026-07-04 | Initial release |