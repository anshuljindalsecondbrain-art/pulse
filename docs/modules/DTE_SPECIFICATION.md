# Deep Tagging Engine (DTE) — Functional Specification

**Status:** Working baseline  
**Scope:** Generic, configurable, multi-institute question classification and governance.  
**Explicit exclusion:** Difficulty Rule Engine implementation.

## 1. Purpose

DTE enables academic and content teams to progressively classify questions using configurable academic structures, relationships and metadata. It must work across institutes with different taxonomies and workflows.

DTE consumes stable question references and authorized previews from QBMS/content services. It does not require ownership of question content and does not own student evidence.

## 2. Design principles

- Generic engine, not a Physics-only tagging application.
- No fixed six-level taxonomy.
- Support hierarchical and non-hierarchical classification.
- Separate classification definitions from question mappings.
- Support many-to-many relationships and configurable relationship types.
- Tenant-scoped configuration and authorization.
- Versioned configuration and mapping history.
- Published mappings are never silently overwritten.
- AI suggestions require human governance.
- DTE must not block Student Tracking.

## 3. Functional modules

1. DTE Dashboard
2. Question Inventory
3. Tagging Studio
4. Classification Configuration Studio
5. Relationship Mapping Engine
6. Archetype Management
7. Question Type Manager
8. Pedagogical Metadata Manager
9. PYQ Provenance Manager
10. Review and Approval
11. Version and History Manager
12. Bulk Tagging Manager
13. Validation and Quality Engine
14. Coverage and Productivity Dashboard
15. Configuration Version Manager
16. Historical Enrichment Interface
17. AI Assistance Interface
18. External Engine Integration

These are logical modules and need not become separate applications or microservices.

## 4. Configurable classification model

The engine must allow an authorized institute administrator to define:
- classification schemes/groups;
- nodes/entities and labels;
- optional parent-child hierarchy;
- flat catalogues;
- multiple independent classification dimensions;
- relationship types and cardinality;
- required/optional fields;
- selection dependencies and validation rules;
- aliases, display order and active/deprecated state;
- schema/configuration versions.

Do not assume the labels Subject, Chapter, Topic, Concept, Sub-concept or Archetype are mandatory global levels. They may be configured by an institution where useful.

A label change must not invalidate stable entity identity or historical mappings. Configuration changes must preserve prior versions.

## 5. Question inventory

Provide server-side search, pagination and filtering. Candidate filters include:
- question ID/code/text;
- institution/tenant and ownership/source;
- classification completeness profile;
- mapping, review and publication status;
- question type;
- author/reviewer;
- date and configuration version.

Support multi-select and governed bulk actions. A one-million-question inventory must not be loaded into browser memory.

## 6. Tagging Studio

### Desktop
A three-column workspace:
- **Left:** searchable question inventory, filters, assignment/workload and status.
- **Center:** question preview, options, math/media, permitted solution, source/version and history.
- **Right:** dynamic classification editor, relationship selectors, metadata, PYQ provenance, validation and completeness.

### Mobile
A progressive inventory → preview → classification flow, with sticky stage navigation, searchable selectors, accessible touch targets and no forced horizontal scrolling.

### Workflow features
- save draft and resume;
- explicit save/submit;
- validation feedback;
- next/previous and save-and-next;
- duplicate relationship warnings;
- unsaved-change protection;
- version comparison;
- keyboard navigation where practical;
- undo/redo where safe and supported.

## 7. Relationship mapping

A question may link to multiple classification entities using configurable relationship types. Do not store multi-valued relationships in arrays where a relational join model is required. Prevent duplicate active links according to configured uniqueness rules.

Primary/secondary labels may be presentation conventions, not fixed database columns or a fixed limit of relationships. The configuration must define allowed relation types and cardinality.

## 8. Archetype management

Archetype is a reusable identity with fields configurable as appropriate, such as code, title, description, strategy notes, common traps, benchmark solving time, related archetypes and lifecycle status.

Archetype identity must not be nested permanently under one classification node. Link it to multiple questions and classification entities through explicit relationships. Support search, duplicate detection, versioning, review and archive/deactivation.

