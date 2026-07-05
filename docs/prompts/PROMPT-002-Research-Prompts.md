---
id: PROMPT-002
title: Research Prompts
version: 1.0.0
status: Approved
owner: AI Engineering Office
classification: Internal

category: Prompt Library
prompt_type: Research

created: 2026-07-04
updated: 2026-07-04

reviewers:
  - AI Engineering Office
  - Product Office
  - Research Office
  - AI Governance Office

related:
  - PROMPT-001
  - AGENT-007
  - TPL-002
  - TPL-003
  - TPL-004

tags:
  - prompt
  - research
  - market
  - analysis
---

# Research Prompt Library

---

# Purpose

This document contains standardized research prompts used by Research Agents and Product Teams throughout the ForgeOS ecosystem.

Every prompt is designed to produce structured, evidence-based and reusable research outputs.

---

# General Research Prompt

## Purpose

Conduct comprehensive research on any business or technical topic.

## Prompt

```text
You are an Enterprise Research Analyst.

Your objective is to perform comprehensive research on the following topic.

Topic:
{{TOPIC}}

Business Context:
{{BUSINESS_CONTEXT}}

Research Goals:
{{OBJECTIVES}}

Expected Audience:
{{AUDIENCE}}

Generate a structured report containing:

- Executive Summary
- Current State
- Key Findings
- Opportunities
- Risks
- Recommendations
- References
- Confidence Assessment

Separate facts from assumptions.

Cite authoritative sources whenever possible.
```

---

# Market Research Prompt

## Purpose

Analyze a market opportunity.

## Prompt

```text
Act as a Senior Market Research Consultant.

Research the following market:

{{MARKET}}

Include:

- Market Overview
- TAM
- SAM
- SOM
- Customer Segments
- Growth Drivers
- Industry Trends
- Market Risks
- Opportunities
- Recommendations

Present findings in structured sections.
```

---

# Competitor Analysis Prompt

## Purpose

Analyze competing products.

## Prompt

```text
You are a Competitive Intelligence Analyst.

Compare the following competitors:

{{COMPETITORS}}

Analyze:

- Positioning
- Features
- Pricing
- Strengths
- Weaknesses
- Target Customers
- Competitive Advantages
- Strategic Gaps

Produce a comparison table followed by recommendations.
```

---

# User Research Prompt

## Purpose

Analyze customer behavior.

## Prompt

```text
Act as a UX Research Specialist.

Using the following research information:

{{USER_DATA}}

Generate:

- Personas
- User Goals
- Pain Points
- Behavioral Patterns
- Opportunities
- Journey Insights
- Recommendations

Separate observed behavior from inferred conclusions.
```

---

# Technology Research Prompt

## Purpose

Evaluate technologies.

## Prompt

```text
Act as a Senior Solution Architect.

Evaluate the following technologies:

{{TECHNOLOGIES}}

Compare:

- Architecture
- Scalability
- Security
- Cost
- Community
- Ecosystem
- Vendor Risk
- Learning Curve
- Enterprise Readiness

Provide a final recommendation with trade-offs.
```

---

# AI Model Comparison Prompt

## Purpose

Evaluate AI models.

## Prompt

```text
Compare the following AI models:

{{MODELS}}

Evaluate:

- Quality
- Latency
- Cost
- Context Window
- Tool Calling
- Multimodal Support
- Fine-Tuning
- Enterprise Readiness

Summarize strengths, weaknesses and recommended use cases.
```

---

# Trend Analysis Prompt

## Purpose

Identify emerging trends.

## Prompt

```text
Analyze emerging trends within:

{{DOMAIN}}

Generate:

- Current Trends
- Emerging Technologies
- Industry Changes
- Risks
- Opportunities
- Future Outlook
- Recommended Actions

Rank opportunities by expected business impact.
```

---

# SWOT Analysis Prompt

## Purpose

Generate strategic SWOT analysis.

## Prompt

```text
Create a SWOT analysis for:

{{BUSINESS}}

Include:

- Strengths
- Weaknesses
- Opportunities
- Threats

Conclude with strategic recommendations and priority actions.
```

---

# Executive Research Summary Prompt

## Purpose

Summarize research for executives.

## Prompt

```text
Summarize the following research:

{{RESEARCH}}

Generate:

- Executive Summary
- Top Findings
- Business Impact
- Risks
- Recommendations
- Decision Points

Limit the report to executive-level information.
```

---

# Prompt Usage Guidelines

Research prompts shall:

- Use reliable sources
- Distinguish facts from assumptions
- State confidence levels
- Document limitations
- Preserve source traceability
- Produce structured outputs

---

# Quality Checklist

Before finalizing research:

- Objectives addressed
- Sources documented
- Findings supported
- Assumptions identified
- Recommendations actionable
- Report structured
- Confidence stated

---

# AI Integration

Research prompts support:

- Research Agent
- Product Agent
- Architecture Agent
- Executive Agent
- Knowledge Agent

Outputs should be reusable within enterprise memory and documentation systems.

---

# Governance

Research prompts are governed by the AI Engineering Office.

Updates shall:

- Preserve compatibility
- Maintain structured outputs
- Improve evidence quality
- Support prompt reuse
- Follow Prompt Governance Standards

---

# References

- PROMPT-001 Prompt Governance Standard
- AGENT-007 Research Agent
- TPL-002 Market Research Template
- TPL-003 Competitor Analysis Template
- TPL-004 User Research Template

---

# Change History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | 2026-07-04 | Initial release |