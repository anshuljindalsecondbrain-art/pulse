# PULSE — Existing Migration Reconciliation and Disposition Matrix

- Document ID: PULSE-DATA-CORE-004
- Version: 0.1.0
- Status: Draft — source migration audit; application dependency audit and owner approval pending
- Date: 2026-11-06
- Reconciles: V10 migrations 0001/0002 and System A initial schema proposal
- Parent: `PULSE-DATA-CORE-001`, `PULSE-DATA-CORE-002`, `PULSE-DATA-CORE-003`
- Implementation authorization: Not granted
- Migration execution authorization: Not granted

## 1. Executive disposition

The V10 and System A proposals are not safe to apply together as written. They create overlapping canonical concepts with incompatible identity and tenancy semantics. System A also contains several relationships that are not tenant-qualified, while V10 has incomplete RLS coverage and broad member-read policies.

**Recommended target:** retain one shared platform identity/tenancy/academic core; retain System A operational records as module-owned tables; reconcile each field and relationship explicitly; then author a new unified migration lineage. Do not apply either initial migration unchanged and do not simply concatenate them.

This audit covers the complete source text of the three migration files listed in Section 2. It does not yet constitute a complete repository-wide dependency audit of all TypeScript imports, SQL queries, seed data, generated types, tests, deployment workflows or external consumers.

## 2. Source files and exact revisions inspected

| Source ID | Branch | Path | Blob SHA |
|---|---|---|---|
| SRC-V10-001 | `feat/pulse-v10-implementation` | `supabase/migrations/0001_identity_and_academic_context.sql` | `bd97679c6742462d31bf6443c493f0f5615ec0b8` |
| SRC-V10-002 | `feat/pulse-v10-implementation` | `supabase/migrations/0002_academic_core_events.sql` | `10c7daf39e7df72b441332c505433ad7c7718363` |
| SRC-SA-001 | `feat/system-a-abhyas-foundation` | `supabase/migrations/20261106000100_system_a_initial_schema.sql` | `7a3c46b7e8b5f9b0d19506d1bf9696107e0b6e3f` |

The System A migration header explicitly labels it PROPOSED / NOT APPLIED. The two V10 source files are proposals on the V10 branch. This document does not infer that any of these migrations has been applied to the live database.

## 3. Disposition vocabulary

| Disposition | Meaning |
|---|---|
| RETAIN | Keep the concept and substantially retain its responsibility; field/constraint changes may still be required |
| MERGE | Consolidate duplicate concepts into one canonical target |
| SPLIT | Separate concerns currently represented in one table or field set |
| REPLACE | Replace an unsafe or incompatible relationship/implementation with an approved target design |
| EXTEND | Retain concept but add missing fields, constraints or lifecycle semantics |
| DEFER | Keep out of the first canonical migration pending a product decision |
| REMOVE FROM TARGET | Do not include in the target schema; preserve any necessary data through an explicit mapping |
| REVIEW | Cannot decide without owner approval or source/application dependency evidence |

No disposition in this draft authorizes deletion or data loss.

## 4. Object-level disposition matrix

### 4.1 V10 migration 0001

| Existing object | Current semantics | Target disposition | Target object / action | Blocking issue |
|---|---|---|---|---|
| `pgcrypto` extension | UUID generation support | RETAIN / VERIFY | Existing approved extension | Check live extension/schema/version before creation |
| `public.tenants` | id, name, created_at | RETAIN + EXTEND | `tenants` | Add timezone, lifecycle status, updated_at; tenant profile policy |
| `public.people` | id, created_at | RETAIN + EXTEND | `people` | Add approved display fields; define PII/privacy policy |
| `public.tenant_people` | Tenant/person association with unique tenant/person | MERGE + SPLIT | `tenant_memberships` | Add lifecycle/effective dates; separate role grants |
| `public.students` | Student linked through tenant_person_id | MERGE + REPLACE FK | `students` | Add tenant_id and optional person_id; local code/name/status; tenant-qualified key |
| `public.academic_context_epochs` | Tenant/student/batch, JEE/NEET stream, XI/XII class, interval | RETAIN + EXTEND | `academic_context_epochs` | Remove hardcoded stream/class CHECK; tenant-qualified student/enrollment references; define dimensions |
| `idx_context_student_valid_from` | Student/time index | REPLACE | `(tenant_id, student_id, valid_from DESC)` candidate | New tenant-qualified access path |
| `idx_context_tenant` | Tenant index | RETAIN / REVIEW | Tenant index | Validate query workload and redundancy |

