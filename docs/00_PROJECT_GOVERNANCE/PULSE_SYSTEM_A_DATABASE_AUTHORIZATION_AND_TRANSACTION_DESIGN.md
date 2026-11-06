# PULSE — System A Database Authorization and Transaction Design

- Document ID: PULSE-DATA-CORE-007
- Version: 0.1.0
- Status: Draft — product, technical and security approval pending
- Date: 2026-11-06
- Parent: PULSE-DATA-CORE-001 through PULSE-DATA-CORE-006
- Implementation, SQL and live database authorization: Not granted

## 1. Purpose and boundary

Define the PostgreSQL authorization model and atomic transaction contracts for System A before SQL implementation. This is a design artifact only. It creates no code, SQL, policies, functions, grants, migrations or database changes. Neither existing V10 nor System A migration is approved for application.

**Security principle:** deny by default. Access requires validated identity, active tenant membership, an explicit action permission and matching resource scope. A valid Supabase session alone grants no academic-data access.

## 2. Non-negotiable security invariants

1. Every tenant-owned record has a tenant boundary or is reachable only through a tenant-qualified parent.
2. Supabase Auth UID authenticates a principal; it is not the business actor ID. Resolve UID to exactly one canonical person.
3. A client-supplied tenant selector is not proof of membership.
4. Membership and role grants are separate records. Membership establishes tenant association; grants establish actions and scope.
5. Never trust browser-supplied person IDs, actor roles, centre/batch/student scope arrays, admin flags or authorization claims.
6. Recheck authorization in PostgreSQL at each sensitive query and command.
7. Student access is limited to the authenticated student's own canonical identity.
8. Parent access requires a currently verified, active parent-student link and a field/purpose-specific policy.
9. Teacher/reviewer access requires explicit current assignment scope.
10. Evidence, observations, verification, evaluation, correction, doubt and audit history are append-only.
11. Assignment publication and obligation creation are one transaction: all commit or all roll back.
12. All retriable writes have database-enforced idempotency and request fingerprint checks.
13. Cross-tenant resource existence must not be disclosed by errors.
14. No service-role or secret key is shipped to browser code.
15. Views, functions, triggers, exports and storage objects are authorization surfaces and require separate review.

## 3. Canonical identity and authorization resolution

The trusted database context is resolved in this order:

1. Read auth.uid() from the validated request context.
2. Resolve exactly one active Auth-identity link.
3. Resolve the canonical person.
4. Resolve the requested tenant only if an active membership exists.
5. Resolve active role grants for the requested action.
6. Resolve centre, batch, student and resource assignments.
7. Execute only if all predicates succeed.

Any missing, ambiguous, revoked or out-of-period link/grant denies access. Never accept a client-provided person ID as a fallback.

### Logical entities

| Entity | Responsibility |
|---|---|
| Person | Canonical human/business actor |
| Person–Auth identity link | Auth UID to person mapping |
| Tenant | Institute/organization isolation boundary |
| Tenant membership | Effective-dated person-to-tenant association |
| Tenant role grant | Action permission, scope, grantor and validity |
| Centre | Optional narrower organizational scope |
| Student | Tenant-owned learner identity |
| Parent-student link | Verified, revocable guardian relationship |
| Batch/enrollment | Time-bound academic scope |
| Resource assignment | Teacher/reviewer-to-resource scope |
| Policy version | Versioned authorization/academic policy |

Membership answers whether a person belongs to a tenant. A role grant answers which actions they may perform and over which resources. A role grant must reference a membership in the same tenant. Missing scope must never mean tenant-wide scope. Revocation must affect the next database authorization check, independent of JWT refresh.

## 4. Authorization predicates

The following are logical contracts, not executable SQL.

- Authenticated actor: auth.uid() is non-null and maps to exactly one active person identity.
- Active membership: person has an active, effective membership in the requested tenant.
- Tenant permission: active membership plus an active grant for the exact action and requested resource scope.
- Student access: student belongs to tenant and actor is the student, a verified guardian with permitted purpose/fields, or assigned academic staff with the relevant permission.
- Resource access: resource belongs to tenant, all parent/child relationships are tenant-consistent, actor has the exact action and scope, and lifecycle state permits the operation.

Do not use raw_user_meta_data or other user-editable JWT metadata for authorization. Do not rely on stale JWT role claims where immediate revocation is required. Database-resolved grants are authoritative.

## 5. Resource scope model

