---
id: PROMPT-011
title: AI Prompts
version: 1.0.0
status: Approved
owner: AI Engineering Office
classification: Internal

category: Prompt Library
prompt_type: AI Orchestration

created: 2026-07-04
updated: 2026-07-04

reviewers:
  - AI Engineering Office
  - AI Governance Office
  - Enterprise Architecture Office
  - Security Office
  - Platform Engineering Office

related:
  - PROMPT-001
  - AGENT-016
  - AGENT-003
  - AGENT-004
  - AGENT-005
  - AGENT-006

tags:
  - prompt
  - ai
  - orchestration
  - llm
  - reasoning
---

# AI Prompt Library

---

# Purpose

This document contains standardized prompts for enterprise AI orchestration, reasoning, planning, tool selection, multi-agent collaboration and response synthesis.

These prompts are intended for the AI Agent and orchestrator components that coordinate specialist agents and enterprise tools.

---

# Task Planning Prompt

## Purpose

Break down complex requests into executable plans.

## Prompt

```text
You are an Enterprise AI Orchestrator.

Analyze the following request:

{{REQUEST}}

Generate:

- Objectives
- Required Information
- Required Agents
- Required Tools
- Execution Plan
- Dependencies
- Risks
- Success Criteria

Optimize for correctness before speed.
```

---

# Multi-Agent Orchestration Prompt

## Purpose

Coordinate specialist agents.

## Prompt

```text
You are coordinating multiple enterprise AI agents.

Task:

{{TASK}}

Available Agents:

{{AGENTS}}

Determine:

- Which agent should perform each task
- Parallel work opportunities
- Sequential dependencies
- Required context for each agent
- Expected outputs
- Final synthesis strategy

Produce an execution plan.
```

---

# Tool Selection Prompt

## Purpose

Choose appropriate enterprise tools.

## Prompt

```text
Given the following task:

{{TASK}}

Available Tools:

{{TOOLS}}

Recommend:

- Selected Tools
- Selection Rationale
- Required Permissions
- Expected Outputs
- Risks
- Alternatives

Only recommend approved enterprise tools.
```

---

# Knowledge Retrieval Prompt

## Purpose

Retrieve enterprise knowledge.

## Prompt

```text
Retrieve knowledge required for:

{{QUESTION}}

Search:

- Organizational Memory
- Project Memory
- Standards
- Documentation
- Decision Records

Return:

- Relevant Knowledge
- Confidence
- Sources
- Missing Information
```

---

# Response Synthesis Prompt

## Purpose

Combine multiple outputs into one response.

## Prompt

```text
Using the following agent outputs:

{{RESULTS}}

Generate a unified response containing:

- Executive Summary
- Key Findings
- Recommendations
- Risks
- Assumptions
- Supporting Evidence
- Next Steps

Resolve duplicate information while preserving important differences.
```

---

# Decision Support Prompt

## Purpose

Support enterprise decision making.

## Prompt

```text
Evaluate the following decision:

{{DECISION}}

Generate:

- Alternatives
- Trade-offs
- Risks
- Benefits
- Cost Considerations
- Operational Impact
- Recommendation
- Confidence Level

Separate evidence from assumptions.
```

---

# AI Workflow Prompt

## Purpose

Design AI-powered workflows.

## Prompt

```text
Design an AI workflow for:

{{BUSINESS_PROCESS}}

Include:

- Workflow Steps
- AI Responsibilities
- Human Review Points
- Required Tools
- Required Memory
- Governance Controls
- Success Metrics
```

---

# AI Evaluation Prompt

## Purpose

Evaluate AI outputs.

## Prompt

```text
Review the following AI output:

{{OUTPUT}}

Evaluate:

- Accuracy
- Completeness
- Hallucination Risk
- Policy Compliance
- Business Value
- Explainability
- Actionability

Assign an overall quality rating.
```

---

# Executive AI Summary Prompt

## Purpose

Summarize AI activities.

## Prompt

```text
Summarize the following AI workflow:

{{WORKFLOW}}

Generate:

- Executive Summary
- Tasks Completed
- Decisions
- Risks
- Human Reviews
- Recommendations
- Follow-up Actions

Limit technical detail to executive-level information.
```

---

# Prompt Usage Guidelines

AI prompts shall:

- Promote structured reasoning
- Encourage agent specialization
- Minimize unnecessary context
- Respect governance policies
- Preserve traceability
- Support explainability

---

# Quality Checklist

Before completing AI workflows:

- Objectives understood
- Appropriate agents selected
- Tool usage justified
- Memory retrieved correctly
- Risks documented
- Human approvals identified
- Outputs synthesized
- Governance respected

---

# AI Integration

AI prompts support:

- AI Agent
- Research Agent
- Product Agent
- Architecture Agent
- Engineering Agent
- QA Agent
- DevOps Agent
- Security Agent
- Data Agent

Outputs should integrate seamlessly with enterprise workflows, memory systems and orchestration platforms.

---

# Governance

AI prompts are governed by the AI Engineering Office.

Updates shall:

- Follow Prompt Governance Standards
- Preserve orchestration consistency
- Improve reasoning quality
- Support multi-agent collaboration
- Maintain Responsible AI compliance

---

# References

- PROMPT-001 Prompt Governance Standard
- AGENT-016 AI Agent
- AGENT-003 Agent Collaboration Standard
- AGENT-004 Agent Memory Standard
- AGENT-005 Agent Quality Standard
- AGENT-006 Agent Safety Standard

---

# Change History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | 2026-07-04 | Initial release |