# M0001 — Column-Level Schema Review

**Document ID:** PULSE-DB-M0001-COLUMN-REVIEW-001  
**Version:** 1.0.0  
**Date:** 2026-11-07  
**Status:** Review updated by DEC-013; CR-001 closed; remaining implementation blockers recorded; no executable SQL  
**Scope:** DEC-012 M0001 shared identity and academic foundation only

## 1. Review objective

Review the exact column-level contract for the nine M0001 objects against:
- DEC-011 and DEC-012 owner decisions;
- M0001 implementation specification;
- physical database blueprint;
- physical constraints and index catalogue;
- local M0001 test plan;
- PostgreSQL 17 and Supabase security boundary.

This is a design review, not a schema deployment or approval of unconfirmed recommendations.

## 2. Confirmed M0001 object inventory

1. `tenants` — canonical shared tenant identity.
2. `people` — canonical shared person identity.
3. `person_auth_identities` — Supabase Auth UUID to person mapping.
4. `tenant_memberships` — person-to-tenant association; independent of student identity.
5. `students` — tenant-owned student identity; mandatory tenant_id; nullable person_id; no membership FK.
6. `centres` — tenant-owned academic centre.
7. `batches` — tenant-owned cohort; optional same-tenant centre.
8. `enrollments` — tenant-safe effective-dated student-to-batch relationship.
9. `academic_context_epochs` — context history attached to enrollment, not directly to batch.

Do not add tenant_role_grants, teaching_assignments, guardian relationships, catalogues or System A workflow tables to M0001.

## 3. Column-level findings

### CR-001 — person_auth_identities has duplicate subject representations

**Original proposal:** both `auth_user_id` and `provider + provider_subject` represented the same initial Supabase Auth principal. DEC-013 has now resolved this duplication.

**Risk:** two competing identity keys can disagree; lifecycle and provider semantics are unclear. The initial release scope is Supabase Auth only.

**DEC-013 — selected:** use `auth_user_id uuid NOT NULL UNIQUE` as the sole Auth subject key for the Supabase-only initial release. Omit provider and provider_subject. Keep revoked mappings; do not delete or reassign an Auth UUID. A second provider requires a reviewed schema migration.

**Lifecycle contract:** `created_at` records mapping creation; nullable `revoked_at` records revocation. Account recovery for the same Auth UUID preserves the mapping. Account replacement uses a new Auth UUID and a separately audited trusted link operation. Link/unlink and audit-event writes are deferred to the later security workflow; M0001 has no client write path. Email verification is not a substitute for person identity verification.

### CR-002 — tenant_memberships lifecycle is incomplete

**Current contract:** tenant_id, person_id, unique (tenant_id,person_id), tenant-qualified key and unspecified lifecycle/effective timestamps.

**Risk:** no deterministic distinction between active, suspended, ended or invited association; no clear behavior for rejoining a tenant.

**Recommendation (not owner-approved):** define explicit membership lifecycle and effective interval. Preserve association history and avoid hard deletion. Decide whether rejoining creates a new membership row or reactivates the prior row before selecting uniqueness constraints. Do not add a partial unique index until this lifecycle is decided.

### CR-003 — student person-link tenant semantics need explicit treatment

**Approved:** students are tenant-owned; person_id is nullable; no tenant_memberships FK.

**Risk:** the global people FK allows a person link without tenant membership. This is intentional under DEC-012 but must not be mistaken for authorization.

**Required invariant:** a student row's tenant_id is authoritative. person_id is an optional identity association only. Authorization still requires trusted actor resolution and separate tenant membership/role checks. A person_id must never confer student access by itself.

### CR-004 — enrollment physical columns are incomplete

**Current contract:** tenant_id, student_id, batch_id, effective interval, status/lifecycle and provenance.

**Missing decisions:** exact timestamp names, lifecycle vocabulary, reason/transfer fields, creation actor, whether end date is represented by valid_to, and whether status is derived or stored.

