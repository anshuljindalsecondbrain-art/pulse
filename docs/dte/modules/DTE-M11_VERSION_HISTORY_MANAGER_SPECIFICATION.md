# DTE-M11 — Version & History Manager Specification

- Document ID: PULSE-DTE-M11
- Version: 0.2.0
- Status: Draft — Phase 1 rewrite; pending product, architecture and operations review
- Phase: Current — offline tagging framework and operating management
- Governing references:
  - `docs/dte/DTE_PRODUCT_SCOPE_AND_PHASE_ROADMAP.md`
  - `docs/dte/DTE_MODULE_PHASE_DISPOSITION.md`
  - `docs/dte/current-phase/DTE-P1_FRAMEWORK_CONFIGURATION_SPECIFICATION.md`
  - `docs/dte/current-phase/DTE-P1_OFFLINE_TAGGING_OPERATING_MODEL.md`
  - `docs/dte/current-phase/DTE-P1_REQUIREMENTS_AND_ACCEPTANCE_BASELINE.md`
  - `docs/dte/modules/DTE-M04_CLASSIFICATION_CONFIGURATION_STUDIO_SPECIFICATION.md`
  - `docs/dte/modules/DTE-M10_REVIEW_APPROVAL_SPECIFICATION.md`
- Last updated: 2026-11-06
- Implementation authorization: Not granted

## 1. Purpose

M11 defines the shared version identity, revision history, immutable snapshot, comparison and historical reconstruction capabilities required by the current DTE phase.

It provides common version/history rules for institution-approved framework configurations and, if confirmed in Phase 1, offline templates, work packages, submissions and review evidence.

M11 is the single logical owner of cross-cutting version/history semantics and history records. It does not take over the business lifecycle decisions owned by M04, M10 or the offline operating workflow. Those modules invoke shared version/history capabilities and remain responsible for their domain-specific actions.

## 2. Phase 1 scope

### 2.1 In scope

1. Stable identity and revision identifiers for versioned Phase 1 artifacts.
2. Draft revision tracking for framework configuration.
3. Immutable snapshots at defined workflow boundaries, such as submission and approval.
4. Framework version references used by offline instructions and templates.
5. Version pinning for work packages, where work-package management is confirmed.
6. History of material changes, review actions and lifecycle transitions.
7. Actor, timestamp, reason and source attribution.
8. Comparison of framework revisions and other supported versioned artifacts.
9. Historical reconstruction of the framework/template version associated with a past work package.
10. Supersession, retirement and rollback-by-new-revision controls.
11. Concurrency protection and stale-revision detection.
12. Permission-controlled history views and exports.
13. Retention-policy integration and audit integrity controls.

### 2.2 Explicitly out of scope in Phase 1

M11 MUST NOT implement:
- Question content versioning or question identity/version/placement.
- Digital question-to-tag mapping revisions or mapping history.
- Digital question inventory history.
- Uploaded PDF/image/DOCX question-content versioning.
- OCR/extraction/parser version histories.
- Student attempt, attendance, assignment or performance history.
- Test paper/version management or test delivery history.
- Difficulty/DRE calculation history.
- AI model/prompt/AI-tagging decision history as a DTE Phase 1 capability.
- General database backup/restore or disaster recovery operations.
- A separate version lifecycle for each module that duplicates shared M11 semantics.

Those domains may require future versioning contracts, but they must be designed and approved in their own phases.

## 3. Ownership and module boundaries

### 3.1 M11 owns

- Common version/revision identifier semantics.
- Common history event structure and query rules.
- Snapshot and diff conventions.
- Append-only history contract at the application level.
- Concurrency/stale-revision primitives.
- Historical reconstruction rules for supported Phase 1 artifacts.
- Common supersession and compensating-revision semantics.
- Version-reference validation and history access controls.

### 3.2 M11 does not own

| Domain action | Authoritative owner | M11 responsibility |
|---|---|---|
| Framework definition and editing | M04 | Assign/record revisions and preserve snapshots |
| Framework academic approval and activation decision | M10 plus approved framework lifecycle governance | Record exact decision/revision reference and history event |
| Offline work-package process/status | Phase 1 operating workflow / confirmed work-package owner | Preserve version references and status-change history |
| Review decision and correction workflow | M10 | Record review event and referenced revision |
| Structural validation rules/results | M13 or approved validation capability | Store/reference validation evidence; do not define rules |
| User identity and role assignment | Identity/authorization capability | Record actor reference and role context |
| Retention periods and legal deletion rules | Approved retention/security policy | Enforce configured retention behavior; do not invent periods |

