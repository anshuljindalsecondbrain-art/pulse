# DTE Decision Paper — Classification Mapping Attachment Policy

- Document ID: PULSE-DTE-DEC-001
- Version: 0.1.0
- Status: Draft — Product decision recorded as direction; detailed policy pending review
- Date: 2026-11-06
- Repository: anshuljindalsecondbrain-art/pulse
- Related modules: M02 Question Inventory, M03 Tagging Studio, M04 Classification Configuration Studio, M05 Relationship Mapping Engine, M09 PYQ Provenance Manager, M10 Review & Approval, M11 Version & History Manager, M13 Validation & Quality Engine, M15 Configuration Version Manager, M18 External Engine Integration

## 1. Decision captured

The product owner selected **Option D: a combination of logical-question, exact-question-version and placement-level attachment, with explicit inheritance and override rules**.

This selects a flexible, field/relationship-specific attachment model. It does **not** authorize indiscriminate duplication of every classification at every level, nor does it approve a physical database schema or implementation.

The detailed rules below are a proposed policy for review. They remain Draft until explicitly approved.

## 2. Problem being resolved

DTE distinguishes three different identities:

1. **Logical question** — stable identity of the intellectual/content question across revisions.
2. **Question version** — a particular revision or variant of question content.
3. **Placement / instance** — a use of a question in a book, exercise, test, worksheet, assignment or other content context. Placement is owned by the relevant content system; DTE stores or consumes its reference.

A single universal attachment level is insufficient for all information:
- Some information describes the question independently of its wording revision.
- Some information is true only for a specific content version.
- Some information describes why or how the question is used in a particular placement.

The system must not confuse academic classification with content placement, source provenance, or student-attempt context.

## 3. Proposed governing principle

**Every classification field, metadata definition or relationship type must declare its attachment scope.**

Candidate scopes:
- `LOGICAL_QUESTION`
- `QUESTION_VERSION`
- `PLACEMENT`
- `PROVENANCE_APPEARANCE` (for exam/source appearance facts, governed by M09 rather than treated as ordinary academic classification)

The institution-approved configuration determines which scope applies to each configurable field or relationship type. DTE must not impose a universal academic hierarchy or assume that every institution uses the same fields.

A field's attachment scope is part of its governed configuration and must be versioned. Changing that scope later is a governed configuration change with migration/reinterpretation impact; it must not silently move existing assignments.

## 4. Proposed semantics by scope

### 4.1 Logical-question scope

Use when the value describes the stable question identity and remains valid across content revisions unless an authorized review determines otherwise.

Examples for discussion:
- A stable institution-defined academic classification, where the underlying intellectual question has not changed.
- A reusable archetype association, where the archetype describes the logical question rather than a particular rendering.
- A stable institution-defined question family or conceptual relationship.

The examples are illustrative only. Institutions decide which of their fields, if any, have this scope.

### 4.2 Exact-version scope

Use when the value depends on the exact content revision, language, diagram, options, answer, parameterization or other version-specific property.

Examples for discussion:
- A property that is true only for a particular wording, diagram or option set.
- A version-specific pedagogical observation.
- A version-specific relationship to another question version.
- A classification that changes because a revised question tests a materially different concept or method.

Version-scoped assignments must reference the exact `question_version_id`. A new question version does not automatically inherit version-scoped assignments.

### 4.3 Placement scope

Use when the value describes the contextual use of a question in a particular content placement, not the question's intrinsic identity.

Examples for discussion:
- A tenant-owned series, book, exercise, worksheet, test or assignment context.
- A placement-specific instructional purpose, sequence, section or local label.
- A contextual designation that differs between two uses of the same question.

A placement-scoped assignment must reference the external placement/slot identifier and its owning content system. DTE must not create or own the book, test, exercise or assignment itself.

Placement metadata must not overwrite the logical-question or question-version classification. It is a contextual layer.

### 4.4 Provenance-appearance scope

Exam/year/shift/paper/question-number/source evidence belongs to the PYQ appearance/provenance record managed by M09. It may reference a logical question and, where supported, an exact version. It must not be flattened into a generic placement or academic classification record.

