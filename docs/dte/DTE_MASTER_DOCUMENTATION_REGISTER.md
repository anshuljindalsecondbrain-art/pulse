# DTE Master Documentation Register

- Document ID: PULSE-DTE-REG-002
- Version: 0.4.3
- Status: Draft — full phase-aware documentation baseline
- Product: PULSE — Deep Tagging Engine (DTE)
- Scope: DTE only. Other PULSE systems appear only as external owners/consumers in DTE contracts.
- Repository: anshuljindalsecondbrain-art/pulse
- Supersedes: No prior master documentation register has been approved. This register complements, and does not replace, DTE_MODULE_REGISTER.md.
- Last updated: 2026-11-06

## 1. Purpose

This register defines the controlled documentation set required to specify, govern, design, validate, build, operate and maintain DTE. It is the authoritative index for DTE documentation status, ownership, dependencies and approval gates.

This is a documentation plan, not an implementation authorization. A listed document is not evidence that its requirements have been approved or implemented.

## 2. Governing product boundary

DTE is software for managing academic classification and tagging structures already defined and approved by each institution. It does not design, prescribe, generate or impose curriculum structures, chapter-wise syllabus bifurcation or a universal academic hierarchy.

**Current phase: offline tagging framework definition and management.** The current deliverable is the institution-configurable tagging framework and the offline human process for applying it to questions. This includes the approved classification structures, tag/category definitions, tagging instructions, templates or tagging sheets, assignment conventions, quality checks, review/correction rules and governance records. The current phase does not add, upload, ingest, store or manage question content. It does not build a digital question inventory or a digital question-tagging workspace.

**Later phase: question upload and digital tagging.** Question upload/ingestion will be handled by a separate module in a later phase. That module will use the approved tagging framework defined in the current phase when questions are uploaded and tagged. Detailed question identity, question-version, placement, canonical content ownership, Q-GENOME and digital mapping architecture decisions belong to that later-phase design unless a narrowly necessary offline-framework dependency is demonstrated.

DTE's current phase manages the institution-approved classification framework and its offline tagging process. It does not author questions, define academic curriculum structures, prescribe chapter-wise bifurcation, or determine what an institution's academic taxonomy should contain. Digital question inventory, upload, ingestion, storage, question identity/version management, automated tagging, student evidence, test delivery/scoring, student analytics and difficulty calculation are not current-phase deliverables.

## 2.1 Phase boundary and applicability

| Workstream | Current offline-framework phase | Later upload-and-tagging phase |
|---|---|---|
| Institution-approved classification structure configuration | In scope | Reuse and maintain |
| Tag/category definitions and descriptions | In scope | Reuse |
| Offline tagging guidelines and decision rules | In scope | Reuse |
| Offline tagging templates/sheets and instructions | In scope | May inform digital UI/import format |
| Human tagging, checking, correction and approval procedure | In scope | Adapt to digital workflow |
| Tagging quality criteria and consistency audit | In scope | Reuse/extend |
| Question upload, ingestion and OCR | Out of scope | Separate module |
| Digital question inventory and content storage | Out of scope | Separate module/domain |
| Digital question-to-tag mapping persistence | Out of scope | Later design |
| Question identity, version and placement architecture | Deferred | Resolve before digital implementation |
| Q-GENOME canonical question ownership | Deferred | Resolve if/when required by later integration |
| AI-assisted tagging | Out of scope | Separate future decision |

The terms “question”, “tag assignment” and “mapping” may appear in current documentation as offline work concepts. Their appearance does not authorize a digital question database or persistence model.

All existing M01–M18 specifications are repository artifacts in Draft status, not approved scope. Their module names and content must be triaged against this phase boundary. A module must not be treated as current-phase scope solely because it appears in the legacy module register. Digital inventory, upload, digital tagging UI and external-engine integration specifications are deferred for later-phase reassessment.

## 3. Register design principles

