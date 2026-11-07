# System A and Shared Database Source Consolidation Register

- Document ID: PULSE-GOV-ST-CONSOLIDATION-001
- Version: 1.0.0
- Status: Draft — evidence-based disposition proposal; owner approval pending
- Snapshot: 2026-11-07
- Source branch examined: `docs/system-a-database-governance`
- No merge, migration execution or schema change authorized

## 1. Executive determination

The System A database-governance branch is not a clean additive continuation of the System A foundation branch. It is a divergent source line with substantial new governance and schema-reconciliation documents.

Current comparison:
- `docs/system-a-database-governance` versus `feat/system-a-abhyas-foundation`: 103 commits ahead, 3 behind; histories are divergent.
- `docs/system-a-database-governance` versus `docs/system-a-a2-model-reconciliation`: 101 commits ahead, 0 behind.
- The database-governance branch tree contains 187 files; System A foundation tree contains 160; A2 reconciliation tree contains 159; main contains 53.
- The database-governance branch includes the same System A application paths and initial migration path, plus a database governance package and reconciliation documents.

**Disposition:** treat `docs/system-a-database-governance` as the richest current System A database-design source corpus, not as a merge-ready branch. Extract and review documents by stable ID, decision status and content. Rebuild selected approved material on main through bounded PRs. Do not merge the branch head or cherry-pick its entire history.

## 2. System A canonical document map — proposed

| Subject | Candidate canonical entry | Supporting records | Disposition |
|---|---|---|---|
| System A database navigation | `docs/student-tracking/database/DATABASE_MASTER_INDEX.md` | Existing project master index | Candidate domain entry point; reconcile links before adoption |
| Database governance/lifecycle | `DATABASE_MANAGEMENT_MASTER_PLAN.md` | `DATABASE_CHANGE_CONTROL.md`, root database governance | Consolidate process; keep global policy in project governance |
| Architecture decisions | `DATABASE_DECISION_REGISTER.md` | `M0001_OWNER_DECISION_PACKAGE.md`, architecture decision log | Preserve decision IDs and original approval provenance |
| Shared identity migration design | `MIGRATION_0001_SHARED_IDENTITY_IMPLEMENTATION_SPEC.md` | M0001 owner package, local build/test plan | Approved design boundary does not authorize remote DDL |
| Physical schema | `PHYSICAL_DATABASE_BLUEPRINT.md` | `PHYSICAL_ERD_RECONCILIATION.md`, constraints/index catalogue | Candidate physical model; technical and owner gates remain |
| Logical data dictionary | `DATA_DICTIONARY.md` | Physical blueprint and System A domain specifications | Logical names are not deployed physical truth |
| Authorization | `AUTHORIZATION_PERMISSION_CATALOG.md` | `RLS_POLICY_SPECIFICATION.md`, `RLS_SECURITY_MATRIX.md` | Proposal; permission/security approval pending |
| Commands/RPC | `COMMAND_RPC_CATALOG.md` | `TRANSACTION_CONCURRENCY_IDEMPOTENCY.md` | Proposal; implementation placement and security review pending |
| Security/audit tests | `AUDIT_EVENT_AND_SECURITY_TEST_REGISTER.md` | `DATABASE_TEST_STRATEGY.md` | Consolidate duplicate test catalogues without dropping cases |
| Migration control | `SCHEMA_MIGRATION_REGISTER.md`, `UNIFIED_MIGRATION_ARCHITECTURE.md` | Supabase migration runbook | One canonical ordered lineage after approval |
| Existing app dependency audit | `PULSE_EXISTING_APPLICATION_SOURCE_AND_INTEGRATION_AUDIT.md` | `SYSTEM_A_SOURCE_RECONCILIATION_2026-11-06.md` | Keep as dated evidence; refresh before implementation |
| Pilot scope | `PILOT_P0_P1_STUDENT_MASTER_AND_ACADEMIC_CATALOGUE_SPEC.md` | `PULSE_PILOT_OPERATING_MODEL_AND_IMPLEMENTATION_PLAN.md` | Product/academic scope approval required |

The table is a proposed authority map, not an assertion that these files are merged into main or approved for implementation.

## 3. Shared-core model — decisions to preserve

