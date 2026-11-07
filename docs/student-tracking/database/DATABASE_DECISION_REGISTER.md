# System A — Database Architecture Decision Register

**Document ID:** STS-DB-DECISIONS-001  
**Version:** 1.0.0  
**Status:** Active — decisions and proposals explicitly separated  
**Date:** 2026-11-07

## 1. Confirmed architecture constraints

| ID | Constraint | State | Evidence / rationale |
|---|---|---|---|
| DEC-001 | GitHub is canonical source of truth for code, documents, SQL and history | Confirmed in project governance | Repository AGENTS and PULSE documentation governance |
| DEC-002 | System A operates independently of System B/DTE tagging | Confirmed | User-provided System A specification and source reconciliation |
| DEC-003 | QBMS owns canonical question content; System A owns work assignment and evidence | Confirmed architecture boundary | System A/System B discussion |
| DEC-004 | Exercise slots must exist without a QBMS question ID | Confirmed architecture constraint | System A logical data baseline |
| DEC-005 | Published versions and academic evidence must preserve historical state | Confirmed architecture constraint | Assignment/evidence lifecycle requirements |
| DEC-006 | Report, verification, answer correctness, doubt and correction are separate dimensions | Confirmed architecture constraint | System A workflow specification |
| DEC-007 | Tenant isolation and server-side authorization are mandatory | Confirmed architecture constraint | Repository engineering constitution |
| DEC-008 | No destructive cascades that erase academic history | Confirmed architecture constraint | Repository AGENTS |
| DEC-009 | Service-role/secret credentials must never enter browser code | Confirmed security constraint | Supabase security guidance and repository rules |
| DEC-010 | Database DDL is represented by ordered reviewed migrations | Confirmed governance constraint | Repository AGENTS and Supabase runbook |

## 2. Owner decision — confirmed 2026-11-07\n\n| ID | Decision | Confirmed direction | Scope / qualification |\n|---|---|---|---|\n| DEC-011 | Shared PULSE identity for System A | **APPROVED — freeze shared PULSE identity as the permanent source of truth.** | PULSE owns tenant, person, Auth mapping, tenant association, role grants, student identity, centre, batch and effective-dated academic context. System A references these records and owns its academic work lifecycle. This approves the architecture direction, not the current preliminary SQL as production-ready. |\n\n## 3. Recommended defaults — not yet product-approved

| ID | Area | Recommended default | Why |
|---|---|---|---|
| PROP-001 | Identity | PULSE shared platform owns tenant/person/Auth mapping/student/batch/membership | Prevent duplicate identity systems |
| PROP-002 | Membership | Separate tenant membership from scoped role grants | One person can hold multiple scoped permissions |
| PROP-003 | Publication | Immutable assignment version + publication-time roster snapshot + atomic idempotent obligations | Preserves historical assignment truth |
| PROP-004 | Actor semantics | Persist student reports and teacher observations as distinct event types | Prevent misattribution |
| PROP-005 | Status vocabulary | U/C/I/D/S/P remain UI shorthand; map to separate domain dimensions | Avoid overloaded status enum |
| PROP-006 | Parent access | Authenticated verified relationship-scoped read-only access for MVP | Prevent forwarded bearer links exposing records |
| PROP-007 | Catalogue | Confirm global versus tenant-owned subject/chapter catalogue before physical FKs | Prevent cross-tenant reference errors |
| PROP-008 | Evaluation | Consider separate answer-evaluation records from completion-verification decisions | Avoid conflating distinct academic judgments |\n| PROP-009 | Permission model | Action-based permissions independent of role labels; explicit scopes and no NULL-as-global | Enables consistent RLS and least privilege |\n| PROP-010 | RLS write boundary | Direct client writes prohibited for sensitive multi-row and append-only workflows; narrow commands only | Preserves atomicity and actor provenance |\n| PROP-011 | Transaction isolation | READ COMMITTED + constraints/row locks by default; SERIALIZABLE only for proven predicate anomalies | Limits contention while preserving correctness |\n| PROP-012 | Idempotency | Unique tenant + actor + command + key; same payload replays, different payload conflicts | Prevents duplicate academic events |\n| PROP-013 | Event model | Domain events, audit events and operational logs remain distinct | Preserves evidence provenance and operational clarity |\n| PROP-014 | Function/view security | Prefer SECURITY INVOKER; narrowly reviewed SECURITY DEFINER exceptions; security-invoker views | Prevents accidental RLS bypass |

## 4. Open owner decisions