1. **One authoritative home per subject.** Do not create separate documents that restate the same rules.
2. **Module specifications describe module behaviour.** Cross-module policy, canonical data and shared contracts belong in dedicated governance/architecture documents and are referenced by modules.
3. **Decision papers record decisions and their status.** They do not silently become approved merely because an option was selected as a direction.
4. **Audits are evidence records, not specifications.** Audit findings must link to remediation items and closure evidence.
5. **External systems are not expanded into DTE scope.** DTE documents only the data and event contracts it needs.
6. **Institutional academic authority is preserved.** Configurable examples are not mandatory taxonomy levels or universal academic rules.
7. **No implementation before the approval gates.** Draft documents do not authorize schema migrations, production changes or code implementation.
8. **Avoid speculative document proliferation.** Combine closely related concerns where they share ownership, lifecycle and acceptance criteria.

## 4. Status vocabulary

| Status | Meaning |
|---|---|
| Planned | Required, not yet drafted or verified |
| Draft | Content exists but has not completed review |
| Under Review | Submitted for product/technical review |
| Approved | Explicitly approved by the designated authority |
| Superseded | Replaced by a newer controlled version |
| Not Applicable | Formally assessed and excluded with rationale |

**Existing** is a repository verification note, not an approval status. A document can be Existing and still have Draft status.

## 5. Documentation hierarchy

- **Level 0 — Governance:** product boundary, terminology, document control, decisions and change control.
- **Level 1 — Product requirements:** user needs, functional/non-functional requirements, roles and end-to-end workflows.
- **Level 2 — Domain and architecture:** canonical entities, identity/version semantics, classification configuration, mappings, ownership and ERD.
- **Level 3 — Module specifications:** M01–M18 detailed functional behaviour.
- **Level 4 — Contracts and interface specifications:** APIs, events, external references and UI behaviour.
- **Level 5 — Verification and operations:** traceability, test plans, security/performance evidence, deployment and operational procedures.

## 6. Master document register

### A. Governance and product definition

| ID | Document | Primary owner | Status | Notes |
|---|---|---|---|---|
| DTE-DOC-001 | Product Vision, Outcomes & Success Measures | Product Owner | Planned | Define measurable DTE outcomes; avoid duplicating PRD detail |
| DTE-DOC-002 | Product Requirements & Scope Baseline | Product Owner | Planned | Consolidated PRD, in-scope/out-of-scope and stakeholder needs |
| DTE-DOC-003 | Domain Glossary & Canonical Terminology | Product + Architecture | Planned | Canonical definitions and prohibited ambiguous synonyms |
| DTE-DOC-004 | Documentation Governance & Change Control | Product + Repository Maintainer | Planned | Lifecycle, semantic versioning, approval, supersession and change requests |
| DTE-DOC-005 | Decision Register | Product Owner | Draft | Indexes decisions, status, rationale, affected docs and approvals |
| DTE-DOC-006 | Master Documentation Register | Product + Repository Maintainer | Draft | This document; single index for DTE documentation |

### B. Cross-module requirements and operating model

| ID | Document | Primary owner | Status | Notes |
|---|---|---|---|---|
| DTE-DOC-007 | Functional Requirements & Acceptance Criteria | Product + QA | Planned | Traceable, testable requirements across modules |
| DTE-DOC-008 | Non-Functional Requirements & Capacity Targets | Architecture + QA | Planned | Availability, latency, throughput, scale, recovery and accessibility targets |
| DTE-DOC-009 | Module Responsibility & Ownership Matrix | Product + Architecture | Planned | Single owner per entity, workflow and state transition |
| DTE-DOC-010 | Roles, Permissions & Separation-of-Duties Matrix | Product + Security | Planned | Roles, actions, resource scopes, tenant scope and approval restrictions |
| DTE-DOC-011 | End-to-End DTE Workflow Catalogue | Product + Module Owners | Planned | User journeys across tagging, review, bulk, validation and publication |
| DTE-DOC-012 | Requirements Traceability Matrix | Product + QA | Planned | Requirement → module → design → API/data → test → evidence |

### C. Canonical domain model and data architecture

