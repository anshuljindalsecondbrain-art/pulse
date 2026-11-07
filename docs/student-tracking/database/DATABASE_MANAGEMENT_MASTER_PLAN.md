# System A — Database Management Master Plan

**Product:** PULSE — Student Tracking System / Abhyas Matrix  
**Document ID:** STS-DB-PLAN-001  
**Version:** 1.0.0  
**Status:** Working engineering baseline; production schema approval pending  
**Date:** 2026-11-07  
**Canonical repository:** `anshuljindalsecondbrain-art/pulse`

## 1. Purpose

Establish one governed lifecycle for System A database architecture, schema documentation, SQL migrations, authorization, testing, releases and change history.

GitHub is the canonical source of truth for source code, schema definitions, migration files, architecture records, database contracts, tests and review history. Supabase PostgreSQL is the operational database. Applied database changes must be traceable to a reviewed GitHub migration and a recorded deployment.

This plan does not authorize applying any existing proposed migration to production.

## 2. Product and data ownership boundaries

### System A owns

- Exercises and immutable exercise versions.
- Numbered exercise slots.
- Assignments, assignment versions and publication snapshots.
- Student obligations.
- Student reports and teacher observations.
- Answer evaluations and verification decisions.
- Attempt/revision cycles.
- Corrections and resubmissions.
- Doubt cases and doubt history.
- Disputes, appeals and recognition decisions.
- Derived worklist, progress, risk and cohort projections.

### Shared PULSE platform owns

- Tenant/institute identity.
- Person identity and Auth UID mapping.
- Tenant membership.
- Role grants and resource scopes.
- Canonical student identity.
- Centres, batches and effective-dated academic enrolments where shared ownership is approved.
- Shared audit, notifications and integration infrastructure.

### Other modules own

- QBMS: canonical question identity, question versions, source content and media.
- System B / DTE: configurable academic classification structures and question-to-taxonomy mappings.
- DRE: difficulty rules, scoring and difficulty history.

System A must work with a local exercise slot even when no QBMS question ID or DTE classification exists. Integrations must be optional, version-aware and non-destructive to original evidence.

## 3. Verified live environment snapshot

As inspected on 2026-11-07:

| Property | Verified value |
|---|---|
| Supabase project | PULSE |
| Project reference | `nnvssbfezkliavwxhgbh` |
| Region | `ap-south-1` |
| PostgreSQL | 17.11 |
| Project status | ACTIVE_HEALTHY |
| Public application tables | 0 |
| Applied migration history | 0 |
| Security advisor lints | 0 |
| Performance advisor lints | 0 |
| Health advisor lints | 0 |

An empty database producing no advisor lints is not evidence of application security or readiness.

## 4. Existing repository baseline

Repository: `anshuljindalsecondbrain-art/pulse`

Relevant documentation already present:

- `docs/student-tracking/SYSTEM_A_DATABASE_ARCHITECTURE.md`
- `docs/student-tracking/SYSTEM_A_BACKEND_IMPLEMENTATION_STATUS.md`
- `docs/student-tracking/SYSTEM_A_MASTER_COMPLETION_SPECIFICATION.md`
- `docs/student-tracking/SYSTEM_A_IMPLEMENTATION_PLAN.md`
- `docs/student-tracking/SYSTEM_A_SOURCE_RECONCILIATION_2026-11-06.md`
- `docs/student-tracking/SYSTEM_A_A2_ARCHITECTURE_DECISION_MATRIX_2026-11-06.md`
- `docs/00_PROJECT_GOVERNANCE/PULSE_SYSTEM_A_APPLICATION_SERVICE_AND_API_CONTRACT.md`
- `docs/00_PROJECT_GOVERNANCE/PULSE_SYSTEM_A_DATABASE_AUTHORIZATION_AND_TRANSACTION_DESIGN.md`
- `docs/00_PROJECT_GOVERNANCE/PULSE_SYSTEM_A_PHYSICAL_TABLE_AUTHORIZATION_AND_INTEGRITY_MAPPING.md`
- `docs/00_PROJECT_GOVERNANCE/PULSE_SYSTEM_A_REPOSITORY_DEPENDENCY_AUDIT_AND_SCHEMA_IMPACT_MATRIX.md`
- `docs/database/SUPABASE_MIGRATION_RUNBOOK.md`
- `docs/database/SYSTEM_A_DATABASE_BASELINE.md`

Existing `supabase/migrations/20261106000100_system_a_initial_schema.sql` is proposed/unapplied and must not be applied unchanged. It creates a parallel institute/student/batch identity structure and does not contain the reviewed production authorization model.

