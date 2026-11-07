# PULSE Unified Database Migration Architecture

**Document ID:** PULSE-DB-MIGRATION-ARCH-001  
**Version:** 1.0.0  
**Status:** Proposed governance baseline — implementation approval pending  
**Date:** 2026-11-07

## 1. Purpose

Establish one ordered, reproducible migration history for PULSE shared identity and System A. This document resolves migration ownership and sequencing; it does not authorize SQL execution or remote schema changes.

## 2. Non-negotiable architecture rules

1. GitHub repository anshuljindalsecondbrain-art/pulse is the canonical source for migration SQL, migration tests, design decisions and execution evidence.
2. One canonical supabase/migrations directory and one ordered migration history govern the PULSE database. System A does not maintain a separate migration stream.
3. PULSE shared identity owns tenants, people, Auth identity mappings, tenant associations, role grants, student identity, centres, batches and effective-dated academic context.
4. System A owns assignment/source selection, publication snapshots, student obligations, evidence, verification, correction, doubt, audit and derived academic projections.
5. QBMS and DTE remain optional external domain integrations. Their absence must not block System A tracking.
6. Existing applied migration files are immutable. Corrections are made by a later migration; never rewrite an applied migration.
7. No migration is applied to a remote project until its exact environment, schema, migration history, dependencies, security plan and approval are recorded.
8. No cascading deletion may erase student obligations, attempts, evidence, verification, audit or published academic history.
9. All exposed application tables require reviewed grants and RLS. A migration that merely enables RLS with no operational policy is a deliberate fail-closed staging point, not a usable application release.
10. A Git merge is not evidence that a remote database has received the migration.

## 3. Current source-of-truth audit

### 3.1 Repository sources inspected

| Source | Current state | Disposition |
|---|---|---|
| feat/pulse-domain-core: shared identity migration | Five-table preliminary identity/context baseline | Preserve as historical source; reconcile, do not copy unchanged |
| docs/system-a-database-governance: System A initial schema | Proposed System A-local identity and workflow schema | Do not apply unchanged; supersede through canonical design |
| Physical Database Blueprint | Detailed shared-core and System A physical proposal | Source for reconciliation; open decisions still block DDL |
| Physical Constraints and Index Catalogue | Tenant-safe constraints and index proposal | Source for migration test criteria |
| Authorization, RLS, command and transaction specifications | Design proposals | Must be approved and implemented in ordered increments |

### 3.2 Live database baseline

Project reference: nnvssbfezkliavwxhgbh  
Last inspected: 2026-11-07  
PostgreSQL: 17.11  
Region: ap-south-1

- Public application tables: zero.
- Applied migration records: zero.
- Application DDL changed by this workstream: none.

This is an empty application-schema baseline, not proof that every managed Supabase schema or platform object is empty. Re-inspect the complete target immediately before first deployment.

## 4. Migration ownership and branch policy

### 4.1 Ownership

| Concern | Owner | Migration location |
|---|---|---|
| Tenant/person/Auth identity/membership/role grant | PULSE shared core | One canonical supabase/migrations stream |
| Centre/batch/enrolment/academic context/teaching assignment | PULSE shared academic context | Same stream |
| Source catalogues and source question locators | System A | Same stream |
| Assignment versions, targets and publication snapshots | System A | Same stream |
| Obligations, reports, observations, verification, correction and doubt | System A | Same stream |
| RLS, grants, functions, triggers and read models | Owning domain, reviewed with platform security | Same stream |
| Optional QBMS/DTE integration references | System A integration boundary; QBMS/DTE own source records | Same stream only when contract is approved |

### 4.2 Branch rules

- Feature branches may propose migrations, but only one reviewed branch sequence is eligible for integration.
- The shared-core branch and System A documentation branch are independent source histories. Do not merge their existing migration files by filename alone.
- Before the first executable migration is accepted, choose a canonical integration base and reconcile all desired SQL into that base.
- Every PR that changes supabase/migrations must include dependency review, replay evidence, security tests and a migration-register update.
- Two branches must not independently create competing first migrations. Resolve the conflict before merge.
- Do not cherry-pick an already-applied migration and change its contents or timestamp.

## 5. Naming, ordering and immutability

- Generate executable migration files with supabase migration new descriptive_name; do not hand-invent timestamp filenames.
- Supabase CLI-generated timestamp prefixes define execution order. Logical labels M0001/M0002 in planning documents are explanatory identifiers only.
- Use one migration per coherent dependency boundary; avoid a single unreviewable mega-migration.
- Migration SQL is append-only after application. A correction is a new forward migration.
- Migration comments must identify purpose, dependencies, risk, and whether the migration is safe for an empty database only or supports existing data.
- Never treat IF NOT EXISTS as a substitute for schema drift validation.

## 6. Target migration dependency graph

M0001 Shared identity and academic-context foundation
  ├── M0002 Shared authorization grants and scope primitives
  │     └── M0003 Teaching assignments and relationship access foundations
  └── M0004 System A offline source catalogue and source questions
        └── M0005 Assignment identity, versions, items and targets
              └── M0006 Publication snapshots and student obligations
                    ├── M0007 Student reports and teacher observations
                    │     ├── M0008 Answer evaluation and verification
                    │     │     ├── M0009 Correction lifecycle
                    │     │     └── M0010 Disputes, appeals and recognition
                    │     └── M0011 Doubt cases and events
                    └── M0012 Audit, idempotency and transactional outbox
                          └── M0013 Read models, progress and analytics
M0014 Parent/mentor projections and scoped read access (policy approval)
M0015 Optional QBMS question/version integration
M0016 Optional DTE enrichment integration