### 4.2 V10 migration 0002

| Existing object | Current semantics | Target disposition | Target object / action | Blocking issue |
|---|---|---|---|---|
| `public.batches` | Tenant-owned; JEE/NEET + XI/XII constrained | RETAIN + EXTEND | `batches` | Remove universal exam/class CHECK; add optional centre; configurable programme/context; composite key |
| `public.enrollments` | Tenant, student, batch and effective dates | RETAIN + REPLACE FKs | `enrollments` | Independent FKs permit cross-tenant references; use composite tenant FKs |
| `idx_enrollments_student_time` | Student/time index | REPLACE | `(tenant_id, student_id, valid_from DESC)` | Tenant-qualified query path |
| `idx_enrollments_tenant_batch` | Tenant/batch index | RETAIN / REVIEW | `(tenant_id,batch_id)` | Keep if query plans justify |
| `public.person_auth_identities` | person_id PK; unique auth_user_id | RETAIN + EXTEND | `person_auth_identities` | Add identity lifecycle, provider kind, provenance; decide account-linking cardinality |
| `public.tenant_roles` | Tenant/person/role/effective dates | SPLIT + REPLACE | `tenant_memberships` + `tenant_role_grants` | Membership and permission are conflated; no FK to membership; no centre scope |
| `idx_tenant_roles_auth_scope` | Tenant/person/role | REPLACE | Role-grant index by tenant/membership/role/effective date | Depends on membership split |
| `public.domain_events` | Generic event envelope, versioning, causation, idempotency, payload | RETAIN + EXTEND | `domain_events` | Preserve useful event fields; define actor FK semantics, event naming/schema registry, retention |
| `idx_domain_events_aggregate` | Tenant/aggregate/time | RETAIN | Same logical index | Confirm event query order |
| `idx_domain_events_type_time` | Tenant/type/time | RETAIN | Same logical index | Confirm event query order |
| RLS on tenants | Enabled | REPLACE | Explicit approved tenant policies | Current member-read policy is broader than resource scope |
| RLS on tenant_people | Enabled | MERGE | RLS on tenant_memberships | Current model superseded |
| RLS on students | Enabled | REPLACE | Own/linked/assigned student predicates | Current policy derives tenant through tenant_people and does not model granular roles |
| RLS on batches | Enabled | REPLACE | Role + centre/batch scope | Any tenant member can read all tenant batches |
| RLS on enrollments | Enabled | REPLACE | Role + student/batch scope | Any tenant member can read all tenant enrollments |
| RLS on academic_context_epochs | Enabled | REPLACE | Role + learner scope | Any tenant member can read all tenant context |
| RLS on tenant_roles | Enabled | REPLACE | Restricted role administration/read policy | Any tenant member can read all role assignments |
| RLS on domain_events | Enabled | REPLACE | Event-type/resource-specific read policy | Generic event payload may contain sensitive data |
| `current_person_id()` | SECURITY DEFINER lookup by auth.uid() | REPLACE / SECURITY REVIEW | Internal identity resolver | Fixed search path and owner/grants/caller behavior require review; function in exposed public schema |
| `is_tenant_member(uuid)` | SECURITY DEFINER membership existence | REPLACE / SECURITY REVIEW | Internal membership + authorization helpers | Membership-only predicate is insufficient for resource/action authorization; review function grants and search path |
| `tenant_member_read` policies | SELECT to any tenant member | REMOVE FROM TARGET | Explicit role/resource policies | Too broad for student/parent/teacher/reviewer separation |
| No write policies | No direct writes | RETAIN AS PRINCIPLE | Command/RPC-controlled writes or approved table policies | Must specify actual command authorization and grants |
| Missing RLS on `people` | No RLS in migration | REPLACE | RLS or non-exposed schema / carefully restricted access | Identity directory is not protected by this migration |
| Missing RLS on `person_auth_identities` | No RLS in migration | REPLACE | Restricted identity-link access | Auth mapping must not be publicly enumerable |

