# DTE Module Register

- Document ID: PULSE-DTE-REG-001
- Version: 0.1.0
- Status: Draft — source-consolidation baseline
- Product: PULSE — Deep Tagging Engine (DTE)
- Scope: DTE only; other PULSE systems are referenced only through integration contracts.
- Repository: anshuljindalsecondbrain-art/pulse
- Last updated: 2026-11-06

## Governing scope clarification — classification management software

DTE manages an institution's existing academic classification and tagging structures. It does not design, prescribe, generate or impose chapter-wise syllabus bifurcation, curriculum structure, or a universal academic hierarchy.

The institution or its authorized academic administrators define the classification structure and terminology. DTE provides software to record, organize, map, search, validate, review, version, govern and report on those institution-defined structures and their assignments to questions.

References to chapters, topics, concepts, sub-concepts, subjects or other academic categories are examples of data an institution may choose to manage. They are not mandatory levels, a prescribed hierarchy, or a curriculum-design responsibility of DTE.

## 1. Purpose

This register establishes the working inventory of functional modules and supporting capabilities required for the PULSE Deep Tagging Engine. It is a documentation control artifact, not an implementation authorization.

The inventory is consolidated from prior PULSE decisions and the supplied Student Tracking System source document. The module boundaries and names are provisional until the complete DTE requirements are reviewed and approved.

## 2. Scope boundary

### In scope
- Management and configuration of institution-defined classification structures and schemas.
- Question-to-classification mappings.
- Question inventory and tagging workflows.
- Reusable archetypes.
- Question type definitions.
- Configurable pedagogical metadata.
- PYQ provenance.
- Validation, completeness, review and publication.
- Versioning, audit history and bulk operations.
- DTE dashboards, quality and coverage reporting.
- AI-assisted tagging with human approval.
- Integration contracts for downstream consumers.

### Outside scope
- Student assignment, attendance, homework tracking and student performance analytics.
- Difficulty calculation, static/dynamic difficulty scoring, exam multipliers and difficulty history. These belong to the separate Difficulty Rule Engine (DRE).
- Test generation, test delivery, scoring and test series management.
- General content/course/module authoring beyond the references DTE needs to identify a question and its source context.
- AI Mentor intervention logic.

DTE may expose stable identifiers, classification mappings, provenance and version references to other systems. It must not take ownership of their business logic.

## 3. Architectural constraints governing all modules

1. DTE is a generic, multi-institute classification-management system. It is not hardcoded to Physics, JEE, NEET or a fixed academic hierarchy, and it does not design or generate academic classification structures.
2. Classification schemas and question mappings are separate concerns.
3. Represent and manage institution-defined hierarchical or non-hierarchical classification structures, configurable fields, classification groups, relationship types, aliases, ordering, dependencies and validation. Configuration records an institution-approved structure; it does not design or prescribe that structure.
4. Do not assume a fixed six-level Subject → Chapter → Topic → Concept → Sub-concept → Archetype hierarchy. That hierarchy is one historical academic example only.
5. Support global reference taxonomies and tenant-specific extensions as a policy requiring explicit governance; tenant isolation is mandatory.
6. Archetype identity is reusable and is not structurally trapped beneath one sub-concept.
7. Question type is configurable and separate from difficulty.
8. Pedagogical metadata is configurable; historical examples include Must Solve, Kota Trick, Repeated Trap, Calculation Intensive, Conceptual Trap, Multi-Concept, Graph/Diagram Based, Approximation Required, Time Consuming and High Exam Relevance.
9. PYQ provenance is separate from question identity. A logical question may have multiple exam/year/shift appearances and adapted versions.
10. Work status, review status, publication status and completeness are independent dimensions.
11. Completeness is derived from configurable profiles, not a universal fixed tag count.
12. Published mappings are not silently overwritten. Changes create revisions and preserve history.
13. No destructive cascade may remove questions or student evidence. Use restriction, archival or deactivation policies.
14. AI recommendations are suggestions; they must not silently publish mappings.
15. Large inventories (historical planning target: approximately 1,000,000 PCMB questions) require server-side pagination, indexed search and background processing.
16. DRE remains a separate engine. DTE stores only the agreed external evaluation pointer/contract, not difficulty calculations.

