# DTE-M13 — Validation & Quality Engine Specification

- Document ID: PULSE-DTE-M13
- Version: 0.1.0
- Status: Draft — Pending product review
- Parent: docs/dte/DTE_MODULE_REGISTER.md
- Last updated: 2026-11-06

## Governing scope clarification — classification management software

DTE manages institution-defined academic classification and tagging structures. It does not design, prescribe, generate or impose chapter-wise syllabus bifurcation, curriculum structure or a universal academic hierarchy. Institutions define their own categories and terminology; DTE provides software to configure, record, map, search, validate, review, version, govern and report on those existing structures. Academic terms such as subject, chapter, topic and concept are examples of institution-managed data, not mandatory DTE levels or a curriculum-design function.

## 1. Purpose

Validation & Quality Engine evaluates whether DTE configuration and question mappings satisfy their applicable structural, semantic, workflow and completeness rules. It provides consistent validation results to Tagging Studio, Bulk Tagging, Review & Approval, dashboards and downstream consumers.

Validation determines whether defined rules pass. Quality analytics may summarize trends, but must not replace explicit rule outcomes with an opaque single score.

## Institutional authority guardrail

Validation rules must be derived from the applicable institution-approved configuration and its explicitly enabled policies. The engine must not enforce a universal academic hierarchy, fixed chapter/topic/concept levels, or relationships that the institution has not configured.

## 2. Scope

In scope:
- Schema/configuration validation.
- Question mapping validation.
- Relationship integrity validation.
- Question type and metadata validation.
- Archetype link validation.
- PYQ provenance validation.
- Configurable completeness profiles.
- Blocking errors, warnings and informational findings.
- Validation snapshots tied to question, mapping and schema versions.
- Revalidation triggers and quality exception reporting.
- Shared validation contracts for single and bulk workflows.

Out of scope:
- Difficulty scoring and exam multipliers.
- Student performance or mastery assessment.
- Human approval decisions.
- Authoring or changing question content.
- Defining taxonomy structures (M04).

## 3. Validation categories

Candidate categories:
1. Structural — required fields, valid types, valid references.
2. Relationship — endpoint compatibility, cardinality, prohibited cycles, primary designation constraints.
3. Schema compatibility — mapping uses the correct schema/version and allowed nodes.
4. Lifecycle — inactive, deprecated or retired entities used in new assignments.
5. Metadata — allowed values, data types, applicability and cardinality.
6. Provenance — required evidence, valid exam references and verification state.
7. Duplicate/conflict — duplicate mappings, conflicting primary assignments or suspected duplicate questions.
8. Completeness — configured profile requirements.
9. Workflow readiness — requirements to save, submit, approve or publish.
10. Migration compatibility — whether an existing mapping remains interpretable under a new schema version.

## 4. Rule model

Each rule should define:
- Stable rule ID and version.
- Name and description.
- Applicable entity/record types.
- Scope/tenant/schema applicability.
- Severity: blocking error, warning or information.
- Evaluation logic or versioned implementation reference.
- Effective date and active state.
- Workflow stage at which it is enforced.
- Remediation guidance.
- Owner and change history.

Rules must be deterministic where possible. Any probabilistic/AI-derived signal must be labelled as such and must not masquerade as a deterministic validation failure.

## 5. Completeness profiles

Completeness is configurable and contextual.

A profile should define:
- Stable profile ID and version.
- Applicable tenant/schema/content scope.
- Required classification groups/fields/relationships.
- Conditional requirements.
- Whether metadata, question type, archetype or provenance are required.
- Applicable workflow stage.
- Exclusions and eligibility rules.
- Effective dates.

The engine must calculate completeness against the exact profile version and disclose missing requirements. It must not hardcode a six-level hierarchy or a universal count of tags.

A record may be complete under one profile and incomplete under another. Dashboard and inventory consumers must display the profile context.

## 6. Validation result model

