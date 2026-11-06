# PULSE — Canonical Database Schema and Migration Specification

- Document ID: PULSE-DATA-CORE-003
- Version: 0.1.0
- Status: Draft — design baseline proposed; approval pending
- Date: 2026-11-06
- Parent documents: `PULSE-DATA-CORE-001`, `PULSE-DATA-CORE-002`
- Target database: Supabase PostgreSQL
- Implementation authorization: Not granted
- Migration execution authorization: Not granted

## 1. Purpose and scope

This specification defines the proposed canonical database structure, ownership boundaries, naming conventions, dependency order, security design, migration controls and rollback approach for PULSE.

It is a schema-design specification, not executable SQL and not evidence that the proposed objects exist. It does not authorize applying migrations to the live Supabase project.

The implementation must reconcile the complete V10 and System A migration sources and current repository state before SQL is authored. The names and fields below are the target proposal; they are not a mechanical rename instruction.

## 2. Architectural decisions

1. PostgreSQL is the system of record for transactional academic data.
2. One canonical platform identity and tenant model is shared by all modules.
3. Modules own their operational tables and business rules.
4. Tenant integrity is enforced through composite foreign keys and database authorization, not frontend filters.
5. Student Tracking remains operational without QBMS or DTE records.
6. Evidence, verification, correction and audit history are append-only or explicitly versioned.
7. RLS is mandatory for exposed tenant-owned tables; grants and RLS must be designed together.
8. Schema changes are additive, reviewed, versioned and tested before production.
9. No microservice boundary is implied by a module/table boundary.
10. Existing records and identifiers must be preserved through an explicit migration map; no silent destructive replacement.

## 3. Schema and naming conventions

| Concern | Convention |
|---|---|
| Shared platform schema | `public` only for approved API-exposed tables; internal helpers in `app_private` |
| Platform identity | `tenants`, `people`, `person_auth_identities`, `tenant_memberships`, `tenant_role_grants` |
| Academic core | `centres`, `students`, `parent_student_links`, `batches`, `enrollments`, `academic_context_epochs` |
| System A module | `sa_*` prefix for module-owned tables |
| Primary key | UUID `id`; event tables may use `event_id` |
| Tenant key | `tenant_id` UUID on tenant-owned rows |
| Timestamps | `timestamptz`, UTC storage; tenant timezone only for presentation/business-calendar interpretation |
| Dates | `date` for calendar dates, not timestamps |
| Status | Controlled text or approved enum; lifecycle transitions documented |
| JSON | `jsonb` only for genuinely variable metadata/payloads, not core relational attributes |
| Audit actor | Trusted server-derived identity; never accept as authorization truth from client payload |
| FK names | `<child>_<parent>_fkey` or stable explicit names |
| Index names | `idx_<table>_<columns>` |
| Constraint names | `uq_`, `ck_`, `fk_` prefixes |

Avoid PostgreSQL enums for values expected to be tenant-configurable or frequently extended. Use constrained text or reference tables where appropriate. Do not use generic JSON fields to avoid modeling relationships.

## 4. Target schema inventory and ownership

### 4.1 Shared platform and academic core

| Target table | Owner | Required identity / tenant rules | Notes |
|---|---|---|---|
| `tenants` | Platform | PK `id`; unique tenant-qualified key | Institute boundary |
| `people` | Platform | PK `id` | Global human identity, minimal PII |
| `person_auth_identities` | Platform | Unique `auth_user_id`; FK `person_id` | Auth-to-person link |
| `tenant_memberships` | Platform | FK tenant/person; unique `(tenant_id,id)` | Association, not permission |
| `tenant_role_grants` | Platform | Tenant-qualified membership and optional centre FKs | Scoped permission grant |
| `centres` | Academic core | Unique `(tenant_id,id)` | Tenant organizational unit |
| `students` | Academic core | Unique `(tenant_id,id)`, `(tenant_id,student_code)` | Institute-specific learner identity |
| `parent_student_links` | Academic core | Tenant-qualified student FK | Verified, time-bounded link |
| `batches` | Academic core | Unique `(tenant_id,id)`; centre same tenant | Cohort container |
| `enrollments` | Academic core | Tenant-qualified student and batch FKs | Historical batch membership |
| `academic_context_epochs` | Academic core | Tenant-qualified student/enrollment FKs | Effective-dated academic context |
| `domain_events` | Platform | Tenant-scoped idempotency | Integration/event envelope |
| `audit_events` | Platform | Tenant-scoped, append-only | Security/admin audit trail |

