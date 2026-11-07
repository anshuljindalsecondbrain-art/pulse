# M0001 — Local Build and Verification Plan

**Document ID:** PULSE-DB-M0001-TEST-001  
**Version:** 1.0.0  
**Status:** Revised for DEC-012 and DEC-013; pre-SQL review still open; not executed  
**Date:** 2026-11-07  
**Parent:** MIGRATION_0001_SHARED_IDENTITY_IMPLEMENTATION_SPEC.md

## 1. Purpose

Define the exact local-only workflow for producing, reviewing and testing the first canonical shared identity migration. This plan does not authorize remote DDL.

## 2. Preconditions

- Owner approvals OPEN-013, OPEN-014, OPEN-015, OPEN-016, OPEN-017 and OPEN-029 are recorded; DEC-012 approves Option B physical identity/enrollment model.
- The canonical migration integration base is `main`; this work branch remains a proposal branch.
- The shared-core source migration is historical input only and must not be copied unchanged.
- The intended migration directory and all existing migration files must be inspected on the canonical integration branch before file generation.
- Local Supabase CLI version and Docker-compatible runtime must be available.
- The local database must be disposable and unlinked from the remote PULSE project.

## 3. CLI-generated migration requirement

The executable filename must be created by the Supabase CLI, not hand-authored through GitHub's file API.

After the canonical migration base has been checked out locally:

```bash
supabase --version
supabase --help
supabase migration --help
supabase migration new shared_identity_academic_context
```

The generated timestamped file under `supabase/migrations/` is then populated with the reviewed SQL candidate. Do not invent or reuse the historical `0001_identity_and_academic_context.sql` filename.

This connected GitHub workflow does not expose a local Supabase CLI/Docker shell. Therefore the timestamped migration cannot be truthfully generated or replay-tested from the current tool session. Do not bypass this gate by fabricating a timestamp or uploading a hand-named executable migration.

## 4. M0001 schema assertions

The migration must establish the approved M0001 object boundary:

- tenants
- people
- tenant_memberships
- person_auth_identities
- students
- centres
- batches
- enrollments
- academic_context_epochs

The migration must not create tenant_role_grants, teaching_assignments, parent relationships, curriculum catalogues, System A workflow tables, QBMS content or DTE taxonomy. Students must not reference tenant_memberships; academic_context_epochs must reference enrollments, not batches directly.

## 5. Required pgTAP test cases

| Test ID | Assertion | Expected result |
|---|---|---|
| M1-001 | All nine approved tables exist in the intended schema | Pass |
| M1-002 | PKs and UUID defaults match the reviewed contract | Pass |
| M1-003 | tenant_memberships unique on (tenant_id, person_id) | Duplicate rejected |
| M1-004 | tenant_memberships composite key supports tenant-qualified membership references; students do not reference it | Pass |
| M1-005 | Student has mandatory tenant_id and optional person_id; student creation does not require membership | Pass; cross-tenant person link rules enforced only if explicitly tenant-qualified by approved schema |
| M1-006 | No student-to-membership uniqueness/FK is present | Schema inspection passes |
| M1-007 | Student tenant-qualified key (tenant_id, id) exists | Pass |
| M1-008 | One Auth subject maps to at most one person | Duplicate Auth subject rejected |
| M1-009 | Auth mapping person FK prevents orphan identity | Orphan rejected |
| M1-010 | Auth identity validity interval is positive | Invalid interval rejected |
| M1-011 | Centre code uniqueness is tenant-scoped and normalized | Same tenant duplicate rejected; cross-tenant duplicate allowed |
| M1-012 | Batch code uniqueness is tenant/year-scoped and normalized | Same tenant/year duplicate rejected |
| M1-013 | Batch centre reference cannot cross tenants | Cross-tenant centre rejected |
| M1-014 | Enrollment student reference is tenant-safe | Cross-tenant student rejected |
| M1-015 | Enrollment batch reference is tenant-safe | Cross-tenant batch rejected |
| M1-016 | Academic context epoch references enrollment and has no direct batch_id relationship | Schema inspection passes |
| M1-017 | valid_to must be later than valid_from | Invalid interval rejected |
| M1-018 | No unique/exclusion constraint assumes a single active enrollment per student | Schema inspection passes; concurrency remains unresolved |
| M1-019 | No tenant_role_grants, teaching_assignments or catalogue tables are created | Schema inspection passes |
| M1-020 | anon and authenticated have no table privileges on M0001 objects | Privilege assertion passes |
| M1-021 | RLS is enabled on each exposed-schema M0001 table; no permissive policy exists | Catalog assertion passes |
| M1-022 | No SECURITY DEFINER function or public application RPC is introduced | Catalog assertion passes |
| M1-023 | A second full migration replay from an empty database succeeds | Pass |
| M1-024 | Existing schema drift is not silently masked by IF NOT EXISTS | Review/static assertion passes |

## 6. Two-tenant fixture