**Recommendation (not owner-approved):** use a single consistent valid-time pair (`valid_from timestamptz NOT NULL`, `valid_to timestamptz NULL`) and define lifecycle separately only if it represents a state not derivable from time. Add created_at and actor/provenance only after deciding whether M0001 has a canonical audit facility. Keep all FK relations tenant-qualified. Do not add overlap exclusion or one-active-enrollment uniqueness while OPEN-010 remains blocked.

### CR-005 — academic_context_epochs versus enrollments is not yet semantically bounded

**Approved:** enrollment links student to batch; context epoch references enrollment.

**Risk:** if both tables store the same stream/class/batch facts without a rule for temporal changes, contradictory academic context can be represented.

**Required decision:** define which fields are immutable attributes of an enrollment and which fields can change within an enrollment and therefore require a new context epoch. State whether context epochs are required for every enrollment or optional. Define whether epoch intervals must be contained within the parent enrollment interval. Do not duplicate batch_id on context epochs.

### CR-006 — centre/batch code normalization is underspecified

**Current proposal:** normalized tenant-scoped code uniqueness; text columns.

**Risk:** stored normalized_code versus expression index, whitespace handling, case folding, Unicode and collation are unspecified.

**Recommendation (not owner-approved):** retain a single display/code value and enforce uniqueness with a documented normalized expression, rather than storing a second independently mutable normalized value. Select and test the normalization function/collation using representative institute codes before DDL.

### CR-007 — updated_at requires an update mechanism

**Current proposal:** centres and batches have updated_at, but M0001 prohibits triggers and has no update RPC.

**Risk:** updated_at may remain stale or invite unreviewed trigger creation.

**Recommendation (not owner-approved):** either omit updated_at from M0001 and add it with the later trusted command layer, or explicitly define trusted server-side update behavior in a later migration. Do not introduce an unreviewed trigger into M0001.

### CR-008 — academic vocabulary checks may narrow valid data

**Current source:** legacy academic_context_epochs restricts stream to JEE/NEET and class_level to XI/XII. The newer blueprint mentions COMMON and configured values.

**Risk:** copying old CHECK constraints can reject valid academic records; unconstrained free text can produce inconsistent reporting.

**Required decision:** inventory all intended values for class_level and stream, decide whether they are fixed codes or extensible reference values, and align batches and context epochs. Do not silently copy the legacy checks.

### CR-009 — tenant and person core exact schema is treated as retained, but canonical integration base is not selected locally

**Risk:** M0001 cannot safely assume existing tenants/people columns, ownership, constraints or migration history until the canonical `main` base is inspected and reconciled.

**Required action:** inspect canonical main's migration tree and shared-core source commits before CLI generation. Do not create duplicate tenants/people tables or rely on IF NOT EXISTS to hide drift.

### CR-010 — M0001 internal-only security assertions need exact catalog semantics

**Approved:** no anon/authenticated grants, no Data API exposure, no application-facing policies in M0001.

**Required implementation contract:** explicitly verify table privileges and default privileges; enable RLS on the intended application-schema tables; create no permissive policies, views, RPCs or SECURITY DEFINER functions. Test grants and RLS state independently. Confirm whether FORCE ROW LEVEL SECURITY is intentionally excluded; do not add it without evaluating migration-owner and service-role behavior.

## 4. Per-table review matrix

| Table | Required columns currently grounded | Review state |
|---|---|---|
| tenants | id, name, created_at | Existing source definition; canonical-base reconciliation required |
| people | id, created_at | Existing source definition; profile attributes intentionally outside this contract |
| person_auth_identities | id, person_id, auth_user_id, created_at, validity/provenance | Subject duplication and lifecycle unresolved |
| tenant_memberships | id, tenant_id, person_id, created_at, lifecycle/effective dates | Lifecycle and rejoin semantics unresolved |
| students | id, tenant_id, nullable person_id, created_at | DEC-012 semantics closed; profile fields outside M0001 |
| centres | id, tenant_id, code, name, status, created_at | Code normalization and updated_at unresolved |
| batches | id, tenant_id, nullable centre_id, academic_year, code, name, class_level, stream, status, created_at | Academic vocabulary and code normalization unresolved |
| enrollments | id, tenant_id, student_id, batch_id, valid_from, valid_to, lifecycle/provenance | Exact lifecycle and actor/provenance contract unresolved |
| academic_context_epochs | id, tenant_id, enrollment_id, stream, class_level, valid_from, valid_to, reason, created_at | Context-versus-enrollment field ownership unresolved |

