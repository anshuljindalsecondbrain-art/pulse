# PULSE Branch and Shared-Core Schema Reconciliation

**Document ID:** PULSE-GOV-RECON-001  
**Date:** 2026-11-07  
**Status:** Audit completed; integration and physical-schema decisions pending  
**Audited repository:** `anshuljindalsecondbrain-art/pulse`  
**Work branch:** `docs/system-a-database-governance`

## 1. Executive finding

M0001 SQL must not be generated against the current documentation branch as though it were the canonical integration base. GitHub branch comparison shows material divergence between the documentation workstream, the current `main` branch and the newer System A application branch.

The audit also found physical-model differences between the six owner-approved M0001 decisions and the newer canonical core model documents. The logical goals are mostly aligned (one shared identity, tenant-safe keys, separated membership/authorization, centres and batches), but the exact relational contract is not yet identical.

No PR was opened, no branch was merged, and no Supabase DDL was executed.

## 2. Branch comparison evidence

GitHub compare API results observed on 2026-11-07:

| Comparison (base → head) | Status | Ahead | Behind | Interpretation |
|---|---:|---:|---:|---|
| `main` → `docs/system-a-database-governance` | diverged | 335 | 44 | Large two-sided divergence; do not merge blindly |
| `docs/system-a-a2-model-reconciliation` → `docs/system-a-database-governance` | ahead | 46 | 0 | Database governance work is layered on the prior A2 docs base |
| `feat/system-a-abhyas-foundation` → `docs/system-a-database-governance` | diverged | 48 | 3 | Newer application branch has three commits not present in this docs branch |
| `main` → `feat/system-a-abhyas-foundation` | diverged | 290 | 44 | Application work is also not integrated into main |

The comparison file list shows the documentation branch adds extensive System A and governance material, while the application branch contains a working Student Tracking application/domain implementation and newer product/UI documents. The feature branch's three commits beyond the documentation branch add product-design/UI documentation. The repository search did not establish that the shared-core branch `feat/pulse-domain-core` has been integrated into either `main` or the System A application branch.

**Conclusion:** `main` remains the owner-approved eventual canonical integration branch, but the repository does not yet have a single reconciled integration history. A controlled integration plan is required before creating the executable migration.

## 3. Current canonical source documents inspected

On `feat/system-a-abhyas-foundation`:

- `docs/00_PROJECT_GOVERNANCE/PULSE_CANONICAL_DATABASE_SCHEMA_AND_MIGRATION_SPECIFICATION.md`
- `docs/00_PROJECT_GOVERNANCE/PULSE_CANONICAL_IDENTITY_TENANCY_AND_ACADEMIC_CORE_DATA_MODEL.md`
- `docs/00_PROJECT_GOVERNANCE/PULSE_CANONICAL_CORE_ERD_DATA_DICTIONARY_AND_AUTHORIZATION_MATRIX.md`
- `docs/00_PROJECT_GOVERNANCE/PULSE_PRODUCT_DECISION_CLOSURE_AND_SCHEMA_FREEZE_REGISTER.md`
- `docs/00_PROJECT_GOVERNANCE/PULSE_EXISTING_MIGRATION_RECONCILIATION_AND_DISPOSITION_MATRIX.md`
- `supabase/migrations/20261106000100_system_a_initial_schema.sql`
- `apps/student-tracking/src/lib/system-a-repository.ts`

These documents are design proposals and migration source material; their headers do not authorize migration execution. The System A initial migration remains proposed/unapplied and must not be applied unchanged.

## 4. Approved decisions that align across branches

| Approved decision | Newer canonical proposal | Reconciliation |
|---|---|---|
| OPEN-013: `main` is eventual canonical integration branch | Governance documents call for one canonical PULSE migration stream | Aligned in principle; branch histories still need controlled integration |
| OPEN-014: Auth UUID maps to canonical person through dedicated mapping | `person_auth_identities` with unique `auth_user_id` | Aligned; account lifecycle/provenance still needs implementation specification |
| OPEN-015: membership and role grant are separate | Newer model uses separate `tenant_memberships` and `tenant_role_grants` | Semantics aligned; physical membership table name differs |
| OPEN-017: tenant-owned centres and batches, same-tenant optional centre FK | Newer model includes tenant-owned `centres` and `batches` | Aligned in principle; attributes and lifecycle require detailed reconciliation |
| OPEN-029: internal-only foundation, no anon/authenticated grants or Data API exposure | Newer design requires RLS/grants and internal helpers to be separately governed | Compatible if no application exposure is introduced in M0001 |

## 5. Physical-schema conflicts requiring resolution

### 5.1 Membership table name and lifecycle

- The owner-approved OPEN-015 wording in the database governance branch names `tenant_people` as the tenant association table.
- The newer canonical core model and migration disposition matrix name the target `tenant_memberships`, evolving from `tenant_people`.
- Both models separate association from role grants, but the canonical table name, lifecycle fields and compatibility/migration mapping are not identical.

Do not create both tables as parallel authorities. Select one canonical target name and define the source-to-target mapping.

### 5.2 Student identity relationship

