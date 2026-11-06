# PULSE — Canonical Identity, Tenancy and Academic Core Data Model

- Document ID: PULSE-DATA-CORE-001
- Version: 0.1.0
- Status: Draft — proposed logical model; pending product, technical and security approval
- Date: 2026-11-06
- Repository: `anshuljindalsecondbrain-art/pulse`
- Related: `PULSE-GOV-REPO-004` Architecture Unification and Branch Disposition Plan
- Implementation authorization: Not granted
- Migration authorization: Not granted

## 1. Purpose and scope

This document proposes a canonical shared data model for institute tenancy, person identity, student identity, membership, roles, centres, batches, enrollment and academic context. It also defines how System A should reference this shared core without surrendering ownership of its operational records.

It is a logical model and contract proposal, not executable SQL, a migration, or proof of the live database state. The live Supabase project must be re-audited before implementation.

### 1.1 Design objectives

1. A person may participate in more than one institute without duplicate global person identities.
2. A person may hold multiple roles in one institute, potentially with centre-level scope and effective dates.
3. A student is an institute-specific academic identity linked to a person where identity is known.
4. Parent-to-student relationships are explicit, scoped and time-bounded.
5. Batch membership and academic context preserve history and transfers.
6. Tenant boundaries are enforced by relational constraints, trusted authorization and RLS—not frontend filtering.
7. Student Tracking works without QBMS question IDs or DTE classification.
8. Platform events, academic evidence and administrative audit records remain distinct.
9. Historical evidence references the academic context and content version that applied when it was recorded.

## 2. Canonical entity catalogue

| Entity | Proposed table | Ownership | Purpose |
|---|---|---|---|
| Tenant / institute | `tenants` | Platform | Institute boundary, name, timezone, lifecycle |
| Person | `people` | Platform | Human identity independent of login |
| Auth identity | `person_auth_identities` | Platform | Maps Auth user IDs to people |
| Tenant membership | `tenant_memberships` | Platform | Person's association with an institute |
| Role grant | `tenant_role_grants` | Platform | One or more roles, scoped and time-bounded |
| Centre | `centres` | Platform / tenant | Institute organizational unit |
| Student profile | `students` | Academic core | Institute-scoped learner identity and student code |
| Parent-student link | `parent_student_links` | Academic core | Authorized guardian relationship |
| Batch | `batches` | Academic core | Institute-owned cohort/group |
| Enrollment | `enrollments` | Academic core | Time-bounded student-to-batch membership |
| Academic context epoch | `academic_context_epochs` | Academic core | Effective-dated class, stream, programme and other academic context |
| Platform domain event | `domain_events` | Platform | Generic event envelope, correlation and integration |
| Audit event | `audit_events` | Platform | Security/administrative action record |

System A retains its module-owned records (exercise, exercise version, exercise slot, assignment, assignment version, assignment item, target, student obligation, attempt cycle, evidence event, verification decision, correction cycle, doubt case and doubt event). Those records reference canonical platform identities and carry an institute/tenant key for integrity and access control.

## 3. Entity definitions and field contracts

### 3.1 tenants

- `id`: UUID primary key.
- `name`: required display/legal institute name; normalized uniqueness policy to be decided.
- `timezone`: required IANA timezone, default may be Asia/Kolkata but must not be hardcoded as universal.
- `status`: ACTIVE, SUSPENDED or ARCHIVED; lifecycle transitions audited.
- `created_at`, `updated_at`: server timestamps.

Tenant identity is the authorization boundary. Institute branding, address and billing data may be separate profile tables when needed.

### 3.2 people

- `id`: UUID primary key.
- `display_name`: optional/required according to onboarding policy.
- `created_at`, `updated_at`: server timestamps.
- Optional normalized contact attributes must have a privacy, verification and uniqueness policy before inclusion.

Do not use email or phone as the primary identity key. A person can have multiple Auth identities only if account-linking policy explicitly permits it.

