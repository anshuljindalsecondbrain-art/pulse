# DTE-M04 — Classification Configuration Studio Specification

- Document ID: PULSE-DTE-M04
- Version: 0.2.0
- Status: Draft — Phase 1 rewrite; pending product and academic-authority review
- Phase: Current — Offline tagging framework management
- Parent register: docs/dte/DTE_MODULE_REGISTER.md (v0.2.0)
- Governing roadmap: docs/dte/DTE_PRODUCT_SCOPE_AND_PHASE_ROADMAP.md
- Phase disposition: docs/dte/DTE_MODULE_PHASE_DISPOSITION.md
- Related specification: docs/dte/current-phase/DTE-P1_FRAMEWORK_CONFIGURATION_SPECIFICATION.md
- Last updated: 2026-11-06
- Implementation authorization: Not granted

## Governing product boundary

M04 provides software to encode, maintain and govern an academic classification/tagging framework that has already been defined and approved by the institution.

M04 does not design, prescribe, recommend, generate or impose academic classification, chapter-wise syllabus bifurcation, curriculum structure, subject/topic hierarchy or pedagogical categories. Academic meaning and the decision to create, rename, merge, split or retire a category belong to the institution's authorized academic authority.

DTE must not require a fixed hierarchy. Subject, chapter, topic, concept, sub-concept, archetype and similar terms are illustrative examples only. The institution may supply a flat list, multiple independent groups, a hierarchy, cross-links or another approved structure.

This is a Phase 1 framework-management capability. It does not create question records, upload question content or persist digital question-to-tag mappings.

## 1. Purpose

The Classification Configuration Studio is the administrative workspace through which authorized users record an institution's approved classification framework in DTE and maintain its governed configuration over time.

It provides a faithful software representation of an external academic decision. It supports:
- recording the framework as supplied/approved;
- organizing its configurable groups, fields, values and permitted relationships;
- maintaining stable identifiers separately from labels;
- defining the institution-approved instructions and validation constraints;
- checking structural consistency;
- routing the encoded framework for academic verification and approval;
- preserving immutable approved versions and their audit history;
- making an approved framework version available to offline tagging instructions and templates.

The module does not decide whether an academic classification is correct. Software validation can establish structural consistency, not academic validity.

## 2. Phase 1 scope

### 2.1 In scope

1. Framework registry: create and maintain framework records for an institution/workspace.
2. Framework source record: capture the supplied source document/reference, owner, approval evidence and effective date.
3. Configurable groups: represent the groups/dimensions specified by the institution.
4. Configurable fields: represent institution-defined fields, labels, descriptions, data types and selection rules.
5. Configurable values: record institution-approved controlled values where a field requires them.
6. Configurable structure: represent flat, hierarchical, multi-group or cross-linked arrangements as explicitly supplied.
7. Stable identifiers: maintain identifiers independent of labels, aliases and display order.
8. Instructions: record definitions, guidance, examples and notes supplied or approved by the institution.
9. Rules: encode structural constraints and required/optional/conditional status as approved.
10. Preview: show how the approved configuration will be presented in offline tagging instructions/templates.
11. Validation: identify structural errors, missing configuration metadata and unresolved references.
12. Review handoff: submit an encoded configuration for institutional academic verification.
13. Version lifecycle: create drafts, record approvals, activate versions, supersede and retire versions through the approved governance process.
14. Audit: retain actor, time, action, reason, before/after values and approval references.
15. Export: provide a versioned framework definition/reference package for approved offline templates and future handoff.

### 2.2 Explicitly out of scope in Phase 1

- Designing or recommending an academic taxonomy or curriculum.
- Automatically generating chapter/topic/concept structures.
- Inferring academic categories from NCERT, textbooks, question banks or external sources.
- Question upload, OCR, extraction, parsing or question-content storage.
- Digital question inventory or question preview.
- Assigning classification values to uploaded question records.
- Question-to-classification mapping persistence.
- Question identity, question-version and placement/instance management.
- Question-level archetype/type/pedagogical/PYQ assignment.
- AI-generated or AI-approved classification definitions.
- Q-GENOME, Student Tracking historical enrichment or DRE integration.
- Difficulty scoring, exam multipliers or student-performance analytics.

Any proposed inclusion of an excluded capability requires a documented phase/scope change and approval.

## 3. Users and permissions

Candidate roles; final role names and permission grants are governed by the Phase 1 roles/permissions specification.

