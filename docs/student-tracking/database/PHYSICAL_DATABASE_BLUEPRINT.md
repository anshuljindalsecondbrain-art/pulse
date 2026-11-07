# System A — Physical Database Blueprint (PDB)

**Document ID:** STS-DB-PDB-001  
**Version:** 1.0.0  
**Status:** Detailed physical proposal — not approved for DDL execution  
**Date:** 2026-11-07  
**Architecture decision:** DEC-011 — shared PULSE identity frozen as System A's permanent identity source of truth  
**Scope:** Shared-core extensions + System A operational schema

> This is a physical design proposal with explicit approval gates. It is not a migration and does not claim that any listed table exists in Supabase. Existing shared-core columns are separated from proposed additions. The uploaded System A specification is the product source: teachers select existing questions from offline modules; System A tracks assignment and student work, and does not own canonical question content or deep taxonomy.

## 1. Physical design rules

1. PostgreSQL UUID primary keys for new PULSE/System A entities, matching the existing shared-core UUID keys.
2. `timestamptz` for event and effective timestamps; use UTC instants and retain an IANA timezone identifier where local scheduling matters.
3. `numeric(8,2)` for marks/score values; never use floating point for academic marks.
4. `jsonb` only for bounded metadata or immutable source snapshots, never for relational lists that need FKs.
5. `tenant_id` is required on tenant-owned System A aggregates and event rows.
6. Use composite unique keys and composite FKs to prevent cross-tenant relationships.
7. Business actor references use `people.id`, not raw Supabase Auth UIDs.
8. Source evidence and decisions are append-only. Current state is a projection or a controlled aggregate transition.
9. Published assignment versions are immutable.
10. No hard-delete cascade from a student, batch, assignment or source item into academic evidence.
11. Offline module references are supported from day one. QBMS question identity/version and DTE enrichment are optional future references.
12. No DTE taxonomy tables are owned by System A.

## 2. Existing shared-core physical baseline

Verified in `feat/pulse-domain-core` migration `0001_identity_and_academic_context.sql`:

| Table | Existing columns | Existing keys |
|---|---|---|
| `public.tenants` | `id uuid not null default gen_random_uuid()`, `name text not null`, `created_at timestamptz not null default now()` | PK `id` |
| `public.people` | `id uuid not null default gen_random_uuid()`, `created_at timestamptz not null default now()` | PK `id` |
| `public.tenant_people` | `id uuid not null default gen_random_uuid()`, `tenant_id uuid not null`, `person_id uuid not null`, `created_at timestamptz not null default now()` | PK `id`; FK tenant/person; unique `(tenant_id, person_id)` |
| `public.students` | `id uuid not null default gen_random_uuid()`, `tenant_person_id uuid not null`, `created_at timestamptz not null default now()` | PK `id`; FK `tenant_person_id → tenant_people.id` |
| `public.academic_context_epochs` | `id uuid not null default gen_random_uuid()`, `tenant_id uuid not null`, `student_id uuid not null`, `batch_id uuid null`, `stream text not null`, `class_level text not null`, `valid_from timestamptz not null`, `valid_to timestamptz null`, `reason text null`, `created_at timestamptz not null default now()` | PK `id`; FK tenant; FK student; check stream in JEE/NEET; check class XI/XII; check valid_to > valid_from |

The migration has no production RLS policies and states that application-specific constraints must be added before tenant data is exposed. It has no Auth identity mapping, role-grant table, centres table, batches table or teacher assignment table. `academic_context_epochs.batch_id` currently has no FK to a batch table.

## 3. Shared-core extensions — PULSE-owned

These tables/changes belong to the shared platform and must be coordinated with other PULSE modules.

### 3.1 `person_auth_identities`

| Column | PostgreSQL type | Null | Default / constraint | Meaning |
|---|---|---:|---|---|
| id | uuid | No | gen_random_uuid(), PK | Identity mapping row |
| person_id | uuid | No | FK people(id) | Canonical person |
| auth_user_id | uuid | No | UNIQUE | Supabase Auth principal ID |
| provider | text | No | CHECK non-empty | Auth provider identifier |
| provider_subject | text | No | UNIQUE(provider, provider_subject) | Provider subject when external identity is used |
| is_primary | boolean | No | false | Preferred login identity |
| verified_at | timestamptz | Yes | — | Verification timestamp |
| valid_from | timestamptz | No | now() | Mapping start |
| valid_to | timestamptz | Yes | — | Revocation/end |
| created_at | timestamptz | No | now() | Audit timestamp |

**Rules:** unique Auth user ID; provider + subject unique; valid_to > valid_from; do not use user-editable Auth metadata for authorization. The exact provider/subject representation needs platform owner review because Supabase Auth's user UUID is the stable local principal.