### 4.3 System A initial migration

| Existing object | Current semantics | Target disposition | Target object / action | Blocking issue |
|---|---|---|---|---|
| `app_private` schema | Internal helper schema, public/anon/auth revoked | RETAIN | `app_private` | Verify ownership and future function grants |
| `sa_membership_status` | ACTIVE/INACTIVE | REVIEW / REPLACE | Enrollment lifecycle or membership status | Clarify whether this enum is batch enrollment status; current values do not cover transfer/withdrawal/completion |
| `sa_exercise_status` | DRAFT/PUBLISHED/ARCHIVED | RETAIN / REVIEW | Exercise lifecycle | Ensure status transitions and version publication semantics align |
| `sa_assignment_status` | Draft/review/approved/scheduled/published/cancelled/archived | RETAIN / REVIEW | Assignment lifecycle | Approver separation and transition rules require workflow contract |
| `sa_work_status` | Not started/attempted/submitted/completed/skipped | RETAIN | Evidence work status | Preserve distinct event semantics; do not collapse answer outcome |
| `sa_answer_outcome` | Not evaluated/correct/incorrect/partial/not applicable | RETAIN | Evidence answer outcome | Define whether outcome is student-reported or reviewer/system evaluated |
| `sa_doubt_status` | Doubt lifecycle states | RETAIN | Doubt workflow | Add transition/event semantics |
| `sa_verification_outcome` | Confirmed/returned/rejected | RETAIN | Verification decision | Keep immutable decision history |
| `sa_correction_status` | Required/in progress/resubmitted/accepted/closed/rejected | RETAIN | Correction cycle | Define relation to source decision and resubmitted evidence |
| `sa_institutes` | Duplicate institute/tenant identity | MERGE | `tenants` | No parallel institute table in canonical target |
| `sa_centres` | Institute-scoped centre | MERGE | `centres` | Map institute_id to tenant_id; preserve tenant-qualified key |
| `sa_institute_memberships` | Auth user + role + optional centre in one row | SPLIT + REPLACE | `tenant_memberships`, `tenant_role_grants`, `person_auth_identities` | Direct auth.users reference bypasses canonical person identity; membership and role combined |
| `sa_students` | Institute-specific student, optional auth_user_id | MERGE + REPLACE | `students` + person/auth identity link | Map auth user through person identity; retain student code and full name; define multiple profile policy |
| `sa_parent_student_links` | Auth parent user to tenant student, validity interval | MERGE + REPLACE | `parent_student_links` | Resolve parent Auth user to person; add verification state/provenance; preserve time bounds |
| `sa_subjects` | Nullable institute_id, code/name | DEFER / REVIEW | Separate global catalogue + tenant extension only if approved | Nullable tenant key and UNIQUE semantics allow multiple NULL-tenant duplicate codes; global-vs-tenant ownership unresolved |
| `sa_chapters` | Institute, subject FK, name/code | REMOVE FROM SYSTEM A CORE / REVIEW | DTE-owned classification only if mapped to approved taxonomy | System A must not require chapter hierarchy; subject FK is not tenant-qualified; no tenant-qualified subject ownership proof |
| `sa_batches` | Institute/optional centre/name/year | MERGE | `batches` | Map institute to tenant; preserve centre/year; use shared enrollment |
| `sa_batch_memberships` | Batch/student temporal membership | MERGE | `enrollments` | Existing partial unique index permits only one current active batch per student/institute; conflicts with unresolved concurrent enrollment policy |
| `sa_batch_memberships_one_current` | One active open-ended membership per student/institute | REMOVE FROM TARGET pending decision | Approved enrollment overlap constraint | Current rule is a product assumption, not yet approved |
| `sa_exercises` | Tenant-owned exercise identity/status/current version | RETAIN + RENAME | `sa_exercises` | Replace institute_id with tenant_id; keep module ownership |
| `sa_exercise_versions` | Immutable-ish version content and publication timestamp | RETAIN + EXTEND | `sa_exercise_versions` | Subject FK is not tenant-qualified; define publication immutability and current_version consistency |
| `sa_exercise_slots` | Slot number, optional chapter and QBMS question refs | RETAIN + REPLACE FKs | `sa_exercise_slots` | Chapter FK not tenant-qualified; external QBMS IDs have no FK/namespace contract; preserve optional references |
| `sa_assignments` | Assignment identity/status/current version | RETAIN + RENAME | `sa_assignments` | Replace institute_id with tenant_id |
| `sa_assignment_versions` | Assignment content, timing, creator/approver | RETAIN + EXTEND | `sa_assignment_versions` | Auth actor IDs not mapped to canonical person; define immutable publication and approval workflow |
| `sa_assignment_items` | Assignment version selects exercise version | RETAIN + REPLACE FKs | `sa_assignment_items` | Missing unique (tenant_id,id); no slot-level selection; cross-tenant direct FK through item ID not guarded in downstream obligation |
| `sa_assignment_targets` | Batch or individual student target | RETAIN + EXTEND | `sa_assignment_targets` | Composite FKs exist for batch/student; add uniqueness/idempotency and targeting lifecycle |
| `sa_student_obligations` | Per-student work obligation | RETAIN + REPLACE FKs | `sa_student_obligations` | Plain FK to assignment_items(id) lacks tenant qualification; unique key omits institute_id; ensure item belongs to referenced assignment version and slot belongs to selected exercise version |
| `sa_attempt_cycles` | Attempt grouping per obligation | RETAIN + EXTEND | `sa_attempt_cycles` | Actor is Auth UUID; resolve to canonical person; enforce tenant-qualified relationships |
| `sa_evidence_events` | Append-only report/observation/import evidence | RETAIN + EXTEND | `sa_evidence_events` | Good event separation; actor role is caller-supplied text; require trusted actor resolution and role snapshot provenance; causation FK not tenant-qualified |
| `sa_verification_decisions` | Append-only evidence decision | RETAIN + EXTEND | `sa_verification_decisions` | Actor Auth UUID; ensure separation of duties and one decision/revision policy; composite evidence FK exists |
| `sa_correction_cycles` | Correction cycle sourced from verification decision | RETAIN + EXTEND | `sa_correction_cycles` | Composite FKs exist; define resubmission evidence links and state transitions |
| `sa_doubt_cases` | Doubt case, assignee, priority and status | RETAIN + EXTEND | `sa_doubt_cases` | Auth actor IDs; define access/assignment scope and tenant-qualified identity provenance |
| `sa_doubt_events` | Doubt history | RETAIN + EXTEND | `sa_doubt_events` | Composite doubt FK exists; append-only protection absent in source migration |
| `sa_audit_events` | Module audit metadata | MERGE / SPLIT REVIEW | Platform `audit_events` plus module detail if required | Avoid duplicate audit trails; decide tenant-null platform events and actor model |
| `sa_metric_policy_versions` | Versioned institute metric policy JSON | RETAIN + EXTEND | `sa_metric_policy_versions` | Define policy schema/version validation, effective interval uniqueness, tenant policy authority |
| System A index set | Access-path indexes | RECONCILE | Recreate on final canonical columns | Several indexes omit tenant_id or rely on current table names; validate with query plans |
| Dynamic RLS DO block | Enables + forces RLS on sa_* tables; revokes anon/authenticated | RETAIN AS FAIL-CLOSED BASELINE | RLS + grants after policies approved | Correctly denies access by default; application cannot work until policies/RPC grants are added |
| `reject_sa_event_mutation()` | Rejects UPDATE/DELETE | RETAIN + HARDEN | Internal append-only trigger function | Validate function owner/search path/grants; add explicit retention/privileged recovery procedure |
| Evidence immutable trigger | Blocks UPDATE/DELETE | RETAIN | Append-only evidence | Ensure authorized correction is represented as a new event |
| Verification immutable trigger | Blocks UPDATE/DELETE | RETAIN | Append-only decision | Preserve multiple decisions as history |
| Audit immutable trigger | Blocks UPDATE/DELETE | RETAIN | Append-only audit | Align with platform audit ownership |