| Actor family | Default scope | Additional rule |
|---|---|---|
| Student | Own student identity and own obligations/evidence | Auth identity must resolve to that student |
| Parent/guardian | Verified linked students only | Field- and purpose-specific access |
| Teacher | Assigned centre/batch/student resources | Active teaching grant and current assignment |
| Reviewer | Assigned review resources | Review grant and separation-of-duties |
| Institute administrator | Tenant administration resources | Explicit admin permission; no automatic unrestricted content access |
| Assignment author | Assigned content and target scope | Authoring grant |
| Publisher | Approved assignment versions within scope | Publish grant and approved exact version |
| Platform operator | No routine academic row access | Break-glass only, time-limited and audited |

Permission names should be action-based, independent of role labels. Candidate permissions: roster.read, assignment.create, assignment.approve, assignment.publish, evidence.submit.self, observation.append, completion.verify, answer.evaluate, correction.manage, doubt.manage, diagnostics.read, export.execute, membership.manage and role_grant.manage. Final mapping requires product approval.

## 6. RLS and grants policy matrix

This is the mandatory baseline. Every physical table must be mapped to a category and reviewed individually before SQL is authored.

| Table category | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| Tenant/settings | Active members, permitted fields | Onboarding command | Tenant-admin command | Prohibited through app roles |
| Person/Auth links | Self and restricted identity administration | Trusted onboarding only | Trusted identity administration | Prohibited through app roles |
| Memberships | Self; authorized tenant administrators | Admin command | Audited admin command | Prohibited; revoke/effective-date |
| Role grants | Own effective grants; authorized grant admins | Grant command | Revoke/replace with history | Prohibited |
| Centres | Members with matching centre scope | Centre-admin command | Scoped centre-admin command | Prohibited; deactivate/archive |
| Students | Self, guardian-limited view, assigned staff | Enrollment/onboarding command | Narrow profile/enrollment command | Prohibited; archive/withdraw |
| Parent links | Limited relationship view and authorized verifier | Verification workflow | Verification/revocation workflow | Prohibited; append revocation |
| Subjects/catalogue | Authorized catalogue readers | Catalogue workflow | Versioned catalogue workflow | Prohibited; retire/version |
| Batches/enrollments | Assigned staff; own permitted learner/parent view | Roster command | Scoped roster command | Prohibited; withdraw/close |
| Assignments/versions | Authorized authors, approvers, publishers and target learners per lifecycle | Draft command | Draft-only before approval | Prohibited; archive/withdraw |
| Targets/obligations | Authorized staff; learner/guardian own permitted rows | Publication transaction only | Narrow lifecycle command | Prohibited |
| Attempt cycles | Learner own; assigned reviewer as needed | Trusted command | Controlled transition only | Prohibited |
| Evidence/observations | Learner own; assigned reviewer; guardian-limited projection | Specific append command | Prohibited | Prohibited |
| Verification/evaluation decisions | Learner/guardian permitted projection; assigned reviewer | Decision command only | Prohibited; append superseding decision | Prohibited |
| Correction/doubt records | Affected learner and assigned staff | Workflow command | Projection transition only | Prohibited |
| Audit/domain events | Restricted audit readers | Trusted transaction only | Prohibited | Prohibited |
| Idempotency records | Internal command execution only | Trusted command only | No client mutation | Prohibited |
| Outbox/delivery | Internal worker/service only | Originating transaction | Worker-owned delivery state | Retention-controlled only |
| Read-model views | Same scope as source, minimized fields | N/A | N/A | N/A |

### RLS construction requirements

- Enable and force RLS on every tenant-bearing table in exposed schemas.
- Revoke broad PUBLIC privileges; grant only minimum required table/view/function privileges.
- TO authenticated is not authorization. Every policy needs tenant and resource predicates.
- UPDATE policies require both USING and WITH CHECK. Immutable event tables have no UPDATE policy.
- Do not allow direct client writes where actor, tenant, role, timestamps, lifecycle transitions or related rows must be server-derived.
- Use narrow RPC commands for multi-row and actor-sensitive writes; never expose generic SQL execution.
- Review every view for RLS behavior. On PostgreSQL 15+, use security_invoker where appropriate; otherwise keep sensitive views unexposed or revoke client access.
- Prefer SECURITY INVOKER. SECURITY DEFINER requires a documented exception, fixed safe search_path, fully qualified references, explicit auth.uid() and scope checks, least-privileged owner, restricted EXECUTE grants, PUBLIC revocation and independent review.
- Keep privileged helpers in a non-exposed schema such as app_private.
- Avoid recursive RLS and SECURITY DEFINER shortcuts that silently bypass row controls.
- RLS is not referential integrity: enforce tenant consistency with composite foreign keys and database constraints.

