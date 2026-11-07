# System A — Command and RPC Catalogue

**Document ID:** STS-DB-CMD-002  
**Version:** 1.0.0  
**Status:** Detailed proposal — API/security approval pending  
**Date:** 2026-11-07  
**Parent:** PULSE-DATA-CORE-006 and PULSE-DATA-CORE-007

## 1. Contract authority

The IDs and operation names below are retained from the existing PULSE System A Application Service and API Contract. This catalogue aligns those commands to the physical source-question model: teacher selects existing offline-module question references; System A does not author canonical question content.

No RPC, Edge Function or endpoint is asserted to exist. Final placement (PostgreSQL RPC vs trusted server/Edge Function) remains a technical decision per command.

## 2. Shared command envelope

```ts
type CommandEnvelope<T> = {
  requestId: string;
  tenantId: string;
  idempotencyKey: string;
  expectedVersion?: number;
  payload: T;
};
```

The envelope MUST NOT contain trusted `actorId`, `actorRole`, `membershipId`, `isAdmin` or authorization scope. Actor identity and grants are resolved from validated auth context and database records. Tenant selector is a requested context, not proof of membership.

Response envelope:
- command result ID;
- outcome: CREATED / UPDATED / IDEMPOTENT_REPLAY / DECIDED;
- server timestamp;
- aggregate and version IDs where applicable;
- request/correlation ID;
- minimal typed projection.

## 3. Query catalogue

| ID | Query | Authorization | Result constraints |
|---|---|---|---|
| QRY-001 | Resolve my tenant memberships and role grants | Auth identity + self | Only caller's active/effective contexts |
| QRY-002 | Load authorized roster by batch/centre | roster.read + exact scope | No cross-scope roster leakage |
| QRY-003 | Load learner's own worklist | Student identity = obligation student | Own eligible obligations and allowed projections |
| QRY-004 | Load verified linked learner worklist | Active verified parent link + field purpose | Only linked learner and permitted fields |
| QRY-005 | Load teacher verification queue | completion.verify + assigned review scope | Exact submitted reports awaiting review |
| QRY-006 | Load doubt work queue | doubt.manage + assigned case scope | Only assigned/authorized cases |
| QRY-007 | Load cohort diagnostics | diagnostics.read + cohort scope | Policy version, denominator, as-of and freshness |

Read queries may use RLS-protected tables/views or narrow read functions. Query results must use server-side pagination, bounded filters and minimal columns.

## 4. Command catalogue

| ID | Command | Principal permission | Atomicity |
|---|---|---|---|
| CMD-001 | Create assignment draft | assignment.create | Assignment + first draft version |
| CMD-002 | Create new assignment version | assignment.version.create | Version + item/target draft set |
| CMD-003 | Approve exact assignment version | assignment.approve | Approval decision + audit |
| CMD-004 | Publish assignment | assignment.publish | Publication + roster snapshot + obligations + audit + outbox |
| CMD-005 | Append learner self-report | evidence.submit.self | Evidence + projection pointer + audit |
| CMD-006 | Append teacher observation | observation.append | Observation + audit |
| CMD-007 | Verify completion evidence | completion.verify | Verification decision + audit |
| CMD-008 | Evaluate answer correctness | answer.evaluate | Evaluation decision + audit |
| CMD-009 | Start correction cycle | correction.manage | Correction cycle + event + audit |
| CMD-010 | Submit correction | evidence.submit.self + valid correction | New evidence + correction event + audit |
| CMD-011 | Review correction | correction.manage | Decision/event + audit |
| CMD-012 | Close accepted correction | correction.manage | Closure event + projection + audit |
| CMD-013 | Raise doubt | doubt.raise.self or doubt.raise.scoped | Case + first event + audit |
| CMD-014 | Assign/start/resolve/confirm/reopen doubt | doubt.manage | Event + state projection + audit |
| CMD-015 | Export authorized matrix | export.execute | Export job/request + audit |
| CMD-016 | Manage membership/role grants | membership.manage / role_grant.manage | Membership/grant history + audit |

## 5. Assignment commands

### CMD-001 — Create draft
Inputs: tenant selector, title, assignment kind, source catalogue/edition/question references, schedule, timezone, selected batch/student targets, idempotency key.

Validation:
- active assignment.create grant;
- source question references exist, are selectable and tenant-valid;
- question references are unique within the assignment version unless duplicate placement is explicitly allowed;
- targets belong to tenant and actor scope;
- release/due schedule is valid;
- version number is server-generated.

Writes: assignment aggregate, version 1 draft, selected source-question items, target selectors, audit event and idempotency record.