| Role | Candidate permissions | Restrictions |
|---|---|---|
| Academic Framework Owner | Supply/verify framework; approve academic meaning and changes | Must be institution-authorized |
| Framework Administrator | Create/edit draft representation; run structural validation; submit for review | Cannot self-approve where separation of duties is required |
| Academic Reviewer | Compare encoded configuration with approved source; request changes; record review | Does not publish unless separately authorized |
| Configuration Approver | Approve the represented framework version and authorize activation | Approval authority must be explicit |
| DTE Administrator | Manage tenant setup, access and technical settings | No authority to change academic meaning |
| Read-only/Auditor | View authorized framework versions and audit records | No mutation permission |

Authorization must be checked server-side for every operation and resource. UI visibility is not a security boundary.

## 4. Framework configuration model

The logical configuration model must distinguish the following concepts. This is a requirements-level model, not a physical database schema.

| Concept | Meaning | Notes |
|---|---|---|
| Framework | Stable identity for an institution-owned framework | May have multiple versions |
| Framework version | Immutable snapshot of configuration at a point in its lifecycle | Draft revisions may be mutable until submitted/approved |
| Framework source | Institution-supplied document or reference supporting the configuration | Store a reference and evidence metadata; retention policy pending |
| Group/dimension | Configurable grouping of related fields or values | Number and names are institution-defined |
| Field definition | A configurable attribute or classification dimension | Not a question record or question mapping |
| Controlled value | Approved selectable value for a field | Only when field type requires it |
| Structure relationship | Institution-defined relation between configuration elements | May express parent-child or another approved relationship |
| Label/alias | Language- or institution-specific display text | Not identity |
| Instruction/definition | Approved meaning and usage guidance | Academic text must come from authorized source |
| Validation rule | Machine-checkable structural/configuration constraint | Must not claim semantic correctness |
| Approval evidence | Record of institutional verification/approval | Authority and evidence type must be defined |

The configuration representation must not assume that every framework has all these concepts. Only the constructs needed to represent the actual approved framework should be enabled.

## 5. Configurable framework capabilities

### 5.1 Groups and dimensions

- Support one or more groups if the institution's framework specifies them.
- Group names, order, descriptions and visibility are configurable.
- Groups may be independent; no parent-child relationship between groups is assumed.
- A group may contain fields, controlled values or other supported structures as defined by the approved model.
- DTE must not add a group merely because a familiar academic category is absent.

### 5.2 Fields

A field definition may include:
- stable field identifier;
- institution-supplied code, if any;
- canonical name and display label;
- definition/instruction;
- supported data type;
- selection cardinality;
- required/optional/conditional rule;
- applicable group/scope;
- allowed-value reference, if controlled;
- visibility and editability rules;
- ordering;
- language labels and aliases;
- effective version and lifecycle status.

The exact supported data types and rule-expression capabilities must be finalized after the actual institutional framework is inspected. Do not build a generic programming-language rule editor without a demonstrated requirement.

### 5.3 Controlled values

Where a field uses controlled values:
- each value has a stable identifier;
- institution-provided code and display label are stored separately;
- definition and usage guidance may be recorded;
- ordering and aliases are configurable;
- active/deprecated/retired status is explicit;
- a retired value remains resolvable in historical framework versions;
- DTE must not invent a replacement value;
- unknown values in an import or offline return are flagged for authorized review, never auto-created.

### 5.4 Hierarchical and non-hierarchical structures

- Support hierarchy only when the institution's approved framework specifies it.
- Support flat controlled lists and multiple independent groups.
- Support cross-links only if required by the approved framework and represented with explicit relationship types.
- A tree view may be used for hierarchical groups; it must not be the only editor representation.
- No maximum academic depth is hardcoded as a product rule.
- Do not infer missing parent/child links.

### 5.5 Relationships

A relationship definition, where required, should identify:
- stable relationship type ID;
- source and target element types;
- directionality;
- cardinality;
- whether cycles are permitted;
- required/optional status;
- institution-approved meaning/description;
- lifecycle and version.

M04 configures relationships among framework definitions only. Question-to-classification assignment is deferred to the future digital tagging phase.

## 6. Configuration authoring workflow

1. **Create framework draft:** authorized administrator creates a framework record and selects institution/workspace scope.
2. **Record source:** attach or reference the institution-supplied approved framework source and record its authority/version/date.
3. **Encode structure:** administrator records only the groups, fields, values, relationships and rules present in the approved source.
4. **Run structural validation:** DTE checks identifiers, references, field types, cardinality, required metadata and configured structural constraints.
5. **Resolve errors:** administrator corrects representation errors or records a justified warning acknowledgement.
6. **Preview:** administrator reviews the generated framework presentation and offline template preview.
7. **Submit for academic verification:** system records the exact draft version and routes it to the authorized academic reviewer.
8. **Academic verification:** reviewer compares the DTE representation against the institution-approved source; DTE does not make this decision.
9. **Correction loop:** requested changes create a new draft revision or controlled correction; previous submissions remain auditable.
10. **Approval and activation:** authorized approver records approval evidence; version lifecycle service activates the approved snapshot.
11. **Operational use:** only the active approved version is selectable for new offline work packages/templates.
12. **Subsequent change:** edits to an active version create a new draft version; they never mutate the historical active snapshot.