The V10 shared-core branch contains a preliminary identity migration with `tenants`, `people`, `tenant_people`, `students` and `academic_context_epochs`. That branch's own migration comments say production RLS and application-specific constraints remain pending. Its exact canonical status and integration must be reviewed before use.

## 5. Primary operational workflow\n\nThe source specification clarifies that teachers primarily select already-existing questions from offline academic modules; they do not normally author questions or create new question content in System A. The initial data path is therefore:\n\n\`Offline module/source edition → source question reference → assignment version/item → publication target snapshot → student-question obligation → student report → teacher observation/verification → correction/doubt → analytics\`.\n\nAn exercise or worksheet grouping may be represented as a presentation/packaging abstraction if required by the existing UI, but it must not become a duplicate question bank or a mandatory content-authoring workflow. QBMS question identity/version and DTE enrichment remain optional future integrations.\n\n## 6. Target database domain map

| Domain | Logical entity families | Main dependency |
|---|---|---|
| Identity | tenants, people, person_auth_identities | Shared PULSE platform |
| Membership and authorization | tenant_memberships, tenant_role_grants, resource assignments | Shared PULSE platform |
| Academic context | students, centres, batches, enrolments/context epochs | Shared PULSE academic core |
| Catalogue | subjects, chapters, configurable scope references | Shared or tenant-configured catalogue decision |
| Exercise | exercises, exercise_versions, exercise_slots | System A |
| Assignment | assignments, assignment_versions, assignment_items, assignment_targets | System A |
| Obligation | student_obligations, obligation_events | System A |
| Attempt and evidence | attempt_cycles, student_report_events, teacher_observation_events | System A |
| Evaluation and verification | answer_evaluations, verification_decisions | System A |
| Correction | correction_cycles, correction_events | System A |
| Doubt | doubt_cases, doubt_events | System A |
| Dispute and appeal | disputes, dispute_events, appeal_decisions | System A |
| Recognition | recognition_decisions, equivalence references | System A + reviewed QBMS mapping |
| Audit and projections | audit events, outbox, projection watermarks, progress snapshots | Platform/System A |

Names are logical entity proposals, not approved physical table names.

## 6. Canonical data rules

1. Every tenant-owned record must have an explicit tenant boundary, directly or through a tenant-qualified parent.
2. Foreign-key relationships must prevent cross-tenant references.
3. Published exercise and assignment versions are immutable.
4. Student reports, teacher observations, evaluations, verification decisions and audit evidence are append-only.
5. Corrections and resubmissions create new linked events; they do not overwrite evidence.
6. Attempt cycles and correction cycles are different concepts.
7. Reported completion, teacher-verified completion and answer correctness are separate metrics.
8. Doubt, incorrect answer, teacher explanation and correction return are separate academic events.
9. Batch transfer must not change historical obligations or evidence attribution.
10. Assignment publication resolves an eligible roster snapshot and creates student obligations atomically and idempotently.
11. New batch members do not silently inherit historical work.
12. Question identity, question version and exercise slot remain distinct.
13. System B taxonomy and QBMS question references remain optional integrations.
14. No destructive cascade may remove historical student evidence.
15. Derived analytics are rebuildable and include policy version, source watermark and calculation time.
16. The UI is not the system of record and must not independently determine authorization.

## 7. Database management lifecycle

Every schema change follows:

1. Requirement ID and change request.
2. Impact assessment against requirements, canonical entities, UI, API, reports and integrations.
3. Physical schema/ERD review.
4. SQL migration authoring in GitHub.
5. Migration and test review.
6. Disposable/local database replay.
7. Positive/negative RLS and cross-tenant tests.
8. Staging deployment with captured evidence.
9. Database catalog verification and advisor checks.
10. Release approval and controlled production execution.
11. Register update and post-deployment verification.

Do not edit a migration already applied in any shared environment. Create a new ordered migration.

## 8. Migration naming and register rules

Use timestamped snake_case migration names, for example:

`YYYYMMDDHHMMSS_system_a_<change_summary>.sql`

The timestamp must be generated by the Supabase CLI workflow for a new migration, not invented manually for executable migrations.

Every migration must have a register entry with:
- migration filename;
- unique change/request ID;
- purpose and affected domains;
- dependencies and preconditions;
- expected objects changed;
- backfill/compatibility plan;
- security/RLS/grant impact;
- transaction and idempotency behavior;
- rollback/recovery strategy;
- test evidence;
- reviewer and approval;
- target environment;
- execution timestamp and resulting migration version.

## 9. Security baseline

