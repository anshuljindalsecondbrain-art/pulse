# PULSE — Configurable Tagging System: Scope and Functional Proposal

- Document ID: PULSE-DTE-CHG-001
- Version: 0.1.0
- Status: Draft — proposed scope change; pending product, architecture and academic approval
- Product area: Deep Tagging Engine / Configurable Academic Classification
- Owner: Product Owner
- Date: 2026-11-06
- Change ID: PULSE-CHG-2026-11-06-001
- Related: D-002, D-003, D-004, D-005, D-007, D-009; PULSE-DTE-DEC-004
- Implementation authorization: Not granted

## 1. Purpose and status

This document consolidates the configurable tagging requirements developed in the current product-planning conversation (Parts 2.1–2.7). It is a proposed scope change and detailed functional baseline candidate. It does not silently replace the existing DTE current-phase boundary decision, which defines the current phase as offline framework management and excludes digital question inventory and digital question tagging.

The product owner must explicitly decide whether the digital configurable tagging capability is:
1. a replacement for the current offline-only phase;
2. a new subsequent phase; or
3. a separate product module that consumes the institution-approved framework.

Until that decision is recorded and approved, the existing phase boundary remains the controlling repository baseline.

## 2. Confirmed product requirements from the planning conversation

1. PULSE provides configurable tagging software; it does not prescribe an academic taxonomy.
2. Each institute owns and defines its own tagging bifurcation/classification structure.
3. PULSE may provide optional starter templates, but use of a template is not compulsory.
4. An institute may create multiple named tagging structures.
5. Structures may be assigned to different academic contexts, including courses, examinations, batches, books, modules and exercises, subject to scope/precedence rules.
6. Structures may be reused across institutes through controlled export/import or cloning. Cross-institute live shared editing, ownership and licensing are not yet decided.
7. The same canonical question may have different contextual classifications in different academic settings.
8. Contextual mappings must remain independent; editing one context must not overwrite another.
9. A tagging structure and a teaching structure are distinct. Tagging structure defines how a question is classified; teaching structure defines how an institute organizes and sequences instruction.
10. The same question may have different contextual difficulty interpretations (for example, difficult in one exam context and easy in another). Difficulty calculation, scoring rules and difficulty history remain owned by the separate Difficulty Rule Engine (DRE), consistent with D-005. DTE must not implement difficulty algorithms.
11. Student Work Tracking must operate independently of tagging completeness. Original student evidence remains immutable.
12. Student-level and batch-level performance analytics belong to Student Tracking / the analytics domain. DTE may expose classification metadata and integration references; it must not own or rewrite student attempts, results or performance evidence.
13. No AI-generated taxonomy or AI question tagging is authorized by this proposal.

## 3. Scope reconciliation required

The latest planning proposal includes digital question mapping, manual tagging and progress analytics. Existing repository governance explicitly excludes those capabilities from the current offline-only DTE phase.

The following ownership reconciliation is mandatory:

| Capability | Proposed owner | Boundary |
|---|---|---|
| Institute-defined classification structures | DTE / Configurable Tagging | Structure definitions, versions, labels, relationships and rules |
| Tag values and hierarchy | DTE / Configurable Tagging | Institute-owned vocabulary and configuration |
| Question identity, content version and placement | QBMS / Q-GENOME / question domain | Separate canonical ownership decision required before digital implementation |
| Contextual question-to-tag mapping | DTE / classification mapping domain | Must reference canonical question identity/version/context; no duplicate question ownership |
| Contextual difficulty calculation and history | DRE | DTE may retain only an approved external reference/integration pointer |
| Teaching structure and teaching coverage | Academic Planning / Student Tracking domain | Separate from classification hierarchy |
| Assignments, attempts, doubts and student evidence | Student Tracking | Immutable operational evidence; independent of DTE completeness |
| Student/batch analytics | Student Tracking / Analytics | Consume classification mappings without making DTE the owner of student evidence |
| Cross-institute template distribution | Platform governance | Copy/import semantics initially; shared live editing and licensing remain open |

No database entity, API, migration or implementation plan is approved by this proposal.