These decisions are not resolved by the uploaded documents or current live infrastructure audit. Do not infer them in SQL.

| ID | Decision required | Options / question | Consequence if left open |
|---|---|---|---|
| OPEN-001 | Canonical identity schema | Approve exact tenant/person/Auth/student/batch/enrolment table map and key types | Blocks safe foreign keys |
| OPEN-002 | Role scope | Tenant-wide, centre-scoped, batch/student scoped or combined | Blocks usable RLS |
| OPEN-003 | Publication approval | Mandatory independent approval or configurable policy | Blocks author/approver/publisher logic |
| OPEN-004 | Published amendment | Prospective amendment only or explicit obligation deltas for existing students | Blocks obligation consistency |
| OPEN-005 | Matrix actor | Student self-report, teacher observation, or mixed actions with separate event types | Blocks evidence-write contract |
| OPEN-006 | Meaning of partial state | Does P mean partial completion or partially correct answer? | Blocks status mapping |
| OPEN-007 | “Solved by Teacher” | Explanation/demonstration, answer evaluation, or independent student res solve | Blocks academic reporting semantics |
| OPEN-008 | Compatibility policy | Initial COMMON/JEE/NEET/class/subject eligibility rules | Blocks roster resolution |
| OPEN-009 | Parent relationship | Canonical guardian identity, verification and permitted fields | Blocks parent access |
| OPEN-010 | Enrolments | Can a student hold concurrent active programme/batch memberships? | Blocks membership uniqueness |
| OPEN-011 | Catalogue ownership | Global reference data, tenant catalogue, or versioned overlay | Blocks subject/chapter FK design |
| OPEN-012 | Evaluation storage | Separate answer_evaluations or purpose-specific verification decisions | Blocks final physical schema |
| OPEN-013 | Shared-core branch | Confirm canonical source branch and migration ownership before integration | Blocks merge and unified migration sequence |\n| OPEN-014 | Auth mapping physical schema | Approve provider/subject uniqueness, verified state and lifecycle for person_auth_identities | Blocks trusted actor resolution |\n| OPEN-015 | Tenant-person role model | Confirm tenant_people remains association and tenant_role_grants is separate | Blocks persisted role authorization |\n| OPEN-016 | Student tenant key | Choose direct tenant_id with composite FK or derive through tenant_people consistently | Blocks composite tenant-safe FKs |\n| OPEN-017 | Batch/centre tables | Approve canonical columns, uniqueness and status lifecycle | Blocks academic context FK |\n| OPEN-018 | Teaching assignment | Approve resource scope, effective dates and relationship to role grants | Blocks teacher authorization |\n| OPEN-019 | Permission-to-role bundles | Approve exact action permission bundles for teacher, reviewer, mentor and institute admin | Blocks final role grants and authorization tests |\n| OPEN-020 | Scope inheritance | Decide whether centre scope inherits to batches/students and how explicit denies work | Blocks deterministic resource authorization |\n| OPEN-021 | Separation of duties | Decide mandatory author/approver/publisher and evaluator/appeal reviewer separation | Blocks approval and review commands |\n| OPEN-022 | RPC vs Edge Function placement | Approve execution surface for each CMD-001–CMD-016 operation | Blocks implementation boundary |\n| OPEN-023 | Publication roster snapshot | Approve roster resolution instant, later joiners/transfers and amendment delta rules | Blocks CMD-004 exact behavior |\n| OPEN-024 | Revocation race semantics | Define whether grant revocation serializes against in-flight sensitive commands | Blocks high-assurance authorization behavior |\n| OPEN-025 | Parent field-purpose policy | Approve allowed student fields, report/evaluation visibility, exports and consent evidence | Blocks guardian read projections |\n| OPEN-026 | Audit and evidence retention | Approve retention, legal hold, privacy deletion/anonymization and actor identifier snapshots | Blocks retention jobs and privacy controls |\n| OPEN-027 | Export governance | Approve roles, fields, approval, delivery channel, signed URL lifetime and audit detail | Blocks CMD-015 |\n| OPEN-028 | Outbox delivery policy | Approve retry limits, dead-letter handling, provider idempotency and alerting | Blocks reliable asynchronous delivery |

## 5. Decision closure protocol

A decision is closed only when:
1. The question and affected entities are documented.
2. Options and consequences are presented.
3. The product owner explicitly selects an option.
4. The selected value is written with date, author and rationale.
5. The ERD, data dictionary, security matrix, API contracts and migration plan are updated.
6. Tests and acceptance criteria reflect the decision.