### 4.2 System A module-owned tables

| Table | Ownership and required relationships |
|---|---|
| `sa_exercises` | Tenant-owned exercise identity |
| `sa_exercise_versions` | Version belongs to tenant-qualified exercise |
| `sa_exercise_slots` | Slot belongs to exact exercise version |
| `sa_assignments` | Tenant-owned assignment identity |
| `sa_assignment_versions` | Version belongs to assignment |
| `sa_assignment_items` | Item references exact assignment version and exercise version/slot according to approved item model |
| `sa_assignment_targets` | Assignment version targets tenant-qualified batch and/or student |
| `sa_student_obligations` | Student-specific obligation generated from a published assignment item/target |
| `sa_attempt_cycles` | Attempt grouping for one obligation |
| `sa_evidence_events` | Append-only learner/teacher/import evidence |
| `sa_verification_decisions` | Append-only decision referencing evidence and trusted reviewer |
| `sa_correction_cycles` | Correction/resubmission lifecycle linked to obligation and prior evidence |
| `sa_doubt_cases` | Learner doubt case linked to relevant obligation/item where available |
| `sa_doubt_events` | Append-only doubt lifecycle events |
| `sa_audit_events` | Module-specific audit only if platform audit contract requires distinct module detail; avoid duplicate generic audit records |
| `sa_metric_policy_versions` | Versioned policy for derived metric calculations |

System A's full field-level schema remains subject to reconciliation with the actual 406-line proposed migration and application repository. Do not infer missing fields from this summary table.

## 5. Mandatory relational integrity

### 5.1 Tenant-qualified keys

Every tenant-owned parent table referenced by tenant-owned children must expose `UNIQUE (tenant_id,id)`. Every tenant-scoped child relationship must use a composite FK:

```sql
FOREIGN KEY (tenant_id, student_id)
  REFERENCES public.students (tenant_id, id)
```

Required examples:
- role grant → membership;
- centre-scoped role grant → centre;
- batch → centre;
- student → tenant;
- parent-student link → student;
- enrollment → student and batch;
- academic context → student and enrollment;
- System A exercise version → exercise;
- exercise slot → exercise version;
- assignment version → assignment;
- assignment item → assignment version and referenced exercise version/slot;
- assignment target → assignment version and batch/student;
- obligation → student, assignment item/target and exercise slot as applicable;
- attempt/evidence/verification/correction/doubt → obligation and their exact parent records.

A separate FK to tenant and a separate FK to parent ID do not guarantee tenant consistency.

### 5.2 Checks and uniqueness

Proposed baseline checks:
- effective intervals satisfy `valid_to IS NULL OR valid_to > valid_from`;
- centre scope requires centre ID; tenant scope forbids centre ID;
- event schema version is positive;
- student code and tenant-local identifiers are non-empty after normalization;
- dates and lifecycle state combinations are valid;
- exact version references are immutable after publication;
- idempotency keys are unique in their declared tenant/operation scope.

Do not create exclusion constraints for concurrent enrollments until the academic owner approves the exact overlap rule. Do not assume one active batch per student globally.

### 5.3 Delete behavior

- Prefer RESTRICT for academic identity, assignment, version and evidence relationships.
- Use CASCADE only for dependent draft data where deletion is explicitly permitted and cannot erase required audit/evidence.
- Published versions and recorded evidence must not be hard-deleted through ordinary application workflows.
- Tenant closure should be a lifecycle transition plus retention/anonymization process, not cascade deletion.

## 6. Versioning and evidence contracts

### 6.1 Content and assignment versioning