The graph is a target dependency model, not an approved timestamp schedule. Cross-cutting security primitives may need to move earlier, but dependencies must remain explicit.

## 7. Migration units and acceptance boundaries

| Logical unit | Scope | Minimum acceptance |
|---|---|---|
| M0001 | Canonical shared identity and academic context | Stable actor identity, Auth mapping, tenant-safe keys, centres/batches and effective-dated context; no duplicate System A identity |
| M0002 | Role grants and authorization primitives | Membership distinct from role grant; grant lifecycle, scope and actor-resolution contract |
| M0003 | Teaching assignments and relationship foundations | Resource-scoped teaching authority; effective dates; no role-only access |
| M0004 | Offline source catalogue | Catalog, edition and source-question locator; stable edition/source identity |
| M0005 | Assignment model | Immutable assignment versions and selected existing source questions; no mandatory question authoring |
| M0006 | Publication | Immutable roster snapshot and obligations created atomically and idempotently |
| M0007 | Evidence intake | Student report and teacher observation remain separate append-only events |
| M0008 | Academic decisions | Answer correctness and completion verification are distinct |
| M0009–M0011 | Intervention lifecycles | Corrections, doubts, disputes and appeals preserve original evidence and decisions |
| M0012 | Reliability | Idempotency, audit and outbox semantics are enforced |
| M0013–M0016 | Projections and integrations | Rebuildable projections; parent access approved; external QBMS/DTE references optional |

## 8. Environment strategy

| Environment | Purpose | Gate |
|---|---|---|
| Local disposable Supabase/PostgreSQL | Deterministic replay and automated tests | Every migration PR |
| Development | Integration with active application code and synthetic data | After local replay and security tests |
| Staging | Production-like validation with synthetic or approved masked data | Explicit environment designation and release approval |
| Production | Live academic records | Separate explicit approval, backup/recovery plan, change window and monitored execution |

The connected PULSE project must not be assumed to be development or staging merely because it is accessible. Its environment designation and intended use require owner confirmation.

## 9. Required preflight and release sequence

1. Confirm canonical Git branch and migration directory.
2. Inspect the exact remote project: PostgreSQL version, schemas, extensions, tables, constraints, indexes, views, functions, triggers, grants, RLS, Storage policies and migration history.
3. Compare remote state with repository migration history; stop on drift or unknown objects.
4. Close every owner decision required by the migration being released.
5. Generate the migration filename using the Supabase CLI.
6. Review SQL and dependency order; verify no duplicate ownership or unsafe destructive operation.
7. Replay all migrations from an empty local database.
8. Run schema assertions, constraints, tenant-isolation tests, RLS tests, command/RPC tests and representative application integration tests.
9. Run Supabase security and performance advisors; review every finding.
10. Capture SQL checksum, Git commit, CLI version, test outputs, advisor output and reviewer approval.
11. Apply to the designated non-production project only after explicit approval.
12. Inspect actual catalog state and execute smoke tests.
13. Production requires a separate approval and recovery plan.

Supabase guidance recommends versioned migration files, local testing, linking the intended remote project, reconciling remote-only changes with db pull, and deploying with db push. References: https://supabase.com/docs/guides/local-development/database-migrations and https://supabase.com/docs/guides/local-development/cli-workflows.

## 10. Rollback and recovery policy

- Prefer forward-fix migrations for any migration that may have been applied or may have written data.
- A down migration is not assumed safe. It must be separately authored, reviewed and tested, and may be prohibited where it would destroy academic history.
- Before remote execution, take/verify a recoverable backup or point-in-time recovery capability appropriate to the environment.
- Record the exact migration head before and after execution.
- If a migration partially fails, stop. Inspect the transaction outcome and catalog; do not blindly rerun or manually edit migration history.
- If remote schema changes exist outside Git, capture and reconcile them before any push. Do not overwrite unknown remote state.

## 11. Migration test contract

Every migration must have tests for:

- Empty-database replay and repeatable reset.
- Exact table/column/type/nullability/default/constraint/index definitions.
- Tenant-composite FK integrity and cross-tenant reference rejection.
- Role grant and resource-scope authorization.
- RLS SELECT/INSERT/UPDATE/DELETE isolation across two synthetic tenants.
- Direct client write denial for protected workflows.
- Function execute grants, search_path and security mode.
- Append-only event and historical immutability.
- Concurrent duplicate command and idempotency-key collision behavior.
- Upgrade compatibility and documented recovery behavior.
- Performance plans for high-volume query paths using representative synthetic volumes.

## 12. Explicit blockers before M0001 SQL

M0001 must not be authored as executable SQL until the following are closed:

- OPEN-013: canonical shared-core source branch and migration ownership.
- OPEN-014: Auth identity mapping schema and uniqueness/lifecycle.
- OPEN-015: tenant association versus role grant model.
- OPEN-016: canonical tenant-safe student key.
- OPEN-017: centre and batch physical definitions.
- OPEN-010: concurrent active enrolment/batch policy where it affects context uniqueness.
- OPEN-011: subject/chapter catalogue ownership where referenced by academic context.
- OPEN-018: teaching assignment physical schema if included in M0001; otherwise explicitly deferred to M0003.
- Exact RLS/grant release boundary for the first exposed schema.

The shared identity ownership direction in DEC-011 is confirmed; these physical decisions remain open.

## 13. Change control and status

- This document defines the proposed migration governance model.
- It does not create or apply SQL.
- The earlier System A migration remains a historical proposal and must not be applied unchanged.
- The shared-core identity migration remains a historical proposal on its source branch; it is not yet the canonical PULSE migration.
- No PR has been created and no branch has been merged by this work item.

**Current state:** Architecture documented; M0001 executable SQL blocked pending decision closure and explicit authorization.
