# DTE Product Scope and Phase Roadmap

- Document ID: PULSE-DTE-PRODUCT-001
- Version: 0.1.0
- Status: Draft — proposed phase-aware product baseline
- Product: PULSE — Deep Tagging Engine (DTE)
- Date: 2026-11-06
- Related audit: docs/dte/audits/DTE_FULL_DOCUMENTATION_AUDIT_002.md
- Implementation authorization: Not granted

## 1. Product definition

DTE is the software system for managing an institution-defined and institution-approved question classification/tagging framework and the controlled processes that use that framework.

The academic institution retains authority over academic meaning, classification decisions, terminology, taxonomy structure and approval. DTE provides configurable software to record, organize, version, validate, govern and report on those decisions.

DTE is not a curriculum-design engine. It must not prescribe chapter-wise bifurcation, invent academic hierarchy or impose one universal tagging model.

## 2. Product phases

### Phase 1 — Offline tagging framework and operating management (CURRENT)

**Purpose:** establish the approved framework and manage the human offline tagging operation without uploading or storing question content in DTE.

Potential capabilities, subject to confirmation:
- Institution and workspace setup.
- Configurable classification framework and independent classification groups.
- Definitions, descriptions, aliases, codes, allowed values and relationships approved by the institution.
- Question-type, archetype and pedagogical descriptor catalogues where the institution chooses to use them.
- Offline tagging instruction/manual and worked examples.
- Offline tagging sheet/template or work-package generation.
- Stable identifiers for framework elements and template/configuration versions.
- Human work allocation and status tracking for offline tagging assignments, if required.
- Submission of completed tagging sheets/structured results for validation, without ingesting question content.
- Review, correction, dispute and approval workflows for framework and offline tagging results.
- Quality validation and completeness profiles.
- Framework versioning, audit history, deactivation and change communication.
- Offline work progress/productivity/quality reporting, if required.
- Export/handoff package for later question-upload module.

**Hard exclusions:** question upload, OCR, question content storage, digital question inventory, digital question-to-tag mapping persistence, question identity/version/placement architecture, automated question tagging, student evidence, test management, difficulty calculation.

**Meaning of offline:** human tagging occurs outside the DTE digital question-ingestion/tagging workflow, using institution-approved instructions and templates. DTE can manage the framework and the offline operation. A question reference on a sheet does not create a DTE question record.

### Phase 2 — Question upload and ingestion (FUTURE, SEPARATE MODULE)

**Purpose:** accept question content through a separate upload/ingestion module.

Discovery topics:
- Upload sources and file formats.
- PDF/image/DOCX/Excel/manual inputs, if selected.
- OCR/extraction, parsing, image/media handling and human verification.
- Temporary staging, validation, duplicate candidates and acceptance.
- Question-content ownership and licensing.
- Canonical question identity and immutable content versions.
- Batch/job processing, failure recovery and provenance.
- Integration with the approved DTE framework.

This phase is not part of current DTE implementation. The future upload module must not silently create or change academic framework values.

### Phase 3 — Digital tagging and enrichment (FUTURE)

**Purpose:** apply the approved framework to uploaded question records.

Discovery topics:
- Digital tagging workspace and question preview.
- Assignment of framework values to uploaded question versions or other explicitly defined target records.
- Mapping history, revision, review and publication.
- Bulk digital tagging and validation.
- Duplicate/related-question handling.
- PYQ provenance capture.
- Digital tagging coverage and productivity analytics.
- Reconciliation with offline work already completed.
- Framework version migration and historical interpretation.

This phase requires a separate product and data architecture decision. Do not assume the old DEC-001/002/003 options are approved.

### Phase 4 — AI-assisted tagging and intelligence (FUTURE, OPTIONAL)

Potential capabilities:
- Suggestions using only approved framework values.
- Evidence, confidence, model/prompt version and human review.
- Evaluation against a human-reviewed dataset.
- Drift monitoring, audit and rollback.
- Similarity and duplicate candidate assistance.