## 9. Question Type Manager

Question type is a configurable catalogue for response/assessment structure (for example, single-correct, multiple-correct, numerical/integer or other institution-defined types). It is separate from difficulty and must not contain difficulty scoring rules.

## 10. Pedagogical metadata

Support configurable metadata labels and assignment rules. Examples only (not a finalized catalogue): Must Solve, Kota Trick, Repeated Trap, Calculation Intensive, Conceptual Trap, Multi-Concept, Graph/Diagram Based, Approximation Required, Time Consuming and High Exam Relevance.

## 11. PYQ provenance

Keep exam provenance separate from question identity. Support multiple appearances or adaptations with fields such as exam, year, session/shift, paper, question number, source and adaptation relationship. A question may have more than one provenance record.

## 12. Status and completeness

Keep these dimensions independent:
- work status;
- review status;
- publication status;
- completeness profile/score.

Completeness is derived from configurable profiles (for example, operational, progressive and fully enriched), not a universal fixed number of tags.

## 13. Review, approval and publication

Support draft, submitted, returned for correction, approved and published lifecycle states as configured. Record reviewer, decision, reason, timestamp and mapping revision. Approval applies to a specific revision. Editing a published mapping creates a new revision and does not erase the previous one.

## 14. Audit and versioning

Record relevant before/after values, question and version references, mapping/configuration version, actor, action, timestamp, reason, review decision and publication event. Deactivation/archive should preserve historical references. Do not cascade-delete questions or student evidence.

## 15. Bulk operations

Provide controlled bulk tagging, import/export, validation previews, per-record success/error reporting, permission checks and audit logs. Use chunking/background jobs for large operations.

## 16. Coverage, productivity and quality

Dashboards must make denominators explicit. Distinguish:
- coverage/completeness;
- author/reviewer productivity;
- mapping quality and correction/rework;
- review backlog and publication throughput.

Do not treat volume tagged as a proxy for quality.

## 17. AI assistance

AI may propose tags, identify likely duplicates, extract candidate metadata and flag inconsistencies. Retain model/prompt version, evidence and confidence where appropriate. Suggestions remain suggestions until human approval. AI must not silently publish.

## 18. DRE integration — pointer only

DTE does not implement difficulty rules, weights, thresholds, static/dynamic scores, exam multipliers or student difficulty calculations.

A future integration reference may include:
- question ID;
- question version ID;
- external engine identifier;
- external evaluation identifier;
- evaluation status;
- result reference;
- last evaluation timestamp.

The reference must point to the exact question version. DRE owns evaluation logic, result semantics and history.

## 19. Historical enrichment integration

When a mapping becomes available, an asynchronous job may associate historical student evidence with the relevant classification revision for derived analytics. It must be idempotent, retryable, version-aware and auditable. Original student evidence must never be modified. Incorrect responses must not be reinterpreted as reported doubts.

## 20. Acceptance tests

- Create hierarchical and flat classification schemes.
- Configure variable levels and multiple classification groups.
- Rename a label without breaking stable mappings.
- Add entities and enforce tenant permissions.
- Map one question to multiple entities/relationship types.
- Prevent duplicate active relationships.
- Save draft and reload.
- Submit, return with reason, approve a specific revision and publish.
- Editing an approved mapping creates a new revision.
- Deactivate an entity without erasing historical references.
- Run bulk operations with row-level success/errors.
- Preserve old mappings when configuration versions change.
- Deny cross-tenant access.
- Preserve old question-version mappings after content revision.
- Send the correct question-version pointer to DRE.
- Ensure historical enrichment is idempotent and leaves original evidence unchanged.
- Ensure AI suggestions cannot auto-publish.
- Verify mobile workflow and server-side pagination.

## 21. Build sequence

Audit existing system first. Then build generic configuration and inventory, tagging workflow, academic metadata/provenance, review/version governance, bulk operations/analytics, integrations and finally AI assistance. DRE itself is outside this DTE build sequence.
