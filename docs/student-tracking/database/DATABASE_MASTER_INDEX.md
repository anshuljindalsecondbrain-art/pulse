# System A Database Documentation — Master Index

**Document ID:** STS-DB-INDEX-001  
**Version:** 1.0.0  
**Status:** Active register  
**Date:** 2026-11-07

## 1. Canonical entry points

| Document | Purpose | Current state |
|---|---|---|
| [Database Management Master Plan](DATABASE_MANAGEMENT_MASTER_PLAN.md) | Governance, scope, architecture and lifecycle | Working baseline |
| [Architecture Decision Register](DATABASE_DECISION_REGISTER.md) | Decisions, options, owners and closure evidence | DEC-012/013 approved; CR-001 closed; RECON-001–003 closed; RECON-004 blocked |
| [Schema and Migration Register](SCHEMA_MIGRATION_REGISTER.md) | All schemas and migration execution records | Initial register |
| [Physical ERD Reconciliation](PHYSICAL_ERD_RECONCILIATION.md) | Shared PULSE identity + System A physical ownership and relationship map | Reconciled to DEC-012; DDL pending |
| [M0001 Column-Level Schema Review](M0001_COLUMN_LEVEL_SCHEMA_REVIEW.md) | Column-level gaps, key/FK baseline and pre-SQL closure criteria | Review updated by DEC-013; CR-001 closed; remaining blockers recorded |
| [Physical Database Blueprint](PHYSICAL_DATABASE_BLUEPRINT.md) | Column-level types, nullability, constraints, indexes and ownership | DEC-012 amendment recorded; detailed DDL review pending |
| [Physical Constraints and Index Catalogue](PHYSICAL_CONSTRAINTS_AND_INDEX_CATALOG.md) | Composite FKs, checks, uniqueness, deletion rules and dependency order | DEC-012 constraints recorded; technical review pending |
| [Authorization and Permission Catalogue](AUTHORIZATION_PERMISSION_CATALOG.md) | Action permissions, role bundles, scopes and separation of duties | Proposal; owner approval pending |
| [RLS Policy Specification](RLS_POLICY_SPECIFICATION.md) | Table-family policy rules, views, functions and command-only writes | Proposal; security approval pending |
| [Command and RPC Catalogue](COMMAND_RPC_CATALOG.md) | QRY/CMD contracts, inputs, validation, writes and errors | Proposal; API placement pending |
| [Transaction, Concurrency and Idempotency](TRANSACTION_CONCURRENCY_IDEMPOTENCY.md) | Atomicity, locking, retries, outbox and race conditions | Proposal; technical approval pending |
| [Audit, Events and Security Tests](AUDIT_EVENT_AND_SECURITY_TEST_REGISTER.md) | Evidence provenance, append-only controls and 44 security tests | Proposal; security/privacy approval pending |
| [Data Dictionary](DATA_DICTIONARY.md) | Column-level definitions and constraints | DEC-012 terminology and relationships reconciled; column-level draft |
| [RLS and Security Matrix](RLS_SECURITY_MATRIX.md) | Actor access and tenant authorization | Design baseline |
| [Database Test Strategy](DATABASE_TEST_STRATEGY.md) | Migration, RLS, integrity and performance tests | Test plan |
| [Change Control Protocol](DATABASE_CHANGE_CONTROL.md) | Request-to-release governance | Active protocol |

## 2. Existing source documents to preserve and reconcile

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

## 3. Repository structure

```text
docs/student-tracking/database/
├── DATABASE_MASTER_INDEX.md
├── DATABASE_MANAGEMENT_MASTER_PLAN.md
├── DATABASE_DECISION_REGISTER.md
├── SCHEMA_MIGRATION_REGISTER.md
├── DATA_DICTIONARY.md
├── RLS_SECURITY_MATRIX.md
├── DATABASE_TEST_STRATEGY.md
└── DATABASE_CHANGE_CONTROL.md
```

Executable DDL belongs in `supabase/migrations/`. SQL tests belong in `supabase/tests/`. The documents in this directory describe and govern the implementation; they are not a substitute for migration validation.

## 4. Status vocabulary

- **Verified:** directly inspected in GitHub or Supabase.
- **Implemented:** exists in code/schema and has supporting evidence.
- **Proposed:** designed but not applied/merged.
- **Pending:** work remains.
- **Blocked:** a dependency or approval prevents safe implementation.
- **Deprecated:** superseded but retained for historical traceability.

Do not describe a proposal as deployed or a CI workflow as passing without checking the exact SHA and run.

## 5. Update rules

Every database event updates the relevant register and change history. The index must link to current canonical documents, and replaced documents must remain discoverable as superseded records.

## 6. New migration architecture documents

- [Unified Migration Architecture](UNIFIED_MIGRATION_ARCHITECTURE.md) — canonical migration ownership, branch policy, dependency graph, environment rollout and recovery.
- [Migration 0001 Shared Identity Specification](MIGRATION_0001_SHARED_IDENTITY_IMPLEMENTATION_SPEC.md) — scope, invariants, object inventory and acceptance gates for the shared identity foundation.