### 3.2 `tenant_role_grants`

| Column | Type | Null | Default / constraint | Meaning |
|---|---|---:|---|---|
| id | uuid | No | gen_random_uuid(), PK | Grant identity |
| tenant_id | uuid | No | FK tenants | Tenant |
| person_id | uuid | No | FK people | Grantee |
| role_code | text | No | CHECK non-empty | Role identifier |
| scope_type | text | No | CHECK controlled vocabulary | TENANT/CENTRE/BATCH/SUBJECT/STUDENT |
| scope_id | uuid | Yes | Null only for tenant scope | Scoped resource |
| granted_by_person_id | uuid | No | FK people | Grantor |
| valid_from | timestamptz | No | now() | Start |
| valid_to | timestamptz | Yes | — | End/revocation |
| revoked_at | timestamptz | Yes | — | Revocation timestamp |
| reason | text | Yes | — | Grant rationale |
| created_at | timestamptz | No | now() | Created |

**Rules:** role grants are not tenant membership. A grant requires matching `tenant_people(tenant_id,person_id)`; enforce by composite FK. Scope resource must belong to the same tenant through a trusted validation/normalized scope table. Do not store arbitrary role arrays on client profiles.

### 3.3 `centres`

| Column | Type | Null | Default / constraint | Meaning |
|---|---|---:|---|---|
| id | uuid | No | gen_random_uuid(), PK | Centre |
| tenant_id | uuid | No | FK tenants | Owner |
| code | text | No | normalized unique per tenant | Centre code |
| name | text | No | CHECK trim non-empty | Display name |
| status | text | No | 'ACTIVE'; ACTIVE/INACTIVE/ARCHIVED | Lifecycle |
| created_at | timestamptz | No | now() | Created |
| updated_at | timestamptz | No | now() | Updated |

Unique `(tenant_id,id)`, `(tenant_id, lower(code))` via unique index. Archive rather than delete.

### 3.4 `batches`

| Column | Type | Null | Default / constraint | Meaning |
|---|---|---:|---|---|
| id | uuid | No | gen_random_uuid(), PK | Batch |
| tenant_id | uuid | No | FK tenants | Owner |
| centre_id | uuid | Yes | same-tenant FK centres | Centre |
| academic_year | text | No | — | Academic year/session code |
| code | text | No | normalized unique per tenant/year | Batch code |
| name | text | No | CHECK trim non-empty | Display name |
| class_level | text | Yes | controlled academic code | XI/XII or configured |
| stream | text | Yes | controlled academic code | JEE/NEET/COMMON/etc. |
| status | text | No | 'ACTIVE' | Lifecycle |
| created_at | timestamptz | No | now() | Created |
| updated_at | timestamptz | No | now() | Updated |

Unique `(tenant_id,id)`, `(tenant_id,academic_year,code)`. Centre must be same tenant. Catalogue policy for class/stream codes is pending.

### 3.5 Shared academic-context constraints and enrolment

The current `academic_context_epochs` is retained as the historical effective-dated student academic context. Required additions:
- FK `(tenant_id,batch_id) → batches(tenant_id,id)`.
- Composite tenant-safe student relationship.
- Check `valid_to IS NULL OR valid_to > valid_from` already exists.
- Define overlap/concurrency policy before adding an exclusion constraint.
- Do not put teacher ID arrays in the epoch row.

### 3.6 `teaching_assignments`

| Column | Type | Null | Default / constraint | Meaning |
|---|---|---:|---|---|
| id | uuid | No | gen_random_uuid(), PK | Teaching assignment |
| tenant_id | uuid | No | FK tenants | Tenant |
| person_id | uuid | No | canonical teacher person | Teacher/staff |
| centre_id | uuid | Yes | same-tenant FK | Centre scope |
| batch_id | uuid | Yes | same-tenant FK | Batch scope |
| subject_code | text | Yes | catalogue reference pending | Subject scope |
| responsibility | text | No | TEACHING/VERIFYING/COORDINATING | Responsibility |
| valid_from | timestamptz | No | now() | Start |
| valid_to | timestamptz | Yes | — | End |
| granted_by_person_id | uuid | No | canonical person | Grantor |
| created_at | timestamptz | No | now() | Created |

At least one resource scope (centre, batch or subject combination) must be present. Capability comes from role grant; teaching assignment supplies academic resource scope. Exact role/scope semantics remain owner-approved work.

### 3.7 `parent_student_relationships`

