# System A — Row-Level Security Policy Specification

**Document ID:** STS-DB-RLS-002  
**Version:** 1.0.0  
**Status:** Design proposal — SQL policy approval pending  
**Date:** 2026-11-07  
**Parent:** PULSE-DATA-CORE-007; STS-DB-AUTH-002; PDB v1.0

## 1. Scope

Defines the RLS design method for shared PULSE identity extensions and System A tables. It does not provide executable policy SQL and does not assert that any policy currently exists.

## 2. Database roles and access layers

| Database principal | Intended use | Rules |
|---|---|---|
| anon | Unauthenticated public endpoints only | No System A academic data access |
| authenticated | End-user requests | Minimum grants + RLS + command-only writes where required |
| service_role | Trusted server/worker operations | Never in browser; bypass-RLS privilege treated as highly sensitive |
| migration owner | Controlled schema deployment | Not used by application |
| restricted worker role | Outbox/projection processing where supported | Narrow schema/table/function privileges |

Do not grant broad schema/table privileges to PUBLIC. Table grants and RLS are separate controls: both must permit access.

## 3. Policy construction rules

1. Enable RLS on every exposed tenant-bearing table.
2. Force RLS where appropriate so table owner behavior does not create an unintended bypass path; review owner and migration roles separately.
3. Default to no policy = deny.
4. Policies must use database-resolved actor identity, tenant membership, active grant, resource scope and lifecycle.
5. Never trust `raw_user_meta_data`, browser state or caller-supplied actor/role/scope IDs.
6. For UPDATE, define both USING and WITH CHECK.
7. Do not create UPDATE/DELETE policies for append-only evidence, decision, audit and domain-event tables.
8. Do not rely on RLS to replace composite FKs, CHECK constraints or transaction validation.
9. Use SECURITY INVOKER views when caller privileges/RLS must apply.
10. Prefer SECURITY INVOKER functions. Any SECURITY DEFINER function needs an approved exception, fixed safe search_path, fully qualified object names, strict actor derivation, explicit checks and restricted EXECUTE grants.
11. Keep privileged helper functions in a non-exposed schema (e.g. app_private); do not add it to the Data API exposed schemas.
12. Test policies as actual anon/authenticated roles, not only as postgres/table owner.

## 4. Table family policy matrix

| Table family | SELECT policy predicate | INSERT policy | UPDATE | DELETE |
|---|---|---|---|---|
| tenants | Active tenant member; only approved fields | Onboarding/admin command | Narrow admin command | Deny |
| people | Self and limited authorized directory | Trusted onboarding | Trusted profile command | Deny |
| person_auth_identities | Self-minimal or identity admin | Trusted identity-link workflow only | Trusted link/revoke workflow | Deny |
| tenant_people | Self association or delegated membership admin | Membership command | Status/effective-date command | Deny |
| tenant_role_grants | Own grants or delegated grant admin | Role-grant command only | Deny; append/revoke semantics | Deny |
| students | Student self, verified guardian projection, assigned academic scope | Enrollment/onboarding command | Narrow profile/enrollment command | Deny |
| centres/batches | Member with matching scope | Admin command | Scoped admin command | Deny |
| academic_context_epochs | Student self/history, guardian-minimal, assigned academic staff | Enrollment/context command | Prefer close/append new epoch; no historical rewrite | Deny |
| teaching_assignments | Self or delegated scope admin | Assignment command | Effective-dated command | Deny |
| parent_student_relationships | Parent self-minimal; student permitted summary; verifier | Verification workflow | Revoke/replace through event/command | Deny |
| sa_source_catalogs/editions/questions | Tenant members with source/assignment read scope | Source registration command | Metadata command before use; retire after use | Deny |
| sa_assignments | Author, assigned academic actors, target learner by lifecycle | Draft command | Draft-only through command | Deny |
| sa_assignment_versions | Author/approver/publisher and target learners according to state | Version command | Draft-only; immutable after approval/publication | Deny |
| sa_assignment_items | Same assignment/version visibility | Version command | Draft-only | Deny |
| sa_assignment_targets | Authorized author/publisher; no arbitrary roster leakage | Draft/publication command | Draft-only | Deny |
| sa_target_snapshots | Student own snapshot; scoped academic actors | Publication transaction only | Deny | Deny |
| sa_student_obligations | Student self; guardian projection; assigned staff | Publication transaction only | No direct client updates; trusted state command only | Deny |
| sa_attempt_cycles | Student own; assigned staff where needed | Attempt command | Controlled lifecycle command | Deny |
| sa_student_report_events | Student own; permitted guardian projection; assigned staff/reviewer | CMD-005 only | Deny | Deny |
| sa_teacher_observation_events | Student-visible subset only; assigned academic actors | CMD-006 only | Deny | Deny |
| sa_answer_evaluations | Affected student/guardian permitted result; assigned evaluator | CMD-008 only | Deny | Deny |
| sa_verification_decisions | Affected student/guardian permitted outcome; assigned reviewer | CMD-007 only | Deny | Deny |
| sa_correction_cycles/events | Affected student and assigned staff | Correction commands | No general update; append event | Deny |
| sa_doubt_cases/events | Affected student and assigned case staff | Doubt commands | State projection via trusted command only | Deny |
| sa_disputes/appeals | Parties and independent reviewers within scope | Dispute/appeal command | State transitions only through commands | Deny |
| sa_recognition_decisions | Affected student and assigned academic actors | Recognition command | Deny | Deny |
| sa_audit_events | Restricted audit/security grant | Trusted transaction only | Deny | Deny |
| sa_command_idempotency | Internal command execution only | Trusted command only | Restricted internal state only | Retention-controlled worker |
| sa_metric_policy_versions | Authorized academic/data policy owners | Policy command | New version, not overwrite | Deny |
| sa_projection_runs/snapshots | Authorized dashboard readers, worker | Worker only | Worker-owned projection | Rebuildable projection only |