## 5. Required key and FK baseline

- Every tenant-owned parent referenced across tenant boundaries must expose a UNIQUE `(tenant_id,id)` key.
- `tenant_memberships`: UNIQUE `(tenant_id,person_id)`; UNIQUE `(tenant_id,id)`.
- `students`: mandatory tenant_id; nullable person_id FK to people; UNIQUE `(tenant_id,id)`; no membership FK.
- `centres`: UNIQUE `(tenant_id,id)`; tenant-scoped normalized code uniqueness.
- `batches`: UNIQUE `(tenant_id,id)`; same-tenant optional centre FK; tenant/year/code uniqueness.
- `enrollments`: UNIQUE `(tenant_id,id)`; composite FK to students and batches.
- `academic_context_epochs`: composite FK `(tenant_id,enrollment_id)` to enrollments.
- No direct context-to-batch FK.
- All historical relationships use RESTRICT/NO ACTION; no cascade deletion of academic history.
- No one-active-enrollment or temporal overlap constraint until OPEN-010 is closed.

## 6. Decisions required before executable SQL

| Review ID | Decision / evidence required | Proposed owner |
|---|---|---|
| CR-001 | Choose one Auth subject representation and define link/revoke/delete lifecycle | **CLOSED by DEC-013** |
| CR-002 | Membership lifecycle, rejoin semantics and uniqueness | Platform |
| CR-004 | Enrollment status vocabulary and exact provenance columns | Academic + Platform |
| CR-005 | Enrollment versus context-epoch field ownership and temporal containment | Academic |
| CR-006 | Code normalization/collation contract | Platform |
| CR-007 | updated_at handling or removal from M0001 | Platform |
| CR-008 | Complete class/stream code vocabulary | Academic |
| CR-009 | Canonical main migration-base inspection | Technical |
| CR-010 | RLS/FORCE RLS/grants catalog acceptance contract | Security |

CR-003 is an implementation invariant, not a new owner decision: optional person_id never grants access.

## 7. Current disposition

- DEC-011 and DEC-012 remain approved.
- RECON-001/002/003 remain closed; RECON-004 / OPEN-010 remains blocked pending Academic Owner approval.
- This review does not reverse or broaden any owner decision.
- No SQL candidate has been authored.
- No migration has been generated or replayed.
- No Supabase DDL, grants, RLS or Data API settings have been changed.
- This document is a review record; its recommendations are not approvals.

## 8. Exit criteria for SQL authoring

SQL authoring may begin only after:
1. CR-001, CR-002, CR-004, CR-005, CR-006, CR-007, CR-008 and CR-010 are closed or explicitly deferred with a safe schema contract.
2. CR-009 canonical main migration base and migration tree are inspected.
3. The nine-object inventory and exact columns/constraints are reflected consistently in the spec, blueprint, dictionary, constraints catalogue and test plan.
4. The CLI-generated migration filename is produced on the canonical local branch.
5. Local PostgreSQL 17 replay and pgTAP tests are available.

Remote DDL remains a separate approval gate.


## 9. DEC-013 disposition

CR-001 is closed by DEC-013. The M0001 Auth mapping is `id`, `person_id`, `auth_user_id`, `created_at`, nullable `revoked_at`. The Auth UUID remains unique across active and revoked mappings; there is no reassignment. Provider-neutral identity support is deferred until a second provider is approved. This does not close CR-002 or the remaining SQL-authoring gates.
