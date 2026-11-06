# DTE Phase 1 — Requirements and Acceptance Baseline

- Document ID: PULSE-DTE-P1-REQ-001
- Version: 0.1.0
- Status: Draft — traceability baseline
- Phase: Current
- Implementation authorization: Not granted

## 1. Purpose

Provide traceable Phase 1 requirements for managing the approved offline tagging framework and its operating process. Requirements are provisional until product-owner and academic-authority approval.

Priority:
- P0: required for a usable and governed current-phase release.
- P1: required if the associated workflow is confirmed.
- P2: later enhancement or future phase.

## 2. Functional requirements

| ID | Priority | Requirement | Acceptance evidence |
|---|---|---|---|
| P1-FR-001 | P0 | DTE shall represent institution-supplied classification groups and fields without enforcing a universal hierarchy. | Test flat, hierarchical and multiple independent groups where supported by approved requirements. |
| P1-FR-002 | P0 | Every framework element shall have a stable identifier distinct from its display label. | Rename label and verify identifier remains stable. |
| P1-FR-003 | P0 | Required/optional/conditional rules shall be configurable by the authorized institution. | Validate records against two different approved profiles. |
| P1-FR-004 | P0 | DTE shall preserve framework versions and approval evidence. | Reconstruct the approved framework version used by a work package. |
| P1-FR-005 | P0 | DTE shall provide instructions and approved-value references for offline taggers. | Tagger can identify permitted values and definitions without creating new ones. |
| P1-FR-006 | P0 | DTE shall identify work packages and associate them with framework/template versions. | Verify unique work-package reference and pinned versions. |
| P1-FR-007 | P0 | DTE shall support exception recording for ambiguous or unmatched values. | Submit unmatched value and verify escalation without auto-creation. |
| P1-FR-008 | P0 | Technical validation and academic approval shall be distinct outcomes. | Valid file remains pending human review until approved. |
| P1-FR-009 | P0 | DTE shall preserve audit history for governed configuration and work changes. | Verify actor, timestamp, action, reason and before/after data where applicable. |
| P1-FR-010 | P0 | DTE shall not upload, ingest or store question content in Phase 1. | Scope and security tests confirm no question-content ingestion path. |
| P1-FR-011 | P0 | Student Tracking shall not depend on DTE tagging completeness. | Verify missing tags do not block student assignment/attempt workflows. |
| P1-FR-012 | P1 | DTE shall generate a versioned offline template/work package. | Export includes framework/template/work-package identifiers and approved fields. |
| P1-FR-013 | P1 | DTE shall accept completed tagging files for structural validation, if confirmed by product owner. | Row/field errors are actionable; unknown values are not silently mapped. |
| P1-FR-014 | P1 | DTE shall support assignment and status tracking for offline tagging work, if confirmed. | Authorized coordinator assigns and tracks a package through approved states. |
| P1-FR-015 | P1 | DTE shall provide current-phase work and quality metrics, if confirmed. | Metric definitions, denominator and source events are documented and reproducible. |
| P1-FR-016 | P2 | DTE may prepare a handoff manifest for the future upload module. | Manifest identifies framework/template versions and approved offline results. |

## 3. Non-functional requirements to quantify

| ID | Requirement | Target status |
|---|---|---|
| P1-NFR-001 | Tenant isolation and resource-scoped authorization | Mandatory; detailed policy pending |
| P1-NFR-002 | Audit integrity and historical reconstruction | Mandatory; retention period pending |
| P1-NFR-003 | Export reproducibility | Mandatory if template export is in scope |
| P1-NFR-004 | Accessibility and responsive configuration/review UX | Mandatory; standard/targets pending |
| P1-NFR-005 | File intake size/row limits and processing latency | Open pending file workflow decision |
| P1-NFR-006 | Availability, backup, RPO and RTO | Open; must be set before production |
| P1-NFR-007 | Monitoring, alerting and incident response | Required before production |
| P1-NFR-008 | Data minimization; no question content in Phase 1 | Mandatory |

## 4. Explicit non-requirements for Phase 1

- Question upload, OCR and ingestion.
- Digital question inventory.
- Question content storage or editing.
- Canonical question identity/version/placement database.
- Digital question-to-tag mapping persistence.
- AI-generated tags or taxonomy.
- Q-GENOME integration.
- Student attempts, homework status, attendance or student analytics.
- Difficulty scoring or DRE calculation.
- Test generation, delivery or scoring.

## 5. Traceability

Detailed traceability from each requirement to workflow, module capability, UX screen, data entity and test case must be completed before implementation approval. This document establishes requirement IDs but is not yet a complete test suite.

## 6. Approval gates

1. Product owner confirms the exact current-phase features.
2. Academic authority approves the framework governance and tagging rules.
3. Operations owner confirms the offline work process and template.
4. Architecture/security review the current-phase data model and access controls.
5. QA defines executable tests and evidence.
6. Product owner explicitly authorizes implementation.

## 7. Open decisions

- Returned-file intake: required or not.
- Work assignment/status management: required or not.
- Offline sheet format and source locator.
- Current tag categories and mandatory/optional fields.
- Role combinations and separation of duties.
- Current-phase reporting requirements.
- Quantitative NFR targets.

## 8. Approval

- Product owner: Pending
- Academic authority: Pending
- QA: Pending
- Implementation authorization: Not granted

## 9. Change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-11-06 | Draft | Initial Phase 1 requirements and acceptance baseline |