# DTE Module Responsibility Matrix

- Document ID: PULSE-DTE-RACI-001
- Version: 0.1.0
- Status: Draft — proposed ownership model; not approved for implementation
- Product: PULSE — Deep Tagging Engine (DTE)
- Scope: Logical ownership and module boundaries for DTE-M01 through DTE-M18
- Last updated: 2026-11-06

## Governing scope clarification — classification management software

DTE manages institution-defined academic classification and tagging structures; it does not design, prescribe, generate or impose chapter-wise syllabus bifurcation, curriculum structure or a universal academic hierarchy. Institutions define their own categories and terminology. DTE provides the software to configure, record, map, search, validate, review, version, govern and report on those existing structures. Academic terms such as subject, chapter, topic and concept are examples of institution-managed data, not mandatory DTE levels or a curriculum-design function.

## 1. Purpose

This matrix resolves the ownership overlaps identified in the DTE 18-module audit. It proposes one authoritative owner for each DTE capability, governed entity and state transition.

**Status warning:** Every assignment below is a proposal for review. It does not mean that module owners, APIs, services or database tables have been approved. A logical module is not necessarily a separate microservice.

## 2. Responsibility principles

1. Every governed entity and business rule must have one authoritative owner.
2. Other modules may consume an owner's data or invoke its operations; they must not create competing sources of truth.
3. UI modules orchestrate user journeys but do not duplicate domain rules.
4. Shared infrastructure (identity, audit, version primitives, authorization, job execution) may be implemented once and consumed by many modules.
5. A module owns the lifecycle of its domain records, not necessarily every technical mechanism used to persist them.
6. External systems retain ownership of their own business data and calculations.
7. Where ownership is unresolved, the matrix must show an explicit decision rather than silently split authority.

## 3. Proposed authoritative ownership matrix

| ID | Module | Authoritative responsibility | Must not own / duplicate | Key consumers/dependencies |
|---|---|---|---|---|
| M01 | DTE Dashboard | Operational workspace composition, role-based summaries, navigation and alert presentation | Canonical metric definitions, analytics aggregation rules or source-of-truth records | M02, M10, M13, M14, M17 |
| M02 | Question Inventory | Question discovery, filtering, result navigation and inventory-facing query orchestration | Question identity/content master ownership if supplied by a separate Q-GENOME/content service; mapping rules | M03, M09, M12, M14 |
| M03 | Tagging Studio | Human-facing tagging workspace and orchestration of edit/submit actions | Classification schema definitions, mapping persistence semantics, review policy or validation rules | M02, M04–M13, M17 |
| M04 | Classification Configuration Studio | Authoring of classification schema definitions: groups, fields, nodes, edges, constraints, labels and dependencies | Schema publication/retirement lifecycle authority; question mapping assignments | M05, M07, M08, M13, M15 |
| M05 | Relationship Mapping Engine | Canonical relationship catalogue semantics and persistence of question/classification relationship mappings | Archetype content, PYQ evidence, question-to-question duplicate adjudication unless explicitly delegated | M03, M04, M06, M09, M13 |
| M06 | Archetype Management | Archetype identity, definition, metadata, relationships and lifecycle | Classification schema ownership or question content ownership | M03, M05, M11, M12 |
| M07 | Question Type Manager | Question Type catalogue definitions, labels, constraints and lifecycle | Difficulty scoring; duplicate schema/field engine | M03, M04, M08, M13 |
| M08 | Pedagogical Metadata Manager | Pedagogical metadata definition catalogue and assignment semantics | Difficulty formulas or generic classification schema lifecycle | M03, M04, M13 |
| M09 | PYQ Provenance Manager | Exam appearance, source evidence, verification and adapted-from provenance records | Question identity or general relationship persistence engine | M02, M03, M05, M11 |
| M10 | Review & Approval | Human review workflow, reviewer assignment, decisions, review gates and approval transitions | Schema version lifecycle; generic record revision storage; publication implementation mechanics | M03, M11, M13, M15 |
| M11 | Version & History Manager | Shared revision primitives, immutable history records, before/after snapshots or deltas, audit/event trace references | Business approval policy or schema lifecycle policy | All mutating modules; M10, M15 |
| M12 | Bulk Tagging Manager | Bulk job orchestration, import/export execution, dry runs, row-level outcomes, retries and job cancellation | Domain validation rules, classification semantics or review decisions | M02–M11, M13 |
| M13 | Validation & Quality Engine | Validation rule catalogue/execution, completeness profiles, quality findings and validation results | Human approval or schema publication decisions | M03–M12, M15, M17 |
| M14 | Coverage & Productivity Analytics | Metric definitions, aggregation semantics, analytical snapshots and reporting datasets | UI dashboard composition or mutation of source records | M01, administrators, operational reporting |
| M15 | Configuration Version Manager | Classification schema version lifecycle: draft/review readiness coordination/publish/retire/supersede and migration governance | General-purpose revision storage, question mapping review decisions | M04, M10, M11, M13, M14 |
| M16 | Historical Enrichment Interface | Student Tracking-specific enrichment adapter, reconciliation and consumer processing status | General external API catalogue or ownership of student evidence | M18, Student Tracking |
| M17 | AI Assistance Interface | AI tagging orchestration, candidate suggestions, evidence, model/prompt traceability and feedback | Automatic approval/publication or canonical mapping persistence without an authorized human/workflow action | M03–M13, approved AI provider |
| M18 | External Engine Integration | Cross-system API/event catalogue, consumer registration, authentication scopes, contract compatibility and delivery infrastructure | Consumer business logic, student analytics, DRE evaluation or M16's Student Tracking-specific enrichment policy | M16, DRE, Student Tracking, other approved consumers |