| Column | Type | Null | Default / constraint | Meaning |
|---|---|---:|---|---|
| id | uuid | No | gen_random_uuid(), PK | Relationship |
| tenant_id | uuid | No | FK tenants | Tenant |
| parent_person_id | uuid | No | FK people | Parent/guardian |
| student_id | uuid | No | same-tenant FK students | Student |
| relationship_code | text | No | controlled vocabulary | Parent/guardian relation |
| status | text | No | PENDING | PENDING/VERIFIED/REVOKED |
| verified_by_person_id | uuid | Yes | FK people | Verifier |
| verified_at | timestamptz | Yes | — | Verification |
| valid_from | timestamptz | No | now() | Start |
| valid_to | timestamptz | Yes | — | End |
| created_at | timestamptz | No | now() | Created |

Unique active relationship semantics and consent/verification evidence require privacy/product approval. Parent reads remain read-only and field-minimized.

## 4. System A — source and assignment domain

### 4.1 `sa_source_catalogs`

Represents a source publisher/catalogue, not question ownership.

| Column | Type | Null | Default / constraint | Meaning |
|---|---|---:|---|---|
| id | uuid | No | gen_random_uuid(), PK | Source catalogue |
| tenant_id | uuid | No | FK tenants | Tenant using this source |
| source_kind | text | No | OFFLINE_MODULE/QBMS/OTHER | Source type |
| source_code | text | No | — | Stable external source code |
| display_name | text | No | — | Module/book/source name |
| publisher | text | Yes | — | Publisher/institute |
| status | text | No | ACTIVE | Lifecycle |
| created_by_person_id | uuid | No | tenant person FK | Registering actor |
| created_at | timestamptz | No | now() | Created |
| metadata | jsonb | No | '{}' | Non-relational source metadata |

Unique `(tenant_id,source_kind,source_code)`. No question text authoring or taxonomy hierarchy is stored here.

### 4.2 `sa_source_editions`

| Column | Type | Null | Default / constraint | Meaning |
|---|---|---:|---|---|
| id | uuid | No | gen_random_uuid(), PK | Edition |
| tenant_id | uuid | No | — | Tenant boundary |
| source_catalog_id | uuid | No | same-tenant FK | Source |
| edition_code | text | No | — | Edition/version identifier |
| edition_label | text | Yes | — | Human label |
| published_year | smallint | Yes | CHECK reasonable range | Edition year |
| content_fingerprint | text | Yes | — | Optional source fingerprint |
| created_at | timestamptz | No | now() | Created |

Unique `(tenant_id,source_catalog_id,edition_code)`. If the publisher does not identify editions, a local stable edition code is required.

### 4.3 `sa_source_questions`

A stable System A reference to an existing question in a source. It is not a duplicate canonical QBMS question.

| Column | Type | Null | Default / constraint | Meaning |
|---|---|---:|---|---|
| id | uuid | No | gen_random_uuid(), PK | Local source reference |
| tenant_id | uuid | No | — | Tenant |
| source_edition_id | uuid | No | same-tenant FK | Edition |
| source_locator | text | No | — | Printed/module question locator, e.g. exercise + Q number |
| display_label | text | Yes | — | UI label |
| subject_code | text | Yes | — | Optional shared catalogue code |
| chapter_code | text | Yes | — | Optional existing chapter reference |
| question_type_code | text | Yes | — | Optional source metadata |
| max_marks | numeric(8,2) | Yes | CHECK >= 0 | Optional marks snapshot |
| source_metadata | jsonb | No | '{}' | Bounded source metadata, not canonical content |
| availability_state | text | No | AVAILABLE | AVAILABLE/RETIRED/UNRESOLVED |
| created_by_person_id | uuid | No | tenant person FK | Registering actor |
| created_at | timestamptz | No | now() | Created |

Unique `(tenant_id,source_edition_id,source_locator)`. Add optional external QBMS identity/version mapping only after its API/key contract is approved. Do not store question body/options/solution as authoritative content.

### 4.4 `sa_assignments`

| Column | Type | Null | Default / constraint | Meaning |
|---|---|---:|---|---|
| id | uuid | No | gen_random_uuid(), PK | Stable assignment |
| tenant_id | uuid | No | FK tenants | Owner |
| assignment_code | text | Yes | tenant-unique if supplied | Human code |
| title | text | No | — | Assignment title |
| assignment_kind | text | No | DPP/HOMEWORK/PRACTICE/REVISION/TEST/OTHER | Work type |
| status | text | No | DRAFT | Aggregate lifecycle |
| created_by_person_id | uuid | No | tenant person FK | Author |
| current_version_id | uuid | Yes | FK version, deferred constraint | Current published/draft pointer |
| created_at | timestamptz | No | now() | Created |
| updated_at | timestamptz | No | now() | Updated |

Unique `(tenant_id,id)`. Current version must belong to same assignment and tenant; enforce with composite FK or deferred validation trigger.

### 4.5 `sa_assignment_versions`