- Stable identity rows represent the logical exercise or assignment.
- Version rows represent immutable published content snapshots.
- Slots represent positions/identifiers within a specific exercise version.
- Assignment items select an exact content version/slot.
- Publication creates or freezes a version; edits create a new version.
- Student obligations retain the exact assignment version and item/slot context that generated them.

### 6.2 Evidence

Evidence records must distinguish:
- source type: learner report, teacher observation, system import, other approved source;
- actor/person provenance;
- obligation and attempt context;
- client occurrence time and server recorded time;
- payload schema version;
- idempotency/correlation identifiers;
- supersession/correction linkage without rewriting the original event.

Verification is a separate decision record. A correction cycle is a separate workflow. Derived metrics must be reproducible from evidence and a named metric-policy version.

### 6.3 Optional external references

QBMS question identity/version and DTE classification references are optional. Store stable external IDs and source-system/version context when present. A missing external reference must not block assignment creation, evidence capture or verification.

## 7. Authorization and RLS implementation specification

### 7.1 Identity resolution

Authorization must resolve:
`auth.uid()` → active `person_auth_identities` link → `people` → active `tenant_memberships` → active `tenant_role_grants` → resource scope and workflow rule.

A client-provided person ID, role, tenant ID, centre ID or student ID is only a requested resource selector. It is not proof of authority.

### 7.2 Policy pattern

For each exposed table, define explicit policies by operation. Do not deploy blanket policies such as `USING (auth.uid() IS NOT NULL)`.

Policy predicates must check:
- tenant ownership;
- active membership;
- active role grant;
- centre/batch/learner scope;
- resource relationship (own student, verified parent link, assigned teacher);
- action workflow and separation of duties.

UPDATE policies require both a correct `USING` predicate and `WITH CHECK` predicate, plus an applicable SELECT policy. Grants must be least-privilege and aligned with RLS.

### 7.3 Privileged functions

- Place internal helper functions in a non-exposed schema where possible.
- Review SECURITY DEFINER owner, fixed search path, grants, caller validation and privilege escalation.
- Revoke public/anon execution unless specifically required.
- Never use user-editable Auth metadata as the authoritative role store.
- Review views for security-invoker behavior and RLS bypass.
- Service-role credentials must never be shipped to browser clients.

### 7.4 Append-only protections

Evidence, verification and audit writes should be insert-only for ordinary roles. Any correction or administrative amendment is a new event with actor, reason and relationship to the original record. Database triggers may enforce immutability, but must not prevent authorized retention workflows.

## 8. Migration dependency order

The following is the proposed dependency sequence. Exact migration file boundaries are to be determined after full source reconciliation.

| Sequence | Migration unit | Dependencies | Gate |
|---|---|---|---|
| 000 | Baseline extensions, schemas, migration ledger conventions | None | Environment check |
| 010 | Tenant and person identity core | 000 | Identity model approval |
| 020 | Auth identity links and tenant memberships | 010, Supabase Auth | Identity/RLS review |
| 030 | Role grants and centres | 020 | Authorization matrix approval |
| 040 | Students and parent-student links | 010, 020, 030 | Privacy and academic approval |
| 050 | Batches, enrollments, academic context | 040 | Enrollment/context rules approved |
| 060 | Platform domain and audit event contracts | 010–050 | Event governance approval |
| 070 | System A exercises and immutable versions/slots | 010–060 | Module schema review |
| 080 | Assignments, versions, items and targets | 070 | Publication workflow review |
| 090 | Obligations and attempt cycles | 080 | Eligibility and idempotency review |
| 100 | Evidence, verification, correction and doubt | 090 | Evidence/security review |
| 110 | RLS, grants, functions, triggers and views | All tables | Security test pass |
| 120 | Indexes, query plans and operational jobs | Stable schema | Performance review |

The numbering is illustrative and must be reconciled with the repository's migration naming convention. A migration should not be split merely to match these numbers if transactional dependencies require a different boundary.

## 9. Existing migration reconciliation

