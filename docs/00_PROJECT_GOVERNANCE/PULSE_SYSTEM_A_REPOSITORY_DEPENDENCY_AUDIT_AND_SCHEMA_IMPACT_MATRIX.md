# PULSE — System A Repository Dependency Audit and Schema Impact Matrix

- Document ID: PULSE-DATA-CORE-005
- Version: 0.1.0
- Status: Draft — repository source audit; runtime and full CI verification pending
- Date: 2026-11-06
- Branch inspected: `feat/system-a-abhyas-foundation`
- Parent: `PULSE-DATA-CORE-001` through `PULSE-DATA-CORE-004`
- Implementation authorization: Not granted
- Code/schema modification authorization: Not granted

## 1. Executive findings

The System A branch contains a substantial, well-separated pure domain layer and a visual Abhyas Matrix prototype. It does **not** yet contain a connected, database-backed Student Tracking application.

The UI's operational data path is browser `localStorage`. The Supabase client and repository adapter exist, but the inspected `App.tsx` does not import or call the repository adapter. The repository methods are not a completed application integration and the proposed database migration has no access policies or authenticated grants.

The most important implementation gap is therefore not additional domain logic. It is the missing trusted application boundary that connects authenticated identities, tenant/role/scope authorization, atomic database commands, and read models to the existing UI.

**Recommended next engineering objective:** produce an approved server command/query contract and a UI-to-domain-to-database integration map. Do not write migration SQL or wire direct browser writes until authorization and schema decisions are resolved.

## 2. Scope and method

Inspected the current contents of the System A feature branch for:
- the full PR #2 changed-file inventory;
- application entry point and primary UI;
- Supabase client and System A repository adapter;
- domain contracts and workflow command-preparation modules;
- demo data and offline catalogue;
- package/build configuration and CI workflows;
- backend implementation status, database baseline and implementation plan.

The audit is source inspection only. No local checkout, browser session, test command, build command, live API request, SQL execution or deployment was run during this audit. File paths and blob SHAs below identify the inspected source revisions.

## 3. Inspected source inventory

| Area | File(s) | Inspected revision / evidence |
|---|---|---|
| Main UI | `apps/student-tracking/src/App.tsx` | blob `01546bc343fe6b7c69f8b8bcefac7b8ed1f9d37a` |
| Supabase client | `apps/student-tracking/src/lib/supabase.ts` | blob `3462b86652d8169b87316afb3e0da68101429e39` |
| Repository adapter | `apps/student-tracking/src/lib/system-a-repository.ts` | blob `ed17fdac5878d0c73bbd110525fdef60d147db34` |
| Application package | `apps/student-tracking/package.json` | blob `e07a2740ceb7496e12e6278d5f602257f4da1f0f` |
| Environment example | `apps/student-tracking/.env.example` | blob `c943e3d73a9cf8cde378dfdd76074a52fe3133b0` |
| Vite entry | `apps/student-tracking/src/main.tsx` | blob `486d4ad53cd94b5fb0cd3e68ee23690ad8ff238d` |
| Domain vocabulary/projection | `src/domain.ts`, `src/workflow-domain.ts` | Feature branch source |
| Workflow transitions | `src/workflow-transitions.ts` | Feature branch source |
| Assignment planner | `src/assignment-domain.ts` | Feature branch source |
| Evidence submission planner | `src/evidence-submission-domain.ts` | Feature branch source |
| Teacher verification planner | `src/teacher-verification-domain.ts` | Feature branch source |
| Answer evaluation planner | `src/answer-evaluation-domain.ts` | Feature branch source |
| Correction workflow | `src/correction-workflow-domain.ts` | Feature branch source |
| Doubt management | `src/doubt-management-domain.ts` | Feature branch source |
| Worklist projections | `src/worklist-domain.ts` | Feature branch source |
| Demo data/catalogue | `src/demo-data.ts`, `src/offline-catalog.ts` | Feature branch source |
| CI | `.github/workflows/system-a-ci.yml`, `.github/workflows/student-tracking.yml` | blob `3dc08d7af8b0f623adf06cf81cc6ec6f8d2f6bfd`, `7b0ec726df90fab8e9ca1a86ca1c2daaaa789806` |
| Backend status | `docs/student-tracking/SYSTEM_A_BACKEND_IMPLEMENTATION_STATUS.md` | blob `72b95ce7294ac142236d789d9331bc2d530f8b95` |
| Database baseline | `docs/database/SYSTEM_A_DATABASE_BASELINE.md` | blob `53908167cefcc42ac10e4065d54d21e240580fb7` |
| Master completion specification | `docs/student-tracking/SYSTEM_A_MASTER_COMPLETION_SPECIFICATION.md` | blob `fd36581115443124b0da65a897f04c2699194df4` |
| Implementation plan | `docs/student-tracking/SYSTEM_A_IMPLEMENTATION_PLAN.md` | blob `5eb4bb28d110a0adb6958c963e53f401e688963f` |