| Column | Type | Null | Default / constraint | Meaning |
|---|---|---:|---|---|
| id | uuid | No | gen_random_uuid(), PK | Version |
| tenant_id | uuid | No | — | Tenant |
| assignment_id | uuid | No | same-tenant FK | Aggregate |
| version_no | integer | No | CHECK > 0 | Monotonic version |
| publication_state | text | No | DRAFT | DRAFT/IN_REVIEW/APPROVED/SCHEDULED/PUBLISHED/SUPERSEDED/WITHDRAWN |
| instructions | text | Yes | — | Student instructions |
| release_at | timestamptz | Yes | — | Release instant |
| due_at | timestamptz | Yes | — | Due instant |
| timezone_name | text | No | — | IANA timezone snapshot |
| approval_required | boolean | No | true | Policy snapshot |
| authored_by_person_id | uuid | No | tenant person FK | Author |
| approved_by_person_id | uuid | Yes | tenant person FK | Approver |
| approved_at | timestamptz | Yes | — | Approval |
| published_by_person_id | uuid | Yes | tenant person FK | Publisher |
| published_at | timestamptz | Yes | — | Publication |
| content_hash | text | Yes | — | Immutable version fingerprint |
| created_at | timestamptz | No | now() | Created |

Unique `(tenant_id,assignment_id,version_no)`. Published versions immutable. Author cannot approve own version if independent approval is required. Approval workflow is source-recommended mandatory but final configurability needs explicit decision.

### 4.6 `sa_assignment_items`

Each row is one question selected into a specific assignment version.

| Column | Type | Null | Default / constraint | Meaning |
|---|---|---:|---|---|
| id | uuid | No | gen_random_uuid(), PK | Assignment item |
| tenant_id | uuid | No | — | Tenant |
| assignment_version_id | uuid | No | same-tenant FK | Version |
| source_question_id | uuid | No | same-tenant FK | Selected source question |
| sequence_no | integer | No | CHECK > 0 | Display order |
| display_label_snapshot | text | Yes | — | Printed locator snapshot |
| max_marks_snapshot | numeric(8,2) | Yes | CHECK >= 0 | Marks at assignment time |
| chapter_code_snapshot | text | Yes | — | Optional reporting snapshot |
| subject_code_snapshot | text | Yes | — | Optional reporting snapshot |
| created_at | timestamptz | No | now() | Created |

Unique `(tenant_id,assignment_version_id,sequence_no)`; unique `(tenant_id,assignment_version_id,source_question_id)` unless product later allows deliberate duplicate question placements. Source question must belong to same tenant. Exact source edition/question locator is preserved by FK and snapshots.

### 4.7 `sa_assignment_targets`

| Column | Type | Null | Default / constraint | Meaning |
|---|---|---:|---|---|
| id | uuid | No | gen_random_uuid(), PK | Target |
| tenant_id | uuid | No | — | Tenant |
| assignment_version_id | uuid | No | same-tenant FK | Assignment version |
| target_kind | text | No | BATCH/STUDENT/ACADEMIC_CONTEXT | Target selector |
| batch_id | uuid | Yes | same-tenant FK | Batch target |
| student_id | uuid | Yes | same-tenant FK | Explicit student target |
| context_epoch_id | uuid | Yes | same-tenant FK | Optional context target |
| created_at | timestamptz | No | now() | Created |

CHECK exactly one target reference is set and matches target_kind. Unique target per assignment version. More complex cohort filters require a versioned, validated rule contract; do not store executable SQL or unvalidated filter JSON.

### 4.8 `sa_target_snapshots`

| Column | Type | Null | Default / constraint | Meaning |
|---|---|---:|---|---|
| id | uuid | No | gen_random_uuid(), PK | Snapshot row |
| tenant_id | uuid | No | — | Tenant |
| assignment_version_id | uuid | No | same-tenant FK | Published version |
| student_id | uuid | No | same-tenant FK | Resolved student |
| academic_context_epoch_id | uuid | Yes | same-tenant FK | Context at publication |
| source_batch_id | uuid | Yes | same-tenant FK | Batch at publication |
| resolved_at | timestamptz | No | now() | Resolution time |
| resolution_reason | text | No | — | Target rule/eligibility explanation |

Unique `(tenant_id,assignment_version_id,student_id)`. Snapshot is immutable after publication; additions/removals are explicit amendment events.

### 4.9 `sa_student_obligations`

One student's responsibility for one selected question item.

| Column | Type | Null | Default / constraint | Meaning |
|---|---|---:|---|---|
| id | uuid | No | gen_random_uuid(), PK | Obligation |
| tenant_id | uuid | No | — | Tenant |
| assignment_item_id | uuid | No | same-tenant FK | Assigned question |
| target_snapshot_id | uuid | No | same-tenant FK | Publication roster row |
| student_id | uuid | No | same-tenant FK | Student |
| source_batch_id | uuid | Yes | same-tenant FK | Historical batch snapshot |
| assigned_at | timestamptz | No | now() | Assignment time |
| due_at | timestamptz | Yes | version snapshot | Due time |
| eligibility_state | text | No | ELIGIBLE | ELIGIBLE/EXEMPTED/REMOVED/RECOGNISED |
| created_at | timestamptz | No | now() | Created |