## 4. Target architecture

The proposed configurable tagging capability is organized into these functional areas:

1. Structure Manager — create, list, duplicate, archive and inspect institute structures.
2. Hierarchy Builder — define custom levels, relationships, selection modes and required/optional rules.
3. Tag Master Manager — create, edit, import, deactivate, merge and inspect tag values.
4. Structure Assignment Manager — assign a published structure/version to a defined academic scope.
5. Contextual Mapping — attach classification values to a question within a defined academic context, when digital question integration is approved.
6. Manual Tagging Studio — classify questions using the structure assigned to the selected context, when digital question integration is approved.
7. Bulk Tagging — apply common values to selected questions with preview, exceptions and audit.
8. Governance — permissions, change requests, approvals, versions, history and migration.
9. Integration surfaces — expose mapping metadata to Student Tracking, Analytics and DRE without taking ownership of their data.

This is a logical module map, not a mandate for separate deployable services or top-level navigation entries.

## 5. Structure architecture requirements

### 5.1 Structure identity and versioning

- Every structure has a stable identity independent of its versions.
- Every structure belongs to an institute/tenant unless explicitly governed as a platform template.
- Published versions are immutable.
- Draft edits do not mutate published versions.
- New published configuration creates a new version.
- Existing mappings and assignments retain the exact version against which they were created.
- Structural changes require impact analysis and explicit migration; no silent remapping.
- Archiving/deactivation prevents ordinary new use while preserving historical references.

### 5.2 Custom hierarchy

Institutes may configure:
- arbitrary institution-approved level names;
- configurable number of levels within platform safety limits;
- flat groups or hierarchical groups;
- required, optional or conditional fields;
- single-select or multi-select fields;
- parent-child dependencies;
- optional multiple-parent relationships;
- independent classification groups;
- localized labels, aliases and descriptions;
- display order, active state and stable internal codes.

A fixed Subject → Chapter → Topic → Concept hierarchy must not be imposed. Any example taxonomy is illustrative only.

### 5.3 Tag master

Tag values must have stable identities separate from display labels. Support aliases, localized labels, descriptions, parent relationships, ordering, active/inactive state and usage references. Used values should normally be deactivated rather than destructively deleted. Merge operations must preserve old-to-new lineage and affected mapping history.

### 5.4 Structure assignment

Potential assignment scopes:
- institute;
- course;
- examination;
- batch;
- book;
- module;
- exercise.

The assignment model must define effective dates, applicable structure version, override rules and conflict resolution. A proposed specificity order is exercise → module → book → batch → course → exam → institute default, but this precedence is not yet approved and should be configurable only if deterministic conflict semantics can be guaranteed. Incompatible structures must never be silently combined.

### 5.5 Cross-institute reuse

Export/import/clone should create an independent copy by default. Imported structures require ownership, source attribution, compatibility checks and new tenant-scoped identities. Shared live editing, global updates, licensing and intellectual-property rules remain open decisions.

## 6. Contextual question mapping

Subject to approval of the later digital question domain:

- One canonical question identity may have multiple academic-context mappings.
- Each mapping identifies the applicable institute, context, structure identity and structure version.
- Each mapping has independent classification values and revision history.
- A mapping in JEE Main must not overwrite a mapping in JEE Advanced.
- A mapping must distinguish canonical question identity, exact content version and placement/slot according to the approved attachment policy.
- The same question may be reused across books, modules, exercises, batches and tests without creating accidental duplicate question identities.
- Mapping changes record actor, timestamp, reason, previous state, new state and review/publication outcome.
- Historical student attempts are not rewritten when a question is tagged later.
- Later enrichment may create derived associations for analytics, while original evidence remains immutable.

The question identity/version/placement and mapping attachment policies must be reconciled with D-004 and existing deferred DTE decisions before any schema work.

## 7. Teaching structure and difficulty boundaries

### 7.1 Teaching structure

Teaching structure is not a synonym for tagging structure.

- Tagging structure: classification vocabulary and rules for questions.
- Teaching structure: institute-defined organization, sequencing and coverage of instruction.
- A batch may use one tagging structure and a different teaching structure.
- A question may be mapped to one or more teaching units where authorized.
- Teaching coverage must not be inferred merely because a question has a classification tag.

