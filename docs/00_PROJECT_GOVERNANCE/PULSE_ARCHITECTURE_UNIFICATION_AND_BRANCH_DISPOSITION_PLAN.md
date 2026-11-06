# PULSE — Architecture Unification and Branch Disposition Plan

- Document ID: PULSE-GOV-REPO-004
- Version: 0.1.0
- Status: Draft — audit-derived proposal; pending owner review and approval
- Repository: `anshuljindalsecondbrain-art/pulse`
- Audit date: 2026-11-06
- Branches reviewed: `main`, V10 foundation/implementation branches, `feat/system-a-abhyas-foundation`
- Related documents: [Repository Architecture and Documentation Governance Blueprint](PULSE_REPOSITORY_ARCHITECTURE_AND_DOCUMENTATION_GOVERNANCE_BLUEPRINT.md), [Repository File Inventory and Disposition Matrix](PULSE_REPOSITORY_FILE_INVENTORY_AND_DISPOSITION_MATRIX.md), [Master Documentation Index](PULSE_MASTER_DOCUMENTATION_INDEX.md)
- Implementation authorization: Not granted
- Database authorization: Not granted
- Merge/rebase/branch deletion authorization: Not granted

## 1. Purpose

This plan proposes how to reconcile the two implementation tracks found in the PULSE repository:

1. **V10 platform foundation** — identity, tenant membership, academic context, batch/enrollment, roles and domain-event infrastructure.
2. **System A / Abhyas Matrix** — the first operational Student Tracking application, including assignment planning, learner obligations, student reports, teacher verification, correction/doubt workflows and progress projections.

The goal is one coherent PULSE platform with one canonical identity and tenant boundary, while preserving the domain-specific behavior and evidence model of Student Tracking.

This document is a review and sequencing proposal. It does not approve either pull request, select a final schema, authorize migrations, or authorize repository changes beyond this document.

## 2. Executive recommendation

**Recommended direction for owner review: use the V10 work as a candidate shared-platform foundation and retain System A as the first operational product module, but do not merge either pull request in its current form.**

This is a direction for reconciliation, not a decision that V10 is already correct or that System A must adopt every V10 abstraction.

The target should be a modular application with:
- one canonical institute/tenant identity model;
- one canonical person/auth-identity mapping;
- one canonical student identity per institute/tenant;
- one canonical membership and role authorization model;
- one governed academic-context and enrollment model;
- module-owned assignment, obligation, evidence, verification and correction records;
- a consistent event/audit contract;
- server-side authorization and database-enforced tenant isolation.

Do not create microservices merely to reflect these logical module boundaries.

## 3. Audit baseline and evidence

### 3.1 V10 track

