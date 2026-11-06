# PULSE — Master Documentation Index

- Document ID: PULSE-GOV-REPO-003
- Version: 0.2.0
- Status: Draft — consolidated index; owner approval pending
- Last updated: 2026-11-06
- Repository: `anshuljindalsecondbrain-art/pulse`
- Active System A workstream: `feat/system-a-abhyas-foundation`
- Governance: Draft documents do not authorize code, schema, migration, merge or deployment changes.

## 1. Platform authority and architecture

| Document | Path | Purpose |
|---|---|---|
| Project master plan | `docs/PROJECT_MASTER_PLAN.md` | Product vision, domain boundaries and principles |
| Architecture baseline | `docs/ARCHITECTURE.md` | Modular application, shared platform, module ownership |
| Database governance | `docs/DATABASE_GOVERNANCE.md` | Database change governance |
| Repository architecture governance | `docs/00_PROJECT_GOVERNANCE/PULSE_REPOSITORY_ARCHITECTURE_AND_DOCUMENTATION_GOVERNANCE_BLUEPRINT.md` | Repository and documentation governance |
| Repository inventory/disposition | `docs/00_PROJECT_GOVERNANCE/PULSE_REPOSITORY_FILE_INVENTORY_AND_DISPOSITION_MATRIX.md` | Inventory and file disposition |
| Canonical schema/migration specification | `docs/00_PROJECT_GOVERNANCE/PULSE_CANONICAL_DATABASE_SCHEMA_AND_MIGRATION_SPECIFICATION.md` | Target conventions and migration controls |

## 2. Canonical model and System A design sequence

All records below remain Draft proposals and are not executable authorization.

| Stage | ID | File | Focus |
|---|---|---|---|
| 1 | PULSE-DATA-CORE-001 | `PULSE_CANONICAL_IDENTITY_TENANCY_AND_ACADEMIC_CORE_DATA_MODEL.md` | Shared tenants, people, memberships, roles, centres, students, batches, enrollments and context |
| 2 | PULSE-DATA-CORE-002 | `PULSE_CANONICAL_CORE_ERD_DATA_DICTIONARY_AND_AUTHORIZATION_MATRIX.md` | Logical ERD, data dictionary and authorization matrix |
| 3 | PULSE-DATA-CORE-003 | `PULSE_CANONICAL_DATABASE_SCHEMA_AND_MIGRATION_SPECIFICATION.md` | Canonical schema and migration governance |
| 4 | PULSE-DATA-CORE-004 | `PULSE_EXISTING_MIGRATION_RECONCILIATION_AND_DISPOSITION_MATRIX.md` | Reconcile V10 and System A proposals; neither apply as-is |
| 5 | PULSE-DATA-CORE-005 | `PULSE_SYSTEM_A_REPOSITORY_DEPENDENCY_AUDIT_AND_SCHEMA_IMPACT_MATRIX.md` | Source audit: UI demo/localStorage, adapter gap and code/schema impact |
| 6 | PULSE-DATA-CORE-006 | `PULSE_SYSTEM_A_APPLICATION_SERVICE_AND_API_CONTRACT.md` | Trusted query/command service contracts |
| 7 | PULSE-DATA-CORE-007 | `PULSE_SYSTEM_A_DATABASE_AUTHORIZATION_AND_TRANSACTION_DESIGN.md` | Identity, role/scope authorization, RLS and atomic transactions |
| 8 | PULSE-DATA-CORE-008 | `PULSE_SYSTEM_A_PHYSICAL_TABLE_AUTHORIZATION_AND_INTEGRITY_MAPPING.md` | Table-by-table authorization, integrity and mutation rules |
| 9 | PULSE-DATA-CORE-009 | Next planned: canonical physical ERD and table/column data dictionary | Consolidate shared platform and System A entities before SQL |

## 3. Infrastructure and delivery governance

| Document | Path |
|---|---|
| Live infrastructure audit | `docs/00_PROJECT_GOVERNANCE/PULSE_LIVE_INFRASTRUCTURE_AUDIT_001.md` |
| Supabase migration runbook | `docs/database/SUPABASE_MIGRATION_RUNBOOK.md` |
| Student Tracking backend status | `docs/student-tracking/SYSTEM_A_BACKEND_IMPLEMENTATION_STATUS.md` |
| System A database architecture | `docs/student-tracking/SYSTEM_A_DATABASE_ARCHITECTURE.md` |
| System A implementation plan | `docs/student-tracking/SYSTEM_A_IMPLEMENTATION_PLAN.md` |

## 4. Product module documentation

| Domain | Location | Ownership |
|---|---|---|
| Student Work Tracking / Abhyas Matrix | `docs/student-tracking/` | Assignments, obligations, attempts, evidence, verification, correction, doubt and tracking |
| QBMS | `docs/qbms/` and module specs | Question identity, versions, sources/media, review and quality |
| DTE | `docs/dte/` | Configurable classification software, mappings, validation, review and versioning |
| DRE | DRE specifications | Difficulty rules and evaluations |
| Test Management | Test management specifications | Blueprint, assembly, delivery, results and analysis |
| Content Management | CMS specifications | Tenant content collections, series, editions, units and placements |
| AI Mentor | AI Mentor specifications | Diagnostics, interventions and explainable recommendations |

## 5. Decisions to preserve

1. One canonical platform identity and tenant core; no duplicate System A institute/person/membership architecture.
2. System A retains module-owned operational records.
3. Student Tracking operates without QBMS question IDs or DTE classification mappings.
4. Question identity, question version and placement/slot remain separate.
5. Learner self-report, teacher observation, completion verification and answer evaluation are separate facts.
6. Evidence and decisions are append-only; corrections append linked history.
7. Tenant-owned relationships use tenant-qualified composite foreign keys.
8. Authorization is action-based and scoped to tenant/centre/batch/student/resource at trusted service/database boundaries.
9. Assignment publication and evidence workflows require atomic, idempotent transactions.
10. DTE manages configurable classification structures; it does not prescribe a universal chapterwise curriculum hierarchy.
11. Modular application first; no premature microservices.
12. Reuse existing code and schema only after inspection and reconciliation.

## 6. Verified implementation boundary — 2026-11-06

- Supabase PULSE is active and healthy, region `ap-south-1`, PostgreSQL 17.11.
- Live `public` schema has no application tables and migration history is empty.
- No Edge Functions are deployed.
- Security, performance and health advisor scans reported no lints on the currently empty application schema; this is not certification of proposed objects.
- Proposed System A SQL remains unapplied; it forces RLS and has no policies or authenticated table grants.
- Student Tracking primary UI remains localStorage/demo-backed; the Supabase repository adapter is not integrated.
- Vercel feature-branch Preview has reached READY, but remains protected by Vercel Authentication and is not a production-connected release.
- Supabase preview variables are scoped to `feat/system-a-abhyas-foundation`; no Production env variables were returned by the inspected Vercel environment listing.
- PR #2 remains open and draft. Do not merge simply because design documentation is complete.

## 7. Required approval gates

Before a unified migration or live application enablement:
- Product approval of identity, tenant and permission semantics.
- Academic approval of enrollment, parent, publication and evidence lifecycle rules.
- Security approval of resource scope, RLS/grants, privileged functions and negative tests.
- Technical approval of physical schema, constraints and migration lineage.
- Isolated migration replay and RLS/RPC/concurrency/integration tests.
- Explicit owner authorization for live migration and production deployment.

## 8. Change control

This index is navigational. It does not supersede source-specific documents, erase historical audit records or mark proposals approved. Record dated corrections rather than silently rewriting historical conclusions.