The inspected decision register records the following architectural constraints and owner decisions:
- DEC-011: shared PULSE identity is the permanent identity source for System A.
- DEC-012: tenant membership, tenant-owned student identity, optional person link, explicit enrollments and academic context epochs linked to enrollment.
- DEC-013: Auth subject mapping to canonical person identity; email and user-editable metadata are not authorization identity.
- M0001 package records six owner selections: canonical integration target main; dedicated person_auth_identities; separate tenant membership and role grants; tenant-safe student keys; shared centres/batches; internal-only initial migration boundary.
- The M0001 package explicitly says the approved design boundary is not permission to apply remote DDL.
- OPEN-010 concurrent active enrollment rules and other catalogue/role/security issues remain unresolved in the source records.

**Preservation rule:** transfer decision records with original IDs, owner, date, status, rationale and source commit. Do not paraphrase an approved decision into a new record and discard its source evidence.

## 4. Migration source audit

Inspected file:
`supabase/migrations/20261106000100_system_a_initial_schema.sql`

- Blob SHA: `7a3c46b7e8b5f9b0d19506d1bf9696107e0b6e3f`
- Explicit `CREATE TABLE` statements: **25**
- `CREATE TYPE` statements: 8
- `CREATE INDEX` statements: 12
- File length: 19,174 characters
- File header: PROPOSED / NOT APPLIED

The earlier prose count of 26 is inconsistent with the actual migration's 25 table declarations. The physical table authorization mapping also enumerates 25 tables. Correct the prose to 25 only after verifying the full mapping against the migration and retaining the audit correction record.

This migration must not be applied as-is. It contains a parallel `sa_institutes`/Auth-user-centric identity model that conflicts with the approved shared PULSE identity direction. The database-governance branch contains a later shared-core specification; the migration needs regeneration from the reconciled target, not cosmetic renaming.

## 5. Main technical conflict matrix

| Area | Legacy System A migration | Shared-core decision direction | Required action |
|---|---|---|---|
| Tenant | `sa_institutes` | Shared `tenants` | Map and remove duplicate ownership from new target |
| Person/Auth | Auth user IDs embedded in domain rows | `people` + `person_auth_identities` | Resolve actor through trusted server path |
| Membership/roles | Role on institute membership row | Tenant membership + separate role grants | Separate association from authorization |
| Student | Institute-owned row with Auth UID | Tenant-owned student, optional person link | Preserve tenant key and admission identifiers |
| Batch/centre | System A-owned centre/batch | Shared platform centre/batch | Reuse canonical shared entities |
| Batch membership | One-current-batch partial unique index | Effective-dated enrollments; overlap policy open | Do not encode unresolved academic rule |
| Catalogue | Mixed institute/global subject model | Catalogue ownership remains an explicit decision | No ambiguous nullable tenant scope |
| Initial grants | Proposed in migration | M0001 internal-only boundary | No client exposure before reviewed security migration |

## 6. Source branch consolidation sequence

1. Freeze the source snapshots by commit SHA and retain the original branches.
2. Validate stable Document IDs and versions across the full System A corpus.
3. Resolve the duplicate CORE-009 ID/version collision; retain both documents until an owner designates canonical/supporting.
4. Reconcile the System A migration and physical table map; retain the 25-table correction evidence.
5. Validate DEC-011/012/013 and M0001 owner approvals against their original records and provenance.
6. Select the canonical document per concern using the map in section 2.
7. Copy or move selected files into a main-based integration branch only after path/reference checks.
8. Run Markdown link checks, duplicate-ID checks, migration static checks, SQL parsing/local Supabase replay, authorization tests and System A regression tests.
9. Open one documentation PR and a separate migration/code PR; do not mix schema deployment with document reorganization.
10. Retire duplicate source docs/branches only after accepted integration and archival pointers.

## 7. Hard gates before any migration

- Confirm canonical shared-core physical schema and key types.
- Close enrollment overlap and catalogue ownership decisions.
- Complete role/permission and RLS/grant matrix.
- Review all functions, views, triggers, SECURITY DEFINER and Storage authorization.
- Build local Supabase migration and two-tenant fixtures.
- Prove cross-tenant deny cases and allowed actor/action cases.
- Confirm backup/recovery and deployment environments.
- Obtain explicit approval for a migration PR and separately for remote application.

## 8. Non-actions

This register does not merge branches, move existing source files, delete duplicate documents, change application code, generate replacement SQL, apply migrations or alter Supabase. It records a safe extraction plan only.
