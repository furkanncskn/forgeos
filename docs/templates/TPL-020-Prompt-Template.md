---
id: TPL-020
title: Prompt Template
version: 1.0.0
status: Template
owner: AI Engineering Office
classification: Internal
created: YYYY-MM-DD
updated: YYYY-MM-DD

reviewers:
  - AI Engineering Office
  - AI Governance Office
  - Security Office
  - Product Office

related:
  - AI-002
  - AI-005
  - AI-006
  - AI-008
  - AI-009
  - TPL-019

tags:
  - template
  - prompt
  - llm
  - ai
---

# Prompt Specification

---

# Executive Summary

> Summarize the purpose of the prompt, supported business workflow, target AI model and expected outputs.

---

# Prompt Information

| Field | Value |
|--------|-------|
| Prompt Name | |
| Prompt ID | PROMPT-XXX |
| Version | |
| Owner | |
| Status | Draft / Review / Approved |

---

# Business Purpose

Describe:

- Business problem
- Intended users
- Supported workflow
- Expected business value

---

# Supported Models

Examples:

- GPT-5.x
- Claude
- Gemini
- Llama
- Mistral

Specify tested model versions.

---

# Prompt Category

Select one or more:

- Assistant
- Classification
- Extraction
- Summarization
- Translation
- Coding
- Planning
- Workflow Automation
- RAG
- Multi-Agent

---

# Prompt Objective

Clearly define what the model is expected to accomplish.

---

# System Prompt

```text
<System Prompt Here>
```

---

# Developer Instructions

```text
<Developer Instructions Here>
```

---

# User Prompt Template

```text
<User Prompt Here>

Variables:

{{variable_1}}

{{variable_2}}

{{variable_3}}
```

---

# Context Inputs

Possible context sources:

- Enterprise Knowledge Base
- RAG Retrieval
- APIs
- User Profile
- Uploaded Documents
- External Systems

---

# Variables

| Variable | Description | Required |
|----------|-------------|----------|
| | | Yes |

---

# Expected Output

Describe:

- Output format
- Tone
- Structure
- Language
- Length

---

# Structured Output Schema (Optional)

```json
{
  "field": ""
}
```

---

# Constraints

Examples:

- No hallucinations
- Cite sources
- Preserve formatting
- No PII leakage
- Maximum length
- No unsupported assumptions

---

# Guardrails

Include:

- Prompt Injection Protection
- Data Privacy
- Content Restrictions
- Safety Policies
- Human Escalation Rules

---

# Few-Shot Examples (Optional)

## Example 1

### Input

```text
```

### Expected Output

```text
```

---

## Example 2

### Input

```text
```

### Expected Output

```text
```

---

# Error Handling

Expected behavior for:

- Missing information
- Ambiguous requests
- Invalid inputs
- Unsupported tasks
- Tool failures

---

# Evaluation Criteria

Evaluate:

- Accuracy
- Completeness
- Hallucination Rate
- Format Compliance
- Instruction Following
- Response Time

---

# Test Cases

| Test | Expected Result |
|------|-----------------|
| | |

---

# Risks

| Risk | Mitigation |
|------|------------|
| | |

---

# Dependencies

| Dependency | Purpose |
|------------|---------|
| | |

---

# Prompt Versioning

Document:

- Version history
- Major prompt changes
- Prompt owner
- Review schedule

---

# Monitoring

Track:

- Success Rate
- Token Usage
- Latency
- User Satisfaction
- Error Rate
- Cost per Request

---

# Deployment Checklist

☐ Prompt Reviewed

☐ Variables Documented

☐ Guardrails Validated

☐ Test Cases Passed

☐ Evaluation Completed

☐ Monitoring Enabled

☐ Governance Approved

☐ Production Ready

---

# Governance

Approval authority:

- AI Engineering Office
- AI Governance Office
- Security Office

Production prompts shall be version controlled, evaluated and approved before deployment.

---

# AI Consumption Notes

This template serves as the canonical specification for enterprise prompts and supports:

- Prompt Registry
- Prompt Versioning
- AI Evaluation
- Governance Audits
- Multi-Agent Orchestration
- Prompt Reuse

---

# References

-

---

# Change History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial template |