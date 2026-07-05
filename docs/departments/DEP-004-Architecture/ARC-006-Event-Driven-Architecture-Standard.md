---
id: ARC-006
title: Event-Driven Architecture Standard
version: 1.0.0
status: Approved
owner: Chief Architecture Officer (CAO)
classification: Internal
created: 2026-07-04
updated: 2026-07-04

reviewers:
  - CEO Office
  - Architecture Office
  - Backend Engineering Office
  - DevOps Office
  - Platform Engineering Office
  - Security Office

related:
  - ARC-002
  - ARC-003
  - ARC-004
  - ARC-005
  - GOV-007

tags:
  - architecture
  - events
  - messaging
  - kafka
  - rabbitmq
---

# Event-Driven Architecture Standard

## Executive Summary

This document defines the official Event-Driven Architecture (EDA) Standard used throughout ForgeOS.

Event-Driven Architecture enables loosely coupled, scalable, resilient, and asynchronous software systems.

Systems communicate by publishing facts rather than invoking implementation details.

Events describe what happened.

They never describe what should happen.

---

# Purpose

EDA exists to:

- Reduce coupling
- Improve scalability
- Increase resilience
- Enable asynchronous processing
- Improve system autonomy
- Simplify integrations
- Support distributed systems

---

# Scope

Applies to:

- Microservices
- Modular Monoliths
- AI Systems
- Background Jobs
- Integrations
- Notifications
- Analytics Pipelines
- Workflow Engines

---

# Event Philosophy

ForgeOS follows these principles.

## Publish Facts

Events communicate completed business facts.

Examples:

UserRegistered

InvoicePaid

OrderCompleted

PaymentFailed

---

## Never Publish Commands

Wrong

```
CreateInvoice
```

Correct

```
InvoiceCreated
```

---

## Loose Coupling

Publishers never know consumers.

Consumers never depend on publisher implementation.

---

## Immutable Events

Events never change after publication.

Corrections require new events.

---

## Event Ownership

Every event belongs to exactly one Bounded Context.

---

# Event Types

ForgeOS supports:

- Domain Events
- Integration Events
- System Events
- Audit Events
- Notification Events
- AI Events

Each serves a distinct purpose.

---

# Event Lifecycle

```
Business Action

↓

Domain Event

↓

Outbox

↓

Message Broker

↓

Consumers

↓

Business Processing

↓

New Events
```

---

# Message Brokers

Approved technologies:

- Apache Kafka
- RabbitMQ
- Azure Service Bus
- AWS SNS/SQS
- Google Pub/Sub
- NATS

Technology selection requires Architecture approval.

---

# Event Schema

Every event shall include:

Event Name

Version

Event ID

Correlation ID

Causation ID

Producer

Timestamp

Payload

Metadata

Schema Version

---

# Naming Convention

Events use Past Tense.

Examples:

```
CustomerCreated

InvoicePaid

ProductUpdated

SubscriptionCancelled

EmailVerified

UserDeleted
```

---

# Event Versioning

Events are immutable.

Breaking changes require:

- New Version
- Migration Strategy
- Consumer Compatibility

Events shall remain backward compatible whenever possible.

---

# Event Payload Rules

Payloads shall contain:

Business Facts

Minimal Required Data

Identifiers

Business Timestamp

Never expose internal implementation details.

---

# Delivery Guarantees

Supported guarantees:

At Least Once

At Most Once

Exactly Once (where supported)

Every event shall document its guarantee.

---

# Idempotency

Every consumer shall be idempotent.

Repeated event delivery shall never corrupt business state.

Idempotency Keys are mandatory.

---

# Ordering

Ordering shall be guaranteed only where business requires it.

Ordering assumptions shall be documented.

---

# Retry Strategy

Every consumer defines:

Retry Count

Retry Delay

Backoff Strategy

Maximum Retry Time

Poison Message Policy

---

# Dead Letter Queue

Failed messages shall move to a Dead Letter Queue (DLQ).

DLQ processing requires:

