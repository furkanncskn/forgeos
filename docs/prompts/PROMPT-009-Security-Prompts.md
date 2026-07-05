---
id: PROMPT-009
title: Security Prompts
version: 1.0.0
status: Approved
owner: Security Office
classification: Internal

category: Prompt Library
prompt_type: Security Engineering

created: 2026-07-04
updated: 2026-07-04

reviewers:
  - Security Office
  - AI Governance Office
  - Platform Engineering Office
  - Enterprise Architecture Office
  - AI Engineering Office

related:
  - PROMPT-001
  - AGENT-014
  - SEC-001
  - SEC-004
  - TOOL-007

tags:
  - prompt
  - security
  - cybersecurity
  - secure-coding
  - compliance
---

# Security Prompt Library

---

# Purpose

This document provides standardized prompts for secure software development, architecture security reviews, vulnerability analysis, compliance validation and enterprise security governance.

The prompts are designed to produce structured, actionable and evidence-based security assessments while supporting Responsible AI and enterprise security policies.

---

# Secure Code Review Prompt

## Purpose

Review source code for security weaknesses.

## Prompt

```text
You are a Senior Application Security Engineer.

Review the following code:

{{CODE}}

Evaluate:

- Authentication
- Authorization
- Input Validation
- Output Encoding
- Injection Risks
- Secret Handling
- Error Handling
- Logging
- Cryptography

Generate:

- Findings
- Severity
- Recommendations
- Secure Code Examples
```

---

# Threat Modeling Prompt

## Purpose

Perform structured threat modeling.

## Prompt

```text
Create a threat model for:

{{SYSTEM}}

Generate:

- Assets
- Trust Boundaries
- Threat Actors
- Attack Vectors
- STRIDE Analysis
- Risks
- Mitigations
- Residual Risks

Present results in a structured report.
```

---

# Architecture Security Review Prompt

## Purpose

Review solution architecture from a security perspective.

## Prompt

```text
Review the following architecture:

{{ARCHITECTURE}}

Evaluate:

- Identity
- Access Control
- Encryption
- Secrets Management
- Network Security
- Logging
- Monitoring
- Data Protection

Recommend prioritized improvements.
```

---

# Dependency Risk Prompt

## Purpose

Assess third-party dependency risks.

## Prompt

```text
Analyze the following dependencies:

{{DEPENDENCIES}}

Evaluate:

- Vulnerabilities
- Maintenance Status
- License Risks
- Supply Chain Risks
- Community Activity
- Update Strategy

Provide remediation recommendations.
```

---

# Compliance Review Prompt

## Purpose

Evaluate compliance readiness.

## Prompt

```text
Assess compliance for:

{{SYSTEM}}

Against:

{{FRAMEWORK}}

Generate:

- Control Mapping
- Compliance Gaps
- Risks
- Required Evidence
- Recommended Actions
- Overall Readiness
```

---

# Security Incident Analysis Prompt

## Purpose

Support incident investigation.

## Prompt

```text
Analyze the following security incident:

{{INCIDENT}}

Generate:

- Executive Summary
- Timeline
- Indicators
- Root Cause
- Impact
- Containment Actions
- Recovery Actions
- Lessons Learned
```

---

# Secrets Management Prompt

## Purpose

Review secrets management.

## Prompt

```text
Evaluate the following secrets management approach:

{{IMPLEMENTATION}}

Review:

- Secret Storage
- Rotation
- Access Control
- Encryption
- Audit Logging
- CI/CD Integration

Recommend improvements aligned with enterprise security standards.
```

---

# Identity and Access Review Prompt

## Purpose

Assess authentication and authorization.

## Prompt

```text
Review the following identity solution:

{{IDENTITY}}

Evaluate:

- Authentication
- Authorization
- Least Privilege
- MFA
- Session Management
- Service Accounts
- Auditability

Generate prioritized recommendations.
```

---

# Executive Security Summary Prompt

## Purpose

Summarize security posture for executives.

## Prompt

```text
Summarize the following security assessment:

{{ASSESSMENT}}

Generate:

- Executive Summary
- Critical Risks
- Compliance Status
- Business Impact
- Recommendations
- Priority Actions

Limit technical detail to executive-level information.
```

---

# Prompt Usage Guidelines

Security prompts shall:

- Follow Zero Trust principles
- Promote Security by Design
- Prioritize risk-based recommendations
- Preserve evidence traceability
- Avoid exposing sensitive information
- Produce actionable findings

---

# Quality Checklist

Before finalizing security artifacts:

- Scope defined
- Risks classified
- Severity assigned
- Recommendations actionable
- Evidence documented
- Compliance evaluated
- Residual risks identified
- Governance requirements addressed

---

# AI Integration

Security prompts support:

- Security Agent
- Architecture Agent
- Engineering Agent
- DevOps Agent
- QA Agent

Outputs should integrate with vulnerability management systems, compliance repositories, security dashboards and governance workflows.

---

# Governance

Security prompts are governed by the Security Office.

Updates shall:

- Follow Prompt Governance Standards
- Align with enterprise security policies
- Promote secure engineering practices
- Preserve compliance traceability
- Support continuous security improvement

---

# References

- PROMPT-001 Prompt Governance Standard
- AGENT-014 Security Agent
- SEC-001 Information Security Standard
- SEC-004 Zero Trust Security Standard
- TOOL-007 Tool Evaluation Framework

---

# Change History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | 2026-07-04 | Initial release |