- Shared V10 foundation aliases reviewed point to commit `26b52e46bdec05a60fdc05b590349f37ba70213f`.
- The distinct `feat/pulse-v10-implementation` branch points to `b791c7a1803757c5f8f0ee659078f0e4c708f8a4`.
- The V10 implementation pull request is [PR #1](https://github.com/anshuljindalsecondbrain-art/pulse/pull/1), targeting `main`.
- PR #1 reports 19 commits, 18 changed files, 544 additions, a non-mergeable/dirty state and two failed validation check runs at the inspected head.
- The visible V10 tree contains a Next.js app shell, TypeScript domain contracts and two SQL migrations.
- Migration `0001_identity_and_academic_context.sql` introduces `tenants`, `people`, `tenant_people`, `students` and `academic_context_epochs`.
- Migration `0002_academic_core_events.sql` introduces `batches`, `enrollments`, `person_auth_identities`, `tenant_roles` and `domain_events`, enables RLS on its listed tables, and defines tenant-member read policies. It explicitly omits direct write policies.
- The V10 migration comments state that migration 0001 is an architectural boundary and that production RLS policies and application-specific constraints must be added before tenant data is exposed.

### 3.2 System A track

- The `feat/system-a-abhyas-foundation` head inspected was `db2639b4e60655dc096e539003aa4598f3444c0e`.
- The System A pull request is [PR #2](https://github.com/anshuljindalsecondbrain-art/pulse/pull/2), targeting `main`.
- PR #2 is draft, reports 137 commits, 66 changed files, 5,513 additions, and a clean/mergeable state at the inspected head.
- Seven relevant check runs were successful at the inspected head, including typecheck/tests/build and migration static checks. These are not proof of production database readiness.
- The branch contains a React/Vite application under `apps/student-tracking/`, domain modules and tests, System A specifications, governance records and one proposed initial schema migration.
- The System A backend status document states that the live Supabase project had no application tables and an empty migration history at the time of its audit; the proposed migration had not been applied.
- The same status document marks System A **NOT PRODUCTION READY** and identifies authorization, RLS, grants, publication transactions, integration tests and workflow gaps as blockers.
- The current visible `App.tsx` uses browser `localStorage` and does not import the Supabase repository adapter. Therefore, the operational UI inspected is not yet using the committed Supabase repository functions.

### 3.3 Relationship between the tracks

A comparison of System A against the V10 implementation reports divergent histories (System A 192 commits ahead and 19 behind at the inspected comparison point). The comparison includes both overlapping documentation paths and separate implementation trees.

The two pull requests are based on different recorded `main` base SHAs. Recheck current branch heads, PR base commits and changed files immediately before any reconciliation or merge operation.

### 3.4 Audit limits

This is a Git and document-level review of the inspected commits and connector state. It is not a complete code execution audit, migration dry run, security penetration test, Supabase schema deployment, browser QA or production readiness certification. Branch heads and CI results can change after this document is written.

## 4. Main architectural conflicts

| Concern | V10 proposal | System A proposal | Required disposition |
|---|---|---|---|
| Institute/tenant | `tenants` | `sa_institutes` | Select one canonical tenant entity and migration path |
| Human identity | `people` | Auth user-centric records | Define canonical person-to-auth-user mapping |
| Tenant membership | `tenant_people` | `sa_institute_memberships` | One canonical membership boundary |
| Student identity | `students` | `sa_students` | Define one tenant-scoped student identity; preserve institute-specific admission codes |
| Batch | `batches` | `sa_batches` | One canonical batch identity and ownership model |
| Enrollment | `enrollments` | `sa_batch_memberships` | Reconcile temporal membership, transfer and historical obligations |
| Roles | `tenant_roles` | `role_key` on institute membership | Define role grants, scope, validity and revocation in one authorization model |
| Academic context | `academic_context_epochs` | Class/stream/session/batch fields across System A entities | Establish one authoritative, time-bounded context contract |
| Events | `domain_events` | System A evidence/audit events | Separate platform/domain event envelope from immutable module-owned evidence |
| Application shell | Next.js root app | React/Vite under `apps/student-tracking` | Decide hosting/build topology; avoid two competing root application entry points |
| Migration history | `0001`, `0002` | timestamped System A initial migration | Produce one ordered, reviewed migration lineage after schema selection |

The `sa_` prefix means the tables can technically coexist, but technical coexistence is not a sufficient long-term data architecture. Parallel tenant/student/membership models create synchronization, authorization and reporting risks.

## 5. Canonical target ownership proposal

The following is a proposed responsibility split for review.

### 5.1 Shared platform foundation

The platform layer should own:
- institute/tenant identity and lifecycle;
- person identity and Auth identity association;
- tenant membership and scoped role grants;
- centre and organizational scope, if approved as shared concepts;
- canonical batch identity and time-bounded student membership/enrollment;
- academic-context history and effective-time resolution;
- shared authorization primitives and audit/event envelope;
- tenant-level configuration and platform-level reference data.

### 5.2 System A — Student Tracking / Abhyas Matrix

System A should own:
- exercise identity and immutable exercise versions;
- exercise slots and optional external question references;
- assignment identity and immutable published assignment versions;
- assignment targets and publication snapshots;
- student obligations and eligibility/exemption;
- attempt cycles and append-only student report events;
- teacher verification decisions and their purposes;
- correction cycles, doubt cases, disputes, appeals and recognition records;
- rebuildable worklist, review-queue, progress and attention projections.

System A must remain usable without QBMS question records or complete DTE classification. A local numbered exercise slot is sufficient for the operational workflow; external question identity/version enrichment remains optional and separately governed.

### 5.3 Other PULSE domains

- **QBMS** owns question identity, question versions, sources, media, question metadata and question-bank workflows.
- **DTE** owns institution-approved classification framework configuration and, in its current Phase 1 boundary, offline framework/tagging operations. It does not own Student Tracking evidence or impose a universal chapter/topic hierarchy.
- **DRE** owns difficulty calculation and its evidence/policy model.
- **Test Management** owns assessment/test assembly and administration, with explicit contracts to QBMS and Student Tracking where required.
- **AI Mentor** consumes governed evidence and read models; it does not become the source of truth for academic records.

## 6. Decisions required before implementation

No migration or merge should proceed until the owner has explicitly approved the following decisions.

| Decision ID | Decision | Required evidence |
|---|---|---|
| UNI-001 | Canonical tenant/institute entity | Entity mapping, lifecycle, uniqueness and tenant isolation rules |
| UNI-002 | Canonical person/Auth identity | Auth mapping, account linking, duplicate identity and recovery rules |
| UNI-003 | Canonical student identity | Institute-scoped identifiers, privacy boundaries and identity resolution |
| UNI-004 | Membership and role model | Role catalogue, scope hierarchy, validity windows, grant/revoke rules |
| UNI-005 | Batch/enrollment/context model | Transfer, historical context, overlapping enrollment and effective-time behavior |
| UNI-006 | Event versus evidence ownership | Event envelope, immutable evidence semantics, idempotency and correction rules |
| UNI-007 | Application topology | Next.js versus Vite ownership, root directory, routing, shared packages and deployment targets |
| UNI-008 | Migration lineage | Baseline, ordering, rollback/forward-fix strategy, data preservation and migration ownership |
| UNI-009 | Authorization implementation | RLS matrix, database-side actor validation, grants, privileged function review and cross-tenant tests |
| UNI-010 | Release strategy | CI gates, preview/prod separation, environment configuration, smoke tests and rollback |
| UNI-011 | Branch disposition | PR merge/close/rebase/retire decisions and branch alias cleanup plan |

Each decision must record: owner, status, rationale, alternatives, consequences, linked requirements, affected schema/code/docs, tests and approval date.

## 7. Required identity and data reconciliation method

Do not rename tables or mechanically copy one schema into another. Perform a field- and relationship-level reconciliation.

For each overlapping entity:
1. List fields, types, constraints, indexes, foreign keys and lifecycle rules from both proposals.
2. Identify the authoritative owner and whether the concept is genuinely shared or module-specific.
3. Map existing identifiers and references; do not assume UUIDs represent the same person or student across models.
4. Define uniqueness scope and tenant-safe composite relationships.
5. Define temporal semantics, including effective dates, transfer, revocation and historical retention.
6. Define migration treatment for empty versus populated environments.
7. Define RLS/grant behavior for each operation and actor category.
8. Add database integration tests, especially cross-tenant denial and historical access.
9. Approve the canonical data contract before generating the final migration sequence.

### Non-negotiable data invariants

- A tenant-scoped record must not be reachable through a foreign tenant's identifier.
- Client-supplied tenant, person, student or role values are not authorization proof.
- User-editable Auth metadata must not be used for authorization.
- Student evidence and teacher verification are distinct immutable records.
- A correction or resubmission must not rewrite the original report or decision.
- Missing evidence must not be converted into zero or a negative result.
- Historical batch/enrollment/context must remain reconstructable.
- Question-bank and DTE links must remain optional for System A obligations.
- Derived progress, accuracy, risk and recommendations must be rebuildable from governed source records.

## 8. Application and deployment reconciliation

### 8.1 Application topology

The repository currently has a V10 Next.js root application and a System A Vite application in a subdirectory. The Vercel project was previously observed with its root directory configured to `apps/student-tracking`. This setting must be rechecked against the current Vercel project before changing it.

Choose one explicit topology:
- a single Vite application for the first release with shared platform packages; or
- a deliberate monorepo with separately configured apps and shared packages; or
- a deliberate Next.js application that hosts System A routes and shared platform services.

Do not leave two unrelated root application shells competing for the same deployment project. The selected topology must document build command, install command, output directory, root directory, environment variables, preview behavior and production aliases.

### 8.2 Frontend-to-backend boundary

- Replace demo/localStorage persistence only through a reviewed repository/service boundary.
- Keep client-side domain helpers for deterministic validation and projections, not authorization.
- Enforce actor identity, tenant membership, role scope and business invariants on trusted server/database boundaries.
- Do not expose Supabase service-role or secret keys in browser bundles.
- Use a publishable/anon client key only with tested RLS and grants.
- Treat a successful Vite/Next build as build evidence only, not database or workflow integration evidence.

## 9. Supabase migration and security plan

1. Re-read the live project's migration history, schemas, extensions, grants, RLS policies, functions, triggers, views and storage policies immediately before any schema proposal is applied.
2. Confirm whether the live project is still empty. The earlier System A audit reported no application tables and empty migration history; that is a dated observation, not a guarantee of current state.
3. Build one canonical migration lineage in a dedicated reviewed branch. Do not apply both V10 and System A initial migrations as-is.
4. Review every exposed `public` table for RLS. RLS must be paired with minimum required grants and explicit policies.
5. Build an actor/action/resource authorization matrix for student, parent, teacher, mentor, reviewer, institute administrator and platform administrator.
6. Avoid broad policies such as `USING (true)`. Authentication alone is not tenant authorization.
7. Review every `SECURITY DEFINER` function for owner privileges, fixed search path, explicit caller authorization and restricted execute grants. Prefer invoker security where feasible.
8. Verify UPDATE policies have both `USING` and `WITH CHECK`; ensure SELECT policies support intended updates.
9. Review views for RLS behavior; use invoker security where appropriate.
10. Test idempotent publication and evidence append transactions under concurrent retries.
11. Run database security/performance advisors and integration tests before approval.
12. Apply to production only after explicit owner approval, backup/recovery readiness and a controlled deployment window.

No SQL in this plan is executable migration content.

## 10. Branch and pull-request disposition proposal

| Branch / PR | Proposed disposition | Reason | Action status |
|---|---|---|---|
| `feat/pulse-v10-implementation` / PR #1 | Keep open for reconciliation; do not merge now | Conflicting identity schema, dirty merge state, failed CI checks | Proposed only |
| `feat/system-a-abhyas-foundation` / PR #2 | Keep open as the primary System A implementation candidate; do not merge yet | More developed operational workflow and passing checks, but unresolved shared identity, database authorization and application integration | Proposed only |
| 19 V10 alias branches at commit `26b52e4...` | Mark as duplicate aliases for later cleanup review | All point to the same commit; names create false impression of separate work | No deletion authorized |
| `main` | Preserve as governance baseline until approved integration plan exists | Avoid mixing unapproved foundation choices into the default branch | No change authorized |

Before branch cleanup:
- enumerate all current branches and open PRs again;
- check whether any branch is used by a deployment or external workflow;
- record commit SHAs and unique commits;
- preserve any unique commits with tags or archival refs if the owner approves;
- close or retarget PRs only after owner approval;
- delete branches only after verifying they contain no unique unmerged work.

## 11. Phased execution plan

### Stage 0 — Owner decision gate
- Review this plan and the two PRs.
- Approve or amend the target direction.
- Name the canonical identity, authorization, application topology and migration decisions.
- No code or database changes.

### Stage 1 — Detailed schema and contract reconciliation
- Produce entity-by-entity mapping for tenant, person, Auth identity, membership, student, centre, batch, enrollment, roles and academic context.
- Reconcile event envelope with System A evidence and verification events.
- Produce canonical ERD, data dictionary and authorization matrix.
- Update requirement traceability and architecture decision records.
- No production migration.

### Stage 2 — Technical integration branch
- Create one owner-approved integration branch from the current `main`.
- Port or adapt the selected platform contracts and System A module in small, reviewable commits.
- Retain only one application topology.
- Add contract tests and migration static checks.
- Keep production database untouched.

### Stage 3 — Local/isolated database validation
- Generate a single ordered migration lineage.
- Validate on a disposable or isolated Supabase environment first.
- Test tenant isolation, role scope, historical enrollment, assignment publication, evidence idempotency, verification and correction workflows.
- Run advisors and integration tests.
- Do not use real student PII in test fixtures.

### Stage 4 — Preview and end-to-end validation
- Configure Vercel root/build settings for the selected topology.
- Validate login, tenant selection, student identity, assignment publication, learner worklist, student reporting and teacher verification.
- Confirm browser persistence is replaced by the approved backend path.
- Run role-based and cross-tenant browser tests.

### Stage 5 — Controlled production release
- Approve migration and release separately.
- Back up and verify recovery path.
- Apply reviewed migrations in order.
- Run smoke tests and monitor logs.
- Record deployed commit, migration version, test evidence and rollback/forward-fix decision.

### Stage 6 — Branch and documentation cleanup
- Retire duplicate alias branches only after unique-commit and deployment checks.
- Close superseded PRs with links to the accepted implementation.
- Update README, master index, traceability matrix and release history.
- Preserve historical decisions and audit evidence.

## 12. Acceptance gates

The unification is not complete until all of the following are evidenced:

- [ ] One approved canonical tenant/institute model.
- [ ] One approved person/Auth identity and student identity model.
- [ ] One approved membership/role authorization model.
- [ ] One approved batch/enrollment/academic-context model.
- [ ] System A workflows remain independent of QBMS and DTE completeness.
- [ ] Student report, teacher observation and verification are separately attributable.
- [ ] Evidence is append-only and idempotent under retries.
- [ ] Tenant isolation and role scope pass database integration tests.
- [ ] One reviewed migration lineage exists; no duplicate competing initial schema.
- [ ] Application topology and Vercel project root/build configuration are explicit.
- [ ] The deployed UI uses the approved backend path rather than demo localStorage.
- [ ] CI, unit, integration, browser and security checks pass on the exact release candidate.
- [ ] Production migration and release have separate explicit approvals.
- [ ] Traceability and release evidence are updated.

## 13. Open risks

| Risk | Severity | Mitigation / exit criterion |
|---|---|---|
| Duplicate tenant/student identity models | Critical | Canonical entity decision and tested mapping |
| Incomplete server-side authorization | Critical | RLS/grant matrix and cross-tenant integration tests |
| V10 migration security functions/policies not production-hardened | High | Function privilege review, policy tests and advisors |
| System A UI remains local/demo-backed | High | Backend integration and browser evidence |
| Divergent branch history and stale PR bases | High | Recompute comparisons and preserve unique commits before consolidation |
| Competing Next.js/Vite application roots | High | Approved topology and verified Vercel settings |
| Dated database audit treated as current | High | Re-audit live Supabase state immediately before migration |
| DTE scope drift during integration | High | Preserve DTE Phase 1 offline-only boundary unless separately approved |

## 14. Approval record

| Role | Name | Status | Date | Notes |
|---|---|---|---|---|
| Product owner | Pending | Not approved | — | Review architectural direction and module ownership |
| Technical owner | Pending | Not approved | — | Review identity, tenancy, migration and deployment plan |
| Academic owner | Pending | Not approved | — | Review System A academic evidence and workflow semantics |
| Security/database reviewer | Pending | Not approved | — | Review authorization, RLS, grants and migration strategy |

## 15. Change control

Any change to the proposed direction must update this document's version and approval record, and link the relevant architecture decision record. A future implementation plan must reference the approved decision IDs and exact branch/commit SHAs.

**Current status remains Draft. No merge, rebase, branch deletion, schema mutation, production deployment or student-data migration is authorized by this document.**
