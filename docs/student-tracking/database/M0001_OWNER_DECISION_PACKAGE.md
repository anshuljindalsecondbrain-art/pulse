# PULSE M0001 — Owner Decision Package

**Document ID:** PULSE-DB-DECISION-PACK-001  
**Version:** 1.0.0  
**Status:** Recommendations only — no owner choices approved  
**Date:** 2026-11-07

## Purpose

Present the minimum owner decisions needed to move from the shared identity specification to executable Migration 0001. This document is not an approval record. The recommendations are proposed engineering defaults, not facts about existing product policy.

## Decision summary

| Decision | Recommended selection | Why | Blocks |
|---|---|---|---|
| OPEN-013 — canonical branch | Use `main` as the eventual canonical integration branch; reconcile shared-core and System A work into one reviewed PR/migration history. Keep the current docs branch as a proposal branch. | One stable trunk and one ordered migration history. Avoid treating either feature branch's preliminary migration as canonical. | First executable migration integration |
| OPEN-014 — Auth mapping | Dedicated `person_auth_identities`; unique Auth subject; map Supabase Auth UUID to `people.id`; never use email or user-editable metadata as actor identity. Permit multiple Auth identities per person only through a trusted link/unlink workflow with audit. | Separates authentication subject from durable business identity and supports controlled account linking. | Trusted actor resolution |
| OPEN-015 — membership and role | Keep `tenant_people` as tenant association only. Store effective-dated, scoped role grants separately in `tenant_role_grants`. | Membership is not authorization; one person may hold multiple roles/scopes. | Role authorization |
| OPEN-016 — student tenant key | Option A: add `tenant_id` to `students`; enforce composite FK to tenant association and use `(tenant_id, student_id)` in tenant-owned child references. | Makes tenant integrity explicit and directly enforceable by composite constraints. | Tenant-safe physical FKs |
| OPEN-017 — centre/batch | Canonical `centres` and `batches` in shared core. Both carry `tenant_id`; a batch may reference a same-tenant centre, with nullable centre only if tenant-wide batches are permitted. Uniqueness scoped to tenant. | Avoids dangling batch UUIDs and duplicate System A academic structures. | Academic-context FK |
| OPEN-029 — initial access boundary | Option A: internal-only foundation. No `anon` or `authenticated` table grants and no Data API exposure until a later reviewed security migration. | Avoids a partially secured identity database; grants and RLS are separate controls. | First application connectivity |

## Detailed decisions

### OPEN-013 — canonical migration branch

**Recommended:** `main` is the eventual canonical integration branch. The current `docs/system-a-database-governance` branch remains a working proposal branch. The shared-core feature branch is a source of implementation material, not a migration history to merge unchanged.

Implementation gate:
1. Review and merge the documentation branch through a PR when requested.
2. Reconcile the shared-core model and System A schema against DEC-011 and the approved physical decisions.
3. Generate new timestamped migration files from the canonical branch using Supabase CLI.
4. Preserve old branch migrations as historical references; do not cherry-pick them as-is.

No PR or merge is created by this recommendation.

### OPEN-014 — Auth identity mapping

**Recommended contract:**
- A dedicated mapping table links one trusted Auth subject to one canonical person.
- Enforce uniqueness of the Auth subject.
- Use Supabase Auth UUID as the subject key if Supabase Auth is the only identity provider in scope.
- Allow a person to link multiple Auth identities only via trusted server-side account-linking commands.
- Email is mutable profile/contact data, not an identity key.
- User-editable Auth metadata is never an authorization source.
- Auth deletion, unlink, recovery and account merge must be audited and must not cascade-delete academic evidence.

Still needs owner confirmation: is Supabase Auth the only identity provider for the initial release, or must the first schema support external provider namespaces?

### OPEN-015 — tenant association and role grants

**Recommended contract:**
- `tenant_people`: records that a person is associated with a tenant.
- `tenant_role_grants`: records a permission-bearing role assignment with tenant, person, role, scope, effective dates, grantor and revocation metadata.
- A membership does not imply a role.
- A role grant does not create membership.
- A NULL resource scope never means global access by implicit convention.
- Exact role bundles and inheritance remain OPEN-019/020.

### OPEN-016 — student tenant key

**Recommended:** Option A from the M0001 specification.

- Add `tenant_id` to `students`.
- Add a unique key on `tenant_people(tenant_id,id)` (or equivalent canonical key).
- Composite FK `students(tenant_id,tenant_person_id)` to the tenant association.
- Add a unique `students(tenant_id,id)` key.
- Every tenant-owned child referencing a student uses the composite key.

This is an integrity design recommendation. Exact column names and FK targets must be checked against the approved existing shared-core conventions before SQL is generated.

### OPEN-017 — centres and batches

**Recommended contract:**
- `centres` is tenant-owned, with stable UUID, tenant-scoped code/name uniqueness, status and timestamps.
- `batches` is tenant-owned, with stable UUID, tenant-scoped code/name uniqueness, lifecycle status, and optional same-tenant centre reference.
- Academic context's batch reference must be a real FK and must be tenant-safe.
- Archive/deactivate rather than delete when academic records reference a centre or batch.
- Academic year, batch capacity and stream/class applicability require explicit definitions before DDL.

### OPEN-029 — initial access boundary

**Recommended:** Option A.

- Create shared identity objects as an internal foundation.
- Do not grant table access to `anon` or `authenticated`.
- Do not expose these tables through the Supabase Data API before the security migration.
- Later security migration must add reviewed grants, RLS, policies, actor resolution and security tests together.
- Service-role access remains server-only and must never be shipped to browser code.

Important: lack of application grants is the initial exposure boundary; it does not replace later RLS. The exact schema placement and Supabase exposed-schema configuration must be verified during implementation preflight.

## Additional M0001 dependency decisions

### OPEN-010 — concurrent active academic contexts

**Recommendation for discussion:** Permit a student to retain multiple historical and potentially concurrent programme relationships where the product genuinely supports them; do not impose a global one-active-batch constraint until product semantics are confirmed. Define the authoritative "current context" selection separately if dashboards require one.

Owner must specify whether a student can be simultaneously active in multiple batches/programmes, and whether one is designated primary.

### OPEN-011 — subject/chapter catalogue ownership

**Recommendation for discussion:** Keep subject/chapter catalogue references outside M0001 unless shared ownership and versioning are already canonical. M0001 should not create a second curriculum taxonomy. System A can reference stable curriculum identifiers in a later migration after catalogue ownership is settled.

## Explicitly not resolved by this package

These remain open and must be closed before the migration(s) that depend on them:
- OPEN-018 teaching assignment schema.
- OPEN-019 permission-to-role bundles.
- OPEN-020 scope inheritance.
- OPEN-021 separation of duties.
- OPEN-022 RPC versus Edge Function placement.
- OPEN-023 publication roster snapshot behavior.
- OPEN-024 authorization revocation race semantics.
- OPEN-025 parent field-purpose policy.
- OPEN-026 audit/evidence retention.
- OPEN-027 export governance.
- OPEN-028 outbox delivery policy.

## Owner response required

To authorize the next implementation step, confirm or change the six recommended selections in the summary table. A short response such as "approve all six recommendations" is sufficient to record those six decisions, but it does not authorize applying DDL to Supabase. Any exception can be stated by decision ID.

## Safety status

- No SQL generated.
- No migration file created.
- No Supabase DDL, grants, RLS or configuration changed.
- No PR or merge created.
