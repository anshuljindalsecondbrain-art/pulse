# Student Tracking System — Current Product Baseline

**Baseline date:** 2026-11-07  
**Authority:** Current project decisions and verified repository state  
**Status:** Governing product baseline for the Student Tracking System  
**Repository:** `anshuljindalsecondbrain-art/pulse`  
**Baseline branch:** `docs/student-tracking-baseline-reset-2026-11-07`

> This document supersedes conflicting scope, pilot-role, and delivery assumptions in earlier System A drafts. Historical documents remain evidence of prior discussion; they are not automatically current requirements.

## 1. Product definition

The Student Tracking System is a standalone academic operations system for maintaining student records, academic structure, batch enrolment, exercises/DPPs, assignments, student work activity, verification, doubts, reports and administrative audit.

The Abhyas Matrix is the principal student-activity interface. It is not the entire product.

## 2. Governing scope: 11 modules

| ID | Module | Product responsibility |
|---|---|---|
| STS-M01 | Student Master | Create, identify, update, deactivate and search student records; preserve history |
| STS-M02 | Academic Structure | Maintain academic sessions, classes, streams, subjects, chapters and applicable curriculum structure |
| STS-M03 | Batch & Enrolment Management | Manage batches and effective-dated student enrolments/transfers |
| STS-M04 | Exercise / DPP Management | Create exercise definitions, versions, slots and marking configuration |
| STS-M05 | Assignment Management | Target students/batches, publish assignments and create immutable student obligations |
| STS-M06 | Abhyas Matrix | Capture and inspect student work at aggregate or question-slot level |
| STS-M07 | Student Activity Tracking | Preserve reported work, observations, attempt cycles and evidence history |
| STS-M08 | Verification & Correction | Record independent completion/answer decisions and correction cycles |
| STS-M09 | Doubt Tracking | Record, assign, investigate, resolve, confirm and reopen doubts |
| STS-M10 | Reports & Analytics | Produce traceable progress, accuracy, workload and cohort reports |
| STS-M11 | Administration & Audit | Super Admin controls, operational configuration and immutable audit trail |

Do not silently add modules or convert future ideas into approved requirements.

## 3. Explicit exclusions

The following are outside the current Student Tracking implementation scope:

- QBMS / question-bank ownership, authoring, review or publication.
- System B / Deep Tagging Engine, taxonomy authoring or concept graph management.
- Difficulty Rule Engine.
- AI-Mentor, automated learner interventions or AI risk decisions.
- Test delivery engine and full test-series management.
- Commercial subscriptions, billing and multi-institute self-service onboarding.
- Parent portal, student portal and separate teacher/reviewer/mentor accounts in the initial pilot.
- A/B experimentation, feature-flag telemetry and growth experiments unless separately approved.

A question identifier may be stored as an optional source reference. Student Tracking owns its exercise slot and evidence, not the referenced question content.

## 4. Initial pilot operating model

The approved pilot is deliberately narrower than the long-term multi-role specification:

1. One Super Admin authenticated login operates the pilot.
2. Super Admin manually creates and maintains student records.
3. Students do not log in during the pilot.
4. Super Admin operates all enabled modules.
5. Teacher, reviewer, mentor, parent and student logins are deferred.
6. A student record does not require a Supabase Auth identity, person link or tenant membership merely to exist.
7. The authenticated operator is the actor for data entry. The student is the subject of the academic record.
8. Never invent a teacher, student or parent actor. Preserve the original actor if known and record the actual operator who entered/imported data.
9. Tenant boundaries, server-side authorization, audit history and append-only academic evidence remain required; a one-user pilot is not permission to weaken security.
10. Never expose service-role credentials in browser code.

The shared PULSE identity/tenant design decisions remain architectural constraints for future multi-user operation, but must not force student Auth accounts into the pilot.

## 5. Tracking modes

Both modes are supported.

### 5.1 Exercise-level quick entry

Capture student × assigned exercise values:
- assigned question/slot count;
- attempted count;
- correct count;
- incorrect count;
- skipped/unattempted count;
- reported completion;
- event date/time;
- source/provenance;
- operator actor and remarks.

