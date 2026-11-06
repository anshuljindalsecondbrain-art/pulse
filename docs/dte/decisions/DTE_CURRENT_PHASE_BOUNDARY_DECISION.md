# DTE Current Phase Boundary Decision

- Decision ID: PULSE-DTE-DEC-004
- Version: 0.1.0
- Status: Draft — proposed product boundary clarification
- Product: PULSE — Deep Tagging Engine (DTE)
- Decision date: 2026-11-06
- Decision owner: Product Owner
- Related document: `docs/dte/DTE_MASTER_DOCUMENTATION_REGISTER.md`

## 1. Decision statement

The current DTE work is limited to defining and building the software-supported management of an institution-approved **offline question-tagging framework**.

Questions are not being uploaded, ingested, stored or managed in the current phase. The institution's authorized academic team defines and approves the academic classification structure. DTE provides the means to configure, document, govern and manage that approved structure and the offline human process for applying tags to questions.

A separate module will handle question upload in a later phase. Questions uploaded through that module will subsequently be tagged using the framework defined in the current phase.

## 2. Current phase — in scope

1. Configure and maintain institution-defined, institution-approved classification structures.
2. Manage tag/category/field definitions, descriptions, identifiers, aliases, ordering and applicable relationships as approved by the institution.
3. Record tagging instructions, definitions, decision rules and examples supplied or approved by authorized academic personnel.
4. Define and manage offline tagging templates, sheets or equivalent structured documents.
5. Define the human process for assigning tags to questions outside the software.
6. Define checking, correction, review, approval and change-control procedures for the offline tagging framework and its records.
7. Define quality, consistency and completeness checks that can be applied to offline tagging work.
8. Preserve framework versions and governance history where required for controlled offline operations.

## 3. Explicit exclusions from the current phase

The current phase does not include:

- Uploading or importing question content.
- OCR, extraction or question-content ingestion.
- A digital question inventory or question repository.
- Question content storage, editing or authoring.
- A digital question-tagging workspace that attaches tags to uploaded question records.
- Canonical question identity, question-version or placement data architecture.
- Automated or AI-generated question tagging.
- Q-GENOME integration or canonical question ownership decisions.
- Student attempts, assignments, performance evidence or analytics.
- Test generation, test delivery, scoring or difficulty calculation.

These are not rejected as future product capabilities. They are deferred and must be specified separately before their implementation phase.

## 4. Academic authority and taxonomy ownership

1. The institution or its authorized academic team owns the academic classification decisions.
2. DTE must not design, prescribe, generate, recommend as authoritative, or impose chapter-wise syllabus bifurcation, curriculum structure or a universal hierarchy.
3. DTE must support the structure the institution has approved; it must not assume a mandatory Subject → Chapter → Topic → Concept hierarchy.
4. Flat, hierarchical, multi-group or other institution-approved structures must be represented according to the requirements confirmed for the current phase.
5. Examples in software documentation are illustrative unless explicitly approved by the institution.
6. Technical validation or publication of a configuration does not confer academic authority on DTE.

## 5. Meaning of “offline tagging”

For this decision, offline tagging means a human applies the institution-approved tags to questions outside the DTE question-upload/digital-inventory workflow, using approved instructions and templates/sheets. DTE manages the framework, its documentation and its governance; it does not need to possess the question content to define this process.

The exact file format, template layout, required columns, identifier conventions and evidence fields remain requirements to be documented and approved. They must not be invented as settled decisions.

## 6. Later phase — separate question upload and digital tagging

A later phase will introduce a separate question upload/ingestion module. That phase must specify, at minimum:

- Supported upload sources and formats.
- Content extraction/OCR and human verification, if required.
- Question inventory and content ownership.
- Question identity, versioning and duplicate handling.
- Digital question-to-tag assignment and review workflow.
- Mapping attachment, history and migration semantics.
- Integration with Q-GENOME or another canonical question domain, if applicable.
- Permissions, audit, security, performance and recovery requirements.

The later module should consume the approved tagging framework from the current phase. It must not silently redefine academic classification values or create new academic categories without authorized institutional configuration.

## 7. Impact on existing DTE documentation

All existing M01–M18 specifications and DEC-001 through DEC-003 are Draft artifacts. Their existence does not make their features part of the current phase.

The documentation register must classify each artifact as:
- Current phase — retain/revise for offline framework management.
- Later phase — defer until question upload and digital tagging are designed.
- Out of product scope — retire only after explicit review and rationale.

In particular:
- Question Inventory, digital Tagging Studio, question identity/versioning, digital mapping persistence and Q-GENOME integration must not be treated as current-phase implementation requirements.
- Classification configuration, tagging definitions/guidelines, offline templates, human review, quality checks and configuration governance are candidates for current-phase requirements, subject to detailed review.
- Existing module names are not authoritative statements of scope.

## 8. Consequences and constraints

- The current-phase documentation must not require a question database, question upload pipeline or question-content API.
- The current phase may define stable identifiers for tagging-framework elements; these are not question IDs.
- Any offline tagging template design must be based on confirmed operational needs and approved academic terminology.
- Later digital implementation may reuse the framework, but must separately resolve digital identity and mapping semantics.
- The current phase must remain useful even if question upload is developed by a different module or team.

## 9. Open questions for the current phase

1. What exact tagging structure(s) have already been approved by the institution?
2. Which fields/columns must an offline tagging sheet contain?
3. How is each question referenced on the offline sheet without creating a DTE question repository?
4. Who prepares, tags, checks, corrects and approves offline tagging work?
5. What evidence is required to verify a tagging decision?
6. How are ambiguous, unmatched or disputed tags escalated?
7. How are framework changes communicated to offline taggers and existing sheets?
8. What file formats and handoff conventions are used by the later upload module?

These are requirements questions, not permission for DTE to invent academic taxonomy.

## 10. Approval

- Product owner approval: Pending
- Academic authority approval: Pending
- Architecture review: Pending
- Implementation authorization: Not granted

## 11. Change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-11-06 | Draft | Initial current-phase boundary decision distinguishing offline tagging framework management from later question upload and digital tagging |