| ID | Document | Primary owner | Status | Notes |
|---|---|---|---|---|
| DTE-DOC-013 | Canonical Domain Model & Entity Catalogue | Data Architect | Planned | Entity purpose, ownership, identity, lifecycle and cardinality |
| DTE-DOC-014 | Question Identity, Version & Placement Policy | Product + Data Architect | Draft | Combines identity/version/placement semantics; must reconcile DEC-002 and module specs |
| DTE-DOC-015 | Classification Configuration & Schema Lifecycle Policy | Product + Data Architect | Planned | Institution-defined structures, schema versions, approval and migration |
| DTE-DOC-016 | Mapping Attachment, Relationship & Resolution Policy | Product + Data Architect | Draft | Combines DEC-001 with relationship/inheritance semantics; detailed approval pending |
| DTE-DOC-017 | Archetype, Question Type & Pedagogical Metadata Model | Product + Data Architect | Planned | Defines boundaries and associations without imposing academic taxonomy |
| DTE-DOC-018 | PYQ Provenance, Source Evidence & Adaptation Policy | Product + Data Architect | Planned | Appearance, source, verification and adapted-question relationships |
| DTE-DOC-019 | Canonical ERD & Database Schema Specification | Data Architect | Planned | Physical schema only after logical model decisions are approved |
| DTE-DOC-020 | Data Dictionary, Constraints & Index Catalogue | Data Architect | Planned | Field definitions, keys, nullability, uniqueness, indexes |
| DTE-DOC-021 | Data Retention, Deactivation & Historical Reconstruction Policy | Data + Security | Planned | No destructive cascade; archival, legal retention and historical reads |
| DTE-DOC-022 | Tenant Isolation & Shared-Reference Governance | Architecture + Security | Planned | Tenant boundaries, global references, extensions and cross-tenant rules |

### D. Functional module specifications

The following 18 legacy module specifications exist as draft documents. Their applicability is governed by DTE_MODULE_PHASE_DISPOSITION.md; they are not all current-phase scope and their existence does not mean they are approved or implementation-ready.

| Module | Document | Repository path | Status |
|---|---|---|---|
| M01 | DTE Dashboard Specification | `docs/dte/modules/DTE-M01_DASHBOARD_SPECIFICATION.md` | Existing — Draft |
| M02 | Question Inventory Specification | `docs/dte/modules/DTE-M02_QUESTION_INVENTORY_SPECIFICATION.md` | Existing — Draft |
| M03 | Tagging Studio Specification | `docs/dte/modules/DTE-M03_TAGGING_STUDIO_SPECIFICATION.md` | Existing — Draft |
| M04 | Classification Configuration Studio Specification | `docs/dte/modules/DTE-M04_CLASSIFICATION_CONFIGURATION_STUDIO_SPECIFICATION.md` | Rewritten v0.2.0 — Draft; Phase 1 |
| M05 | Relationship Mapping Engine Specification | `docs/dte/modules/DTE-M05_RELATIONSHIP_MAPPING_ENGINE_SPECIFICATION.md` | Existing — Draft |
| M06 | Archetype Management Specification | `docs/dte/modules/DTE-M06_ARCHETYPE_MANAGEMENT_SPECIFICATION.md` | Existing — Draft |
| M07 | Question Type Manager Specification | `docs/dte/modules/DTE-M07_QUESTION_TYPE_MANAGER_SPECIFICATION.md` | Existing — Draft |
| M08 | Pedagogical Metadata Manager Specification | `docs/dte/modules/DTE-M08_PEDAGOGICAL_METADATA_MANAGER_SPECIFICATION.md` | Existing — Draft |
| M09 | PYQ Provenance Manager Specification | `docs/dte/modules/DTE-M09_PYQ_PROVENANCE_MANAGER_SPECIFICATION.md` | Existing — Draft |
| M10 | Review & Approval Specification | `docs/dte/modules/DTE-M10_REVIEW_APPROVAL_SPECIFICATION.md` | Rewritten v0.2.0 — Draft; Phase 1 |
| M11 | Version & History Manager Specification | `docs/dte/modules/DTE-M11_VERSION_HISTORY_MANAGER_SPECIFICATION.md` | Existing — Draft |
| M12 | Bulk Tagging Manager Specification | `docs/dte/modules/DTE-M12_BULK_TAGGING_MANAGER_SPECIFICATION.md` | Existing — Draft |
| M13 | Validation & Quality Engine Specification | `docs/dte/modules/DTE-M13_VALIDATION_QUALITY_ENGINE_SPECIFICATION.md` | Existing — Draft |
| M14 | Coverage & Productivity Analytics Specification | `docs/dte/modules/DTE-M14_COVERAGE_PRODUCTIVITY_ANALYTICS_SPECIFICATION.md` | Existing — Draft |
| M15 | Configuration Version Manager Specification | `docs/dte/modules/DTE-M15_CONFIGURATION_VERSION_MANAGER_SPECIFICATION.md` | Existing — Draft |
| M16 | Historical Enrichment Interface Specification | `docs/dte/modules/DTE-M16_HISTORICAL_ENRICHMENT_INTERFACE_SPECIFICATION.md` | Existing — Draft |
| M17 | AI Assistance Interface Specification | `docs/dte/modules/DTE-M17_AI_ASSISTANCE_INTERFACE_SPECIFICATION.md` | Existing — Draft |
| M18 | External Engine Integration Specification | `docs/dte/modules/DTE-M18_EXTERNAL_ENGINE_INTEGRATION_SPECIFICATION.md` | Existing — Draft |