No module may implement a competing version numbering, immutable snapshot or history event model without an approved architecture exception.

## 4. Core concepts and terminology

| Concept | Definition |
|---|---|
| Logical artifact identity | Stable identifier for the artifact across its revisions |
| Revision | A distinguishable state/change iteration of the same logical artifact |
| Revision number | Ordered sequence within one logical artifact; not a product release version |
| Snapshot | Captured representation of an artifact at a defined event boundary |
| Submitted snapshot | Exact revision submitted for review |
| Approved revision | Exact revision accepted by the authorized approver |
| Active version | Approved framework version currently designated for use |
| Superseded version | Previously approved/active version replaced for future use but retained historically |
| Retired version | Version no longer available for new work under policy, while history remains readable |
| History event | Append-only record of a material action/change/lifecycle event |
| Diff | Structured description of differences between two revisions |
| Compensating revision | New revision that reverses or corrects a prior state without deleting history |
| External reference | Identifier owned by another system or process; not a DTE-owned entity |

A logical artifact ID, revision ID, framework version ID, template version ID and work-package ID are distinct identifiers. They must not be used interchangeably.

## 5. Versioning model

### 5.1 Logical identity and revision

Each versioned artifact has:
- a stable logical artifact ID;
- an artifact type;
- a tenant/institution scope;
- one or more revision records;
- a current draft/revision pointer where applicable;
- lifecycle state managed by its domain owner;
- creation and change provenance.

Revision identifiers must be immutable and globally unambiguous within the relevant system boundary. The exact technical format is an open architecture decision. Human-readable sequence numbers may be shown, but must not be the sole security or referential-integrity mechanism.

### 5.2 Revision creation

A new revision is required when a material, persisted change is made to a version-controlled artifact. A material change includes:
- adding, changing or removing a framework group, field, value, relationship, instruction or validation configuration;
- changing required/optional/conditional settings;
- changing approved labels/definitions or permitted values;
- modifying a versioned template or offline instruction set;
- a correction that changes a submitted work-package result, if such results are managed in DTE.

The exact boundary between autosaved draft edits and formal revisions must be defined in the UX/data design. The system must not create misleading version history for transient UI state.

### 5.3 Snapshot boundaries

At minimum, the following boundaries require identifiable snapshots where applicable:
- framework draft submitted for academic review;
- framework revision approved;
- framework version activated;
- template/instruction package issued for use;
- work package issued with pinned framework/template versions;
- completed work-package submission received, if software intake is confirmed;
- review decision recorded against a submitted revision.

Snapshots must identify the logical artifact and exact revision. A review decision must never refer only to a mutable “latest” pointer.

### 5.4 Immutability

- A submitted snapshot cannot be silently overwritten.
- An approved framework version cannot be edited in place.
- An active/issued template or package version remains reconstructable.
- Changes after submission or approval create a new revision and follow the required review rules.
- Administrative correction of metadata must itself be audited; it must not rewrite the historical academic content of an approved snapshot.

Draft editing may be allowed until the relevant submission boundary, subject to permission and concurrency controls.

## 6. Phase 1 artifact coverage

| Artifact | Version/history requirement | Phase 1 status |
|---|---|---|
| Framework logical record | Stable identity | In scope |
| Framework draft revision | Revision history and comparison | In scope |
| Submitted framework snapshot | Immutable review target | In scope |
| Approved framework version | Immutable approved snapshot and approval reference | In scope |
| Active/superseded framework version | Effective lifecycle history | In scope |
| Offline template/instruction set | Versioned issue package and reproducibility | In scope if templates are generated/managed in DTE |
| Work package | Stable identity and pinned framework/template versions | Conditional on work-package management |
| Completed offline submission | Submission revision/history | Conditional on software intake |
| Review/approval event | Immutable event linked to exact revision | In scope where M10 workflow is used |
| Question content/version | No DTE Phase 1 record | Deferred |
| Digital question-tag mapping | No DTE Phase 1 record | Deferred |
| Student/test/difficulty evidence | External owner | Out of scope |

A question locator written on an offline sheet remains an external locator. M11 must not turn it into a question identity or version record.