## 5. Cross-cutting field and relationship reconciliation

| Concern | V10 | System A | Canonical target |
|---|---|---|---|
| Tenant identifier | `tenant_id` | `institute_id` | `tenant_id` |
| Person identity | `people.id` | Direct `auth.users.id` in many actor columns | Global `people.id` |
| Auth link | `person_auth_identities` | Auth IDs on membership/student/parent/actor | One canonical `person_auth_identities` mapping |
| Tenant association | `tenant_people` | `sa_institute_memberships` | `tenant_memberships` |
| Role authorization | `tenant_roles` | Role embedded in membership row | `tenant_role_grants` |
| Student identity | `students.tenant_person_id` | `sa_students` | `students(tenant_id, person_id?)` |
| Parent relation | Not modeled | Auth-user to student | Person-to-student verified temporal link |
| Centre | Not modeled | `sa_centres` | `centres` |
| Batch | `batches` | `sa_batches` | `batches` |
| Batch membership | `enrollments` | `sa_batch_memberships` | `enrollments` |
| Academic context | JEE/NEET + XI/XII | Academic year on batch | Configurable, effective-dated `academic_context_epochs` |
| Event envelope | `domain_events` | Module evidence/doubt/verification events | Keep generic platform events separate from typed academic evidence |
| Audit | Not defined | `sa_audit_events` | Platform audit contract plus module detail only if justified |
| RLS | Partial, broad member-read | Forced RLS, no policies/grants | Explicit role/scope policies and minimum grants |

