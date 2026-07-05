---
id: PROMPT-008
title: DevOps Prompts
version: 1.0.0
status: Approved
owner: Platform Engineering Office
classification: Internal

category: Prompt Library
prompt_type: DevOps & Platform Engineering

created: 2026-07-04
updated: 2026-07-04

reviewers:
  - Platform Engineering Office
  - DevOps Engineering Office
  - AI Engineering Office
  - Security Office
  - AI Governance Office

related:
  - PROMPT-001
  - AGENT-013
  - OPS-001
  - OPS-005
  - OPS-006
  - TOOL-005

tags:
  - prompt
  - devops
  - platform
  - ci-cd
  - kubernetes
  - infrastructure
---

# DevOps Prompt Library

---

# Purpose

This document contains standardized prompts for infrastructure automation, CI/CD, cloud architecture, Kubernetes, observability and platform operations.

The prompts are designed to produce secure, repeatable and enterprise-ready operational artifacts.

---

# CI/CD Pipeline Prompt

## Purpose

Generate production-ready CI/CD pipelines.

## Prompt

```text
You are a Senior DevOps Engineer.

Design a CI/CD pipeline for:

{{APPLICATION}}

Technology Stack:

{{STACK}}

Generate:

- Pipeline Stages
- Build Process
- Test Process
- Security Scans
- Artifact Management
- Deployment Strategy
- Rollback Plan
- Notifications

Follow enterprise CI/CD standards.
```

---

# Infrastructure as Code Prompt

## Purpose

Generate Infrastructure as Code.

## Prompt

```text
Create Infrastructure as Code for:

{{INFRASTRUCTURE}}

Requirements:

{{REQUIREMENTS}}

Generate:

- Resource Definitions
- Networking
- Security
- Variables
- Outputs
- Environment Strategy
- Validation
```

---

# Kubernetes Deployment Prompt

## Purpose

Create Kubernetes deployment specifications.

## Prompt

```text
Generate Kubernetes resources for:

{{APPLICATION}}

Include:

- Deployment
- Service
- Ingress
- ConfigMap
- Secret References
- Horizontal Pod Autoscaler
- Resource Limits
- Health Checks

Follow cloud-native best practices.
```

---

# Observability Prompt

## Purpose

Design monitoring and observability.

## Prompt

```text
Create an observability strategy for:

{{SYSTEM}}

Generate:

- Metrics
- Logs
- Traces
- Dashboards
- Alerts
- SLOs
- SLIs
- Incident Triggers

Align with enterprise monitoring standards.
```

---

# Release Automation Prompt

## Purpose

Design release automation.

## Prompt

```text
Create a release automation workflow for:

{{APPLICATION}}

Include:

- Versioning
- Promotion Strategy
- Approval Gates
- Canary or Blue-Green Deployment
- Rollback
- Notifications
- Validation Steps
```

---

# Incident Response Prompt

## Purpose

Support operational incidents.

## Prompt

```text
Analyze the following incident:

{{INCIDENT}}

Generate:

- Summary
- Impact Assessment
- Timeline
- Root Cause Hypotheses
- Immediate Actions
- Long-Term Fixes
- Monitoring Improvements
```

---

# Platform Optimization Prompt

## Purpose

Improve platform efficiency.

## Prompt

```text
Review the following platform:

{{PLATFORM}}

Evaluate:

- Performance
- Reliability
- Scalability
- Cost
- Security
- Automation
- Maintainability

Recommend prioritized improvements.
```

---

# Disaster Recovery Prompt

## Purpose

Create disaster recovery plans.

## Prompt

```text
Design a disaster recovery strategy for:

{{SYSTEM}}

Include:

- RTO
- RPO
- Backup Strategy
- Recovery Procedures
- Validation Plan
- Dependencies
- Risks
```

---

# Executive DevOps Summary Prompt

## Purpose

Summarize operational status.

## Prompt

```text
Summarize the following operational information:

{{OPERATIONS}}

Generate:

- Executive Summary
- Platform Health
- Deployment Status
- Availability
- Risks
- Cost Observations
- Recommendations

Focus on business impact.
```

---

# Prompt Usage Guidelines

DevOps prompts shall:

- Promote automation
- Encourage Infrastructure as Code
- Support GitOps principles
- Include rollback strategies
- Prioritize observability
- Follow enterprise security standards

---

# Quality Checklist

Before finalizing DevOps artifacts:

- Automation complete
- Security reviewed
- Rollback defined
- Monitoring included
- Scalability considered
- Reliability addressed
- Documentation complete
- Governance respected

---

# AI Integration

DevOps prompts support:

- DevOps Agent
- Engineering Agent
- Architecture Agent
- Security Agent
- QA Agent

Outputs should integrate with CI/CD systems, cloud platforms, infrastructure repositories and monitoring solutions.

---

# Governance

DevOps prompts are governed by the Platform Engineering Office.

Updates shall:

- Follow Prompt Governance Standards
- Align with platform engineering standards
- Promote operational excellence
- Preserve infrastructure consistency
- Support continuous delivery practices

---

# References

- PROMPT-001 Prompt Governance Standard
- AGENT-013 DevOps Agent
- OPS-001 Infrastructure Platform Standard
- OPS-005 CI/CD Platform Standard
- OPS-006 Observability Standard
- TOOL-005 DevOps Tools Standard

---

# Change History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | 2026-07-04 | Initial release |