Unique `(tenant_id,assignment_item_id,student_id)` for one obligation per item/student/version. Enforce that target snapshot, assignment item and student all refer to the same assignment version/student. Publication must create snapshots and obligations in one transaction, guarded by a publication idempotency key. Do not silently create obligations for later batch entrants.

## 5. System A — evidence and intervention domain

### 5.1 `sa_attempt_cycles`

| Column | Type | Null | Default / constraint | Meaning |
|---|---|---:|---|---|
| id | uuid | No | gen_random_uuid(), PK | Attempt cycle |
| tenant_id | uuid | No | — | Tenant |
| obligation_id | uuid | No | same-tenant FK | Student obligation |
| cycle_no | integer | No | CHECK > 0 | Sequence |
| cycle_type | text | No | INITIAL/PRACTICE/REVISION | Attempt type |
| initiated_by_person_id | uuid | No | tenant person FK | Initiator |
| started_at | timestamptz | No | now() | Start |
| ended_at | timestamptz | Yes | — | End |
| created_at | timestamptz | No | now() | Created |

Unique `(tenant_id,obligation_id,cycle_no)`. Correction/resubmission is not a new practice cycle.

### 5.2 `sa_student_report_events` (append-only)

| Column | Type | Null | Default / constraint | Meaning |
|---|---|---:|---|---|
| id | uuid | No | gen_random_uuid(), PK | Report event |
| tenant_id | uuid | No | — | Tenant |
| obligation_id | uuid | No | same-tenant FK | Obligation |
| attempt_cycle_id | uuid | Yes | same-tenant FK | Attempt |
| actor_person_id | uuid | No | tenant person FK | Student actor |
| reported_state | text | No | controlled state | UNATTEMPTED/ATTEMPTED/REPORTED_COMPLETE/DOUBT/SKIPPED/PARTIALLY_COMPLETE |
| remark | text | Yes | — | Student remark |
| client_event_id | uuid | Yes | idempotency unique per actor/tenant | Client retry identity |
| supersedes_event_id | uuid | Yes | self FK, same tenant | Corrected report pointer |
| source_channel | text | No | WEB/APP/IMPORT | Origin |
| occurred_at | timestamptz | Yes | — | Client occurrence time |
| recorded_at | timestamptz | No | now() | Server record time |

Unique `(tenant_id,actor_person_id,client_event_id)` when client_event_id is not null. No UPDATE/DELETE for app roles. Student can only append to own obligation; trusted server derives actor.

### 5.3 `sa_teacher_observation_events` (append-only)

| Column | Type | Null | Default / constraint | Meaning |
|---|---|---:|---|---|
| id | uuid | No | gen_random_uuid(), PK | Observation |
| tenant_id | uuid | No | — | Tenant |
| obligation_id | uuid | No | same-tenant FK | Obligation |
| teacher_person_id | uuid | No | tenant person FK | Teacher |
| teaching_assignment_id | uuid | Yes | same-tenant FK | Scope evidence |
| observation_code | text | No | controlled vocabulary | OBSERVED_ATTEMPT/EXPLANATION_GIVEN/INDEPENDENT_RESOLVE/etc. |
| remark | text | Yes | — | Observation detail |
| occurred_at | timestamptz | Yes | — | Occurrence |
| recorded_at | timestamptz | No | now() | Record time |

Teacher observation is not a student report and cannot silently imply correctness or verified completion.

### 5.4 `sa_answer_evaluations`

| Column | Type | Null | Default / constraint | Meaning |
|---|---|---:|---|---|
| id | uuid | No | gen_random_uuid(), PK | Evaluation |
| tenant_id | uuid | No | — | Tenant |
| obligation_id | uuid | No | same-tenant FK | Obligation |
| report_event_id | uuid | No | same-tenant FK | Exact evidence |
| evaluator_person_id | uuid | No | tenant person FK | Evaluator |
| outcome | text | No | CORRECT/INCORRECT/PARTIALLY_CORRECT/NOT_EVALUATED | Answer result |
| marks_awarded | numeric(8,2) | Yes | >= 0 | Awarded marks |
| max_marks_snapshot | numeric(8,2) | Yes | >= 0 | Denominator |
| rationale | text | Yes | — | Explanation |
| evaluated_at | timestamptz | No | now() | Decision time |
| supersedes_evaluation_id | uuid | Yes | self FK | Re-evaluation link |

