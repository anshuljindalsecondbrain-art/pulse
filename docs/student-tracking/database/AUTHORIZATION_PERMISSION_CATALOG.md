# System A — Authorization and Permission Catalogue

**Document ID:** STS-DB-AUTH-002  
**Version:** 1.0.0  
**Status:** Detailed proposal — product/security approval pending  
**Date:** 2026-11-07  
**Parent:** PULSE-DATA-CORE-007; PULSE-DATA-CORE-006; DEC-011

## 1. Purpose and authority

This document converts the existing role/resource model into an action-based permission catalogue. It is a design proposal, not an authorization implementation.

The existing API contract's command and query IDs remain canonical: QRY-001 through QRY-007 and CMD-001 through CMD-016. This document refines their permission requirements; it does not rename or claim those endpoints exist.

## 2. Authorization decision model

A request is allowed only when all relevant predicates are true:

1. Request is authenticated; `auth.uid()` is present.
2. Auth UID maps to exactly one active `person_auth_identities` row and canonical `people.id`.
3. Person has active `tenant_people` membership for the requested tenant.
4. Person has a non-revoked, effective `tenant_role_grants` row whose permission includes the requested action.
5. Resource is inside the grant's explicit scope and is tenant-consistent.
6. Resource lifecycle permits the action.
7. Separation-of-duties and field-purpose restrictions pass.
8. No policy, account or resource suspension blocks the action.

Missing or ambiguous identity, membership, grant, scope, relationship or lifecycle state means DENY. The client never supplies a trusted actor ID, role, membership, scope list or admin boolean.

## 3. Permission catalogue

Permission codes are stable machine identifiers; display labels and role names are not authorization primitives.

| Permission code | Meaning | Sensitive scope |
|---|---|---|
| identity.context.read | Resolve own identity and memberships | Self |
| roster.read | Read roster/profile fields | Tenant/centre/batch/student |
| roster.manage | Create/update/withdraw roster or enrolment through commands | Explicit academic scope |
| centre.read | Read centre details | Centre |
| centre.manage | Create/update/archive centre | Tenant/centre administration |
| batch.read | Read batch and roster context | Batch |
| batch.manage | Create/update/close batch | Centre/batch |
| source_catalog.read | Read registered offline module/source metadata | Tenant |
| source_catalog.manage | Register/retire source catalogue and editions | Tenant |
| source_question.select | Select existing source question references | Assignment author scope |
| assignment.read | Read assignment and version | Author/target/reviewer scope |
| assignment.create | Create assignment draft | Centre/batch/subject |
| assignment.version.create | Create a new draft version | Assignment |
| assignment.approve | Approve exact immutable version | Assigned approval scope |
| assignment.publish | Publish approved exact version and snapshot roster | Assignment + all targets |
| assignment.withdraw | Withdraw a published assignment through a reasoned transition | Assignment scope |
| evidence.submit.self | Append own student report | Own student obligation |
| observation.append | Append teacher observation | Assigned student/batch |
| completion.verify | Decide completion of exact evidence | Assigned review scope |
| answer.evaluate | Evaluate correctness of exact evidence | Assigned evaluation scope |
| correction.manage | Start/review/close correction lifecycle | Obligation/review scope |
| doubt.raise.self | Raise own doubt | Own obligation |
| doubt.raise.scoped | Raise doubt for learner in assigned scope | Student/batch |
| doubt.manage | Assign, investigate, resolve, confirm or reopen case | Assigned case scope |
| dispute.raise.self | Raise own dispute | Own obligation/decision |
| dispute.review | Decide appeal/dispute | Independent review scope |
| recognition.decide | Recognize external/prior evidence under policy | Assigned academic scope |
| diagnostics.read | Read policy-versioned cohort metrics | Centre/batch/subject |
| export.execute | Generate a scoped export | Explicit export scope |
| membership.read | Read membership metadata | Self or delegated admin |
| membership.manage | Create, suspend or revoke tenant membership | Tenant administration |
| role_grant.read | Read effective grants | Self or delegated admin |
| role_grant.manage | Grant/revoke allowed roles and scopes | Tenant administration |
| audit.read | Read restricted audit events | Explicit audit/security scope |
| platform.break_glass | Temporary support access | Platform-level, time-limited |

## 4. Role-to-permission proposal

A role is a convenient permission bundle, not a permanent hard-coded permission. Tenant policy may narrow permissions; it cannot silently grant platform privileges.

Legend: **R** read, **W** workflow/write, **A** approve/review, **—** no default grant. All entries remain subject to explicit resource scope.