A recommended default is not a confirmed decision. Never record a recommendation as user approval.


## 6. Migration architecture proposal — 2026-11-07

| ID | Proposal | Status | Consequence |
|---|---|---|---|
| PROP-015 | One canonical PULSE migration stream under supabase/migrations for shared core and all domain schemas | Proposed; owner approval pending | Prevents competing histories and migration-order ambiguity |
| PROP-016 | Treat existing shared-core and System A migrations as source proposals; reconcile into a canonical migration sequence rather than merging files unchanged | Proposed | Avoids duplicate identity ownership and incompatible first migrations |
| PROP-017 | Logical migration labels M0001+ are planning identifiers; executable timestamped names are generated by Supabase CLI | Proposed | Keeps migration naming and execution ordering deterministic |
| PROP-018 | M0001 should establish shared identity and academic context only; System A workflow tables follow in later dependency-ordered migrations | Proposed | Keeps shared identity stable and domain ownership explicit |

### Additional owner decision required

| ID | Decision required | Options / question | Consequence if left open |
|---|---|---|---|
| OPEN-029 | First migration application-security boundary | (A) Internal-only foundation with no application grants until a later reviewed security migration; (B) M0001 includes a complete minimum RLS/grant/actor-resolution contract. Select one, including whether any table is exposed through the Data API. | Blocks a safe first remote migration and application connectivity |

OPEN-013 remains open: the canonical source branch and migration ownership must be explicitly confirmed before migration files are integrated. The new migration architecture documents are proposals and do not themselves close any owner decision.


## 7. M0001 owner decision package — 2026-11-07

A recommendation package is available at [M0001 Owner Decision Package](M0001_OWNER_DECISION_PACKAGE.md). It proposes defaults for OPEN-013, OPEN-014, OPEN-015, OPEN-016, OPEN-017 and OPEN-029, and provides discussion recommendations for OPEN-010 and OPEN-011. **None of these recommendations is recorded as approved.** The package creates no SQL and authorizes no remote DDL.


## 8. Owner-approved M0001 decisions — 2026-11-07

**Approval evidence:** User explicitly approved all six recommendations in the M0001 Owner Decision Package with the instruction "Approve all six." This approval closes the six decisions below. It does not authorize remote DDL, deployment, PR merge or production release.

| ID | Approved decision | Recorded disposition |
|---|---|---|
| OPEN-013 | `main` is the eventual canonical integration branch. The current documentation branch remains a proposal/work branch. Reconcile shared-core and System A designs into one reviewed migration history; do not merge preliminary migration files unchanged. | **CLOSED — approved** |
| OPEN-014 | Use dedicated `person_auth_identities`; map trusted Supabase Auth UUID subject to canonical `people.id`; enforce unique Auth subject; email and user-editable metadata are not actor identity/authorization sources; multiple Auth identities per person only through audited trusted linking. | **CLOSED — approved** |
| OPEN-015 | Separate tenant association from scoped role grants. | **CLOSED — approved; physical association table name superseded by DEC-012** |
| OPEN-016 | Tenant-safe student identity and composite references. | **CLOSED — approved; student-to-membership FK superseded by DEC-012** |
| OPEN-017 | Add canonical shared `centres` and `batches`, each tenant-owned. Batch may reference a same-tenant centre; nullable centre only where tenant-wide batches are allowed. Use tenant-scoped uniqueness and archive/deactivate referenced records. | **CLOSED — approved** |
| OPEN-029 | Select Option A: internal-only identity foundation. No grants to `anon` or `authenticated`, and no Data API exposure before a later reviewed security migration. Later exposure requires complete grants, RLS, actor resolution and tests. | **CLOSED — approved** |

### Implementation qualifications

1. Supabase Auth is the selected initial identity subject source. The schema may retain a provider namespace for forward compatibility, but only the Supabase Auth UUID integration is in the initial implementation scope.
2. Account linking/unlinking is a trusted server-side operation; no self-service metadata claim can reassign a person identity.
3. OPEN-010 remains open. M0001 must not introduce a uniqueness/exclusion rule that assumes one active batch/programme per student. Preserve context history and defer overlap/primary-context policy until the owner decides.
4. OPEN-011 remains open. M0001 must not create a subject/chapter catalogue or add foreign keys to an unapproved catalogue. Catalogue references are deferred.
5. OPEN-018 remains open and teaching assignments are deferred to M0003.
6. OPEN-019 through OPEN-028 remain open. No application role grants or application-facing RLS policy set is authorized by this approval; this is consistent with the approved internal-only M0001 boundary.