### E. Shared workflow, state and governance specifications

| ID | Document | Primary owner | Status | Notes |
|---|---|---|---|---|
| DTE-DOC-023 | Workflow State Machines & Transition Catalogue | Product + Architecture | Planned | Normative states, guards, actors, side effects and events |
| DTE-DOC-024 | Review, Approval & Publication Governance | Product + Quality | Planned | Human authority, re-review triggers, publication and separation of duties |
| DTE-DOC-025 | Bulk Operations, Import Validation & Recovery | Product + Engineering | Planned | Preview, quarantine, idempotency, partial failure and retry |
| DTE-DOC-026 | Duplicate, Merge, Split & Identity Adjudication Workflow | Product + Data Governance | Planned | Human-governed identity decisions and reference preservation |
| DTE-DOC-027 | Historical Enrichment & Reconciliation Workflow | Product + Integration | Planned | Idempotency, checkpoints, provenance and external reconciliation |
| DTE-DOC-028 | Validation Rules, Completeness Profiles & Quality Metrics | Product + Quality | Planned | Institution-configured validation; completeness not a universal tag count |

### F. UX and interface specifications

| ID | Document | Primary owner | Status | Notes |
|---|---|---|---|---|
| DTE-DOC-029 | Information Architecture & Screen Inventory | UX + Product | Planned | All screens, routes, navigation and role visibility |
| DTE-DOC-030 | Design System & Interaction Standards | UX | Planned | Shared components, responsive behaviour, keyboard/touch and accessibility |
| DTE-DOC-031 | Cross-Module UX Flows & Screen Specifications | UX + Module Owners | Planned | Avoid duplicating module functional specifications |
| DTE-DOC-032 | Search, Filtering, Bulk Selection & Large-Inventory UX | UX + Engineering | Planned | Server-side query behaviour, pagination and selection safeguards |

### G. Security, privacy and audit

| ID | Document | Primary owner | Status | Notes |
|---|---|---|---|---|
| DTE-DOC-033 | Security Architecture & Threat Model | Security + Architecture | Planned | Trust boundaries, attack surfaces and mitigations |
| DTE-DOC-034 | Authorization, RLS & Tenant-Isolation Policy | Security + Backend | Planned | Server-side enforcement and negative cross-tenant tests |
| DTE-DOC-035 | Audit, Evidence, Licensing & Data-Access Policy | Security + Product | Planned | Actor/action/reason, source rights, restricted content and audit access |

### H. API and external integration contracts

| ID | Document | Primary owner | Status | Notes |
|---|---|---|---|---|
| DTE-DOC-036 | API Catalogue & Contract Standards | Architecture + Backend | Planned | Endpoint schemas, errors, auth, pagination and compatibility |
| DTE-DOC-037 | Event Catalogue & Delivery Semantics | Architecture + Backend | Planned | Ordering, idempotency, retries, replay and dead-letter handling |
| DTE-DOC-038 | DRE Integration Contract | DTE + DRE owners | Planned | Pointer/reference contract only; DTE does not calculate difficulty |
| DTE-DOC-039 | Student Tracking Integration Contract | DTE + Student Tracking owners | Planned | Exact question/version/placement references; student evidence remains external |
| DTE-DOC-040 | Q-GENOME & Question Content Ownership Contract | Product + Architecture | Planned | Shared intelligence boundary and canonical question-content ownership decision |
| DTE-DOC-041 | External Content Placement & Import/Export Contract | DTE + Content System owners | Planned | Placement references, source context and file formats |