### 7.2 Difficulty

Contextual difficulty can differ by examination or batch context. However, D-005 assigns difficulty rules, scores, thresholds, multipliers and history to DRE. DTE must not calculate difficulty or own difficulty history. The UI may display a DRE-supplied contextual difficulty result/reference if the integration contract is approved.

## 8. Governance and permissions

Proposed roles:
- Institute Owner / Administrator
- Academic Head
- Subject Coordinator
- Faculty / Tagger
- Academic Reviewer
- Viewer

Permissions must be granular and scope-aware. Suggested governance modes:
1. Centralized administration.
2. Suggestion and approval.
3. Delegated academic control.

Suggested lifecycle dimensions must remain separate:
- configuration lifecycle: Draft → In Review → Published → Superseded / Archived;
- tagging work status;
- review status;
- publication status;
- validation status.

Published configurations and mappings are versioned. Every sensitive action must have an audit event. Cross-institute imports are independent copies unless a later sharing decision explicitly defines otherwise.

## 9. Functional workspaces and screen inventory

The following is a proposed navigation inventory. Screen entries are not necessarily separate routes; detail panels, tabs, drawers and modals should be used where they reduce navigation overhead.

### Workspace A — Overview
- TAG-001 Tagging Dashboard
- TAG-002 My Work Dashboard
- TAG-003 Recent Activity
- TAG-004 Pending Actions

### Workspace B — Academic Structures
- TAG-005 Structure Manager
- TAG-006 Create Structure
- TAG-007 Structure Detail
- TAG-008 Hierarchy Builder
- TAG-009 Tag Master Manager
- TAG-010 Tag Detail Editor
- TAG-011 Teaching Structure Manager
- TAG-012 Teaching Structure Builder
- TAG-013 Difficulty Structure/Integration Settings (DRE-owned rules; DTE must not implement scoring)
- TAG-014 Optional Template Library
- TAG-015 Import / Export Structures

### Workspace C — Question Tagging (later digital phase unless scope decision changes)
- TAG-016 Question Tagging Dashboard
- TAG-017 Context Selector
- TAG-018 Question Navigator
- TAG-019 Manual Tagging Studio
- TAG-020 Contextual Difficulty Display / DRE reference
- TAG-021 Teaching Placement Editor
- TAG-022 Bulk Tagging Workspace
- TAG-023 Offline Question Reference Manager, if offline operations remain required
- TAG-024 Question Mapping History
- TAG-025 Incomplete Tagging Queue

### Workspace D — Academic Assignments
- TAG-026 Assignment Manager
- TAG-027 Assignment Detail
- TAG-028 Contextual Question Mapping
- TAG-029 Mapping Conflict Resolver
- TAG-030 Structure Assignment Preview

### Workspace E — Governance
- TAG-031 Roles & Permissions
- TAG-032 Governance Settings
- TAG-033 Change Request Inbox
- TAG-034 Change Request Detail
- TAG-035 Structure Version History
- TAG-036 Version Comparison
- TAG-037 Change Impact Analysis
- TAG-038 Migration Manager
- TAG-039 Audit Log

### Workspace F — Analytics integration (not DTE ownership)
The earlier planning inventory included:
- TAG-040 Academic Progress Dashboard
- TAG-041 Student Progress Profile
- TAG-042 Batch Progress Dashboard
- TAG-043 Chapter-wise Analytics
- TAG-044 Tag-wise Analytics
- TAG-045 Difficulty Analytics
- TAG-046 Doubt Radar
- TAG-047 Teaching vs Practice Dashboard
- TAG-048 Revision & Improvement Tracker
- TAG-049 Question Diagnostic View
- TAG-050 Structure Comparison Report

These are proposed Student Tracking / Analytics consumer views. They must not make DTE the owner of student attempts, attendance, doubts, results or learning evidence. They should be placed in the owning product domain's screen register after cross-domain review.

## 10. Detailed foundational UI/UX requirements