## 4. Functional module register

| ID | Module | Responsibility | Core capabilities | Dependencies / interfaces | Initial status |
|---|---|---|---|---|---|
| DTE-M01 | DTE Dashboard | Provide an operational overview of tagging work and quality | Inventory totals, work queues, review queues, coverage summaries, quality alerts, workload views | M02, M09–M16 | Proposed |
| DTE-M02 | Question Inventory | Find and manage the question records available for classification | Search, filters, server-side pagination, tenant/source scope, question preview, status filters, duplicate indicators | Question identity/version service; content source references | Proposed |
| DTE-M03 | Tagging Studio | Provide the primary question classification workspace | Question preview, dynamic classification form, relationship selectors, metadata, provenance, validation, completeness, save/submit/next, version comparison | M02, M04–M09, M11–M13 | Proposed |
| DTE-M04 | Classification Configuration Studio | Configure and maintain institution-approved classification schemas | Configurable groups, fields, institution-defined hierarchy or non-hierarchical structures, required/optional fields, aliases, ordering, dependencies, constraints and labels | M15; tenant governance | Proposed |
| DTE-M05 | Relationship Mapping Engine | Model links between classification entities and questions | Many-to-many mappings, typed edges, primary/secondary relationships, cross-branch and cross-domain links, relationship validation | M04, M06, M11 | Proposed |
| DTE-M06 | Archetype Management | Maintain reusable pedagogical question-pattern identities | Stable code/ID, title, description, strategy, traps, benchmark solving time, related archetypes, linked questions, lifecycle and revision history | M05, M11, M12 | Proposed |
| DTE-M07 | Question Type Manager | Configure question formats independently of difficulty | Tenant-configurable type catalogue, labels, codes, descriptions, constraints and active state | M04; question metadata contract | Proposed |
| DTE-M08 | Pedagogical Metadata Manager | Configure non-taxonomic pedagogical descriptors | Metadata definitions, allowed values, cardinality, tagging rules, examples and applicability | M04, M11, M12 | Proposed |
| DTE-M09 | PYQ Provenance Manager | Record exam appearance and source provenance | Exam, year, session/shift, paper, question number, source reference, appearance relationships and adapted-version links | M02, M11; source/licensing policy | Proposed |
| DTE-M10 | Review & Approval | Control human review and publication of mappings | Assignment, review queues, approve/reject/request changes, reviewer notes, separation of duties and publication gates | M03, M11, M12 | Proposed |
| DTE-M11 | Version & History Manager | Preserve immutable, inspectable classification history | Mapping revisions, schema versions, before/after comparison, actor, timestamp, reason, review and publication events | All modules that mutate governed records | Proposed |
| DTE-M12 | Bulk Tagging Manager | Support high-volume tagging operations safely | Bulk selection, batch edit, import/export, dry-run validation, error report, partial-failure handling, permissions and audit | M02–M11, M13 | Proposed |
| DTE-M13 | Validation & Quality Engine | Enforce configurable classification integrity and quality rules | Required-field validation, relationship integrity, duplicate detection, conflict checks, completeness profiles, quality flags | M04–M09, M11 | Proposed |
| DTE-M14 | Coverage & Productivity Analytics | Measure classification coverage and work quality | Explicit denominators, coverage by tenant/schema/subject/source, throughput, rework, review outcomes and quality measures | M02, M10–M13 | Proposed |
| DTE-M15 | Configuration Version Manager | Govern the lifecycle of classification configurations | Draft/review/publish/retire schema versions, compatibility checks, migration plans and effective dates | M04, M11, tenant governance | Proposed |
| DTE-M16 | Historical Enrichment Interface | Expose version-aware mapping changes to downstream systems | Change events, stable question/version references, idempotent enrichment requests, processing status and reconciliation | M05, M11, external Student Tracking contract | Proposed |
| DTE-M17 | AI Assistance Interface | Provide controlled AI suggestions for tagging | Suggested mappings, evidence/rationale, confidence, model/prompt version, human accept/reject, feedback and audit | M03–M09, M11, M13 | Proposed |
| DTE-M18 | External Engine Integration | Publish DTE-owned classification references to consumers | Read APIs/events, stable IDs, schema/mapping version references, consumer contracts and DRE pointer hand-off | M11, external systems including DRE and Student Tracking | Proposed |