| Permission family | Student | Parent | Teacher | Reviewer | Mentor | Institute admin | Platform operator |
|---|---:|---:|---:|---:|---:|---:|---:|
| Own identity context | R | R | R | R | R | R | — |
| Roster | Own R | Linked minimal R | Scoped R | Review R | Assigned R | Tenant R/W | — |
| Centre/batch administration | — | — | — | — | — | Scoped W | — |
| Offline source catalogue | — | — | Scoped R/W | Scoped R | — | Tenant R/W | — |
| Assignment draft/version | — | — | Scoped W | Scoped R | — | Configured R | — |
| Assignment approval | — | — | Only if separately granted and independent | Scoped A | — | Not implicit | — |
| Assignment publication | — | — | Only if separately granted | Only if separately granted | — | Not implicit | — |
| Own obligations/worklist | R | Linked minimal R | Assigned R | Review R | Assigned summary R | Scoped report R | — |
| Student self-report | Own W | — | — | — | — | — | — |
| Teacher observation | — | — | Scoped W | Scoped W if granted | — | — | — |
| Completion verification | Own result R | Permitted result R | Scoped A | Scoped A | — | Not implicit | — |
| Answer evaluation | Own result R | Permitted result R | Scoped W | Scoped A/W | — | Not implicit | — |
| Correction | Own W | Status R | Scoped W | Scoped A/W | Summary R | Restricted R | — |
| Doubt | Own W/R | Limited status R | Scoped W | Scoped W | Assigned W | Restricted R | — |
| Dispute/appeal | Own W/R | Limited outcome R | Involved-only if policy permits | Independent A | — | Restricted case admin | — |
| Diagnostics | Own permitted R | Linked permitted summary | Scoped R | Scoped R | Scoped R | Tenant R | — |
| Export | Own permitted export only if allowed | Linked permitted export only if allowed | — by default | — by default | — | Explicit W | — |
| Membership/role administration | — | — | — | — | — | Explicit delegated W | No routine tenant grants |
| Audit/security logs | — | — | — | — | — | Restricted | Break-glass only |

**Important:** Institute administrator does not automatically receive academic reviewer, assignment approver, answer evaluator or unrestricted export permission. These are distinct grants.

## 5. Scope model

Scope types:
- TENANT: explicit tenant-wide action; use sparingly.
- CENTRE: resources under one centre.
- BATCH: one named batch.
- STUDENT: one named student.
- SUBJECT: subject scope only when combined with an enforceable tenant/centre/batch boundary.
- RESOURCE: one assignment, doubt case, dispute or other named resource.

No scope is represented by NULL-as-global. For a tenant-wide grant, use an explicit TENANT scope code and a constrained scope_id representation. Do not permit client-provided arbitrary scope IDs.

A grant is effective only during `valid_from <= now()` and (`valid_to IS NULL OR now() < valid_to`) and where `revoked_at IS NULL`.

## 6. Separation of duties

Required default controls:
- Assignment author cannot approve the same version.
- Approver and publisher must be distinct when institute policy requires independent publication.
- Student cannot verify/evaluate own evidence.
- Teacher cannot verify their own report if they are also the learner/actor.
- Original evaluator/verifier cannot be the sole appeal reviewer.
- Role grantor cannot grant privileges beyond their own delegated grant authority.
- No user may grant themselves a higher role or broaden their own scope.

Where product policy has not yet been decided, enforce the stricter default for initial release.

## 7. Authorization evaluation order and revocation

Resolve identity → membership → permission → scope → resource state → separation of duties → execute.

Sensitive commands must read current database grants at execution time. Do not depend on role claims embedded in a long-lived JWT. Revocation must take effect on the next database authorization check.

## 8. Explicit approval items

1. Final permission-to-role bundles by institute role.
2. Whether tenant-wide permissions are allowed for academic functions.
3. Scope precedence and inheritance rules (centre → batch → student).
4. Whether author/approver/publisher separation is mandatory for all tenants.
5. Parent relationship verification and field-level access.
6. Whether mentors can view full evidence or only intervention summaries.
7. Export roles, permitted fields and approval workflow.
8. Platform break-glass approver, duration and review process.

## 9. Acceptance tests

- Membership without grant cannot perform privileged action.
- Grant without active membership cannot perform action.
- Batch-scoped teacher cannot access another batch.
- Subject grant cannot escape its tenant/centre scope.
- Admin cannot evaluate answers unless separately granted.
- Expired/revoked grant is denied without waiting for JWT refresh.
- User-supplied role/person/scope fields do not change authorization.
- Self-approval/self-verification/self-escalation is rejected.
- Cross-tenant resource IDs return a non-disclosing denial.