### 10.1 TAG-001 — Tagging Dashboard

Purpose: operational entry point for structure configuration and, if approved, contextual tagging.

Context filters may include academic year, course, exam, subject, batch, book/module, structure and version. Institute administrators may view institute-wide scope; faculty should see authorized scope only.

Dashboard components:
- active structures;
- unique questions in scope (only after digital question integration is approved);
- contextual mapping count;
- fully mapped / incomplete mapping count;
- coverage by configured mandatory fields;
- pending work queue;
- recent activity;
- quick actions.

Do not conflate canonical question count with contextual mapping count. Coverage must use a named, versioned completeness profile. Student performance analytics remain in Student Tracking/Analytics.

States: new institute, no structures, no assignments, no question integration, active work, no permission, loading and technical error.

### 10.2 TAG-005 — Structure Manager

Purpose: list and manage institute-owned structures.

Table fields: structure name, stable code, subject/scope labels, level/group count, current published version, lifecycle status, assignment count, mapping count (where digital integration exists), owner and last updated.

Filters: name/code, subject, exam, status, creator, assigned/unassigned. Actions: open, edit draft, duplicate, create new version, assign, inspect usage, export and archive. Published versions must not be destructively edited.

Structure detail tabs: Overview, Hierarchy, Tag Values, Assignments, Usage, Versions and Audit. Hide or omit usage metrics that depend on future digital question records.

### 10.3 TAG-006 — Create Structure

Wizard:
1. Basic information.
2. Creation method: scratch, optional PULSE template, or duplicate an institute structure.
3. Intended academic scope.
4. Hierarchy/group configuration.
5. Field/tagging rules.
6. Preview.
7. Save draft, submit for review or publish according to governance.

Basic fields: name, stable code, description, subject applicability, exam applicability, intended use, owner and optional keywords. Scope assignment is a separate operation from structure creation.

Validation: required name/code, tenant-scoped uniqueness, at least one valid group/field, valid relationship graph, no cycles, consistent selection rules and publication validation.

### 10.4 TAG-008 — Hierarchy Builder

Recommended desktop composition:
- left: structure tree / classification groups;
- center: selected level/field editor;
- right: properties, validation and preview.

Properties: label, stable internal code, description, position, data/selection type, required/optional/conditional rule, parent dependency, multiple-parent option, display order, localization, aliases and active state.

Operations: add, rename, reorder, configure, deactivate, preview and remove only when safe. Published structure edits create a new version. Default to a strict tree; support multiple parents or independent groups only when explicitly configured.

Validation: no cycles, duplicate stable codes, invalid ordering, unresolved parent references or destructive removal of referenced elements.

### 10.5 TAG-009 — Tag Master Manager

Purpose: manage selectable values independently of the hierarchy definition.

Layout: structure/version selector; group/level selector; searchable values table; detail drawer.

Fields: display label, stable code/identity, parent or relationship, description, aliases, localized labels, ordering, active state and optional metadata.

Operations: create, edit draft, duplicate, import, export, deactivate, merge and inspect usage. Do not automatically merge semantically similar labels. Used values should be deactivated rather than deleted. Import should include column mapping, validation, duplicate preview, parent resolution, row-level errors and an auditable result.

### Shared components

- Academic Context Selector
- Structure and Version Selector
- Hierarchy Tree
- Tag Search
- Question Reference Card (future digital phase)
- Status Indicator with explicit status dimension
- Activity Timeline
- Audit Drawer
- Confirmation Dialog
- Validation Summary

Desktop tagging studio may use a multi-panel workspace; mobile should use progressive steps rather than compressing a dense desktop layout.

## 11. Navigation and user journeys

Proposed top-level workspaces:
1. Overview
2. Academic Structures
3. Question Tagging (only after digital phase authorization)
4. Academic Assignments
5. Governance
6. Analytics integration entry points (deep links to Student Tracking/Analytics, not duplicate ownership)

Administrator journey: dashboard → create structure → configure hierarchy → populate tag values → validate → review/publish → assign to academic scope → manage permissions → monitor usage.