## 7. Command privilege model

Simple reads may use authenticated PostgREST only when RLS, column exposure, joins, pagination and query plans are reviewed. Complex queues/diagnostics should use narrowly scoped views or read functions.

The following must be transactional commands, not independent browser writes:
- assignment approval/publication and obligation generation;
- learner evidence submission and attempt-cycle checks;
- teacher observation;
- completion verification and answer evaluation;
- correction and doubt transitions;
- membership and role-grant administration;
- audited export-job creation.

Every command must derive actor from auth.uid(), resolve person/membership/permission/scope, validate lifecycle and expected version, enforce tenant-qualified references and idempotency, write immutable facts plus required audit events, update only permitted projections, and return a minimal typed result.

Never accept actor_id, actor_role, membership_id, is_admin or client-supplied scope as trusted command inputs.

## 8. Transaction A — assignment publication

**Atomicity:** publication record, immutable target snapshot, student obligations, publication state, audit/domain event and outbox event either all commit or all roll back.

Preconditions:
- authenticated, identity-resolved publisher;
- active membership and publish permission;
- publisher scope covers assignment and every target;
- exact assignment version is approved and publishable;
- approval references that exact version;
- separation-of-duties satisfied;
- targets and roster belong to the same tenant;
- schedule/timezone valid;
- idempotency key new or identical replay.

Transaction sequence:
1. Begin transaction and resolve actor, tenant, grant and scope from database state.
2. Lock assignment aggregate/version to serialize concurrent publication.
3. Validate status, approval provenance and expected version.
4. Resolve authoritative roster under the approved publication-time snapshot rule.
5. Validate each target's tenant, enrollment, centre/batch scope and eligibility.
6. Insert immutable publication and target snapshot.
7. Insert one obligation per eligible student and applicable slot with deterministic uniqueness.
8. Update only current publication pointer/status.
9. Insert audit/domain and transactional outbox events.
10. Store idempotency fingerprint and result.
11. Commit.

Same key plus same normalized payload returns the original result. Same key plus different payload is rejected. Any failure rolls back all publication records. Notifications are asynchronous from the outbox after commit.

**Open product decision:** default recommendation is immutable publication-time target snapshot; later roster changes require an explicit amendment workflow, not silent retroactive obligation changes.

## 9. Transaction B — learner evidence submission

Preconditions: authenticated actor resolves to student; obligation belongs to that student and tenant; assignment version/slot match; obligation is reportable; attempt cycle belongs to the same student/obligation/tenant; payload is permitted; idempotency key is valid.

Transaction:
1. Resolve actor/person/student from auth context.
2. Lock or consistently validate obligation and attempt cycle.
3. Validate tenant, ownership, slot/version and lifecycle.
4. Append immutable learner evidence with server timestamp and actor provenance.
5. Update only permitted attempt/worklist projection state.
6. Insert audit/domain event and idempotency result.
7. Commit.

This command must not create teacher verification or answer evaluation. Self-report, teacher observation, completion verification and answer correctness are distinct facts.

## 10. Transaction C — teacher observation and review

- Teacher observation requires active grant and assigned centre/batch/student scope; append TEACHER_OBSERVATION attributed to authenticated person; never overwrite or impersonate learner evidence.
- Completion verification references exact evidence and obligation, requires reviewer scope, enforces no-self-verification where configured, and appends a decision with reason and supersession reference.
- Answer evaluation uses separate evaluator permission and appends CORRECT, INCORRECT or PARTIALLY_CORRECT against exact evidence/slot. It does not imply completion.
- None of these operations updates or deletes original evidence.

## 11. Transaction D — correction and doubt

Correction starts only from a specific eligible RETURNED decision; remains linked to original evidence, attempt cycle, obligation and slot; resubmission creates new evidence; review appends decisions; closure occurs only after latest correction is accepted.

Doubt may be raised by a student only against their own eligible obligation. Staff manage only in scope. Resolution requires explanation; student confirmation is separate; reopening appends an event. Cohort actions expand to individual case transitions and cannot silently close all cases.

## 12. Transaction E — membership and role administration

- Grantor has explicit permission to administer the target membership/grant.
- Grant references a membership in the same tenant.
- Prevent self-escalation and unauthorized institute-admin/platform-admin grants.
- Scope references valid tenant-owned resources.
- Grant and revocation are effective-dated and audited.
- Historical events retain original actor/grant provenance.
- Do not hard-delete memberships/grants referenced by history.

## 13. Append-only, audit and idempotency