**Important:** The 18 entries are the current logical module inventory, not a claim that the final DTE contains exactly 18 modules. A logical module does not automatically imply a separate microservice, deployable or database schema.

## 5. Cross-cutting capabilities

These capabilities apply across modules and may be implemented as shared platform services rather than standalone DTE modules.

| Capability ID | Capability | Required behaviour |
|---|---|---|
| DTE-X01 | Multi-tenancy and authorization | Enforce tenant scope on every read/write; server-side authorization; test cross-tenant isolation |
| DTE-X02 | Identity and question version references | Distinguish logical question identity, exact question version and placement/instance reference |
| DTE-X03 | Audit and traceability | Record actor, action, timestamp, before/after state, reason, schema/mapping version and approval context |
| DTE-X04 | Search and scale | Indexed server-side search, pagination, filtering and asynchronous bulk operations |
| DTE-X05 | Import/export | Schema-aware templates, validation, preview, error reporting and audit |
| DTE-X06 | Localization and labels | Separate canonical identifiers from tenant-specific display labels; support language-specific labels |
| DTE-X07 | Notifications and work queues | Notify users about assignments, review outcomes, failures and pending work |
| DTE-X08 | Observability | Structured logs, metrics, job status, failure handling and operational alerts |
| DTE-X09 | Accessibility and responsive UX | Keyboard operation, accessible controls and mobile progressive workflows |
| DTE-X10 | Data retention and archival | Preserve historical references; avoid destructive deletion of governed academic records |

## 6. Key DTE workflows to specify

1. Configure a new tenant classification schema.
2. Version, review, publish and retire a classification schema.
3. Search and open a question in the inventory.
4. Classify a question using a configured schema.
5. Add primary and secondary classification relationships.
6. Link a question to one or more reusable archetypes where allowed.
7. Add question type and pedagogical metadata.
8. Record one or more PYQ appearances and adapted-version relationships.
9. Validate, save, submit for review, approve and publish a mapping.
10. Revise an already-published mapping without destroying its previous revision.
11. Bulk import, validate, preview and commit mappings.
12. Process AI suggestions through human review.
13. Emit mapping-change events for downstream historical enrichment.
14. Provide DTE-owned references to downstream engines, including DRE, without owning their calculations.

## 7. DTE ↔ external system boundaries

### Student Tracking
DTE owns classification definitions and question-to-classification mappings. Student Tracking owns student assignment and attempt evidence. DTE may emit mapping-change events so a consumer can enrich historical analytics. The original student evidence must remain immutable. This register does not specify Student Tracking implementation.

### Difficulty Rule Engine (DRE)
DRE is a separate engine. DTE must not store or calculate static/dynamic difficulty scores, scoring weights, thresholds, exam multipliers or student-specific difficulty. The future hand-off may carry:
- question_id
- question_version_id
- external_engine_identifier
- external_evaluation_identifier
- evaluation_status
- result_reference
- last_evaluation_timestamp

The pointer must identify the exact question version. A new question version does not automatically inherit the validity of an earlier evaluation.

### Question/content source
DTE consumes stable question identity, exact question version and source/placement references. It does not become the owner of the broader content collection, course, book, test or assignment lifecycle.

## 8. Historical concepts requiring explicit disposition

The source material contains proposals that must remain visible but are not automatically accepted as current architecture.