The PR #2 changed-file inventory contained 76 paths at the time of inspection. The inventory included UI, domain modules/tests, migration, CI, governance records and documentation. It is not a complete listing of all repository files outside the PR.

## 4. Runtime data-flow audit

### 4.1 Current UI path

The inspected `App.tsx`:
- initializes students, exercises and marks from `readStore(...)`;
- reads/writes versioned browser keys `pulse.demo.v2.students`, `pulse.demo.v2.exercises` and `pulse.demo.v2.marks`;
- creates assignments locally from `OFFLINE_MODULES`;
- creates students locally;
- cycles a single UI status value through U/C/I/D/S/P;
- calculates cohort metrics in the browser;
- exports a browser-generated CSV;
- labels the workspace as local preview/demo data.

The inspected UI does not import `system-a-repository.ts` or `supabase.ts`. Therefore the current page does not use the Supabase adapter for its displayed records.

### 4.2 Supabase foundation

`supabase.ts` creates a browser-safe Supabase client using:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

The environment example contains placeholders. The client throws at module initialization if either variable is missing. This is appropriate for a configured connected build, but any preview/build environment must deliberately provide these variables or avoid importing the module in demo-only mode.

No service-role key is used in the inspected browser client.

### 4.3 Repository adapter

The adapter currently exposes:
- `listMyInstituteMemberships()`;
- `getMyStudentIdentity(instituteId)`;
- `listMyObligations(instituteId)`;
- `appendMyStudentReport(input)`.

The methods query `sa_institute_memberships`, `sa_students`, `sa_student_obligations` and `sa_evidence_events` directly through PostgREST. The code comments correctly state that client-side filters are not an authorization boundary and that database-side actor/role checks are mandatory.

However:
- the proposed migration forces RLS and revokes `anon`/`authenticated` table grants without creating policies;
- therefore these direct client queries/inserts are expected to be denied until explicit policies/grants or a secure RPC command layer is implemented;
- the adapter's membership type uses one role embedded in `sa_institute_memberships`, which conflicts with the proposed canonical split between membership and role grants;
- the adapter uses `institute_id`, whereas the canonical model proposes `tenant_id`;
- the adapter's actor IDs are Supabase Auth user IDs, whereas the canonical model proposes person identity as the business actor and Auth ID as authentication provenance;
- the repository validates a learner's obligation before insert, but the check and insert are separate client requests and are not an atomic transaction;
- no transactional server-side publication path or concurrency-safe idempotency boundary is implemented in this adapter.

## 5. Domain module maturity and persistence boundary

| Domain module | Implemented responsibility | Missing production boundary |
|---|---|---|
| `domain.ts` | Six UI statuses, append-only report/verification types, evidence projection, CSV formula neutralization | Server persistence, actor identity trust and DB projections |
| `workflow-domain.ts` | Independent work, answer, doubt, verification, correction, source and actor dimensions; metrics | Approved policy versions, server-side data retrieval and persistence |
| `workflow-transitions.ts` | Doubt/correction transition rules and actor-category checks | Trusted authorization, tenant scope and persistent transition log |
| `assignment-domain.ts` | Validates catalogue refs, snapshots assignment version and plans student-slot obligations | Authoritative roster resolution, publisher authorization, transaction, durable ID strategy and notification |
| `evidence-submission-domain.ts` | Validates self-report against obligation/version/slot, retry and supersession semantics | Authenticated actor derivation, database uniqueness and atomic insert |
| `teacher-verification-domain.ts` | Prepares append-only completion decision against exact evidence | Server-derived reviewer scope, persistence and separation-of-duties enforcement |
| `answer-evaluation-domain.ts` | Separates answer correctness decision from completion verification | Server authorization, persistence and approved evaluator policy |
| `correction-workflow-domain.ts` | Correction start, resubmission, review, return, acceptance and closure | Durable event transactions, trusted actor/scope and DB constraints |
| `doubt-management-domain.ts` | Raise, assign, investigate, resolve, confirm and reopen doubt cases | Durable event transactions, trusted assignment scope and DB constraints |
| `worklist-domain.ts` | Student worklist and teacher verification queue projections | Authorized server query and persisted source records |
| `offline-catalog.ts` | Fictional placeholder modules and question references | Real QBMS/offline catalogue source and stable external-ID contract |