Evaluations are immutable decisions; a re-evaluation appends a new row. Enforce marks_awarded <= max_marks_snapshot when both are known.

### 5.5 `sa_verification_decisions`

| Column | Type | Null | Default / constraint | Meaning |
|---|---|---:|---|---|
| id | uuid | No | gen_random_uuid(), PK | Decision |
| tenant_id | uuid | No | — | Tenant |
| obligation_id | uuid | No | same-tenant FK | Obligation |
| report_event_id | uuid | No | same-tenant FK | Exact report |
| reviewer_person_id | uuid | No | tenant person FK | Verifier |
| purpose | text | No | ATTEMPT/COMPLETION/CORRECTION/INDEPENDENT_SOLVE | Verification purpose |
| outcome | text | No | CONFIRMED/NOT_CONFIRMED/RETURNED/REJECTED/ACCEPTED | Purpose-constrained outcome |
| remarks | text | Yes | — | Rationale |
| decided_at | timestamptz | No | now() | Decision time |
| supersedes_decision_id | uuid | Yes | self FK | Superseded decision |

Append-only. CHECK must constrain allowed outcome per purpose. Evaluator/verifier independence and role rules enforced by trusted command and authorization tests.

### 5.6 `sa_correction_cycles` and `sa_correction_events`

Correction cycle columns: `id uuid PK`, `tenant_id uuid NOT NULL`, `obligation_id uuid NOT NULL`, `returned_decision_id uuid NOT NULL`, `cycle_no integer NOT NULL CHECK > 0`, `state text NOT NULL`, `requested_by_person_id uuid NOT NULL`, `requested_at timestamptz NOT NULL DEFAULT now()`, `due_at timestamptz NULL`, `closed_at timestamptz NULL`. Unique `(tenant_id,obligation_id,cycle_no)`. Returned decision must be eligible and belong to same obligation.

Correction event columns: `id uuid PK`, `tenant_id uuid NOT NULL`, `correction_cycle_id uuid NOT NULL`, `actor_person_id uuid NOT NULL`, `event_type text NOT NULL`, `reason text NULL`, `occurred_at timestamptz NULL`, `recorded_at timestamptz NOT NULL DEFAULT now()`. Append-only. Resubmission is a new student report linked to the correction cycle; it does not create a new practice cycle.

### 5.7 `sa_doubt_cases` and `sa_doubt_events`

Doubt case columns: `id uuid PK`, `tenant_id uuid NOT NULL`, `obligation_id uuid NOT NULL`, `originating_report_event_id uuid NOT NULL`, `opened_by_person_id uuid NOT NULL`, `assigned_to_person_id uuid NULL`, `priority text NOT NULL DEFAULT 'NORMAL'`, `state text NOT NULL DEFAULT 'OPEN'`, `opened_at timestamptz NOT NULL DEFAULT now()`, `resolved_at timestamptz NULL`. Index `(tenant_id,assigned_to_person_id,state,opened_at DESC)`.

Doubt event columns: `id uuid PK`, `tenant_id uuid NOT NULL`, `doubt_case_id uuid NOT NULL`, `actor_person_id uuid NOT NULL`, `event_type text NOT NULL`, `body text NULL`, `recorded_at timestamptz NOT NULL DEFAULT now()`. Append-only. Cohort explanation must not close every student's doubt automatically; create per-student transitions/confirmation.

### 5.8 `sa_disputes` and `sa_appeal_decisions`

Dispute columns: `id uuid PK`, `tenant_id uuid NOT NULL`, `obligation_id uuid NOT NULL`, `challenged_report_event_id uuid NULL`, `challenged_decision_id uuid NULL`, `raised_by_person_id uuid NOT NULL`, `reason text NOT NULL`, `state text NOT NULL`, `opened_at timestamptz NOT NULL DEFAULT now()`, `resolved_at timestamptz NULL`. CHECK exactly one or both challenged references according to dispute policy.

Appeal decision columns: `id uuid PK`, `tenant_id uuid NOT NULL`, `dispute_id uuid NOT NULL`, `reviewer_person_id uuid NOT NULL`, `outcome text NOT NULL`, `rationale text NOT NULL`, `decided_at timestamptz NOT NULL DEFAULT now()`. Original decision remains unchanged; appeal reviewer must be independent.

### 5.9 `sa_recognition_decisions`

Columns: `id uuid PK`, `tenant_id uuid NOT NULL`, `obligation_id uuid NOT NULL`, `source_obligation_id uuid NULL`, `source_report_event_id uuid NULL`, `source_verification_decision_id uuid NULL`, `policy_version text NOT NULL`, `outcome text NOT NULL` (RECOGNISED/NOT_RECOGNISED/FRESH_PRACTICE_REQUIRED/REVOKED), `decided_by_person_id uuid NOT NULL`, `reason text NOT NULL`, `decided_at timestamptz NOT NULL DEFAULT now()`. Exact source evidence required for accepted recognition; similarity alone is insufficient.