| Historical proposal | Current disposition |
|---|---|
| Fixed six-level Subject → Chapter → Topic → Concept → Sub-concept → Archetype hierarchy | Historical example only; replaced as a universal architecture by configurable classification schemas |
| Difficulty values embedded in question tagging and archetype records | Out of DTE scope; DRE owns difficulty evaluation |
| Secondary concepts stored as a BIGINT array | Not accepted as canonical design; use governed many-to-many relationship records |
| Model question/archetype permanently parented to one concept/sub-concept | Not accepted as a universal constraint; archetype identity must be reusable |
| Fixed completeness rule requiring all six levels | Not accepted; completeness derives from configurable profiles |
| Directly editing published tags in place | Not accepted; revisions and audit history required |
| Global authenticated read policies | Must be reviewed against tenant isolation; never assume safe for multi-tenant use |
| Cascade deletion of taxonomy nodes into question records | Not accepted; preserve question identity and history |

## 9. Open decisions register

These are deliberately unresolved and must be decided during detailed specification.

| Decision ID | Question | Why it matters | Status |
|---|---|---|---|
| DTE-OD-001 | What is the exact boundary between global reference schemas and tenant-owned schemas/extensions? | Determines governance, reuse and tenant customization | Open |
| DTE-OD-002 | Can a question have multiple simultaneous classification schema assignments? | Affects mapping model and completeness | Open |
| DTE-OD-003 | What is the policy for mapping a question version versus a logical question identity? | Determines version inheritance and historical interpretation | Open |
| DTE-OD-004 | Which roles can create, edit, review, approve and publish each record type? | Determines separation of duties and permissions | Open |
| DTE-OD-005 | What are the default completeness profiles and who can configure them? | Drives quality and coverage reporting | Open |
| DTE-OD-006 | What are the duplicate detection rules and merge workflow? | Protects identity and source provenance | Open |
| DTE-OD-007 | What is the canonical PYQ provenance model, including adapted questions? | Avoids conflating identity with exam appearances | Open |
| DTE-OD-008 | What are the import formats, limits, validation policy and rollback behaviour? | Required for large-scale migration and operations | Open |
| DTE-OD-009 | What events/API contracts are required for downstream consumers? | Prevents tight coupling with Student Tracking and DRE | Open |
| DTE-OD-010 | What AI models, evaluation criteria and approval thresholds are acceptable? | Controls accuracy, explainability and governance | Open |
| DTE-OD-011 | What archival, retention and deactivation rules apply to schemas and mappings? | Preserves historical meaning without exposing obsolete choices for new tagging | Open |
| DTE-OD-012 | What languages and tenant-specific label/localization rules are required? | Affects schema definitions and UX | Open |

## 10. Module specification readiness checklist

A module is not ready for implementation merely because its name appears in this register. Its detailed specification must define:

- Purpose, scope and explicit non-goals.
- Actors, roles and permission matrix.
- Entry points, screens and navigation.
- Primary and alternate workflows.
- Data entities, ownership and relationships.
- Field definitions, validation and constraints.
- State transitions and lifecycle rules.
- API/event contracts and dependencies.
- Empty, loading, error, retry and concurrency states.
- Bulk operations and scale requirements where relevant.
- Audit, security, privacy and retention.
- Accessibility and responsive behaviour.
- Acceptance criteria and test cases.
- Open decisions, risks and change history.

## 11. Source and confidence notes

This draft consolidates previously recorded PULSE DTE decisions and the supplied STUDENT TRACKING SYSTEM.docx, including its historical six-level taxonomy, archetype fields, tagging dashboard, two-track integration concept and earlier SQL/UI proposals.

Where later architectural decisions supersede older proposals, this register records the older proposal as historical rather than silently adopting it. Items marked Open require explicit decisions. The module inventory is provisional and must be reconciled against all remaining DTE source discussions before approval.

## 12. Change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-11-06 | Draft | Initial DTE-only module inventory and scope boundaries consolidated for review |

## 13. Approval

- Document owner: PULSE product owner
- Approval status: Pending user review
- Implementation authorization: Not granted by this document
