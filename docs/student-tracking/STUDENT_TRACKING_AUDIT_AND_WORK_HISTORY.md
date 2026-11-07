# Student Tracking System — Audit, Work History and Current State

**Record date:** 2026-11-07  
**Scope:** Student Tracking System only  
**Repository:** `anshuljindalsecondbrain-art/pulse`  
**Audited application branch head:** `887e61c3dde4e9ad4dcaaf827260899ecedd2925`  
**PR:** [#2 — System A: Abhyas Matrix application foundation](https://github.com/anshuljindalsecondbrain-art/pulse/pull/2)

## 1. Executive assessment

The project has moved beyond a simple matrix mock-up: it now contains a responsive React/TypeScript prototype and a meaningful set of pure TypeScript academic workflow contracts with unit-test source files. However, it is not yet an operational Student Tracking System.

The principal gap is the distance between domain modelling and the live application data path. The main UI continues to use fictional browser-local data; the Supabase repository adapter is not connected to it; the inspected PULSE Supabase project has no deployed System A application schema; and publication, evidence, verification, correction and doubt workflows are not persisted end-to-end.

**Release status: NOT PRODUCTION READY.**

## 2. What has been done

### 2.1 Product and architecture definition
- Defined System A as Student Work Tracking / Abhyas Matrix, able to operate without question-bank or deep-tagging dependencies.
- Established the distinction between exercise, exercise version, exercise slot, assignment, assignment version and student obligation.
- Established the principle that numbered slots can be tracked without a canonical question reference.
- Defined append-only student evidence and independent verification/answer evaluation.
- Defined separate dimensions for work progress, answer evaluation, doubt, verification, correction and eligibility.
- Documented a logical database/ER baseline and a proposed implementation roadmap.
- Established shared identity and tenant design decisions in project governance records.
- Recorded that unresolved academic and platform decisions must not be silently assumed.

### 2.2 Frontend prototype
- Created the Student Tracking / Abhyas Matrix application under `apps/student-tracking`.
- Built the student-by-question matrix.
- Added six interaction states: U, C, I, D, S and P.
- Added student search and filters.
- Added keyboard navigation and status shortcuts.
- Added matrix and exercise summary views.
- Added cohort-level incorrect/doubt indicators.
- Added local CSV export.
- Added a demo roster of 24 fictional students across three sample batches.
- Added a fictional offline module catalogue and local assignment picker.
- Added a manual exercise builder and numbered question slots.
- Added responsive CSS for desktop, tablet and mobile layouts.
- Added a shared responsive stylesheet contract and documentation.

**Boundary:** These features are prototype behavior. Main UI state is stored in browser `localStorage`, not the production database.

### 2.3 Domain logic and tests added

The branch contains domain modules and corresponding test source files for:
- academic eligibility;
- answer evaluation;
- assignment planning and obligation expansion;
- correction workflow;
- doubt management;
- evidence submission and idempotent replay rules;
- evidence timeline projection;
- exercise builder validation;
- marking schemes;
- canonical work state and status helpers;
- workflow transitions;
- student worklists and teacher review queues;
- teacher verification.

These contracts encode useful invariants, but they are not substitutes for database constraints, trusted server-side authorization, atomic transactions or operational UI.

### 2.4 Backend foundation
- Added a browser-safe Supabase client using publishable environment configuration.
- Added a repository adapter for authenticated user resolution, institute membership lookup, learner/obligation lookup and append-only report insertion.
- Documented that client-supplied role claims are not trusted.
- Documented the missing RLS policies, grants and server-side actor/role validation.

### 2.5 Governance and engineering
- Added System A backend status documentation.
- Added database architecture and implementation plan documents.
- Added event and requirement traceability records.
- Added an open-issues register and migration runbook.
- Added CI workflow definitions and package scripts for typecheck, tests and production build.
- Added PR #2 as a draft; it must remain unmerged pending review.

## 3. What was audited in this review

### Source and repository
- Read current branch head and PR #2 metadata.
- Inspected branch tree and Student Tracking source paths.
- Inspected `App.tsx`, `ExerciseBuilder.tsx`, app README and domain file inventory.
- Inspected master completion specification, implementation plan, database architecture and backend implementation status.
- Inspected root `AGENTS.md`, root README, open issues, requirement traceability and event register.
- Reviewed the uploaded Student Tracking DOCX and System A Part 1/Part 2 conversation exports as historical source material.

### Audit limitations
- This was not a full line-by-line audit of every source file.
- No local test, typecheck or build command was run in this review.
- No new live Supabase catalog inspection was run during this review; database facts are carried forward from the recorded backend audit and must be refreshed before schema work.
- No Vercel deployment or browser/device QA was run in this review.
- No production data was read or modified.
- No code, database schema, migration, RLS, grant, deployment or PR merge was changed by the audit itself.

## 4. Verified current implementation boundary

| Area | Verified status | Meaning |
|---|---|---|
| Main UI | Prototype | Usable interactions, not production workflow |
| Primary persistence | localStorage | Browser-local demo data |
| Demo roster/catalogue | Fictional | Must not contain real student data |
| Supabase client | Present | Connection foundation only |
| Supabase repository adapter | Present, not wired to primary UI | No end-to-end live data path |
| System A database schema | Not deployed in inspected project per recorded audit | No operational persistence |
| Assignment publication | Domain planning only/local UI | No atomic database publication |
| Evidence submission | Domain contract only | No persistent event workflow |
| Verification/correction | Domain contract only | No server-authorized persisted decisions |
| Doubt management | Domain contract only | No persisted operational case workflow |
| Reports | Local projections | Not governed production analytics |
| Tests | Test source files exist | Current exact-head pass not re-established in this review |
| Preview | Historical READY build claims | Build readiness is not production readiness |

Do not conflate this newer System A Supabase project with the older Lovable Student_Tracking_System project, whose earlier audit observed a different pre-existing schema. They are separate application/database contexts until explicitly reconciled.

## 5. Critical findings

| ID | Finding | Severity | Current consequence |
|---|---|---|---|
| STS-001 | Main UI persists demo state in localStorage | Critical | No durable authoritative academic record |
| STS-002 | Supabase repository adapter is not used by primary UI | Critical | No live application data path |
| STS-003 | No System A schema/migration history in the inspected PULSE Supabase project, per recorded audit | Critical | No production persistence |
| STS-004 | Assignment publication is not transactional/persisted | Critical | No guaranteed obligation creation |
| STS-005 | Synthetic student and module data are used | High | Cannot operate with real student records |
| STS-006 | Matrix changes do not append persistent evidence events | Critical | No authoritative student activity history |
| STS-007 | A/B experiment selector/telemetry is not operational | Low / excluded | Not in approved pilot scope |
| STS-008 | Navigation entries overstate implemented module coverage | High | UI presence is not module completion |
| STS-009 | Verification domain is not persisted or server-authorized | High | Academic decisions are not operationally trustworthy |
| STS-010 | Current Demo Faculty/Teacher UI conflicts with one-Super-Admin pilot | High | Pilot access model is not implemented |
| STS-011 | Student/batch management is local and not authoritative | Critical | Student master and enrolment are not operational |
| STS-012 | Exercise and assignment lifecycles are not separately persisted | Critical | Drafts and assignments are not reliable records |
| STS-013 | Matrix state is not persistent append-only evidence | Critical | Historical evidence and provenance are missing |
| STS-014 | Verification/correction/doubt are domain-only | High | Workflows cannot be completed operationally |
| STS-015 | Reports derive from local demo state | High | Analytics are not production evidence |

## 6. Module-level assessment

| Module | Status | Reason |
|---|---|---|
| Student Master | Partially implemented / conflicting | Local fictional roster and add-student interaction; no authoritative pilot workflow |
| Academic Structure | Partially implemented | Synthetic offline catalogue; no verified authoritative persistence |
| Batch & Enrolment | Partially implemented / conflicting | Local batch association; no effective-dated history |
| Exercise / DPP | Partially implemented | Builder and slots exist, but local-only |
| Assignment Management | Domain-only | Deterministic planning, no atomic publication |
| Abhyas Matrix | Partially implemented | Interactive matrix, local state only |
| Student Activity Tracking | Domain-only | Evidence contracts, no connected persistence |
| Verification & Correction | Domain-only | Pure workflow contracts, no server-side operational workflow |
| Doubt Tracking | Domain-only / UI partial | Doubt logic and visual signals, no persistent cases |
| Reports & Analytics | Partially implemented | Local projections and CSV export |
| Administration & Audit | Missing for pilot | Demo role labels; no complete Super Admin controls/audit |

## 7. Scope corrections applied to this baseline

The earlier broad System A drafts include multiple roles and additional capabilities. They must be interpreted under the current pilot boundary.

**In scope:** the 11 modules in the current baseline and the Super Admin-only pilot.

**Deferred:** student, parent, teacher, reviewer and mentor logins; parent portal; multi-institute self-service; commercial billing.

**Excluded:** QBMS, System B/DTE, DRE, AI-Mentor, AI interventions, test delivery and unrelated intelligence engines.

The uploaded DOCX contains historical A/B experiments, tagging-oriented SQL examples and old tracker behavior notes. These are historical discussion records, not current authorization to implement those items. The System B PDFs are outside this audit's implementation scope.

## 8. Current unresolved decisions

- OPEN-010: concurrent active enrolment policy.
- OPEN-011: shared/global versus institute-owned academic catalogue ownership.
- OPEN-018: teaching assignment model.
- Progress metric policy and aggregate/question-level reconciliation rules.
- Publication amendment and obligation-delta policy.
- Answer evaluation and marking policy details.
- Final physical schema reconciliation with shared PULSE identity/tenant architecture.

No unresolved decision is closed by this document.

## 9. Next work sequence

1. Complete the domain logic and test audit.
2. Reconcile shared identity decisions with the Super Admin-only pilot.
3. Refresh live Supabase inspection read-only.
4. Finalize unresolved academic decisions with owners.
5. Produce reviewed physical schema, authorization matrix and migration plan.
6. Implement Super Admin + Student Master vertical slice.
7. Implement academic structure and batch/enrolment.
8. Implement exercise versioning and slot scaffolding.
9. Implement transactional assignment publication and obligations.
10. Connect Abhyas Matrix to append-only persisted activity evidence.
11. Implement verification, correction and doubt persistence.
12. Build governed reports and audit operations.
13. Run complete security, integration, browser and accessibility acceptance tests.

## 10. Governance status

- PR #2 remains draft and unmerged.
- No production migration is authorized.
- No production deployment is authorized.
- No real student data may be entered into demo/localStorage or protected preview.
- All implementation increments must include files changed, behavior changed, exact tests run, migration impact, security implications and unresolved risks.
