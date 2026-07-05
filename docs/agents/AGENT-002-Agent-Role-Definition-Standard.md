---
id: AGENT-002
title: Agent Role Definition Standard
version: 1.0.0
status: Approved
owner: AI Engineering Office
classification: Internal
created: 2026-07-04
updated: 2026-07-04

reviewers:
  - AI Engineering Office
  - AI Governance Office
  - Enterprise Architecture Office
  - Product Office
  - Security Office

related:
  - AGENT-001
  - AGENT-003
  - AGENT-004
  - AGENT-009
  - TPL-019
  - MEM-002

tags:
  - ai
  - agents
  - roles
  - architecture
---

# Agent Role Definition Standard

---

# Executive Summary

This standard defines how AI agent roles shall be designed, documented and governed within the ForgeOS ecosystem.

Every AI agent shall have a clearly defined purpose, responsibilities, boundaries and operating model to ensure predictable, explainable and maintainable behavior.

ForgeOS adopts a **Single Responsibility Agent** philosophy where each agent specializes in a well-defined domain.

---

# Purpose

This standard aims to:

- Standardize agent role definitions
- Reduce responsibility overlap
- Improve multi-agent collaboration
- Enable reusable agent architectures
- Strengthen governance
- Simplify maintenance

---

# Scope

This standard applies to:

- Personal Agents
- Engineering Agents
- Product Agents
- QA Agents
- DevOps Agents
- Security Agents
- Knowledge Agents
- Executive Agents

---

# Role Definition Principles

## Single Responsibility

Each agent shall focus on one primary business capability.

---

## Clear Boundaries

Agents shall define explicit responsibilities and non-responsibilities.

---

## Reusability

Roles should be reusable across projects whenever practical.

---

## Collaboration First

Agents shall cooperate through defined workflows rather than duplicating responsibilities.

---

## Governed Autonomy

The role definition shall specify the agent's autonomy level and approval requirements.

---

# Standard Role Definition

Every agent shall define:

- Agent Name
- Agent ID
- Business Purpose
- Scope
- Objectives
- Responsibilities
- Non-Responsibilities
- Allowed Actions
- Restricted Actions
- Required Inputs
- Expected Outputs
- Success Criteria

---

# Agent Responsibilities

Responsibilities should describe:

- Primary tasks
- Decision boundaries
- Supported workflows
- Deliverables
- Service ownership

Responsibilities shall remain concise and measurable.

---

# Non-Responsibilities

Each role shall explicitly identify activities that the agent shall not perform.

Examples:

- Financial approval
- Security policy modification
- Production deployment
- Legal interpretation
- Human resource decisions

unless specifically authorized.

---

# Role Inputs

Possible inputs include:

- User Requests
- Enterprise Knowledge
- Project Documentation
- API Responses
- Tool Outputs
- Organizational Memory
- Workflow Context

Inputs shall be documented and validated.

---

# Role Outputs

Possible outputs include:

- Recommendations
- Documentation
- Code
- Reports
- Decisions for Review
- Structured Data
- Workflow Actions

Outputs shall follow enterprise quality standards.

---

# Tool Permissions

Every role shall define:

- Approved Tools
- External APIs
- Internal APIs
- File Access
- Knowledge Sources
- Memory Access
- Automation Permissions

Unauthorized tool access shall be prohibited.

---

# Memory Requirements

Each role shall specify:

- Session Memory
- Persistent Memory
- Organizational Memory
- Retrieval Strategy
- Retention Policy

Memory usage shall comply with enterprise memory governance.

---

# Collaboration Requirements

Agents should define:

- Upstream Dependencies
- Downstream Consumers
- Peer Agents
- Escalation Paths
- Human Review Points

Role interactions shall be documented for multi-agent workflows.

---

# Documentation Requirements

Every role definition shall include:

- Purpose
- Responsibilities
- Boundaries
- Inputs
- Outputs
- Tools
- Memory Model
- Governance Rules
- Version History

---

# AI Integration

AI may assist with:

- Role generation
- Responsibility analysis
- Workflow mapping
- Dependency discovery
- Documentation generation
- Role consistency validation
- Gap analysis
- Governance reporting

Human review is required before approving new production agent roles.

---

# Roles and Responsibilities

| Role | Responsibility |
|------|----------------|
| AI Architect | Role architecture |
| AI Engineer | Role implementation |
| Product Owner | Business validation |
| AI Governance Lead | Governance review |
| Security Architect | Permission validation |
| Enterprise Architect | Enterprise alignment |

---

# KPIs

Suggested metrics:

- Role Reusability
- Responsibility Overlap
- Collaboration Efficiency
- Tool Permission Compliance
- Agent Success Rate
- Human Escalation Rate
- Documentation Completeness
- Governance Compliance

---

# Governance

The Agent Role Definition Standard is governed by the AI Engineering Office.

All enterprise agent roles shall:

- Maintain a single primary responsibility
- Clearly define operational boundaries
- Document tool permissions
- Specify memory requirements
- Support collaborative workflows
- Undergo periodic review

---

# Compliance

Agent role definitions shall comply with:

- Agent Governance Standard
- Agent Memory Standard
- Agent Tool Integration Standard
- Agent Registry Standard
- Agent Definition Template
- Enterprise AI Governance Policies

---

# References

- AGENT-001 Agent Governance Standard
- AGENT-003 Agent Memory Standard
- AGENT-004 Agent Tool Integration Standard
- AGENT-009 Agent Registry Standard
- TPL-019 Agent Definition Template
- MEM-002 Agent Memory Standard

---

# Change History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | 2026-07-04 | Initial release |