Faculty journey (future digital phase): select authorized context → select question → apply configured values → view DRE-supplied difficulty reference if available → set teaching placement if permitted → save → next question.

Academic head journey: use Student Tracking/Analytics → filter batch/exam → drill down by approved classification → inspect question/attempt evidence → plan revision. DTE only supplies classification definitions and mappings.

Context persistence: preserve institute, course, exam, subject, batch, book/module, structure identity and version across related screens. Retain filters and provide breadcrumbs, direct links, permission-aware actions, empty/loading/error states and audit history.

## 12. Data and technical constraints

- Do not create duplicate tables before inspecting existing schema and domain ownership.
- Preserve question identity, question version and placement as distinct concepts.
- Keep classification definitions separate from question-to-classification mappings.
- Keep archetype identity reusable and independent of one taxonomy parent.
- Keep Question Type distinct from difficulty.
- Keep DRE calculation/history outside DTE.
- Keep Student Tracking independent of tagging completeness.
- Preserve original student evidence immutably.
- Enforce tenant isolation and server-side authorization.
- Use additive, reviewed migrations only after an as-built Supabase audit.
- Do not use cascade deletion where it can remove questions, attempts, results or historical mappings.
- Use server-side pagination and indexed queries; support large question-bank scale only after explicit performance design.
- Do not commit secrets, student PII, production database dumps or private uploads.

## 13. Implementation and approval gates

No implementation is authorized by this proposal.

Before any digital tagging implementation:
1. Product owner chooses whether this proposal replaces, follows or separates from the offline-only phase.
2. Academic authority confirms the institute-owned structure configuration requirements.
3. Architecture owner resolves DTE/QBMS/Q-GENOME ownership and mapping attachment semantics.
4. DRE owner defines the contextual difficulty contract.
5. Student Tracking/Analytics owner confirms consumer integration and immutable evidence rules.
6. Repository owner confirms canonical documentation and traceability registers.
7. Database owner audits actual Supabase schema, migrations, RLS, functions and data dependencies.
8. UX and QA complete screen register, workflows, acceptance criteria and test evidence.
9. Security/privacy review and backup/restore requirements are approved.
10. Product owner issues explicit implementation authorization for the defined phase.

## 14. Open decisions

| ID | Decision required | Why it matters |
|---|---|---|
| CTS-OPEN-001 | Is digital configurable tagging the replacement for current Phase 1, a later phase, or a separate module? | Resolves conflict with PULSE-DTE-DEC-004 |
| CTS-OPEN-002 | Is question upload/inventory already owned by QBMS/Q-GENOME or another domain? | Prevents duplicate question ownership |
| CTS-OPEN-003 | Exact mapping attachment level: logical question, content version, placement or combination | Historical correctness |
| CTS-OPEN-004 | Structure assignment precedence and conflict resolution | Deterministic context selection |
| CTS-OPEN-005 | Cross-institute template sharing, licensing and live update policy | Tenant/IP boundaries |
| CTS-OPEN-006 | DRE interface for contextual difficulty display | Preserves D-005 |
| CTS-OPEN-007 | Teaching structure ownership and data model | Avoids taxonomy/teaching conflation |
| CTS-OPEN-008 | Analytics screen ownership and integration contracts | Preserves STS ownership |
| CTS-OPEN-009 | Role/permission matrix and separation of duties | Security and governance |
| CTS-OPEN-010 | Exact version migration and mapping history semantics | Prevents historical reinterpretation |
| CTS-OPEN-011 | Required offline workflows retained alongside digital tagging | Operational continuity |
| CTS-OPEN-012 | Quantified scale, latency, RPO and RTO | Production readiness |

## 15. Change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-11-06 | Draft | Consolidated configurable institute-owned structures, contextual mapping, governance, navigation, screen inventory and foundational UI/UX; explicitly recorded conflicts with existing offline-only DTE phase and DRE/STS ownership boundaries |

## 16. Approval

- Product owner: Pending
- Academic authority: Pending
- Architecture owner: Pending
- DRE owner: Pending
- Student Tracking/Analytics owner: Pending
- Security/database review: Pending
- Implementation authorization: Not granted