- The owner-approved OPEN-016 wording selects explicit `students.tenant_id` plus a composite FK to the tenant association (`tenant_people`).
- The newer canonical model defines students as tenant-owned academic identities with `tenant_id` and optional `person_id`; it does not require every student row to be a tenant member.
- The newer model explicitly allows a student profile to exist before learner login/person resolution. Tenant membership is a separate relationship.
- The System A application prototype currently has `sa_students.auth_user_id` and legacy institute-scoped student records; it must be mapped to canonical student identity and Auth mapping, not copied as a second identity authority.

This is a substantive cardinality/ownership difference, not just a column rename. A student record linked mandatorily to a tenant membership has different onboarding and lifecycle semantics from a tenant-owned student profile with optional person link.

### 5.3 Enrollment and academic context

- The M0001 implementation specification currently models `academic_context_epochs.batch_id` as a nullable direct FK to `batches`.
- The newer canonical model includes a separate `enrollments` entity linking student and batch over an effective interval; `academic_context_epochs` references enrollment.
- The newer product decision register D-001 records a product direction allowing multiple concurrent active enrollments, including across centres/programmes/sessions and institutes, but explicitly marks Academic Owner approval as pending and the decision BLOCKED.
- The earlier governance branch OPEN-010 is also still open. Therefore the concurrent-enrollment rule must not be marked fully approved from the product direction alone.
- A single-active-batch or single-active-context uniqueness constraint is prohibited unless the required academic decision is closed.

The correct M0001/M0002 boundary and whether `enrollments` belongs in the initial shared academic core must be settled before executable SQL.

### 5.4 Authorization sequencing

- OPEN-015 approved separation of membership and role grants.
- OPEN-029 approved internal-only M0001.
- The newer product decision register records hybrid RBAC + action permissions + resource scope as a product direction, while Security Owner approval remains pending.
- Do not add application-facing role grants, policies or RPCs to M0001. The internal-only identity foundation remains the current safe boundary.

## 6. Existing System A implementation impact

The newer application branch contains a frontend repository adapter and domain modules that currently refer to legacy `sa_institute_memberships`, `sa_students`, `institute_id`, and Auth user IDs as direct actor/student lookup keys. These are prototype contracts and cannot be assumed compatible with the canonical person/tenant model.

Before application integration, prepare an explicit adapter migration plan:

1. Resolve Supabase Auth UID to `person_auth_identities.person_id`.
2. Resolve tenant membership through the canonical association table.
3. Resolve student profile by tenant-qualified canonical student identity, not by client-supplied Auth UID as the student primary identity.
4. Preserve student identity where the learner has no login or is linked later.
5. Move application authorization to trusted server/database contracts; client filters remain UX only.
6. Keep student evidence append-only and preserve exact source/version/context references.

No application code was changed in this audit.

## 7. Recommended integration sequence

1. Close the student-to-person/membership relationship decision and membership table naming decision.
2. Obtain Academic Owner disposition for D-001 / OPEN-010 and settle the enrollment/context relationship.
3. Update the shared-core ERD, data dictionary, migration spec and System A repository adapter contract from the same approved model.
4. Create a clean integration branch from the current selected base; do not rebase/merge the 335/44-diverged branch without file-level review.
5. Port documentation in small, reviewed units; preserve application implementation and tests from the System A feature branch.
6. Inspect the full source migration set from `feat/pulse-domain-core` and the System A proposal; map every source object to canonical retain/extend/merge/split/defer/reject.
7. Only after the migration directory and CLI environment are available, create timestamped M0001 with `supabase migration new`, write SQL and pgTAP tests, then replay locally.
8. Open a draft PR for the reconciled branch; no merge or remote DDL until review gates pass.

## 8. Decisions still required before M0001 SQL

| ID | Question | Recommended direction | Why it blocks SQL |
|---|---|---|---|
| RECON-001 | Should canonical membership remain named `tenant_people`, or be renamed to `tenant_memberships`? | Prefer `tenant_memberships` as the lifecycle-explicit canonical name, with a documented migration from `tenant_people`; only if owner confirms it supersedes OPEN-015 wording | Prevents duplicate membership authorities and schema naming drift |
| RECON-002 | Should a student row require a tenant membership FK, or be tenant-owned independently with optional `person_id`? | Prefer tenant-owned `students(tenant_id,id)` with nullable `person_id`; membership is a separate person-to-tenant relationship | Supports students created before login/person resolution and separates academic identity from account membership |
| RECON-003 | Should academic context reference an explicit `enrollments` record rather than a batch directly? | Prefer `enrollments` as the effective-dated student-to-batch relationship and context epoch references enrollment | Preserves concurrent enrolments, batch transfers and history without inferring context from a single batch |
| RECON-004 | Is D-001 multiple concurrent enrollment policy approved by the Academic Owner? | Product direction already says allow; obtain explicit Academic Owner approval before adding any overlap rule | The canonical decision register still marks D-001 blocked |

These are owner/academic decisions, not implementation details to be guessed by the migration author.

## 9. Execution status

- Branch comparisons: completed.
- Current canonical proposal docs and System A application adapter inspected: completed.
- Reconciliation report: committed to documentation work branch.
- Executable M0001 SQL: not created.
- Local PostgreSQL replay and pgTAP: not run.
- Pull request: not opened.
- Branch merge: not performed.
- Supabase remote schema/data/grants/RLS: unchanged by this audit.
