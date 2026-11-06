# DTE Module Phase Disposition

- Document ID: PULSE-DTE-MODULE-PHASE-001
- Version: 0.1.0
- Status: Draft — proposed disposition of legacy M01–M18
- Date: 2026-11-06
- Parent: docs/dte/DTE_PRODUCT_SCOPE_AND_PHASE_ROADMAP.md
- Implementation authorization: Not granted

## 1. Purpose

This document prevents the legacy M01–M18 module list from being mistaken for an approved implementation architecture. Each module is classified by its applicability to the current offline-tagging phase and future phases.

Disposition labels:
- **Current — retain/rewrite:** capability is relevant now, but the existing specification may need substantial revision.
- **Current — conditional:** retain only if the institution confirms the workflow is needed.
- **Split:** some offline framework/work-package functionality may be current; digital question operations are deferred.
- **Deferred:** future phase; not a current dependency or implementation target.
- **Merge/reassess:** responsibility should be consolidated rather than implemented as a separate module.
- **Retire after review:** no current or future need established; do not delete until owner confirms.

## 2. Module disposition matrix

| Legacy ID | Legacy name | Disposition | Current-phase scope | Future scope / notes |
|---|---|---|---|---|
| M01 | Dashboard | Current — rewrite | Framework status, pending approvals, offline work packages, validation/review queues and current-phase metrics only | Later add digital inventory/tagging metrics if needed |
| M02 | Question Inventory | Deferred | No question inventory or question content records | Reassess for upload module; not a DTE Phase 1 screen |
| M03 | Tagging Studio | Deferred/re-scope | Current phase may provide instructions, templates and offline work tracking; no question-content editor | Digital tagging workspace belongs to Phase 3 |
| M04 | Classification Configuration Studio | Current — rewrite | Configure institution-approved structures, fields, groups, values, relationships and governance | Remains core framework service for later phases |
| M05 | Relationship Mapping Engine | Merge/reassess | Only relationships between framework definitions if required by institution-approved model | Digital question-to-tag mapping belongs to Phase 3; do not implement now |
| M06 | Archetype Management | Current — conditional | Manage approved archetype/model-question vocabulary if included in institution's framework | Digital assignment to question records belongs to Phase 3 |
| M07 | Question Type Manager | Current — conditional | Manage approved question-type definitions as framework catalogue values | Digital question type assignment belongs to Phase 3 |
| M08 | Pedagogical Metadata Manager | Current — conditional | Manage approved optional metadata definitions and offline instructions | Digital assignments belong to Phase 3 |
| M09 | PYQ Provenance Manager | Split/defer | Offline template may contain agreed PYQ fields; do not build question/source evidence repository without confirmation | Provenance verification and question-linked evidence belong to Phase 3 |
| M10 | Review & Approval | Current — rewrite/merge | Review framework configuration and offline tagging submissions/records | Later digital mapping review can extend the same governed workflow |
| M11 | Version & History Manager | Current — merge | Audit and revisions for framework, templates, work packages and review decisions | Question content versions remain external/future |
| M12 | Bulk Tagging Manager | Split | Generate templates/work packages and validate returned offline files if confirmed | Digital bulk question tagging belongs to Phase 3 |
| M13 | Validation & Quality Engine | Current — rewrite | Validate configuration, templates and offline tagging submissions against approved rules | Extend to digital mappings later |
| M14 | Coverage & Productivity Analytics | Current — conditional/rewrite | Offline assignment completion, review turnaround, correction/rework and quality metrics | Digital tagging coverage deferred |
| M15 | Configuration Version Manager | Merge with M04/M10/M11 | Framework configuration versioning, activation and retirement | Avoid standalone duplicate lifecycle authority |
| M16 | Historical Enrichment Interface | Deferred | None in current phase | Future Student Tracking diagnostic enrichment; Student Tracking owns student evidence |
| M17 | AI Assistance Interface | Deferred | None required | Future advisory suggestions against approved values, with human approval |
| M18 | External Engine Integration | Deferred/reassess | No current question-engine APIs | Later integration contracts for upload, Q-GENOME, DRE and Student Tracking if approved |

## 3. Proposed current capability groups

Avoid implementing 18 independent services or screens merely because 18 legacy documents exist. Current capabilities may be organized as:

1. **Framework administration:** M04 plus approved portions of M06/M07/M08 and framework relationship configuration.
2. **Offline tagging operations:** offline instructions, templates/work packages, assignment/status and returned-work capture/validation, based on confirmed workflow.
3. **Review and governance:** M10 plus version/audit responsibilities from M11/M15.
4. **Validation and quality:** M13.
5. **Operational dashboard/reporting:** M01 consuming M14 definitions.
6. **Export and future handoff:** limited current framework/template export; no question-content import.

These are capability groupings, not a final screen count or microservice architecture.

## 4. Future capability groups

1. Question upload/ingestion and content verification.
2. Canonical question identity/version/duplicate management.
3. Digital tagging workspace and mapping persistence.
4. PYQ source/provenance evidence.
5. Digital bulk tagging and migration.
6. AI-assisted tagging.
7. Student Tracking historical enrichment.
8. Q-GENOME, DRE and content/assessment integrations.
9. Digital tagging analytics and cross-institute intelligence.

Each future group requires separate requirements, ownership and architecture approval.

## 5. Legacy decision-paper disposition

| Decision | Current status | Disposition |
|---|---|---|
| DEC-001 — Mapping attachment/inheritance | Draft | Deferred to Phase 3 digital mapping architecture |
| DEC-002 — Logical question identity | Draft | Deferred to Phase 2/3 question domain architecture |
| DEC-003 — Q-GENOME ownership | Draft | Deferred until canonical question domain/integration is designed |
| DEC-004 — Current phase boundary | Draft | Governing scope clarification; pending product-owner approval |

DEC-001 through DEC-003 must not be treated as approved decisions. They are preserved for later reconsideration.

## 6. Reconciliation rules

- Update each legacy module specification with its phase disposition and a link to this document.
- Do not silently delete legacy specifications.
- A deferred specification may be retained as historical design input, but it is not current-phase scope.
- If a module is split, maintain separate current and future requirements and acceptance criteria.
- Any change to this disposition must update the master register and audit traceability.
- No database schema or implementation architecture is authorized by this disposition.

## 7. Open product-owner confirmations

1. Which approved tagging categories are actually required in the current offline framework?
2. Are archetype, question type, difficulty, pedagogical metadata and PYQ fields all part of the current offline template, or are some optional/future?
3. Is software-based assignment/status tracking of offline tagging work required?
4. Will completed offline sheets be uploaded to DTE for validation, or will DTE only manage the template/framework and record completion?
5. What existing offline sheet/sample is authoritative?

## 8. Approval

- Product owner: Pending
- Academic authority: Pending
- Architecture: Pending
- Implementation authorization: Not granted

## 9. Change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-11-06 | Draft | Initial phase disposition of legacy M01–M18 |