- Deny by default.
- Resolve Auth UID to canonical person identity on trusted server-side boundaries.
- Membership and role grants are separate.
- Never trust client-supplied actor IDs, roles, tenant IDs, admin flags or scope lists.
- RLS on all exposed tenant-bearing tables.
- Policies must use actual resource ownership and current role/scope grants; authenticated alone is not sufficient.
- UPDATE policies require both USING and WITH CHECK.
- Prefer narrow transactional commands for multi-record operations.
- Avoid broad SECURITY DEFINER functions. Any approved use requires a non-exposed schema, safe search_path, actor validation, restricted EXECUTE grants and security review.
- Views over protected data must be reviewed for RLS behavior and use security_invoker where appropriate.
- Never put service-role/secret keys in browser code or GitHub.
- Parent access is authenticated and relationship-scoped for MVP; bearer-token parent cards are deferred.
- No generic permissive policy to make the frontend work.

## 10. Required engineering test gates

- Migration replay from a clean database.
- Schema catalog assertions.
- Foreign-key and tenant-integrity tests.
- Role/action permission matrix.
- RLS allowed-access tests.
- RLS denied-access and cross-tenant tests.
- Privilege-escalation tests.
- Append-only and immutable-version tests.
- Transaction rollback tests.
- Idempotency and concurrency tests.
- Assignment publication roster/obligation reconciliation.
- Student report and verification history tests.
- Correction/doubt state transition tests.
- Derived-metric denominator and provenance tests.
- Performance tests with realistic roster and question counts.
- Frontend typecheck, unit tests, build and responsive/device QA.

## 11. Release environments

Recommended logical progression:

- Development: disposable schema and fixture data; no real student PII.
- Staging: controlled test users and synthetic academic data; production-like RLS and workflow.
- Production: approved live institute data; restricted migrations and audited access.

The connected PULSE project is identified, but its environment designation and production approval status must be explicitly confirmed before the first application migration.

## 12. Immediate blockers

The following decisions are unresolved in the current architecture records and must remain visible:

- Exact canonical shared identity schema and table relationships.
- Membership versus role-grant scope and resource assignment model.
- Assignment publication approval and separation of author/approver/publisher.
- Post-publication amendment/withdrawal and obligation delta behavior.
- Whether the current U/C/I/D/S/P matrix is student self-report, teacher observation or a combined interface with separate actions.
- Meaning of “Solved by Teacher”.
- Initial subject/stream/class compatibility and COMMON policy.
- Parent/guardian relationship verification and field scope.
- Global versus tenant-owned subject/chapter catalogue.
- Concurrent academic programme/batch enrolment rules.
- Separate answer evaluation versus verification storage.
- Dispute, appeal and recognition physical model.
- Final shared-core branch and merge strategy.

No physical schema should be frozen until these decisions and the exact shared-core identity map are approved.

## 13. Current implementation status

| Workstream | Status |
|---|---|
| Requirements and domain boundaries | Documented |
| Logical System A database model | Proposed |
| Shared identity integration | Unresolved |
| Physical ERD | Not approved |
| Data dictionary | Not approved |
| RLS/authorization design | Draft |
| Existing System A migration | Proposed, not applied; do not apply unchanged |
| Supabase live application schema | Empty |
| Migration tests against live canonical schema | Not run |
| Primary UI database integration | Not verified; historical audit says local/demo storage |
| Production release | Not ready |

## 14. Definition of database completion

System A database is complete only when:
- schema and identity are approved;
- data dictionary and ERD match deployed schema;
- migration history is replayable from GitHub;
- every exposed table has reviewed RLS and grants;
- trusted commands implement all multi-record transactions;
- all academic evidence remains historically intact;
- cross-tenant and workflow tests pass;
- application read/write paths use persistent data;
- staging deployment and independent verification evidence exist;
- operations and rollback procedures are documented.


## 15. Internal pilot operating mode — 2026-11-07

The initial PULSE deployment is an internally operated pilot, not a commercial multi-customer SaaS launch. One Super Admin login operates the complete enabled PULSE ecosystem. Student records are created and maintained by the operator; students do not receive login credentials in the initial pilot. Student Auth identity is not a prerequisite for a student record, enrollment, assignment or activity evidence.

The pilot supports both exercise-level aggregate entry and question-level evidence. Exercise aggregates are explicitly marked aggregate-only unless individual question evidence exists. When both are present, the system reconciles the counts and surfaces discrepancies; it does not silently overwrite evidence or fabricate question-level attempts. The authenticated Super Admin remains the entry actor, while the student remains the academic subject. Teacher attribution requires source evidence and must not be fabricated.

See [PULSE Pilot Operating Model and Implementation Plan](PULSE_PILOT_OPERATING_MODEL_AND_IMPLEMENTATION_PLAN.md) for the complete workflow, data rules, module scope, delivery phases and acceptance scenarios. This operating mode does not relax tenant boundaries, canonical ownership, auditability, RLS or trusted command requirements, and does not authorize remote DDL or production release.