Exact state names, transition permissions and notification rules must align with the shared workflow specification.

## 7. Versioning and lifecycle boundary

M04 owns the content of the framework configuration draft. The shared governance/version lifecycle capability (currently distributed across legacy M10/M11/M15) owns workflow transitions, approval records, immutable snapshots, activation, supersession and retirement.

Do not implement three competing lifecycle engines.

Candidate framework lifecycle:
- Draft
- Submitted for Academic Verification
- Changes Requested
- Approved
- Active
- Superseded
- Retired

These labels are provisional until the shared workflow specification is approved.

Rules:
- Every edit to an approved configuration creates a new version.
- An active version is immutable.
- Each offline template/work package must reference the exact framework version used.
- A new version does not silently alter work already in progress.
- Migration/reissue of active work is an explicit operational decision.
- Historical versions remain readable according to retention and authorization policy.
- Retired values remain visible in the version in which they were valid.

## 8. Structural validation requirements

### 8.1 Blocking errors

Candidate blocking conditions:
- duplicate stable identifiers in a scope where uniqueness is required;
- unresolved references to groups, fields, values or relationships;
- invalid field data type or unsupported type;
- invalid cardinality bounds;
- invalid relationship endpoint types;
- prohibited cycle in a structure explicitly configured as acyclic;
- missing required configuration metadata;
- invalid lifecycle transition;
- attempt to modify an immutable approved version;
- attempt to activate a version without required approval evidence.

### 8.2 Warnings

Candidate warnings:
- duplicate or ambiguous display labels;
- missing optional descriptions/instructions;
- deprecated values still referenced in a draft;
- a framework source reference that is incomplete;
- a configuration change that may affect active offline templates;
- language fallback not explicitly configured.

Warnings must be reviewable and acknowledgement must be attributable to an authorized actor.

### 8.3 Academic-semantic review

The system must not label an academic structure “correct” based solely on structural validation. Academic verification is a separate human decision against the institution's approved source.

## 9. User interface requirements

### 9.1 Framework registry

Display:
- framework name/identifier;
- institution/workspace scope;
- current version;
- lifecycle status;
- source/approval reference;
- owner;
- last updated;
- active work-package references, if tracked.

Filters should include status, owner, scope and update date where useful.

### 9.2 Framework editor

Provide:
- framework metadata panel;
- group/dimension navigator;
- field/value editor;
- relationship editor where configured;
- instruction/definition editor;
- validation rules panel;
- source-reference panel;
- validation issue list;
- version comparison and preview.

Do not force all structures into a tree. The interface must render only the constructs configured for the selected framework.

### 9.3 Source fidelity review

The review view should let the academic reviewer compare:
- institution-approved source/reference;
- encoded framework content;
- differences from the previous approved version;
- validation errors and warnings;
- proposed effective date and affected active work packages.

### 9.4 Accessibility and responsive behaviour

- All configuration operations must be keyboard accessible.
- Labels and validation errors must be programmatically associated with controls.
- Destructive or broad-impact operations require confirmation.
- Dense configuration editing may prioritize desktop, but read-only review and approval must remain usable on supported narrow screens.
- Localization of UI and academic labels must not alter stable identifiers.

## 10. Data integrity, security and audit

- Tenant/institution scope is enforced on all reads and writes.
- Global/shared framework support is not enabled until its ownership and mutation policy is approved.
- No tenant may mutate another tenant's configuration.
- Framework stable IDs are never reused after retirement.
- Approved snapshots are immutable.
- All create/edit/submit/review/approve/activate/supersede/retire/export actions are audited.
- Audit record should include actor, action, timestamp, resource/version, before/after state or diff, reason, source and approval evidence reference.
- Source files and exports require access controls and retention rules.
- No question content is stored by M04 in Phase 1.
- No cascade deletion may erase historical configuration or approval evidence.
- Sensitive credentials and service-role keys must never be exposed to the client.

## 11. Failure and edge cases