## 4. Cross-module ownership decisions proposed

### 4.1 M10 Review & Approval vs M15 Configuration Version Manager

**Proposal**
- M10 owns human review workflow primitives and review decisions.
- M15 owns schema-version lifecycle and effective-version resolution.
- M15 invokes M10 when a schema version requires human review.
- M10 records the review outcome; M15 applies the corresponding schema lifecycle transition after checking policy and validation gates.
- M11 stores revision/audit history for both.

**Boundary:** M10 does not decide which schema version is active. M15 does not implement a second review engine.

### 4.2 M11 Version & History vs M15 Configuration Version Manager

**Proposal**
- M11 is shared revision/history infrastructure.
- M15 owns schema-specific version lifecycle policy.
- M04 authors schema content.
- M15 determines draft/publish/retire/supersede and active-version resolution.
- M11 records snapshots/deltas and audit trace.

**Boundary:** A schema version is a domain concept governed by M15; storing its revision history is a shared capability of M11.

### 4.3 M16 Historical Enrichment vs M18 External Engine Integration

**Proposal**
- M18 owns common external integration infrastructure and the normative API/event catalogue.
- M16 owns the Student Tracking-specific adapter and enrichment/reconciliation semantics.
- M16 must consume versioned contracts published by M18.
- DRE integration is a separate consumer contract under M18 unless a dedicated adapter is later justified.

**Boundary:** M16 does not create a competing event bus/API framework. M18 does not own Student Tracking analytics or mutate student evidence.

### 4.4 M01 Dashboard vs M14 Analytics

**Proposal**
- M14 owns metric definitions, calculations, aggregation, time semantics and analytical datasets.
- M01 owns presentation, navigation, role-specific dashboard composition and alert display.
- M01 may not independently recalculate coverage or productivity metrics.

### 4.5 M05 Relationship Mapping vs domain-specific relationships

**Proposal**
- M05 owns generic relationship types, endpoint constraints, mapping persistence and shared relationship validation.
- M06 owns archetype records and archetype-specific business rules.
- M09 owns PYQ appearance and provenance evidence.
- M02 owns inventory search/display of duplicate indicators and adjudication workflow if that workflow remains in inventory; canonical duplicate/derived-from relationships should use a governed relationship contract.
- M05 may persist a domain relationship only when the domain owner has defined its semantics and authorized the relationship type.

**Open issue:** Decide whether duplicate/near-duplicate/adapted-from question relationships are owned by M02, M05 or a dedicated Q-GENOME service. Do not implement competing copies.

### 4.6 M04 Configuration vs M07 Question Type and M08 Pedagogical Metadata