### 3.3 person_auth_identities

- `id`: UUID primary key.
- `person_id`: FK to people.
- `auth_user_id`: unique FK to Supabase Auth user.
- `identity_kind`: controlled provider/category if multiple providers are supported.
- `linked_at`, `revoked_at`: lifecycle timestamps.
- `linked_by`: actor or trusted system provenance where available.

Authorization must use trusted database-side identity resolution. User-editable Auth metadata is not an authorization source. If one Auth user must map to exactly one person, enforce that with a unique constraint on `auth_user_id`.

### 3.4 tenant_memberships

- `id`: UUID primary key.
- `tenant_id`: FK to tenants.
- `person_id`: FK to people.
- `status`: INVITED, ACTIVE, SUSPENDED, LEFT or REVOKED.
- `valid_from`, `valid_to`: effective interval.
- `created_at`, `created_by`: provenance.
- Unique active membership policy for (tenant, person), implemented with an appropriate constraint/index after lifecycle rules are finalized.

Membership answers: "Is this person associated with this institute?" It does not by itself grant a specific operation.

### 3.5 tenant_role_grants

- `id`: UUID primary key.
- `tenant_id`: FK to tenants.
- `membership_id`: FK to tenant_memberships, tenant-qualified.
- `role_key`: controlled role identifier.
- `scope_type`: TENANT or CENTRE (future scope types require explicit design).
- `centre_id`: nullable FK; required exactly when scope_type=CENTRE.
- `valid_from`, `valid_to`: effective interval.
- `granted_by`, `revoked_by`, `reason`: governance provenance.

A person may have multiple concurrent role grants. Role names are not authorization rules by themselves; each role maps to explicit action/resource permissions. Parent/student relationships must not be inferred from role names.

### 3.6 centres

- `id`: UUID primary key.
- `tenant_id`: FK to tenants.
- `name`: required institute-local name.
- `status`: ACTIVE or INACTIVE.
- `created_at`, `created_by`.
- Unique (tenant_id, normalized name) after normalization strategy is approved.
- Composite unique key (tenant_id, id) to support tenant-qualified foreign keys.

### 3.7 students

- `id`: UUID primary key.
- `tenant_id`: FK to tenants.
- `person_id`: nullable FK to people; nullable supports records created before learner login or person resolution.
- `student_code`: required institute-local identifier.
- `full_name`: required operational display name; avoid copying unnecessary PII into events.
- `status`: ACTIVE, INACTIVE, TRANSFERRED or ARCHIVED.
- `created_at`, `updated_at`.
- Unique (tenant_id, id), unique (tenant_id, student_code).
- Optional unique (tenant_id, person_id) only if business rules prohibit multiple learner profiles for one person within one institute.

A student profile is not the Auth user. The learner may have no login, a later login, or a linked guardian login.

### 3.8 parent_student_links

- `id`: UUID primary key.
- `tenant_id`: FK to tenants.
- `parent_person_id`: FK to people.
- `student_id`: tenant-qualified FK to students.
- `relationship_type`: configurable controlled value.
- `valid_from`, `valid_to`: effective interval.
- `verification_status`: PENDING, VERIFIED, REVOKED.
- `verified_by`, `verified_at`: provenance.

Do not authorize a parent to see a student solely because a client supplies a student ID or relationship label. Access requires a verified, currently valid link and tenant membership.

### 3.9 batches

- `id`: UUID primary key.
- `tenant_id`: FK to tenants.
- `centre_id`: nullable tenant-qualified FK to centres.
- `name`: institute-local batch name.
- `academic_year_label`: display label, not a date arithmetic substitute.
- `programme_code`, `class_level`, `stream`: optional structured values where the institute requires them; avoid assuming every tenant uses JEE/NEET or XI/XII.
- `status`: ACTIVE, INACTIVE or ARCHIVED.
- `starts_on`, `ends_on`: optional dates.
- Composite unique (tenant_id, id).