### I. AI assistance governance

| ID | Document | Primary owner | Status | Notes |
|---|---|---|---|---|
| DTE-DOC-042 | AI Assistance Architecture & Allowed Operations | AI + Product | Planned | Advisory boundary, no academic hierarchy generation |
| DTE-DOC-043 | AI Suggestion Evidence, Confidence & Human Review Policy | AI + Quality | Planned | Existing approved values only; evidence and human acceptance |
| DTE-DOC-044 | AI Model/Prompt Versioning & Evaluation Plan | AI + QA | Planned | Evaluation datasets, drift, audit and regression |

### J. Verification, release and operations

| ID | Document | Primary owner | Status | Notes |
|---|---|---|---|---|
| DTE-DOC-045 | DTE Quality Strategy & Test Plan | QA | Planned | Functional, integration, regression and acceptance strategy |
| DTE-DOC-046 | Security, Tenant-Isolation & Data-Integrity Test Suite | QA + Security | Planned | RLS, permissions, referential integrity and destructive-action tests |
| DTE-DOC-047 | Performance, Scale & Resilience Test Plan | QA + Architecture | Planned | Large inventory, concurrent tagging, bulk jobs and recovery |
| DTE-DOC-048 | Development, GitHub & Codex Workflow | Engineering Lead | Planned | Branching, reviews, coding rules and AI-assisted change control |
| DTE-DOC-049 | CI/CD, Environment & Deployment Specification | DevOps | Planned | Environments, secrets, migrations, release and rollback |
| DTE-DOC-050 | Monitoring, Backup, Incident & Operations Runbook | Operations | Planned | Observability, restore tests, incident response and support |

### K. Phase-aware current and future specifications

| ID | Document | Repository path | Status |
|---|---|---|---|
| P1-OPS | Offline Tagging Operating Model | `docs/dte/current-phase/DTE-P1_OFFLINE_TAGGING_OPERATING_MODEL.md` | New — Draft |
| P1-FRAME | Framework Configuration Specification | `docs/dte/current-phase/DTE-P1_FRAMEWORK_CONFIGURATION_SPECIFICATION.md` | New — Draft |
| P1-TEMPLATE | Offline Template & Handoff Specification | `docs/dte/current-phase/DTE-P1_TEMPLATE_AND_HANDOFF_SPECIFICATION.md` | New — Draft |
| P1-REQ | Phase 1 Requirements & Acceptance Baseline | `docs/dte/current-phase/DTE-P1_REQUIREMENTS_AND_ACCEPTANCE_BASELINE.md` | New — Draft |
| PHASE-ROADMAP | Product Scope & Phase Roadmap | `docs/dte/DTE_PRODUCT_SCOPE_AND_PHASE_ROADMAP.md` | New — Draft |
| MODULE-DISPOSITION | Module Phase Disposition | `docs/dte/DTE_MODULE_PHASE_DISPOSITION.md` | New — Draft |
| FULL-AUDIT-002 | Full Documentation Audit | `docs/dte/audits/DTE_FULL_DOCUMENTATION_AUDIT_002.md` | New — Draft |\n| FUTURE-ARCH | Future Upload & Digital Tagging Discovery | `docs/dte/future-phases/DTE-FUTURE_UPLOAD_AND_DIGITAL_TAGGING_DISCOVERY.md` | New — Draft — Deferred phase design input |

## 7. Existing audit and decision records

These are supporting governance records and are not counted as additional core specifications.