## 5. Proposed inheritance and resolution rules

The following defaults are recommended for review:

1. **No implicit inheritance by default.** A mapping at one scope does not automatically become a direct mapping at another scope.
2. A logical-question mapping may be displayed in a version context as a resolved logical-level value, but it remains recorded as a logical-level assignment. It must not be copied and represented as a direct version assignment.
3. A version-specific mapping applies only to that exact version unless a separately approved migration/review action creates a new assignment for another version.
4. A placement-scoped value applies only to the referenced placement. It does not flow back to the logical question or to sibling placements.
5. If multiple layers are shown together, the UI/API must identify the source scope of each value: direct logical, direct version, direct placement, or derived/resolved.
6. Conflicts must be surfaced, not silently resolved. A configured precedence rule may control presentation only where the institution explicitly defines it and the rule is versioned.
7. A placement-level value is an additional contextual value, not an override that deletes or mutates the underlying academic classification.
8. Every derived/resolved value must be explainable by the source assignment and applicable configuration/rule version.

No inheritance or precedence rule is considered approved merely because it appears in this draft.

## 6. Question lifecycle scenarios

| Scenario | Proposed treatment | Reason / control |
|---|---|---|
| Typo, punctuation or formatting correction | Create a new question version. Retain logical-level assignments. Version-level assignments remain attached to the old version unless reviewed/copied. | A content revision must not silently rewrite historical version-specific evidence. |
| Diagram replacement or option reorder with no conceptual change | Retain logical-level assignments; flag affected version-level values for review according to configured impact rules. | The version changed, but not every classification necessarily changed. |
| Numerical parameter or answer change | Create a new version; require review of version-sensitive mappings and any logical-level mapping whose meaning may have changed. | A parameter change can alter the tested concept or solution path. |
| Material stem change that changes the concept/method | Consider a new logical question or an explicitly adapted relationship, based on the institution's identity policy; do not assume it is merely a new version. | Logical identity is a content governance decision, not a text-similarity decision. |
| Translation | Record language/version relationship. Reuse logical identity only where equivalence is adjudicated; otherwise represent an adapted/related question. | Translation may preserve meaning, but equivalence must not be assumed. |
| Same question used in two different books or series | Keep question-level classification independent; store separate placement references and any configured placement metadata. | Content series labels are tenant/content context, not global academic taxonomy. |
| Same question used in a practice exercise and a full test | Keep the same logical question identity; use distinct placement records. | Reuse must not create duplicate question identities. |
| Same question appears in multiple exam years/shifts | Store multiple M09 PYQ appearance records linked to the logical question and relevant version where known. | An exam appearance is provenance, not a new question identity. |
| Adapted PYQ used in a local exercise | Preserve the source appearance and represent adaptation explicitly; attach local use to its placement. | Provenance, adaptation and placement are separate facts. |
| Question version is withdrawn or superseded | Preserve its mappings and history; prevent accidental use according to lifecycle policy. | Historical student evidence and review decisions must remain interpretable. |

These are policy scenarios, not automatic identity adjudications. The institution's authorized content/question governance process must decide whether a material change creates a new logical question or a new version.

## 7. Relationship to Student Tracking and external consumers

Student Tracking may need to retain:
- stable `question_id`
- exact `question_version_id`
- placement/slot reference where the learning or assessment event occurred
- the event timestamp and its own evidence identifiers

DTE mapping attachment policy must not rewrite historical Student Tracking evidence.

When a consumer asks for classification context, the DTE contract should allow the consumer to identify:
- the exact question and version requested;
- the applicable mapping/configuration revision;
- direct assignments by scope;
- any resolved values and their source scope;
- whether a mapping is current, superseded, under review or unavailable.

DTE does not own student attempts, attendance, learning analytics or test composition. This document defines only the classification context contract needed by consumers.

## 8. Data and audit implications — logical requirements only