Batch is a cohort container. Historical enrollment is recorded separately.

### 3.10 enrollments

- `id`: UUID primary key.
- `tenant_id`: FK to tenants.
- `student_id`: tenant-qualified FK to students.
- `batch_id`: tenant-qualified FK to batches.
- `valid_from`, `valid_to`: effective interval.
- `status`: ACTIVE, TRANSFERRED, WITHDRAWN, COMPLETED.
- `created_at`, `created_by`, `ended_reason`.

The database must prevent cross-tenant student/batch references. Overlap rules must be explicitly selected: one active batch per student per programme, or multiple concurrent enrollments where the institute needs them. Do not impose a universal one-active-batch rule until product policy confirms it.

### 3.11 academic_context_epochs

- `id`: UUID primary key.
- `tenant_id`: FK to tenants.
- `student_id`: tenant-qualified FK to students.
- `enrollment_id`: nullable tenant-qualified FK to enrollment.
- `class_level`, `stream`, `programme`, `academic_year`: structured or tenant-configured values.
- `valid_from`, `valid_to`: effective interval.
- `reason`, `created_at`, `created_by`.

Context epochs preserve changes in academic status without rewriting old evidence. The exact dimensions and overlap policy require academic-owner approval.

## 4. System A integration contract

System A owns its operational entities. It must reference the canonical `tenant_id`, `student_id`, `batch_id` and authenticated actor/person identity as appropriate.

### 4.1 Required integrity pattern

For every System A table with tenant-owned parent references:
- include `tenant_id`;
- define composite unique keys on parent (tenant_id, id);
- use composite foreign keys (tenant_id, parent_id) wherever the relationship is tenant-scoped;
- index common tenant-qualified access paths;
- prevent a row from referencing a parent belonging to another tenant.

This applies to assignment versions/items, exercise versions/slots, targets, obligations, attempts, evidence, verification, corrections and doubts. A code-level filter is not a substitute for a database constraint.

### 4.2 Evidence semantics

Keep separate:
- learner self-report;
- teacher observation;
- system/import evidence;
- verification decision;
- correction/resubmission event;
- derived analytics.

Original evidence must be append-only. Corrections append a new event or decision linked to its predecessor; they do not overwrite the original. Incorrect answer, reported doubt, unattempted, skipped and teacher-solved states must remain distinguishable, consistent with the Student Work Tracking functional baseline.

### 4.3 Question and classification references

An exercise slot may contain:
- a local slot number and teacher-authored label;
- optional QBMS question identity;
- optional exact QBMS question version;
- optional chapter/syllabus reference if configured.

QBMS and DTE references are optional enrichment links. A missing question identity or classification must never block operational tracking.

## 5. Tenant integrity and relational constraints

The target schema should use composite tenant-qualified relationships, not merely independent foreign keys.

Illustrative logical pattern (not executable migration SQL):

```sql
-- Parent table exposes a tenant-qualified candidate key:
UNIQUE (tenant_id, id)

-- Child references both tenant and parent identity:
FOREIGN KEY (tenant_id, student_id)
  REFERENCES students (tenant_id, id)
```

Additional constraints to design and test:
- centre belongs to same tenant as batch and role scope;
- membership belongs to same tenant as role grant;
- student and batch belong to same tenant as enrollment;
- student belongs to same tenant as academic context and parent link;
- System A obligation, slot, assignment version and student all belong to same tenant;
- evidence, verification and correction references remain tenant-consistent;
- effective intervals are valid (`valid_to > valid_from`);
- uniqueness rules match approved lifecycle and concurrency behavior.

## 6. Authorization model

Authentication identifies the current Auth user. Authorization resolves that user to a person, active tenant membership, role grant and permitted scope. A client-supplied tenant ID, student ID, role or centre is never sufficient proof.

### 6.1 Role catalogue candidates