Validation:
- Counts must be non-negative integers and fit the assigned denominator.
- Correct, incorrect, skipped and unattempted categories must not be conflated.
- Skipped/unattempted is not incorrect.
- If detailed question-level evidence exists, aggregate values must be derived or reconciled against it.
- Aggregate-only evidence is valid but must be visibly marked as not question-resolved.
- Never invent individual question attempts from aggregate counts.

### 5.2 Question-level evidence

Capture student × assignment obligation × exercise slot:
- attempt/revision cycle;
- report or observation state;
- answer evaluation;
- completion verification;
- doubt;
- teacher observation/explanation;
- correction/resubmission;
- source, timestamp, actor and provenance.

Rules:
- Completion verification is not answer correctness.
- Student report is not teacher verification.
- Teacher observation is not student self-report.
- Correction is a new event, not an overwrite.
- Every verification references the exact evidence event reviewed.

## 6. Academic state vocabulary

The current prototype uses six interaction states:

| Code | Meaning |
|---|---|
| U | Unattempted |
| C | Correct |
| I | Incorrect |
| D | Doubt |
| S | Skipped |
| P | Partially correct |

These are input shortcuts, not the complete canonical academic model. Persisted data must separate work progress, answer evaluation, doubt lifecycle, verification, correction and eligibility. Do not treat a single cell status as the whole academic truth.

## 7. Data ownership and core entities

Student Tracking owns operational records for:
- student tracking profile (with shared identity references only where applicable);
- batch and enrolment references under the approved shared-core boundary;
- exercise and exercise versions;
- exercise slots;
- assignments and assignment versions;
- assignment targets and publication snapshots;
- student obligations;
- aggregate activity records;
- append-only student reports and teacher observations;
- attempt cycles;
- verification decisions;
- correction cycles;
- doubt cases and events;
- report projections and audit records.

The shared PULSE core remains authoritative for tenant, person, Auth mapping, tenant membership, role grants and canonical shared academic identity where already decided. Do not duplicate those authorities locally. Do not implement any database schema until the physical design is reconciled with the approved decisions and live environment.

## 8. Governing architecture rules

1. Student Tracking works without QBMS or DTE.
2. A numbered exercise slot exists even when no canonical question is linked.
3. Question identity, question version and exercise placement slot are different entities.
4. Published exercise and assignment versions are immutable.
5. Publication resolves the target roster into an explicit snapshot and creates obligations transactionally.
6. Evidence is append-only; corrections and later decisions supersede by reference, never destructive update.
7. Progress, verification and accuracy are separate projections.
8. Authorization is enforced server-side and by database policy; UI visibility is not authorization.
9. Idempotency must be enforced at the database transaction boundary, not only in pure functions.
10. Tenant-safe foreign keys and cross-tenant denial tests are mandatory before live access.
11. Never claim production readiness from a frontend preview build.
12. No production DDL, grants, RLS changes, data movement, merge or deployment without explicit approval.

## 9. Decisions that remain open

- OPEN-010: whether concurrent active enrolments are allowed. No uniqueness/overlap rule may be added before Academic Owner approval.
- OPEN-011: ownership policy for shared versus institute-specific academic catalogue records.
- OPEN-018: teaching assignment and staff responsibility model.
- Additional open decisions include metric policy, aggregate reconciliation rules, publication amendments, answer-evaluation policy and the exact initial schema boundary.

An unresolved decision must remain visible in the decision register. Do not close it by inference.

## 10. Product readiness definition

The system is not operationally ready until:
- the approved pilot identity and authorization model is implemented;
- all 11 modules have explicit acceptance criteria and traceability;
- database schema and migrations are reconciled and reviewed;
- the core exercise → assignment → obligation → activity → verification → reporting workflow persists end-to-end;
- audit and idempotency are enforced server-side;
- cross-tenant and permission-denial tests pass;
- typecheck, unit, integration, browser and accessibility checks pass on the exact candidate commit;
- an owner-approved release gate is recorded.

**Current state:** Prototype and domain-contract foundation. Not production-ready. Do not enter real student data into the local demo.