Before writing SQL:
1. Fetch complete V10 migration files and enumerate every table, column, constraint, index, trigger, function, policy and grant.
2. Fetch the complete System A initial migration and enumerate the same objects.
3. Inspect all repository queries, types and repository adapters that depend on these names.
4. Produce a source-to-target mapping for every existing object and field.
5. Identify conflicting semantics, not just conflicting names.
6. Define identifier preservation and any data backfill/translation rules.
7. Verify whether any objects have been applied to any environment.
8. Re-audit the live Supabase project immediately before migration planning.
9. Resolve every blocking decision in CORE-DEC-001 through CORE-DEC-010.
10. Obtain explicit product, academic, technical and security approvals.

Do not mechanically merge migrations or retain parallel tenant/person/student/membership/batch tables.

## 10. Migration execution controls

- Use versioned SQL files committed to the approved implementation branch.
- Review generated SQL manually; AI-generated SQL is not self-approving.
- Apply first to an isolated development project with representative synthetic data.
- Capture pre-migration schema, constraints, grants, policies and row counts.
- Use transactions where PostgreSQL operation semantics permit.
- Separate operations that cannot safely run transactionally and document recovery steps.
- Run static SQL checks, migration replay tests, RLS negative tests and application integration tests.
- Record migration version, checksum, operator, environment, start/end, outcome and verification evidence.
- Never edit an already-applied migration; create a forward migration.
- Production application requires a separately approved change window and backup/restore plan.

## 11. Rollback and recovery

Database rollback is not assumed to mean dropping newly created tables.

For each migration unit, document:
- preconditions and postconditions;
- whether it is additive or data-transforming;
- backup/snapshot requirement;
- reversible operations;
- forward-fix path for irreversible changes;
- data reconciliation and integrity checks;
- application compatibility window;
- recovery owner and decision authority.

For destructive or transforming migrations, prefer expand → backfill → validate → switch reads/writes → contract. Do not drop old columns/tables in the same release that first introduces replacements. Preserve original evidence and identifiers.

## 12. Test and acceptance gates

### Schema tests
- All declared PK/FK/unique/check constraints exist.
- Cross-tenant composite FK violations fail.
- Invalid lifecycle intervals fail.
- Published version mutation is denied.
- Evidence/verification/audit mutation is denied to ordinary roles.
- Idempotent retries do not create duplicate logical effects.

### Security tests
- Anonymous access denied where not explicitly public.
- Authenticated user without identity link denied.
- No membership / inactive membership denied.
- No role / expired role denied.
- Centre-scoped actor cannot read another centre.
- Parent access requires verified, current link.
- Student cannot act on another student's obligation.
- Client cannot elevate actor, tenant, role or scope.
- Views, RPCs, Storage and background functions preserve tenant boundaries.

### Application tests
- Existing System A workflows function through the Supabase repository adapter.
- Browser localStorage is not treated as durable authoritative state.
- Offline/draft behavior, if retained, reconciles without losing source evidence.
- QBMS/DTE references may be null.
- Historical evidence remains readable under the approved historical access policy after batch transfer or role changes.

### Acceptance rule
No migration is accepted based only on successful SQL execution. Schema, security, application behavior, data integrity and operational recovery tests must all pass.

## 13. Explicit non-goals

This specification does not:
- approve or apply SQL migrations;
- approve the current V10 or System A migration as-is;
- merge PR #1 or PR #2;
- resolve branch divergence;
- authorize production deployment;
- finalize all role permissions or academic policy decisions;
- define QBMS or DTE internal schemas;
- convert System A from localStorage to Supabase;
- declare the platform production-ready.

## 14. Approval record

| Approval | Owner | Status |
|---|---|---|
| Product architecture and tenancy | Product owner | Pending |
| Academic identity/enrollment/context | Academic owner | Pending |
| Authorization/RLS/privacy | Security reviewer | Pending |
| Schema/migration lineage | Technical owner | Pending |
| System A integration | Module owner | Pending |
| Production change authorization | Authorized operator | Not requested |

**Disposition:** Draft proposal only. No SQL was applied, no Supabase object was changed, and no application code or deployment configuration was modified by this document.