## 6. Blocking defects and design risks

### 6.1 V10

1. `students` has no direct `tenant_id`; tenant is derived through `tenant_people`.
2. `academic_context_epochs` has independent tenant and student FKs, so a row can pair a tenant with another tenant's student.
3. `enrollments` has independent tenant, student and batch FKs; cross-tenant combinations are not prevented by the schema.
4. `tenant_roles` references person and tenant independently, not a membership record.
5. `people` and `person_auth_identities` are not RLS-enabled by these migrations.
6. Broad tenant-member SELECT policies expose all rows in that tenant, without student/parent/teacher/centre resource scope.
7. SECURITY DEFINER helpers require full owner, execute-grant, fixed-search-path and privilege analysis.
8. No write policies are present; application mutation contract remains unspecified.

### 6.2 System A

1. Duplicate canonical institute/person/membership/student/batch/enrollment concepts conflict with V10.
2. Several actor references point directly to `auth.users`, bypassing canonical person identity and tenant membership.
3. `sa_subjects.institute_id` is nullable while unique constraint is `(institute_id,code)`; NULL values do not enforce one global code.
4. `sa_chapters.subject_id` and `sa_exercise_versions.subject_id` are not tenant-qualified.
5. `sa_exercise_slots.chapter_id` has a plain FK and cannot prove tenant ownership.
6. `sa_student_obligations.assignment_item_id` uses a plain FK; downstream tenant consistency is not proven.
7. `sa_assignment_items` lacks a declared `UNIQUE(institute_id,id)` candidate key for tenant-qualified references.
8. Obligation uniqueness omits institute_id; global IDs make collisions unlikely, but tenant-scoped constraint semantics should be explicit.
9. The obligation model does not explicitly prove that its exercise slot belongs to the exercise version selected by the assignment item.
10. Evidence `source_actor_role` is free text and could be client-supplied; it must not become authorization evidence.
11. Evidence `causation_event_id` is a plain FK without institute qualification.
12. Doubt events have no append-only trigger in the migration.
13. The one-current-batch partial unique index encodes an unresolved academic policy.
14. Forced RLS with no policies and revoked authenticated grants is fail-closed, but the current app cannot use these tables until the approved access path is implemented.
15. `sa_audit_events` duplicates the proposed platform audit responsibility unless the boundary is explicitly defined.

## 7. Required target corrections before SQL generation