**Proposal**
- M04 owns the generic schema metamodel and configurable classification groups/fields/nodes.
- M07 owns the Question Type domain catalogue and its semantics.
- M08 owns the Pedagogical Metadata domain catalogue and its semantics.
- M04 may provide a schema reference/extension mechanism, but it must not become a second authority for the actual Question Type or Pedagogical Metadata definitions.
- M15 governs lifecycle of schema versions; M11 supplies revision history.

**Open issue:** Determine whether M07/M08 catalogues are schema-defined field sets, independently versioned domain catalogues, or a hybrid. The ownership of semantic definitions remains M07/M08 under this proposal.

## 5. Shared platform capabilities — not duplicate module ownership

| Capability | Proposed technical owner | Domain authority |
|---|---|---|
| Authentication and tenant context | PULSE platform identity layer | Platform governance |
| Authorization enforcement | Shared policy layer / backend | Each module defines required permissions; platform enforces them |
| Row-level security | Database/platform security layer | Tenant/data ownership policy |
| Audit event transport/storage | Shared audit infrastructure, consumed via M11 | Each domain module defines auditable actions |
| Revision/snapshot primitives | M11 shared capability | Each domain module defines what is versioned |
| Background job runtime | Shared job infrastructure, orchestrated by M12/M16/M17 | Initiating domain module owns job semantics |
| Notifications | Shared notification service | Source module owns notification trigger/content |
| Search infrastructure | Shared search capability | M02 owns inventory search semantics |
| Observability | Shared platform capability | Each module owns its operational indicators |
| Localization framework | Shared platform capability | Domain modules provide canonical labels/translations |

## 6. External system boundaries

| System | Owns | DTE may provide/consume | DTE must not do |
|---|---|---|---|
| Q-GENOME / question identity service (if separated) | Stable question identity, question versions, source/content identity according to final ownership decision | Question/version/placement references; classification mappings | Create competing question identities or silently duplicate content masters |
| Student Tracking | Student assignment, attendance, attempt/evidence and learner analytics | Stable question/version references and mapping-change events; M16 adapter | Rewrite historical student evidence or own learner performance calculations |
| DRE | Difficulty rules, formulas, thresholds, exam scaling and evaluation results | Exact question/version references and external evaluation pointers | Calculate or own difficulty scores |
| Content/CMS | Books, courses, series, editions, exercises, tests and content placement | Source and placement references | Own full content lifecycle |

**Important unresolved ownership decision:** Whether Q-GENOME is a separate service or a shared domain layer within PULSE must be decided in the canonical data model. This matrix uses “if separated” deliberately.

## 7. Decision status and approval register

| Decision ID | Proposal | Status |
|---|---|---|
| R-01 | M14 owns metric definitions; M01 owns dashboard presentation | Proposed — review required |
| R-02 | M10 owns human review workflow; M15 owns schema lifecycle | Proposed — review required |
| R-03 | M11 owns shared revision/history primitives | Proposed — review required |
| R-04 | M18 owns common integration contracts; M16 owns Student Tracking adapter | Proposed — review required |
| R-05 | M05 owns generic relationship semantics/persistence; domain modules own domain meaning | Proposed — review required |
| R-06 | M07 owns Question Type definitions; M08 owns Pedagogical Metadata definitions; M04 owns generic schema metamodel | Proposed — review required |
| R-07 | Question identity master ownership (DTE vs Q-GENOME/content service) | Open — critical |
| R-08 | Duplicate/near-duplicate/adapted question relationship authority | Open — high |
| R-09 | Shared/global versus tenant-owned taxonomy governance | Open — high |
| R-10 | Mapping attachment level and version inheritance | Open — critical |

## 8. Required downstream updates after approval

Once this matrix is reviewed and approved:
1. Update the 18 module specifications to reflect authoritative ownership and remove duplicate responsibilities.
2. Update the DTE module register.
3. Create the canonical data model and ERD using the approved ownership.
4. Create the question identity/version and mapping attachment policy.
5. Align workflow state machines, roles/permissions, API/event contracts and end-to-end workflows.
6. Update the audit remediation tracker with evidence and closure status.

No module should be marked implementation-ready solely because this matrix is approved. All P0 findings in the audit must be closed and their dependent specifications reviewed.