### CMD-002 — Create new version
Inputs: assignment ID, expected current version, changed content/selected question references/targets, reason, idempotency key.

Validation: author scope; optimistic concurrency; prior version retained; new version number generated; only draft copy can be changed. Published version is never mutated.

### CMD-003 — Approve
Inputs: exact assignment version ID, decision, rationale, idempotency key.

Validation: assignment.approve; exact version is approvable; reviewer scope; author/approver separation; decision not already superseded. Writes append-only approval decision and audit.

### CMD-004 — Publish
Inputs: exact approved version ID, target snapshot policy identifier, expected version, idempotency key.

Validation: assignment.publish; exact approved version; current grant and target scope; target roster rules; timezone/schedule; no duplicate publication. Atomic writes: publication state, resolved target snapshots, one student obligation per assignment item × eligible student, audit/domain event, transactional outbox, idempotency result. All commit or all roll back.

## 6. Evidence and review commands

### CMD-005 — Append learner self-report
Inputs: obligation ID, optional attempt cycle ID, reported state, remark/evidence metadata, client occurred_at, idempotency key.

Actor derives from auth.uid() → person → student. Validate own obligation, active eligibility, reportable state, same-tenant source/assignment context and attempt ownership. Append only; no teacher verification or answer correctness is implied.

### CMD-006 — Append teacher observation
Inputs: obligation ID, observation code/body, optional linked report, idempotency key.

Requires observation.append and current teaching/review scope. Actor is server-derived. Writes a separate teacher observation event; never impersonates the student.

### CMD-007 — Verify completion
Inputs: obligation ID, exact report event ID, outcome, reason, supersedes decision ID if applicable, idempotency key.

Requires completion.verify; exact evidence and obligation must match; reviewer must be scoped; no self-verification where policy applies. Append decision only.

### CMD-008 — Evaluate answer
Inputs: obligation ID, exact report event ID, CORRECT/INCORRECT/PARTIALLY_CORRECT, marks/rationale, idempotency key.

Requires answer.evaluate. Validate marks against exact max-mark snapshot. Append separate evaluation; does not imply completion.

## 7. Correction commands

- CMD-009 starts only from exact eligible RETURNED decision.
- CMD-010 appends a new report linked to the correction cycle and original obligation; it does not mutate old evidence or create a new practice cycle.
- CMD-011 appends a review decision against exact correction evidence.
- CMD-012 closes only when latest correction decision is accepted.

All commands validate same tenant, student, obligation, report and decision chain. Each records actor, reason, predecessor, server time and idempotency key.

## 8. Doubt commands

- CMD-013 creates a doubt against own eligible obligation or scoped teacher observation.
- CMD-014 supports assign, start, resolve, student-confirm and reopen transitions.
- Every transition appends an event; state projection is updated in same transaction.
- Resolution requires explanation/rationale.
- Cohort-level response must create explicit per-student transitions; one response must not close unrelated cases.

## 9. Export and membership commands

CMD-015 requires explicit export.execute, validates tenant/centre/batch/student scope server-side, minimizes fields, applies CSV formula-injection protection, records filters/purpose/row count/requester and returns controlled job/download reference. Parent/student export is self/verified-link only.

CMD-016 is split logically into membership association and role-grant lifecycle. It requires delegated grant authority, prevents self-escalation, validates tenant-owned scope, writes effective-dated grants/revocations and audit. No hard deletion.

## 10. Error contract

| Code | Meaning |
|---|---|
| AUTH_REQUIRED | No valid authenticated request |
| IDENTITY_UNRESOLVED | Auth UID lacks exactly one active person link |
| TENANT_ACCESS_DENIED | No active membership |
| SCOPE_DENIED | Permission exists but requested resource is out of scope |
| RESOURCE_NOT_FOUND | Resource absent or intentionally hidden |
| INVALID_STATE | Lifecycle transition invalid |
| VERSION_CONFLICT | Expected aggregate version stale |
| IDEMPOTENCY_CONFLICT | Same key, different normalized payload |
| VALIDATION_FAILED | Input or relationship invalid |
| SEPARATION_OF_DUTIES | Actor cannot approve/review own work |
| RATE_LIMITED | Rate policy exceeded |
| TEMPORARY_FAILURE | Retry same idempotency key |
| INTERNAL_ERROR | Correlation ID only; no internal SQL details |

## 11. Placement decision pending

Each command must be assigned to one execution surface:
- PostgreSQL RPC for atomic data mutation where transaction locality is essential;
- trusted server/Edge Function for orchestration, external services, file handling or policy checks not suitable for SQL;
- asynchronous worker for outbox delivery, export generation and projections.

No command should be split across client-side independent writes when its invariants require atomicity.