Evidence, observations, verification/evaluation decisions, correction/doubt events, role-grant history and audit events are immutable after insertion. Protect them through absent application UPDATE/DELETE grants, absent RLS mutation policies and a database trigger as defense in depth. Corrections/supersession create linked new records.

Each idempotency record stores tenant, command/version, key, actor/person, normalized request fingerprint, result IDs, server timestamp and outcome. Recommended unique scope: tenant + actor + command + key. Fingerprint mismatch returns IDEMPOTENCY_CONFLICT.

Keep distinct:
- domain events: academic/business facts;
- audit events: actor, operation, authorization context, time and request;
- operational logs: infrastructure/runtime diagnostics.

## 14. Cross-tenant integrity and escalation tests

Tenant-owned relationships require composite tenant-qualified foreign keys, not merely independent single-column FKs. Apply to assignment/version/slot/target/obligation/attempt/evidence/decision/correction/doubt relationships. Validate centre/batch/student consistency at transaction time. Global catalogue references must be explicitly classified and versioned.

Required negative tests:
- tenant A member requests tenant B roster;
- teacher submits evidence for another tenant's student;
- student submits against another student's obligation;
- parent accesses unverified/revoked link;
- teacher with batch X accesses batch Y;
- reviewer verifies own evidence;
- author approves/publishes own work where prohibited;
- member attempts role escalation or scope expansion;
- client supplies a different actor/person/role;
- stale JWT after role revocation invokes a sensitive command;
- cross-tenant child reference is supplied through RPC;
- anon/unauthenticated user invokes privileged function;
- direct table write bypasses command invariants.

All must be denied without leaking unauthorized resource existence.

## 15. Test strategy and release gates

Test layers:
1. Pure permission/scope/lifecycle predicate tests.
2. Migration replay in disposable PostgreSQL/Supabase.
3. RLS tests using actual anon/authenticated roles and representative JWTs.
4. RPC tests for authenticated and unauthenticated contexts.
5. Cross-tenant and privilege-escalation negative tests.
6. Concurrency tests for duplicate publication, evidence and idempotency replay.
7. Append-only tests for direct UPDATE/DELETE.
8. View/function privilege tests, including PUBLIC EXECUTE and view RLS behavior.
9. UI service integration and error-taxonomy tests.
10. Audit provenance and immutability tests.

Mandatory release gates:
- canonical schema and tenant-qualified FK review approved;
- permission catalogue and role mapping approved;
- parent verification/field access policy approved;
- separation-of-duties approved;
- all physical tables mapped to RLS/grant matrix;
- all exposed views/functions reviewed;
- cross-tenant and escalation tests pass in isolation;
- transaction/idempotency concurrency tests pass;
- migration replay and recovery plan reviewed;
- Supabase advisors reviewed after implementation;
- independent security review completed;
- explicit owner approval before live migration or production activation.

Use synthetic tenants and learners only in tests.

## 16. Unresolved product/security decisions

| Decision | Proposed default | Owner |
|---|---|---|
| Permission granularity | Action-based, independent of role labels | Product |
| Grant scope | Explicit tenant/centre/batch/student/resource; no implicit global scope | Product + Security |
| Parent verification | Verified, revocable link with field/purpose rules | Product + Legal/Privacy |
| Separation of duties | No self-verification; author/approver separation where configured | Academic governance |
| Admin access to learner work | Explicit permission and audited purpose | Product + Privacy |
| Publication roster semantics | Immutable publication-time snapshot; later amendment workflow | Academic operations |
| Event retention/erasure | Append-only default; legal exception separately governed | Legal/Privacy |
| SECURITY DEFINER | Deny by default; individually reviewed | Security |
| Global catalogue | Explicit global-vs-tenant ownership and versioned references | Architecture |
| Break-glass access | Time-limited, approved, purpose-bound and audited | Security + Operations |

## 17. Implementation sequence after approval

1. Freeze canonical identity, tenant, membership, role-grant and scope schema.
2. Map every physical table/column to this policy matrix.
3. Design and review identity-resolution and authorization helpers.
4. Design minimum grants and table/view RLS policies.
5. Design narrow command functions and transactions.
6. Implement in a disposable environment only after separate authorization.
7. Add SQL replay, RLS, RPC, concurrency and escalation tests.
8. Reconcile repository adapter with canonical tenant/person/role model.
9. Integrate UI through approved query/command services.
10. Obtain independent security review and explicit live-deployment authorization.

**Disposition:** Stage 7 design draft prepared. No SQL, application code, schema, RLS policy, function, grant, migration, branch, PR or deployment was changed by this document. Live Supabase remains outside this implementation scope.
