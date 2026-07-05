---
id: TPL-017
title: Incident Report Template
version: 1.0.0
status: Template
owner: Site Reliability Engineering Office
classification: Internal
created: YYYY-MM-DD
updated: YYYY-MM-DD

reviewers:
  - SRE Office
  - Platform Engineering Office
  - Security Office
  - Product Office
  - Executive Operations Office

related:
  - PB-006
  - PB-007
  - OPS-006
  - OPS-007
  - SEC-009

tags:
  - template
  - incident
  - outage
  - operations
---

# Incident Report

---

# Executive Summary

> Summarize the incident, customer impact, affected services, resolution and major lessons learned.

---

# Incident Information

| Field | Value |
|--------|-------|
| Incident ID | INC-XXX |
| Title | |
| Incident Commander | |
| Date | |
| Severity | P1 / P2 / P3 / P4 |
| Status | Open / Resolved / Closed |
| Version | |

---

# Incident Classification

Examples:

- Production Outage
- Performance Degradation
- Security Incident
- Infrastructure Failure
- Network Issue
- Database Failure
- Cloud Provider Issue
- Third-Party Dependency

---

# Business Impact

Describe:

- Customer impact
- Revenue impact
- SLA impact
- Operational impact

---

# Systems Affected

| System | Status |
|---------|--------|
| | |

---

# Timeline

| Time | Event |
|------|-------|
| | |

---

# Detection

Describe:

- How the incident was detected
- Monitoring alerts
- Customer reports
- Internal observations

---

# Root Cause

Describe the technical and operational root cause.

---

# Contributing Factors

Identify contributing issues.

Examples:

- Missing monitoring
- Human error
- Infrastructure limitations
- Deployment issue
- Capacity shortage

---

# Mitigation Actions

Describe immediate actions taken to reduce impact.

---

# Resolution

Describe:

- Final fix
- Validation
- Recovery confirmation

---

# Recovery Validation

Verify:

- Service restored
- Monitoring healthy
- Customers confirmed
- SLA restored

---

# Customer Communication

Summarize:

- Notifications
- Status updates
- Resolution announcement

---

# Risks

| Risk | Mitigation |
|------|------------|
| | |

---

# Corrective Actions

| Action | Owner | Due Date |
|----------|-------|----------|
| | | |

---

# Preventive Actions

List improvements that reduce recurrence.

---

# Metrics

| KPI | Value |
|------|-------|
| Detection Time | |
| Response Time | |
| Recovery Time | |
| Downtime | |
| Customers Impacted | |

---

# Lessons Learned

Document:

- What worked well
- What failed
- Recommended improvements

---

# Evidence

Reference:

- Logs
- Dashboards
- Traces
- Screenshots
- Incident Timeline
- Chat Records

---

# Related Records

| Artifact | Reference |
|----------|-----------|
| Problem Record | |
| Change Request | |
| Defect | |
| RCA | |

---

# Incident Closure Checklist

☐ Root Cause Identified

☐ Resolution Verified

☐ Monitoring Restored

☐ Customer Communication Completed

☐ Corrective Actions Assigned

☐ Preventive Actions Planned

☐ Lessons Learned Captured

☐ Executive Review Completed

---

# Governance

Approval authority:

- Incident Commander
- SRE Manager
- Executive Operations Office (P1 incidents)

Critical incidents shall include a formal post-incident review.

---

# AI Consumption Notes

AI may assist with:

- Timeline reconstruction
- Log summarization
- Root cause hypothesis generation
- Impact analysis
- Executive summaries
- Action item generation

AI-generated incident analyses shall be validated before the report is finalized.

---

# References

-

---

# Change History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial template |