| Scenario | Required behaviour |
|---|---|
| Institution source is incomplete | Keep draft; identify missing source information; do not invent categories |
| Academic reviewer disputes a field meaning | Return for clarification; preserve both submitted and review evidence |
| Duplicate labels exist | Permit only if stable IDs and UI disambiguation make the values distinguishable; otherwise warn/block by policy |
| A field is renamed | Preserve stable ID; create a new configuration version |
| A value is retired | Preserve historical resolution; block new use according to approved policy |
| A parent/group is removed from draft | Check dependent elements; require explicit resolution |
| An active framework is edited | Create a new draft version; never edit active snapshot in place |
| A work package references an old version | Continue to resolve the pinned version; do not silently switch |
| A user lacks approval authority | Reject the operation server-side and audit the denied action where required |
| Export is interrupted | Allow reproducible retry for the same version; avoid duplicate or partial manifests |
| Unknown value is supplied by offline return | Flag for human decision; do not auto-create or nearest-match |

## 12. Performance and operational requirements

Numeric targets remain open until the institution's framework size and user volume are known.

The implementation design must nevertheless:
- avoid loading all configuration records when only a subset is needed;
- paginate large registries and value catalogues;
- support efficient retrieval of one framework version and its configured fields;
- cache only immutable/versioned configuration safely;
- invalidate or version caches when a new version is activated;
- make export jobs observable and retryable;
- log validation and publication failures without exposing sensitive source content.

## 13. Acceptance criteria

1. An authorized administrator can encode an institution-supplied framework without DTE inventing academic structure.
2. The framework can contain the groups and dimensions specified by the institution, including flat or hierarchical forms where required.
3. No fixed hierarchy or mandatory number of levels is imposed.
4. Framework, version, group, field, value and relationship identities are distinct from display labels.
5. Field cardinality and required/optional/conditional behaviour can be represented according to approved requirements.
6. The editor can represent multiple independent groups without forcing them into one tree.
7. Structural validation identifies invalid references and constraints before academic review.
8. The system clearly distinguishes technical validation from academic verification and approval.
9. The approved source/reference and approval evidence can be traced to the active framework version.
10. Changes to an active framework create a new version and do not mutate the historical snapshot.
11. An offline work package/template can identify the exact framework version used.
12. Unknown or unmatched values are escalated; the system does not auto-create academic categories.
13. Tenant isolation is enforced server-side.
14. Every governed configuration mutation and lifecycle action is auditable.
15. M04 does not create question records, ingest question content or persist digital question-to-tag assignments in Phase 1.

## 14. Dependencies and ownership

| Dependency | Relationship |
|---|---|
| Institution academic authority | Supplies and approves academic meaning and structure |
| DTE tenant/authorization capability | Controls institution scope and permissions |
| Shared review/approval capability (legacy M10) | Routes academic verification and records approval |
| Shared version/history capability (legacy M11/M15) | Owns immutable versions, lifecycle and audit history |
| Validation capability (legacy M13) | Executes structural/configuration validation |
| Offline template/work-package capability | Consumes approved framework version for instructions and templates |

M05's legacy question relationship mapping, M02 Question Inventory, M03 digital Tagging Studio, M16 historical enrichment, M17 AI and M18 external engine integration are not Phase 1 dependencies.

## 15. Open decisions

| ID | Decision required | Why it matters | Status |
|---|---|---|---|
| M04-OD-001 | What actual framework source document/file is authoritative? | Determines exact configuration to encode | Open |
| M04-OD-002 | What is the institution's actual list of groups, fields and controlled values? | Prevents speculative schema design | Open |
| M04-OD-003 | Which data types and cardinality options are required in Phase 1? | Controls editor and validation complexity | Open |
| M04-OD-004 | Can one institution maintain multiple active frameworks? | Affects selection and work-package pinning | Open |
| M04-OD-005 | Which roles may encode, verify, approve and activate a framework? | Defines separation of duties | Open |
| M04-OD-006 | What approval evidence must be retained? | Establishes audit sufficiency | Open |
| M04-OD-007 | Is global/shared framework support needed now? | Avoids premature inheritance complexity | Open |
| M04-OD-008 | Which languages and label fallbacks are required? | Determines localization behaviour | Open |
| M04-OD-009 | Which export/template format is required? | Determines current integration contract | Open |
| M04-OD-010 | What is the policy when a framework change affects active offline work? | Prevents silent version drift | Open |

## 16. Change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-11-06 | Draft | Initial generic classification configuration specification |
| 0.2.0 | 2026-11-06 | Draft | Rewritten for Phase 1 offline framework management; clarified institution academic authority; removed digital question inventory/mapping dependencies; added source fidelity, approval, versioning, offline template linkage, edge cases and acceptance criteria |

## 17. Approval

- Product owner: Pending
- Institution academic authority: Pending
- Operations owner: Pending
- Architecture/security review: Pending
- QA review: Pending
- Implementation authorization: Not granted
