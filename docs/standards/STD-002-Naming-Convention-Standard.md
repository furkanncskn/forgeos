---
id: STD-002
title: Naming Convention Standard
version: 1.0.0
status: Approved
owner: Chief Architecture Officer (CAO)
classification: Internal
created: 2026-07-04
updated: 2026-07-04

reviewers:
  - Enterprise Architecture Office
  - Platform Engineering Office
  - DevOps Office
  - Security Office
  - Knowledge Management Office

related:
  - STD-001
  - STD-003
  - OPS-005
  - ARC-001
  - KNOW-004

tags:
  - naming
  - conventions
  - governance
  - standards
  - architecture
---

# Naming Convention Standard

## Executive Summary

Consistent naming conventions improve maintainability, automation, governance and enterprise-wide collaboration.

This standard defines mandatory naming rules for software, infrastructure, cloud resources, repositories, APIs, databases, documentation and AI assets across ForgeOS.

A standardized naming strategy enables automation, improves discoverability and significantly reduces operational ambiguity.

---

# Purpose

This standard aims to:

- Standardize naming across the enterprise
- Improve readability
- Enable automation
- Reduce ambiguity
- Improve searchability
- Support governance
- Improve AI readability
- Strengthen operational consistency

---

# Scope

This standard applies to:

- Source Code
- Git Repositories
- Projects
- Solutions
- APIs
- Databases
- Cloud Resources
- Kubernetes Resources
- Infrastructure
- Containers
- CI/CD Pipelines
- Documentation
- AI Assets

---

# Guiding Principles

## Human Readable

Names shall clearly communicate purpose.

Avoid abbreviations unless officially approved.

---

## Predictable

Similar resources shall follow identical naming patterns.

---

## Globally Unique

Enterprise resources shall be uniquely identifiable.

---

## Automation Friendly

Names shall avoid characters that complicate scripting or automation.

---

## Stable

Names should rarely change after production deployment.

---

# General Naming Rules

Names shall:

- Use English
- Be descriptive
- Avoid spaces
- Avoid special characters
- Avoid organization-specific slang
- Use lowercase unless language conventions require otherwise

Allowed characters:

```
a-z
0-9
-
_
```

---

# Repository Naming

Format:

```
<domain>-<service>

```

Examples:

```
customer-api

payment-service

identity-provider

notification-worker

mobile-backend
```

---

# Solution Naming

Format:

```
ForgeOS.<Domain>

```

Examples:

```
ForgeOS.Security

ForgeOS.Payment

ForgeOS.Identity

ForgeOS.Notifications
```

---

# Project Naming

Format:

```
ForgeOS.<Domain>.<Layer>

```

Examples:

```
ForgeOS.Payment.API

ForgeOS.Payment.Application

ForgeOS.Payment.Domain

ForgeOS.Payment.Infrastructure

ForgeOS.Payment.Tests
```

---

# Namespace Naming

Namespaces shall mirror project structure.

Example:

```
ForgeOS.Payment.Application.Commands
```

---

# API Naming

REST endpoints shall use nouns.

Good:

```
/users

/orders

/payments

/invoices
```

Avoid:

```
/GetUsers

/CreateOrder

/DeletePayment
```

Actions shall be represented through HTTP methods.

---

# Database Naming

Tables:

```
PascalCase
```

Examples:

```
Customer

CustomerAddress

PaymentTransaction
```

Columns:

```
PascalCase
```

Primary Keys:

```
Id
```

Foreign Keys:

```
CustomerId

OrderId
```

---

# Variable Naming

Use meaningful names.

Good:

```
customerName

paymentAmount

invoiceNumber
```

Avoid:

```
a

x1

tmp

data2
```

---

# Class Naming

Classes shall use:

```
PascalCase
```

Examples:

```
CustomerService

PaymentProcessor

AuthenticationProvider
```

Interfaces:

```
ICustomerRepository

IPaymentGateway
```

---

# Method Naming

Methods shall begin with verbs.

Examples:

```
CreateInvoice()

ValidateUser()

CalculateTax()

PublishMessage()
```

---

# Constant Naming

Constants shall use:

```
PascalCase
```

Examples:

```
DefaultTimeout

MaximumRetryCount
```

---

# Environment Naming

Standard environments:

```
dev

test

uat

stage

prod
```

---