Root Cause

Resolution

Replay Decision

Audit Record

---

# Event Replay

Replay shall support:

Disaster Recovery

Data Recovery

System Migration

Analytics

Replay must never duplicate business effects.

---

# Saga Pattern

Long-running business workflows shall use Saga.

Supported:

Choreography

Orchestration

Selection depends on business complexity.

---

# Outbox Pattern

Every service publishing events shall implement the Outbox Pattern.

Benefits:

Reliable Publishing

Transactional Consistency

No Lost Events

---

# Inbox Pattern

Consumers shall support Inbox Pattern where duplicate processing risk exists.

---

# Event Security

Every event shall define:

Producer Authorization

Consumer Authorization

Payload Encryption

PII Classification

Retention Policy

Audit Requirements

---

# Observability

Every event shall provide:

Distributed Tracing

Correlation IDs

Metrics

Latency

Retry Counts

Failure Rates

Consumer Lag

Broker Health

---

# Event Catalog

Every organization shall maintain:

Event Name

Owner

Description

Producer

Consumers

Version

Schema

Retention

Status

Deprecation

The Event Catalog is the authoritative registry.

---

# AI Event Standards

AI systems shall additionally define:

Inference Started

Inference Completed

Inference Failed

Model Selected

Model Version

Confidence Score

Prompt ID

Token Usage

Latency

Safety Result

---

# Mandatory Questions

Every Event Architecture shall answer:

1. Which business fact occurred?
2. Who owns this event?
3. Which services consume it?
4. Which delivery guarantee applies?
5. Is the consumer idempotent?
6. How are failures handled?
7. How are retries managed?
8. Is replay supported?
9. How is observability implemented?
10. Can new consumers be added without modifying producers?

---

# Quality Gates

Before approval verify:

☐ Event documented

☐ Schema approved

☐ Version assigned

☐ Producer identified

☐ Consumers documented

☐ Retry policy defined

☐ DLQ configured

☐ Idempotency verified

☐ Observability configured

☐ Security approved

---

# Success Criteria

EDA succeeds when:

- Services remain loosely coupled.
- New consumers require no publisher changes.
- Failures remain isolated.
- Systems scale independently.
- Business workflows remain resilient.

---

# KPIs

Measure:

- Event Throughput
- Consumer Lag
- Event Failure Rate
- Retry Success Rate
- DLQ Size
- Event Processing Latency
- Event Replay Success
- Consumer Availability

---

# Exit Criteria

EDA implementation is complete when:

- Event Catalog updated
- Schemas approved
- Broker configured
- Consumers validated
- Monitoring enabled

---

# Governance

Only the Architecture Review Board may:

- Create organization-wide events
- Approve event schema changes
- Approve broker technologies
- Deprecate event versions
- Modify delivery guarantees

---

# Architect Notes

Events represent business history.

Commands express intent.

Never confuse the two.

Every event becomes part of the organization's permanent business timeline.

---

# Implementation Notes

Future AI Architects shall automatically generate:

- Event Catalogs
- Async Sequence Diagrams
- Kafka Topics
- RabbitMQ Exchanges
- Outbox Tables
- DLQ Policies
- Retry Policies
- Saga Definitions
- Event Schemas

Every asynchronous workflow shall be fully documented before implementation.

---

# AI Consumption Notes

AI Professionals shall:

- Prefer asynchronous communication where appropriate.
- Design idempotent consumers.
- Use Outbox by default.
- Version every event.
- Generate complete event documentation automatically.

Event-Driven Architecture enables ForgeOS to build highly scalable, autonomous, and resilient software ecosystems.

---

# References

- DEP-004 Architecture Department
- ARC-002 Solution Architecture Standard
- ARC-003 Domain-Driven Design Standard
- ARC-004 API Design Standard
- ARC-005 Database Architecture Standard
- GOV-007 Operating Principles
- Enterprise Integration Patterns
- Domain-Driven Design

---

# Change History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | 2026-07-04 | Initial release |