## 7. M0001 owner decision package

- [M0001 Owner Decision Package](M0001_OWNER_DECISION_PACKAGE.md) — recommended selections for OPEN-013–017 and OPEN-029, plus dependent OPEN-010/011; owner approval pending.


## 8. M0001 implementation package

- [M0001 Owner Decision Package](M0001_OWNER_DECISION_PACKAGE.md) — six owner decisions approved; remote DDL not authorized.
- [M0001 Local Build and Verification Plan](M0001_LOCAL_BUILD_AND_TEST_PLAN.md) — CLI-generated migration workflow, 24 schema/security assertions, two-tenant fixtures and local replay gates.
- [M0001 Shared Identity Implementation Specification](MIGRATION_0001_SHARED_IDENTITY_IMPLEMENTATION_SPEC.md) — approved object boundary and physical implementation contract.


## 9. Branch and schema reconciliation

- [Branch and Shared-Core Schema Reconciliation — 2026-11-07](BRANCH_AND_SCHEMA_RECONCILIATION_2026-11-07.md) — branch divergence, canonical-core conflicts, System A adapter impact and four owner/academic decision gates before M0001 SQL.


## 10. DEC-012 physical model reconciliation — 2026-11-07

The following physical design artifacts now carry the owner-approved Option B model:
- [Physical ERD Reconciliation](PHYSICAL_ERD_RECONCILIATION.md) — tenant_memberships, tenant-owned students with optional person_id, explicit enrollments, and context epochs linked to enrollment.
- [Physical Database Blueprint](PHYSICAL_DATABASE_BLUEPRINT.md) — canonical entity/constraint contract and legacy source disposition.
- [Physical Constraints and Index Catalogue](PHYSICAL_CONSTRAINTS_AND_INDEX_CATALOG.md) — tenant-safe enrollment/context keys and prohibited one-active-enrollment constraints while OPEN-010 remains blocked.
- [Data Dictionary](DATA_DICTIONARY.md) — canonical naming and relationship semantics.
- [M0001 Local Build and Verification Plan](M0001_LOCAL_BUILD_AND_TEST_PLAN.md) — DEC-012-specific schema assertions and two-tenant fixtures.

RECON-001/002/003 are closed by DEC-012. RECON-004 remains blocked pending Academic Owner approval. No executable migration or remote DDL is authorized by these documentation updates.


## 11. M0001 column-level review — 2026-11-07

[M0001 Column-Level Schema Review](M0001_COLUMN_LEVEL_SCHEMA_REVIEW.md) records the column-level review. DEC-013 closes CR-001 (single Supabase Auth subject key); membership lifecycle, enrollment/context boundaries, code normalization, timestamp maintenance, academic vocabularies, canonical migration-base verification and internal-only security assertions remain open.

The review is not a new owner approval. Its recommendations remain proposals. SQL authoring is held until the required decisions are closed or explicitly deferred with a safe contract.


## 12. DEC-013 — Auth identity mapping decision

DEC-013 selects a single unique `auth_user_id` UUID for the initial Supabase Auth release. The Auth identity contract is documented in the Decision Register, M0001 specification, physical blueprint, constraints catalogue, data dictionary, column-level review and local test plan. CR-001 is closed; other column-level gates remain open.


## 13. PULSE internal pilot operating model — 2026-11-07

[PULSE Pilot Operating Model and Implementation Plan](PULSE_PILOT_OPERATING_MODEL_AND_IMPLEMENTATION_PLAN.md) records the owner-selected operating mode: one Super Admin login, manually managed student records, no student login in the initial pilot, full internal use of PULSE modules, and both exercise-level and question-level activity tracking. It defines the student/content workflows, actor provenance, reconciliation rules, pilot phases and acceptance scenarios. This is a product operating plan; it does not authorize DDL, grants, RLS changes, Data API exposure or deployment.


## 14. Pilot P0/P1 implementation specification — 2026-11-07

[Pilot P0 Student Master and P1 Academic Catalogue Specification](PILOT_P0_P1_STUDENT_MASTER_AND_ACADEMIC_CATALOGUE_SPEC.md) defines student fields, identity/enrollment invariants, Subject → Module → Chapter → Exercise → optional Subsection, inventory-first and itemised question entry, question-type/marks rules, UI layout and acceptance criteria. OPEN-011 catalogue ownership remains unresolved; the pilot boundary does not settle the permanent catalogue ownership decision. No DDL or UI implementation is authorized by the specification.


## 15. PULSE engineering maturity and improvement governance — 2026-11-07

[PULSE Engineering Maturity & Improvement Master Plan](../../governance/PULSE_ENGINEERING_MATURITY_AND_IMPROVEMENT_MASTER_PLAN.md) establishes the preliminary evidence-based engineering maturity assessment, benchmark adaptations, gap register, target engineering operating model, six-stage improvement roadmap and approval gates. Its scores are advisory and require evidence-based review. The document is proposed and pending Product Owner and Technical Owner approval. It does not authorize source replacement, production DDL, data movement, grants/RLS changes, PR merge or deployment.
