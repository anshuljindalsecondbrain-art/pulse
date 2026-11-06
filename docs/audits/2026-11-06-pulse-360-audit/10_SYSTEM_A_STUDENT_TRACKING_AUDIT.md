# System A — Student Tracking Audit

## Implemented prototype and domain layer

The codebase includes a React matrix UI, fictional demo data, offline-module catalogue, Exercise Builder, and typed domain modules for workflow, assignment, worklist, evidence submission, teacher verification, correction, doubt, answer evaluation, evidence timeline, academic eligibility and marking schemes. Corresponding unit test files exist for the domain modules.

## What is not production implementation

- Main UI persists localStorage and does not call the repository adapter.
- No live student roster, batch or authenticated role context.
- No live application schema or migrations.
- No database RLS/grants.
- No transactional publication/obligation expansion.
- No operational notification or parent/mentor workflow.
- No browser/device QA evidence.
- No verified production data retention or audit service.

## Academic rules from source

- System A must start with a subject/chapter, exercise label and numbered slots; deep tags are optional.
- XII and Droppers may receive XI revision items; XI must not receive XII-only items.
- COMMON stream is required for shared Physics/Chemistry.
- Multi-chapter/full-syllabus exercises must be supported.
- Decimal and negative marks must be supported.
- Question-level and marks-based assessment must coexist.
- Re-test cycles must be supported.
- Syllabus lifecycle states ACTIVE, DEPRECATED and ADVANCED_ONLY require precise semantics.
- Source lists six classroom states; code also has Partially Correct. The owner must confirm whether it is a seventh UI state or an evaluation outcome.

## Implementation-specific findings

- Demo batch class and stream are inferred from display labels. This is unacceptable as production authorization or academic eligibility truth.
- Exercise Builder accepts teacher-entered chapter lists for multi/full syllabus; it is not wired to canonical syllabus data.
- Exercise Builder's domain supports immutable publish/revision concepts, but UI screens are incomplete.
- Standalone exercise draft is not yet integrated with assignment batch/due-date/eligibility lifecycle.
- Marking-scheme and assessment-mode support is currently local/domain-level.
- The repository adapter's source actor role is hardcoded to STUDENT for self-report and must not be treated as a client authorization claim.

## System A release gates

Approve canonical shared identity and academic context; implement server-derived role/scope; integrate query/command services; implement publication and immutable obligations transactionally; test XI/XII/Dropper/COMMON edge cases; test marks precision and negative values; add re-test lifecycle; verify correction/doubt/evaluation interactions; add E2E and accessibility tests; run exact-head CI and preview checks.