# Cloud Resource Naming

Format:

```
<platform>-<service>-<environment>

```

Examples:

```
aks-payment-prod

kv-security-prod

sql-order-dev

st-documents-prod
```

---

# Kubernetes Naming

Namespaces:

```
payment

identity

security

monitoring
```

Deployments:

```
payment-api

notification-worker

identity-service
```

Pods inherit deployment names.

---

# Container Image Naming

Format:

```
forgeos/<service>:<version>
```

Examples:

```
forgeos/payment-api:1.2.0

forgeos/identity-service:3.0.1
```

---

# CI/CD Naming

Pipelines:

```
payment-api-build

payment-api-release

identity-service-ci
```

---

# Documentation Naming

Documents:

```
SEC-001-Security-Workflow-SOP.md

OPS-006-Observability-Standard.md

AI-003-RAG-Standard.md
```

Folders:

```
security/

devops/

knowledge/

architecture/
```

---

# AI Asset Naming

Prompt Libraries:

```
Prompt-CustomerSupport

Prompt-CodeReview

Prompt-SecurityAudit
```

AI Agents:

```
InfrastructureAgent

SecurityAgent

KnowledgeAgent

DocumentationAgent
```

Models:

```
CustomerIntentClassifier

InvoicePredictionModel
```

---

# Abbreviations

Approved abbreviations include:

| Abbreviation | Meaning |
|--------------|----------|
| API | Application Programming Interface |
| UI | User Interface |
| DB | Database |
| IAM | Identity and Access Management |
| RAG | Retrieval-Augmented Generation |
| AI | Artificial Intelligence |
| ML | Machine Learning |
| KPI | Key Performance Indicator |

Unapproved abbreviations shall not be introduced.

---

# Reserved Names

The following names shall not be used:

```
test

temp

demo

sample

new

old

copy

backup

final

latest
```

Production resources shall never contain temporary naming.

---

# Quality Gates

☐ Naming Standard Applied

☐ Repository Naming Validated

☐ API Naming Verified

☐ Database Naming Reviewed

☐ Infrastructure Naming Approved

☐ Documentation Naming Standardized

☐ AI Asset Naming Verified

☐ Metadata Updated

☐ Architecture Review Passed

☐ Production Approved

---

# Success Criteria

The Naming Convention Standard shall achieve:

- Consistent enterprise naming
- Improved automation
- Better searchability
- Reduced ambiguity
- Higher maintainability
- AI-friendly assets
- Strong governance

---

# KPIs

- Naming Compliance Rate
- Repository Naming Accuracy
- Documentation Naming Compliance
- API Naming Consistency
- Infrastructure Naming Compliance
- Duplicate Name Count
- Search Effectiveness
- Automation Success Rate
- Review Findings
- Governance Compliance

---

# Governance

The Naming Convention Standard operates under the authority of the Enterprise Architecture Board.

Changes affecting:

- Naming Rules
- Naming Templates
- Resource Prefixes
- Reserved Keywords

shall require approval from:

- Enterprise Architecture Office
- Platform Engineering Office
- DevOps Office
- Knowledge Management Office

Naming compliance shall be validated through automated policy checks wherever practical.

---

# Implementation Notes

ForgeOS recommends validating naming conventions automatically using:

- Roslyn Analyzers
- SonarQube
- GitHub Actions
- Azure DevOps Pipelines
- Terraform Policies
- Azure Policy
- Open Policy Agent (OPA)

Naming validation should become part of every pull request and deployment pipeline.

---

# AI Consumption Notes

AI Engineering Assistants may support:

- Naming recommendations
- Repository analysis
- API naming validation
- Duplicate detection
- Refactoring suggestions
- Documentation consistency
- Infrastructure naming verification
- Governance reporting
- Policy validation
- Enterprise-wide naming analytics

AI-generated naming recommendations shall comply with this standard before adoption.

---

# References

- STD-001 Documentation Standard
- STD-003 Enterprise Engineering Standard
- OPS-005 CI/CD Platform Standard
- ARC-001 Enterprise Architecture Governance
- KNOW-004 Knowledge Versioning Standard
- Microsoft .NET Design Guidelines
- REST API Design Guidelines

---

# Change History

| Version | Date | Description |
|----------|------------|----------------------------|
| 1.0.0 | 2026-07-04 | Initial release |