The approved decisions supersede the earlier "open" status rows and the prior statement that none of the package recommendations had been approved.


## 9. Branch/schema reconciliation decisions — 2026-11-07

The newer `feat/system-a-abhyas-foundation` canonical core proposal was compared with the owner-approved M0001 decisions on `docs/system-a-database-governance`. The complete evidence and recommendations are recorded in [Branch and Shared-Core Schema Reconciliation](BRANCH_AND_SCHEMA_RECONCILIATION_2026-11-07.md).

| ID | Decision required | Options / recommended direction | Status |
|---|---|---|---|
| RECON-001 | Canonical membership table name | Adopt `tenant_memberships` as the canonical tenant association table; map/migrate legacy `tenant_people` as a source representation only. | **CLOSED — approved by DEC-012** |
| RECON-002 | Student-to-membership cardinality | Students are tenant-owned records with explicit `tenant_id` and optional `person_id`; student identity does not require a tenant membership. Membership remains an independent association. | **CLOSED — approved by DEC-012** |
| RECON-003 | Academic context relationship | Add explicit effective-dated `enrollments` linking tenant-owned students to batches; `academic_context_epochs` reference enrollment. | **CLOSED — approved by DEC-012** |
| RECON-004 | Concurrent active enrollment policy | D-001 records product direction to allow concurrent enrollments but is marked BLOCKED pending Academic Owner approval. Confirm the Academic Owner approval before adding interval overlap constraints or active-context rules. | BLOCKED — Academic Owner approval pending |

These questions must be resolved before M0001 executable SQL is authored. Existing approvals OPEN-013/014/015/016/017/029 remain recorded; RECON-001/002 propose material refinements and must not be treated as silently approved. OPEN-010 remains open until RECON-004 is formally closed.


## 10. Owner-approved physical identity refinement — DEC-012 — 2026-11-07

**Approval evidence:** The owner explicitly selected Option B: supersede the earlier physical student/membership relationship with `tenant_memberships`, tenant-owned students with optional `person_id`, and explicit `enrollments`.

| ID | Decision | Approved canonical direction | Disposition |
|---|---|---|---|
| DEC-012 | Physical student, membership and enrollment model | `tenant_memberships` is the canonical tenant association. `students` is tenant-owned through `tenant_id`, with nullable `person_id`; it does not require a membership. `enrollments` explicitly connects a student to a batch over an effective interval. `academic_context_epochs` reference enrollment rather than carrying an independent direct batch relationship. | **APPROVED** |

### Required interpretation and invariants

1. DEC-012 supersedes only the physical relationship choices in the earlier OPEN-015/OPEN-016 implementation details and RECON-001/002/003. It does not reverse the approved separation of tenant association from role grants.
2. `tenant_memberships` records the association of a person with a tenant. Membership does not imply a role; `tenant_role_grants` remains a separate, effective-dated, scoped authorization model.
3. `students.tenant_id` is mandatory. `students.person_id` is optional and, when present, must reference a canonical person. A student may exist without a linked person or tenant membership.
4. Enforce tenant-safe references with composite keys, including student-to-enrollment and enrollment-to-batch relationships.
5. `enrollments` is the explicit student-to-batch academic relationship and carries the effective lifecycle needed for transfer/history. Context epochs reference an enrollment and preserve valid-time history.
6. No System A-local identity authority is introduced. System A references canonical PULSE identities and owns only its workflow domain.
7. All other approved decisions remain unchanged: DEC-011, OPEN-013, OPEN-014, OPEN-017 and OPEN-029, including internal-only M0001 and the prohibition on application grants/Data API exposure in M0001.
8. The prior OPEN-015 and OPEN-016 approval records remain as historical approval evidence, but their physical table/key implementation is superseded by DEC-012. Their surviving policy intent (separate membership and role grants; tenant-safe student keys) remains binding.
9. RECON-004 and OPEN-010 remain unresolved: DEC-012 does not decide whether multiple concurrent active enrollments are permitted, nor does it authorize overlap/one-active-enrollment constraints. D-001 remains blocked pending Academic Owner approval.
10. DEC-012 authorizes updating design documentation and preparing a revised local migration candidate. It does not authorize remote DDL, migration deployment, PR merge or production release.

### Reconciliation status

- RECON-001: **CLOSED — DEC-012**
- RECON-002: **CLOSED — DEC-012**
- RECON-003: **CLOSED — DEC-012**
- RECON-004: **BLOCKED — Academic Owner approval pending**