Use synthetic tenant A and tenant B, two people, one membership per tenant, at least two tenant-owned students per tenant (including one with person_id NULL and one with person_id set but no membership requirement), one centre and one batch per tenant, enrollments and at least one context epoch per enrollment.

Positive assertions:
- Same-tenant student association succeeds.
- Same-tenant batch-centre reference succeeds.
- Same-tenant context-to-student and context-to-batch references succeed.
- Two different tenants may reuse the same centre code and batch code where the uniqueness scope allows it.

Negative assertions:
- Tenant A student cannot point to Tenant B membership.
- Tenant A batch cannot point to Tenant B centre.
- Tenant A context cannot point to Tenant B student or batch.
- One Auth UUID cannot be assigned to two different people.

## 7. Security test conditions

- Test table privileges as `anon` and `authenticated`, not only as the migration owner.
- Verify RLS state independently from table grants.
- Verify no application role receives accidental access through default privileges.
- Do not rely on the absence of policies alone; assert both grants and RLS catalog state.
- Confirm the Data API exposed-schema configuration before any later application exposure.
- Never use service_role credentials in a browser or client-side test.

## 8. Local verification commands

After the migration and pgTAP files are created on the local canonical branch:

```bash
supabase start
supabase db reset
supabase test db
supabase db lint
supabase migration list
```

Capture CLI version, migration filename, commit SHA, reset output, pgTAP output, lint output and the local migration list. Run Supabase advisors against the designated project only after confirming the project/environment and without applying DDL.

## 9. Release gates

M0001 is ready for PR review only when:
- all M1-001 through M1-024 assertions pass;
- migration replay succeeds from an empty local database;
- SQL has been reviewed for tenant-safe composite constraints and least privilege;
- the migration register and data dictionary reflect the actual SQL;
- the exact migration checksum and test evidence are attached to the PR.

Remote application requires a separate explicit approval, environment designation, preflight inspection, recovery plan and security review. This plan grants no such approval.

## 10. Current execution status

- Specification updated with approved owner decisions: complete.
- M0001 object boundary and sequencing documented: complete.
- Timestamped executable migration: not created; CLI-backed local generation unavailable in this session.
- pgTAP tests: specified, not created or run.
- Local replay/lint/advisors: not run.
- Remote Supabase DDL: not authorized; no changes made.


---

## 11. DEC-012-specific test assertions — superseding legacy membership tests

The M1-001–M1-024 suite above is interpreted using the DEC-012 object model. Where a legacy assertion's wording conflicts with this section, this section controls.

| Test ID | DEC-012 assertion | Expected result |
|---|---|---|
| M1-025 | `tenant_memberships` exists; `tenant_people` is not created as a parallel canonical table | Pass |
| M1-026 | `students.tenant_id` is NOT NULL and `students.person_id` is nullable | Catalog assertion passes |
| M1-027 | Student composite key `(tenant_id,id)` exists | Pass |
| M1-028 | No FK exists from students to tenant_memberships | Schema inspection passes |
| M1-029 | Student with NULL person_id can be inserted | Pass |
| M1-030 | Student with person_id but no tenant_memberships row can be inserted | Pass |
| M1-031 | `enrollments` exists with tenant-qualified FKs to students and batches | Pass |
| M1-032 | Enrollment valid interval rejects `valid_to <= valid_from` | Rejected |
| M1-033 | `academic_context_epochs` references enrollment by tenant-qualified FK | Pass |
| M1-034 | No independent `academic_context_epochs.batch_id` FK remains | Schema inspection passes |
| M1-035 | Multiple historical enrollments per student are retained | Pass |
| M1-036 | No one-active-enrollment unique index or overlap exclusion constraint exists before OPEN-010 closure | Schema inspection passes |
| M1-037 | Existing internal-only grants/RLS boundary remains unchanged | Privilege/catalog assertions pass |

The test suite must not assert whether concurrent active enrollments are permitted or rejected. That is RECON-004 / OPEN-010 and remains blocked pending Academic Owner approval.


## 5. DEC-013 Auth mapping assertions

Add the following acceptance assertions to the local pgTAP suite when it is authored:

| ID | Assertion | Expected |
|---|---|---|
| M1-038 | person_auth_identities has auth_user_id UUID NOT NULL UNIQUE | Pass |
| M1-039 | person_auth_identities has no provider or provider_subject columns | Schema inspection passes |
| M1-040 | Multiple Auth UUIDs may map to one person | Pass |
| M1-041 | One Auth UUID cannot map to two people | Unique constraint rejects |
| M1-042 | Revoked mapping retains its unique Auth UUID | Pass |
| M1-043 | A revoked Auth UUID cannot be reassigned to another person | Unique constraint rejects |
| M1-044 | person_id FK uses RESTRICT/NO ACTION semantics | Schema inspection passes |
| M1-045 | No FK to managed auth.users is created | Schema inspection passes |
| M1-046 | No client-facing grants or write policies are introduced | Internal-only boundary passes |

These are test specifications only; they have not been authored or executed.