## 6. Audit, idempotency, and projections

### 6.1 `sa_audit_events`

Columns: `id uuid PK`, `tenant_id uuid NULL` (NULL only for approved platform-level events), `actor_person_id uuid NULL`, `action_code text NOT NULL`, `target_type text NOT NULL`, `target_id uuid NULL`, `reason text NULL`, `request_id uuid NULL`, `metadata jsonb NOT NULL DEFAULT '{}'`, `recorded_at timestamptz NOT NULL DEFAULT now()`. Append-only; restrict access to security/audit roles.

### 6.2 `sa_command_idempotency`

Columns: `id uuid PK`, `tenant_id uuid NOT NULL`, `actor_person_id uuid NOT NULL`, `command_name text NOT NULL`, `idempotency_key text NOT NULL`, `payload_hash text NOT NULL`, `result_reference jsonb NULL`, `created_at timestamptz NOT NULL DEFAULT now()`, `expires_at timestamptz NULL`. Unique `(tenant_id,actor_person_id,command_name,idempotency_key)`. Same key + same payload returns original result; same key + different payload is a conflict.

### 6.3 `sa_metric_policy_versions`

Columns: `id uuid PK`, `tenant_id uuid NOT NULL`, `policy_code text NOT NULL`, `version_no integer NOT NULL CHECK > 0`, `definition jsonb NOT NULL`, `status text NOT NULL`, `created_by_person_id uuid NOT NULL`, `created_at timestamptz NOT NULL DEFAULT now()`. Unique `(tenant_id,policy_code,version_no)`. Definition includes numerator/denominator, exclusions, recognition, dispute and as-of semantics.

### 6.4 `sa_projection_runs` and `sa_student_progress_snapshots`

Projection run: `id uuid PK`, `tenant_id uuid NOT NULL`, `projection_code text NOT NULL`, `policy_version_id uuid NULL`, `source_watermark timestamptz NOT NULL`, `status text NOT NULL`, `started_at timestamptz NOT NULL DEFAULT now()`, `completed_at timestamptz NULL`, `error_summary text NULL`.

Student snapshot: `id uuid PK`, `tenant_id uuid NOT NULL`, `student_id uuid NOT NULL`, `assignment_version_id uuid NULL`, `projection_run_id uuid NOT NULL`, `calculated_at timestamptz NOT NULL DEFAULT now()`, `metrics jsonb NOT NULL`. Rebuildable only; never source of academic truth.

## 7. Core PostgreSQL types and constraints

| Concern | Physical rule |
|---|---|
| IDs | uuid PK default gen_random_uuid() |
| Tenant FKs | Composite `(tenant_id,parent_id)` to parent `(tenant_id,id)` |
| Person actor FKs | Person must have tenant association; prefer composite FK to `tenant_people(tenant_id,person_id)` |
| Marks | numeric(8,2), CHECK >= 0 |
| Counts/order | integer, CHECK > 0 where sequence/count must be positive |
| Event times | timestamptz; server recorded_at default now() |
| JSON | jsonb with object check where expected; size/shape validated by command |
| Status codes | text + CHECK or lookup table; do not use one universal status enum |
| Deletion | RESTRICT/NO ACTION for historical relationships; no cascade on evidence |
| Published versions | immutable via privileges + trusted command; optional trigger as defense in depth |
| Evidence events | INSERT only for application roles; no UPDATE/DELETE |
| Tenant-safe references | composite unique keys and composite foreign keys |

## 8. Initial index plan

Create only after query patterns are confirmed; validate with `EXPLAIN (ANALYZE, BUFFERS)` using representative data.

- `tenant_people(tenant_id,person_id)` — already unique.
- `students(tenant_person_id)`.
- `academic_context_epochs(tenant_id,student_id,valid_from DESC)`.
- `academic_context_epochs(tenant_id,batch_id,valid_from DESC)`.
- `tenant_role_grants(tenant_id,person_id,role_code,valid_from,valid_to)`.
- `teaching_assignments(tenant_id,person_id,batch_id,subject_code,valid_from,valid_to)`.
- `sa_source_questions(tenant_id,source_edition_id,source_locator)` — unique.
- `sa_assignment_versions(tenant_id,assignment_id,version_no)` — unique.
- `sa_assignment_items(tenant_id,assignment_version_id,sequence_no)` — unique.
- `sa_target_snapshots(tenant_id,assignment_version_id,student_id)` — unique.
- `sa_student_obligations(tenant_id,student_id,assigned_at DESC)`.
- `sa_student_obligations(tenant_id,assignment_item_id,student_id)` — unique.
- `sa_student_report_events(tenant_id,obligation_id,recorded_at DESC)`.
- `sa_verification_decisions(tenant_id,obligation_id,decided_at DESC)`.
- `sa_answer_evaluations(tenant_id,obligation_id,evaluated_at DESC)`.
- `sa_doubt_cases(tenant_id,assigned_to_person_id,state,opened_at DESC)`.
- `sa_correction_cycles(tenant_id,obligation_id,state)`.
- `sa_disputes(tenant_id,state,opened_at DESC)`.