- [ ] Canonicalize institute_id → tenant_id in module-owned tables.
- [ ] Replace direct Auth user actor references with trusted person identity references where the business actor is a person; preserve Auth UUID only as authentication provenance where required.
- [ ] Add tenant-qualified unique keys and composite FKs for every tenant-owned parent relationship.
- [ ] Split membership association from role grants.
- [ ] Make centre, student, batch and enrollment references tenant-qualified.
- [ ] Remove JEE/NEET and XI/XII as universal database CHECK constraints.
- [ ] Decide subject/catalogue ownership and DTE boundary before retaining subject/chapter tables in System A.
- [ ] Define exercise-slot selection semantics in assignment items.
- [ ] Add composite FK from obligation to assignment item and verify assignment-version consistency.
- [ ] Add relational constraint proving obligation slot belongs to the selected exercise version.
- [ ] Define actor provenance for evidence, verification, corrections and doubt events.
- [ ] Decide generic platform event vs typed module event boundaries.
- [ ] Define append-only protection for all evidence, decision, doubt and audit histories.
- [ ] Replace broad V10 member-read policies with resource and role-scoped policies.
- [ ] Define explicit grants and RPC/table command contracts before application integration.
- [ ] Resolve all open decisions in CORE-DEC-001 through CORE-DEC-010.

## 8. Data migration and identifier preservation plan

No existing production data was observed in the earlier live audit, but this must be rechecked at implementation time. If any environment contains rows:

1. Snapshot all source tables and record row counts.
2. Preserve every source primary key where target key type and identity semantics permit.
3. Create deterministic source-to-target ID maps where identities must be consolidated.
4. Map each `sa_institutes.id` to one canonical `tenants.id`; never merge tenants by name alone.
5. Map Auth users through `person_auth_identities`; resolve duplicate or missing person mappings explicitly.
6. Map `sa_students` and V10 `students` only after identity equivalence is verified; never infer equivalence from name alone.
7. Map V10 `tenant_people` and System A memberships into canonical memberships plus role grants, preserving source provenance and effective dates.
8. Map `sa_batch_memberships` and V10 `enrollments` into one enrollment history without dropping transfer records.
9. Preserve exercise/assignment/version/slot/obligation/evidence/verification/correction/doubt IDs and lineage.
10. Quarantine ambiguous, conflicting or orphaned rows; do not silently discard or auto-resolve.
11. Validate row counts, referential integrity, tenant consistency, idempotency and historical evidence before switching application reads.
12. Retain a reversible mapping ledger until acceptance and retention policy permit its disposal.

## 9. Work still required — not covered by this migration-only audit

The following repository-level checks remain mandatory before a unified migration can be approved:
- Search all app source for direct references to V10 and System A table/column names.
- Inspect `system-a-repository.ts`, Supabase client initialization, localStorage adapters and all data hooks.
- Inspect generated database types and SQL type definitions.
- Inspect tests, fixtures, seed files, scripts and edge functions.
- Inspect RPC/function calls and any direct PostgREST table access.
- Inspect Vercel environment variable scopes and deployment root/branch behavior.
- Confirm current PR heads and branch contents before selecting implementation lineage.
- Re-audit live Supabase tables, migration history, extensions, grants, policies and storage.
- Confirm whether any environment other than the audited Supabase project has received these migrations.

Until these checks are complete, this matrix must not be treated as a complete application migration plan.

## 10. Recommended next engineering sequence

1. Complete repository-wide dependency inventory for all table and field references.
2. Resolve product decisions for identity, roles, concurrent enrollments, subjects/catalogue ownership and parent verification.
3. Produce a corrected canonical target ERD and field dictionary incorporating this matrix.
4. Create an isolated disposable Supabase project or local PostgreSQL test environment.
5. Author one new unified migration sequence with explicit source-to-target mapping.
6. Test migration replay, tenant isolation, RLS, grants, append-only evidence, and System A application repository behavior.
7. Obtain explicit approval before applying any migration to the live PULSE project.

**Disposition:** This document is a source-migration reconciliation draft. It does not authorize SQL generation, data movement, schema changes, branch merges, PR merges or deployment changes.