## 7. History event model

Every material event should record, as applicable:

- event ID;
- tenant/institution scope;
- artifact type and logical artifact ID;
- revision ID and revision sequence;
- prior revision reference;
- event/action type;
- actor ID and role context;
- event timestamp;
- reason/comment;
- source channel (for example, authorized UI action, template issue, import of a completed offline sheet if approved, API or migration);
- workflow/review reference;
- framework/template/work-package references as applicable;
- correlation/idempotency reference;
- changed-field summary or structured diff reference;
- snapshot reference/checksum where implemented.

Sensitive values should not be copied into generic event payloads unnecessarily. History should reference protected snapshots or field-level evidence under the applicable access policy.

## 8. Comparison and historical reconstruction

Authorized users should be able to:

1. View the revision timeline for a supported artifact.
2. Compare two framework revisions.
3. Identify added, removed and changed groups, fields, values, relationships, instructions and constraints.
4. Identify who changed a value, when and why, where that information was captured.
5. View the exact framework version used by an issued work package.
6. Reconstruct the approved framework and template context associated with a historical offline package.
7. Identify the exact revision reviewed and the decision recorded by M10.
8. Distinguish current labels from historical labels.

Historical views must display the labels, definitions and relationships belonging to the historical snapshot. If the UI also shows current labels for convenience, they must be clearly distinguished and must not replace historical values.

Reconstruction must not depend on the current mutable configuration. If a referenced snapshot is missing or corrupted, the system must report that reconstruction is incomplete rather than substituting current data.

## 9. Supersession, retirement and rollback

### 9.1 Supersession

- A new approved framework version may supersede an older version for future work.
- Supersession does not delete the older version or rewrite past packages.
- Existing work packages remain pinned to their original versions unless an authorized migration/reissue decision is recorded.
- Effective date/time and authority for supersession must be captured.
- The policy for active work packages affected by a framework change remains an open institutional decision.

### 9.2 Retirement

- Retiring a version prevents new use according to configured policy.
- Historical references remain resolvable for authorized users.
- Retirement must not cascade-delete historical snapshots or review evidence.
- The system must distinguish retired, superseded and deleted/retained-under-policy states.

### 9.3 Rollback

Rollback MUST be implemented as a new compensating revision or lifecycle action that restores a previous approved configuration where permitted. It must:
- identify the revision being restored;
- identify the revision being reversed;
- capture actor, timestamp and reason;
- pass applicable structural validation;
- follow M10 review/approval requirements where required;
- preserve the complete intervening history.

Deleting a revision or moving a pointer backward while concealing intervening history is prohibited.

## 10. Concurrency and integrity

- Draft editing must use optimistic concurrency or an equivalent conflict-detection mechanism.
- An update based on a stale revision must be rejected or routed through an explicit merge/conflict process.
- Concurrent submissions must not create two indistinguishable authoritative snapshots.
- Duplicate event delivery must be idempotent or deduplicated using a stable event/correlation key.
- History ordering must use authoritative server timestamps and stable event identifiers; timestamps alone are not a total ordering guarantee.
- Failed writes must not leave an artifact appearing approved/active without its corresponding history event.
- Snapshot creation and lifecycle transition must be transactionally consistent to the extent supported by the selected architecture.

## 11. Audit integrity, retention and access

1. History is append-only at the application contract level.
2. Normal users cannot alter or delete history events or immutable snapshots.
3. Privileged maintenance operations must be separately authorized and audited.
4. Tenant and resource permissions apply to history reads, comparisons and exports.
5. Sensitive before/after values may require field-level restrictions.
6. Exports of historical data are permission-controlled and audited.
7. Retention, archival, legal hold and deletion rules are defined by the approved retention policy.
8. No fixed retention duration is selected by this specification.
9. Framework retirement or tenant configuration changes must not cause uncontrolled cascade deletion of referenced history.
10. Backup/restore and disaster recovery are handled by platform operations, not M11.

## 12. Interfaces and dependencies

M11 provides logical capabilities, not a mandated microservice or API topology.

Required interactions:
- M04 requests revision creation, snapshotting, comparison and framework history.
- M10 records review decisions against exact revision IDs and emits review history events.
- Offline workflow/template capability pins framework/template version references to issued packages.
- M13 validation results may be referenced by a revision/submission event.
- Identity/authorization supplies actor identity and role context.
- Audit/retention infrastructure supports integrity and policy enforcement.