| Record | Repository path | Current status | Purpose |
|---|---|---|---|
| 18-Module Architecture Audit | `docs/dte/audits/DTE_18_MODULE_AUDIT.md` | Existing — Draft findings | Cross-module architectural findings; remediation required |
| Semantic Scope Audit | `docs/dte/audits/DTE_SEMANTIC_SCOPE_AUDIT_001.md` | Existing — Draft | Checks alignment with institution-owned classification scope |
| Scope Compliance Audit | `docs/dte/audits/DTE_SCOPE_COMPLIANCE_AUDIT_001.md` | Existing — Draft | Presence-level clarification check; not semantic certification |
| Semantic Scope Remediation | `docs/dte/audits/DTE_SEMANTIC_SCOPE_REMEDIATION_001.md` | Existing — Draft verification | Records wording remediation in affected module specifications |
| DEC-001 Mapping Attachment Policy | `docs/dte/decisions/DTE_QUESTION_CLASSIFICATION_ATTACHMENT_POLICY.md` | Existing — Draft — Deferred | Digital question mapping attachment policy; not a current offline-phase dependency |
| DEC-002 Logical Question Identity Policy | `docs/dte/decisions/DTE_LOGICAL_QUESTION_IDENTITY_POLICY.md` | Existing — Draft — Deferred | Digital identity/version policy; not a current offline-phase dependency |
| DEC-003 Q-GENOME Question Ownership | `docs/dte/decisions/DTE_QGENOME_QUESTION_OWNERSHIP_DECISION.md` | Existing — Draft — Deferred | Reassess during later question-upload/digital-tagging phase |
| DEC-004 Current Phase Boundary | `docs/dte/decisions/DTE_CURRENT_PHASE_BOUNDARY_DECISION.md` | New — Draft | Defines offline tagging framework now; separate question upload and digital tagging later |

## 8. Consolidation and improvement decisions

The earlier broad 97-entry proposal has been consolidated into **50 core documentation entries**, plus the 18 module specifications and supporting audit/decision records.

The following changes reduce duplication and ambiguity:

1. Product vision, PRD, scope and functional requirements are separated only where they have different owners and approval purposes; detailed business rules are captured in the requirements baseline rather than repeated across module files.
2. Question identity, version and placement are consolidated into one policy document, while mapping attachment and relationship resolution remain a separate policy because their lifecycle and semantics differ.
3. Question type, archetype and pedagogical metadata share one domain-model document, while their module specifications remain separate.
4. Review/publication, configuration versioning and history are documented as distinct responsibilities with one shared state-transition catalogue; they must not become competing lifecycle authorities.
5. API standards and event delivery semantics are separate because synchronous request/response and asynchronous event processing have different guarantees.
6. RLS/tenant isolation is not repeated as disconnected principles; one normative authorization policy will be referenced by all modules.
7. AI architecture, human review/evidence and model evaluation are separated by responsibility, not by every individual AI feature.
8. Separate manuals for every role, separate screen documents for every page, and standalone documents for minor implementation details are deferred unless later complexity justifies them.
9. DRE, Student Tracking, Q-GENOME and content systems are integration boundaries only. Their internal specifications do not belong in the DTE documentation set.

## 9. Priority and approval gates

### Gate 0 — Documentation governance
- Approve product boundary and glossary.
- Approve this master register and document lifecycle.
- Assign owners and reviewers.

### Gate 1 — Offline tagging framework baseline
- Confirm the exact institution-owned structures and fields the software must manage, without designing academic bifurcation.
- Define tagging terminology, category/field semantics and permitted relationships.
- Define offline tagging instructions, templates/sheets and human assignment conventions.
- Define completeness, validation, review, correction and approval rules for offline tagging records.
- Define roles and authority for framework configuration, tagging, checking and approval.
- Record examples and edge cases supplied or approved by the institution.

### Gate 2 — Offline operating model and verification
- Complete end-to-end offline tagging workflows, including preparation, assignment, checking, correction, approval and version/change control.
- Complete responsibility matrix and role/permission model for the current phase.
- Complete testable requirements and traceability for the offline framework-management software.
- Audit the existing M01–M18 specifications and retain, revise, defer or retire each against the current phase.
- Obtain explicit product-owner approval of the current-phase documentation baseline.

### Gate 3 — Later-phase discovery (not current implementation authorization)
- Define question upload/ingestion and digital tagging requirements as a separate module.
- Resolve question identity/version/placement, canonical content ownership and Q-GENOME boundary only when required by that later-phase design.
- Define digital data model, APIs/events, migrations, security and scale requirements for the later phase.

### Gate 4 — Implementation readiness
- Complete verification, security, performance and operational requirements for the phase being implemented.
- Obtain explicit product and technical baseline approval for that phase.