AI must not author authoritative academic hierarchy, create new approved values, or publish mappings without the defined human approval.

### Phase 5 — Ecosystem integration and advanced analytics (FUTURE)

Potential integrations:
- Student Tracking for historical diagnostic enrichment.
- Q-GENOME or another canonical question intelligence/content domain.
- Difficulty Rule Engine (DRE) for difficulty-related references/outputs where contractually needed.
- Content, assessment, publishing and test systems.
- Cross-institute shared framework/reference governance if explicitly approved.

Student Tracking remains the owner of attendance, assignments, attempts, response status, doubts, student performance and intervention evidence. Student Tracking must operate independently of deep tagging completeness. DTE must never block operational student tracking because a question is not deeply tagged.

## 3. Academic authority principles

1. Institution-approved academic structure is the source of truth.
2. DTE stores and manages the structure; it does not design it.
3. No fixed taxonomy hierarchy is mandatory.
4. Flat, hierarchical, multi-group or custom models may be supported according to approved requirements.
5. Examples such as Subject, Chapter, Topic, Concept, Sub-concept and Model Archetype are examples only.
6. Required/optional status is institution-configured and versioned.
7. Unknown values must be reported for authorized human action; software/AI must not silently invent academic values.
8. Configuration approval is an administrative workflow; it does not replace academic approval.

## 4. Separation of concerns

| Domain | Owner |
|---|---|
| Approved classification framework and DTE governance | DTE |
| Offline tagging instructions, templates and work status | DTE, subject to current requirements |
| Question authoring/content creation | External content/question source |
| Question upload and ingestion | Separate future upload module |
| Canonical question identity/version | To be decided in future digital architecture |
| Digital question-to-tag mappings | Future digital tagging design |
| Student attendance, assignments, attempts and doubt evidence | Student Tracking |
| Difficulty calculation and dynamic difficulty | DRE |
| Test composition, delivery and scoring | Assessment/test systems |
| AI suggestions | Future governed AI capability; human authority retained |

## 5. Current-phase requirements still to be confirmed

The following must be elicited from the actual offline workflow; this document does not invent the answers:

- Existing tagging sheet/template and sample completed sheets.
- Question reference/serial convention used on paper or spreadsheet.
- Whether taggers work individually, in teams or by subject/batch.
- Whether work allocation is needed in software.
- Whether completed sheets are uploaded for validation or only recorded as externally completed.
- Which fields are required, optional or conditional.
- Whether difficulty is part of the offline framework or owned by a separate process.
- Which PYQ provenance fields must be captured offline.
- Whether archetype/model-question values are part of the current framework.
- Who reviews, approves and resolves disputes.
- Whether offline work requires productivity reporting.
- Required export format and handoff to future upload module.

## 6. Current-phase non-functional requirements

The following are requirements to specify and test, not assumed numeric targets:
- Tenant/institution data isolation.
- Role-based and resource-scoped authorization.
- Immutable audit history for approved framework changes and governed work.
- Versioned framework/template identifiers.
- Accessible, responsive configuration and review interfaces.
- Reliable export and reproducible template generation.
- Validation results that identify row/field and actionable errors.
- Backup, restore, monitoring and incident handling.
- Data minimization: no question content stored in current DTE phase unless a later approved scope change explicitly authorizes it.

Quantitative availability, latency, concurrency, file-size and recovery targets remain open.

## 7. Change control and phase gates

- Current-phase scope changes require documented impact assessment and product-owner approval.
- Later-phase features must not be pulled into Phase 1 by convenience or legacy module names.
- Phase 2/3 architecture begins only after a separate discovery and approval gate.
- Existing Draft documents remain Draft until explicitly approved.
- Superseded content remains in Git history; do not silently erase decisions.

## 8. Approval

- Product owner approval: Pending
- Academic authority approval: Pending
- Architecture review: Pending
- Implementation authorization: Not granted

## 9. Change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-11-06 | Draft | Initial phase-aware product scope and roadmap |