The eventual canonical model must be capable of representing:
- mapping identity and tenant/scope;
- source entity type and ID;
- target entity type and ID;
- relationship/field definition ID and configuration version;
- attachment scope;
- logical question ID, when applicable;
- exact question version ID, when applicable;
- external placement system and placement/slot ID, when applicable;
- provenance appearance ID, when applicable;
- direct versus resolved/inherited presentation;
- mapping revision and lifecycle status;
- source (human, import, accepted AI suggestion, migration or system process);
- actor, timestamp, reason/evidence and review reference;
- supersession/replacement reference.

This is a logical capability checklist, not a prescribed table design. The canonical ERD and ownership matrix must decide the physical representation.

## 9. Required validation and safeguards

1. Reject a mapping whose attachment scope is incompatible with its configured field/relationship definition.
2. Reject a version-scoped mapping without a valid exact question version.
3. Reject a placement-scoped mapping without a valid external placement reference and owning-system context.
4. Do not accept unknown classification identifiers by auto-creating categories or nodes.
5. Validate all endpoints against the institution-approved configuration version.
6. Preserve historical mappings when a question version, placement or classification entity is superseded or retired.
7. Prevent cross-tenant references unless an explicit governed sharing policy permits them.
8. Do not silently migrate assignments when attachment scope changes.
9. Record the rule/configuration version used to resolve any displayed inherited value.
10. Ensure API consumers can distinguish direct assignments from resolved presentation values.

## 10. Consequences and trade-offs

### Benefits
- Supports institutions with different classification models.
- Separates intrinsic question meaning from version-specific facts and contextual use.
- Supports question reuse across multiple content collections without duplicate identity.
- Preserves historical mapping and student-evidence interpretation.
- Allows different fields to use the scope appropriate to their semantics.

### Costs and risks
- More complex mapping model and user interface.
- More complex queries when showing a combined classification view.
- Requires explicit configuration of scope and carefully governed migration.
- Requires clear conflict handling and explanation of resolved values.
- Increased testing burden for inheritance, version changes and tenant boundaries.

## 11. Decisions still required

| Decision ID | Question | Status |
|---|---|---|
| DTE-DEC-001 | Approve field/relationship-specific attachment scope as the governing model? | Direction selected: Option D; detailed approval pending |
| DTE-DEC-002 | Which scope should be the default when an institution configures a new field? | Open |
| DTE-DEC-003 | Should logical-level mappings be visible in version contexts by default, without being copied? | Proposed: yes, as resolved context; approval pending |
| DTE-DEC-004 | Which mapping categories, if any, may inherit automatically across versions? | Open; default proposed: none without explicit rule |
| DTE-DEC-005 | Can an institution define precedence for conflicting values across scopes, and for which field types? | Open |
| DTE-DEC-006 | What content-change criteria distinguish a new logical question from a new question version? | Open |
| DTE-DEC-007 | Which placement reference contract and external content-system identity are canonical? | Open |
| DTE-DEC-008 | How should scope changes be migrated, reviewed and historically interpreted? | Open |
| DTE-DEC-009 | Which roles may create, review and publish mappings at each scope? | Open; must align with shared permissions matrix |

## 12. Required follow-on documentation

Before implementation, this decision must be reconciled into:
- M02 Question Inventory — scope-aware display and filtering.
- M03 Tagging Studio — scope selection and context.
- M05 Relationship Mapping Engine — attachment scope, direct/resolved semantics and validation.
- M09 PYQ Provenance Manager — separate appearance/provenance semantics.
- M10 Review & Approval — scope-aware review and approval.
- M11 Version & History Manager — mapping revisions and historical reconstruction.
- M13 Validation & Quality Engine — scope and compatibility validation.
- M15 Configuration Version Manager — versioning of scope definitions and migration.
- M18 External Engine Integration — consumer read contracts.

The canonical DTE data model/ERD, ownership matrix and workflow state machines must then incorporate the approved policy.

## 13. Governance and implementation gate

- This document records the selected direction, not final technical approval.
- No physical schema, migration, API implementation or production change is authorized by this document.
- The document remains Draft until product review and explicit approval.
- Any approved change must follow DTE document versioning and change-control rules.

## 14. Change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-11-06 | Draft | Recorded Option D and proposed scope-specific attachment, inheritance and override policy |

## 15. Approval

- Product owner: Pending
- Technical review: Pending
- Implementation authorization: Not granted