Exact API endpoints, event schemas, transaction boundaries and storage design belong in later architecture/API specifications and are not authorized here.

## 13. Acceptance criteria

| ID | Acceptance criterion |
|---|---|
| M11-AC-001 | Every supported versioned artifact has a stable logical identity distinct from its revision identifiers. |
| M11-AC-002 | Submitted framework snapshots remain identifiable and cannot be silently overwritten. |
| M11-AC-003 | Approved framework versions are immutable. |
| M11-AC-004 | Review decisions reference the exact revision reviewed, not a mutable latest pointer. |
| M11-AC-005 | Work packages, when managed, retain exact framework/template version references. |
| M11-AC-006 | Authorized users can compare framework revisions and identify changed elements. |
| M11-AC-007 | Historical reconstruction uses historical snapshot content, not current labels/configuration. |
| M11-AC-008 | Supersession and retirement preserve historical references and evidence. |
| M11-AC-009 | Rollback creates a compensating revision/action and preserves intervening history. |
| M11-AC-010 | Stale concurrent updates are detected and cannot silently overwrite newer revisions. |
| M11-AC-011 | Duplicate history-event delivery does not create misleading duplicate authoritative events. |
| M11-AC-012 | History reads and exports enforce tenant/resource permissions. |
| M11-AC-013 | Retention behavior follows an approved policy; no unapproved retention duration is hardcoded. |
| M11-AC-014 | Phase 1 history contains no DTE question-content, question-identity or digital mapping records. |
| M11-AC-015 | Student Tracking, test management and DRE retain ownership of their respective histories. |

## 14. Open decisions

| ID | Decision required | Owner | Status |
|---|---|---|---|
| DTE-M11-OD-001 | Canonical technical format for logical IDs, revision IDs and human-readable sequence numbers | Architecture | Open |
| DTE-M11-OD-002 | Which draft edits create formal revisions versus autosaved draft state? | Product + UX + Architecture | Open |
| DTE-M11-OD-003 | Which Phase 1 artifacts require versioning beyond framework configuration? | Product Owner | Open |
| DTE-M11-OD-004 | Are templates generated/managed in DTE and therefore versioned by M11? | Product + Operations | Open |
| DTE-M11-OD-005 | Is completed offline sheet intake in DTE, requiring submission snapshots? | Product + Operations | Open |
| DTE-M11-OD-006 | Which fields require immutable snapshots versus structured diffs? | Architecture + Security | Open |
| DTE-M11-OD-007 | What retention, archival and legal-hold rules apply? | Product + Security | Open |
| DTE-M11-OD-008 | Which roles may view/export historical versions and diffs? | Product + Security | Open |
| DTE-M11-OD-009 | What is the effective-date and active-work-package policy when a framework is superseded? | Academic Authority + Operations | Open |
| DTE-M11-OD-010 | Which events require cryptographic tamper-evidence beyond application-level append-only controls? | Security + Architecture | Open |
| DTE-M11-OD-011 | What is the conflict-resolution policy for concurrent draft edits? | Product + Architecture | Open |
| DTE-M11-OD-012 | What history export formats and audit controls are required? | Product + Operations | Open |

## 15. Implementation readiness constraints

Before implementation:
1. Approve the canonical identifier and revision semantics.
2. Confirm which Phase 1 artifact types are versioned.
3. Resolve template and completed-sheet intake decisions.
4. Define snapshot/diff boundaries and concurrency behavior.
5. Approve retention, access and export policy.
6. Define framework supersession behavior for active work packages.
7. Reconcile M04 and M10 lifecycle transitions against this shared version/history contract.
8. Complete requirements-to-data/API/UX/test traceability.
9. Obtain explicit product, academic, architecture, security and operations approval.

This draft authorizes no database schema, API, UI, event infrastructure, migration or production change.

## 16. Change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-11-06 | Superseded Draft | Initial broad version/history specification included future question mapping and question-version references |
| 0.2.0 | 2026-11-06 | Draft | Rewritten for Phase 1 framework/offline-process artifacts; established shared version/history ownership; removed digital question, mapping and student/difficulty history from current scope |

## 17. Approval

- Product owner: Pending
- Academic authority: Pending
- Architecture: Pending
- Security: Pending
- Operations owner: Pending
- QA: Pending
- Implementation authorization: Not granted
