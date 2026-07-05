---
id: AST-003
title: Icon Library Standard
version: 1.0.0
status: Approved
owner: Design Systems Team
classification: Internal

created: 2026-07-04
updated: 2026-07-04

reviewers:
  - Design Systems Team
  - Brand & Design Office
  - Product Design Office
  - Frontend Engineering Office

related:
  - AST-001
  - AST-002
  - AST-004
  - UX-003
  - TOOL-003

tags:
  - assets
  - icons
  - design-system
  - ui
---

# Icon Library Standard

---

# Executive Summary

This standard defines the creation, organization, usage and governance of the enterprise icon library used throughout the ForgeOS ecosystem.

A standardized icon library improves usability, visual consistency and implementation efficiency while ensuring icons remain accessible, scalable and reusable across products.

ForgeOS adopts a **Single Enterprise Icon Library** for all digital products.

---

# Purpose

This standard aims to:

- Standardize icon usage
- Improve UI consistency
- Reduce duplicate icons
- Simplify implementation
- Improve accessibility
- Enable design system reuse

---

# Scope

This standard applies to:

- UI Icons
- Navigation Icons
- Action Icons
- Status Icons
- File Type Icons
- Product Icons
- System Icons
- Notification Icons
- Empty State Icons
- Platform Icons

---

# Icon Design Principles

## Simplicity

Icons shall communicate meaning using the fewest possible visual elements.

---

## Consistency

All icons shall share:

- Stroke style
- Corner radius
- Visual weight
- Perspective
- Grid alignment

---

## Scalability

Icons shall remain clear at all supported sizes.

---

## Accessibility

Icons shall support accessible user interfaces and shall not be the sole method of conveying critical information.

---

## Reusability

Icons should be reusable across applications whenever practical.

---

# Icon Categories

## Navigation

Examples:

- Home
- Search
- Settings
- Dashboard
- Menu

---

## Actions

Examples:

- Add
- Edit
- Delete
- Save
- Download
- Upload
- Share

---

## Status

Examples:

- Success
- Warning
- Error
- Information
- Pending

---

## Files

Examples:

- PDF
- Word
- Excel
- Image
- Video
- Archive

---

## Communication

Examples:

- Email
- Chat
- Phone
- Notification
- Message

---

## System

Examples:

- Cloud
- Database
- Server
- API
- Security
- Users

---

# Design Specifications

Recommended design grid:

```text
24 × 24 px
```

Recommended stroke width:

```text
2 px
```

Recommended corner style:

- Rounded

Icons shall align to the pixel grid.

---

# Supported Sizes

Recommended sizes:

| Usage | Size |
|--------|------|
| Small | 16 px |
| Default | 20 px |
| Standard | 24 px |
| Large | 32 px |
| Extra Large | 48 px |

Icons shall scale proportionally.

---

# Color Usage

Preferred usage:

- Current Color (CSS currentColor)
- Design Tokens
- Semantic Colors
- Accessible Contrast

Hardcoded colors should be avoided unless required for branding.

---

# Naming Convention

Icons shall follow:

```text
category-name-style
```

Examples:

```text
navigation-home-outline

action-edit-filled

status-success-outline

system-database-outline
```

---

# File Formats

Preferred formats:

Primary:

- SVG

Secondary:

- PNG

Distribution packages may also include optimized icon fonts or component libraries where appropriate.

---

# Metadata Requirements

Every icon shall include:

- Icon ID
- Name
- Category
- Description
- Keywords
- Version
- Status
- Designer
- Last Updated

---

# Accessibility Requirements

Icons shall:

- Include accessible labels when interactive
- Not rely solely on color
- Meet contrast requirements
- Support screen readers where applicable
- Be paired with text when ambiguity exists

---

# Implementation Guidelines

Frontend implementations should:

- Use SVG by default
- Support theming
- Support dark mode
- Use design tokens
- Avoid duplicate assets
- Prefer reusable icon components

---

# Approval Workflow

```text
Design
   │
   ▼
Design Review
   │
   ▼
Accessibility Review
   │
   ▼
Design System Approval
   │
   ▼
Publication
```

---

# AI Integration

AI may assist with:

- Icon discovery
- Metadata generation
- Duplicate detection
- Semantic categorization
- Accessibility validation
- Usage recommendations

AI-generated icons require human approval before inclusion in the enterprise library.

---

# Roles and Responsibilities

| Role | Responsibility |
|------|----------------|
| Icon Designer | Icon creation |
| Design Systems Lead | Library governance |
| Frontend Engineer | Component implementation |
| Accessibility Specialist | Accessibility validation |
| Repository Administrator | Asset publication |

---

# KPIs

Suggested metrics:

- Icon Reuse Rate
- Duplicate Icon Rate
- Design System Coverage
- Accessibility Compliance
- Asset Adoption Rate
- Review Cycle Time
- Library Growth
- Implementation Consistency

---

# Governance

The Icon Library Standard is governed by the Design Systems Team.

All enterprise icons shall:

- Follow approved design specifications
- Use standardized naming
- Maintain version history
- Support accessibility
- Be centrally managed
- Undergo design review before publication

---

# Compliance

Icon assets shall comply with:

- Brand Assets Standard
- Logo Usage Standard
- Design System Standards
- Accessibility Standards
- Asset Metadata Standard
- Asset Versioning Standard

---

# References

- AST-001 Brand Assets Standard
- AST-002 Logo Usage Standard
- AST-004 Design System Assets Standard
- UX-003 Design System Standard
- TOOL-003 Design Tools Standard

---

# Change History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | 2026-07-04 | Initial release |