The SELECT predicates above are category-level intent, not a substitute for table-specific policy expressions and tests.

## 5. Helper function contract

Any authorization helper must have a typed, narrow purpose:
- Resolve current person from `auth.uid()`.
- Check active tenant membership.
- Check one exact permission and scope for one resource.
- Check current verified guardian relationship for one student and purpose.
- Check whether a teacher/reviewer is assigned to the requested resource.
- Check lifecycle and separation-of-duties conditions.

Helpers must fail closed on zero or multiple identity mappings. Helpers must not accept caller-supplied actor IDs as authority. Avoid recursive RLS: privileged helper access must be explicit and independently reviewed. A SECURITY DEFINER helper must be narrowly scoped and not become a general data-access bypass.

## 6. Command-only write boundary

Direct authenticated INSERT/UPDATE/DELETE is prohibited for:
- assignment publication and obligation generation;
- student reports and teacher observations;
- answer evaluation and verification decisions;
- correction, doubt, dispute, appeal and recognition transitions;
- membership and role grants;
- audit and outbox events.

Use the approved command path. The command must derive actor from auth context and validate all linked rows in one transaction.

## 7. Views and read models

- Every exposed view must be inventoried.
- Use `WITH (security_invoker = true)` where view queries must execute with caller privileges and inherit underlying RLS.
- Views must project only fields required by the caller.
- Parent and student projections must be purpose-limited and field-minimized.
- Cohort aggregates must enforce authorized cohort scope and minimum disclosure rules where approved.
- Materialized views/projections must not be treated as source-of-truth and must be protected from direct client writes.

## 8. Error and information-disclosure rules

Unauthorized cross-tenant IDs should not disclose whether a row exists. Return a consistent not-found/denied class where disclosure risk exists. Do not return SQL errors, policy names, table names, stack traces or another tenant's identifiers to clients.

## 9. Required RLS verification

- Test every table family with anon, tenant A member, tenant B member, student, parent, teacher, reviewer and admin fixtures.
- Verify both allowed and denied SELECT/INSERT/UPDATE/DELETE.
- Verify update USING and WITH CHECK independently.
- Test role/grant revocation without JWT refresh.
- Test security-definer functions and views for privilege bypass.
- Verify direct table writes cannot bypass command invariants.
- Verify Storage buckets/objects and Realtime subscriptions separately if used for student evidence or attachments.
- Run Supabase security advisor after implementation and retain findings with commit/migration identifiers.

## 10. Release status

No SQL policies, grants, views or functions were deployed by this specification. Approval and test evidence are required before implementation.
