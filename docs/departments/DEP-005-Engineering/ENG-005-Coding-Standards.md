---
id: ENG-005
title: Coding Standards
version: 1.0.0
status: Approved
owner: Chief Engineering Officer (CEnO)
classification: Internal
created: 2026-07-04
updated: 2026-07-04

reviewers:
  - Architecture Office
  - Engineering Office
  - QA Office
  - Security Office

related:
  - ENG-001
  - ENG-002
  - ENG-003
  - ENG-004
  - ARC-003
  - ARC-008

tags:
  - coding
  - clean-code
  - engineering
  - standards
---

# Coding Standards

## Executive Summary

This document defines the official Coding Standards used throughout ForgeOS.

Every line of code represents organizational knowledge.

Code is written once but read thousands of times.

Readability always wins over cleverness.

---

# Purpose

Coding Standards exist to:

- Increase readability
- Improve maintainability
- Reduce bugs
- Simplify onboarding
- Standardize implementations
- Enable AI-generated code
- Minimize technical debt

---

# Scope

Applies to:

- Backend
- Frontend
- Mobile
- AI
- Infrastructure
- Scripts
- Shared Libraries

---

# Coding Philosophy

ForgeOS follows these principles.

## Humans First

Code is written for humans.

Compilers are secondary.

---

## Simplicity

Choose the simplest correct solution.

---

## Explicitness

Hidden behavior is prohibited.

---

## Consistency

Every repository should feel familiar.

---

## Maintainability

Future engineers are primary stakeholders.

---

# SOLID Principles

Every implementation shall follow:

- Single Responsibility
- Open / Closed
- Liskov Substitution
- Interface Segregation
- Dependency Inversion

---

# Clean Code Principles

Every engineer shall:

Write expressive code.

Prefer composition.

Avoid duplication.

Remove dead code.

Prefer small methods.

Prefer small classes.

Avoid deep nesting.

Avoid side effects.

---

# Naming Standards

Variables

```
customerName

totalPrice

retryCount
```

Methods

```
CreateOrder()

CalculateDiscount()

PublishEvent()
```

Classes

```
OrderService

PaymentRepository

InvoiceAggregate
```

Interfaces

```
IUserRepository

IEmailSender
```

Enums

```
PaymentStatus

UserRole

OrderState
```

Constants

```
MaxRetryCount

DefaultTimeout

JwtExpiration
```

Names shall describe intent.

---

# Method Standards

Methods shall:

Do one thing.

Remain under 40 lines where practical.

Avoid more than three parameters.

Return early.

Avoid nested conditionals.

---

# Class Standards

Classes shall:

Have one responsibility.

Remain cohesive.

Expose behavior.

Hide implementation.

Avoid God Objects.

---

# File Standards

One public class per file.

File names match class names.

Folders represent architectural boundaries.

---

# Folder Standards

```
Application/

Domain/

Infrastructure/

Api/

Tests/

Shared/
```

No arbitrary folders.

---

# Comments

Comments explain:

Why

Never:

What

Bad:

```csharp
// Increment i

i++;
```

Good:

```csharp
// Retry count required because payment gateway is eventually consistent.
```

Self-documenting code is preferred.

---

# Formatting

Rules:

4 spaces

UTF-8

LF

One statement per line

Maximum line length:

120 characters

Automatic formatting is mandatory.

---

# Null Handling

Prefer:

Null Object

Optional Types

Guard Clauses

Avoid NullReference exceptions.

---

# Error Handling

Never swallow exceptions.

Always log.

Return meaningful errors.

Use domain-specific exceptions.

---

# Logging

Logs shall include:

Correlation ID

Trace ID

User ID

Execution Time

Severity

Context

Sensitive information shall never be logged.

---

# Dependency Injection

Dependencies shall:

Be constructor injected.

Avoid service locators.

Avoid static dependencies.

---

# Asynchronous Code

Async shall be used for:

I/O

Networking

Database

File Operations

Avoid unnecessary async.

---

# Performance

Avoid:

Premature optimization.

Optimize after measurement.

Document optimization decisions.

---

# Security

Never:

Hardcode secrets.

Trust client input.

Disable validation.

Log passwords.

Expose stack traces.

---

# Testing

Every feature requires:

Unit Tests

Integration Tests

Meaningful Assertions

Readable Test Names

AAA Pattern

Arrange

Act

Assert

---

# Documentation

Every public API documents:

Purpose

Parameters

Returns

Exceptions

Examples

---

# Code Review Checklist

Verify:

☐ Naming

☐ Readability

☐ SOLID

☐ Security

☐ Tests

☐ Performance

☐ Documentation

☐ Architecture Compliance

---

# AI Generated Code

Every AI-generated implementation shall:

Follow architecture.

Follow naming standards.

Compile successfully.

Include tests.

Avoid unnecessary abstraction.

Avoid hallucinated APIs.

Generate deterministic outputs.

---

# Forbidden Practices

The following are prohibited:

Magic Numbers

God Classes

Deep Inheritance

Copy-Paste Programming

Commented Dead Code

Unused Variables

Long Parameter Lists

Circular Dependencies

Hardcoded Secrets

Business Logic Inside Controllers

SQL Inside UI Layer

Shared Mutable Global State

---

# Refactoring Policy

Refactoring shall:

Improve readability.

Reduce complexity.

Preserve behavior.

Maintain test coverage.

Large refactoring requires ADR approval.

---

# Engineering Metrics

Measure:

Cyclomatic Complexity

Code Coverage

Maintainability Index

Duplication

Static Analysis Issues

Security Findings

Technical Debt

---

# Mandatory Questions

Every code review shall answer:

1. Can another engineer understand this within five minutes?

2. Does this follow architecture?

3. Is naming expressive?

4. Is testing sufficient?

5. Is security preserved?

6. Is performance acceptable?

7. Is duplication minimized?

8. Is complexity justified?

9. Would AI generate similar code?

10. Will this remain understandable in five years?

---

# Quality Gates

Before merge verify:

☐ Formatting Passed

☐ Static Analysis Passed

☐ Tests Passed

☐ Security Passed

☐ Review Approved

☐ Documentation Updated

---

# Success Criteria

Coding Standards succeed when:

- Code becomes predictable.
- Reviews become faster.
- Bugs decrease.
- AI-generated code becomes reliable.
- New engineers onboard rapidly.

---

# Exit Criteria

Coding Standards are satisfied when:

- Code merged

- CI successful

- Review approved

- Tests passed

- Documentation complete

---

# Governance

Only Engineering Leadership may:

Approve coding standard changes

Approve language-specific deviations

Approve formatting exceptions

---

# Engineering Notes

Good engineers write code that works.

Great engineers write code that remains understandable for years.

---

# Implementation Notes

Future AI Engineers shall automatically:

Generate clean code

Apply naming conventions

Generate documentation

Generate unit tests

Detect anti-patterns

Suggest refactoring

Enforce formatting

---

# AI Consumption Notes

AI Professionals shall:

Prioritize readability.

Prefer explicit code.

Generate maintainable implementations.

Follow organizational conventions automatically.

Coding Standards are the common language shared by every ForgeOS engineer and every AI Professional.

---

# References

- DEP-005 Engineering Department
- ENG-001 Engineering Workflow SOP
- ENG-002 Backend Engineering Standard
- ENG-003 Frontend Engineering Standard
- ENG-004 Mobile Engineering Standard
- ARC-003 Domain-Driven Design Standard
- ARC-008 Security Architecture Standard
- Robert C. Martin — Clean Code

---

# Change History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | 2026-07-04 | Initial release |