Avoid speculative indexes on every FK; inspect actual query plans and write overhead.

## 9. Required constraints not expressible as simple CHECK

Implement in trusted transaction commands and/or narrowly scoped constraint triggers:
- Assignment item source question, assignment version, target snapshot, student and obligation all share tenant.
- Target snapshot belongs to the assignment version whose item creates the obligation.
- Exercise/question source edition relationship is valid.
- Only approved/published assignment versions can generate obligations.
- Creator/approver separation when policy requires it.
- Current version pointer belongs to the same assignment.
- A report actor is the student attached to the obligation.
- Teacher observation/verifier has active role grant and teaching/review scope.
- Verification outcome is compatible with purpose.
- Correction cycle references an eligible RETURNED decision for the same obligation.
- Appeal reviewer is independent from original verifier.
- Parent can only read current verified linked student and permitted fields.
- Temporal enrolment and grant windows do not overlap where policy prohibits overlap.

## 10. Decisions still requiring explicit owner approval

The shared identity ownership decision is closed. The following are not silently inferred:

| ID | Decision | Proposed default |
|---|---|---|
| PDB-01 | `tenant_people` semantics | Retain as tenant association; role grants separate |
| PDB-02 | Student tenant key | Add `tenant_id` to students with composite FK to `tenant_people(tenant_id,id)`, or derive consistently; choose one |
| PDB-03 | Student/programme multiplicity | One canonical student identity per tenant-person; multiple academic context/enrolment epochs |
| PDB-04 | Concurrent active batch membership | Permit only if academic policy explicitly supports; otherwise prevent overlapping active epochs |
| PDB-05 | Subject/chapter catalogue ownership | Shared PULSE catalogue with tenant overlays |
| PDB-06 | Teacher authorization | Role grant = capability; teaching assignment = resource scope |
| PDB-07 | Parent relationship | Verified, effective-dated, read-only relationship; approve consent and evidence fields |
| PDB-08 | Verification requirement | Mandatory academic approval before publication as source recommendation; allow institute-level policy only if explicitly approved |
| PDB-09 | Student/teacher matrix writes | Separate student report events and teacher observation events |
| PDB-10 | Six UI states | U/C/I/D/S/P are interface labels; map to distinct progress/evaluation/doubt dimensions |
| PDB-11 | Source catalogues | Offline modules are first-class initial source; QBMS later optional |
| PDB-12 | Assignment amendment | New immutable version plus explicit obligation deltas; no in-place mutation |

## 11. Build sequence

1. Approve shared-core extension columns and identity constraints.
2. Approve the source catalogue and offline-question reference contract.
3. Approve assignment publication and amendment semantics.
4. Approve actor/evidence semantics and role-scope matrix.
5. Complete physical ERD and data dictionary review.
6. Author SQL migration files through the Supabase CLI migration workflow.
7. Replay in disposable PostgreSQL and run tenant/RLS/integrity tests.
8. Deploy to designated staging only after explicit approval.
9. Verify catalog, policies, grants, advisor results and app contracts.
10. Production requires separate authorization.

## 12. Supabase implementation controls

- All tables in exposed schemas require RLS.
- RLS must enforce tenant and resource scope; `TO authenticated` alone is not authorization.
- UPDATE policies require both USING and WITH CHECK.
- Views exposed to application roles must use `security_invoker = true` where caller RLS must apply.
- Prefer SECURITY INVOKER functions. Any SECURITY DEFINER exception requires fixed search_path, trusted actor validation, narrow grants, non-exposed placement and review.
- Never expose service-role/secret keys to browser code.
- Data API table grants are distinct from RLS row policies.
- Run Supabase security/performance advisors after DDL and verify actual catalog objects.

## 13. Current execution status

- Shared identity direction: frozen by owner decision DEC-011.
- Physical ERD: reconciled proposal committed.
- Physical blueprint: detailed proposal committed in this increment.
- Live Supabase application tables: none at last inspection.
- Live Supabase applied migrations: none at last inspection.
- DDL applied by this increment: none.
- Production readiness: not achieved.

**Acceptance:** This blueprint becomes executable only after the open decisions are closed, shared-core maintainers approve their extensions, the final ERD/data dictionary are reviewed, and the migration/RLS/test plan is approved.