| Role family | Typical responsibility | Scope candidate |
|---|---|---|
| STUDENT | View own obligations and append own reports | Own student profile |
| PARENT | View linked learner information permitted by policy | Verified parent-student links |
| TEACHER | Create/assign work and record teacher observations | Assigned centre/batches |
| MENTOR | Review learner progress and intervene | Explicitly assigned learners |
| ACADEMIC_REVIEWER | Review academic work and decisions | Assigned tenant/centre/work queue |
| CONTENT_ADMIN | Manage institute content configuration | Tenant or delegated centre |
| INSTITUTE_ADMIN | Manage institute membership and operations | Tenant |
| PLATFORM_ADMIN | Platform operations under privileged audited workflow | Platform-level, exceptional |

These are role families, not final permissions. QBMS-specific author/reviewer/DTP roles should be domain permissions or grants where appropriate, not automatically inherited by every System A user.

### 6.2 Action-resource authorization matrix (baseline proposal)

| Resource / action | Student | Parent | Teacher | Mentor | Academic reviewer | Institute admin |
|---|---|---|---|---|---|---|
| Read own student profile | Yes | Linked only | Assigned scope | Assigned scope | Assigned scope | Tenant scope |
| Read obligations | Own | Linked only | Assigned scope | Assigned scope | Assigned scope | Tenant scope |
| Append student report | Own only | No | No (teacher observation is separate) | No | No | No |
| Append teacher observation | No | No | Assigned scope | If explicitly delegated | If explicitly delegated | Audited exception only |
| Verify evidence | No | No | Only if workflow permits; separation-of-duties rule applies | If delegated | Assigned scope | Policy-controlled |
| Create/publish assignment | No | No | Assigned scope | No by default | Approval role | Policy-controlled |
| Manage memberships/roles | No | No | No | No | No | Tenant admin with audited grant |
| View cross-tenant data | No | No | No | No | No | No; platform support is separate privileged path |

Every "Yes" must be implemented through explicit tenant/scope predicates and tested. Parent and student access are not interchangeable. Separation of duties for assignment author/approver and evidence reporter/verifier must be configurable and audited.

## 7. Supabase RLS and grants requirements

1. Enable RLS on every exposed tenant-owned table.
2. Pair policies with minimum grants; RLS does not itself grant table access.
3. Build policies for actual actor/resource relationships, not just `TO authenticated`.
4. Do not use user-editable `user_metadata` for authorization.
5. UPDATE requires a suitable SELECT policy and both UPDATE `USING` and `WITH CHECK`.
6. Keep privileged functions in a non-exposed schema where possible; restrict execute grants and validate caller identity and scope.
7. Review every `SECURITY DEFINER` function, fixed search path, owner privileges and bypass behavior.
8. Review views for invoker security and access leakage.
9. Test direct table operations, RPCs, views, storage and background jobs across tenant boundaries.
10. Ensure ordinary users cannot mutate append-only evidence, verification or audit records.

## 8. Indexing and scale principles

Initial candidate indexes, subject to query-plan evidence:
- memberships by (tenant_id, person_id, status);
- role grants by (tenant_id, membership_id, role_key, valid_from);
- students by (tenant_id, student_code) and (tenant_id, person_id);
- enrollments by (tenant_id, student_id, valid_from desc) and (tenant_id, batch_id, valid_from);
- context epochs by (tenant_id, student_id, valid_from desc);
- System A obligations by (tenant_id, student_id, eligibility_status);
- evidence by (tenant_id, obligation_id, server_sequence);
- verification by (tenant_id, evidence_event_id, decided_at desc).

Do not add broad indexes before measuring actual query patterns. Use server-side pagination and bounded search.

## 9. Migration mapping from existing proposals