The domain layer is pure TypeScript and does not itself provide authentication, authorization, persistence, database transactionality or RLS. This separation is useful, but the missing application/service layer is a critical implementation dependency.

## 6. UI status to canonical evidence mapping

The UI's six-state cycle is an interaction shorthand. It must not be stored as one overloaded database status.

| UI state | UI label | Proposed canonical representation | Required caution |
|---|---|---|---|
| U | Unattempted | No report event / work progress NOT_STARTED | Absence of event is not necessarily proof of no work |
| C | Correct | Student report event plus separate answer evaluation CORRECT | A tap must not be treated as teacher-verified correctness |
| I | Incorrect | Student report event plus answer evaluation INCORRECT | Student self-report and evaluated outcome are different facts |
| D | Doubt | Doubt case/event linked to obligation/slot | Doubt is a workflow, not only a cell value |
| S | Skipped | Work progress SKIPPED | Must preserve whether skipped was student-reported or system-derived |
| P | Partially correct | Answer evaluation PARTIALLY_CORRECT plus submitted work evidence | Must not collapse partial correctness into completion |

The current UI cycles statuses in one cell and persists only the final map in localStorage. A production event model must capture the source actor, timestamp, event type, attempt cycle and exact obligation/slot. It must not silently turn every cell tap into a verified fact.

## 7. Schema dependency-to-impact matrix

| Current code dependency | Current schema/API dependency | Canonical target impact | Required action |
|---|---|---|---|
| Membership adapter type and query | `sa_institute_memberships.user_id/role_key/is_active` | `tenant_memberships` + `tenant_role_grants` + person/Auth link | Replace one-row role model with membership and grant resolution |
| Learner identity adapter | `sa_students.institute_id/auth_user_id` | `students.tenant_id/person_id` plus auth identity | Resolve Auth user to person, then student within tenant |
| Obligation list | `sa_student_obligations.institute_id/student_id/eligibility_status` | `tenant_id` and canonical student | Repoint query and preserve eligibility filtering |
| Student report insert | `sa_evidence_events.institute_id/source_actor_id/source_actor_role` | Tenant-qualified evidence and trusted person actor | Prefer secure RPC/command; derive actor/role server-side |
| Assignment UI | Local `Exercise` + `OFFLINE_MODULES` | `sa_assignments`, versions, items, slots, targets | Add publication service and real source catalogue adapter |
| Roster UI | Local `DEMO_STUDENTS` + `students` state | `students`, `enrollments`, batch roster queries | Add authorized roster query/command |
| Matrix state | `pulse.demo.v2.marks` localStorage | Evidence events + verification/evaluation/doubt projections | Introduce event-backed read model; keep demo adapter isolated |
| Cohort diagnostics | Browser aggregation of local marks | Server-derived projections with policy version | Define denominator, event precedence and freshness |
| CSV export | Browser-only matrix data | Authorized export from read model | Define export permission, audit and PII minimization |
| Due date | Local date string and batch assignment | Versioned assignment schedule with tenant timezone | Persist timestamp + timezone policy and validate release/due rules |
| Experiment switch | Local React state | Experiment allocation/telemetry service if approved | Keep explicitly demo-only until product/consent design |

## 8. CI and build configuration audit

### 8.1 System A CI

The inspected workflow runs:
- Node 22;
- `npm install`;
- typecheck;
- Vitest unit tests;
- production build;
- migration static guardrail checks.

The migration static checks are textual guards, not SQL parser validation, migration replay, RLS integration tests or proof that the SQL executes against the target PostgreSQL version.

