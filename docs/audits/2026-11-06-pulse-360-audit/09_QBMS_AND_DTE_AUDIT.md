# QBMS and DTE Audit

## QBMS / Q-GENOME

The repository documents the need for stable question identity, exact question versions and placement/slot identity to remain separate. System A correctly treats QBMS question references as optional enrichment rather than a prerequisite for daily tracking.

No production QBMS application, question inventory database, upload pipeline, duplicate detection service, media repository or review workflow was verified in the audited repository/live systems. Therefore QBMS is classified as **architecture/requirements only or not evidenced as implemented**, not production-ready.

Required QBMS gates:
- Canonical question identity/version/source/media schema.
- Normalized many-to-many concept/classification relationships.
- Schema versioning and migration/inheritance policy.
- Review and provenance history.
- Duplicate detection at million-question scale with human adjudication.
- Secure ingestion, OCR/Math parsing validation, quarantine and publication gates.
- Integration contract that pins exact question version and preserves source provenance.

## DTE

The repository contains DTE M01–M18 specifications, a module register, glossary, responsibility matrix, an 18-module audit and a scope-compliance audit. The prior DTE audit explicitly says it is documentation-only and that the documents are not implementation-ready.

Critical DTE findings already identified in its own audit:
- No canonical DTE data model/ERD.
- Question identity and mapping attachment level unresolved.
- Overlapping module ownership (M10/M15, M11/M15, M16/M18, M01/M14, M05/M06/M09 and M04/M07/M08).
- Workflow state machines are illustrative rather than normative.
- Authorization and scale/testability contracts need completion.

Positive scope control:
- DTE is institution-defined classification management software, not a curriculum authoring or chapter-wise syllabus generation engine.
- It must not impose a universal Subject→Chapter→Topic→Concept hierarchy.
- Question Type, archetype, pedagogical metadata, PYQ provenance and DRE difficulty are separate concepts.
- AI suggestions must not silently publish.

## Boundary verdict

System A / DTE separation is a sound architectural principle and should be preserved. Do not build DTE-dependent UI or database requirements into the core System A assignment/evidence path.