| Existing proposal | Canonical target | Treatment |
|---|---|---|
| V10 `tenants` | `tenants` | Candidate retain after lifecycle/field review |
| V10 `people` | `people` | Candidate retain; define minimum fields and identity privacy |
| V10 `person_auth_identities` | `person_auth_identities` | Candidate retain; constrain Auth mapping |
| V10 `tenant_people` | `tenant_memberships` | Evolve to lifecycle/status semantics |
| V10 `tenant_roles` | `tenant_role_grants` | Separate membership and scoped grants |
| V10 `students` | `students` | Add institute-local code/profile and explicit person link |
| V10 `batches` | `batches` | Generalize beyond JEE/NEET XI/XII assumptions |
| V10 `enrollments` | `enrollments` | Add tenant-qualified FK constraints and approved overlap policy |
| V10 `academic_context_epochs` | `academic_context_epochs` | Reference enrollment; define context dimensions |
| System A `sa_institutes` | `tenants` | Do not retain as parallel canonical tenant table |
| System A `sa_centres` | `centres` | Preserve tenant-qualified ownership |
| System A `sa_institute_memberships` | Membership + role grants | Split association from permission |
| System A `sa_students` | `students` | Preserve student code and Auth/person link semantics |
| System A `sa_batches` | `batches` | Preserve centre and academic-year attributes |
| System A `sa_batch_memberships` | `enrollments` | Preserve history and transfer semantics |
| System A `sa_parent_student_links` | `parent_student_links` | Preserve verified temporal relationship |
| System A `sa_*` operational tables | System A module tables | Retain module ownership; repoint shared FKs |

This is a mapping proposal, not a mechanical rename plan. IDs, constraints, indexes and dependencies must be reconciled from full migration definitions before a migration is authored.

## 10. Decisions requiring approval

| Decision | Owner required | Proposed default |
|---|---|---|
| One Auth user maps to one person? | Product + security | Yes, unless account-linking use case approved |
| One student profile per person per tenant? | Academic owner | Usually yes; allow exceptions only by explicit policy |
| Multiple active batch enrollments? | Academic owner | Support if programme policy requires; do not assume one universally |
| Centre-level grants? | Product + institute operations | Support |
| Parent access verification method? | Product + privacy/security | Explicit verification and revocation workflow |
| Context dimensions and vocabulary? | Academic owner | Configurable; do not hardcode only JEE/NEET XI/XII |
| Global/shared subjects? | Product + DTE/QBMS owners | Separate global catalogue from tenant extension |
| Role catalogue and permission matrix? | Product + security | Approve per workflow before RLS implementation |
| System A table names and migration lineage? | Technical owner | Use canonical shared tables; module prefix only for owned records if naming convention approved |

## 11. Required validation tests

- Cross-tenant FK attempt is rejected even if IDs are valid in different tenants.
- User with no active membership cannot read tenant data.
- User with membership but no required role cannot perform privileged action.
- Centre-scoped teacher cannot access an unassigned centre's students.
- Parent can access only currently verified linked students.
- Student can report only against own eligible obligation.
- Client cannot impersonate another actor by supplying actor ID or role.
- Revoked role/membership stops subsequent access according to token/session policy.
- Batch transfer preserves historical enrollment and evidence visibility rules.
- Concurrent enrollment/publication attempts respect approved uniqueness and idempotency.
- Evidence/verification/audit mutation is denied to ordinary roles.
- Optional QBMS/DTE references can be null without blocking assignment or evidence workflows.
- Historical evidence retains original version/context references after later enrichment.

## 12. Approval and implementation gates

This model becomes an implementation baseline only after:
1. product owner approves identity and tenant semantics;
2. academic owner approves student, batch, enrollment and context semantics;
3. security reviewer approves role/scope and parent access model;
4. technical owner approves constraints, naming and migration lineage;
5. a field-level reconciliation against both complete proposed migrations is completed;
6. a live Supabase audit confirms current schema and migration state;
7. an isolated database validation plan and test matrix are approved.

No SQL migration is authorized by this document. Do not apply either existing initial migration as-is. The next engineering artifact after approval is a canonical ERD/data dictionary plus authorization decision record, followed by one unified migration sequence.