Each validation run should identify:
- Run ID.
- Entity/question ID and exact version.
- Mapping revision.
- Schema ID/version.
- Completeness profile/version, if used.
- Rule-set version.
- Initiator/source (interactive, batch, scheduled, API).
- Start/end timestamps and status.
- Findings with rule ID, severity, field/relationship reference and remediation.
- Summary counts.
- Whether the result is current or stale.

Validation results must be reproducible against the recorded inputs and rule versions where technically feasible.

## 7. Workflow enforcement

Different actions may have different validation gates:
- Save draft: basic integrity; configurable warnings may remain.
- Submit for review: all submission-blocking rules pass.
- Approve: reviewer policy and validation freshness requirements pass.
- Publish: publication-blocking rules pass against the exact approved revision.
- Bulk commit: per-record validation and job-level constraints pass.

The final gate matrix is an open decision. Validation engine reports outcomes; M10 owns human decisions.

## 8. Revalidation and stale results

Revalidation may be required when:
- Mapping revision changes.
- Schema version changes.
- A referenced node/type/metadata definition is deprecated or retired.
- Validation rule version changes.
- Completeness profile changes.
- Provenance evidence changes.
- A migration transforms mapping references.

A stale validation result must not be shown as current. Consumers must be able to identify the exact revision and rule/profile versions evaluated.

## 9. Quality indicators

Candidate indicators include:
- Percentage of eligible records passing a named completeness profile.
- Count of blocking errors and warnings.
- Duplicate mapping rate.
- Invalid relationship rate.
- Review rejection/rework rate.
- Provenance verification coverage.
- Stale validation result count.

Any aggregate quality measure must have a documented formula, denominator and time window. Do not create an unexplained composite quality score in this module.

## 10. Security and performance

- Validate tenant scope and permissions for all reads and writes.
- Do not expose hidden field values in findings.
- Use asynchronous execution for large batches.
- Cache only with rule/profile/schema/revision context in the cache key.
- Index common validation dimensions and exception states.
- Preserve validation history according to retention policy.
- Prevent users from modifying rule outcomes through client-side parameters.

## 11. Acceptance criteria

1. Validation rules are versioned and identifiable.
2. Findings distinguish blocking errors, warnings and information.
3. Completeness is evaluated against an explicit profile/version.
4. No fixed taxonomy depth or tag count is hardcoded.
5. Validation results identify exact question, mapping, schema and rule versions.
6. Stale results are clearly identified and cannot satisfy current publication gates.
7. Single-record and bulk workflows use consistent rules.
8. Review and publication gates are configurable and explicit.
9. Probabilistic suggestions are distinguished from deterministic validation.
10. No difficulty or student-performance scoring is performed.

## 12. Dependencies

- M04 Classification Configuration Studio.
- M05 Relationship Mapping Engine.
- M06 Archetype Management.
- M07 Question Type Manager.
- M08 Pedagogical Metadata Manager.
- M09 PYQ Provenance Manager.
- M10 Review & Approval.
- M11 Version & History Manager.
- M12 Bulk Tagging Manager.

## 13. Open decisions

| ID | Question | Status |
|---|---|---|
| DTE-M13-OD-001 | Which validation rules are mandatory for the initial release? | Open |
| DTE-M13-OD-002 | Who can create/edit rule definitions and completeness profiles? | Open |
| DTE-M13-OD-003 | Which default completeness profiles should be seeded? | Open |
| DTE-M13-OD-004 | What are the exact save/submit/approve/publish validation gates? | Open |
| DTE-M13-OD-005 | Which rule changes require revalidation of existing mappings? | Open |
| DTE-M13-OD-006 | What is the acceptable validation freshness window for publication? | Open |
| DTE-M13-OD-007 | Are quality indicators strictly descriptive or used in operational thresholds? | Open |

## 14. Change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-11-06 | Draft | Initial validation and quality specification |

## 15. Approval

- Product owner: Pending
- Technical review: Pending
- Implementation authorization: Not granted