**No implementation is authorized by this register. Current-phase implementation remains prohibited until its documentation is reviewed and explicitly approved. Later-phase decisions must not be pulled into the current baseline merely to complete the older architecture plan.**

## 10. Open decisions and unresolved audit findings

| ID | Issue | Severity | Required decision/evidence |
|---|---|---|---|
| DTE-OPEN-001 | Offline tagging framework requirements and institution-approved structure representation | High | Approved framework specification, field definitions and offline tagging instructions |
| DTE-OPEN-002 | Offline tagging record/template format and required evidence | High | Approved template/sheet structure and completion rules |
| DTE-OPEN-003 | Current-phase role authority, review and correction workflow | High | Approved responsibility and workflow matrix |
| DTE-DEFER-001 | Digital question identity/version/placement policy (DEC-002) | Deferred | Reopen during later upload-and-tagging phase |
| DTE-DEFER-002 | Digital mapping attachment/inheritance policy (DEC-001) | Deferred | Reopen during later upload-and-tagging phase |
| DTE-DEFER-003 | Q-GENOME canonical question ownership (DEC-003) | Deferred | Reopen only if required by later digital architecture |
| DTE-OPEN-004 | Module entity/workflow ownership overlaps | High | Approved responsibility matrix |
| DTE-OPEN-005 | Normative workflow state machines absent | High | Transition tables and negative cases |
| DTE-OPEN-006 | Roles, permissions and separation of duties incomplete | High | Approved permission matrix and RLS design |
| DTE-OPEN-007 | API/event contracts incomplete | High | Versioned schemas and delivery/error semantics |
| DTE-OPEN-008 | Global/shared taxonomy governance unresolved | High | Cross-tenant reference and extension policy |
| DTE-OPEN-009 | Schema migration and historical reinterpretation incomplete | High | Migration and historical-read policy |
| DTE-OPEN-010 | Executable acceptance criteria and traceability absent | High | Requirement-to-test evidence |
| DTE-OPEN-011 | NFR and quantitative capacity targets incomplete | Medium | Approved service and scale targets |
| DTE-OPEN-012 | AI governance operational controls incomplete | Medium | Evaluation, monitoring, escalation and override evidence |

## 11. Document-level minimum template

Every normative specification should include:
- Document ID, title, version, status, owner and reviewers.
- Purpose, scope and explicit exclusions.
- Normative terms: MUST, MUST NOT, SHOULD and MAY.
- Actors, permissions and preconditions.
- Data/entities and ownership references.
- Workflow and state transitions.
- Business rules and edge cases.
- API/event dependencies where applicable.
- Security, tenant and audit requirements.
- Acceptance criteria with test IDs.
- Dependencies, open decisions and unresolved assumptions.
- Change history and approval record.

Decision papers additionally record options considered, selected direction, consequences, unresolved conditions and explicit approval. Audit reports additionally record evidence examined, findings, severity, remediation owner, closure evidence and limitations.

## 12. Change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.2.0 | 2026-11-06 | Draft | Audited and consolidated documentation architecture; established 50 core documents, mapped 18 existing module specifications and existing audit/decision records, added ownership, dependencies, gates and open-decision tracking |
| 0.3.0 | 2026-11-06 | Draft | Rebased current scope to offline tagging framework definition/management; deferred question upload, digital inventory/tagging, question identity/version and Q-GENOME decisions to a separate later phase; added phase applicability and revised approval gates |\n| 0.4.0 | 2026-11-06 | Draft | Added full phase-aware audit, product roadmap, legacy module disposition and Phase 1 operating model, framework configuration, template/handoff and requirements baselines |\n| 0.4.1 | 2026-11-06 | Draft | Added future question upload and digital-tagging discovery brief to the controlled documentation register |\n| 0.4.2 | 2026-11-06 | Draft | Updated M04 register status after complete Phase 1 rewrite and GitHub verification |\n| 0.4.3 | 2026-11-06 | Draft | Updated M10 register status after complete Phase 1 review/approval rewrite; aligned header version with latest changelog |

## 13. Approval

- Product owner approval: Pending
- Architecture approval: Pending
- Security review: Pending
- QA review: Pending
- Implementation authorization: Not granted