### 8.2 Student Tracking governance workflow

The second workflow checks PR traceability metadata. It does not implement application behavior or database authorization.

### 8.3 Build configuration

The package exposes typecheck, unit test, build and lint scripts. The `lint` script currently runs TypeScript typecheck rather than a dedicated lint engine. No Playwright/Cypress browser-test dependency is declared in the inspected package.

This audit did not execute CI locally and does not claim a current passing result for the exact inspected head.

## 9. Documentation consistency risks

The repository contains statements that need a controlled update:
- `SYSTEM_A_IMPLEMENTATION_PLAN.md` includes historical claims that no app source tree or Supabase project was available; those statements must be time-stamped and reconciled with later branch-specific implementation/audit evidence rather than silently overwritten.
- `SYSTEM_A_DATABASE_BASELINE.md` says the target Supabase project is not connected and no live schema was inspected; this conflicts with the separate live infrastructure audit record and requires an explicit evidence/date reconciliation.
- `SYSTEM_A_BACKEND_IMPLEMENTATION_STATUS.md` correctly says the app is not production-ready and distinguishes pure domain logic from persistence.
- `apps/student-tracking/README.md` correctly labels the app a frontend prototype and warns against real student data.

Do not rewrite historical audit records to make them appear contemporaneous. Add a dated correction/update note with source evidence.

## 10. Findings by severity

| Severity | Finding | Consequence | Gate |
|---|---|---|---|
| CRITICAL | UI is localStorage/demo-only; adapter not integrated | No durable multi-user student tracking | Backend architecture and integration |
| CRITICAL | Forced RLS + no policies/grants in proposed migration | Direct browser repository calls cannot operate | Approved RLS/grant/RPC design |
| CRITICAL | No atomic server-side assignment publication transaction | Partial/duplicate obligation creation risk | Transactional command implementation |
| HIGH | Canonical tenant/person model differs from adapter/migration naming | Integration and migration incompatibility | Schema/API contract freeze |
| HIGH | UI status cell conflates self-report, answer outcome and doubt workflow | Incorrect academic semantics if directly persisted | Event-to-state mapping approval |
| HIGH | Client repository uses separate validation then insert requests | TOCTOU and concurrent retry risk | Server command + DB uniqueness |
| HIGH | No operational UI integration for teacher verification, correction or doubt modules | Domain capabilities not usable in actual workflow | Workflow screen/service implementation |
| MEDIUM | Fictional offline catalogue and demo roster | Not production content/roster | Real catalogue and roster integration |
| MEDIUM | Browser CSV export has no server permission/audit boundary | Export may bypass intended access policy after integration | Export authorization contract |
| MEDIUM | No browser E2E framework in package | UI regressions not covered by unit tests | E2E test strategy |
| MEDIUM | CI migration checks are grep-based | Does not validate SQL semantics or RLS | SQL parser/replay/integration tests |

## 11. Recommended next stage — Application Service and API Contract

Before schema implementation, specify the trusted server boundary between UI, domain modules and PostgreSQL.

Required commands/queries:
1. Resolve authenticated actor and active tenant context.
2. List authorized memberships and role grants.
3. Load authorized student roster and batch scope.
4. Create assignment draft and immutable version.
5. Publish assignment atomically, snapshot targets and create obligations idempotently.
6. Load student worklist.
7. Append student evidence event.
8. Append teacher observation.
9. Load teacher verification queue.
10. Record completion verification.
11. Record independent answer evaluation.
12. Start/submit/review/close correction cycle.
13. Raise/assign/investigate/resolve/confirm/reopen doubt.
14. Load cohort diagnostics using explicit metric-policy version.
15. Export authorized work matrix with audit trail.

For every command specify:
- Auth-derived actor and tenant;
- role/resource/centre/batch/learner scope;
- input contract and validation;
- transaction boundary;
- idempotency key and replay response;
- immutable records created;
- emitted domain/audit events;
- error taxonomy;
- RLS/RPC/grant contract;
- acceptance and negative security tests.

**Disposition:** Repository source audit completed for the inspected branch files. Runtime behavior, live database connectivity, full repository-wide dependency search and current CI execution remain unverified. No code, schema, branch, PR or deployment changes were made by this audit.
