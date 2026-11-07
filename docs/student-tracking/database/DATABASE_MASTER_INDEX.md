# System A Database Documentation — Master Index

**Document ID:** STS-DB-INDEX-001  
**Version:** 1.0.0  
**Status:** Active register  
**Date:** 2026-11-07

## 1. Canonical entry points

| Document | Purpose | Current state |
|---|---|---|
| [Database Management Master Plan](DATABASE_MANAGEMENT_MASTER_PLAN.md) | Governance, scope, architecture and lifecycle | Working baseline |
| [Architecture Decision Register](DATABASE_DECISION_REGISTER.md) | Decisions, options, owners and closure evidence | Initial register |
| [Schema and Migration Register](SCHEMA_MIGRATION_REGISTER.md) | All schemas and migration execution records | Initial register |
| [Physical ERD Reconciliation](PHYSICAL_ERD_RECONCILIATION.md) | Shared PULSE identity + System A physical ownership and relationship map | Reconciled target proposal |\n| [Data Dictionary](DATA_DICTIONARY.md) | Column-level definitions and constraints | Logical draft |
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
