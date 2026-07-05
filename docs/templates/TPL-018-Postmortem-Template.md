---
id: TPL-018
title: Postmortem Template
version: 1.0.0
status: Template
owner: Site Reliability Engineering Office
classification: Internal
created: YYYY-MM-DD
updated: YYYY-MM-DD

reviewers:
  - Site Reliability Engineering Office
  - Platform Engineering Office
  - Product Office
  - Security Office
  - Executive Operations Office

related:
  - PB-006
  - PB-007
  - TPL-017
  - OPS-007
  - KNOW-006

tags:
  - template
  - postmortem
  - lessons-learned
  - incident
  - reliability
---

# Postmortem Report

---

# Executive Summary

> Summarize the incident, customer impact, technical root cause, operational lessons and long-term improvement plan.

---

# Postmortem Information

| Field | Value |
|--------|-------|
| Incident ID | INC-XXX |
| Postmortem ID | PM-XXX |
| Service | |
| Incident Date | |
| Postmortem Date | |
| Incident Commander | |
| Facilitator | |
| Status | Draft / Review / Approved |

---

# Incident Overview

Describe:

- What happened
- Which services were affected
- Customer impact
- Business impact

---

# Executive Timeline

| Time | Event |
|------|-------|
| | |

---

# Customer Impact

Document:

- Downtime
- Performance degradation
- Failed transactions
- Data loss (if any)
- Customer complaints
- SLA violations

---

# Business Impact

Include:

- Revenue impact
- Operational disruption
- Reputation impact
- Regulatory implications

---

# Root Cause Analysis

## Primary Root Cause

Describe the primary technical cause.

---

## Contributing Factors

Examples:

- Human error
- Process gap
- Missing automation
- Capacity limitations
- Configuration drift
- Third-party dependency

---

## Five Whys Analysis

| Why | Finding |
|------|----------|
| Why #1 | |
| Why #2 | |
| Why #3 | |
| Why #4 | |
| Why #5 | |

---

# Detection Analysis

Describe:

- How the incident was detected
- Time to detection
- Monitoring effectiveness
- Missed signals

---

# Response Analysis

Review:

- Incident declaration
- Escalation
- Team coordination
- Decision making
- Communication

---

# Resolution Analysis

Describe:

- Temporary mitigation
- Permanent fix
- Recovery validation
- Remaining technical debt

---

# What Went Well

-

---

# What Didn't Go Well

-

---

# Where We Got Lucky

-

---

# Opportunities for Improvement

Examples:

- Better monitoring
- Stronger automation
- Improved runbooks
- Faster deployments
- Better testing

---

# Action Items

| ID | Action | Owner | Priority | Due Date |
|----|--------|-------|----------|----------|
| ACT-001 | | | High | |

---

# Preventive Measures

Document improvements for:

- Engineering
- Operations
- Monitoring
- Security
- Testing
- Documentation

---

# Risk Assessment

| Risk | Impact | Mitigation |
|------|---------|------------|
| | | |

---

# Metrics

| KPI | Value |
|------|-------|
| Mean Time to Detect (MTTD) | |
| Mean Time to Respond (MTTRsp) | |
| Mean Time to Recover (MTTR) | |
| Downtime | |
| Customers Impacted | |

---

# Knowledge Updates

Update the following where applicable:

- Runbooks
- SOPs
- Architecture Documents
- Monitoring Rules
- Knowledge Base
- Incident Playbooks

---

# Supporting Evidence

Reference:

- Incident Report
- Logs
- Dashboards
- Metrics
- Traces
- Deployment Records
- Chat Timeline

---

# Executive Summary for Leadership

Summarize:

- Root cause
- Business impact
- Preventive investments
- Organizational improvements

---

# Postmortem Checklist

☐ Timeline Completed

☐ Root Cause Confirmed

☐ Five Whys Completed

☐ Customer Impact Documented

☐ Action Items Assigned

☐ Lessons Learned Captured

☐ Documentation Updated

☐ Executive Review Completed

---

# Governance

Approval authority:

- Incident Commander
- SRE Manager
- Engineering Manager
- Executive Operations Office (Critical incidents)

Postmortems shall be completed within the organization's incident review SLA and stored in the enterprise knowledge base.

---

# AI Consumption Notes

AI may assist with:

- Timeline reconstruction
- Root cause summarization
- Five Whys generation
- Action item recommendations
- Trend analysis
- Executive summary generation

AI-generated postmortem content shall be reviewed and validated before publication.

---

# References

-

---

# Change History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial template |